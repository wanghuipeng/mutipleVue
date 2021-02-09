<template>
  <div class="wrap-box">
    <!-- 左侧菜单 -->
    <div class="left-menu">
      <left-menu />
    </div>
    <!-- 右侧主内容 -->
    <div class="right-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import LeftMenu from './leftMenu'
export default {
  components: {
    LeftMenu
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  display: flex;
  min-height: calc(100% - 76px);
  padding: 16px 0 16px 238px;
  justify-content: space-between;
  background-color: #f7f7f7;
  overflow: hidden;
  .left-menu {
    width: 240px;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 45px;
    bottom: 0;
    overflow-y: auto;
  }
  .right-main {
    flex: auto;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>

