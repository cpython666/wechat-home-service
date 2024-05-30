Page({
  data: {
      correctUsername: 'worker', // 预设账号
      correctPassword: '123456' // 预设密码
  },

  formSubmit: function(e) {
      const username = e.detail.value.username;
      const password = e.detail.value.password;
      wx.reLaunch({
        url: '/pages/worker/index'
      })
      // if (username === this.data.correctUsername && password === this.data.correctPassword) {
      //     // 登录成功，跳转到工作人员页面
      //     wx.reLaunch({
      //       url: '/pages/worker/index'
      //     })
      // } else {
      //     // 登录失败，弹窗提示
      //     wx.showToast({
      //         title: '账号密码错误',
      //         icon: 'none',
      //         duration: 2000
      //     });
      // }
  }
});
