<template>
	<div class="welcome">
		<div class="logo">
			<img src="../../assets/logo.png" alt="logo">
			<h2></h2>
		</div>
		<div class="button">
			<button class="btn btn-block" @click="create">创建身份</button>
			<button class="btn btn-border" @click="recover">恢复身份</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	created() { },
	methods: {
		create() {
			this.$router.push({
				name: 'create'
			})
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
.welcome {
	width: 100%;
	height: 100%;
	position: fixed;
	background: url('../../assets/bg.png') no-repeat;
	background-size: 100%;
	.logo {
		margin: 146px auto 0;
		text-align: center;
		img {
			width: 86px;
			height: 89px;
		}
		h2 {
			font-size: 20px;
			font-family: STHeitiTC-Light;
			font-weight: 300;
			color: rgba(255, 255, 255, 1);
			line-height: 20px;
			margin-top: 16px;
		}
	}
	.button {
		margin-top: 150px;
		text-align: center;
		.btn {
			width: 283px;
			height: 48px;
			font-size: 13px;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			border-radius: 4px;
		}
		.btn-block {
			color: rgba(255, 255, 255, 1);
			background: rgba(51, 76, 169, 1);
			box-shadow: 0px 6px 19px 0px rgba(8, 21, 67, 0.26);
			border: 1px solid rgba(51, 76, 169, 1);
		}
		.btn-border {
			color: rgba(51, 76, 169, 1);
			border: 1px solid rgba(51, 76, 169, 1);
			background: none;
			margin-top: 17px;
		}
	}
}
// /deep/ #app {
// }
// .not-login {
// 	// padding: 10px;
// 	width: 100%;
// 	height: 100%;
// 	h2 {
// 		font-size: 24px;
// 		text-align: center;
// 		margin: 50px 0;
// 	}
// }
</style>
