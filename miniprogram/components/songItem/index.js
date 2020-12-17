// components/songItem/index.js
import Player from '../../ulits/Player'
const app = getApp()
let myPlayer = app.globalData.myPlayer
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songmid: String,
    willPlay: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    songData: {},
    name: String,
    album: String,
    album_img: String,
    singer: String,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      wx.request({
        url: app.globalData.api.dev + `/song?songmid=${this.data.songmid}`,
        success: (res) => {
          let info = res.data.data.track_info
          this.setData({
            songData: res.data.data,
            name: info.name,
            album: info.album.name,
            singer: info.singer[0].name,
            album_img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
          })

        }
      })
    },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      let songmid = this.data.songmid
      myPlayer.init(songmid)
      myPlayer.playingList.willPlay = this.data.willPlay
      myPlayer.playingList.isPlaying = this.data.songData
      console.log(this.data.willPlay);
      wx.showLoading({
        title: '稍等',
      })
    },
  }
})
