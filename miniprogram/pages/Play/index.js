// pages/Play/index.js
const app = getApp()
let player = app.globalData.player
let backgroundAudioManager
let mode = ["random","loop","normal"]
import Player from '../../ulits/Player'
let a = new Player

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:'normal',
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
    },
    lyric:[],
    lyricShow:[],
    lyricIn:Number,
    offsetY:"0px"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(a);
    backgroundAudioManager = app.globalData.backgroundAudioManager
    this.setData({
      playerBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`,
      duration: player.duration,
    })
    app.globalData.playingList.index = app.globalData.playingList.willPlay.findIndex(item => app.globalData.playingList.isPlaying.track_info.mid === item.mid || app.globalData.playingList.isPlaying.track_info.mid === item.songmid)
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
      title: backgroundAudioManager.title
    })
    this.setData({
      mode:app.globalData.player.mode,
      paused:backgroundAudioManager.paused
    })
    this.getLyric()
    backgroundAudioManager.onCanplay(() => {
      //初始化播放器-设置时长
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
      wx.setNavigationBarTitle({
        title: backgroundAudioManager.title
      })
      this.getLyric()
      //设置全局Player变量
      let currentTime = this.formatTime(backgroundAudioManager.currentTime)
      player.currentTime = currentTime
      let duration = this.formatTime(backgroundAudioManager.duration)
      player.duration = duration
      player.progress.max = Math.floor(backgroundAudioManager.duration)
      this.setData({
        currentTime: player.currentTime||"00:00",
        duration: player.duration||"00:00",
        paused: false,
        ['progress.value']: player.progress.value,
        ['progress.max']: player.progress.max
      })
    });

    backgroundAudioManager.onTimeUpdate(()=>{
      this.scrollLyric()
    })

    backgroundAudioManager.onSeeked(() => {
      this.setData({
        seek: false,
      })
      backgroundAudioManager.play()
    })
    //播放结束后的动作
    backgroundAudioManager.onEnded(() => {
      if(this.data.mode ==="loop"){
        this.reset()
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
          currentTime: player.currentTime||"00:00",
          progressValue: player.progress.value,
          ['progress.value']: player.progress.value,
          ['progress.max']: player.progress.max
        })
      }, 500)

    })

  },
  //loop
  reset() {
    app.globalData.backgroundAudioManager.pause()
    app.globalData.backgroundAudioManager.seek(0)
    player.progress.value = 0
    app.globalData.backgroundAudioManager.play()
  },
  //random
  random(){
    app.globalData.playingList.index = parseInt(Math.random()*app.globalData.playingList.willPlay.length)
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
  },

  pre() {
    app.globalData.playingList.index -= 1
    if (app.globalData.playingList.index < 0) {
      app.globalData.playingList.index = app.globalData.playingList.willPlay.length - 1
    }
    wx.showLoading({
      title: '稍等',
    })
    let songmid = app.globalData.playingList.willPlay[app.globalData.playingList.index].mid
    this.setPlayer(songmid)

  },
  next() {
    if(this.data.mode==="random"){
      this.random()
    }else{
      app.globalData.playingList.index += 1
      if (app.globalData.playingList.index > app.globalData.playingList.willPlay.length - 1) {
        app.globalData.playingList.index = 0
      }
    }
    wx.showLoading({
      title: '稍等',
    })
    let songmid = app.globalData.playingList.willPlay[app.globalData.playingList.index].mid ||
    app.globalData.playingList.willPlay[app.globalData.playingList.index].songmid
    this.setPlayer(songmid)
  },

  setPlayer(songmid){
    wx.request({
      url: app.globalData.api.dev + `/song?songmid=${songmid}`,
      success: (res) => {
        app.globalData.playingList.isPlaying = res.data.data,

          wx.request({
            url: app.globalData.api.dev + `/song/urls?id=${songmid}`,
            success: url => {
              if (JSON.stringify(url.data.data) == "{}") {
                wx.showToast({
                  title: '歌曲需要开通绿钻或者购买',
                  icon: 'none',
                  duration: 2000
                })
                app.globalData.playingList.index +=1
                this.next()
                return
              }
              backgroundAudioManager.title = app.globalData.playingList.isPlaying.track_info.name
              backgroundAudioManager.epname = app.globalData.playingList.isPlaying.track_info.album.name
              backgroundAudioManager.singer = app.globalData.playingList.isPlaying.track_info.singer
              backgroundAudioManager.coverImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`
              backgroundAudioManager.src = url.data.data[songmid]
              wx.hideLoading({
                success:()=>{
                  wx.setNavigationBarTitle({
                    title: backgroundAudioManager.title
                  })
                  this.setData({
                    playerBgc:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${app.globalData.playingList.isPlaying.track_info.album.mid}.jpg`
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
  changeMode(){
    let modeIndex = mode.findIndex(item=>item===this.data.mode)
    if(modeIndex<3){
      modeIndex+=1
      if(modeIndex===3){
        modeIndex = 0
      }
    }
    app.globalData.player.mode = mode[modeIndex]
    this.setData({
      mode:mode[modeIndex]
    })
  },
  getLyric(){
    wx.request({
      url: app.globalData.api.dev+`/lyric?songmid=${app.globalData.playingList.isPlaying.track_info.mid}`,
      success:res=>{
        let lyric = res.data.data.lyric.match(/^\[\d{2}:\d{2}.\d{2}](.+)$/gm)
        this.setData({
          lyric:lyric,
          lyricShow:lyric.map(item=>item.slice(10))
        })
      }
    })
  },
  lyricTime(lyric) { //返回歌词显示的时间
		return lyric.replace(/^\[(\d{2}):(\d{2}).*/, (match, p1, p2) => 60 * (+p1) + (+p2))
  },
  scrollLyric(){
    //当前播放的时间
    let currentTime = Math.round(backgroundAudioManager.currentTime)
    for(let i=0;i<this.data.lyric.length-1;i++){
      // console.log(this.lyricTime(this.data.lyric[i]));
      // if(this.lyricTime(this.data.lyric[i]) <= currentTime && ){

      // }
      if(this.lyricTime(this.data.lyric[i]) <= currentTime && ((this.data.lyric[i + 1] && this.lyricTime(this.data.lyric[i + 1] ) >=  currentTime ))){

        console.log(this.data.lyricShow[i]);
        console.log(this.data.lyricShow.findIndex(lyric=> lyric===this.data.lyricShow[i]))
        this.setData({
          lyricIn:this.data.lyricShow.findIndex(lyric=> lyric===this.data.lyricShow[i]),
          offsetY:`${this.data.lyricShow.findIndex(lyric=> lyric===this.data.lyricShow[i])*35- 200}`+"px"
        })
				break

      }
    }
  }
})
