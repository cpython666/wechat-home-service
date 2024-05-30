Page({
  data: {
    orders: [],
    statusOptions: ['待确认', '已确认', '服务人员开始服务', '顾客确认开始服务', '进行中', '已完成', '已取消']
  },
  onLoad: function () {
    const orders = wx.getStorageSync('orders') || [];
    const ordersWithIndex = orders.map(order => {
      const statusIndex = this.data.statusOptions.indexOf(order.status);
      return { ...order, statusIndex };
    });
    this.setData({ orders: ordersWithIndex });
  },
  onInputChange: function (e) {
    const { id, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const orders = this.data.orders.map(order => {
      if (order.order_id === id) {
        return { ...order, [field]: value };
      }
      return order;
    });
    this.setData({ orders });
  },
  onStatusChange: function (e) {
    const { id } = e.currentTarget.dataset;
    const value = e.detail.value;
    const status = this.data.statusOptions[value];
    const orders = this.data.orders.map(order => {
      if (order.order_id === id) {
        return { ...order, status, statusIndex: value };
      }
      return order;
    });
    this.setData({ orders });
  },
  onStartTimeChange: function (e) {
    const { id } = e.currentTarget.dataset;
    const value = e.detail.value;
    const orders = this.data.orders.map(order => {
      if (order.order_id === id) {
        return { ...order, service_start_time: value };
      }
      return order;
    });
    this.setData({ orders });
  },
  onEndTimeChange: function (e) {
    const { id } = e.currentTarget.dataset;
    const value = e.detail.value;
    const orders = this.data.orders.map(order => {
      if (order.order_id === id) {
        return { ...order, service_end_time: value };
      }
      return order;
    });
    this.setData({ orders });
  },
  saveOrders: function () {
    wx.setStorageSync('orders', this.data.orders);
    wx.showToast({
      title: '订单已保存',
      icon: 'success'
    });
  }
})
