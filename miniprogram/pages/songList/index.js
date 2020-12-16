// pages/songList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_id:Number,
    title:String,
    desc:String,
    pic:String,
    songList:Array
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list_id:options.content_id
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  init(){
    wx.request({
      url: app.globalData.api.dev+`/songlist?id=${this.data.list_id}`,
      success:res=>{
        this.setData({
          title:res.data.data.dissname,
          desc:res.data.data.desc,
          pic:res.data.data.logo,
          songList:res.data.data.songlist.slice(0,100)
        })
      }
    })
  },
  showDesc(e){
    let a = this.data.desc.replace(/(?=&).*?(?=;)/g,"").replace(/;/g,"")
    this.setData({
      desc:a
    })
    wx.showModal({
      content: this.data.desc,
      showCancel:false,
      confirmText:'关闭'
    })
  },
  setList(){
    app.globalData.playingList.willPlay=this.data.songList
  }
})