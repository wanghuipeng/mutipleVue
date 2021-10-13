<template>
  <div class="not-found-page">
    <div class="empty-page">
      <img src="@/assets/images/notFound/notFound_empty.png" />
      <p>{{ errorMessage }}</p>
      <el-button
        type="primary"
        size="small"
        @click="toHome"
      >返回首页{{ time }}s</el-button>
    </div>
    <another />
    <home />
  </div>
</template>

<script>
import home from '@/views/home'
import another from '@/demo/views/notFound'

export default {
  components: {
    home,
    another
  },
  data() {
    return {
      time: 5,
      errorMessage: this.$route.query.errorMessage
    };
  },
  mounted() {},
  methods: {
    toHome() {
      this.$router.push('/');
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/notFound/index.scss";
</style>
