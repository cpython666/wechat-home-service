// pages/feedback/feedback.js
Page({
  data: {
      service: {
          id: '1234567',
          name: '深度家庭清洁',
          detail: '包括厨房、卫生间、客厅和卧室的深度清洁'
      },
      ratings: [1, 2, 3, 4, 5],
      selectedRating: 5, // 默认五星
      comment: ''
  },
  onRatingChange: function(e) {
      this.setData({
          selectedRating: this.data.ratings[e.detail.value]
      });
  },
  onCommentInput: function(e) {
      this.setData({
          comment: e.detail.value
      });
  },
  submitFeedback: function() {
      const { selectedRating, comment } = this.data;
      if (!comment.trim()) {
          wx.showToast({
              title: '请填写评价内容',
              icon: 'none'
          });
          return;
      }
      console.log('提交的评分:', selectedRating, '提交的评价:', comment);
      wx.showToast({
          title: '感谢您的反馈!',
          icon: 'success'
      });
      // 此处应发送数据到服务器
  }
});
