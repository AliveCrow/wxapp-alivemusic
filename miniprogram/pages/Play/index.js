// pages/Play/index.js
const app = getApp()
let player = app.globalData.player
let backgroundAudioManager
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateId: null,
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
      playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`,
      duration: player.duration,
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady');
    this.update()


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      paused: app.globalData.backgroundAudioManager.paused,
      currentTime: player.currentTime,
      ['progress.value']: player.progress.value,
      ['progress.max']: player.progress.max
    })
    backgroundAudioManager.onCanplay(() => {
      //初始化播放器-设置时长
      this.setData({
        songData: app.globalData.playingList.isPlaying,
      })
      this.init()
    })

  },

  onUnload: function () {
    clearInterval(this.data.updateId)
    this.setData({
      updateId: null
    })
  },

  //初始player
  init() {
    backgroundAudioManager.onPlay(() => {
      //设置全局Player变量
      let currentTime = this.formatTime(backgroundAudioManager.currentTime)
      player.currentTime = currentTime
      let duration = this.formatTime(backgroundAudioManager.duration)
      player.duration = duration
      player.progress.max = Math.floor(backgroundAudioManager.duration)
      this.setData({
        currentTime: player.currentTime,
        duration: player.duration,
        paused: false,
        ['progress.value']: player.progress.value,
        ['progress.max']: player.progress.max
      })
    });


    backgroundAudioManager.onSeeked(() => {
      this.setData({
        seek: false,
      })
      backgroundAudioManager.play()
    })
    //播放结束后的动作
    backgroundAudioManager.onEnded(() => {
      this.reset()
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
    this.setData({
      updateId: setInterval(() => {
        let currentTime = this.formatTime(backgroundAudioManager.currentTime)
        player.currentTime = currentTime
        player.progress.value = Math.round(backgroundAudioManager.currentTime)
        if (this.data.seek) {
          player.progress.value = this.data.value
        }
        this.setData({
          currentTime: player.currentTime,
          progressValue: player.progress.value,
          ['progress.value']: player.progress.value,
          ['progress.max']: player.progress.max
        })
      }, 500)

    })

  },
  //reset
  reset() {
    app.globalData.backgroundAudioManager.pause()
    app.globalData.backgroundAudioManager.seek(0)
    player.progress.value = 0
    app.globalData.backgroundAudioManager.play()
  },
  //seek
  seek(e) {
    //暂停后再拖动进度条,放置进度条跳动
    this.setData({
      seek: true,
      value: e.detail.value
    })
    backgroundAudioManager.pause()
    backgroundAudioManager.seek(e.detail.value)
  }
})