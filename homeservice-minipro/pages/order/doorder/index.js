// pages/orderDetail/orderDetail.js
Page({
  data: {
      order: {
          id: '123456',
          serviceType: '深度清洁',
          status: '进行中',
          progress: 60,
          feedback: ''
      }
  },
  onLoad: function(options) {
      // 此处可以替换为从服务器获取订单详情
  },
  onFeedbackInput: function(e) {
      this.setData({
          'order.feedback': e.detail.value
      });
  },
  submitFeedback: function() {
      if (this.data.order.feedback.trim() === '') {
          wx.showToast({
              title: '请先输入评价内容',
              icon: 'none'
          });
          return;
      }
      // 提交评价到服务器
      console.log('评价内容:', this.data.order.feedback);
      wx.showToast({
          title: '评价提交成功',
          icon: 'success'
      });
      // 此处可以添加将评价内容发送到服务器的代码
  }
});
