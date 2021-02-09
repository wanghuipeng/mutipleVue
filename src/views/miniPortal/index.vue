<template>
  <div class="mini-portal-page">
    <el-card class="left" shadow="never">
      <left-menu />
    </el-card>
    <div class="right">
      <router-view />
    </div>
    <el-dialog
      title="请先绑定公众号"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <span>为了保证微门户可以良好对接到公众号，请先到 系统设置-接口管理中，进行公众号扫码授权绑定。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import leftMenu from './leftMenu'
export default {
  components: {
    leftMenu
  },
  data() {
    return {
      isHide: false,
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    setTimeout(() => {
      console.log(this.userInfo)
      if (this.userInfo.companyWxAppId) {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    }, 1000)
  },
  methods: {
    toBind() {
      this.$router.push('/set/interfaceConfig')
    }
  }
}
</script>

<style lang="scss" >
.mini-portal-page {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px 0;
  box-sizing: border-box;
  min-height: calc(100% - 44px);
  .el-tabs__header {
    margin: 0 0 9px;
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
    &.el-card {
      border: none;
    }
  }
  .right {
    margin-left: 238px;
    flex: 1;
    border-radius: 1px;
    .el-card {
      border: none;
    }
    .app-container {
      height: 100%;
      padding-left: 0;
    }
  }
}
</style>
