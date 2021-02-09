<template>
  <div class="not-found-page">
    <div class="empty-page">
      <img src="@/assets/images/notFound/notFound_empty.png" />
      <p>{{ errorMessage }}</p>
      <el-button type="primary" size="small" @click="toHome">返回首页{{ time }}s</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 5,
      errorMessage: this.$route.query.errorMessage
    }
  },
  mounted() {
    var timer = setInterval(() => {
      this.time--
      if (this.time <= 0) {
        this.time = 0
        clearInterval(timer)
        this.toHome()
      }
    }, 1000);
  },
  methods: {
    toHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/notFound/index.scss';
</style>
