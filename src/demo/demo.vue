<template>
  <div id="demoApp"><router-view></router-view>
  </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    mounted() {
      // 全局loading
      this.pageLoading('demoLoading')
    },
    methods: {
      // 全局loading
      pageLoading(ele) {
        const child = document.getElementById(ele)
        child.style.display = 'none'
      }
    }
}
</script>
<style scoped>

</style>
