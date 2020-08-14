<template>
  <div class="money-bag">
    <h2 class="header" @click="openInBrowser">数字身份</h2>
    <div class="user">
      <div class="user-info">
        <div class="left">
          <p class="ellipsis user-name">{{user.uesrName}}</p>
          <p class="user-address" :data-clipboard-text="user.userAddress" @click="copy">{{user.userAddressPwd}} <span class="copy"></span></p>
        </div>
        <div class="right">
          <van-icon name="ellipsis" @click="more" />
        </div>
      </div>
      <div class="user-money">
        <h3 class="aaa">{{user.aaaMoney}}</h3>
      </div>
    </div>
    <!-- <ul class="bag-list">
      <li class="aaa">
        <div class="aaa-left">
          <i class="aaa-left-logo"></i>
          <span class="aaa-left-text">CWV</span>
        </div>
        <div class="aaa-right">
          <div class="aaa-right-money">
            <h3>{{aaaMoney.aaa}}</h3>
            <h4>￥ {{aaaMoney.rmb}}</h4>
          </div>
          <router-link :to="{name: 'money-aaa'}" class="aaa-right-link"></router-link>
        </div>
      </li>
    </ul> -->
    <!-- 上拉选择 -->
    <div>
      <van-action-sheet v-model="moreShow" :actions="actions" cancel-text="取消" @select="onSelect" />
    </div>
    <!-- 退出弹框 -->
    <div class="mask">
      <van-dialog v-model="exitShow" title="退出当前身份" confirm-button-text="确定" :message="message" show-cancel-button @confirm="confirm">
      </van-dialog>
    </div>
    <!-- 更改用户名弹框 -->
    <div class="mask mask2">
      <van-dialog v-model="modifyShow" title="更改用户名" confirm-button-text="确定" show-cancel-button @confirm="userModify">
        <van-field v-model="user.newUserName" placeholder="请输入新的用户名" 
          autofocus="true"
          @input="inputName($event)"
        />
      </van-dialog>
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
      user: {
        uesrName: '******',
        newUserName: '',
        userAddress: '',
        userAddressPwd: '*******************',
        aaaMoney: '0.00',
        hexPrikey: ''
      },
      aaaMoney: {
        aaa: '0.00',
        rmb: '0.00'
      },
      usdtMoney: {
        aaa: '0.00',
        rmb: '0.00'
      },
      moreShow: false,
      exitShow: false,
      modifyShow: false,
      actions: [
        { name: '更改用户名', type: 'changeUserName' },
        { name: '退出当前身份', type: 'exit' },
        { name: '删除当前身份', type: 'delete', className: 'warning' }
      ],
      message: '即将溢出身份及所有导入的钱包，请确保所有钱包已备份。',
    }
  },
  async created () {
    // TODO: 插件使用
    let uesrName = ''
    let keypair = ''
    await this.$unit.getStorage('username').then((v) => {
      uesrName = v || ''
    })
    await this.$unit.getStorage('keypair').then((v) => {
      keypair = JSON.stringify(v)
    })
    // await this.$unit.getStorage('balance').then((v) => {
    // 	balance = JSON.stringify(v)
    // })
    // console.log(balance)
    // FIXME: 本地使用
    // let uesrName = window.localStorage.getItem('username')
    // let keypair = window.localStorage.getItem('keypair')
    this.user.userAddress = JSON.parse(keypair).hexAddress
    this.$cwv.rpc.getBalance(this.user.userAddress).then(res=>{
      if (res && res.account) {
        chrome.storage.local.set({
          nonce: res.account.value.nonce
        })
      }
    })
    this.user.hexPrikey = JSON.parse(keypair).hexPrikey
    let str = this.user.userAddress
    this.user.userAddressPwd = str.substring(0, 13) + '****' + str.substring(str.length - 13)
    this.user.uesrName = uesrName

    // 获取余额
    await getBalance({ address: this.user.userAddress }).then((res) => {
      if (res.status === 200 && res.data.retCode < 0) {
        this.user.aaaMoney = 0
      }
      if (res.status === 200 && res.data.retCode >= 0) {
        if (res.data.account.value.hasOwnProperty("tokens")) {
          let index = res.data.account.value.tokens.findIndex(v => {
            return v.token === "AAA"
          })
          if (index >= 0) {
            let balance = (res.data.account.value.tokens[index].balance / 1000000000000000000).toFixed(0)
            this.user.aaaMoney = balance
            this.aaaMoney = {
              aaa: balance,
              rmb: balance
            }
          }
        } else {
          this.user.aaaMoney = 0
        }
      }
      this.sendMessageToContentScript({ msg: 'confirm -> content; 传递钱包地址', type: 'SENDMONEYADDRESS', data: { moneyAddress: str, balance: this.user.aaaMoney } }, (response) => {
        console.log(response)
      })
    }).catch((err) => {
      console.log(err)
    })
    // this.user.aaaMoney = balance.replace(/\"/g, "")
  },
  mounted() {
    document.onkeyup = (e) => {
      let key = window.event.keyCode
      if (key === 13) {
        this.userModify()
      }
    }
  },
  methods: {
    // 浏览器中打开
    openInBrowser() {
      window.open(chrome.extension.getURL('/index.html'));
    },
    inputName(e) {
      
    },
    // 更多按钮
    more () {
      this.moreShow = true
    },
    // 拷贝按钮
    copy () {
      let clipboard = new this.$clipboard('.user-address')
      clipboard.on('success', e => {
        Toast('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        Toast('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
      const timer = setInterval(() => {
        clearInterval(timer)
        Toast.clear()
      }, 800)
    },
    // 退出 & 更改用户名
    onSelect (val) {
      this.moreShow = false
      var that = this
      if (val.type === "changeUserName") {
        this.user.newUserName = this.user.uesrName
        this.modifyShow = true
      }
      if (val.type == 'exit') {
        chrome.storage.local.set({
          state: 'HAVE'
        },function () {
          that.$router.replace('/login')
        })
      }
      if (val.type === "delete") {
        this.exitShow = true
      }
    },
    // 更改用户名确定
    async userModify () {
      if (this.user.newUserName) {
        let params = {
          method: 'BrokerInfo',
          from: this.user.userAddress,
          jsbody: JSON.stringify({
            uinfo: {
              alias: this.user.newUserName
            }
          }),
          refid: new Date() - 0
        }
        if (this.user.newUserName.length >= 20) {
          Toast('您输入的用户名过长')
          return
        }
        const recoverToast = Toast.loading({
          duration: 0,
          mask: true,
          message: '更改中...'
        })
        this.user.uesrName = this.user.newUserName
        chrome.storage.local.set({ username: this.user.newUserName }, function () { 
          recoverToast.clear()
        })
        this.modifyShow = false
        return
        userLogin(params).then((res) => {
          if (res.status === 200 && res.data.ret_code === 0) {
            // 注册返回data 进行签名
            let ecHexSign = this.$cwv2.ecHexSign(this.user.hexPrikey, res.data.hexdata)
            let params2 = {
              signdata: ecHexSign,
              method: res.data.method,
              waitResp: true,
              from: res.data.from,
              hexdata: res.data.hexdata,
              refid: res.data.refid,
              resp_refid: res.data.resp_refid
            }
            sendSignData(params2).then((res) => {
              console.log('res', res)
              if (res.status === 200 && res.data.ret_code >= 0) {
                recoverToast.clear()
                this.user.uesrName = this.user.newUserName
                // TODO: 插件使用
                chrome.storage.local.set({ username: this.user.newUserName }, function () { })
                this.modifyShow = false
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
            message: '用户名更改失败！'
          })
        })
      }
    },
    // 确定退出
    confirm () {
      // this.$router.replace({ name: 'login' })
      this.$router.replace({ name: 'welcome' })
      chrome.storage.local.remove(['state', 'keypair', 'keystore'])
      this.sendMessageToContentScript({ msg: '退出当前钱包地址', type: 'EXITMONEYADDRESS', data: {} }, (response) => {
        console.log(response)
      })

      // TODO: 插件使用
      // chrome.storage.local.set({ state: 'HAVE' }, function () { })
      // window.localStorage.setItem('open', true)
      // chrome.extension.getBackgroundPage().GlobalState = 'OPEN'



      // FIXME: 本地使用
      // window.localStorage.setItem('state', 'HAVE')

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
.money-bag {
  padding: 20px;
  /deep/ h2 {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
  .user {
    height: 142px;
    padding: 18px;
    background: url('../../assets/money-bg.png') no-repeat;
    background-size: 100%;
    .user-info {
      .left {
        display: inline-block;
        width: 80%;
        .user-name {
          text-align: left;
          font-size: 16px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 22px;
        }
        .user-address {
          font-size: 12px;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 18px;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin: 4px 0 0 2px;
            background: url('../../assets/copy1.png') no-repeat;
            background-size: 100%;
          }
        }
      }
      .right {
        display: inline-block;
        width: 20%;
        text-align: right;
        color: #fff;
        font-size: 28px;
        vertical-align: top;
      }
    }
    .user-money {
      text-align: right;
      margin-top: 26px;
      .aaa {
        font-size: 36px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #fff;
        line-height: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .bag-list {
    .aaa,
    .usdt {
      padding: 12px 0;
      margin-top: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      &-left {
        display: inline-block;
        width: 50%;
        text-align: left;
        vertical-align: middle;
        &-logo {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url('../../assets/money-aaa.png') no-repeat;
          background-size: 100%;
          vertical-align: middle;
        }
        &-text {
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          vertical-align: middle;
          margin-left: 8px;
        }
      }
      &-right {
        display: inline-block;
        width: 50%;
        text-align: right;
        vertical-align: middle;
        &-money {
          display: inline-block;
          vertical-align: middle;
          h3 {
            font-size: 16px;
            font-family: PingFangSC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
          }
          h4 {
            font-size: 14px;
            font-family: PingFangSC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.35);
          }
        }
        &-link {
          width: 8px;
          height: 12px;
          margin-left: 10px;
          display: inline-block;
          background: url('../../assets/right.png') no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
        }
      }
    }
    .usdt-left-logo {
      background: url('../../assets/money-usdt.png') no-repeat;
      background-size: 100%;
    }
    .usdt {
      border-bottom: none;
    }
  }
  .warning {
    color: #f6222e;
  }
  .mask {
    /deep/ .van-dialog {
      width: 296px;
      height: 180px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 11px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 18px;
      .van-dialog__header {
        font-size: 20px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 28px;
        padding-top: 8px;
      }
      .van-dialog__footer--buttons {
        display: block;
        text-align: right;
      }
      .van-hairline--top::after {
        border-top-width: 0 !important;
      }
      .van-dialog__message--has-title {
        padding: 0;
      }
      .van-dialog__message {
        text-align: left;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 24px;
        margin-top: 14px;
      }
      .van-button {
        margin-top: 14px;
        width: 70px;
        height: 32px;
        line-height: 32px;
        background: rgba(246, 34, 46, 0.1);
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(246, 34, 46, 1);
        &::before {
        }
      }
      .van-dialog__cancel {
        background: none;
        color: rgba(0, 0, 0, 0.54);
      }
    }
  }
  .mask2 {
    /deep/ .van-dialog {
      .van-button {
        background: rgba(40, 60, 135, 0.1) !important;
        color: rgba(81, 111, 234, 1) !important;
      }
      .van-dialog__cancel {
        background: none !important;
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
    /deep/ .van-field {
      padding: 14px 0;
      .van-field__control {
        width: 299px;
        height: 38px;
        padding: 0 6px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.09);
      }
    }
  }
}
</style>