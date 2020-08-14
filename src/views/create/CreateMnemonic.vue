<template>
	<div class="mnemonic">
		<div class="header">
			<van-icon @click="back" name="arrow-left" />
		</div>
		<div class="title">
			<h2>备份助记词</h2>
			<p>请准确抄写并安全备份助记词</p>
		</div>
		<ul class="words">
			<li v-for="(item, index) in words" :key="index">{{item}}</li>
		</ul>
		<div class="button">
			<button class="btn" @click="next">下一步</button>
		</div>
		<div class="info">
			<div class="info-item">
				<h3>备份助记词</h3>
				<p>使用纸和笔正确抄写助记词。如果你的手机丢失、被盗、损坏，助记词将可以恢复你的资产。</p>
			</div>
			<div class="info-item">
				<h3>离线保管</h3>
				<p>妥善报关至隔离网络的安全地方。请勿将助记词在联网环境下分享和存储，比如邮件、相册、社交应用等。</p>
			</div>
			<div class="info-item">
				<h3>离线保管</h3>
				<p>请勿截屏分享和存储，这将可能被第三方恶意软件收集，造成财产损失。</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			words: [],
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
		const mnemonic = this.$bip44.generateMnemonic(null, null, bip44.wordlists.english)
		this.words = mnemonic.split(' ')
	},
	methods: {
		// 回退
		back() {
			this.$router.go(-1)
		},
		next() {
			// 跳转到确认助记词
			this.$router.push({
				name: 'create',
				params: {
					id: 'confirm',
					mnemonic: this.words,
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.mnemonic {
	width: 100%;
	height: 100%;
	position: fixed;
	padding: 20px;
	.header {
		font-size: 12px;
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
	.words {
		width: 100%;
		margin-top: 12px;
		li {
			display: inline-block;
			width: 76px;
			height: 34px;
			text-align: center;
			background: rgba(0, 0, 0, 0.04);
			font-size: 14px;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.85);
			line-height: 32px;
			margin-right: 5px;
			margin-top: 12px;
			user-select: none;
			&:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
	.button {
		text-align: center;
		margin-top: 22px;
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
	.info {
		margin-top: 24px;
		.info-item {
			margin-top: 16px;
			h3 {
				font-size: 14px;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				line-height: 20px;
			}
			p {
				font-size: 12px;
				margin-top: 8px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.65);
				line-height: 16px;
			}
		}
	}
}
</style>
