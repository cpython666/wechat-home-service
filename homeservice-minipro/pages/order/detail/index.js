Page({
  data: {
    order: {},
    feedback: '',
    score: '' // 新增的打分数据
  },
  onLoad: function (options) {
    const orderId = options.order_id;
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(order => order.order_id === orderId) || {};
    this.setData({
      order,
      feedback: order.feedback || ''
    });
    const d = {
      order_id: order.order_id
    }
    if (order.review) {
      wx.request({
        url: `http://localhost:8000/query_review`,
        method: 'GET',
        data: d,
        success: (response) => {
          console.log(response)
          const review = response.data
          this.setData({
            review: {
              ...review,
            }
          });
          // wx.showToast({
          //   title: '订单状态已更改',
          //   icon: 'success'
          // });
        },
        fail: (error) => {
          // wx.showToast({
          //   title: '更改订单状态失败',
          //   icon: 'none'
          // });
        }
      });
    }
  },
  confirmOrder: function () {
    this.updateOrderStatus('已确认');
  },
  cancelOrder: function () {
    this.updateOrderStatus('已取消');
  },
  deleteOrder: function () {
    const orders = wx.getStorageSync('orders') || [];
    const updatedOrders = orders.filter(order => order.order_id !== this.data.order.order_id);
    wx.setStorageSync('orders', updatedOrders);
    wx.showToast({
      title: '订单已删除',
      icon: 'success'
    });
    wx.navigateBack();
  },
  newOrder: function () {
    wx.navigateTo({
      url: '/pages/all/addorder/index',
    });
  },
  confirmServiceStart: function () {
    this.updateOrderStatus('顾客确认开始服务');
  },
  updateOrderStatus: function (status) {
    const orders = wx.getStorageSync('orders') || [];
    const updatedOrders = orders.map(order => {
      if (order.order_id === this.data.order.order_id) {
        return {
          ...order,
          status: status
        };
      }
      return order;
    });
    wx.setStorageSync('orders', updatedOrders);
    this.setData({
      order: {
        ...this.data.order,
        status: status
      }
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
  onFeedbackInput: function (e) {
    this.setData({
      feedback: e.detail.value
    });
  },
  saveFeedback: function () {
    const {
      feedback,
      order
    } = this.data;
    if (!feedback) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      });
      return;
    }
    const orders = wx.getStorageSync('orders') || [];
    const updatedOrders = orders.map(o => {
      if (o.order_id === order.order_id) {
        return {
          ...o,
          feedback: feedback,
          status: '已评价'
        };
      }
      return o;
    });
    wx.setStorageSync('orders', updatedOrders);


    // 更改数据库的订单状态
    const data = {
      order_id: this.data.order.order_id,
      status: '已评价',
      feedback: feedback
    }
    wx.request({
      url: `http://localhost:8000/feedback_order`,
      method: 'GET',
      data: data,
      success: (response) => {
        wx.showToast({
          title: '订单状态已更改',
          icon: 'success'
        });
        // 返回首页或订单管理页面
        wx.navigateBack();
      },
      fail: (error) => {
        wx.showToast({
          title: '更改订单状态失败',
          icon: 'none'
        });
      }
    });


    this.setData({
      order: {
        ...this.data.order,
        feedback: feedback,
        status: '已评价'
      }
    });
    wx.showToast({
      title: '评价已发布',
      icon: 'success'
    });
  },
  toReview: function () {
    wx.navigateTo({
      url: `/pages/order/review1/index?order_id=${this.data.order.order_id}`
    });
  },
  // 新增的方法
  onScoreInput: function (e) {
    this.setData({
      score: e.detail.value
    });
  },
  submitScore: function () {
    const {
      score,
      order
    } = this.data;
    if (score < 0 || score > 5) {
      wx.showToast({
        title: '请输入0-5的分数',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: `http://localhost:8000/score_review/`, // 确保后端有相应的接口
      method: 'POST',
      data: {
        order_id: order.order_id,
        score: score
      },
      success: (response) => {
        wx.showToast({
          title: '打分提交成功',
          icon: 'success'
        });
        wx.reLaunch({
          url: '/pages/order/detail/index' // 当前页面的路径
        });
      },
      
      fail: (error) => {
        wx.showToast({
          title: '打分提交失败',
          icon: 'none'
        });
      }
    });
  }
});