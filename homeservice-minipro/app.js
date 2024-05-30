const cache = require('./helper/cache_helper.js'); // 引入配置文件
App({
  onLaunch: function () {
    const d={order_id:111}
      wx.request({
        url: `http://localhost:8000/test_post/`,
        method: 'POST',
        data: d,
        success: (response) => {
          console.log(response)
        },
        fail: (error) => {
        }
      });

    // 应用启动时执行
    // 直接从缓存获取用户信息并更新globalData
    let userInfo = cache.get('user');
    let userProfile = cache.get('userprofile');
    if (userInfo) {
      this.globalData.user = userInfo;
    }
    if (userProfile) {
      this.globalData.userprofile = userProfile;
    }
    // console.log(this.globalData.user, this.globalData.userprofile);
    // 初始化本地存储的用户和排班数据
    const username = wx.getStorageSync('username');
    if (!username) {
      wx.setStorageSync('username', 'worker');
    }
    const schedules = wx.getStorageSync('schedules');
    console.log('App.js', schedules, schedules.length === 0)

    if (!schedules || schedules.length === 0) {
      wx.setStorageSync('schedules', [{
          date: '2024-06-16',
          timeSlots: [{
              start: '09:00',
              end: '11:59',
              active: true
            },
            {
              start: '14:00',
              end: '17:59',
              active: true
            }
          ]
        },
        {
          date: '2024-07-21',
          timeSlots: [{
            start: '09:00',
            end: '11:59',
            active: true
          }]
        }
      ]);
    }
    // 检查本地存储中是否存在订单数据
    const storedOrders = wx.getStorageSync('orders');

    if (!storedOrders || storedOrders.length === 0) {
      // 初始化订单数据
      const orders = [{
          order_id: '123456',
          customer_name: '李四',
          service_type: '家庭保洁',
          service_time: '2024-05-01 10:00',
          status: '待确认',
          worker_name: '张三',
          service_start_time: '',
          service_end_time: '',
          service_cost: ''
        },
        {
          order_id: '789012',
          customer_name: '王五',
          service_type: '电器维修',
          service_time: '2024-06-02 14:00',
          status: '进行中',
          worker_name: '李四',
          service_start_time: '',
          service_end_time: '',
          service_cost: ''
        }
        // 可以添加更多订单数据
      ];
      // 将订单数据存储到本地存储中
      wx.setStorageSync('orders', orders);
      console.log('storedServiceData:')
    }
    // 检查本地存储中是否存在服务数据
    const storedServiceData = wx.getStorageSync('serviceData');
    console.log('storedServiceData:' + storedServiceData)

    if (!storedServiceData || storedServiceData.length === 0) {
      // 初始化服务数据
      const serviceData = [{
          "id": 1,
          "name": "家庭清洁",
          "description": "包括地板清洁、灰尘擦拭、厨房和浴室表面清洁等日常家务。不包括深层清洁和大型设备清洁。",
          "category": "cleaning",
          "price_per_hour": "50.00",
          "image_name": "2.jpg"
        },
        {
          "id": 2,
          "name": "深度清洁",
          "description": "针对长时间未清洁的区域进行深层清洁，包括清洗窗帘、洗地毯、深层厨房和浴室清洁，以及室内高度灰尘清理。",
          "category": "cleaning",
          "price_per_hour": "70.00",
          "image_name": "1.jpg"
        },
        {
          "id": 3,
          "name": "洗衣服务",
          "description": "提供衣物清洗、烘干和熨烫服务。根据客户需求分拣衣物，并提供特殊衣物清洗咨询。",
          "category": "cleaning",
          "price_per_hour": "40.00",
          "image_name": "4.jpg"
        },
        {
          "id": 4,
          "name": "烹饪服务",
          "description": "根据客户提供的食谱或营养需求准备日常餐食。包括食材采购、食物准备、烹饪和厨房清理。",
          "category": "cleaning",
          "price_per_hour": "60.00",
          "image_name": "3.jpg"
        },
        {
          "id": 5,
          "name": "园艺服务",
          "description": "提供植物种植、草坪修剪、除草、花园维护和季节性植物更换等服务。",
          "category": "cleaning",
          "price_per_hour": "50.00",
          "image_name": "4.jpg"
        },
        {
          "id": 6,
          "name": "宠物照顾",
          "description": "提供宠物日常喂养、遛弯、洗澡以及基础训练服务。根据宠物种类提供定制化照顾方案。",
          "category": "cleaning",
          "price_per_hour": "40.00",
          "image_name": "9.jpg"
        },
        {
          "id": 7,
          "name": "搬家服务",
          "description": "提供家具和家居物品的打包、搬运、运输和重新安置服务。包括提供搬家前咨询和物品安全保护措施。",
          "category": "cleaning",
          "price_per_hour": "80.00",
          "image_name": "5.png"
        },
        {
          "id": 8,
          "name": "管道维修",
          "description": "提供水管漏水检测和修理、更换水龙头、清理下水道堵塞等服务。包括紧急维修服务。",
          "category": "cleaning",
          "price_per_hour": "90.00",
          "image_name": "6.jpg"
        },
        {
          "id": 9,
          "name": "电器维修",
          "description": "针对家用电器如冰箱、洗衣机、空调等提供故障诊断、修理和定期维护服务。",
          "category": "cleaning",
          "price_per_hour": "100.00",
          "image_name": "7.jpg"
        },
        {
          "id": 10,
          "name": "室内装修",
          "description": "提供室内设计咨询、油漆、安装地板、装修建议和实施服务。针对小型修缮到全屋翻新提供解决方案。",
          "category": "cleaning",
          "price_per_hour": "120.00",
          "image_name": "8.png"
        },
        {
          "id": 11,
          "name": "窗户清洁",
          "description": "为室内外窗户和玻璃门提供清洁服务，包括难以到达的高窗和特殊材料窗户的安全清洁。",
          "category": "cleaning",
          "price_per_hour": "120.00",
          "image_name": "9.jpg"
        },
        {
          "id": 12,
          "name": "保姆服务",
          "description": "为家庭提供儿童日常看护、教育游戏活动、学前学习支持和儿童安全保障服务。",
          "category": "cleaning",
          "price_per_hour": "50.00",
          "image_name": "8.png"
        }
      ];
      // 将服务数据存储到本地存储中
      wx.setStorageSync('serviceData', serviceData);
    }
  },
  globalData: {
    user: null,
    userprofile: null,
    someSetting: {}
  },
  logout: function () {
    // 清空全局数据
    this.globalData.user = null;
    this.globalData.userprofile = null;
    // 清除缓存中的用户信息
    cache.remove('user');
    cache.remove('userprofile');
    // 可以添加更多的登出逻辑，例如跳转到登录页面等

    utils.showToast('已退出登录！')

    console.log("用户已登出");
  },
});