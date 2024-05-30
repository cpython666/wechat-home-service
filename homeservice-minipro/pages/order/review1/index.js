Page({
  data: {
    order: {},
    review: ''
  },
  onLoad: function (options) {
    const orderId = options.order_id;
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(order => order.order_id === orderId) || {};
    this.setData({
      order
    });
  },
  onReviewInput: function (e) {
    this.setData({
      review: e.detail.value
    });
  },
  submitReview: function () {
    const { review, order } = this.data;
    if (!review) {
      wx.showToast({
        title: '请输入投诉内容',
        icon: 'none'
      });
      return;
    }
     // 添加投诉纠纷到数据库
     const data = {
      order_id: order.order_id,
      review: review,
    }
    wx.request({
      url: `http://localhost:8000/add_review`,
      method: 'GET',
      data: data,
      success: (response) => {
        wx.showToast({
          title: '投诉纠纷上传成功',
          icon: 'success'
        });

      },
      fail: (error) => {
        wx.showToast({
          title: '更改订单状态失败',
          icon: 'none'
        });
      }
    });


    const orders = wx.getStorageSync('orders') || [];
    const updatedOrders = orders.map(o => {
      if (o.order_id === order.order_id) {
        return {
          ...o,
          review: review,
          review_status: '待处理'
        };
      }
      return o;
    });
    wx.setStorageSync('orders', updatedOrders);
    wx.showToast({
      title: '投诉已提交',
      icon: 'success'
    });
    wx.navigateBack();
  }
})
