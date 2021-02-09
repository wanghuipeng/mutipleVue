<template>
  <el-dialog
    title=""
    :visible.sync="visible"
    width="480px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="dialog-box">
      <div class="panel">
        <div class="panel-title">
          <div class="title-main">
            <p class="main-left">
              <span>登录</span>
              <img src="@/assets/images/login/title-icon.png" />
            </p>
            <el-link class="main-right" @click="register">注册新账号</el-link>
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
          </el-form>
          <!-- 登录方式切换栏 -->
          <div class="tab-bar">
            <span :class="['bar-item', { active: loginType === 'password' }]" @click="loginType = 'password'">密码登录</span>
            <span :class="['bar-item', { active: loginType === 'fast' }]" @click="loginType = 'fast'">快捷登录</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import md5 from 'js-md5';
import { accountLogin, sendMobileLoginSms, loginBySms } from '@/api/login'
import { getJobFairIntroductionVO } from '@/api/jobfair'
import geetestMixin from '@/mixins/geetest'
export default {
  components: {

  },
  mixins: [geetestMixin],
  data() {
    return {
      visible: false,
      // 登录方式
      loginType: 'password',
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
    // 确认表单状态是否记住密码
    const loginInfo = this.$storage.getLocation('loginInfo');
    if (loginInfo) {
      this.submitForm = JSON.parse(loginInfo);
      this.rememberPassword = true;
    }
  },
  methods: {
    // 表单赋值
    edit() {
      this.visible = true
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
            // 登录成功后重新查询当前用户所在租户是否已加入该招聘会
            const params = {
              jobFairId: this.$route.query.jobFairBaseId
            }
            getJobFairIntroductionVO(params).then(res => {
              this.handleClose()
              this.$emit('updateIsJoin', res.data.companyIsJoin)
            })
          });
        }
      });
    },
    // 忘记密码
    forgetPassword() {
      this.handleClose()
      this.$emit('forgetPassword')
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
            this.handleClose()
            this.$emit('enterJoin')
          });
        }
      });
    },
    // 注册
    register() {
      this.handleClose()
      this.$emit('upgrade')
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
  @import '@/assets/sass/login/common.scss';
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .dialog-box{
    box-sizing: border-box;
    width: 480px;
    height: 500px;
    padding: 60px;
    background-color: #fff;
    position: relative;
  }
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
</style>
