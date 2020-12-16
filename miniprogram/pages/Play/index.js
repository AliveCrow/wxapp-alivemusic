// pages/Play/index.js
const app = getApp()
let player = app.globalData.player
let backgroundAudioManager
let mode = ["random", "loop", "normal"]
const myPlayer = app.globalData.myPlayer

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'normal',
    updateId: null,
    currentTime: "00:00",
    duration: "00:00",
    songData: {},
    playerBgc: String,
    // backgroundAudioManager: {},
    paused: true,
    move: false,
    seek: false,
    value: Number,
    progress: {
      value: Number,
      max: Number,
      activeColor: "#1976D2",
      blockSize: 3,
      backgroundColor: "#fff"
    },
    lyric: [],
    lyricShow: [],
    lyricIn: Number,
    offsetY: "0px"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${myPlayer.playingList.isPlaying.track_info.album.mid}.jpg`,
    })
    myPlayer.playingList.index = (app.globalData.playingList.willPlay.findIndex(item => app.globalData.playingList.isPlaying.track_info.mid === item.mid || app.globalData.playingList.isPlaying.track_info.mid === item.songmid))
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
    wx.setNavigationBarTitle({
      title: myPlayer.backgroundAudioManager.title
    })
    this.setData({
      //   mode:app.globalData.player.mode,
      paused: myPlayer.isPaused
    })
    // this.getLyric()
    myPlayer.backgroundAudioManager.onCanplay(() => {
      //初始化播放器-设置时长
    })
    this.init()

  },

  onUnload: function () {
    clearInterval(this.data.updateId)
    this.setData({
      updateId: null
    })
  },

  //初始player
  init() {
    myPlayer.backgroundAudioManager.onPlay(() => {
      myPlayer.isPaused = false
      wx.setNavigationBarTitle({
        title: myPlayer.backgroundAudioManager.title
      })
      // this.getLyric()
      myPlayer.currentTime = this.formatTime(myPlayer.backgroundAudioManager.currentTime)
      myPlayer.duration = this.formatTime(myPlayer.backgroundAudioManager.duration)
      myPlayer.progress.max = Math.floor(myPlayer.backgroundAudioManager.duration)
      this.setData({
        currentTime: myPlayer.currentTime,
        duration: myPlayer.duration,
        paused: myPlayer.isPaused,
        ['progress.value']: myPlayer.progress.value,
        ['progress.max']: myPlayer.progress.max,
        move: true
      })
    });

    myPlayer.backgroundAudioManager.onPause(() => {

    })
    myPlayer.backgroundAudioManager.onTimeUpdate(() => {
      // this.scrollLyric()

    })

    myPlayer.backgroundAudioManager.onSeeking(() => {

    })
    myPlayer.backgroundAudioManager.onSeeked(() => {
      this.setData({
        seek: false,
      })
      console.log('进度改变完成')
        this.update()
      myPlayer.backgroundAudioManager.play()

    })
    //播放结束后的动作
    myPlayer.backgroundAudioManager.onEnded(() => {
      // if(this.data.mode ==="loop"){
      this.reset()
      // }
      // this.next()
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
    myPlayer.backgroundAudioManager.play()
    myPlayer.isPaused = false
    this.setData({
      paused: myPlayer.isPaused
    })
  },
  //pause
  pause() {
    myPlayer.backgroundAudioManager.pause()
    myPlayer.isPaused = true
    this.setData({
      paused: myPlayer.isPaused
    })
  },
  update() {
    this.setData({
      updateId: setInterval(() => {
        myPlayer.currentTime = this.formatTime(myPlayer.backgroundAudioManager.currentTime)
        myPlayer.duration = this.formatTime(myPlayer.backgroundAudioManager.duration)
        myPlayer.progress.value = Math.round(myPlayer.backgroundAudioManager.currentTime)
        this.setData({
          currentTime: myPlayer.currentTime,
          progressValue: myPlayer.progress.value,
          ['progress.value']: myPlayer.progress.value,
          ['progress.max']: myPlayer.progress.max
        })
      }, 500)
    })
  },
  //loop
  reset() {
    myPlayer.backgroundAudioManager.pause()
    myPlayer.backgroundAudioManager.seek(0)
    myPlayer.progress.value = 0
    myPlayer.backgroundAudioManager.play()
  },
  //random
  random() {
    myPlayer.setIndex(parseInt(Math.random() * app.globalData.playingList.willPlay.length))
  },

  seek(e) {
    clearInterval(this.data.updateId)
    this.setData({
      updateId: null,
    })
    //暂停后再拖动进度条,放置进度条跳动
    this.setData({
      seek: true,
      value: e.detail.value,
      ['progress.value']: e.detail.value,
      ['progress.max']: myPlayer.progress.max,
    })
    myPlayer.progress.value = e.detail.value
    myPlayer.backgroundAudioManager.seek(e.detail.value)
  },


  ///////////////////////////////////////////////////


  pre() {
    myPlayer.playingList.index -= 1
    if (myPlayer.playingList.index < 0) {
      myPlayer.playingList.index = myPlayer.playingList.willPlay.length - 1
    }
    wx.showLoading({
      title: '稍等',
    })
    let songmid = myPlayer.playingList.willPlay[myPlayer.playingList.index].mid
    this.setPlayer(songmid)

  },
  next() {
    if (this.data.mode === "random") {
      this.random()
    } else {
      myPlayer.playingList.index += 1
      if (amyPlayer.playingList.index > myPlayer.playingList.willPlay.length - 1) {
        myPlayer.playingList.index = 0
      }
    }
    wx.showLoading({
      title: '稍等',
    })
    let songmid = myPlayer.playingList.willPlay[myPlayer.playingList.index].mid ||
      myPlayer.playingList.willPlay[myPlayer.playingList.index].songmid
    this.setPlayer(songmid)
  },

  setPlayer(songmid) {
    wx.request({
      url: app.globalData.api.dev + `/song?songmid=${songmid}`,
      success: (res) => {

        wx.request({
          url: app.globalData.api.dev + `/song/urls?id=${songmid}`,
          success: url => {
            if (JSON.stringify(url.data.data) == "{}") {
              wx.showToast({
                title: '歌曲需要开通绿钻或者购买',
                icon: 'none',
                duration: 2000
              })
              myPlayer.playingList.index += 1
              this.next()
              return
            }
            myPlayer.init(res.data.data.track_info, url.data.data[songmid])
            myPlayer.playingList.isPlaying = res.data.data,

              // myPlayer.backgroundAudioManager.title = app.globalData.playingList.isPlaying.track_info.name
              // myPlayer.backgroundAudioManager.epname = app.globalData.playingList.isPlaying.track_info.album.name
              // myPlayer.backgroundAudioManager.singer = app.globalData.playingList.isPlaying.track_info.singer
              // myPlayer.backgroundAudioManager.coverImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`
              // myPlayer.backgroundAudioManager.src = url.data.data[songmid]
              wx.hideLoading({
                success: () => {
                  wx.setNavigationBarTitle({
                    title: myPlayer.backgroundAudioManager.title
                  })
                  this.setData({
                    playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${myPlayer.playingList.isPlaying.track_info.album.mid}.jpg`
                  })
                }
              })
          },
          fail: error => {
            wx.showToast({
              title: '接口错误',
              icon: 'fail',
              duration: 2000
            })
          }
        })

      }
    })
  },
  changeMode() {
    let modeIndex = mode.findIndex(item => item === this.data.mode)
    if (modeIndex < 3) {
      modeIndex += 1
      if (modeIndex === 3) {
        modeIndex = 0
      }
    }
    app.globalData.player.mode = mode[modeIndex]
    this.setData({
      mode: mode[modeIndex]
    })
  },
  getLyric() {
    wx.request({
      url: app.globalData.api.dev + `/lyric?songmid=${app.globalData.playingList.isPlaying.track_info.mid}`,
      success: res => {
        let lyric = res.data.data.lyric.match(/^\[\d{2}:\d{2}.\d{2}](.+)$/gm)
        this.setData({
          lyric: lyric,
          lyricShow: lyric.map(item => item.slice(10))
        })
      }
    })
  },
  lyricTime(lyric) { //返回歌词显示的时间
    return lyric.replace(/^\[(\d{2}):(\d{2}).*/, (match, p1, p2) => 60 * (+p1) + (+p2))
  },
  scrollLyric() {
    //当前播放的时间
    let currentTime = Math.round(backgroundAudioManager.currentTime)
    for (let i = 0; i < this.data.lyric.length - 1; i++) {
      // console.log(this.lyricTime(this.data.lyric[i]));
      // if(this.lyricTime(this.data.lyric[i]) <= currentTime && ){

      // }
      if (this.lyricTime(this.data.lyric[i]) <= currentTime && ((this.data.lyric[i + 1] && this.lyricTime(this.data.lyric[i + 1]) >= currentTime))) {

        console.log(this.data.lyricShow[i]);
        console.log(this.data.lyricShow.findIndex(lyric => lyric === this.data.lyricShow[i]))
        this.setData({
          lyricIn: this.data.lyricShow.findIndex(lyric => lyric === this.data.lyricShow[i]),
          offsetY: `${this.data.lyricShow.findIndex(lyric => lyric === this.data.lyricShow[i]) * 35 - 200}` + "px"
        })
        break

      }
    }
  }
})
