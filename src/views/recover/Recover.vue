<template>
  <div class="recover">
    <div class="header">
      <van-icon @click="back" name="arrow-left" />
    </div>
    <div class="title">
      <h2>恢复身份</h2>
      <p>使用助记词导入的同时可以修改钱包密码。</p>
    </div>
    <p class="textarea-error-msg">{{mnemonicError}}</p>
    <textarea class="mnemonic" placeholder="输入助记词，用空格分隔" @blur="mnemonicInput" :class="{error: mnemonicError.length >= 1}" v-model="mnemonic"></textarea>
    <div class="from">
      <p class="from-title">恢复数字身份</p>
      <div class="from-item first-item">
        <input v-model="userName" :class="{error: userNameError.length >= 1}" @blur="userNameBlur" placeholder="请输入用户名" maxlength="20">
        <div class="error-msg">{{userNameError}}</div>
      </div>
      <div class="from-item">
        <input type="password" v-model="pwd" :class="{error: pwdError.length >= 1}" @input="pwdInput" placeholder="请输入密码8-24位，建议混合大小写字母、数字" maxlength="24">
        <div class="error-msg">{{pwdError}}</div>
      </div>
      <div class="from-item">
        <input v-model="confirmPwd" type="password" @input="confirmPwdInput" :class="{error: confirmPwdError.length >= 1}" placeholder="请再次输入密码" maxlength="24">
        <div class="error-msg">{{confirmPwdError}}</div>
      </div>
    </div>
    <div class="button">
      <button :class="{'btn':true,'btn-disabled': btnDisabled}" @click="recover" :disabled="btnDisabled">恢复身份</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { userLogin, getBalance, getUserInfo } from '@/api/create'
import { sendSignData } from '@/api/sign'
export default {
  data () {
    return {
      mnemonic: '',
      mnemonicError: '',
      userName: '',
      userNameError: '',
      pwd: '',
      confirmPwd: '',
      pwdError: '',
      confirmPwdError: '',
      btnDisabled: true,
    }
  },
  created () {
    document.onkeyup = (e) => {
      let key = window.event.keyCode
      if (key === 13) {
        if (!this.btnDisabled) {
          this.recover()
        }
      }
    }
  },
  methods: {
    // 助记词验证
    mnemonicInput () {
      let mnemonic = this.mnemonic
      let result = this.$bip39.validateMnemonic(mnemonic)
      let msg = '';
      if (!mnemonic) {
        msg = '请输入助记词'
        this.btnDisabled = true
      } else if (!result) {
        msg = '输入的助记词格式有误'
        this.btnDisabled = true
      } else {
        this.btnDisabled = false
      }
      this.mnemonicError = msg;
    },
    // 用户名
    userNameBlur () {
      let userName = this.userName
      let msg = ''
      if (!userName) {
        msg = '请输入用户名'
        this.btnDisabled = true
      } else {
        this.btnDisabled = false
      }
      this.userNameError = msg
    },
    // 密码验证
    pwdInput () {
      let pwd = this.pwd
      let msg = '';
      if (!pwd) {
        msg = '请输入密码'
        this.btnDisabled = true
      } else if (pwd.length < 8) {
        msg = '请输入至少8位字符的密码'
        this.btnDisabled = true
      } else if (pwd.length > 24) {
        msg = '请输入不超过24位字符的密码'
        this.btnDisabled = true
      } else if (!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,24}$/).test(pwd)) {
        msg = '请输入数字、字母或字符组合的密码'
        this.btnDisabled = true
      } else {
        this.btnDisabled = false
      }
      this.pwdError = msg;
    },
    // 确认密码
    confirmPwdInput () {
      let pwd = this.pwd
      let confirmPwd = this.confirmPwd
      let msg = ''
      if (!confirmPwd) {
        msg = '请再次输入密码'
        this.btnDisabled = true
      } else if (pwd !== confirmPwd) {
        msg = '两次密码输入不一致'
        this.btnDisabled = true
      } else {
        this.btnDisabled = false
      }
      this.confirmPwdError = msg
    },
    // 回退
    back () {
      this.$router.go(-1)
    },
    // 恢复身份
    async recover () {
      this.mnemonicInput()
      this.pwdInput()
      this.confirmPwdInput()
      let pwdError = this.pwdError
      let confirmPwdError = this.confirmPwdError
      let mnemonicError = this.mnemonicError
      let userNameError = this.userNameError
      if (pwdError || confirmPwdError || mnemonicError || userNameError) {
        return false
      } else {
        let pwd = this.pwd
        let mnemonic = this.mnemonic
        let userName = this.userName
        // 生成 keystore
        let base58 = this.$bip44.mnemonicToHDPrivateKey(mnemonic, null)
        let pk = this.$bip44.getPrivateKey(base58, 0).toString('hex')
        let obj = this.$cwv.KeyPair.genFromPrikey(pk)
        let keystore = this.$cwv.keystore.exportJSON(obj, pwd)
        console.log(obj)
        console.log(keystore)
        // const recoverToast = Toast.loading({
        //   duration: 0,
        //   mask: true,
        //   message: '恢复中...'
        // })
        // getUserInfo({ address: obj.hexAddress }).then((res) => {
        //   console.log('获取用户名', res)
        //   if (res.status === 200) {
        //     if (res.data.errCode && res.data.errCode === -1) {
        //       recoverToast.clear()
        //       Toast({
        //         duration: 1000,
        //         message: res.data.errMsg
        //       })
        //       return false
        //     }
        //     const recoverName = res.data.alias
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
          message: '恢复中...'
        })
        var balance = 0
        chrome.storage.local.set({
                    keypair: obj,
                    keystore,
                    state: 'HAVE',
                    balance,
                    username: userName
                  }, function () {
                  })
                  chrome.extension.getBackgroundPage().GlobalState = 'OPEN'
                  this.sendMessageToContentScript({ msg: 'confirm -> content; 传递钱包地址', type: 'SENDMONEYADDRESS', data: { moneyAddress: obj.hexAddress, balance } }, (response) => {
                    console.log(response)
                  })
                  Toast({
                    duration: 1000,
                    message: '恢复身份成功！'
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
                    balance,
                    username: userName
                  }, function () {
                  })
                  chrome.extension.getBackgroundPage().GlobalState = 'OPEN'
                  this.sendMessageToContentScript({ msg: 'confirm -> content; 传递钱包地址', type: 'SENDMONEYADDRESS', data: { moneyAddress: obj.hexAddress, balance } }, (response) => {
                    console.log(response)
                  })
                  Toast({
                    duration: 1000,
                    message: '恢复身份成功！'
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
        // } else {
        //   recoverToast.clear()
        //   Toast({
        //     duration: 1000,
        //     message: res.data.errMsg
        //   })
        // }
        // }).catch((err) => {
        //   recoverToast.clear()
        //   Toast({
        //     duration: 1000,
        //     message: '获取用户信息失败！'
        //   })
        // })
      }
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
    }
  }
}
</script>

<style lang="less" scoped>
.recover {
  width: 100%;
  height: 100%;
  padding: 20px;
  .header {
    font-size: 16px;
    .van-icon-arrow-left {
      cursor: pointer;
      color: #516fea;
    }
  }
  .title {
    width: 100%;
    margin-top: 20px;
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
  .textarea-error-msg {
    height: 16px;
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(246, 34, 46, 1);
    line-height: 16px;
  }
  .mnemonic {
    width: 100%;
    height: 127px;
    margin-top: 4px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    font-size: 14px;
    font-family: PingFangSC-Light;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 10px;
    resize: none;
    &.error {
      border: 1px solid rgba(246, 34, 46, 1);
    }
  }
  .from {
    margin-top: 20px;
    &-title {
      font-size: 14px;
      text-align: left;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
    }
    &-item {
      margin-top: 24px;
      height: 34px;
      position: relative;
      &:last-child {
        margin-bottom: 24px;
      }
      input {
        font-size: 14px;
        height: 100%;
        font-family: PingFangSC-Light;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
        padding: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      input.error {
        border-color: rgba(246, 34, 46, 1);
      }
      .error-msg {
        text-align: left;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(246, 34, 46, 1);
        line-height: 18px;
      }
    }
    .first-item {
      margin-top: 10px;
    }
  }
  .button {
    text-align: center;
    margin-top: 35px;
    width: 100%;
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
    .btn-disabled {
      background: rgba(174, 184, 221, 1);
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(174, 184, 221, 1);
    }
  }
}
</style>
