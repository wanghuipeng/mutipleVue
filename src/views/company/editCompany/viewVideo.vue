<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="main">
      <video
        id="myVideo"
        ref="myVideo"
        class="video"
        controls
        autoplay="muted"
        preload="auto"
        width="100%"
        height="100%"
      >
        <source
          :src="webUrl"
          type="video/mp4"
        >
      </video>
    </div>
    <span slot="footer">
      <el-button class="cancel-btn" @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      visible: false,
      // 访问地址
      webUrl: ''
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {},
  methods: {
    // 表单赋值
    edit(url) {
      this.visible = true
      this.$nextTick(() => {
        this.webUrl = url
        this.$refs.myVideo.src = this.webUrl
      })
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog__body {
  padding: 20px 20px 0;
  .title {
    padding: 0 20px;
    line-height: 24px;
    font-size: 15px;
    color: #808080ff;
  }
  .main {
    .video{
      display: block;
      width: 100%;
      height: 300px;
      margin-bottom: 20px;
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 0 40px 20px;
  .el-button {
    &.confirm-btn {
      margin-left: 20px;
    }
  }
}
</style>
