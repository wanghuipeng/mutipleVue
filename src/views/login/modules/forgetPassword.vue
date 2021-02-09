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
              <span>{{ title }}</span>
              <img src="@/assets/images/login/title-icon.png" />
            </p>
          </div>
          <div class="title-sub"></div>
        </div>
        <div class="panel-body">
          <!-- 第一步 -->
          <el-form
            v-if="step === '1'"
            ref="firstForm"
            class="submit-form white-form"
            :model="firstForm"
            :rules="firstRules"
            label-width="0"
          >
            <el-form-item prop="account" style="margin-bottom: 25px;">
              <el-input
                v-model="firstForm.account"
                placeholder="请输入手机号"
                autocomplete="off"
                clearable
              />
            </el-form-item>
            <el-form-item prop="captcha" style="margin-bottom: 25px;">
              <el-input
                v-model="firstForm.captcha"
                placeholder="请输入验证码"
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
            <el-form-item>
              <el-button
                type="primary"
                :loading="$store.state.nextLoading"
                @click="next"
              >下一步</el-button>
            </el-form-item>
          </el-form>
          <!-- 第二步 -->
          <el-form
            v-if="step === '2'"
            ref="secondForm"
            class="submit-form white-form"
            :model="secondForm"
            :rules="secondRules"
            label-width="0"
          >
            <el-form-item prop="newPassword" style="margin-bottom: 25px;">
              <el-input
                v-model="secondForm.newPassword"
                placeholder="请输入新密码"
                autocomplete="off"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item prop="conformNewPassword" style="margin-bottom: 40px;">
              <el-input
                v-model="secondForm.conformNewPassword"
                placeholder="请再次输入新密码"
                autocomplete="off"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="$store.state.nextLoading"
                @click="confirm"
              >完成</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import md5 from 'js-md5';
import { getForgetCaptchaCode, checkForgotPasswordSmsCaptcha, updatePasswordByForgotToken } from '@/api/login'
import geetestMixin from '@/mixins/geetest'
export default {
  components: {

  },
  mixins: [geetestMixin],
  data() {
    return {
      visible: false,
      title: '找回密码',
      step: '1',
      // 获取验证码按钮
      getMobileCaptchaButton: {
        text: '获取验证码',
        disabled: false
      },
      // 第一步表单
      firstForm: {
        account: '',
        captcha: ''
      },
      // 第一步表单校验规则
      firstRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      // 第二步表单
      secondForm: {
        // 修改密码凭证
        forgotPasswordToken: '',
        newPassword: '',
        conformNewPassword: ''
      },
      // 第二步表单校验规则
      secondRules: {
        newPassword: [
          { validator: this.validatorPassword, trigger: 'blur' }
        ],
        conformNewPassword: [
          { validator: this.validatorConfirmPassword, trigger: 'blur' }
        ]
      }
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
        callback(new Error('请输入新密码'));
      } else {
        if (this.secondForm.conformNewPassword !== '') {
          this.$refs.secondForm.validateField('conformNewPassword');
        }
        callback();
      }
    },
    // 校验确认密码
    validatorConfirmPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.secondForm.newPassword) {
        callback(new Error('两次输入的密码不一致!'));
      } else {
        callback();
      }
    },
    // 极验初始化
    initGeet() {
      this.$refs.firstForm.validateField('account', errorMessage => {
        if (!errorMessage) {
          this.init();
          this.getMobileCaptchaButton.disabled = true;
        }
      });
    },
    // 获取验证码
    getMobileCaptcha(data) {
      const para = {};
      para.mobile = this.firstForm.account;
      para.eventType = 'userVerifySms';
      para.operateUserId = '1';
      para.geetest_challenge = data.geetest_challenge;
      para.geetest_validate = data.geetest_validate;
      para.geetest_seccode = data.geetest_seccode;
      getForgetCaptchaCode(para).then(res => {
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
    // 下一步
    next() {
      this.$refs.firstForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true);
          const para = Object.assign({}, this.firstForm);
          checkForgotPasswordSmsCaptcha(para).then(res => {
            this.secondForm.forgotPasswordToken = res.data;
            this.title = '设置密码';
            this.step = '2';
          });
        }
      });
    },
    // 完成
    confirm() {
      this.$refs.secondForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true);
          const para = Object.assign({}, this.secondForm);
          para.newPassword = md5(para.newPassword);
          delete para.conformNewPassword;
          updatePasswordByForgotToken(para).then(res => {
            this.handleClose()
            this.$emit('login')
          });
        }
      });
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
    height: 400px;
    padding: 60px;
    background-color: #fff;
    position: relative;
  }
</style>

