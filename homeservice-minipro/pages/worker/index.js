Page({
  data: {},
  onLoad: function () {
    const worker={
      username: 'worker0',  // 从后台获取登录的用户名
      name: '张三',  // 真实姓名
      phone: '1234',  // 电话
      gender: '男',  // 性别
      userType: '工作人员'  // 用户类型
    }
    // 页面加载时执行的逻辑
    this.setData({ worker });
    wx.setStorageSync('worker', worker);
  },
  goToSchedule: function () {
    wx.navigateTo({
      url: '/pages/worker/sche/index'
    });
  },
  goToOrder: function () {
    wx.navigateTo({
      url: '/pages/worker/order/index'  // 假设你有一个任务页面
    });
  }
  
})
