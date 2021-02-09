<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="415px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form
      ref="editForm"
      class="edit-form"
      :model="editForm"
      :rules="editFormRules"
      label-width="90px"
    >
      <el-form-item label="手机号码：" prop="mobile">
        <el-input
          v-model="editForm.mobile"
          placeholder="请输入您需要推荐查重的手机号码"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button class="cancel-btn" @click="handleClose">取消</el-button>
      <el-button class="confirm-btn" @click="handleSubmit">查询</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { recommendCheck } from '@/api/position'
export default {
  data() {
    return {
      title: '',
      visible: false,
      // 编辑表单
      editForm: {},
      // 编辑表单校验规则
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
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
  mounted() {},
  methods: {
    // 表单赋值
    edit(row) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
        this.editForm = Object.assign({}, row)
      })
    },
    // 点击提交按钮
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = {}
          para.companyId = this.editForm.companyId
          para.mobile = this.editForm.mobile
          recommendCheck(para).then(res => {
            if (!res.data) {
              this.$message({
                message: '该简历已经被其他用户推荐过了!',
                type: 'success',
                showClose: true,
                center: true
              })
            } else {
              this.$message({
                message: '该简历未与其他用户推荐重复!',
                type: 'success',
                showClose: true,
                center: true
              })
            }
          })
        }
      })
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog__body {
  padding: 20px 20px 0 35px;
  .title {
    line-height: 24px;
    font-size: 15px;
    color: #808080ff;
  }
  .edit-form {
    padding: 20px 0 0;
    margin: 0;
    .el-form-item {
      margin-bottom: 20px;
      .el-form-item__label {
        text-align: left;
        color: #1a1a1aff;
        position: relative;
        &:before {
          position: absolute;
          left: -10px;
        }
      }
      .diy-select {
        width: 100%;
        .diy-input input {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          padding: 0 15px;
        }
        .el-icon-caret-bottom {
          right: 10px;
          top: 13px;
        }
        .el-icon-circle-close {
          right: 6px;
          top: 11px;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .form-group {
      .form-group-left {
        display: inline-block;
        width: 225px;
      }
      .concat-line {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
      .form-group-right {
        display: inline-block;
        width: 125px;
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 0 20px 20px 35px;
  .el-button {
    &.confirm-btn {
      margin-left: 40px;
    }
  }
}
</style>
