export default {
  getStorage: (key) => {
    return new Promise(function (resolve) {
      chrome.storage.local.get(key, (items) => {
        resolve(items[key])
      })
    })
  }
}