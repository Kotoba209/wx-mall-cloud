const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

const app = getApp()

// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'serve-kto209'
})

Page({
  data: {
    addressList: []
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    WXAPI.updateAddress({
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 'true'
    }).then(function (res) {
      wx.navigateBack({})
    })
  },

  addAddess: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function () {},
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initShippingAddress();
      } else {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/user/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  initShippingAddress: function () {
    var that = this;

    db.collection('addressList').get({
      //如果查询成功的话
      success(res) {
        that.setData({
          addressList: res.data || [],
        })
      },
    })
  }

})