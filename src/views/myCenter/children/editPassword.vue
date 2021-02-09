<template>
  <div class="edit-password-page child-view">
    <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFormRules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="ruleForm.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="againPassword">
        <el-input v-model="ruleForm.againPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { updatePasswordByOldPassword } from '@/api/myCenter'

export default {
  data() {
    return {
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        againPassword: ''
      },
      ruleFormRules: {
        oldPassword: [
          { validator: this.$verify.passwordFormat, trigger: 'change' }
        ],
        newPassword: [
          { validator: this.$verify.passwordFormat, trigger: 'change' }
        ],
        againPassword: [
          { validator: this.validatorConfirmPassword, trigger: 'blur' },
          { validator: this.$verify.passwordFormat, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 校验确认密码
    validatorConfirmPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    },
    updatePasswordByOldPassword() {
      const { newPassword, oldPassword } = this.ruleForm
      const params = {
        newPassword: md5(newPassword),
        oldPassword: md5(oldPassword)
      }
      console.log('params', params)
      updatePasswordByOldPassword(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updatePasswordByOldPassword()
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
.edit-password-page {
  padding: 30px 0;
  .el-form {
    .el-form-item {
      width: 450px;
      margin: 20px auto;
      input {
        width: 340px;
        border-color: #e5e5e5;
        border-radius: 4px;
      }
    }
    .el-form-item__label {
      text-align: left;
      color: #4d4d4d;
      font-size: 14px;
    }
  }
  button {
    width: 340px;
    height: 44px;
    background: rgba(22, 120, 249, 1);
    border-radius: 4px;
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
  }
}
</style>
