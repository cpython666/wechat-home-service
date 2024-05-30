Page({
  data: {
    orders: [],
    worker: {
      username: "worker0" // 假设当前工作人员的用户名
    }
  },

  onShow: function () {
    // 模拟从存储中获取的订单数据
    const allOrders = wx.getStorageSync('orders') || [];

    // 过滤符合工作人员昵称的订单
    const filteredOrders = allOrders.filter(order => {
      return order.worker_name === this.data.worker.username;
    });

    // 根据服务时间排序订单
    filteredOrders.sort((a, b) => {
      return new Date(a.service_date.replace(/-/g, '/')).getTime() - new Date(b.service_date.replace(/-/g, '/')).getTime();
    });

    // 设置过滤和排序后的订单到data中
    this.setData({ orders: filteredOrders });
  },

  viewOrderDetail: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/worker/detail/index?order_id=${orderId}`
    });
  }
});
