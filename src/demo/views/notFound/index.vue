<template>
  <div class="not-found-page">
    <div class="empty-page">
      <img src="@/assets/images/notFound/notFound_empty.png" />
      <p>{{ errorMessage }}</p>
      <el-button type="primary" size="small" @click="toHome">跨页面跳转</el-button>
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
  },
  methods: {
    toHome() {
      console.log('跨页面跳转')
      window.location.replace('/home')
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/notFound/index.scss';
</style>
