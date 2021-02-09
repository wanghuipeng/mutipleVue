<template>
  <div class="blank">
    <div class="main">
      <img src="../../../assets/images/order/blank.png" />
      <p>暂无候选人推荐记录</p>
      <el-button round @click="recommend">立即推荐</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    recommend() {
      this.$router.push('/position/all')
    }
  }
}
</script>

<style lang="scss" scoped>
.blank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    img {
      width: 220px;
      height: 168px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color:#B3B3B3;
      line-height: 25px;
      margin: 29px 0 20px;
    }
    .el-button {
      width: 96px;
      height: 32px;
      font-size: 16px;
      // line-height: 25px;
      color: #FFFFFF;
      background: #1678F9;
      padding: 8px 0;
    }
  }
}
</style>
