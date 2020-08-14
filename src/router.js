import Vue from 'vue'
import Router from 'vue-router'
import Welcome from './views/welcome/Welcome.vue'
import Create from './views/create/Create.vue'
import Login from './views/login/Login.vue'
import Recover from './views/recover/Recover.vue'
import MoneyBag from './views/money/MoneyBag.vue'
import Signature from './views/signature/Signature.vue'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      // 选择页面
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      // 创建身份页面
      path: '/create/:id?',
      name: 'create',
      component: Create
    },
    {
      // 登录页面
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      // 恢复页面
      path: '/recover',
      name: 'recover',
      component: Recover
    },
    {
      // 钱包主页
      path: '/money-bag',
      name: 'money-bag',
      component: MoneyBag
    },
    {
      // 签名页面
      path: '/signature',
      name: 'signature',
      component: Signature
    }
  ]
})