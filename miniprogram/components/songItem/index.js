// components/songItem/index.js
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
    name:String,
    album:String,
    album_img:String
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      wx.request({
        url: `http://localhost:3300/song?songmid=${this.data.songmid}`,
        success:(res)=>{
          let info = res.data.data.track_info
          this.setData({
            name:info.name,
            album:info.album.name,
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
  ready: function() { },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
