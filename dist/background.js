// let signJSONArr = []
let signJsonStr = null
let GlobalState = ''
let win
// 监听 content 发送的信息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('向content发送消息' + JSON.stringify(request))
  if (request.type == 'OPENWINDOW') {
    sendResponse('收到打开窗口请求')
    if (request && typeof request.data != 'undefined') {
      signJsonStr = request.data
    }
    var url = chrome.extension.getURL('index.html#/signature')
    win = window.open(url, 'new', 'width=360,height=640,top=20,left=0,menubar=no,toolbar=no,scrollbars=no')
  } else if (request.type === 'SIGNSEND') {
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
  } else if (request.type === 'SIGNJSONRETURN') {
    signJsonStr = null
    chrome.browserAction.setBadgeBackgroundColor({
      color: '#f54545'
    })
    chrome.browserAction.setBadgeText({
      text: ''
    })
    sendResponse('popup返回的数据')
  } else {
    sendResponse('none')
  }

})
// 关闭
function closeWindow() {
  win = win || window
  win.close()
  chrome.runtime.sendMessage({cmd: 'CLOSEWINDOW'}, function () {

  })
}
// 将数据发送给 popup
// chrome.runtime.sendMessage(
//   {
//     type: 'SIGNJSON',
//     data: signJsonStr
//   },
//   function(response) {}
// )

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
function getCurrentTabId(callback) {
  chrome.tabs.query({
    active: true
  }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  })
}

function sendMessageToContentScript(message, callback) {
  this.getCurrentTabId((tabId) => {
    console.log(tabId, message)
    chrome.tabs.sendMessage(tabId, message, function (response) {
      if (callback) callback(response)
    });
  });
}
function getBalance($cwv,address) {
  return $cwv.rpc.getBalance(address)
}
function signData($cwv, from, exdata, args) {
  $.ajax({
    type:'post',
    url: 'http://api.bejson.com/btools/tools/convert/hexChar',
    data: {
      fmtType: 'd',
      oldStr: exdata
    }
  }).then((res)=>{
    var obj = {}
    try {
      obj = JSON.parse(res)
    } catch (error) {
      
    }
    if (obj.code == 0) {
      exdata = obj.message
      var address = from.keypair.hexAddress
      getBalance($cwv,address).then(res=>{
        var data = {}
        try {
          data = JSON.parse(res)
        } catch (error) {
          
        }
        if (data.account) {
          var nonce = data.account.value.nonce
          nonce = Number(nonce) + 1
          from.keypair.nonce = nonce
          from.nonce = nonce
          $sign($cwv, from, exdata, args)
        } else {
          $sign($cwv, from, exdata, args)
        }
      }).catch(err=>{
        $sign($cwv, from, exdata, args)
      })
    }
  })
}

function $sign($cwv, from, exdata, args) {
  $cwv.rpc.transfer(from, exdata, args).then((res) => {
    closeWindow()
    signJsonStr = null
    let data = {}
    try {
      data = JSON.parse(res)
    } catch (error) {

    }
    if (data.retCode == 1) {
      var hash = data.hash
      sendMessageToContentScript({
        msg: '签名成功',
        type: 'SIGNDATARETURN',
        status: 'success',
        hash: hash
      }, (response) => {
        console.log(response)
      })
    } else {
      sendMessageToContentScript({
        msg: '签名失败',
        type: 'SIGNDATARETURN',
        status: 'fail'
      }, (response) => {
        console.log(response)
      })
    }
  }).catch((err) => {
    closeWindow()
    signJsonStr = null
    sendMessageToContentScript({
      msg: '签名失败',
      type: 'SIGNDATARETURN',
      status: 'fail'
    }, (response) => {
      console.log(response)
    })
  })
}