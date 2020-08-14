function test() {
  alert('test')
}

// 发送打开插件主页请求

function openWindow(data) {
  data = data || ''
  window.postMessage({
    cmd: 'OPENWINDOW',
    data: data
  })
}