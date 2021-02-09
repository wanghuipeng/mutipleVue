<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="415px"
    lock-scroll
    append-to-body
    :show-close="false"
    @close="handleClose"
  >
    <p class="title">添加订阅后，平台会根据您设置的条件，将已有的或新上的同质化职位推送给您</p>
    <el-form
      ref="editForm"
      class="edit-form"
      :model="editForm"
      :rules="editFormRules"
      label-width="90px"
    >
      <el-form-item label="订阅名称：" prop="name">
        <el-input
          v-model="editForm.name"
          placeholder="请输入订阅名称"
          maxlength="20"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="选择城市：" prop="cityId">
        <select-picker
          v-show="!(Array.isArray(editForm.cityId) && editForm.cityId.length > 0)"
          ref="cityId"
          form-name="editForm"
          key-name="cityId"
          :default-value="editForm.cityId"
          :data-source="dictData && dictData.areas"
          :first-tab-name="dictData && dictData.areas[0].value"
          :max-number="1"
          :level-number="2"
          @deleteRules="deleteRules"
        />
        <select-picker
          v-if="Array.isArray(editForm.cityId) && editForm.cityId.length > 0"
          :key="new Date().getTime()"
          ref="cityId"
          form-name="editForm"
          key-name="cityId"
          :default-value="editForm.cityId"
          :data-source="dictData && dictData.areas"
          :first-tab-name="dictData && dictData.areas[0].value"
          :max-number="1"
          :level-number="2"
          @deleteRules="deleteRules"
        />
      </el-form-item>
      <el-form-item label="选择职能：" prop="functionType">
        <select-picker-three
          v-show="!(Array.isArray(editForm.functionType) && editForm.functionType.length > 0)"
          ref="functionType"
          form-name="editForm"
          key-name="functionType"
          :default-value="editForm.functionType"
          :data-source="dictData && dictData.functions"
          :first-tab-name="dictData && dictData.functions[0].value"
          @deleteRules="deleteRules"
        />
        <select-picker-three
          v-if="Array.isArray(editForm.functionType) && editForm.functionType.length > 0"
          :key="new Date().getTime()"
          ref="functionType"
          form-name="editForm"
          key-name="functionType"
          :default-value="editForm.functionType"
          :data-source="dictData && dictData.functions"
          :first-tab-name="dictData && dictData.functions[0].value"
          @deleteRules="deleteRules"
        />
      </el-form-item>
      <el-form-item label="公司名称：" prop="companyId">
        <el-select
          v-model="editForm.companyId"
          placeholder="请选择"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in companyArr"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择年薪：" prop="annualSalary">
        <el-select v-model="editForm.annualSalary" placeholder="请选择" clearable>
          <el-option
            v-for="item in (dictData && dictData.dicts && dictData.dicts.goodAtSalary)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位标签：" prop="positionLabel">
        <el-select v-model="editForm.positionLabel" placeholder="请选择" clearable>
          <el-option
            v-for="item in (dictData && dictData.dicts && dictData.dicts.positionTag)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button class="cancel-btn" @click="handleClose">取消</el-button>
      <el-button
        class="confirm-btn"
        @click="handleSubmit('editForm',[{keyName:'cityId',rules:'请选择城市'},{keyName:'functionType',rules:'请选择职能'}])"
      >确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectPicker from '@/components/common/selectPicker'
import selectPickerThree from '@/components/common/selectPickerThree'
import { isRealNum } from '@/utils/common'
import {
  addPositionSubscribeRecord,
  editPositionSubscribeRecord,
  getCompanyList
} from '@/api/position'
export default {
  components: {
    selectPicker,
    selectPickerThree
  },
  props: {},
  data() {
    return {
      title: '操作',
      visible: false,
      // 公司数据源
      companyArr: [],
      // 编辑表单
      editForm: {
        name: '',
        cityId: [],
        functionType: [],
        companyId: '',
        annualSalary: '',
        positionLabel: ''
      },
      // 编辑表单校验规则
      editFormRules: {
        name: [
          { required: true, message: '请输入订阅名称', trigger: 'blur' },
          { validator: this.$verify.trueNameFormat, trigger: 'blur' }
        ],
        cityId: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        functionType: [
          { required: true, message: '请选择职能', trigger: 'blur' }
        ],
        companyId: [],
        annualSalary: [],
        positionTag: []
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
  },
  methods: {
    // 输入联想查询企业
    remoteMethod(query) {
      if (query !== '') {
        const para = {}
        para.keyword = query
        getCompanyList(para).then(res => {
          this.companyArr = res.data
        })
      } else {
        this.companyArr = []
      }
    },
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
    // 表单赋值
    edit(row) {
      this.visible = true
      this.$nextTick(() => {
        // 重置城市
        this.editForm.cityId = []
        delete this.selectedData.cityId
        // 重置职能
        this.editForm.functionType = []
        delete this.selectedData.functionType
        // 赋值城市
        row.cityId = row.cityId ? [row.cityId] : []
        this.selectedData.cityId = row.cityId ? [row.cityId] : []
        // 赋值职能
        const functionType =
          row.functionType1 || row.functionType2 || row.functionType3
        row.functionType = functionType ? [functionType] : []
        this.selectedData.functionType = functionType ? [functionType] : []
        // 公司
        if (row.companyId) {
          this.companyArr = [
            {
              text: row.companyName,
              value: row.companyId
            }
          ]
        }
        // 年薪
        if (!row.annualSalary) {
          // 非全部职位页面进来的情况
          if (row.annualSalaryStart) {
            switch (row.annualSalaryStart) {
              case 0:
                row.annualSalary = '1'
                break
              case 10:
                row.annualSalary = '2'
                break
              case 30:
                row.annualSalary = '3'
                break
              case 50:
                row.annualSalary = '4'
                break
              case 70:
                row.annualSalary = '5'
                break
              case 100:
                row.annualSalary = '6'
                break
              case 150:
                row.annualSalary = '7'
                break
              case 200:
                row.annualSalary = '8'
                break
            }
          } else {
            row.annualSalary = ''
          }
        }
        this.$refs.editForm.resetFields()
        this.editForm = Object.assign({}, row)
      })
    },
    // 点击提交按钮
    handleSubmit(formName, keyNameArr) {
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
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          // 城市
          para.cityId = this.selectedData.cityId[0]
          // 职能
          const functionType = this.selectedData.functionType
          if (functionType && functionType.length) {
            const index = functionType[0].length / 3
            para[`functionType${index}`] = functionType[0]
          }
          delete para.functionType
          // 年薪
          if (para.annualSalary) {
            switch (para.annualSalary) {
              case '1':
                para.annualSalaryStart = 0
                para.annualSalaryEnd = 10
                break
              case '2':
                para.annualSalaryStart = 10
                para.annualSalaryEnd = 30
                break
              case '3':
                para.annualSalaryStart = 30
                para.annualSalaryEnd = 50
                break
              case '4':
                para.annualSalaryStart = 50
                para.annualSalaryEnd = 70
                break
              case '5':
                para.annualSalaryStart = 70
                para.annualSalaryEnd = 100
                break
              case '6':
                para.annualSalaryStart = 100
                para.annualSalaryEnd = 150
                break
              case '7':
                para.annualSalaryStart = 150
                para.annualSalaryEnd = 200
                break
              case '8':
                para.annualSalaryStart = 200
                para.annualSalaryEnd = ''
                break
            }
          } else {
            para.annualSalaryStart = ''
            para.annualSalaryEnd = ''
          }
          const api = para.id
            ? editPositionSubscribeRecord
            : addPositionSubscribeRecord
          api(para).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true
            })
            this.handleClose()
          })
        }
      })
    },
    // 关闭模态框
    handleClose() {
      this.$emit('ok')
      this.visible = false
      this.editForm = {}
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
