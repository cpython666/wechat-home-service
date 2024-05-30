Page({
  data: {
    order: {}
  },
  onLoad: function (options) {
    const orderId = options.order_id;
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(order => order.order_id === orderId) || {};
    this.setData({ order });
  },
  updateOrderStatus: function (status) {
    const orderId = this.data.order.order_id;
    let orders = wx.getStorageSync('orders') || [];
    orders = orders.map(order => {
      if (order.order_id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    wx.setStorageSync('orders', orders);
    this.setData({ order: { ...this.data.order, status } });
    wx.showToast({
      title: '状态已更新',
      icon: 'success'
    });
  },
  confirmOrder: function () {
    this.updateOrderStatus('已确认');
  },
  startService: function () {
    this.updateOrderStatus('服务人员开始服务');
  },
  confirmServiceStart: function () {
    this.updateOrderStatus('顾客确认开始服务');
  },
  endService: function () {
    this.updateOrderStatus('已完成');
  },
  reviewService: function () {
    wx.navigateTo({
      url: `/pages/review/review?order_id=${this.data.order.order_id}`
    });
  }
})
