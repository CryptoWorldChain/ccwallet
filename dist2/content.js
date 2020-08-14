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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // TODO: 签名结果返回给 content
  if (request.type == 'SIGNDATARETURN') {
    sendResponse('签名成功！')
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



})