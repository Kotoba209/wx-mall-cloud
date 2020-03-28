// pages/category/index.js
import regeneratorRuntime from '../../lib/runtime/runtime';
const WXAPI = require('apifm-wxapi');
const app = getApp();

// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'serve-kto209'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0,
  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const {
      custom
    } = getApp().globalData;

    this.handleItemTap(custom);


    const CatesName = wx.getStorageSync('CatesName');
    const CatesList = wx.getStorageSync('CatesList');
    if (!CatesName) {
      this.getCatesList();
    } else {
      if (Date.now() - CatesName.time > 1000 * 10) {
        this.getCatesList();
      } else {
        // 可以使用旧的数据
        // const { custom = {} } = getApp().globalData;
        this.Cates = CatesList.data;
        let leftMenuList = CatesName.data;
        let rightContent = null;
        if (custom) {
          rightContent = this.Cates.filter(v => v.categoryId == custom.id)
        } else {
          rightContent = this.Cates.filter(v => v.categoryId == leftMenuList[0].id)
        }
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCatesList() {
    const {
      custom
    } = getApp().globalData;

    const that = this;

    await db.collection('category').get({
      success(res) {
        const {
          data
        } = res;
        let leftMenuList = data.map(v => {
          return {
            id: v.id,
            name: v.name
          }
        });
        wx.setStorageSync('CatesName', {
          time: Date.now(),
          data: leftMenuList
        });
        that.setData({
          leftMenuList,
        })
      },
    })


    await db.collection('goods').get({
      //如果查询成功的话
      success(res) {
        const {
          data
        } = res;
        that.Cates = data;
        wx.setStorageSync('CatesList', {
          time: Date.now(),
          data: that.Cates
        });
        let rightContent = null;
        if (custom) {
          rightContent = data.filter(v => v.categoryId === custom.id)
        } else {
          rightContent = data.filter(v => v.categoryId === that.data.leftMenuList[0].id)
        }
        that.setData({
          rightContent,
        })
      },
    })
  },
  handleItemTap(e) {
    let id = null;
    let index = 0;
    if (e) {
      if (!e.currentTarget) {
        id = e.id;
        index = e.index
      } else {
        id = e.currentTarget.dataset.id;
        index = e.currentTarget.dataset.index;
      }
    }

    let rightContent = this.Cates.filter(v => v.categoryId == id);
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    })

    // const {
    //   id,
    //   index,
    // } = e.currentTarget.dataset;
  },
})