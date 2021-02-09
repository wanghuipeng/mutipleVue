<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="450px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="main">
      <img :src="webUrl" />
    </div>
    <span slot="footer">
      <p>请用微信扫描上方小程序码<br />在手机端查看对应职位页面效果</p>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      title: '在手机端预览职位',
      visible: false,
      // 二维码请求地址
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
    edit(row) {
      this.visible = true
      this.$nextTick(() => {
        const positionId = row.id
        const token = Vue.ls.get('x-client-token')
        this.webUrl =
          window.location.protocol +
          '//' +
          window.location.host +
          '/api/owner/code/getPositionCordByPositonId?positionId=' +
          positionId +
          '&x-client-token=' +
          token
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
  padding: 20px;
  .el-dialog__title{
    font-size: 14px;
    color: #15181B;
  }
}
::v-deep .el-dialog__body {
  padding: 0 20px;
  .main {
    img {
      display: block;
      width: 100%;
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 20px;
  text-align: center;
  p{
    font-size: 12px;
    color: #15181B;
  }
}
</style>
