<template>
  <div class="confirm">
    <div class="header">
      <van-icon @click="back" name="arrow-left" />
    </div>
    <div class="title">
      <h2>确认助记词</h2>
      <p>请按顺序点击助记词，以确认您正确备份。</p>
    </div>
    <p class="error-msg">{{errorMsg}}</p>
    <ul class="confirm-words">
      <li v-for="(item, index) in confirmWords" :key="index" @click="confirmWordsClick(item, index)">{{item.item}}</li>
    </ul>
    <ul class="words">
      <li v-for="(item, index) in words" :key="index" @click="wordsClick(index)">{{item}}</li>
    </ul>
    <div class="button">
      <button class="btn" @click="complete">完成</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { userLogin, getBalance } from '@/api/create'
import { sendSignData } from '@/api/sign'
export default {
  data () {
    return {
      errorMsg: '',
      orginWords: [],
      confirmWords: [],
      words: []
    }
  },
  created () {
    // 回车事件
    document.onkeyup = (e) => {
      let key = window.event.keyCode
      if (key === 13) {
        this.complete()
      }
    }
  },
  mounted () {
    let words = this.$route.params.mnemonic || []
    this.orginWords = [...words]
    this.words = this.disorde(words)
  },
  methods: {
    // 下面助记词点击
    wordsClick (i) {
      let delItem = this.words.splice(i, 1)
      this.confirmWords.push({ index: i, item: delItem[0] })
    },
    // 上面助记词点击
    confirmWordsClick (val, i) {
      this.confirmWords.splice(i, 1)
      this.words.splice(val.index, 0, val.item)
    },
    // 数组乱序
    disorde (arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        let rIndex = Math.floor(Math.random() * (i + 1));
        let temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
      }
      return arr
    },
    // 回退
    back () {
      this.$router.go(-1)
    },
    // 完成
    async complete () {
      // 验证助记词
      let confirmWords = this.confirmWords.map(v => {
        return v.item
      })
      // 输入的助记词
      let confirmWordsStr = confirmWords.join(' ')
      // 原助记词
      let mnemonicStr = this.orginWords.join(' ')
      // TODO: !!!!!!!!!!!!!!!!!
      if (confirmWordsStr !== mnemonicStr) {
        this.errorMsg = '助记词顺序有误，请重新选择'
        const timer = setInterval(() => {
          this.errorMsg = ''
          clearInterval(timer)
        }, 1000)
        return false
      }
      this.errorMsg = ''
      // 获取密码
      let pwd = ''
      await this.$unit.getStorage('password').then((v) => {
        pwd = v
      })
      // 获取用户名
      let userName = ''
      await this.$unit.getStorage('username').then((v) => {
        userName = v
      })
      // 生成 keystore
      let mnemonic = this.orginWords.join(' ')
      // alert(mnemonic)
      let base58 = this.$bip44.mnemonicToHDPrivateKey(mnemonic, null)
      let pk = this.$bip44.getPrivateKey(base58, 0).toString('hex')
      let obj = this.$cwv.KeyPair.genFromPrikey(pk)
      console.log(obj)
      let keystore = this.$cwv.keystore.exportJSON(obj, pwd)
      console.log(keystore)
      // this.sendRegister(obj.hexAddress)

      // 注册钱包地址
      let params = {
        method: 'BrokerInfo',
        from: obj.hexAddress,
        jsbody: JSON.stringify({
          uinfo: {
            alias: userName
          }
        }),
        refid: new Date() - 0
      }
      const recoverToast = Toast.loading({
        duration: 0,
        mask: true,
        message: '创建中...'
      })
      var balance = 0
      chrome.storage.local.set({
                  keypair: obj,
                  keystore,
                  state: 'HAVE',
                  balance,
                }, function () {
                })
                chrome.extension.getBackgroundPage().GlobalState = 'OPEN'
                this.sendMessageToContentScript({ msg: 'confirm -> content; 传递钱包地址', type: 'SENDMONEYADDRESS', data: { moneyAddress: obj.hexAddress, balance} }, (response) => {
                  console.log(response)
                })
                Toast({
                  duration: 1000,
                  message: '创建身份成功！'
                })
                this.$router.replace({ name: 'login' })
                return
      userLogin(params).then((res) => {
        if (res.status === 200 && res.data.ret_code === 0) {
          // 注册返回data 进行签名
          let ecHexSign = this.$cwv2.ecHexSign(obj.hexPrikey, res.data.hexdata)
          console.log('ecHexSign', ecHexSign)
          let params2 = {
            signdata: ecHexSign,
            method: res.data.method,
            waitResp: true,
            from: res.data.from,
            hexdata: res.data.hexdata,
            refid: res.data.refid,
            resp_refid: res.data.resp_refid
          }
          console.log('send_sign', params2)
          sendSignData(params2).then((res) => {
            console.log('res', res)
            if (res.status === 200 && res.data.ret_code >= 0) {
              recoverToast.clear()
              let balance = ''
              getBalance({ address: obj.hexAddress }).then((res) => {
                if (res.status === 200 && res.data.retCode < 0) {
                  balance = 0
                }
                if (res.status === 200 && res.data.retCode >= 0) {
                  console.log(res)
                  if (res.data.account.value.hasOwnProperty("tokens")) {
                    let index = res.data.account.value.tokens.findIndex(v => {
                      return v.token === "AAA"
                    })
                    if (index >= 0) {
                      // balance = divide(res.data.account.value.tokens[index].balance, 10 ** 18)
                      balance = (res.data.account.value.tokens[index].balance / 1000000000000000000).toFixed(0)
                    }
                  }
                  else {
                    balance = 0
                  }
                }
                // 存储 keyStorage keyPair
                chrome.storage.local.set({
                  keypair: obj,
                  keystore,
                  state: 'HAVE',
                  balance
                }, function () {
                })
                chrome.extension.getBackgroundPage().GlobalState = 'OPEN'
                this.sendMessageToContentScript({ msg: 'confirm -> content; 传递钱包地址', type: 'SENDMONEYADDRESS', data: { moneyAddress: obj.hexAddress, balance } }, (response) => {
                  console.log(response)
                })
                Toast({
                  duration: 1000,
                  message: '创建身份成功！'
                })
                this.$router.replace({ name: 'login' })
              }).catch((err) => {
                console.log(err)
              })
            } else if (res.status === 200 && res.data.ret_code < 0) {
              Toast({
                duration: 1000,
                message: res.data.ret_message
              })
            }
          }).catch((err) => {
            console.log(err)
            Toast.clear()
          })
        } else {
          recoverToast.clear()
          Toast({
            duration: 1000,
            message: res.data.ret_message
          })
        }
      }).catch((err) => {
        recoverToast.clear()
        Toast({
          duration: 1000,
          message: '注册信息失败'
        })
      })
    },
    // 发送信息给content_script
    getCurrentTabId (callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
      })
    },
    sendMessageToContentScript (message, callback) {
      this.getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
          if (callback) callback(response)
        })
      })
    },
    divide (num1, num2) {
      const num1Changed = this.float2Fixed(num1)
      const num2Changed = this.float2Fixed(num2)
      return (num1Changed / num2Changed) * Math.pow(10, this.digitLength(num2) - this.digitLength(num1))
    }

  }
}
</script>

<style lang="less" scoped>
.confirm {
  width: 100%;
  height: 100%;
  position: fixed;
  padding: 20px;
  .header {
    font-size: 16px;
    .van-icon-arrow-left {
      cursor: pointer;
      color: #516fea;
    }
  }
  .title {
    margin-top: 18px;
    text-align: center;
    h2 {
      font-size: 18px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    p {
      font-size: 14px;
      margin-top: 6px;
      font-family: PingFangSC-Light;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
    }
  }
  .error-msg {
    height: 16px;
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(246, 34, 46, 1);
    line-height: 16px;
  }
  .words {
    width: 100%;
    height: 138px;
    margin-top: 18px;
    li {
      user-select: none;
      display: inline-block;
      width: 76px;
      height: 34px;
      text-align: center;
      background: rgba(51, 76, 169, 0.08);
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
      margin-right: 5px;
      margin-top: 12px;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .confirm-words {
    width: 100%;
    margin-top: 4px;
    padding: 6px;
    min-height: 166px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    li {
      user-select: none;
      display: inline-block;
      width: 74px;
      height: 34px;
      text-align: center;
      background: rgba(0, 0, 0, 0.04);
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
      margin-right: 4px;
      margin-top: 13px;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .button {
    text-align: center;
    margin-top: 40px;
    .btn {
      width: 283px;
      height: 48px;
      background: rgba(51, 76, 169, 1);
      border-radius: 4px;
      border: 1px solid rgba(51, 76, 169, 1);
      font-size: 13px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
