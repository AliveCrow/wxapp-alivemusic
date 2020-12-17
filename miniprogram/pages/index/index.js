// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    rank: [],
    isPlaying:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    let _this = this
    //推荐歌曲
    wx.request({
      url: app.globalData.api.dev + '/new/songs?type=0',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          songRecommend: res.data.data.list.slice(0, 6)
        })
      }
    })
    //热门歌单
    wx.request({
      url: app.globalData.api.dev + '/recommend/playlist/u',
      success: (res) => {
        this.setData({
          hotList: res.data.data.list.slice(0, 6)
        })
      }
    })
    //排行榜 -
    wx.request({
      url: app.globalData.api.dev + '/top/category',
      success: (res) => {
        //选择巅峰榜
        this.setData({
          rank: res.data.data[0].list.slice(0, 5)
        })
      }
    })
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
    if(!app.globalData.myPlayer.isPaused){
      this.setData({
        isPlaying:true
      })
    }

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
  imageLoadOver() {
    console.log('imageLoadOver');
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  detail(e){
    wx.navigateTo({
      url: `/pages/songList/index?content_id=${e.currentTarget.dataset.content_id}`
    })
  },
  setList(){
    app.globalData.myPlayer.playingList.willPlay = this.data.songRecommend
    // app.globalData.playingList.willPlay=this.data.songRecommend
  }
})