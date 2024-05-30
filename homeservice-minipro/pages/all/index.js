Page({
  data: {
    serviceData: []
  },
  onLoad: function() {
    const serviceData = wx.getStorageSync('serviceData') || [];
    this.setData({
      serviceData: serviceData.map(service => {
        return {
          ...service,
          image: '/images/types/' + service.image_name // 假设服务项包含 image_name 字段
        };
      })
    });
  },
  goToAddOrder: function(e) {
    const serviceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/all/addorder/index?serviceId=${serviceId}`
    });
  }
})
