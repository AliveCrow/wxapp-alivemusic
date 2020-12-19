// pages/songList/index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_id: Number,
    title: String,
    desc: String,
    pic: String,
    songList: Array,
    like: false,
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num: options.num
    })
    const event = this.getOpenerEventChannel()
    event.on('wherefrom', (res) => {
      if (res.where === "home") {
        this.setData({
          list_id: options.content_id
        })
        this.init()
      } else if (res.where === "user") {
        this.setData({
          title: '我喜欢',
          desc: '收藏的音乐',
          pic: res.pic,
          songList: res.data,
        })
      }
    })

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
    if (!app.globalData.logined) return;

    db.collection('LikeSongLists').where({
      _openid: app.globalData.openid
    }).get().then(res => {

      let like = res.data[0].songlist_arr.findIndex(item => item.songlist_id == this.data.list_id)
      if (like !== -1) {
        this.setData({
          like: true
        })
      }
    })

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

  init() {
    wx.request({
      url: app.globalData.api.dev + `/songlist?id=${this.data.list_id}`,
      success: res => {
        this.setData({
          title: res.data.data.dissname,
          desc: res.data.data.desc,
          pic: res.data.data.logo,
          songList: res.data.data.songlist.slice(0, 100)
        })
        wx.setNavigationBarTitle({
          title: this.data.title,
        })
      }
    })
  },
  showDesc(e) {
    let a = this.data.desc.replace(/(?=&).*?(?=;)/g, "").replace(/;/g, "")
    this.setData({
      desc: a
    })
    wx.showModal({
      content: this.data.desc,
      showCancel: false,
      confirmText: '关闭'
    })
  },
  changeLike() {
    wx.showLoading()
    if (!app.globalData.logined) {
      wx.showToast({
        title: '请登录',
      })
      return
    }
    if (this.data.like) {
      this.setData({
        like: false
      })

      db.collection('LikeSongLists').where({
        _openid: app.globalData.openid
      }).update({
        data: {
          songlist_arr: _.pull({
            songlist_id: this.data.list_id
          })

        },
        success: function(res) {
          wx.hideLoading()
        }
      })

    } else {
      this.setData({
        like: true
      })

      db.collection('LikeSongLists').where({
        _openid: app.globalData.openid
      }).update({
        data: {
          songlist_arr: _.push({
            songlist_id: this.data.list_id,
            cover: this.data.pic,
            title: this.data.title,
            listen_num: this.data.num
          })
        },
        success: function(res) {
          wx.hideLoading()
        }
      })
    }

  },
})