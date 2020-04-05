const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
//获取应用实例
var app = getApp()

// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'serve-kto209'
})

Page({
  data: {
    showRegionStr: '请选择',
    addressData: {},
  },

  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      id
    } = options;
    this.queryAddress(id);
  },


  async queryAddress(id) {
    const that = this;
    // 判断有无id， 有id则是走的编辑接口
    if (id) {
      await db.collection('addressList').where({
          _id: id
        })
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            that.setData({
              addressData: res.data[0] || [],
            })
          }
        })
    }
  },



  async bindSave(e) {
    // const openid = wx.getStorageSync('openid');
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    // const code = '322000';
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (!this.data.id && (!this.data.pObject || !this.data.cObject)) {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    const postData = {
      token: wx.getStorageSync('token'),
      linkMan: linkMan,
      address: address,
      mobile: mobile,
      // code: code,
      isDefault: false,
    }
    if (this.data.pObject) {
      postData.provinceId = this.data.pObject.id
    }
    if (this.data.cObject) {
      postData.cityId = this.data.cObject.id
    }
    if (this.data.dObject) {
      postData.districtId = this.data.dObject.id
    }
    if (this.data.selectRegion && this.data.selectRegion.length > 3) {
      const extJsonStr = {}
      let _address = ''
      for (let i = 3; i < this.data.selectRegion.length; i++) {
        _address += this.data.selectRegion[i].name
      }
      extJsonStr['街道/社区'] = _address
      postData.extJsonStr = JSON.stringify(extJsonStr)
    }
    // let apiResult
    if (that.data.addressData._id) {
      const id = that.data.addressData._id

      db.collection('addressList').doc(id).update({
        data: postData,
        success: function () {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
            mask: false,
            success: () => {
              wx.hideLoading();
              wx.navigateBack();
            }
          });
        }
      })
      // 请求云函数, 对应的云函数实现在 cloudfunctions 目录下
      // wx.cloud.callFunction({
      //   name: 'updateAddress',
      //   data: {
      //     ...postData
      //   },
      //   success: function (res) {
      //     wx.showToast({
      //       title: '修改成功',
      //       icon: 'success',
      //       duration: 1500,
      //       mask: false,
      //       success: () => {
      //         wx.hideLoading();
      //         wx.navigateBack();
      //       }
      //     });
      //   },
      //   fail: console.error
      // })
    } else {
      // apiResult = await WXAPI.addAddress(postData)
      db.collection('addressList').add({
          // data 字段表示需新增的 JSON 数据
          data: postData
        })
        .then(res => {
          console.log(res)
        }).finally(() => {
          wx.hideLoading();
          wx.navigateBack();
        })
    }
  },
  onLoad: function (e) {
    // const _this = this
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id, '<-id->');
    console.log(e.currentTarget, '<-e.currentTarget->');
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection('addressList').doc(id).remove({
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
                mask: false,
                complete: () => {
                  wx.navigateBack({})
                }
              });
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx() {
    // TODO 退换货 未完成
    AUTH.checkAndAuthorize('scope.address').then(() => {
      wx.chooseAddress({
        success: (res) => {
          this.setData({
            wxaddress: res
          });
        }
      })
    })
  },
  showRegionSelect() {
    // 地区选择
    this.setData({
      showRegionSelect: true
    })
  },
  closeAddress() {
    this.setData({
      showRegionSelect: false
    })
  },
  selectAddress(e) {
    console.log(123, e.detail)
    const pObject = e.detail.selectRegion[0]
    const cObject = e.detail.selectRegion[1]
    const dObject = e.detail.selectRegion[2]
    let showRegionStr = ''
    e.detail.selectRegion.forEach(ele => {
      showRegionStr += ele.name
    })
    this.setData({
      pObject: pObject,
      cObject: cObject,
      dObject: dObject,
      showRegionStr: showRegionStr,
      selectRegion: e.detail.selectRegion
    })
  },
})