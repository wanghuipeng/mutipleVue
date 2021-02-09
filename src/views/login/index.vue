<template>
  <div class="wrap" style="background-color: #DFEFF7;">
    <div class="main">
      <div class="main-box">
        <div class="box-left">
          <img
            src="~@/assets/images/common/logo_white.png"
            class="left-logo"
            @click="()=>{this.$router.push({ path: '/' })}"
          />
          <p class="left-title">大猎英才<br />科技赋能招聘</p>
          <p class="left-sub">大猎英才是一个依托于人工智能、大数据、区块链等技术为企业客户、猎头(供应商)和中高端人才实现三方高效互动的人才职业发展平台</p>
          <a href="https://www.dalieyingcai.com/" target="_blank" class="left-btn">了解更多<i class="el-icon-arrow-right" /></a>
          <img src="@/assets/images/login/bg.jpg" class="left-bg" />
        </div>
        <div class="box-right">
          <div v-if="showType === 'login'" class="panel">
            <div class="panel-title">
              <div class="title-main">
                <p class="main-left">
                  <span>登录</span>
                  <img src="@/assets/images/login/title-icon.png" />
                </p>
                <el-link class="main-right" @click="showType = 'register'">注册新账号</el-link>
              </div>
              <div class="title-sub"></div>
            </div>
            <div class="panel-body">
              <!-- 密码登录 -->
              <el-form
                v-if="loginType === 'password'"
                ref="submitForm"
                class="submit-form white-form"
                :model="submitForm"
                :rules="submitRules"
                label-width="0"
              >
                <el-form-item prop="account" style="margin-bottom: 25px;">
                  <el-input
                    v-model.trim="submitForm.account"
                    placeholder="请输入手机号"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="password" style="margin-bottom: 15px;">
                  <el-input
                    v-model="submitForm.password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    clearable
                    show-password
                    @keyup.enter.native="login"
                  />
                </el-form-item>
                <p class="password-text" style="margin-bottom: 25px;">
                  <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
                  <el-link @click="forgetPassword">忘记密码</el-link>
                </p>
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="login"
                  >登录</el-button>
                </el-form-item>
                <!-- <div class="login-type">
                  <p class="icon">
                    <img src="@/assets/images/login/wechat-icon.png" @click="wechatLogin">
                  </p>
                  <p class="title">微信扫码登录</p>
                </div> -->
              </el-form>
              <!-- 快捷登录 -->
              <el-form
                v-else
                ref="submitSmsForm"
                class="submit-form white-form"
                :model="submitSmsForm"
                :rules="submitSmsRules"
                label-width="0"
              >
                <el-form-item prop="mobile" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitSmsForm.mobile"
                    placeholder="输入手机号"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="mobileCaptcha" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitSmsForm.mobileCaptcha"
                    placeholder="输入验证码"
                    autocomplete="off"
                    :maxlength="4"
                    @keyup.enter.native="smsLogin"
                  >
                    <el-button
                      slot="suffix"
                      type="text"
                      :disabled="getMobileCaptchaButton.disabled"
                      @click="initGeet"
                    >{{ getMobileCaptchaButton.text }}</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="smsLogin"
                  >登录</el-button>
                </el-form-item>
                <!-- <div class="login-type">
                  <p class="icon">
                    <img src="@/assets/images/login/wechat-icon.png" @click="wechatLogin">
                  </p>
                  <p class="title">微信扫码登录</p>
                </div> -->
              </el-form>
              <!-- 登录方式切换栏 -->
              <div class="tab-bar">
                <span :class="['bar-item', { active: loginType === 'password' }]" @click="loginType = 'password'">密码登录</span>
                <span :class="['bar-item', { active: loginType === 'fast' }]" @click="loginType = 'fast'">快捷登录</span>
              </div>
            </div>
          </div>
          <div v-else class="panel">
            <div class="panel-title">
              <div class="title-main">
                <p class="main-left">
                  <span>注册</span>
                  <img src="@/assets/images/login/title-icon.png" />
                </p>
                <el-link class="main-right" @click="showType = 'login'">已有账号，直接登录</el-link>
              </div>
              <div class="title-sub">选择注册身份类型</div>
            </div>
            <div class="panel-body">
              <!-- 选择注册方式 -->
              <div class="register-type">
                <div class="type-item" @click="$router.push('/upgrade')">
                  <img src="@/assets/images/login/register-type-1.png" class="item-img" style="width: 100px;height: 100px;margin: 50px auto 28px;" />
                  <p class="item-text">我是企业</p>
                </div>
                <div class="type-item" @click="$router.push('/signup')">
                  <img src="@/assets/images/login/register-type-2.png" class="item-img" style="width: 68px;height: 120px;margin: 40px auto 18px;" />
                  <p class="item-text">我是供应商</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import { loginByWechatCode, accountLogin, sendMobileLoginSms, loginBySms } from '@/api/login'
import geetestMixin from '@/mixins/geetest'
export default {
  components: {

  },
  mixins: [geetestMixin],
  data() {
    return {
      // 页面显示内容为登录/选择注册方式
      showType: 'login',
      // 登录方式
      loginType: this.$route.query.loginType || 'password',
      // 微信扫码登录参数信息
      wechatLoginPara: {
        url: 'https://open.weixin.qq.com/connect/qrconnect',
        appid: process.env.NODE_ENV === 'production' ? 'wx53daba1387629006' : 'wx434bbed3813b9a0f',
        redirect_uri: encodeURIComponent(window.location.href).split('?')[0],
        response_type: 'code',
        scope: 'snsapi_login',
        state: '123456'
      },
      // 提交表单
      submitForm: {
        account: '',
        password: ''
      },
      // 提交表单校验规则
      submitRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      // 是否记住密码
      rememberPassword: false,
      // 获取验证码按钮
      getMobileCaptchaButton: {
        text: '获取验证码',
        disabled: false
      },
      // 提交短信表单
      submitSmsForm: {
        mobile: '',
        mobileCaptcha: ''
      },
      // 提交短信表单校验规则
      submitSmsRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
        ],
        mobileCaptcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      captchaObj: ''
    }
  },
  mounted() {
    document.title = '猎头登录-大猎英才'
    // 微信授权登录
    const code = this.$route.query.code;
    if (code) {
      const para = {};
      para.code = code;
      loginByWechatCode(para).then(res => {
        this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
        const redirect = this.$route.query.redirect;
        this.$router.push(redirect ? decodeURIComponent(redirect) : '/');
      });
    }
    // 确认表单状态是否记住密码
    const loginInfo = this.$storage.getLocation('loginInfo');
    if (loginInfo) {
      this.submitForm = JSON.parse(loginInfo);
      this.rememberPassword = true;
    }
  },
  methods: {
    // 微信登录
    wechatLogin() {
      const { url, appid, redirect_uri, response_type, scope, state } = this.wechatLoginPara;
      window.location.href = `${url}?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}#wechat_redirect`;
    },
    // 登录
    login() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true);
          const para = Object.assign({}, this.submitForm);
          para.password = md5(para.password);
          accountLogin(para).then(res => {
            if (this.rememberPassword) {
              this.$storage.setLocation('loginInfo', JSON.stringify(this.submitForm));
            } else {
              this.$storage.removeLocationItem('loginInfo');
            }
            this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
            const redirect = this.$route.query.redirect;
            this.$router.push(redirect ? decodeURIComponent(redirect) : '/');
          });
        }
      });
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push('/forgetPassword');
    },
    // 极验初始化
    initGeet() {
      this.$refs.submitSmsForm.validateField('mobile', errorMessage => {
        if (!errorMessage) {
          this.init();
          this.getMobileCaptchaButton.disabled = true;
        }
      });
    },
    // 获取验证码
    getMobileCaptcha(data) {
      const para = {};
      para.mobile = this.submitSmsForm.mobile;
      para.geetest_challenge = data.geetest_challenge;
      para.geetest_validate = data.geetest_validate;
      para.geetest_seccode = data.geetest_seccode;
      sendMobileLoginSms(para).then(res => {
        this.getMobileCaptchaButton.disabled = true;
        this.getMobileCaptchaButton.text = `60秒`;
        let index = 60;
        const Timer = setInterval(() => {
          if (index > 0) {
            index--;
            this.getMobileCaptchaButton.text = `${index}秒`;
          } else {
            this.getMobileCaptchaButton.disabled = false;
            this.getMobileCaptchaButton.text = `获取验证码`;
            clearInterval(Timer);
          }
        }, 1000)
      });
    },
    // 短信登录
    smsLogin() {
      this.$refs.submitSmsForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true);
          const para = Object.assign({}, this.submitSmsForm);
          loginBySms(para).then(res => {
            this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
            const redirect = this.$route.query.redirect;
            this.$router.push(redirect ? decodeURIComponent(redirect) : '/');
          });
        }
      });
    }
  }
}
</script>
<style scoped lang="scss">
  @import '@/assets/sass/login/common.scss';
  .tab-bar{
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 175px;
    right: 175px;
    bottom: 60px;
    &:after{
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      background-color: #b3b3b3;
      position: absolute;
      left: 50%;
      top: 0;
    }
    .bar-item{
      font-size: 12px;
      color: #777;
      cursor: pointer;
      &.active{
        color: #222;
      }
    }
  }
  .register-type{
    display: flex;
    width: 100%;
    padding: 56px 5px 5px;
    justify-content: space-between;
    .type-item{
      width:160px;
      height:240px;
      box-shadow:0px 0px 1px 0px rgba(0,0,0,0.15);
      cursor: pointer;
      &:hover{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 6px 0px rgba(0,0,0,0.15);
        .item-text{
          font-weight: bold;
        }
      }
      .item-img{
        display: block;
      }
      .item-text{
        text-align: center;
        font-size: 14px;
        color: #595F66;
      }
    }
  }
</style>
