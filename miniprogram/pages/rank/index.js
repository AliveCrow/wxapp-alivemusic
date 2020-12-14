// pages/rank/index.js
let pageNo = 1;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankData:[],
    list:[],
    topId:String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topId:options.topId
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    pageNo+=1
    wx.request({
      url: app.globalData.api.dev +`/top?id=${this.data.topId}&pageSize=20&pageNo=${pageNo}`,
      success:res=>{
        let total = res.data.data.total
        let pageSize = 20
        if(total/pageSize < pageNo){
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 2000
          })
          return
        }
        let arr = this.data.list.concat(res.data.data.list)
        this.setData({
          list:arr,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  init(){
    wx.request({
      url: app.globalData.api.dev +`/top?id=${this.data.topId}&pageSize=20`,
      success:res=>{
        this.setData({
          rankData:res.data.data,
          list:res.data.data.list

        })
      }
    })
  }
})