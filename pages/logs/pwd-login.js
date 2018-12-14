// pages/logs/pwd-login.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eyes_visible: true, //控制input password 属性
    eyes_src: '../../images/logs/icon_invisible.png', //显示隐藏/图标路径
    password: ''
  },
  /**
   * 监听密码框页输入
   */
  watchPwd: function (e) {
   this.setData({
     password: e.detail.value
   })
  },
  /**
   * 点击登录按钮--登录
   */
  userLogin: function () {
    var pwd = this.data.password;
    if (!pwd) {
      return false;
    }
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/users/login',
      method: 'POST',
      data: {
        account: "18443225359",
        guestId: util.uuid(),
        password: md5.md5(pwd)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.ret === -1) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) { }
          })
          console.log(res.data.msg);
        }else {
          wx.switchTab({
            url: '../index/index'
          })
        }
      }
    })
  },
  /**
   * 用户点击注册账号--跳转到注册页面
   */
  toRegister: function () {
    wx.switchTab({
      url: '../register/register',
    })
  },
  toForgetPwd: function() {
    wx.navigateTo({
      url: 'capcha-login',
    })
  },
  /**
   * 密码的显示与隐藏功能
   */
  
  selectEyes: function() {
    util.selectEyes(this);
  }
})