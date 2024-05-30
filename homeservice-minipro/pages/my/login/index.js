// login-register.js
const request = require('../../../helper/request.js'); // 引入配置文件
const utils = require('../../../helper/utils.js'); // 引入配置文件
const cache = require('../../../helper/cache_helper.js'); // 引入配置文件

Page({
  data: {
    user:'',
    currentTab: 'login',
    username: '',
    password: '',
    newUsername: '',
    newPassword1: '',
    newPassword2: ''
  },

  // 页面加载时设置默认选项
  onLoad: function () {
    this.setData({ currentTab: 'login' });
  },

  // 切换选项卡
  toggleTab: function () {
    const tab = this.data.currentTab === 'register' ? 'login' : 'register'
    this.setData({ currentTab: tab });
  },

  // 输入用户名
  onInputUsername: function (e) {
    this.setData({ username: e.detail.value });
  },

  // 输入密码
  onInputPassword: function (e) {
    this.setData({ password: e.detail.value });
  },
  // 输入新用户名（注册）
  onInputNewUsername: function (e) {
    this.setData({ newUsername: e.detail.value });
  },

  // 输入新密码（注册）
  onInputNewPassword1: function (e) {
    this.setData({ newPassword1: e.detail.value });
  },
  onInputNewPassword2: function (e) {
    this.setData({ newPassword2: e.detail.value });
  },

  // 登录
  onLogin: function () {
    // 发送登录请求，处理逻辑
    console.log('登录', this.data.username, this.data.password);
    var data = {
      'username': this.data.username,
      'password': this.data.password
    }
    // 保存当前页面实例的引用
    const that = this;
    request.httpRequest('users/login/', 'POST', data, function (response) {
      console.log(response);
      response=response.data
      if(response.id){
        console.log('登陆成功!')
        utils.showToast('登陆成功!');
        // 暂存用户，缓存用户
        that.data.user=response
        cache.set('user', response);
        wx.switchTab({
          url: '/pages/my/index' // tabBar 页面的路径
        });
      }else{
        console.log('账号或者密码错误！');
        utils.showToast('账号或者密码错误!');
        console.log(data);
      }
    })
  },

  // 注册
  onRegister: function () {
    // 发送注册请求，处理逻辑
    console.log('注册', this.data.newUsername, this.data.newPassword1);
    if ((this.data.newPassword1 != this.data.newPassword2) && (this.data.newPassword1 != '')) {
      utils.showToast('两次密码不一致') // 要显示的文本内容
    } else {
      var data = {
        'username': this.data.newUsername,
        'password': this.data.newPassword1,
      }
      // 保存当前页面实例的引用
      const that = this;
      request.httpRequest('users/', 'POST', data, function (response) {
        // 请求成功时的处理逻辑
        response=response.data
        if (response.id) {
          console.log('注册成功', response);
          utils.showToast('注册成功！')
          that.toggleTab()
        } else {
          utils.showToast(JSON.stringify(response))
        }
      });
    }
  }
});