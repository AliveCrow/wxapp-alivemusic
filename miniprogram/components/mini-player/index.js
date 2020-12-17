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
      console.log(myPlayer);
      this.setData({
        isPlaying: myPlayer.playingList.isPlaying,
        playList: myPlayer.playingList.willPlay,
        songData: {
          title: myPlayer.backgroundAudioManager.title,
          coverUrl: myPlayer.backgroundAudioManager.coverImgUrl,
        }
      })
      myPlayer.playingList.index = this.data.playList.findIndex(item => this.data.isPlaying.track_info.mid === item.mid || this.data.isPlaying.track_info.mid === item.songmid)
    }
  },

  pageLifetimes: {
    show: function () {
      this.setData({
        isPlaying: myPlayer.playingList.isPlaying,
        playList: myPlayer.playingList.willPlay,
        isPlay: !myPlayer.isPaused,
        songData: {
          title: myPlayer.backgroundAudioManager.title,
          coverUrl: myPlayer.backgroundAudioManager.coverImgUrl,
        }
      })
      myPlayer.playingList.index = this.data.playList.findIndex(item => this.data.isPlaying.track_info.mid === item.mid || this.data.isPlaying.track_info.mid === item.songmid)
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
      myPlayer.backgroundAudioManager.play()
      myPlayer.isPaused = false
      this.setData({
        isPlay: !myPlayer.isPaused
      })
    },
    pause() {
      myPlayer.backgroundAudioManager.pause()
      myPlayer.isPaused = true
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
      let backgroundAudioManager = myPlayer.backgroundAudioManager

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
                myPlayer.init(res.data.data.track_info, url.data.data[songmid])
                myPlayer.playingList.isPlaying = res.data.data,

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
