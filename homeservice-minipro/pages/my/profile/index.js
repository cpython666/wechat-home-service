Page({
  data: {
    username: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  },

  onLoad: function () {
    const user = wx.getStorageSync('user')
    var that = this;
    // 获取本地存储中的用户信息
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          username: user.username,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address
        });
      },
      fail() {
        // 如果没有存储数据，则使用模拟数据
        that.setData({
          username: user.username,
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '12345678901',
          address: '民族大道666号'
        });
      }
    });
  },

  formSubmit: function (e) {
    const user = wx.getStorageSync('user')
    var that = this;
    const userInfo = {
      username: user.username,
      name: e.detail.value.name,
      email: e.detail.value.email,
      phone: e.detail.value.phone,
      address: e.detail.value.address
    };
    wx.request({
      url: `http://localhost:8000/update_customer`,
      method: 'GET',
      data: userInfo,
      success: (response) => {
        console.log(response)
      },
      fail: (error) => {}
    });
    // 将用户信息保存到本地存储
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
      success() {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        that.setData(userInfo);
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});