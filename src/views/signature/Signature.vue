<template>
  <div class="signature">
    <h2></h2>
    <p>请求签名</p>
    <div class="button">
      <button class="refuse" @click="refuse">取消</button>
      <button class="agree" @click="agree">同意</button>
    </div>
  </div>
</template>

<script>
import { getSignData, sendSignData } from '@/api/sign'
import { Toast } from 'vant'
export default {
  data () {
    return {
      // signJSONArr: []
      signJson: '',
      signReturnData: '',
    }
  },
  async created () {
    let background = chrome.extension.getBackgroundPage()
    this.signJson = background.signJson()
    this.signReturnData = this.signJson
  },
  computed () { 
    let that = this
    window.addEventListener('beforeunload', function () {
      that.refuse()
    })
  },
  methods: {
    // 取消
    refuse () {
      // 清除 badge 
      let background = chrome.extension.getBackgroundPage()
      background.signJsonStr = null
      chrome.runtime.sendMessage({
        type: 'SIGNJSONRETURN',
        data: this.signJson
      })
      // TODO: 向页面发送取消请求
      this.sendMessageToContentScript({ msg: '取消你的签名请求', type: 'SIGNDATARETURN', status: 'refuse' }, (response) => {
        console.log(response)
      })
      setTimeout(() => {
        window.close()
      }, 100);
    },
    async agree () {
      Toast.loading({
        duration: 0,
        mask: true,
        message: '签名中...'
      })
      this.sendMessageToContentScript({ msg: '正在签名', type: 'SIGNDATARETURN', status: 'doing' }, (response) => {
        console.log(response)
      })
      // 获取 keypair
      let keypair = ''
      await this.$unit.getStorage('keypair').then((v) => {
        keypair = v
      })
      let privatekey = keypair.hexPrikey
      let address = keypair.hexAddress
      console.log('keypair', keypair)
      console.log('this.signHexData', this.signReturnData)
      let str = this.signReturnData
      // 通过私钥和第一次请求返回的hashData进行数据签名
      // let ecHexSign = this.$cwv2.ecHexSign(privatekey, this.signReturnData)
      var $cwv = this.$cwv
      keypair = $cwv.KeyPair.genFromPrikey(privatekey)
      keypair.nonce = 0
      var from = { keypair: keypair }
      var exdata = str
      let background = chrome.extension.getBackgroundPage()
      background.signJsonStr = null
      var args = [{"address":"7fc4566cd2c9723d014e618245d8806c51f74b33","token":"AAA","tokenAmount":0}]
      // 签名请求
      var bg = chrome.extension.getBackgroundPage()
      exdata = $cwv.Buffer.from(exdata).toString('hex')
      window.$cwv = $cwv
      window.args = args
      window.exdata = exdata
      window.from = from
      console.log(JSON.stringify(from))
      console.log(JSON.stringify(exdata))
      console.log(JSON.stringify(args))
      bg.signData($cwv, from, exdata, args)
      // window.close()
      return
      let params = {
        signdata: ecHexSign,
        method: this.signReturnData.method,
        waitResp: this.signReturnData.waitResp || false,
        from: this.signReturnData.from,
        hexdata: this.signReturnData.hexdata,
        refid: this.signReturnData.refid,
        resp_refid: this.signReturnData.resp_refid
      }
      console.log('send_sign', params)
      sendSignData(params).then((res) => {
        console.log('res', res)
        if (res.status === 200 && res.data.ret_code >= 0) {
          // 清除 badge 
          chrome.runtime.sendMessage({
            type: 'SIGNJSONRETURN',
            data: this.signJson
          }, function (response) { })
          // 向页面发送成功签名请求数据
          this.sendMessageToContentScript({ msg: '同意了你的签名请求', type: 'SIGNDATARETURN', data: res.data, status: true }, (response) => {
            console.log(response)
          })
          // 清除加载
          Toast.clear()
          // 跳转到钱包主页
          this.$router.replace({
            path: '/money-bag'
          })
        } else if (res.status === 200 && res.data.ret_code < 0) {
          // 签名异常后
          // 清除 badge 
          chrome.runtime.sendMessage({
            type: 'SIGNJSONRETURN',
            data: this.signJson
          }, function (response) { })
          // 向页面发送异常请求
          this.sendMessageToContentScript({ msg: '你的签名请求异常', type: 'SIGNDATARETURN', status: false }, (response) => {
            console.log(response)
          })
          // 提示异常信息
          Toast.clear()
          Toast(res.data.ret_message)
        }
      }).catch((err) => {
        console.log(err)
        Toast.clear()
        // 向页面发送异常请求
        this.sendMessageToContentScript({ msg: '你的签名请求失败', type: 'SIGNDATARETURN', status: false }, (response) => {
          console.log(response)
        })
      })
    },
    getCurrentTabId (callback) {
      chrome.tabs.query({ active: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
      })
    },
    sendMessageToContentScript (message, callback) {
      this.getCurrentTabId((tabId) => {
        console.log(tabId, message)
        chrome.tabs.sendMessage(tabId, message, function (response) {
          if (callback) callback(response)
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.signature {
  width: 100%;
  height: 100%;
  position: fixed;
  padding: 20px;
  text-align: center;
  h2 {
    font-size: 32px;
    font-family: STHeitiTC-Light;
    font-weight: 500;
    color: rgba(51, 76, 169, 1);
    line-height: 40px;
    margin-top: 100px;
  }
  p {
    font-size: 20px;
    font-family: PingFangSC;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.55);
    line-height: 60px;
  }
  .button {
    margin-top: 180px;
    button {
      outline: none;
      border: none;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Light;
      font-weight: 500;
      color: rgba(51, 76, 169, 1);
      width: 138px;
      height: 44px;
      border-radius: 4px;
      letter-spacing: 4px;
      border: 1px solid rgba(51, 76, 169, 1);
      &.refuse {
        background: none;
      }
      &.agree {
        margin-left: 20px;
        background: rgba(51, 76, 169, 1);
        box-shadow: 0px 6px 20px 0px rgba(8, 21, 67, 0.26);
        color: #fff;
      }
    }
  }
}
</style>