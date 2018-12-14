// register.js
var util = require('../../utils/util.js');
var MD5 = require('../../utils/MD5.js'); 
var app = getApp();
var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
var isMobile = true;
var sendCount = 60;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picCapcha:  app.globalData.WEB_DEFAULT_DOMAIN +'/siteUser/getPicCaptcha?', //图形验证码
    sendMsg: '获取短信验证码',
    mobile:'',
    pic:'',
    mobCapcha:'',
    password:'',
    mobileCaptchaType: 1,
    mobileCaptchaBusiness: 0,
    sendCount: 60,
    eyes_visible: true,
    eyes_src: '../../images/logs/icon_invisible.png'
  },
  /**
   * 跳转登录页
   */
  toLogin: function () {
    wx.navigateTo({
      url: '../logs/logs'   
    })
  },
  /**
   * 密码可见
   */
  toggleEye: function () {
    util.selectEyes(this);
  },
  /**
   * 同步获取用户输入值
   */
  bindMobInput: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  bindPicInput: function (e) {
    var that = this;
    that.setData({
      pic: e.detail.value
    })
  },
  bindMobCapchaInput: function (e) {
    var that = this;
    that.setData({
      mobCapcha: e.detail.value
    })
  },
  bindPasswordInput: function (e) {
    var that = this;
    that.setData({
      password: e.detail.value
    })
  },
  /**
   * 手机号基本校验
   */
  checkMobile: function (e) {
    if(!this.data.mobile ) {
      isMobile = false;
      return;
    }
    if (!mobilePattern.test(this.data.mobile)){
      console.log('手机号码格式有误');
      isMobile = false;
      return;
    }
  },
  /**
   * 刷新图形验证码
   */
  refreshCode: function () {
    var that = this;
    that.setData(
      {
        picCapcha: app.globalData.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?code='+ Math.random()
      }
    );
  },
  /**
  * 发送短信验证码
  */
  // sendMobCapcha: function () {
  //   wx.request({
  //     url: app.globalData.DEFAULT_DOMAIN + '/users/mobileCaptcha',
  //     method: 'POST',
  //     data: {
  //       mobile: that.data.mobile,
  //       picCaptcha: that.data.pic,
  //       type: that.data.mobileCaptchaType,
  //       business: that.data.mobileCaptchaBusiness,
  //       guestId: '4051AD2D4F14EE0F301609739D018601'
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       if (!res.data || res.data.ret === -1) {
  //         wx.showModal({
  //           content: res.data.msg,
  //           showCancel: false,
  //           success: function (res) { }
  //         })
  //         return;
  //       }
  //       // 倒计时

  //     },
  //     fail: function (res) {
  //       console.log(res.data)
  //     }
  //   })
  // },

  /**
   * 获取短信验证码校验手机号和图形验证码
   */
  getMobCapcha: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.checkMobile();
    if (!that.data.mobile || !mobilePattern.test(that.data.mobile) || !that.data.pic) {
      return;
    }
    //校验手机号
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/users/isUnique',
      method: 'POST',
      data: {
        account: that.data.mobile
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ret === -1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) { }
          })
          return;
        };
        //继续校验图形验证码
        wx.request({
          url: app.globalData.DEFAULT_DOMAIN + '/captchas/checkPic',
          method: 'POST',
          data: {
            captcha: that.data.pic
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data === false) {
              wx.showModal({
                content: '图形验证码有误！',
                showCancel: false,
                success: function (res) { }
              })
              // return;
            }
            // this.sendMobCapcha();发送短信验证码
            wx.request({
              url: app.globalData.DEFAULT_DOMAIN + '/users/mobileCaptcha',
              method: 'POST',
              data: {
                mobile: that.data.mobile,
                picCaptcha: that.data.pic,
                type: that.data.mobileCaptchaType,
                business: that.data.mobileCaptchaBusiness,
                guestId: '4051AD2D4F14EE0F301609739D018601'
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (!res.data || res.data.ret === -1) {
                  wx.showModal({
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) { }
                  })
                  // return;
                }
                // 倒计时
                util.countDown(that);
              },
              fail: function (res) {
                console.log(res.data)
              }
            })
          },
          fail: function (res) {
            console.log(res.data)
          }
        })
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
    
  },
  /**
   * 注册
   */
  toRegister: function () {
    var that = this;
    if(!that.data.mobile || !that.data.pic || !that.data.mobCapcha || !that.data.password) {
      return;
    }
    if (that.data.password === "" || that.data.password === null) {
      wx.showModal({
        title: '提示',
        content: '密码不能为空',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')  
          }
        }
      });
      return;
    };
    that.setData({
      password: MD5.hexMD5(that.data.password)
    });
     
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/users/register',
      method: 'POST',
      data: {
        picCaptcha: that.data.pic,
        password: MD5.hexMD5(that.data.password),
        mobile: that.data.mobile,
        captcha: that.data.mobCapcha,
        // channelCode: ipCookie('utm_from'),
        // act: act,
        // channelParams: ipCookie('channelParams'),
        device: 6,
        guestId: '4051AD2D4F14EE0F301609739D018601'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshCode();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})