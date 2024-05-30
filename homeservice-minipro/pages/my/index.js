const request = require('../../helper/request.js'); // 引入配置文件
const utils = require('../../helper/utils.js'); // 引入配置文件
const cache = require('../../helper/cache_helper.js'); // 引入配置文件

Page({
  data:{
    user: null,
    userprofile: '',
  },
  onLoad: function(options) {
    // 页面加载时从全局变量获取用户信息
      this.getUserInfo();
  },
  onShow: function() {
      // 页面显示时再次确认用户信息，以便捕获任何更改
      this.getUserInfo();
  },
  getUserInfo: function() {
    // 更新页面数据来反映当前用户的登录状态
    const user = cache.get('user');
    console.log(user)
    const userprofile = cache.userprofile;
    if (user) {
        this.setData({
            user: user,
            userprofile:userprofile,
        });
    }
},
  goToLogin() {
    wx.navigateTo({
      url: '/pages/my/login/index',
    })
  },
  goToProfile() {
    wx.navigateTo({
      url: '/pages/my/profile/index',
    })
  },
  goToAbout() {
    wx.navigateTo({
      url: '/pages/index/about/index',
    })
  },
  bindSetTap: function (e, skin) {
		let itemList = ['退出登录', '工作人员平台','test'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) {
          cache.remove('user')
          wx.reLaunch({
            url: '/pages/my/index' // 当前页面的路径
          });
				}
				if (idx == 1) {
						wx.reLaunch({
							url: '/pages/my/worker/index',
						});
        }
        if (idx == 2) {
          wx.reLaunch({
            url: '/pages/manage/index',
          });
      }
			},
			fail: function (res) { }
		})
	}
})