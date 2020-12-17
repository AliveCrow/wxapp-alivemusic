// components/mini-player/index.js
const app = getApp()
const myPlayer = app.globalData.myPlayer
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // songData:[]
  },

  /**
   * 组件的初始数据
   */
  data: {
    songData: {},
    isPlay: true,
    listShow: false,
    playList: [],
    isPlaying: {}
  },

  lifetimes: {
    attached: function () {
      myPlayer.whichIsPlaying()
      this.setData({
        isPlaying: myPlayer.playingList.isPlaying,
        playList: myPlayer.playingList.willPlay,
        songData: {
          title: myPlayer.__.title,
          coverUrl: myPlayer.__.coverImgUrl,
        }
      })
    }
  },

  pageLifetimes: {
    show: function () {
      myPlayer.whichIsPlaying()
      this.setData({
        isPlaying: myPlayer.playingList.isPlaying,
        playList: myPlayer.playingList.willPlay,
        isPlay: !myPlayer.isPaused,
        songData: {
          title: myPlayer.__.title,
          coverUrl: myPlayer.__.coverImgUrl,
        }
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    intoPlayer() {
      wx.navigateTo({
        url: '/pages/Play/index',
        success: r => {
        }
      })
    },
    play() {
      myPlayer.play()
      this.setData({
        isPlay: !myPlayer.isPaused
      })
    },
    pause() {
      myPlayer.pause()
      this.setData({
        isPlay: !myPlayer.isPaused
      })
    },
    showList() {
      this.setData({
        listShow: !this.data.listShow
      })
    },
    hiddenList() {
      this.setData({
        listShow: false
      })
    },
    setSong(e) {
      wx.showLoading({
        title: '稍等',
      })
      let songmid = e.target.dataset.mid
      wx.request({
        url: app.globalData.api.dev +`/song?songmid=${songmid}`,
        success:res=>{
          myPlayer.init(songmid)
          myPlayer.playingList.isPlaying = res.data.data

        }
      })
      
    },

  }
})
