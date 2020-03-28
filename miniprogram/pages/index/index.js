//Page Object
const WXAPI = require('apifm-wxapi');
const app = getApp(); // 获取全局


// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'serve-kto209'
})

Page({
  data: {
    swiperList: [],
    catesList: [],
    goodsList: [],
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getGoodsList();
  },

  getSwiperList() {
    var that = this;

    db.collection('banners').get({
      //如果查询成功的话
      success(res) {
        that.setData({
          swiperList: res.data,
        })
      },
    })
  },
  getCateList() {
    var that = this;

    db.collection('category').get({
      //如果查询成功的话
      success(res) {
        that.setData({
          catesList: res.data,
        })
      },
    })
  },

  getGoodsList() {
    var that = this;

    db.collection('goods').get({
      //如果查询成功的话
      success(res) {
        that.setData({
          goodsList: res.data,
        })
      },
    })
  },
  handleToCategory(e) {

    getApp().globalData.custom = {
      index: e.currentTarget.dataset.index,
      id: e.currentTarget.dataset.id
    };

    wx.switchTab({
      url: '/pages/category/index',
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  }
  // url="/pages/category/index" open-type="switchTab"
});