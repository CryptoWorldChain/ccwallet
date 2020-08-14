// // 获取页面签名按钮
// var btn = document.querySelector('#signature-button')
// // 获取显示签名信息按钮
// var show = document.querySelector('#show')
// if (btn) {
//   btn.onclick = function () {
//     btn.disabled = true
//     // 发送签名请求到 background
//     chrome.runtime.sendMessage({
//       type: 'SIGNSEND',
//       data: '我是签名文件'
//     }, function (response) {
//       if (response) {
//         show.innerText = response.msg
//       }
//     })
//   }
// }
document.addEventListener('signData', function (evt) {
  // 发送签名请求到 background
  chrome.runtime.sendMessage({
      type: 'SIGNSEND',
      data: evt.detail
    },
    function (response) {
      if (response) {
        // console.log(response.msg)
      }
    }
  )
})

// 监听返回的 popup 信息
// let moneyAddress = ''
let sign = {
  success () {
    window.sessionStorage.setItem('result', 'success')
  }, 
  doing() {
    window.sessionStorage.setItem('result', 'doing')
  },
  refuse() {
    window.sessionStorage.setItem('result', 'refuse')
  },
  fail() {
    window.sessionStorage.setItem('result', 'fail')
  }
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // TODO: 签名结果返回给 content
  console.log(request)
  if (request.type == 'SIGNDATARETURN') {
    if (request.status == 'doing') {
      sign.doing()
    }if (request.status == 'success') {
      sign.success()
    } else if (request.status == 'fail') {
      sign.fail()
    }else if (request.status == 'refuse') {
      sign.refuse()
    }
    sendResponse('签名返回！')
    let hash = document.querySelector('#CustomInputHash')
    let obj = document.querySelector('#CustomInputObj')
    if (hash) {
      if (request.status) {
        hash.value = request.data.txhash
      } else {
        hash.value = 'SIGNFAIL'
      }
    }
    if (obj) {
      if (request.status) {
        obj.value = JSON.stringify(request.data)
      } else {
        obj.value = 'SIGNFAIL'
      }
    }
  }
  // TODO: 钱包创建&恢复之后将钱包地址传到content 再通过content设置给浏览器localStorage
  if (request.type === 'SENDMONEYADDRESS') {
    sendResponse('content接收到了钱包地址')
    // console.log(request.data)
    window.localStorage.setItem('money-address', request.data.moneyAddress)
    window.localStorage.setItem('money-balance', request.data.balance)
  }
  // TODO: 退出钱包时移除localStorage里面的 money-address 、money-balance
  if (request.type === 'EXITMONEYADDRESS') {
    sendResponse('content接收到了移除缓存请求')
    window.localStorage.removeItem('money-address')
    window.localStorage.removeItem('money-balance')
  }
  sendResponse('none')
})
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
  document.body.appendChild(temp);
}
document.addEventListener('DOMContentLoaded', function() {
  injectCustomJs()
})

// 发送到后台
function sendMessageToBackground(data) {
  chrome.runtime.sendMessage({type: 'OPENWINDOW', data: data}, function(response) {
		console.log('收到来自后台的回复：' + response);
  });
}

window.addEventListener('message', function (e) {
  let data = e.data
  if (data && data.cmd == 'OPENWINDOW') {
    sendMessageToBackground(data.data)
  }
})