// pages/Play/index.js
const app = getApp()
let player = app.globalData.player
let backgroundAudioManager

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: "00:00",
    duration: "00:00",
    songData: {},
    playerBgc: String,
    // backgroundAudioManager: {},
    paused: true,
    seek: false,
    value: Number,
    progress: {
      value: Number,
      max: Number,
      activeColor: "#1976D2",
      blockSize: 3,
      backgroundColor: "#fff"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    backgroundAudioManager = app.globalData.backgroundAudioManager
    this.setData({
      currentTime: player.currentTime,
      duration: player.duration,
      progress: {
        value: player.progress.value,
        max: player.progress.max
      },
      songData: app.globalData.playingList.isPlaying,
      playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`
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
    this.setData({
      paused: app.globalData.backgroundAudioManager.paused
    })
    this.update()
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

  //初始player
  init() {
    backgroundAudioManager.onCanplay(() => {
      //初始化播放器-设置时长
      backgroundAudioManager.onPlay(() => {
        let duration = this.formatTime(backgroundAudioManager.duration)
        //设置全局Player变量

        player.duration = duration
        player.progress.max = Math.floor(backgroundAudioManager.duration)

        this.setData({
          duration: player.duration,
          paused: false,
          progress: {
            value: player.progress.value,
            max: player.progress.max,
          }
        })
      
      });
      backgroundAudioManager.onPause(() => {

        //设置全局Player变量
        player.progress.value = this.data.value

        this.setData({
          progress: {
            value: player.progress.value
          },
        })
      })

      //进度更新
      this.init()

      //进度条拖动完成后播放
      backgroundAudioManager.onSeeked(() => {
        this.setData({
          move: false
        })
        backgroundAudioManager.play()
      })

      //播放结束后的动作
      backgroundAudioManager.onEnded(() => {
        this.reset()

      })
    })
  },
  //
  formatTime(time) {
    let min = Math.floor(time / 60)
    let sec = Math.floor(time % 60)
    if (min < 10) min = '0' + min
    if (sec < 10) sec = '0' + sec
    return `${min}:${sec}`
  },

  //play
  play() {
    app.globalData.backgroundAudioManager.play()
    this.setData({
      paused: false
    })
  },
  //pause
  pause() {
    app.globalData.backgroundAudioManager.pause()
    this.setData({
      paused: true
    })
  },
  update() {
    let updateId = setInterval(()=>{
      if(this.data.seek){
        clearInterval(updateId)
        player.progress.value = this.data.value
        this.setData({
          progress:{
            value: player.progress.value
          }
        })
        return 
      }
      let currentTime = this.formatTime(backgroundAudioManager.currentTime)
      player.currentTime = currentTime
      player.progress.value = Math.round(backgroundAudioManager.currentTime)
      player.progress.max = Math.floor(backgroundAudioManager.duration)

      this.setData({
        currentTime: player.currentTime,
        progressValue: player.progress.value,
        progress: {
          value: player.progress.value,
          max: player.progress.max
        }
      })

    },1000)
  },
  //reset
  reset() {
    app.globalData.backgroundAudioManager.pause()
    app.globalData.backgroundAudioManager.seek(0)
    app.globalData.backgroundAudioManager.play()
  },
  //seek
  seek(e) {
    //暂停后再拖动进度条,放置进度条跳动
    app.globalData.backgroundAudioManager.pause()
    this.setData({
      seek: true,
      value: e.detail.value
    })
    app.globalData.backgroundAudioManager.seek(e.detail.value)
  }
})