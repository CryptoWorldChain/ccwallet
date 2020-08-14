<template>
  <div class="password">
    <div class="header">
      <van-icon @click="back" name="arrow-left" />
    </div>
    <div class="title">
      <p>创建数字身份</p>
    </div>
    <div class="from">
      <div class="from-item">
        <input v-model="userName" :class="{error: userNameError.length >= 1}" @blur="userNameBlur" placeholder="请输入用户名" maxlength="20">
        <div class="error-msg">{{userNameError}}</div>
      </div>
      <!-- <div class="from-item">
				<input v-model="phone" type="number" :class="{error: phoneError.length >= 1}" @input="phoneInput" placeholder="请输入手机号">
				<div class="error-msg">{{phoneError}}</div>
			</div> -->
      <!-- <div class="from-item" v-if="accountType === 'qq'">
				<input v-model="qq" type="number" :class="{error: qqError.length >= 1}" @blur="qqBlur" placeholder="请输入QQ号">
				<div class="error-msg">{{qqError}}</div>
				<span class="more" @click="more">
					<span>更多</span>
					<van-icon name="arrow" /></span>
			</div> -->
      <!-- <div class="from-item" v-if="accountType === 'email'">
				<input v-model="email" type="email" :class="{error: emailError.length >= 1}" @blur="emailBlur" placeholder="请输入邮箱号">
				<div class="error-msg">{{emailError}}</div>
				<span class="more" @click="more">
					<span>更多</span>
					<van-icon name="arrow" /></span>
			</div> -->
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
      <button :class="{'btn':true,'btn-disabled': btnDisabled}" @click="next" :disabled="btnDisabled">下一步</button>
    </div>
    <!-- <div class="mask">
			<van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		</div> -->
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  data () {
    return {
      // phone: '',
      // phoneError: '',
      // accountType: 'qq',
      // qq: '',
      // qqError: '',
      // email: '',
      // emailError: '',
      userName: '',
      userNameError: '',
      pwd: '',
      pwdError: '',
      confirmPwd: '',
      confirmPwdError: '',
      btnDisabled: true,
      // show: false,
      // actions: [
      // 	{ name: 'QQ号码', type: 'qq' },
      // 	{ name: '邮箱地址', type: 'email' }
      // ]
    }
  },
  watch: {
    // pwd () {
    //   this.pwdblur()
    // },
    // confirmpwd () {
    //   this.confirmpwdblur()
    // }
  },
  created () {
    document.onkeyup = (e) => {
      let key = window.event.keyCode
      if (key === 13) {
        if (!this.btnDisabled) {
          this.next()
        }
      }
    }
    chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
      // 可以针对sender做一些白名单检查
      // sendResponse返回响应
      // alert('request', request)
      Dialog.confirm({
        title: '标题',
        message: '弹窗内容'
      }).then(() => {
        // on confirm
      }).catch(() => {
        // on cancel
      })
      console.log(request)
      if (request.type == 'MsgFromPage') {
        sendResponse({
          tyep: 'MsgFromChrome',
          msg: 'Hello, I am chrome extension~'
        })
      }
    })
  },
  methods: {
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
    // 手机号码
    // phoneInput() {
    // 	let phone = this.phone
    // 	let msg = '';
    // 	if (!phone) {
    // 		msg = '请输入手机号'
    // 		this.btnDisabled = true
    // 	} else if (!/^1[3456789]\d{9}$/.test(phone)) {
    // 		msg = '输入的手机号码格式有误'
    // 		this.btnDisabled = true
    // 	} else {
    // 		this.btnDisabled = false
    // 	}
    // 	this.phoneError = msg
    // },
    // // qq号
    // qqBlur() {
    // 	let qq = this.qq
    // 	let msg = '';
    // 	if (!qq) {
    // 		msg = '请输入QQ号'
    // 	} else { }
    // 	this.qqError = msg
    // 	this.btnDisabled = false
    // },
    // // 邮箱号码
    // emailBlur() {
    // 	let email = this.email
    // 	let msg = '';
    // 	if (!email) {
    // 		msg = '请输入邮箱号码'
    // 	} else { }
    // 	this.emailError = msg
    // 	this.btnDisabled = false
    // },
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
        this.btnDisabled = true
        msg = '两次密码输入不一致'
      } else {
        this.btnDisabled = false
      }
      this.confirmPwdError = msg
    },
    // 回退
    back () {
      this.$router.push({ name: 'welcome' })
    },
    // // 切换 QQ & email
    // more() {
    // 	this.show = true
    // },
    // // 选中 QQ & email
    // onSelect(val) {
    // 	this.accountType = val.type
    // 	this.show = false
    // },
    onCancel () { },
    // 下一步
    next () {
      // this.userNameBlur()
      // this.phoneBlur()
      // if (this.accountType === 'qq') {
      // 	this.qqBlur()
      // } else {
      // 	this.emailBlur()
      // }
      this.pwdInput()
      this.confirmPwdInput()
      let userNameError = this.userNameError
      // let phoneError = this.phoneError
      // let qqError = this.qqError
      // let emailError = this.emailError
      let pwdError = this.pwdError
      let confirmPwdError = this.confirmPwdError
      if (pwdError || confirmPwdError || userNameError) {
        return false
      } else {
        // TODO: 插件开启
        chrome.storage.local.set({ password: this.pwd, username: this.userName }, function () { })
        // FIXME: 本地开启
        // window.localStorage.setItem('password', this.pwd)
        // window.localStorage.setItem('username', this.userName)
        // 跳转到生成助记词
        this.$router.push({
          name: 'create',
          params: {
            id: 'mnemonic'
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.password {
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
    margin-top: 35px;
    h2 {
      font-size: 18px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC-Light;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
      margin-top: 6px;
    }
  }
  .from {
    margin-top: 38px;
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
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(246, 34, 46, 1);
        line-height: 18px;
      }
      .more {
        position: absolute;
        right: 0px;
        top: 6px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Light;
        font-weight: 300;
        color: rgba(81, 111, 234, 1);
        line-height: 20px;
        span {
          vertical-align: middle;
        }
        .van-icon-arrow {
          font-size: 16px;
          vertical-align: middle;
        }
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
    .btn-disabled {
      background: rgba(174, 184, 221, 1);
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(174, 184, 221, 1);
    }
  }
}
</style>
