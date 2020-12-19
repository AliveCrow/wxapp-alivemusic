//app.js
import { api } from './ulits/api'
import Player from './ulits/Player'
let db
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-3dewj',
        traceUser: true
      })
      db = wx.cloud.database()
    }
    wx.showLoading({
      title: '初始化中',
    })
    //判断是否授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          this.globalData.userInfo = {}
          this.globalData.openid ='0'
          this.globalData.logined = false
          wx.hideLoading()

          return
        }
        wx.login({
          timeout: 5000,
          success: login => {
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcd6a5a953f46432a&secret=c089429b6f74f9251d0ed36f7c770f11&js_code=${login.code}&grant_type=authorization_code`,
              success: openid => {
                wx.getUserInfo({
                  success:getUserInfo=>{
                    this.globalData.userInfo = getUserInfo.userInfo
                    this.globalData.openid = openid.data.openid
                    this.globalData.logined = true
                    wx.hideLoading()
                  }
                })

              }
            })
          }
        })
      }
    })

    this.globalData = {
      api: api,
      logined: false,
      myPlayer: new Player(),
      userInfo:{},
      openid:'0'
    }
  }
})
