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
                  <span>企业注册</span>
                  <img src="@/assets/images/login/title-icon.png" />
                </p>
                <el-link class="main-right" @click="login">已有账号，直接登录</el-link>
              </div>
              <div class="title-sub">验证手机号码</div>
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
                <el-form-item v-if="userStatus === 1" prop="password" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.password"
                    placeholder="设置登录密码（建议英文数字组合）"
                    autocomplete="off"
                    clearable
                    show-password
                  />
                </el-form-item>
                <el-form-item v-if="userStatus === 1" prop="conformPassword" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.conformPassword"
                    placeholder="再次输入密码"
                    autocomplete="off"
                    clearable
                    show-password
                  />
                </el-form-item>
                <p class="password-text" style="margin-bottom: 25px;">
                  <el-checkbox v-model="agreeIt">我已阅读并同意<a class="link" href="https://www.dalieyingcai.com/protocol/user" target="_blank">《大猎英才用户服务协议》</a></el-checkbox>
                </p>
                <el-form-item class="all-screen">
                  <el-button
                    :disabled="!agreeIt"
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="next"
                  >下一步</el-button>
                </el-form-item>
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
import { getCommonCaptchaCode, registerByMobile, loginBySms } from '@/api/login'
import geetestMixin from '@/mixins/geetest'
export default {
  components: {

  },
  mixins: [geetestMixin],
  data() {
    return {
      agreeIt: false,
      // 输入手机号用户状态
      userStatus: null,
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
        conformPassword: ''
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
    document.title = '企业注册-大猎英才'
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
      getCommonCaptchaCode(para).then(res => {
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
        // 输入手机号用户状态
        this.userStatus = res.data;
        if (this.userStatus === 3) {
          this.noticeEntry();
        }
      });
    },
    // 注册
    register() {
      this.$store.dispatch('dispatchUpdateNextLoading', true);
      const para = Object.assign({}, this.submitForm);
      para.password = md5(para.password);
      delete para.conformPassword;
      registerByMobile(para).then(res => {
        this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
        this.$router.push('/material');
      });
    },
    // 验证码登录
    smsLogin() {
      this.$store.dispatch('dispatchUpdateNextLoading', true);
      const para = Object.assign({}, this.submitForm);
      loginBySms(para).then(res => {
        this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
        this.$router.push('/material');
      });
    },
    // 提示进入
    noticeEntry() {
      this.$confirm('您的手机号已加入过某企业，点击确定可重新登录', '提示', {
        type: 'info'
      })
        .then(() => {
          this.$router.push('/login');
        })
        .catch(() => {
          window.location.reload();
        })
    },
    // 下一步
    next() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          switch (this.userStatus) {
            case 1:
              this.register();
              break;
            case 2:
              this.smsLogin();
              break;
          }
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
  .el-checkbox ::v-deep .el-checkbox__label{
    color: initial ;
  }
  .link{
    color: #1678f9;
    text-decoration: none;
    &:hover{
      text-decoration: underline;
    }
  }
</style>

