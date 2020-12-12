// components/scrollItem/index.js
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

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log(this.data.content)
    },
    moved: function () { },
    detached: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
