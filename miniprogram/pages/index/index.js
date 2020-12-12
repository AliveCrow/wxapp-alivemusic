// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songRecommend:[],
    hotList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    let _this = this
    //推荐歌曲
    wx.request({
      url: 'http://localhost:3300/new/songs?type=0',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        _this.setData({
          songRecommend:res.data.data.list.slice(0,6)
        })
      }
    })
    //热门歌单
    wx.request({
      url: 'http://localhost:3300/recommend/playlist/u',
      success:(res)=>{
        this.setData({
          hotList:res.data.data.list.slice(0,6)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  imageLoadOver(){
    console.log('imageLoadOver');
  }
})