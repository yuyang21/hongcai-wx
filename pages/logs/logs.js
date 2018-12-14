//logs.js
var mobileRep = /^1(3|4|5|7|8)\d{9}$/;
var app = getApp();
Page({
  data: {
    inputValue: ''
  },
  onLoad: function () {
    
  },
  toRegister: function () {
    wx.switchTab({
      url: '../register/register'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 检验手机号码
   */
  checkMobile: function (e) {
    var mobile = this.data.inputValue;
    if (!mobile) {
      console.log('请输入手机号码');
      return false;
    }
    if (!(mobileRep.test(mobile))) {
      console.log("请输入正确手机号！");
      return false;
    } 
    wx.request({
      url: app.globalData.DEFAULT_DOMAIN + '/users/isUnique', 
      method: 'POST',
      data: {
        account: mobile
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ret !== -1) {
          wx.showModal({
            title: '提示',
            content: '您还没有注册哦，请先注册！',
            showCancel: false,
            success: function (res) {}
          })
          console.log('您还没有注册哦，请先注册！');
        }else {
          wx.navigateTo({
            url: 'pwd-login',
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  }
})
