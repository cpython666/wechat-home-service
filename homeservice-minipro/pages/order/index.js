Page({
  data: {
    orders: []
  },
  onShow: function () {
    let orders = wx.getStorageSync('orders') || [];
    const currentTimestamp = Date.now(); // 当前时间的时间戳
    const user=wx.getStorageSync('user')
    // 过滤并排序订单
    orders = orders.filter(order => {
      // const orderTimestamp = parseInt(order.order_id, 10); // 将订单号解析为整数
      // return orderTimestamp >= currentTimestamp - (currentTimestamp % 86400000); // 只保留今天及之后的订单
      return user.username===order.customer_name
    }).sort((a, b) => parseInt(a.order_id, 10) - parseInt(b.order_id, 10)); // 按订单号（时间戳）先后排序
    console.log(orders)
    this.setData({ orders });
  },
  goToOrderDetail: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail/index?order_id=${orderId}`
    });
  }
})

