<template>
  <div class="panel-wrap">
    <div class="panel">
      <div class="panel-title">企业认证</div>
      <div class="panel-body">
        <img src="@/assets/images/login/certification-bg.png" class="img" />
        <p class="text">根据国家相关规定的要求，您需要进行企业信息认证，认证完成后即可正常发布职位</p>
        <el-button type="primary" size="mini" class="btn" @click="certification">立即认证</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 立即认证
    certification() {
      this.$router.push('/certification')
    }
  }
}
</script>
<style scoped lang="scss">
.panel-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999999;
  .panel {
    width: 400px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .panel-title {
      padding: 28px 28px 16px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #15181b;
    }
    .panel-body {
      padding: 0 28px 28px;
      .img {
        display: block;
        width: 100%;
        margin-bottom: 8px;
      }
      .text {
        font-size: 12px;
        color: #999999;
        margin-bottom: 28px;
      }
      .btn {
        width: 100%;
      }
    }
  }
}
</style>

