// pages/Play/index.js
const app = getApp()
let player = app.globalData.player
let backgroundAudioManager
let mode = ["random", "loop", "normal"]
let myPlayer 

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
    myPlayer = app.globalData.myPlayer
    this.setData({
      playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${myPlayer.playingList.isPlaying.track_info.album.mid}.jpg`,
    })
    myPlayer.whichIsPlaying()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.update()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: myPlayer.__.title
    })
    this.setData({
      paused: myPlayer.isPaused,
    })
    this.init()
    this.getLyric()
  },

  onUnload: function () {
    clearInterval(myPlayer.updateId)
    myPlayer.updateId = null
  },

  //初始player
  init() { 
    myPlayer.__.onPlay(()=>{
      wx.setNavigationBarTitle({
        title: myPlayer.__.title
      })
    
      myPlayer.isPaused = false
      myPlayer.currentTime = this.formatTime(myPlayer.__.currentTime)
      myPlayer.duration = this.formatTime(myPlayer.__.duration)
      myPlayer.progress.max = Math.floor(myPlayer.__.duration)

      this.setData({
        currentTime: myPlayer.currentTime,
        duration: myPlayer.duration,
        paused: myPlayer.isPaused,
        ['progress.value']: myPlayer.progress.value,
        ['progress.max']: myPlayer.progress.max,
        move: true
      })
    })

    myPlayer.__.onTimeUpdate(()=>{
      console.log('233');
    })

    myPlayer.__.onPause(() => {

    })
    myPlayer.__.onTimeUpdate(() => {
      this.scrollLyric()
    })

    myPlayer.__.onSeeking(() => {

    })
    myPlayer.__.onSeeked(() => {
      this.setData({
        seek: false,
      })
      this.update()
      myPlayer.__.play()
    })
    //播放结束后的动作
    myPlayer.__.onEnded(() => {
      if (myPlayer.mode === "loop") {
        myPlayer.reset()
        return 
      }
      this.next()
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
    myPlayer.play()
    this.setData({
      paused: myPlayer.isPaused
    })
  },
  //pause
  pause() {
    myPlayer.pause()
    this.setData({
      paused: myPlayer.isPaused
    })
  },
  update() {
    this.setData({
      updateId:myPlayer.update(500,this)
    })
  },
  seek(e) {
    myPlayer.seek(e.detail.value,this)
  },
  pre() {
    this.setPlayer(myPlayer.pre())

  },
  next() {
    this.setPlayer(myPlayer.next())

  },
  changeMode() {
    myPlayer.changeMode()
    this.setData({
      mode: myPlayer.mode
    })
  },
  lyricTime(lyric) { //返回歌词显示的时间
    return lyric.replace(/^\[(\d{2}):(\d{2}).*/, (match, p1, p2) => 60 * (+p1) + (+p2))
  },
  scrollLyric() {
    //当前播放的时间
    let currentTime = Math.round(myPlayer.__.currentTime)
    for (let i = 0; i < this.data.lyric.length; i++) {
      if (this.lyricTime(this.data.lyric[i]) <= currentTime && (!this.data.lyric[i + 1] || this.lyricTime(this.data.lyric[i + 1]) >= currentTime)) {
        this.setData({
          lyricIn: i,
          offsetY: `${i * 35 - 200}` + "px"
        })
        break
      }

    }
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
            myPlayer.init(songmid) 
            myPlayer.playingList.isPlaying = res.data.data, 
              this.setData({
                lyric: myPlayer.lyric.lyric,
                lyricShow: myPlayer.lyric.lyricShow
              })
              wx.hideLoading({ 
                success: () => { 
                  this.getLyric()
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
  getLyric(){
    wx.request({
      url: app.globalData.api.dev + `/lyric?songmid=${myPlayer.playingList.isPlaying.track_info.mid}`,
      success: res => {
        let lyric = res.data.data.lyric.match(/^\[\d{2}:\d{2}.\d{2}](.+)$/gm)
        myPlayer.lyric.lyric=  lyric,
        myPlayer.lyric.lyricShow = lyric.map(item => item.slice(10))
        this.setData({
          lyric:lyric,
          lyricShow:lyric.map(item => item.slice(10))
        })
      }
    })
  }
})
