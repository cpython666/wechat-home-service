Page({
  data: {
      faqs: [
          { id: 1, question: "如何预约服务？", answer: "您可以通过我们的小程序首页选择服务后预约。", open: false },
          { id: 2, question: "服务可以退款吗？", answer: "特定条件下，我们支持服务退款，请查看退款政策。", open: false },
      ]
  },
  toggleFaq: function(event) {
      const index = event.currentTarget.dataset.index;
      const key = `faqs[${index}].open`;
      const value = !this.data.faqs[index].open;
      this.setData({
          [key]: value
      });
  }
});
