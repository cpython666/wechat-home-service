Page({
  data: {
    selectedServiceDescription: ''
},
selectCategory: function(event) {
    const category = event.currentTarget.dataset.category;
    const serviceInfo = {
        cleaning: "我们提供高质量的家庭和商业清洁服务。",
        babysitting: "专业保姆，为您的孩子提供最贴心的照顾。",
        elderly_care: "专业护理，让老年生活更加舒适和安心。",
        special: "节日大扫除、新居开荒等特色服务，满足您的特殊需求。"
    };
    this.setData({
        selectedServiceDescription: serviceInfo[category] || "请选择一个服务类别。"
    });
},
  goToNews() {
    wx.navigateTo({
      url: '/pages/index/news/index',
    })
  },
  goToAbout() {
    wx.navigateTo({
      url: '/pages/index/about/index',
    })
  },  
  goToQas() {
    wx.navigateTo({
      url: '/pages/index/qas/index',
    })
  },
  goToInfo() {
    wx.switchTab({
      url: '/pages/all/index'
    });
  }
})