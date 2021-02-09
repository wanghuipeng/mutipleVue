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
              <div class="title-sub">填写账号信息</div>
            </div>
            <div class="panel-body">
              <el-form
                ref="submitForm"
                class="submit-form white-form"
                :model="submitForm"
                :rules="submitFormRules"
                label-width="0"
              >
                <el-form-item prop="userName" style="margin-bottom: 15px;">
                  <el-input
                    v-model="submitForm.userName"
                    placeholder="您的姓名"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="name" style="margin-bottom: 15px;">
                  <el-input
                    v-model="submitForm.name"
                    placeholder="请输入企业名称（需与单位证照资料一致）"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <!-- <el-form-item prop="shortName" style="margin-bottom: 15px;">
                  <el-input
                    v-model="submitForm.shortName"
                    placeholder="请输入企业简称（企业常用简称）"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item> -->
                <el-form-item prop="replaceName" style="margin-bottom: 15px;">
                  <el-input
                    v-model="submitForm.replaceName"
                    placeholder="请输入企业对外显示名称"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="industrys1" style="margin-bottom: 15px;">
                  <el-select v-model="submitForm.industrys1" placeholder="请选择企业行业" clearable>
                    <el-option
                      v-for="item in dictData.industry"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="scale" style="margin-bottom: 15px;">
                  <el-select v-model="submitForm.scale" placeholder="请选择企业规模" clearable>
                    <el-option
                      v-for="item in dictData.dicts.enterpriseScale"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="areas" style="margin-bottom: 25px;">
                  <el-cascader
                    v-model="submitForm.areas"
                    :options="dictData.areas"
                    clearable
                    style="width: 100%;"
                  />
                </el-form-item>
                <el-form-item class="all-screen">
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="completeInfo"
                  >完成注册</el-button>
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
import { registerCompanyAccount } from '@/api/login'
export default {
  data() {
    return {
      // 提交表单
      submitForm: {
        accountType: 2, // 企业账户类型：供应商
        userName: '',
        name: '',
        shortName: '',
        replaceName: '',
        industrys1: '',
        scale: '',
        areas: []
      },
      // 提交表单校验规则
      submitFormRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: this.$verify.nickNameFormat, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
        replaceName: [{ required: true, message: '请输入企业对外显示名称', trigger: 'blur' }]
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
    document.title = '完善企业资料-大猎英才'
  },
  methods: {
    // 完善信息
    completeInfo() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true)
          const para = Object.assign({}, this.submitForm)
          para.provinceId = para.areas[0]
          para.cityId = para.areas[1]
          para.areaId = para.areas[2]
          registerCompanyAccount(para).then(res => {
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

