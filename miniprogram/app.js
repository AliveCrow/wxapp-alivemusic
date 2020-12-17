//app.js
import {api} from './ulits/api'
import Player from './ulits/Player'
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
      backgroundAudioManager:wx.getBackgroundAudioManager(),
      myPlayer:new Player(),
      playingList:{
        isPlaying:{},
        willPlay:[],
        index:Number
      },
      player:{
        currentTime: "00:00",
        duration: "00:00",
        progress: {
          value: Number,
          max: Number,
        },
        mode:'normal'
      }

    }
  }
})
