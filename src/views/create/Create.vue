<template>
	<div class="create">
		<CreatePassword v-if="step == 'password'" />
		<CreatePopInfo v-if="step == 'pop-info'" />
		<CreateMnemonic v-if="step == 'mnemonic'" />
		<CreateConfirm v-if="step == 'confirm'" />
		<!-- <Success v-if="step == 'success'" /> -->
	</div>
</template>

<script>
import CreatePassword from './CreatePassword'
import CreatePopInfo from './CreatePopInfo'
import CreateMnemonic from './CreateMnemonic'
import CreateConfirm from './CreateConfirm'
// import Success from './success'
export default {
	data() {
		return {
			step: '1'
		}
	},
	watch: {
		'$route.params'(n, o) {
			var id = n.id;
			if (id) {
				this.step = id;
			} else {
				this.step = 'password'
			}
		}
	},
	created() {

	},
	components: {
		CreatePassword, CreatePopInfo, CreateMnemonic, CreateConfirm
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			var params = this.$route.params
			var id = params.id
			if (id) {
				this.step = id
			} else {
				this.step = 'password'
			}
		}
	}
}
</script>

<style scoped>
.create {
	height: 100%;
	width: 100%;
}
</style>
