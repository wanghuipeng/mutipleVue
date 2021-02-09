<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">微门户设置</el-breadcrumb-item>
        <el-breadcrumb-item>接口配置</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="title">微信开发者授权</p>
      <p
        class="tip"
      >为了确保微站相关的功能正常可用，我们获得您的微信公众号对第三方开发者的绑定授权。公众号授权可以通过一键登录授权给第三方开放者，无需提供密码，保证公众号安全。一个微信公众号只能与一个商户绑定。</p>
      <div class="content">
        <img :src="url" />
        <p>使用公众平台绑定的管理员个人微信号扫描</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    const token = Vue.ls.get('x-client-token')
    this.url = `${location.origin}/api/wz/company/authQrCode?x-client-token=${token}`
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .main {
    .title {
      margin-top: 20px;
    }
    .tip {
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 30px;
      color: #666;
    }
    min-height: 100%;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 100px;
      img {
        display: inline-block;
        width: 200px;
        height: 200px;
      }
      p {
        font-size: 12px;
        color: #666;
        margin-top: 16px;
      }
    }
  }
}
</style>
