<template>
  <span v-if="showBackTop" class="el-backtop" @click="handleScrollTop">
    <i class="el-icon-caret-top" />
  </span>
</template>

<script>
export default {
  name: 'BackTop',
  data() {
    return {
      showBackTop: false
    }
  },
  mounted() {},
  methods: {
    handleScrollTop() {
      const gotoTop = () => {
        let currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop
        currentPosition -= 200
        if (currentPosition > 0) {
          window.scrollTo(0, currentPosition)
        } else {
          window.scrollTo(0, 0)
          clearInterval(timer)
          timer = null
        }
      }
      let timer = setInterval(gotoTop, 1)
    },
    handlePageScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.showBackTop = scrollTop > 300
    }
  }
}
</script>
<style scoped lang="scss">
.el-backtop {
  position: fixed;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 999;
  right: 40px;
  bottom: 40px;
}
</style>

