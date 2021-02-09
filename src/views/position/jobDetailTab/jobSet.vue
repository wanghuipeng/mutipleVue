<template>
  <div class="wrap">
    <el-form
      ref="editForm"
      class="edit-form"
      :model="editForm"
      :rules="editFormRules"
      label-width="120px"
    >
      <el-form-item label="使用供应商" prop="isUseSupplier">
        <el-switch v-model="editForm.isUseSupplier" @change="changeIsUseSupplier"></el-switch>
      </el-form-item>
      <el-form-item label="合作方式" prop="positionType">
        <el-radio-group v-model="editForm.positionType" @change="changePositionType">
          <el-radio :label="1">猎头</el-radio>
          <el-radio :label="2">RPO</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合作费率" prop="rateId">
        <el-select v-model="editForm.rateId" placeholder="请选择合作费率">
          <el-option
            v-for="(item, index) in rateArr"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
        <el-button type="text" @click="editRate('add', rateDetail)">新增费率标准</el-button>
      </el-form-item>
      <el-form-item label="供应商范围" prop="supplierRange">
        <el-radio-group v-model="editForm.supplierRange">
          <el-radio :label="1">大猎英才</el-radio>
          <el-radio :label="2" disabled>我的供应商</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增费率标准 -->
    <el-dialog
      top="8vh"
      append-to-body
      width="500px"
      :lock-scroll="true"
      :visible.sync="dialogVisible"
      :title="type === 'add' ? '添加费率标准' : '编辑费率标准'"
    >
      <rate-standard-dialog
        :rate-detail="rateDetail"
        @closeDialog="closeDialog"
        @reloadDialog="reloadDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import rateStandardDialog from '@/views/set/rightMain/components/rateStandardDialog'
import {
  getCommissionList,
  editCPositionOfRecruitmentChannels
} from '@/api/position'
export default {
  components: {
    rateStandardDialog
  },
  props: {
    // 职位信息
    positionInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      type: '',
      rateDetail: null,
      // 合作费率数据源
      rateArr: [],
      // 编辑表单
      editForm: {
        supplierRange: 1
      },
      // 编辑表单校验规则
      editFormRules: {
        positionType: [
          { required: true, message: '请选择合作方式', trigger: 'change' }
        ],
        rateId: [
          { required: true, message: '请选择合作费率', trigger: 'change' }
        ],
        supplierRange: [
          { required: true, message: '请选择供应商范围', trigger: 'change' }
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
  watch: {
    positionInfo(val) {
      this.editForm = Object.assign({}, val)
    }
  },
  mounted() {
    // 查询合作费率下拉
    this.queryRate()
    this.editForm = Object.assign({}, this.$props.positionInfo)
    this.editForm.supplierRange = 1
  },
  methods: {
    // 选择合作方式
    changePositionType(e) {
      this.queryRate(e - 0)
    },
    // 查询合作费率下拉
    queryRate(positionType) {
      const para = {
        positionType
      }
      getCommissionList(para).then(res => {
        this.rateArr = res.data || []
      })
    },
    // 切换是否使用供应商
    changeIsUseSupplier(val) {
      this.$confirm(
        val ? '是否确认开启使用供应商' : '是否确认关闭使用供应商',
        '提示',
        {
          type: 'warning'
        }
      )
        .then(() => {})
        .catch(() => {
          this.editForm.isUseSupplier = !val
        })
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 关闭弹框
    reloadDialog() {
      this.queryRate()
    },
    // 添加费率
    editRate(type, row) {
      this.rateDetail = row
      this.type = type
      this.dialogVisible = true
    },
    // 点击保存按钮
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = {}
          para.positionId = this.editForm.id
          para.isUseSupplier = this.editForm.isUseSupplier
          para.positionType = this.editForm.positionType
          para.rateId = this.editForm.rateId
          para.supplierRange = this.editForm.supplierRange
          editCPositionOfRecruitmentChannels(para).then(res => {
            this.$message({
              message: '保存成功!',
              type: 'success',
              showClose: true,
              center: true
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  padding: 20px;
  .edit-form {
    margin-bottom: 0;
    .el-form-item {
      ::v-deep .el-form-item__label {
        text-align: left;
        font-weight: bold;
        color: #0d121a;
        &:before {
          display: none;
        }
      }
      ::v-deep .el-form-item__content {
        display: flex;
        height: 40px;
        align-items: center;
        .el-radio {
          display: flex;
          align-items: center;
          float: left;
        }
        .el-select {
          width: 340px;
          margin-right: 16px;
          ::v-deep .el-input__inner {
            height: 32px;
            line-height: 32px;
            border-radius: 2px;
            border: 1px solid #eee;
            ::v-deep .el-input__icon {
              line-height: 32px;
            }
          }
        }
      }
    }
  }
}
</style>

