<template>
  <div class="rate-standard-dialog">
    <el-form ref="rateForm" :model="rateForm" :rules="rateRules" size="mini" label-width="100px">
      <el-form-item label="费率类型" prop="recruitType">
        <el-radio-group v-model="rateForm.recruitType" @change="changeRecruitType">
          <el-radio
            v-for="(item,index) in positionType"
            :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结算方式" prop="settlementType">
        <el-radio-group v-model="rateForm.settlementType" @change="changeSettlementType">
          <el-radio
            v-for="(item,index) in positionCommissionSettlementType"
            :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="settlementTypes === 1"
        label="费用/费率"
        class="double-input rate-item"
        required
      >
        <el-form-item prop="salaryType">
          <el-select v-model="rateForm.salaryType" placeholder="请选择薪资类型">
            <el-option label="年薪" value="1"></el-option>
            <el-option label="月薪" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="commissionRatio" class="ml-10">
          <el-input
            v-model.number="rateForm.commissionRatio"
            placeholder="请输入佣金比例"
            suffix-icon="el-icon-percent"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="settlementTypes === 2" class="rate-item" label="固定佣金" required>
        <el-form-item prop="commissionFixedAmount">
          <el-input
            v-model.number="rateForm.commissionFixedAmount"
            placeholder="请输入固定佣金"
            suffix-icon="el-icon-yuan"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="保证期" class="double-input rate-item" required>
        <el-form-item
          prop="guaranteePeriodType"
          :class="[Number(rateForm.guaranteePeriodType) === 1 ? 'wp-100' : '']"
        >
          <el-select v-model="rateForm.guaranteePeriodType" placeholder="请选择保证期类型">
            <el-option
              v-for="(item,index) in companyGuaranteePeriodType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="Number(rateForm.guaranteePeriodType) !== 1"
          prop="guaranteePeriod"
          class="ml-10"
        >
          <el-input
            v-model.number="rateForm.guaranteePeriod"
            placeholder="请输入保证期"
            suffix-icon="el-icon-day"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="费用说明" prop="remark">
        <el-input v-model="rateForm.remark" type="textarea" placeholder="请输入费用补充说明"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog('rateForm')">取 消</el-button>
      <el-button type="primary" size="mini" @click="saveForm('rateForm')">保 存</el-button>
    </span>
  </div>
</template>

<script>
import { saveCommission } from '@/api/set/supplierRate'
import { mapState } from 'vuex'

export default {
  props: {
    rateDetail: {
      type: Object,
      default: null,
      required: false
    }
  },
  data() {
    return {
      rateForm: {
        recruitType: '2',
        settlementType: '2',
        salaryType: '1',
        commissionRatio: '',
        commissionFixedAmount: '',
        guaranteePeriodType: '3',
        guaranteePeriod: ''
      },
      rateRules: {
        recruitType: [
          { required: true, message: '请选择费率类型', trigger: 'change' }
        ],
        settlementType: [
          { required: true, message: '请选择结算方式', trigger: 'change' }
        ],
        salaryType: [
          { required: true, message: '请选择薪资类型', trigger: 'change' }
        ],
        commissionRatio: [
          { required: true, message: '请输入佣金比例', trigger: 'blur' },
          { validator: this.percentFormat, trigger: 'change' }
        ],
        commissionFixedAmount: [
          { required: true, message: '请输入固定佣金', trigger: 'change' },
          { validator: this.numberFormat, trigger: 'change' }
        ],
        guaranteePeriodType: [
          { required: true, message: '请选择保证期类型', trigger: 'change' }
        ],
        guaranteePeriod: [
          { required: true, message: '请输入保证期', trigger: 'blur' },
          { validator: this.numberFormat, trigger: 'change' }
        ]
      },
      settlementTypes: 1,
      companyGuaranteePeriodType: [], // 企业保证期类型
      positionType: [], // 费率类型
      positionCommissionSettlementType: [] // 结算方式
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    if (this.$props.rateDetail) {
      const commissionRatio = this.$props.rateDetail.commissionRatio
      const recruitType =
        this.$props.rateDetail.recruitType &&
        this.$props.rateDetail.recruitType + ''
      const settlementType =
        this.$props.rateDetail.settlementType &&
        this.$props.rateDetail.settlementType + ''
      const salaryType =
        this.$props.rateDetail.salaryType &&
        this.$props.rateDetail.salaryType + ''
      const guaranteePeriodType =
        this.$props.rateDetail.guaranteePeriodType + ''
      this.$set(this.rateForm, 'recruitType', recruitType)
      this.$set(this.rateForm, 'settlementType', settlementType)
      this.$set(this.rateForm, 'salaryType', salaryType)
      this.$set(this.rateForm, 'commissionRatio', commissionRatio)
      this.$set(
        this.rateForm,
        'commissionFixedAmount',
        this.$props.rateDetail.commissionFixedAmount
      )
      this.$set(this.rateForm, 'guaranteePeriodType', guaranteePeriodType)
      this.$set(
        this.rateForm,
        'guaranteePeriod',
        this.$props.rateDetail.guaranteePeriod
      )
      this.$set(this.rateForm, 'remark', this.$props.rateDetail.remark)
      this.$set(this.rateForm, 'salaryType', salaryType)
      this.$set(this.rateForm, 'id', this.$props.rateDetail.id)
      this.settlementTypes = settlementType - 0
    }
    const dictData =
      this.dictData && JSON.parse(JSON.stringify(this.dictData.dicts))
    if (dictData) {
      this.positionType = dictData.positionType.reverse()
      this.positionCommissionSettlementType = dictData.positionCommissionSettlementType.reverse()

      this.companyGuaranteePeriodType = this.dictData.dicts.companyGuaranteePeriodType
    }
  },
  methods: {
    sortObj(obj) {
      var arr = []
      for (var i in obj) {
        arr.push([obj[i], i])
      }
      arr.reverse()
      var len = arr.length
      var obj1 = {}
      for (var i1 = 0; i1 < len; i1++) {
        obj1[arr[i1][1]] = arr[i1][0]
      }
      return obj1
    },
    numberFormat(rule, value, callback) {
      const re = /^[0-9]*[1-9][0-9]*$/
      if (value < 0) {
        callback(new Error('请输入大于0的正整数'))
      } else if (!re.test(value)) {
        callback(new Error('请输入大于0的正整数'))
      } else {
        callback()
      }
    },
    // 校验百分比
    percentFormat(rule, value, callback) {
      const re = /^[0-9]*[1-9][0-9]*$/
      if (value > 100) {
        callback(new Error('不能大于100%'))
      } else if (value < 0) {
        callback(new Error('请输入大于0的正整数'))
      } else if (!re.test(value)) {
        callback(new Error('请输入大于0的正整数'))
      } else {
        callback()
      }
    },
    // 费率类型选择
    changeRecruitType(e) {
      console.log(e)
      this.rateForm.settlementType = e
      this.changeSettlementType(e)
    },
    // 结算方式选择
    changeSettlementType(e) {
      this.$refs.rateForm.clearValidate()
      this.settlementTypes = e - 0
    },
    // 关闭弹框
    closeDialog(formName) {
      this.$emit('closeDialog')
    },
    // 保存
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveCommission(formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增/编辑费率
    saveCommission(formName) {
      this.rateForm.commissionRatio = this.rateForm.commissionRatio
      const params = this.rateForm
      saveCommission(params).then(res => {
        const { success, message } = res
        if (success) {
          this.$emit('reloadDialog')
          this.$message.success('保存成功')
        } else {
          this.$message.fail(message)
        }
        this.closeDialog(formName)
      })
    }
  }
}
</script>
<style  lang="scss">
.rate-standard-dialog {
  min-height: 308px;
  .el-radio {
    height: 28px;
    width: 100px;
    line-height: 28px;
  }
  .rate-item {
    margin-bottom: 0;
  }
  .double-input {
    .el-form-item,
    .el-select,
    .el-input {
      width: 175px;
      display: inline-block;
    }
  }
  .double-input {
    .el-form-item.wp-100 {
      width: 100%;
      .el-select,
      .el-input {
        width: 100%;
      }
    }
  }
  .dialog-footer {
    width: 100%;
    display: inline-block;
    text-align: right;
    margin-top: 30px;
  }
  .el-icon-percent::before {
    content: '%';
  }
  .el-icon-yuan::before {
    content: '元';
  }
  .el-icon-day::before {
    content: '天';
  }
}
</style>
