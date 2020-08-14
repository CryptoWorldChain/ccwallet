import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import Vant from 'vant'
import 'vant/lib/index.css'
import './css/index.less'
import Clipboard from 'clipboard'
import unit from './unit'

Vue.use(Vant)

const cwv = require('../public/cwv')
cwv.config.server_base = 'http://114.115.205.57:10080/fbs'
cwv.config.rpc_provider = rp;
Vue.prototype.$cwv = cwv
Vue.prototype.$cwv2 = window.cwv
Vue.prototype.$bip39 = window.bip39
Vue.prototype.$bip44 = window.bip44
Vue.prototype.$clipboard = Clipboard
Vue.config.productionTip = false

function hexToString(str) {
  
}
cwv.rpc.getTransaction('0f7a5bb81b5dfca6ad9b634e5d33258f3c747cbcc6db83128daedab8ccd0a04dcf').then(function (result) {
  console.log('result')
  console.log(JSON.parse(result))
})

// let loginState = ''
// chrome.runtime.getBackgroundPage(function (event) {
//   loginState = event.loginState
//   console.log(loginState)

// })
// console.log('loginState', loginState)

let background = chrome.extension.getBackgroundPage()
// console.log(background.signState())
if (background.GlobalState) {
  var sign = background.signJson()
  if (sign || sign == '') {
    router.replace({
      path: '/signature'
    })
  } else {
    chrome.storage.local.get('state', function (items) {
      let state = items.state
      if (state === 'WARN') {
        if (location.href.match('signature')) {
          router.replace({
            path: '/signature'
          })
        } else {
          router.replace('/money-bag')
        }
      } else if (state === 'HAVE') {
        router.replace({
          path: '/login'
        })
      } else {
        router.replace('/')
      }
    })
  }
} else {
  chrome.storage.local.get('state', function (items) {
    let state = items.state
    if (state) {
      router.replace({
        path: '/login'
      })
    } else {
      router.replace('/')
    }
  })
}


// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.type === 'SIGNJSON') {
//     if (request.data.length > 0) {
//     } else {
//       chrome.storage.local.get('state', function (items) {
//         let state = items.state
//         if (state === 'WARN') {
//           router.replace({
//             path: '/money-bag'
//           })
//         } else if (state === 'HAVE') {
//           router.replace({
//             path: '/login'
//           })
//         } else {
//           router.replace('/')
//         }
//       })
//     }
//     sendResponse('')
//   }
// })


// let local = window.localStorage.getItem('open')
// chrome.storage.local.get('state', function (items) {
//   let state = items.state
//   if (state === 'WARN' && local) {
//     router.replace({
//       path: '/money-bag'
//     })
//   } else if (state === 'HAVE') {
//     router.replace({
//       path: '/login'
//     })
//   } else {
//     router.replace('/')
//   }
// })

console.log(unit)
Vue.prototype.$unit = unit





// Vue.prototype.$getStorage = function (key) {
//   return new Promise(function (resolve) {
//     chrome.storage.local.get(key, function (items) {
//       resolve(items[key])
//     })
//   })
// }




// chrome.runtime.onMessageExternal.addListener(function (
//   request,
//   sender,
//   sendResponse
// ) {
//   // 可以针对sender做一些白名单检查
//   // sendResponse返回响应
//   alert('request', request)
//   console.log(request)
//   if (request.type == 'MsgFromPage') {
//     sendResponse({
//       tyep: 'MsgFromChrome',
//       msg: 'Hello, I am chrome extension~'
//     })
//   }

// })

// var popupWindows = chrome.extension.getViews({type:'popup'});
// if (popupWindows.length) { // A popup has been found
//     // details is the object from the onMessage event (see 2)
//     popupWindows[0].whatever(message, sendResponse);
// }
// function whatever(message, sendResponse) {
//   // Do something, for example, sending the message back
//   sendResponse(message);
// }

// let state = window.localStorage.getItem('state') || ''



// let state = ''
// getStorage('state').then((v) => {
//   let state = v
//   if (state === 'WARN') {
//     router.replace({
//       path: '/money-home'
//     })
//   } else if (state === 'HAVE') {
//     router.replace({
//       path: '/login'
//     })
//   } else {
//     router.replace('/')
//   }
// })

// new Promise(function (resolve, reject) {

// })

// chrome.storage.local.get('state', function (result) {
//   console.log(result)
//   state = result.state
// })


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')