// components/mini-player/index.js
const app = getApp()
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
      this.setData({
        isPlaying: app.globalData.playingList.isPlaying,
        playList: app.globalData.playingList.willPlay,
        songData: {
          title: app.globalData.backgroundAudioManager.title,
          coverUrl: app.globalData.backgroundAudioManager.coverImgUrl,
        }
      })
      app.globalData.playingList.index = this.data.playList.findIndex(item => this.data.isPlaying.track_info.mid === item.mid || this.data.isPlaying.track_info.mid === item.songmid)
    }
  },

  pageLifetimes: {
    show: function () {
      this.setData({
        isPlaying: app.globalData.playingList.isPlaying,
        playList: app.globalData.playingList.willPlay,
        isPlay: !app.globalData.backgroundAudioManager.paused,
        songData: {
          title: app.globalData.backgroundAudioManager.title,
          coverUrl: app.globalData.backgroundAudioManager.coverImgUrl,
        }
      })
      app.globalData.playingList.index = this.data.playList.findIndex(item => this.data.isPlaying.track_info.mid === item.mid || this.data.isPlaying.track_info.mid === item.songmid)
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
          console.log(app.globalData);
        }
      })
    },
    play() {
      app.globalData.backgroundAudioManager.play()
      this.setData({
        isPlay: true
      })
    },
    pause() {
      app.globalData.backgroundAudioManager.pause()
      this.setData({
        isPlay: false
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
      let backgroundAudioManager = app.globalData.backgroundAudioManager

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
                  return
                }
                app.globalData.playingList.isPlaying = res.data.data,
                backgroundAudioManager.title = res.data.data.track_info.name
                backgroundAudioManager.epname = res.data.data.track_info.album.name
                backgroundAudioManager.singer = res.data.data.track_info.singer[0].name
                backgroundAudioManager.coverImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.data.track_info.album.mid}.jpg`
                backgroundAudioManager.src = url.data.data[res.data.data.track_info.mid]
                backgroundAudioManager.onCanplay(() => {
                  wx.hideLoading({
                    success: () => {
                      wx.navigateTo({
                        url: '/pages/Play/index',
                      })
                    },
                  })
                })


                // })
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

  }
})
