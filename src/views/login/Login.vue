<template>
	<!-- <div class="login wrapper">
    <div class="login-inner">
      <div class="logo">
        <img src="../../assets/cwv_logo_horizontal.png" alt="">
      </div>
      <div class="input-password">
        <input v-model="password" :class="{error: err}" @keypress.enter="login" autocomplete="off" type="password" @input="inputpass" placeholder="密码">
      </div>
      <div class="pass-error">{{err}}</div>
      <div class="sign-in">
        <button class="btn btn-block" @click="login">登录</button>
      </div>
      <div class="footer-tips" @click="restore">
        <div class="restore">使用助记词还原</div>
        <div class="import-account">Import using account seed phrase</div>
      </div>
    </div>
  </div> -->
	<div class="login">
		<!-- <div class="header">
			<van-icon @click="back" name="arrow-left" />
		</div> -->
		<div class="title">
			<h2>登录</h2>
		</div>
		<div class="from">
			<div class="from-item">
				<input type="password" id="pwd" v-model="pwd" :class="{error: pwdError.length >= 1}" @input="pwdInput" placeholder="请输入密码" maxlength="24">
				<div class="error-msg">{{pwdError}}</div>
			</div>
		</div>
		<div class="button">
			<button :class="{'btn':true,'btn-disabled': btnDisabled}" @click="login" :disabled="btnDisabled">登录</button>
		</div>
		<div class="recover" @click="recover">
			<p>使用助记词还原</p>
			<p>Import using account seed phrase</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pwd: '',
			pwdError: '',
			btnDisabled: true
		}
	},
	created() {
		document.onkeyup = (e) => {
			let key = window.event.keyCode
			if (key === 13) {
				this.login()
			}
		}
	},
	mounted() {
    var inputPwd = document.getElementById('pwd')
    if (inputPwd && typeof inputPwd.focus == 'function') {
      inputPwd.focus()
    }
	},
	methods: {
		// 密码验证
		pwdInput() {
			let pwd = this.pwd
			let msg = '';
			if (!pwd) {
				msg = '请输入密码'
				this.btnDisabled = true
			} else {
				this.btnDisabled = false
			}
			this.pwdError = msg;
		},
		async login() {
			try {
				// TODO: 插件开启
				let keystore = {}
				await this.$unit.getStorage('keystore').then((v) => {
					keystore = v
				})

				// FIXME: 本地开启
				// let keystore = JSON.parse(window.localStorage.getItem('keystore'))

				let pwd = this.pwd
				let result = this.$cwv.keystore.json2KeyPair(keystore, pwd)
        console.log('resultresultresult,,,,,,>>>>>>',pwd,keystore,result)
				let background = chrome.extension.getBackgroundPage()
				console.log('signJson', background.signJson())
				// if (background.signState().length) {
				if (background.signJson() != null) {
					this.$router.replace({
						path: '/signature'
					})
				} else {
					// 登陆成功 跳转到钱包主页
					this.$router.push({
						name: 'money-bag'
					})
				}


				// TODO: 插件开启
				chrome.storage.local.set({ state: 'WARN' }, function () { })
				chrome.extension.getBackgroundPage().GlobalState = 'OPEN'
				// FIXME: 本地开启
				// window.localStorage.setItem('state', 'WARN')
			} catch (error) {
        console.log(error)
				this.pwdError = '密码不正确'
			}
		},
		recover() {
			this.$router.push({
				name: 'recover'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.login {
	width: 100%;
	height: 100%;
	position: fixed;
	padding: 20px;
	.title {
		// margin-top: 35px;
		h2 {
			font-size: 18px;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.85);
			line-height: 24px;
			text-align: center;
			margin-top: 40px;
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
		margin-top: 160px;
		&-item {
			margin-top: 24px;
			height: 34px;
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
	.recover {
		margin-top: 20px;
		text-align: left;
		font-size: 12px;
		font-family: PingFangSC-Light;
		font-weight: 300;
		color: rgba(81, 111, 234, 1);
		line-height: 19px;
		p {
			&:first-child {
				color: rgba(0, 0, 0, 0.65);
			}
		}
	}
}
</style>
