var app = getApp();
/**
 * 密码的显示与隐藏功能
 */
function selectEyes(that) {
  if (that.data.eyes_visible) {
    that.setData({
      eyes_visible: false,
      eyes_src: '../../images/logs/icon_visible.png'
    })
  } else {
    that.setData({
      eyes_visible: true,
      eyes_src: '../../images/logs/icon_invisible.png'
    })
  }
}
/**
 * 发送短信验证码接口
 */
function sendMobilCapcha(that) {
  wx.request({
    url: app.globalData.DEFAULT_DOMAIN + '/users/mobileCaptcha',
    method: 'POST',
    data: {
      mobile: that.data.mobile,
      picCaptcha: that.data.picCaptcha,
      type: that.data.mobileCaptchaType,
      business: that.data.mobileCaptchaBusiness,
      device: deviceCode(),
      guestId: uuid()
    },
    success: function (res) {
      if (res.data.ret === -1) {
        console.log(res.data.msg);
        countDown(that);
      } else {
        console.log('短信验证码发送成功');
        countDown(that);
      }
    }
  })
}
/**
 * 获取和后端对应的deviceCode
 */
function deviceCode () {
  var deviceCode = 0;
  var system = '';  //操作系统版本
  //获取系统信息。
  wx.getSystemInfo({
    success: function (res) {
      console.log(res.system)
      system = res.system.replace(/[^a-zA-Z]/g, ''); // ios or android
      if (system == 'Android') {
        deviceCode = 3;
      }
      if (system == 'iOS') {
        deviceCode = 6;
      }
    }
  })
  return deviceCode;
}
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
function countDown(that) {
  if (that.data.sendCount > 0) {
    that.setData({
      sendMsg: that.data.sendCount + 's后重新获取',
      sendCount: that.data.sendCount -1,
      isCountDown: true
    })
    setTimeout(function () {
      countDown(that);
    }, 1000);
  }else {
    that.setData({
      sendMsg: '重新获取',
      sendCount: 60,
      isCountDown: false
    })
  }
}


module.exports = {
  sendMobilCapcha: sendMobilCapcha,
  selectEyes: selectEyes,
  deviceCode: deviceCode,
  uuid: uuid,
  countDown: countDown
}
