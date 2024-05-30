Page({
  data: {
    order_id: '',
    review: ''
  },
  onLoad: function (options) {
    this.setData({ order_id: options.order_id });
  },
  onInput: function (e) {
    this.setData({ review: e.detail.value });
  },
  submitReview: function () {
    if (this.data.review.trim() === '') {
      wx.showToast({
        title: '评价内容不能为空',
        icon: 'none'
      });
      return;
    }

    // 在这里处理评价提交逻辑，例如将评价内容发送到服务器
    wx.showToast({
      title: '评价已提交',
      icon: 'success'
    });

    // 返回订单详情页面
    wx.navigateBack();
  }
})
