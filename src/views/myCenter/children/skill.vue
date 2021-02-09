<template>
  <div v-loading="loading" class="skill-page child-view" style="min-height: 381px;">
    <p class="tip">没有必要把您所擅长的城市、行业和职能全部填入；您所选择的城市行业越聚焦，我们将越优先为您推送合适的职位和人才</p>
    <!-- 表单 -->
    <el-form
      v-if="skillForm.userId"
      ref="skillForm"
      :model="skillForm"
      label-width="80px"
      :inline="true"
    >
      <el-form-item label="专注行业" prop="goodAtIndustry">
        <el-select
          v-model="skillForm.goodAtIndustry"
          multiple
          :multiple-limit="3"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="专注职能" prop="goodAtFunction">
        <el-select
          v-model="skillForm.goodAtFunction"
          multiple
          :multiple-limit="3"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="专注地域" prop="goodAtCity">
        <select-picker
          :key-name="'goodAtCity'"
          :class-name="'baseInfo-page-picker'"
          :first-tab-name="firstTabNameOne"
          :data-source="address"
          :max-number="3"
          :level-number="2"
          :default-value="defaultValue3"
        />
      </el-form-item>
      <el-form-item label="擅长级别" prop="goodAtSalary">
        <el-select v-model="skillForm.goodAtSalary" multiple :multiple-limit="3" placeholder="请选择">
          <el-option
            v-for="item in dictData.dicts.goodAtSalary"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="擅长阶段" prop="goodAtEnterpriseStage" class="checkbox-group">
        <el-checkbox-group v-model="checkedArr">
          <el-checkbox
            v-for="(item,index) in goodAtEnterpriseStageArr"
            :key="index"
            :label="item.label"
          >{{ item.value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="submitForm('skillForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SelectPicker from '@/components/common/selectPicker'
import { saveHhAbilityByHh, getHhAbility } from '@/api/myCenter'
import { uniqueArr } from '@/utils/common'

export default {
  components: {
    SelectPicker
  },
  data() {
    return {
      loading: false,
      options1: [],
      options2: [],
      address: [],
      firstTabNameOne: '',
      firstTabNameTwo: '',
      firstTabNameThree: '',
      skillForm: {
        goodAtIndustry: '',
        goodAtFunction: '',
        goodAtCity: '',
        goodAtSalary: '',
        goodAtEnterpriseStage: ''
      },
      checkedArr: [],
      goodAtEnterpriseStageArr: [],
      defaultValue1: [],
      defaultValue2: [],
      defaultValue3: [],
      defaultValue4: []
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    this.getHhAbility()
    // 热门城市
    // const popularCity = JSON.parse(JSON.stringify(this.dictData.dicts.popularCity))
    //   popularCity.forEach(item => {
    //     delete item.children
    //   })
    // 擅长城市
    this.address = JSON.parse(JSON.stringify(this.dictData.areas))
    console.log('省市区', this.dictData.areas)
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
    // 专注行业（二级）
    this.options1 = JSON.parse(JSON.stringify(this.dictData.industry))
    console.log('专注行业', this.options1)
    this.options1 &&
      this.options1.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(x => {
            delete x.children
          })
        } else {
          delete item.children
        }
      })
    // 专注职能
    this.options2 = JSON.parse(JSON.stringify(this.dictData.functions))
    this.options2 &&
      this.options2.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(x => {
            delete x.children
          })
        } else {
          delete item.children
        }
      })
    // 擅长阶段
    this.goodAtEnterpriseStageArr = this.dictData.dicts.goodAtEnterpriseStage.map(
      item => {
        const obj = {}
        obj.label = item.value
        obj.value = item.label
        return obj
      }
    )
    console.log('擅长阶段', this.goodAtEnterpriseStageArr)
    this.firstTabNameOne =
      this.address && this.address[0] && this.address[0].value
    this.firstTabNameTwo =
      this.options1 && this.options1[0] && this.options1[0].value
    this.firstTabNameThree =
      this.options2 && this.options2[0] && this.options2[0].value
    console.log(this.firstTabNameOne, this.firstTabNameTwo)
  },
  methods: {
    // 获取擅长技能
    getHhAbility() {
      this.loading = true
      getHhAbility().then(res => {
        this.loading = false
        const {
          goodAtIndustry,
          goodAtFunction,
          goodAtCity,
          goodAtSalary,
          goodAtEnterpriseStage
        } = res.data
        if (res.code === '000000') {
          this.skillForm = res.data
          const arr1 = []
          goodAtIndustry &&
            goodAtIndustry.filter(item => {
              item.value && arr1.push(item.value)
            })
          this.skillForm.goodAtIndustry = arr1
          console.log(322222, arr1)
          const arr2 = []
          goodAtFunction &&
            goodAtFunction.filter(item => {
              item.value && arr2.push(item.value)
            })
          this.skillForm.goodAtFunction = arr2
          const arr3 = []
          goodAtSalary &&
            goodAtSalary.filter(item => {
              item.value && arr3.push(item.value)
            })
          this.skillForm.goodAtSalary = arr3
          // 专注地域
          goodAtCity &&
            goodAtCity.filter(item => {
              this.defaultValue3.push(item.value)
            })
          this.defaultValue3 = uniqueArr(this.defaultValue3)
          // 擅长阶段
          goodAtEnterpriseStage &&
            goodAtEnterpriseStage.filter(item => {
              this.checkedArr.push(item.value)
            })
          this.checkedArr = uniqueArr(this.checkedArr)
          console.log('数据', this.skillForm)
        }
      })
    },
    // 编辑擅长技能
    saveHhAbilityByHh() {
      this.skillForm.goodAtIndustry = this.skillForm.goodAtIndustry.join(',')
      this.skillForm.goodAtFunction = this.skillForm.goodAtFunction.join(',')
      this.skillForm.goodAtCity =
        this.selectedData.goodAtCity && this.selectedData.goodAtCity.join(',')
      this.skillForm.goodAtEnterpriseStage =
        this.checkedArr && this.checkedArr.join(',')
      this.skillForm.goodAtSalary = this.skillForm.goodAtSalary.join(',')
      const {
        goodAtIndustry,
        goodAtFunction,
        goodAtCity,
        goodAtSalary,
        goodAtEnterpriseStage
      } = this.skillForm

      const params = {
        goodAtIndustry,
        goodAtFunction,
        goodAtCity,
        goodAtSalary,
        goodAtEnterpriseStage,
        userId: this.userInfo.userId
      }
      console.log('params', params)
      saveHhAbilityByHh(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getHhAbility()
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveHhAbilityByHh()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/myCenter/skill.scss';
</style>
