// let signJSONArr = []
let signJsonStr = ''
let GlobalState = ''
// 监听 content 发送的信息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'SIGNSEND') {
    // signJSONArr.push(request)
    console.log(request.data)
    signJsonStr = request.data
    chrome.browserAction.setBadgeBackgroundColor({
      color: '#f54545'
    })
    chrome.browserAction.setBadgeText({
      text: '1'
    })
    sendResponse({
      msg: '等待签名中...'
    })
  }
  if (request.type === 'SIGNJSONRETURN') {
    signJsonStr = null
    chrome.browserAction.setBadgeBackgroundColor({
      color: '#f54545'
    })
    chrome.browserAction.setBadgeText({
      text: ''
    })
    sendResponse('popup返回的数据')
  }
})
// 将数据发送给 popup
chrome.runtime.sendMessage(
  {
    type: 'SIGNJSON',
    data: signJsonStr
  },
  function(response) {}
)

// function badge() {
//   if (signJSONArr.length > 0 && signJSONArr.length <= 99) {
//     chrome.browserAction.setBadgeBackgroundColor({
//       color: '#f54545'
//     })
//     chrome.browserAction.setBadgeText({
//       text: signJSONArr.length + ''
//     })
//   } else if (signJSONArr.length > 99) {
//     chrome.browserAction.setBadgeBackgroundColor({
//       color: '#f54545'
//     })
//     chrome.browserAction.setBadgeText({
//       text: '99+'
//     })
//   } else {
//     chrome.browserAction.setBadgeBackgroundColor({
//       color: '#f54545'
//     })
//     chrome.browserAction.setBadgeText({
//       text: ''
//     })
//   }

// }

// function signState() {
//   return signJSONArr
// }
// if (signJSONArr && !signJSONArr.length) {
//   chrome.browserAction.setBadgeBackgroundColor({
//     color: '#f54545'
//   })
//   chrome.browserAction.setBadgeText({
//     text: ''
//   })
// }

function signJson() {
  return signJsonStr
}

function globalState() {
  return GlobalState
}

// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//   // With a new rule ...
//   chrome.declarativeContent.onPageChanged.addRules([
//       {
//       // That fires when a page's URL contains a 'g' ...
//       conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//           pageUrl: { urlContains: 'g' }, //url的内容中包含字母g的，插件才会被激活
//           })
//       ],
//       // And shows the extension's page action.
//       actions: [ new chrome.declarativeContent.ShowPageAction() ]
//       }
//   ]);
//   });
// });
