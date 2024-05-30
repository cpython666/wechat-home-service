// request.js

const config = require('./config.js'); // 引入配置文件

/**
 * 封装 HTTP 请求方法
 * @param {string} path 请求的路径
 * @param {string} method 请求的方法，例如 'GET'、'POST'
 * @param {object} data 请求的数据，对象格式
 * @param {function} successCallback 请求成功时的回调函数
 * @param {function} failCallback 请求失败时的回调函数
 */
function httpRequest(path, method, data, successCallback, failCallback) {
    wx.request({
        url: config.BASE_URL + path, // 拼接完整的请求地址
        method: method,
        data: data,
        success: function (res) {
            if (typeof successCallback === 'function') {
                successCallback(res);
            }
        },
        fail: function (error) {
            if (typeof failCallback === 'function') {
                failCallback(error);
            }
        }
    });
}

module.exports = {
    httpRequest: httpRequest
};
