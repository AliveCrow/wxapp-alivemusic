//app.js
import {api} from './ulits/api'
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'test-3dewj',
        traceUser:true
      })
    }

    this.globalData = {
      api:api,
      backgroundAudioManager:null,
      playingList:{
        isPlaying:{},
        willPlay:[]
      },
      player:{
        currentTime: "00:00",
        duration: "00:00",
        progress: {
          value: Number,
          max: Number,
        }
      }

    }
  }
})
