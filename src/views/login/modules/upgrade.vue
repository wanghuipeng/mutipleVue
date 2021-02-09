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
            <el-form-item class="all-screen">
              <el-button
                type="primary"
                :loading="$store.state.nextLoading"
                @click="next"
              >下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-dialog>
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
      visible: false,
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
  mounted() {},
  methods: {
    // 表单赋值
    edit() {
      this.visible = true
    },
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
        this.handleClose()
        this.$emit('material')
      });
    },
    // 验证码登录
    smsLogin() {
      this.$store.dispatch('dispatchUpdateNextLoading', true);
      const para = Object.assign({}, this.submitForm);
      loginBySms(para).then(res => {
        this.$store.dispatch('dispatchUpdateUserInfo', res.data.userInfo);
        this.handleClose()
        this.$emit('material')
      });
    },
    // 提示进入
    noticeEntry() {
      this.$confirm('您的手机号已加入过某企业，点击确定可重新登录', '提示', {
        type: 'info'
      })
        .then(() => {
          this.handleClose()
          this.$emit('login')
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
      this.handleClose()
      this.$emit('login')
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
</style>

