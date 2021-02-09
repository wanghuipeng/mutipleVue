/*
  极验mixin
 */
require('@/utils/gt')
import { geetest } from '@/api/login'

const geetestMixin = {
  data() {
    return {
    }
  },
  methods: {
    // 初始化极验
    init() {
      const that = this
      geetest().then(res => {
        window.initGeetest({
          gt: res.gt,
          challenge: res.challenge,
          offline: !res.success,
          new_captcha: true,
          product: 'bind',
          https: true
        }, function(captchaObj) {
          captchaObj.onReady(function() {
            captchaObj.verify();
            console.log('ready')
            // your code
          }).onSuccess(function() {
            var result = captchaObj.getValidate()
            that.getMobileCaptcha(result)
            console.log('success', result)
            // your code
          }).onError(function() {
            console.log('error')
            // your code
          }).onClose(function() {
            that.getMobileCaptchaButton.disabled = false;
            console.log('close')
          })
        })
      })
    }
  }
}
export default geetestMixin
