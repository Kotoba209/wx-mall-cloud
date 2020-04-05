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

  async selectTap(e) {
    var id = e.currentTarget.dataset.id;

    // 请求云函数, 对应的云函数实现在 cloudfunctions 目录下
    await wx.cloud.callFunction({
      name: 'selectAddress', // 调用云函数
      data: {
        id,
      }, // 传id参数
      success: this.setDefault(id),
      fail: console.error
    })
  },

  setDefault(id) {
    // doc 查到对应地址数据然后把当前地址数据的isDefault设为true
    db.collection('addressList').doc(id).update({
      data: {
        isDefault: true
      },
      success: function () {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500,
          mask: false,
          success: () => {
            wx.navigateBack();
          }
        });
      }
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
    const that = this;

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