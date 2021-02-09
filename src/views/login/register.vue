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
          <div class="panel">
            <div class="panel-title">
              <div class="title-main">
                <p class="main-left">
                  <span>注册</span>
                  <img src="@/assets/images/login/title-icon.png" />
                </p>
                <el-link class="main-right" @click="login">已有账号，直接登录</el-link>
              </div>
              <div class="title-sub">请设置您的账号和密码</div>
            </div>
            <div class="panel-body">
              <el-form
                ref="submitForm"
                class="submit-form white-form"
                :model="submitForm"
                :rules="submitRules"
                label-width="0"
              >
                <el-form-item prop="mobile" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.mobile"
                    placeholder="输入手机号"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="mobileCaptcha" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.mobileCaptcha"
                    placeholder="输入验证码"
                    autocomplete="off"
                    :maxlength="4"
                  >
                    <el-button
                      slot="suffix"
                      type="text"
                      :disabled="getMobileCaptchaButton.disabled"
                      @click="initGeet"
                    >{{ getMobileCaptchaButton.text }}</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.password"
                    placeholder="设置登录密码（建议英文数字组合）"
                    autocomplete="off"
                    clearable
                    show-password
                  />
                </el-form-item>
                <el-form-item prop="conformPassword" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.conformPassword"
                    placeholder="再次输入密码"
                    autocomplete="off"
                    clearable
                    show-password
                  />
                </el-form-item>
                <el-form-item prop="inviteCode" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.inviteCode"
                    placeholder="如果您有邀请码，请输入"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item class="all-screen">
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="register"
                  >注册</el-button>
                </el-form-item>
                <div class="protocol" style="margin-top: 15px;">
                  <p>点击「注册」按钮，即代表你同意</p>
                  <el-link class="link" @click="toDetail('/protocol2')">《大猎英才平台用户协议》</el-link>
                  <el-link class="link" @click="toDetail('/protocol1')">《业务合作协议》</el-link>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import { getRegisterCaptchaCode, registerByMobile } from '@/api/login'
import geetestMixin from '@/mixins/geetest'
export default {
  components: {

  },
  mixins: [geetestMixin],
  data() {
    return {
      // 获取验证码按钮
      getMobileCaptchaButton: {
        text: '获取验证码',
        disabled: false
      },
      // 提交表单
      submitForm: {
        mobile: '',
        mobileCaptcha: '',
        password: '',
        conformPassword: '',
        inviteCode: this.$route.query.serialCode
      },
      // 提交表单校验规则
      submitRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
        ],
        mobileCaptcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { validator: this.validatorPassword, trigger: 'blur' }
        ],
        conformPassword: [
          { validator: this.validatorConfirmPassword, trigger: 'blur' }
        ]
      },
      captchaObj: ''
    }
  },
  mounted() {
    document.title = '猎头注册-大猎英才'
  },
  methods: {
    // 校验密码
    validatorPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.submitForm.conformPassword !== '') {
          this.$refs.submitForm.validateField('confirm');
        }
        callback();
      }
    },
    // 校验确认密码
    validatorConfirmPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.submitForm.password) {
        callback(new Error('两次输入的密码不一致!'));
      } else {
        callback();
      }
    },
    // 极验初始化
    initGeet() {
      this.$refs.submitForm.validateField('mobile', errorMessage => {
        if (!errorMessage) {
          this.init();
          this.getMobileCaptchaButton.disabled = true;
        }
      });
    },
    // 获取验证码
    getMobileCaptcha(data) {
      const para = {};
      para.mobile = this.submitForm.mobile;
      para.geetest_challenge = data.geetest_challenge;
      para.geetest_validate = data.geetest_validate;
      para.geetest_seccode = data.geetest_seccode;
      getRegisterCaptchaCode(para).then(res => {
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
    // 注册
    register() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true);
          const para = Object.assign({}, this.submitForm);
          para.password = md5(para.password);
          delete para.conformPassword;
          registerByMobile(para).then(res => {
            this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
            this.$router.push('/');
          });
        }
      });
    },
    // 新窗口打开页面
    toDetail(url) {
      window.open(url)
    },
    // 登录
    login() {
      this.$router.push('/login');
    }
  }
}
</script>
<style scoped lang="scss">
  @import '@/assets/sass/login/common.scss';
  .protocol{
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #B2B2B2FF;
    .link {
      font-size: 12px !important;
      color: $main-color !important;
      &.is-underline:hover:after {
          border-color: $main-color !important;
      }
    }
  }
</style>

