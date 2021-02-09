<template>
  <div class="wrap">
    <!-- tab切换 -->
    <el-tabs v-model="tab">
      <el-tab-pane label="关注企业" name="company">
        <company/>
      </el-tab-pane>
      <el-tab-pane label="关注分析师" name="teacher">
        <teacher/>
      </el-tab-pane>
    </el-tabs>
    <!-- 管理我的关注 -->
    <a href="javascript:void(0);" class="manage-btn" @click="toFollow">管理我的关注</a>
  </div>
</template>

<script>
import company from '../followTab/company'
import teacher from '../followTab/teacher'
export default {
  components: {
    company,
    teacher
  },
  data() {
    return {
      // 默认展示TAB
      tab: 'company'
    }
  },
  mounted() {
    document.body.style['overflow'] = 'auto'
    document.title = '关注动态-大猎英才'
  },
  methods: {
    // 跳转我的关注页
    toFollow() {
      switch (this.tab) {
        case 'company' :
          window.open('/myCenter/attention?tab=first');
          break;
        case 'teacher' :
          window.open('/myCenter/attention?tab=second');
          break;
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '@/assets/sass/position/common.scss';
  .wrap{
    position: relative;
    .el-tabs{
      ::v-deep .el-tabs__header{
        margin-bottom: 20px;
        .el-tabs__nav-wrap::after{
          background-color: #B3B3B3FF;
          height: 1px;
        }
        .el-tabs__item{
          height: 35px;
          line-height: 28px;
          font-size: 16px;
          color: #808080FF;
          &.is-active{
              color: $main-color;
              font-weight: bold;
           }
        }
        .el-tabs__active-bar{
          background-color: $main-color;
        }
      }
    }
    .manage-btn{
      font-size: 15px;
      color: $main-color;
      text-decoration: none;
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
</style>

