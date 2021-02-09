<template>
  <div class="statistics">
    <el-card class="left" shadow="never">
      <left-menu />
    </el-card>
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
    return {
      isHide: false
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.statistics {
  display: flex;
  flex-direction: row;
  width: calc(100% + 2px);
  padding: 16px 0;
  overflow: hidden;
  min-height: calc(100% - 44px);
  box-sizing: border-box;
  .app-container {
    background-color: #fff;
    height: 100%;
    overflow-y: auto;
    padding-left: 0 !important;
    margin-left: 16px;
    border: 1px solid #ebeef5;
    .el-card {
      border: none;
    }
  }
  .left {
    width: 240px;
    min-width: 240px;
    padding-bottom: 20px;
    position: fixed;
    left: 0px;
    top: 45px;
    border-radius: 0;
    height: calc(100% - 45px);
    overflow-y: auto;
    .el-card__body {
      padding: 0;
    }
  }
  .right {
    flex: 1;
    margin-left: 238px;
    border-radius: 1px;
    .el-card {
      border: none;
    }
    .app-container {
      height: 100%;
      margin-left: 0;
    }
  }
}
</style>
