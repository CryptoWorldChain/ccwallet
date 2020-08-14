<template>
	<div id="app">
		<!-- <Header :show="show" /> -->
		<router-view />
	</div>
</template>

<script>
// import Header from './views/header'
// var whitelist = [
// 	'create', 'account', 'login', 'restore'
// ]
export default {
	// watch: {
	// 	$route: function (n, o) {
	// 		var name = n.name;
	// 		this.showheader(name)
	// 	}
	// },
	components: {
		// Header
	},
	mounted() {
		// var route = this.$route
		// var name = route.name;
		// this.showheader(name)
	},
	data() {
		return {
			// show: true,
			// whitelist
		}
  },
  destroyed() {
    
  },
	methods: {
		// showheader(name) {
		// 	var flag = true;
		// 	var whitelist = this.whitelist;
		// 	whitelist.forEach(item => {
		// 		if (item == name) {
		// 			flag = false
		// 		}
		// 	});
		// 	this.show = flag
		// }
	}
}
</script>


<style lang="less">
#app {
	// -webkit-font-smoothing: antialiased;
	// -moz-osx-font-smoothing: grayscale;
	// width: 100%;
	// height: 100%;
}
</style>
