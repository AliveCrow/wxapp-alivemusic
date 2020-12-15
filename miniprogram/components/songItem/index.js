// components/songItem/index.js
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songmid:String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    songData:{},
    name:String,
    album:String,
    album_img:String,
    singer:String,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      wx.request({
        url: app.globalData.api.dev+`/song?songmid=${this.data.songmid}`,
        success:(res)=>{
          let info = res.data.data.track_info
          this.setData({
            songData:res.data.data,
            name:info.name,
            album:info.album.name,
            singer:info.singer[0].name,
            album_img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
          })

        } 
      })
    },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function(){
      wx.showLoading({
        title: '稍等',
      })

      let songmid = this.data.songmid
      wx.request({
        url: app.globalData.api.dev+`/song?songmid=${songmid}`,
        success:(res)=>{
          app.globalData.playingList.isPlaying = res.data.data,
          wx.request({
            url: app.globalData.api.dev + `/song/urls?id=${songmid}`,
            success: res => {
              if (JSON.stringify(res.data.data) == "{}") {
                wx.showToast({
                  title: '歌曲需要开通绿钻或者购买',
                  icon: 'none',
                  duration: 2000
                })
                return 
              }
              backgroundAudioManager.title = this.data.name
              backgroundAudioManager.epname = this.data.album
              backgroundAudioManager.singer = this.data.singer
              backgroundAudioManager.coverImgUrl =this.data.album_img
              backgroundAudioManager.src = res.data.data[songmid]
              app.globalData.backgroundAudioManager = backgroundAudioManager
              // backgroundAudioManager.onCanplay((e)=>{
                wx.hideLoading({
                  success: () => {
                    wx.navigateTo({
                      url: '/pages/Play/index',
                      success:r=>{
    
                        // r.eventChannel.emit('playerGetSongData',this.data.songData)
                        // r.eventChannel.emit('backgroundAudioManager',backgroundAudioManager)
                      }
                    })
                  },
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
