<template>
  <div class="receipt-page child-view">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="选择开票方式" prop="type">
        <el-input v-model="ruleForm.type" />
      </el-form-item>
      <el-form-item label="开票账户名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="税号" prop="number">
        <el-input v-model="ruleForm.number" />
      </el-form-item>
      <el-form-item label="发票地址" prop="address">
        <el-input v-model="ruleForm.address" />
      </el-form-item>
      <el-form-item label="发票电话" prop="tel">
        <el-input v-model="ruleForm.tel" />
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-input v-model="ruleForm.bank" />
      </el-form-item>
      <el-form-item label="账户" prop="account">
        <el-input v-model="ruleForm.account" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        type: '',
        name: '',
        number: '',
        address: '',
        tel: '',
        bank: '',
        account: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入开票账户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入税号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入发票地址', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入发票电话', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        bank: [
          { required: true, message: '请输入开户行', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
