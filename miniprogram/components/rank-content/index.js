// components/rank-content/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    topThree:[],
  },
  lifetimes:{
    attached:function(){
      this.getDetail()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDetail(){
      wx.request({
        url: app.globalData.api.dev +`/top?id=${this.data.content.topId}&pageSize=20`,
        success:res=>{
          this.setData({
            topThree:res.data.data.list.slice(0,3),
          })
        }
      })
    },
    rankTap(){
      wx.navigateTo({
        url: `/pages/rank/index?topId=${this.data.content.topId}`
      })
    }
  }
})
