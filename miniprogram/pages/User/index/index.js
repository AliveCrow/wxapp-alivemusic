// pages/User/index/index.js
const db = wx.cloud.database()
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    login_type: 0,
    is_vip: false,
    logined: false,
    openid: "",
    likeSongBgc: 'http://qiniu.dreamsakula.top/images/20201218114049.jpg',
    likeSongListBgc: 'http://qiniu.dreamsakula.top/images/20201218114206.jpg',
    sendData: {
      LikeSongs: [],
      LikeSongLists: []
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          app.globalData.userInfo = {}
          app.globalData.openid = ''
          app.globalData.logined = false
          this.setData({
            userInfo: app.globalData.userInfo,
            logined: app.globalData.logined,
            likeSongBgc: 'http://qiniu.dreamsakula.top/images/20201218114049.jpg',
            likeSongListBgc: 'http://qiniu.dreamsakula.top/images/20201218114206.jpg',
          })
          return
        }

        if (JSON.stringify(app.globalData.userInfo) === "{}") {
          wx.getUserInfo({
            success: res => {
              // e.detail.userInfo
              this.login({ detail: res })
            }
          })
          return
        }

        this.getCover('LikeSongs').then((res) => {
          this.setData({
            ['sendData.LikeSongs']: res.data[0].songmid
          })
          wx.request({
            url: app.globalData.api.dev + `/song?songmid=${res.data[0].songmid[0].songmid}`,
            success: res => {
              // res.data.data.track_info.album.mid
              this.setData({
                likeSongBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.data.track_info.album.mid}.jpg`
              })
            }
          })
        })

        this.getCover('LikeSongLists').then(res => {
          this.setData({
            ['sendData.LikeSongLists']: res.data[0].songlist_arr
          })
          wx.request({
            url: app.globalData.api.dev + `/songlist?id=${res.data[0].songlist_arr[0].songlist_id}`,
            success: res => {
              this.setData({
                likeSongListBgc: res.data.data.headurl
              })
            }
          })
        })

        this.setData({
          userInfo: app.globalData.userInfo,
          logined: app.globalData.logined,
        })

      }
    })

  },

  init() {

    db.collection('')

  },


  // init(){
  //   wx.checkSession({
  //     success: (res) => {
  //       this.getUserInfo()
  //       .then(()=>{
  //         this.getCover('LikeSongs').then((res)=>{
  //           this.setData({
  //             ['sendData.LikeSongs'] :res.data[0].songmid
  //           })
  //           wx.request({
  //             url: app.globalData.api.dev + `/song?songmid=${res.data[0].songmid[0].songmid}`,
  //             success:res=>{
  //               // res.data.data.track_info.album.mid
  //               this.setData({
  //                 likeSongBgc:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.data.track_info.album.mid}.jpg`
  //               })
  //             }
  //           })
  //         })
  //       })
  //       .then(()=>{
  //         this.getCover('LikeSongLists').then(res=>{
  //           this.setData({
  //             ['sendData.LikeSongLists'] :res.data[0].songlist_arr
  //           })
  //           wx.request({
  //             url: app.globalData.api.dev + `/songlist?id=${res.data[0].songlist_arr[0].songlist_id}`,
  //             success:res=>{
  //               this.setData({
  //                 likeSongListBgc:res.data.data.headurl
  //               })
  //             }
  //           })
  //         })
  //       })
  //       .then(()=>{
  //         wx.hideLoading({
  //         })
  //       })
  //     },
  //     fail:err=>{
  //       wx.showToast({
  //         icon:'none',
  //         title: '授权已过期',
  //       })
  //       app.globalData.logined = false
  //       this.setData({
  //         logined:false,
  //         userInfo:{},
  //         openid:"",
  //         likeSongBgc:'http://qiniu.dreamsakula.top/images/20201218114049.jpg',
  //         likeSongListBgc:'http://qiniu.dreamsakula.top/images/20201218114206.jpg',
  //       })
  //     }
  //   })

  // },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: res => {
          wx.login({
            timeout: 5000,
            success: login => {
              wx.request({
                url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcd6a5a953f46432a&secret=c089429b6f74f9251d0ed36f7c770f11&js_code=${login.code}&grant_type=authorization_code`,
                success: openid => {
                  var userInfo = res.userInfo
                  this.setData({
                    userInfo: userInfo,
                    logined: true,
                    openid: openid.data.openid
                  })
                  app.globalData.logined = true
                  resolve(openid.data)
                }
              })

            }
          })

        },
        fail: () => {
          wx.showToast({
            title: '未授权',
            icon: 'none',
          })
          app.globalData.logined = false
          this.setData({
            logined: false,
            userInfo: {},
            openid: "",
            likeSongBgc: 'http://qiniu.dreamsakula.top/images/20201218114049.jpg',
            likeSongListBgc: 'http://qiniu.dreamsakula.top/images/20201218114206.jpg',
          })
          resolve()
        }
      })
    })
  },

  login(e) {
    if (app.globalData.logined) return;
    wx.showLoading()
    wx.login({
      timeout: 5000,
      success: login => {
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcd6a5a953f46432a&secret=c089429b6f74f9251d0ed36f7c770f11&js_code=${login.code}&grant_type=authorization_code`,
          success: openid => {
            app.globalData.userInfo = e.detail.userInfo
            app.globalData.openid = openid.data.openid
            app.globalData.logined = true
            wx.hideLoading()
            this.setData({
              userInfo: app.globalData.userInfo,
              logined: app.globalData.logined
            })
            this.checkTable()

            this.getCover('LikeSongs').then((res) => {
              this.setData({
                ['sendData.LikeSongs']: res.data[0].songmid
              })
              wx.request({
                url: app.globalData.api.dev + `/song?songmid=${res.data[0].songmid[0].songmid}`,
                success: res => {
                  // res.data.data.track_info.album.mid
                  this.setData({
                    likeSongBgc: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.data.track_info.album.mid}.jpg`
                  })
                }
              })
            })

            this.getCover('LikeSongLists').then(res => {
              this.setData({
                ['sendData.LikeSongLists']: res.data[0].songlist_arr
              })
              wx.request({
                url: app.globalData.api.dev + `/songlist?id=${res.data[0].songlist_arr[0].songlist_id}`,
                success: res => {
                  this.setData({
                    likeSongListBgc: res.data.data.headurl
                  })
                }
              })
            })

          }
        })
      }
    })

  },

  checkTable() {
    db.collection('Users').where({
      _openid: app.globalData.openid
    }).get().then((res) => {
      if (res.data.length === 0) {
        db.collection('Users').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            is_vip: false,
            login_type: 0,
            userInfo: app.globalData.userInfo
          },
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            this.checkTable()
          }
        })
        return
      }
      this.setData({
        is_vip: res.data[0].is_vip,
        login_type: res.data[0].login_type
      })
    })
  },

  getCover(dataset) {
    return new Promise(resolve => {
      db.collection(dataset).where({
        _openid: app.globalData.openid
      }).get().then(res => {
        resolve(res)
      })

    })
  },

  myLikeSong() {
    if (!this.data.logined) return;
    wx.navigateTo({
      url: '/pages/songList/index',
      success: r => {
        r.eventChannel.emit('wherefrom', { data: this.data.sendData.LikeSongs, where: 'user', pic: this.data.likeSongBgc })
      }
    })

  },
  myLikeList() {
    if (!this.data.logined) return;
    wx.navigateTo({
      url: '../like/list/index',
      success: r => {
        r.eventChannel.emit('wherefrom', { data: this.data.sendData.LikeSongLists, where: 'user' })
      }
    })
  }
})