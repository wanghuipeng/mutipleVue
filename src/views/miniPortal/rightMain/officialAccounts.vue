<template>
  <div class="official-accounts">
    <el-card shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">招聘门户</el-breadcrumb-item>
        <el-breadcrumb-item>嵌入公众号</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="tip">通过大猎微聘，您可以快速定制搭建您企业专属的招聘门户，并嵌入您的公众号</p>
      <div class="inputs">
        <el-form ref="form" label-width="120px" size="small">
          <el-form-item v-for="(item,index) in fixedUrlList" :key="index" :label="item.title">
            <el-input v-model="item.url"></el-input>
            <el-button type="primary" @click="copyCode(item.url)">复制链接</el-button>
          </el-form-item>
        </el-form>
        <el-divider v-if="specialUrlList && specialUrlList.length > 0"></el-divider>
        <p class="tip">以下为您已经创建的招聘专区，也可以直接复制链接并设置为公众号菜单</p>
        <el-form ref="form" label-width="120px" size="small">
          <el-form-item v-for="(item,index) in specialUrlList" :key="index" :label="item.title">
            <el-input v-model="item.url"></el-input>
            <el-button type="primary" @click="copyCode(item.url)">复制链接</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEmbeddedLinkList } from '@/api/miniPortal/officialAccounts'

export default {
  data() {
    return {
      fixedUrlList: [],
      specialUrlList: []
    }
  },
  mounted() {
    this.getEmbeddedLinkList()
  },
  methods: {
    getEmbeddedLinkList() {
      getEmbeddedLinkList().then(res => {
        this.loading = false
        const { code, data } = res
        if (code === '000000') {
          this.fixedUrlList = data.fixedUrlList
          this.specialUrlList = data.specialUrlList
          console.log('封面', data)
        }
      })
    },
    // 复制
    copyCode(data) {
      const url = data
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    }
  }
}
</script>

<style lang="scss" >
.official-accounts {
  height: 100%;
  background-color: #fff;
  .tip {
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 35px;
    color: #666;
  }
  .inputs {
    .el-input {
      width: 500px;
    }
    button {
      margin-left: 15px;
    }
  }
}
</style>
