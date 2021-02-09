<template>
  <div class="order">
    <div class="left">
      <left-menu :class="headerFixed && 'isFixed'" />
    </div>
    <div class="right">
      <router-view />
    </div>
  </div>
</template>

<script>
import leftMenu from './leftMenu'
export default {
  components: {
    leftMenu
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.order {
  display: flex;
  flex-direction: row;
  .left {
    width: 180px;
    .isFixed {
      position: fixed;
    }
  }
  .right {
    flex: 1;
    padding-left: 20px;
  }
}
</style>
