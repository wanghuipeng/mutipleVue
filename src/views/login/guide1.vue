<template>
  <div class="wrap">
    <div class="main">
      <div class="panel" style="width: 940px;">
        <div class="panel-body" style="padding: 40px;">
          <div class="left-description">
            <div>
              <div class="description-title">
                <img src="@/assets/images/login/ai-icon.png" />
                <span>小猎AI机器人</span>
              </div>
              <div
                class="description-content"
              >亲爱的{{ $store.state.userInfo.nickName }}，欢迎加入大猎英才，这是一个通过AI大数据改变猎头做单方式的平台 开始之前，我们需要进一步了解您的信息，以便为您提供更精确的推荐服务</div>
            </div>
          </div>
          <el-form
            ref="submitForm"
            class="submit-form white-form"
            :model="submitForm"
            :rules="submitFormRules"
            label-width="100"
          >
            <el-form-item prop="goodAtIndustry" label="专注行业：" style="margin-bottom: 25px;">
              <el-select
                v-model="submitForm.goodAtIndustry"
                multiple
                :multiple-limit="3"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in dictData.industry"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="goodAtFunction" label="专注职能：" style="margin-bottom: 25px;">
              <el-select
                v-model="submitForm.goodAtFunction"
                multiple
                :multiple-limit="3"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in dictData.functions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="goodAtCity" label="专注地域：" style="margin-bottom: 25px;">
              <select-picker
                form-name="submitForm"
                key-name="goodAtCity"
                :default-value="submitForm.goodAtCity"
                :data-source="dictData.areas"
                :first-tab-name="dictData.areas[0].value"
                :max-number="5"
                :level-number="2"
                @deleteRules="deleteRules"
              />
            </el-form-item>
            <el-form-item prop="goodAtSalary" label="擅长级别：" style="margin-bottom: 25px;">
              <el-select v-model="submitForm.goodAtSalary" multiple placeholder="请选择" clearable>
                <el-option
                  v-for="item in dictData.dicts.goodAtSalary"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="goodAtEnterpriseStage" label="擅长阶段：" style="margin-bottom: 40px;">
              <el-select
                v-model="submitForm.goodAtEnterpriseStage"
                multiple
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in dictData.dicts.goodAtEnterpriseStage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="all-screen">
              <el-button
                type="primary"
                :loading="$store.state.nextLoading"
                @click="toStepTwo('submitForm',[{keyName:'goodAtCity',rules:'请选择专注地域'}])"
              >继续</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectPicker from '@/components/common/selectPicker'
import { isRealNum } from '@/utils/common'
import { saveHhAbilityByHh } from '@/api/login'
export default {
  components: {
    SelectPicker
  },
  data() {
    return {
      // 提交表单
      submitForm: {
        goodAtIndustry: [],
        goodAtFunction: [],
        goodAtCity: [],
        goodAtSalary: [],
        goodAtEnterpriseStage: []
      },
      // 提交表单校验规则
      submitFormRules: {
        goodAtIndustry: [
          { required: true, message: '请选择专注行业', trigger: 'change' }
        ],
        goodAtFunction: [
          { required: true, message: '请选择专注职能', trigger: 'change' }
        ],
        goodAtCity: [
          { required: true, message: '请选择专注地域', trigger: 'blur' }
        ],
        goodAtSalary: [
          { required: true, message: '请选择擅长级别', trigger: 'change' }
        ],
        goodAtEnterpriseStage: [
          { required: true, message: '请选择擅长阶段', trigger: 'change' }
        ]
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
    document.title = '新手引导-大猎英才'
  },
  methods: {
    // 删除指定校验
    deleteRules(val) {
      const num = val.formName[val.formName.length - 1] - 0
      if (isRealNum(num)) {
        // 循环ref表单校验删除（循环的表单类型是数组）
        delete this[val.formName.slice(0, -1) + 'Rules'][val.keyName]
        this.$refs[val.formName][0].clearValidate(val.keyName)
      } else {
        // 循环ref表单校验删除
        delete this[val.formName + 'Rules'][val.keyName]
        this.$refs[val.formName].clearValidate(val.keyName)
      }
    },
    // 继续
    toStepTwo(formName, keyNameArr) {
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
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true)
          const para = Object.assign({}, this.submitForm)
          para.goodAtIndustry = para.goodAtIndustry.join(',')
          para.goodAtFunction = para.goodAtFunction.join(',')
          para.goodAtCity = this.selectedData.goodAtCity.join(',')
          para.goodAtSalary = para.goodAtSalary.join(',')
          para.goodAtEnterpriseStage = para.goodAtEnterpriseStage.join(',')
          saveHhAbilityByHh(para).then(res => {
            const userInfo = this.$store.state.userInfo
            userInfo.registerProcess = 3
            this.$store.dispatch('dispatchUpdateUserInfo', userInfo)
            this.$router.push('/guide2')
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/login/common.scss';
</style>

