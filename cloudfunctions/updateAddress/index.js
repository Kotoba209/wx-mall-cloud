// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'serve-kto209'
})

const db = cloud.database() //云端不要加wx.这个是错误的：wx.cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event, '<-event->');
  const wxContext = cloud.getWXContext()

  console.log(wxContext, '<-wxContext->');

  const {
    OPENID
  } = wxContext

  const {
    id
  } = event

  const address = db.collection('addressList').where({
    _id: id
  }).update({
    data: event,
    success(res) {
      console.log('更新成功', res)
    },
    fail: err => {
      console.log('失败')
    }
  })

  return address;

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}