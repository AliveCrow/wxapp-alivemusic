// pages/Play/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songData:{},
    playerBgc:String,
    progress:{
      percent:0,
      activeColor:'#1976D2',
      duration:1000,
      strokeWidth:3,
      borderRadius:3,
      backgroundColor:"#fff"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('playerGetSongData',(songData)=>{
      this.setData({
        songData:songData,
        playerBgc:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.track_info.album.mid}.jpg`
      })
      wx.setNavigationBarTitle({
        title: songData.track_info.name,
      })
    })
    eventChannel.on('backgroundAudioManager',(backgroundAudioManager)=>{
      backgroundAudioManager.onTimeUpdate((e)=>{
        console.log(backgroundAudioManager);
        let percent = Math.floor
        (backgroundAudioManager.currentTime * 100/backgroundAudioManager.duration)
        console.log(percent);
      })
    })
  },
  
  //初始player
  init(){

  },
  //
  get(){

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})