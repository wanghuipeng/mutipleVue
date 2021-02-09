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
              <div class="title-sub">请进一步完善个人资料</div>
            </div>
            <div class="panel-body">
              <el-form
                ref="submitForm"
                class="submit-form white-form"
                :model="submitForm"
                :rules="submitFormRules"
                label-width="0"
              >
                <el-form-item prop="trueName" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.trueName"
                    placeholder="请输入姓名"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="nickName" style="margin-bottom: 25px;">
                  <el-input v-model="submitForm.nickName" placeholder="请输入花名" autocomplete="off" clearable>
                    <el-tooltip slot="suffix" effect="dark" placement="top">
                      <div
                        slot="content"
                        style="max-width: 200px;"
                      >花名是您在大猎英才平台上的主要展示名称，既体现您的个人品牌，同时也保护您的个人隐私，建议认真填写。</div>
                      <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" style="margin-right: 4px;" />
                    </el-tooltip>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item prop="email" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.email"
                    placeholder="请输入邮箱，便于接受平台通知"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>-->
                <el-form-item class="all-screen">
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="completeInfo"
                  >完成</el-button>
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
import { completeRegisterHhUserProfile } from '@/api/login'
export default {
  data() {
    return {
      // 提交表单
      submitForm: {
        trueName: '',
        nickName: '',
        email: ''
      },
      // 提交表单校验规则
      submitFormRules: {
        trueName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: this.$verify.trueNameFormat, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入花名', trigger: 'blur' },
          { validator: this.$verify.nickNameFormat, trigger: 'blur' }
        ],
        email: [{ validator: this.$verify.emailFormat, trigger: 'blur' }]
      }
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    document.title = '完善注册资料-大猎英才'
  },
  methods: {
    // 完善信息
    completeInfo() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true)
          const para = Object.assign({}, this.submitForm)
          completeRegisterHhUserProfile(para).then(res => {
            const userInfo = this.$store.state.userInfo
            userInfo.registerProcess = 2
            this.$store.dispatch('dispatchUpdateUserInfo', userInfo)
            this.$router.push('/')
          })
        }
      })
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
</style>

