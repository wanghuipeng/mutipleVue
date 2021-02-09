<template>
  <div v-loading="loading" class="base-info-page child-view" style="min-height: 381px;">
    <div class="base-info-part">
      <el-form
        v-if="ruleForm.id"
        ref="ruleForm"
        :model="ruleForm"
        :rules="ruleFormRules"
        label-width="100px"
      >
        <el-form-item label="花名" prop="nickName">
          <el-input
            v-model="ruleForm.nickName"
            :disabled="this.$store.state.common.certificationStatus === 1"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group
            v-model="ruleForm.gender"
            :disabled="this.$store.state.common.certificationStatus === 1"
          >
            <el-radio label="1">先生</el-radio>
            <el-radio label="2">女士</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <span style="line-height: 34px;">{{ ruleForm.mobile }}</span>
        </el-form-item>
        <el-form-item label="所在地" prop="city">
          <select-picker
            v-show="Array.isArray(defaultCityCode) && defaultCityCode.length > 0"
            style="position: absolute;top: 0;"
            :class-name="'baseInfo-page-picker'"
            :key-name="'city'"
            :first-tab-name="firstTabNameOne"
            :data-source="address"
            :max-number="1"
            :level-number="2"
            :default-value="defaultCityCode"
            :form-name="'ruleForm'"
            @afterClose="handleClose"
            @deleteRules="deleteRules"
          />
          <select-picker
            v-if="Array.isArray(defaultCityCode) && defaultCityCode.length > 0"
            style="position: absolute;top: 0;"
            :class-name="'baseInfo-page-picker'"
            :key-name="'city'"
            :first-tab-name="firstTabNameOne"
            :data-source="address"
            :max-number="1"
            :level-number="2"
            :default-value="defaultCityCode"
            :form-name="'ruleForm'"
            @afterClose="handleClose"
            @deleteRules="deleteRules"
          />
        </el-form-item>
        <el-form-item label="目前身份" prop="titileCode">
          <el-select v-model="ruleForm.titileCode" placeholder="请选择">
            <el-option
              v-for="(item,index) in dictData.dicts.hunterIdentity"
              :key="index"
              :label="item.label"
              :value="item.value - 0"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="从业时间" prop="workStartDate">
          <el-select v-model="ruleForm.workStartDate" placeholder="请选择">
            <el-option
              v-for="(item,index) in workStartDateArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="微信" prop="wxAccount">
          <el-input v-model="ruleForm.wxAccount" />
        </el-form-item>
        <el-form-item label="QQ" prop="qqAccount">
          <el-input v-model="ruleForm.qqAccount" />
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduction">
          <el-input
            v-model="ruleForm.introduction"
            maxlength="200"
            type="textarea"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="save-btn"
            @click="submitForm('ruleForm',[{keyName:'address',rules:'请选择所在地'}])"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserProfile, updateHhProfile } from '@/api/myCenter'
import SelectPicker from '@/components/common/selectPicker'
import { isRealNum } from '@/utils/common'

export default {
  components: {
    SelectPicker
  },
  data() {
    return {
      loading: false,
      defaultCityCode: [],
      address: [],
      firstTabNameOne: '',
      workStartDateArr: [],
      ruleForm: {
        nickName: null,
        gender: null,
        mobile: null,
        province: null,
        city: null,
        titileCode: null,
        workStartDate: null,
        email: null,
        wxAccount: null,
        qqAccount: null,
        introduction: null
      },
      ruleFormRules: {
        nickName: [
          { required: true, message: '请输入花名', trigger: 'blur' },
          { validator: this.$verify.nickNameFormat, trigger: 'change' }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        mobile: [{ required: true }],
        city: [{ required: true, message: '请选择所在地', trigger: 'blur' }],
        titileCode: [
          { required: true, message: '请选择目前身份', trigger: 'change' }
        ],
        workStartDate: [
          { required: true, message: '请选择从业时间', trigger: 'change' }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        qqAccount: [
          { validator: this.$verify.numberFormatQQ, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    this.getUserProfile()
    // 热门城市
    // const popularCity = JSON.parse(JSON.stringify(this.dictData.dicts.popularCity))
    //   popularCity.forEach(item => {
    //     delete item.children
    //   })
    // 擅长城市
    this.address = JSON.parse(JSON.stringify(this.dictData.areas))
    this.address &&
      this.address.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(x => {
            delete x.children
          })
        } else {
          delete item.children
        }
      })
    // this.address.unshift({
    //   label: '热门城市',
    //   value: '0',
    //   children: popularCity
    // })
    console.log('热门城市', this.address)
    this.firstTabNameOne =
      this.address && this.address[0] && this.address[0].value
    this.$nextTick(() => {
      // 初始化数据
      this.ruleForm.city = this.selectedData.city
    })
    // 从业时间
    const year = new Date().getFullYear()
    for (let i = 1980; i <= year; i++) {
      const obj = {}
      obj.value = i + ''
      obj.label = i + ''
      this.workStartDateArr.push(obj)
    }
    this.workStartDateArr.reverse()
  },
  methods: {
    handleClose() {},
    // 获取用户详情
    getUserProfile() {
      this.loading = true
      getUserProfile().then(res => {
        console.log('请求接口')
        if (res.code === '000000') {
          this.loading = false
          this.ruleForm = res.data
          this.$nextTick(() => {
            this.defaultCityCode = [res.data.city]
          })
          this.ruleForm.gender = res.data.gender + ''
          this.ruleForm.workStartDate = res.data.workStartDate.slice(0, 4)
        }
      })
    },
    submitForm(formName, keyNameArr) {
      // 初始化表单校验
      keyNameArr &&
        keyNameArr.filter(item => {
          if (
            Array.isArray(this.selectedData[item.keyName]) &&
            this.selectedData[item.keyName].length > 0
          ) {
            this.deleteRules({ formName, keyName: item.keyName })
          } else {
            this[formName + 'Rules'][item.keyName] = [
              { required: true, message: item.rules, trigger: 'change' }
            ]
          }
        })
      this.ruleForm.city = this.selectedData.city[0]
      this.dictData.areas.filter(item => {
        item.children &&
          item.children.filter(i => {
            if (i.value === this.selectedData.city[0]) {
              this.ruleForm.province = item.value
            }
          })
      })
      const {
        nickName,
        gender,
        province,
        city,
        titileCode,
        workStartDate,
        email,
        wxAccount,
        qqAccount,
        introduction
      } = this.ruleForm
      const params = {
        nickName,
        gender: gender - 0,
        province,
        city,
        titileCode: titileCode - 0,
        workStartDate,
        email,
        wxAccount,
        qqAccount,
        introduction
      }
      console.log('params', params)
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateHhProfile(params).then(res => {
            if (res.code === '000000') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 删除指定校验
    deleteRules(val) {
      console.log(44444444, val)
      const num = val.formName[val.formName.length - 1] - 0
      if (isRealNum(num)) {
        // 循环ref表单校验删除（循环的表单类型是数组）
        delete this[val.formName.slice(0, -1) + 'Rules'][val.keyName]
        this.$refs[val.formName][0].clearValidate(val.keyName)
      } else {
        // 非循环ref表单校验删除
        delete this[val.formName + 'Rules'][val.keyName]
        this.$refs[val.formName].clearValidate(val.keyName)
      }
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/myCenter/baseInfo.scss';
</style>
