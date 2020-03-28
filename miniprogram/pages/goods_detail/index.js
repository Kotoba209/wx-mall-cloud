import regeneratorRuntime from '../../lib/runtime/runtime';
var WxParse = require('../../wxParse/wxParse.js');
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
    goodsObj: {},
    isCollect: false,
  },

  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   * 
   */

  onShow: function () {
    // const products = wx.getStorageSync('products') || [];
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      id
    } = options;
    this.getGoodsDetail(id);
  },

  getGoodsDetail(idNumber) {
    const that = this;
    db.collection('goodDetail').where({
      id: '266976' // 这里的266976应该写的idNumber, 但是我的商品详情里面只有一条数据， 所以就先这样写， 需要自己改一下
    }).get({
      //如果查询成功的话
      success(res) {
        const data = res.data[0] || [];
        that.GoodsInfo = data;
        let collect = wx.getStorageSync('collect') || [];
        let isCollect = collect.some(v => v.basicInfo.id === that.GoodsInfo.basicInfo.id);
        that.setData({
          goodsObj: {
            goods_name: data.basicInfo.name,
            goods_price: data.basicInfo.minPrice,
            goods_introduce: data.content,
            pics: data.pics,
            base_info_id: data.basicInfo.id
          },
          isCollect,
        });
        WxParse.wxParse('article', 'html', data.content, that, 5);
      },
    })
    this.productViewsRecord(this.data.goodsObj)
  },
  productViewsRecord(obj) {
    const products = wx.getStorageSync('products') || [];

    let index = products.findIndex(v => v.pics[0].goodsId === obj.pics[0].goodsId);

    if (index === -1) {
      products.push(obj);
    } else {
      products.splice(index, 1)
      products.unshift(obj)
    }
    wx.setStorageSync('products', products);
  },

  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pic);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },

  // 加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || [];
    let test = [];
    let arr = test.map(val => val.id);
    console.log(arr, '<-arr->');
    let index = cart.findIndex(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    } else {
      // 已存在购物车数据， 当前商品的数量
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
    });
  },

  handleBuyNow() {
    const {
      GoodsInfo
    } = this
    wx.setStorageSync('single', [GoodsInfo]);
    wx.navigateTo({
      url: '/pages/pay/index',
      success: () => {
        this.handleReverseProCd();
      }
    });
  },

  handleReverseProCd() {
    let cart = wx.getStorageSync('cart') || [];
    let newCart = cart.map(v => {
      return {
        ...v,
        checked: false,
      }
    });
    wx.setStorageSync('cart', newCart);
  },

  // 点击 收藏商品
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync('collect') || [];
    let index = collect.findIndex(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);

    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      });
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    });
  },
})