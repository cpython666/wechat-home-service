Page({
  data: {
    order: {},
    serviceStartImage: null, // 存储选择的开始服务图片路径
    serviceEndImage: null, // 存储选择的结束服务图片路径
    imagePrefix: 'http://127.0.0.1:8000' // 图片 URL 前缀
  },
  onLoad: function (options) {
    const orderId = options.order_id;
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(order => order.order_id === orderId) || {};
    this.setData({ order });
  },
  updateOrderStatus: function (status) {
    const orderId = this.data.order.order_id;
    let orders = wx.getStorageSync('orders') || [];
    orders = orders.map(order => {
      if (order.order_id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    wx.setStorageSync('orders', orders);
    this.setData({ order: { ...this.data.order, status } });
    wx.showToast({
      title: '状态已更新',
      icon: 'success'
    });
    // 更改数据库的订单状态
    const data = {
      order_id: this.data.order.order_id,
      status: status
    };
    wx.request({
      url: `http://localhost:8000/change_order_status`,
      method: 'GET',
      data: data,
      success: (response) => {
        wx.showToast({
          title: '订单状态已更改',
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
  },
  confirmOrder: function () {
    this.updateOrderStatus('已确认');
  },
  chooseStartImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          serviceStartImage: tempFilePaths[0]
        });
        that.uploadStartImage();
      }
    });
  },
  chooseEndImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          serviceEndImage: tempFilePaths[0]
        });
        that.uploadEndImage();
      }
    });
  },
  uploadStartImage: function () {
    const that = this;
    if (!this.data.serviceStartImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }
    wx.uploadFile({
      url: 'http://localhost:8000/upload_service_start_image/',
      filePath: this.data.serviceStartImage,
      name: 'service_start_image',
      formData: {
        'order_id': this.data.order.order_id
      },
      success: function (res) {
        const data = JSON.parse(res.data);
          wx.showToast({
            title: '图片上传成功',
            icon: 'success'
          });
          // 更新订单状态和本地存储的图片路径
          that.updateOrderStatusWithImage('服务人员开始服务', that.data.imagePrefix + data.start_photo, 'service_start_image');

      },
      fail: function (error) {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      }
    });
  },
  uploadEndImage: function () {
    const that = this;
    if (!this.data.serviceEndImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }
    wx.uploadFile({
      url: 'http://localhost:8000/upload_service_end_image/',
      filePath: this.data.serviceEndImage,
      name: 'service_end_image',
      formData: {
        'order_id': this.data.order.order_id
      },
      success: function (res) {
        console.log(res)
        const data = JSON.parse(res.data);
          wx.showToast({
            title: '图片上传成功',
            icon: 'success'
          });
          // 更新订单状态和本地存储的图片路径
          that.updateOrderStatusWithImage('已完成', that.data.imagePrefix + data.end_photo, 'service_end_image');
      },
      fail: function (error) {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      }
    });
  },
  updateOrderStatusWithImage: function (status, imageUrl, imageField) {
    const orderId = this.data.order.order_id;
    let orders = wx.getStorageSync('orders') || [];
    orders = orders.map(order => {
      if (order.order_id === orderId) {
        return { ...order, status, [imageField]: imageUrl };
      }
      return order;
    });
    wx.setStorageSync('orders', orders);
    this.setData({
      order: { ...this.data.order, status, [imageField]: imageUrl }
    });
    wx.showToast({
      title: '状态已更新',
      icon: 'success'
    });
  },
  confirmServiceStart: function () {
    this.updateOrderStatus('顾客确认开始服务');
  },
  complateService: function () {
    this.chooseEndImage();
  },
  reviewService: function () {
    wx.navigateTo({
      url: `/pages/review/review?order_id=${this.data.order.order_id}`
    });
  }
});
