Page({
  data: {
    services: [],
    selectedService: null,
    selectedDate: '',
    selectedStartTime: '9:00',
    selectedDuration: '',
    availableWorkers: [],
    selectedWorker: null,
    remark: '',
    hours: Array.from({ length: 24 }, (_, i) => i + 1), // 1 到 24 小时
    totalAmount: 0
  },
  onLoad: function (options) {
    const serviceId = options.serviceId;
    const services = wx.getStorageSync('serviceData') || [];
    const selectedService = services.find(service => service.id == serviceId);

    this.setData({
      services,
      selectedService
    });
  },
  onServiceChange: function (e) {
    const selectedService = this.data.services[e.detail.value];
    this.setData({
      selectedService
    });
  },
  onDateChange: function (e) {
    this.filterAvailableWorkers()
    this.setData({
      selectedDate: e.detail.value
    });
  },
  onStartTimeChange: function (e) {
    this.setData({
      selectedStartTime: e.detail.value
    });
  },
  onDurationChange: function (e) {
    const selectedDuration = this.data.hours[e.detail.value];
    this.setData({
      selectedDuration
    }, this.calculateTotalAmount);
  },
  onWorkerChange: function (e) {
    const selectedWorker = this.data.availableWorkers[e.detail.value];
    this.setData({
      selectedWorker
    });
  },
  onRemarkChange: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },
  filterAvailableWorkers: function () {
    // 假设我们有服务人员数据
    const workers = [
      { id: 0, name: 'worker0', available: true },
      { id: 1, name: 'worker1', available: true },
      { id: 2, name: 'worker2', available: false }
    ];

    // 根据日期和时间筛选可用服务人员
    const availableWorkers = workers.filter(worker => worker.available);
    console.log(availableWorkers)
    this.setData({
      availableWorkers
    });
  },
  calculateTotalAmount: function () {
    if (this.data.selectedService && this.data.selectedDuration) {
      const totalAmount = this.data.selectedService.price_per_hour * this.data.selectedDuration;
      this.setData({
        totalAmount
      });
    }
  },
  createOrder: function () {
    const { selectedService, selectedDate, selectedStartTime, selectedDuration, selectedWorker, remark, totalAmount } = this.data;
  
    if (!selectedService || !selectedDate || !selectedStartTime || !selectedDuration || !selectedWorker) {
      wx.showToast({
        title: '请完整填写订单信息',
        icon: 'none'
      });
      return;
    }
  
    const user = wx.getStorageSync('user') || [];
    const endTime = this.calculateEndTime(selectedStartTime, selectedDuration);
  
    const newOrder = {
      order_id: Date.now().toString(),
      customer_name: user.username,
      service_type: selectedService.name,
      service_date: `${selectedDate}`,
      status: '待确认',
      duration: selectedDuration,
      worker_name: selectedWorker.name,
      service_start_time: `${selectedStartTime}`,
      service_end_time: `${endTime}`,
      service_cost: totalAmount,
      remark: remark
    };
    console.log(newOrder)
  
    wx.request({
      url: `http://localhost:8000/create_order`,
      method: 'GET',
      data: newOrder,
      success: (response) => {
        wx.showToast({
          title: '订单已创建',
          icon: 'success'
        });
  
        // 存储订单到本地存储
        const orders = wx.getStorageSync('orders') || [];
        orders.push(newOrder);
        wx.setStorageSync('orders', orders);
  
        // 返回首页或订单管理页面
        wx.navigateBack();
      },
      fail: (error) => {
        wx.showToast({
          title: '创建订单失败',
          icon: 'none'
        });
      }
    });
  },
  calculateEndTime: function (startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + duration) % 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
})
