// capcha-login.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capchaCodeSrc: app.globalData.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?',  //图形验证码路径
    picCaptcha: '',  //输入图形验证码
    mobilCapcha: '',  //短信验证码
    sendCount: 60, 
    mobile: '18443225359',
    mobileCaptchaType: 0, 
    mobileCaptchaBusiness: 3,
    sendMsg: '获取短信验证码',
    isCountDown: false //倒计时是否进行中
  },
  /**
   * 监听图形验证码输入
   */
  bindPicCaptcha: function (e) {
    this.setData({
      picCaptcha: e.detail.value
    })
  },
  /**
    * 监听短信验证码输入
    */
  bindMobileCaptcha: function (e) {
    this.setData({
      mobilCapcha: e.detail.value
    })
  },
  /**
   * 点击短信验证码
   */
  capchaCountdown: function () {
    var that = this;
    var picCaptcha = that.data.picCaptcha;
    if (that.data.isCountDown) {
      return false;
    }
    if (!picCaptcha || picCaptcha.length < 4) {
      console.log('图形验证码不正确');
      return false;
    }
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/captchas/checkPic',
      method: 'POST',
      data: {
        captcha: picCaptcha
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        if (data == true) { } else {
          console.log('图形验证码错误');
          util.sendMobilCapcha(that)
        }
      },
      fail: function (data) {
        console.log('图形验证码错误');
      }
    })
  },
  /**
  * 点击登录按钮--登录
  */
  mobileLogin: function () {
    var mobilCapcha = this.data.mobilCapcha;
    if (!mobilCapcha || !this.data.picCaptcha) {
      return false;
    }
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/users/mobileLogin',
      method: 'POST',
      data: {
        captcha: mobilCapcha,
        guestId: util.uuid(),
        mobile: this.data.mobile
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
        } else {
          wx.switchTab({
            url: '../index/index'
          })
        }
      }
    })
  },
  /**
   * 点击刷新图形验证码
   */
  refreshCode: function () {
    this.setData({
      capchaCodeSrc: this.data.capchaCodeSrc + Math.random()
    })
  },
  toRegister: function () {
    wx.switchTab({
      url: '../register/register'
    })
  }
})