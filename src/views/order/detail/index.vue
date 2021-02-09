<template>
  <div class="container">
    <div v-if="detail" class="detail">
      <candidateInfo :detail="detail" />
      <!-- 订单 -->
      <orderInfo :detail="detail" @getDetail="reloadDetail"/>
      <!-- tabs -->
      <el-tabs>
        <el-tab-pane label="推荐报告">
          <report :report-info="detail.candidateRecommendReport" :resume="detail.resumeInfo" />
        </el-tab-pane>
        <el-tab-pane label="订单动态">
          <dynamic :id="id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import candidateInfo from './candidateInfo'
import orderInfo from './orderInfo'
import report from './report'
import dynamic from './dynamic'
import { detail } from '@/api/order'
export default {
  components: {
    candidateInfo,
    orderInfo,
    report,
    dynamic
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      detail: '' // 详情
    }
  },
  created() {
    this.id = this.$route.query.orderId ? this.$route.query.orderId : this.id
    detail({ id: this.id }).then(res => {
      if (res.code === '000000') {
        this.detail = res.data
        console.log(111111111, res.data)
        if (res.data.id === null) {
          this.$router.push('/notFound')
        }
      }
      document.title = `（${res.data.jobhunterName}）的推荐报告-大猎英才`
    })
  },
  methods: {
    reloadDetail() {
      detail({ id: this.id }).then(res => {
        if (res.code === '000000') {
          this.detail = res.data
        }
      })
      this.$emit('reload')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  justify-content: center;
  background: #F7F7F7;
  .detail {
    flex: 1;
    max-width: 1080px;
    padding: 20px 0;
    box-sizing: border-box;
    .el-tabs{
      padding-top: 20px;
      background: #ffffff;
      border-radius: 1px;
      ::v-deep .el-tabs__header{
        margin: 0 20px;
        border-bottom: 1px solid #B3B3B3;
        .el-tabs__item{
          height: 29px;
          font-size: 18px;
          line-height: 26px;
          margin-bottom: 10px;
          color: #4D4D4D;
          &.is-active{
            color: #1678F9;
          }
        }
        .el-tabs__nav-wrap::after {
          height: 0.5px;
          background-color: #B3B3B3;
        }
        .el-tabs__active-bar{
          background-color: #1678F9;
        }
      }
    }
  }
}
.el-drawer__wrapper {
  .detail {
    padding: 20px;
  }
}
</style>
