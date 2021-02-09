<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">微门户设置</el-breadcrumb-item>
        <el-breadcrumb-item>用户协议</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="tip">您可以自行编辑和发布招聘微站的用户协议，求职者需要同意招聘微站的用户协议，才可以正常进行投递和推荐</p>
      <el-form ref="protocolForm" :model="protocolForm" size="small">
        <el-form-item label="用户协议名称" />
        <el-form-item>
          <el-input v-model="protocolForm.name" placeholder="请输入用户协议" />
        </el-form-item>
        <el-form-item label="权限" />
        <el-form-item>
          <quill-editor ref="myQuillEditor" v-model="protocolForm.desc" :options="editorOption" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="saveProtocol">保 存</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCompanyUserProtocol, saveCompanyUserProtocol } from '@/api/set'
export default {
  data() {
    return {
      protocolForm: {
        id: '',
        name: '',
        desc: ''
      },
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // 加粗，斜体，下划线
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ align: [] }], // 对齐方式
            ['image'] // 上传图片
          ]
        }
      }
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    this.$refs.myQuillEditor.quill.enable(false)
    this.getDetail()
  },
  methods: {
    // 获取用户协议
    getDetail() {
      getCompanyUserProtocol().then(res => {
        console.log(res)
        this.protocolForm.id = res.data.id
        this.protocolForm.name = res.data.title
        this.protocolForm.desc = res.data.content
        this.$nextTick(() => {
          this.$refs.myQuillEditor.quill.enable(true)
          this.$refs.myQuillEditor.quill.blur()
        })
      })
    },
    // 保存用户协议
    saveProtocol() {
      const params = {
        id: this.protocolForm.id,
        title: this.protocolForm.name,
        content: this.protocolForm.desc
      }
      saveCompanyUserProtocol(params).then(res => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .main {
    .tip {
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 30px;
      color: #666;
    }
    min-height: 100%;
    .btn {
      margin: 20px 0;
    }
    ::v-deep .ql-container {
      min-height: 240px;
    }
  }
}
</style>
