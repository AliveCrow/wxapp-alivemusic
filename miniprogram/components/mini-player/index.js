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
    isPlay:true
  },

  lifetimes:{
    attached: function(){
      this.setData({
        songData: {
          title: app.globalData.backgroundAudioManager.title,
          coverUrl:app.globalData.backgroundAudioManager.coverImgUrl,
        }
      })
    }
  },

  pageLifetimes:{
    show:function(){
      console.log(app.globalData.backgroundAudioManager.paused);
      this.setData({
        isPlay:!app.globalData.backgroundAudioManager.paused,
        songData: {
          title: app.globalData.backgroundAudioManager.title,
          coverUrl:app.globalData.backgroundAudioManager.coverImgUrl,
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
        success:r=>{
          console.log(app.globalData);
        }
      })
    },
    play(){
      app.globalData.backgroundAudioManager.play()
      this.setData({
        isPlay:true
      })
    },
    pause(){
      app.globalData.backgroundAudioManager.pause()
      this.setData({
        isPlay:false
      })
    }
  }
})
