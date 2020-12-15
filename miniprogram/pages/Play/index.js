// pages/Play/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: "00:00",
    duration: "00:00",
    songData: {},
    playerBgc: String,
    backgroundAudioManager: {},
    paused: true,
    move: false,
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
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('playerGetSongData', (songData) => {
      this.setData({
        songData: songData,
        playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.track_info.album.mid}.jpg`
      })
      wx.setNavigationBarTitle({
        title: songData.track_info.name,
      })
    })
    eventChannel.on('backgroundAudioManager', (backgroundAudioManager) => {
      this.setData({
        backgroundAudioManager: backgroundAudioManager,
      })
      backgroundAudioManager.onCanplay(() => {
        backgroundAudioManager.onPlay(() => {
          let duration = this.formatTime(backgroundAudioManager.duration)
          this.setData({
            duration: duration,
            paused: false,
            progress: {
              value:Math.round(backgroundAudioManager.currentTime),
              max: Math.floor(backgroundAudioManager.duration),
            }
          })

          backgroundAudioManager.onTimeUpdate((e) => {
            if(this.data.move){
              this.setData({
                progress:{
                  value:this.data.value
                }
              })
              return 
            }
            let currentTime = this.formatTime(backgroundAudioManager.currentTime)
              this.setData({
                currentTime: currentTime,
                progress: {
                  value: Math.round(backgroundAudioManager.currentTime),
                  max: Math.floor(backgroundAudioManager.duration),
                }
              })
          })

        });
        backgroundAudioManager.onSeeked(() => {
          this.setData({
            move:false
          })
          backgroundAudioManager.play()
        })
      })



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
    this.data.backgroundAudioManager.play()
    this.setData({
      paused: false
    })
  },
  //pause
  pause() {
    this.data.backgroundAudioManager.pause()
    this.setData({
      paused: true
    })
  },
  //seek
  seek(e) {

    this.data.backgroundAudioManager.pause()
    this.setData({
      move:true,
      value:e.detail.value
    })
    this.data.backgroundAudioManager.seek(e.detail.value)
  }
})