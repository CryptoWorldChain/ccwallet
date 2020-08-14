<template>
	<div class="pop-info">
		<div class="header">
			<van-icon @click="back" name="arrow-left" />
		</div>
		<div class="title">
			<h2>备份提示</h2>
			<p>获得助记词等于拥有钱包资产所有权</p>
		</div>
		<div class="card">
			<div class="card-item">
				<h3>备份助记词</h3>
				<p>使用纸和笔正确抄写助记词。如果你的手机丢失、被盗、损坏，助记词将可以恢复你的资产。</p>
			</div>
			<div class="card-item">
				<h3>离线保管</h3>
				<p>妥善报关至隔离网络的安全地方。请勿将助记词在联网环境下分享和存储，比如邮件、相册、社交应用等。</p>
			</div>
		</div>
		<div class="button">
			<button class="btn" @click="next">下一步</button>
		</div>
		<div class="mask">
			<van-dialog v-model="show" title="请勿截屏" confirm-button-text="知道了" :message="message" show-cancel-button @confirm="confirm">
			</van-dialog>
		</div>
	</div>
</template>

<script>
// import { Dialog } from 'vant'
export default {
	data() {
		return {
			show: false,
			message: '请勿截屏分享和存储，这将可能被第三方恶意软件收集，造成财产损失。'
		}
	},
	created() {
		document.onkeyup = (e) => {
			let key = window.event.keyCode
			if (key === 13) {
				this.next()
			}
		}
	},
	mounted() {
	},
	methods: {
		// 回退
		back() {
			this.$router.go(-1)
		},
		// 下一步
		next() {
			this.show = true
		},
		// 知道了
		confirm() {
			this.$router.push({
				name: 'create',
				params: {
					id: 'mnemonic',
				}
			})
		}

	}
}
</script>

<style lang="less" scoped>
.pop-info {
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
	.card {
		height: 202px;
		background: rgba(0, 0, 0, 0.04);
		margin-top: 18px;
		border-radius: 4px;
		padding: 1px 20px 8px 20px;
		.card-item {
			margin-top: 20px;
			h3 {
				font-size: 14px;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				line-height: 20px;
			}
			p {
				font-size: 12px;
				margin-top: 10px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.65);
				line-height: 16px;
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
				background: rgba(40, 60, 135, 0.1);
				border-radius: 4px;
				font-size: 14px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(81, 111, 234, 1);
				&::before {
				}
			}
			.van-dialog__cancel {
				background: none;
				color: rgba(0, 0, 0, 0.54);
			}
		}
	}
}
</style>