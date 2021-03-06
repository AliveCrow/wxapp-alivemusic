// pages/list/index.js
let pageNo = 1;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult:[],
    keyword:String
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('searchResult', function(data) {
      _this.setData({
        searchResult:data.searchResult,
        keyword:options.keyword
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '搜索结果',
    })
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
    pageNo+=1;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.api.dev+`/search?key=${this.data.keyword}&pageNo=${pageNo}`,
      success:(res)=>{
        let arr =  this.data.searchResult.concat(res.data.data.list)
        this.setData({
          searchResult:arr
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //节流
  debounce(){

  },
  setList(){

  }
})