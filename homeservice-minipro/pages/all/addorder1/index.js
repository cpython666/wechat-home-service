Page({
  data: {
      services: [
          { id: 1, name: '家庭深度清洁' },
          { id: 2, name: '日常保洁' },
          { id: 3, name: '新居开荒' }
      ],
      selectedService: {},
      selectedDate: '',
      selectedTime: '',
      customerName: '',
      customerPhone: '',
      dateStart: '2024-01-01',
      dateEnd: '2025-12-31'
  },
  onLoad: function() {
      this.setData({
          selectedService: this.data.services[0]
      });
  },
  onServiceChange: function(e) {
      this.setData({
          selectedService: this.data.services[e.detail.value]
      });
  },
  onDateChange: function(e) {
      this.setData({
          selectedDate: e.detail.value
      });
  },
  onTimeChange: function(e) {
      this.setData({
          selectedTime: e.detail.value
      });
  },
  onNameInput: function(e) {
      this.setData({
          customerName: e.detail.value
      });
  },
  onPhoneInput: function(e) {
      this.setData({
          customerPhone: e.detail.value
      });
  },
  submitBooking: function() {
      // 在这里处理预约逻辑，比如验证输入和发送数据到服务器
      console.log('提交预约', this.data);
      // 实际开发中，这里会是一个wx.request的调用
  }
});
