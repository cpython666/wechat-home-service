// const request = require('./request.js'); // 引入配置文件
function showToast(message) {
  wx.showToast({
    title: message, // 要显示的文本内容
    icon: 'none', // 图标，'none' 表示不显示图标，'success' 表示成功图标，'loading' 表示加载中图标
    duration: 2000 // 持续时间，单位为毫秒，默认值为 1500
  });
}
function goToUrl(url_) {
  wx.navigateTo({
    url: url_,
  })
}

module.exports = {
  showToast: showToast,
  goToUrl:goToUrl,
  // httpRequest:request.httpRequest,
};