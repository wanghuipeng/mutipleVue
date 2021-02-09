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
      <div class="main-content">
        <p>招聘会名称：{{ editForm.name }}</p>
        <p>招聘会时间：{{ editForm.startFormat }} - {{ editForm.endFormat }}</p>
      </div>
      <div class="main-des">
        <p class="des-title">友情提示：</p>
        <p class="des-body">
          根据招聘会参展相关规定，您需要预先完成企业信息认证，方可将您发布的职位上架到招聘会
          <el-link type="warning" @click="toCertification">点击此处立即认证</el-link>
        </p>
      </div>
    </div>
    <span slot="footer">
      <el-button class="cancel-btn" @click="handleClose">取消</el-button>
      <el-button class="confirm-btn" @click="handleSubmit">前往发布职位</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '招聘会报名成功',
      visible: false,
      // 编辑表单
      editForm: {}
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
        this.editForm = Object.assign({}, row)
      })
    },
    // 前往发布职位
    handleSubmit() {
      this.$router.push({ name: 'releasePosition' })
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
    },
    // 去认证
    toCertification() {
      this.$router.push('/certification')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/jobfair/common.scss';
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
    .main-content{
      padding: 20px 0;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      box-shadow:0px 2px 15px 0px rgba(50,20,3,0.05);
      border-radius:4px;
      margin-bottom: 28px;
    }
    .main-des{
      .des-title{
        font-size: 12px;
        font-weight: bold;
        color: #333333;
        margin-bottom: 10px;
      }
      .des-body{
        line-height: 20px;
        font-size: 12px;
        color: #666;
        .el-link{
          font-size: 12px;
          color: #FF5D00;
        }
      }
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 20px;
}
</style>
