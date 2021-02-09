<template>
  <div class="wrap-box">
    <!-- 顶部信息 -->
    <top-bar :position-info="positionInfo" :company-info="companyInfo" style="display: none;" />
    <!-- 发送成功 -->
    <div class="send-success">
      <p class="success-icon">
        <i class="el-icon-success" />
      </p>
      <p class="success-title">推荐报告发送成功！</p>
      <div class="success-sub">恭喜您，推荐报告提交成功，接下来进入平台自动审核阶段，将在1个工作日内反馈审核结果，请查看订单实时获取结果信息。</div>
      <div class="success-btn">
        <el-button class="cancel-btn" @click="toDetail(`/projectDetail?positionId=${positionInfo.id}&tab=resume&orderTab=0&queryType=1`)">查看订单</el-button>
        <el-button class="confirm-btn" @click="backHome">返回首页</el-button>
      </div>
    </div>
    <!-- 标题栏 -->
    <div v-if="dataTableObj.list.length" class="title-bar">根据该候选人的简历，适合TA的职位还有以下这些</div>
    <!-- 职位列表 -->
    <div v-if="dataTableObj.list.length" v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-body">
          <position-item :position-info="item" @lookDetail="lookDetail" />
        </div>
      </div>
    </div>
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionId"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="positionId" />
    </drawer-common>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins/position'
import topBar from './recommendCandidateCommon/topBar'
import positionItem from './common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from './positionDetail'
import {
  getPositionDetailById,
  getCompanyDetail,
  getResumeInfoById,
  getPositionList
} from '@/api/position'
export default {
  components: {
    topBar,
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  data() {
    return {
      // 职位信息
      positionInfo: {
        id: this.$route.query.positionId
      },
      // 企业信息
      companyInfo: {},
      // 订单ID
      orderId: this.$route.query.orderId,
      // 简历信息
      resumeInfo: {
        detail: {
          id: this.$route.query.resumeId
        }
      }
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
  mounted() {
    document.title = '编辑推荐报告-大猎英才'
    window.scrollTo(0, 0)
    // 查询职位信息
    this.queryPositionInfo()
    // 查询简历信息
    this.queryResumeInfo()
  },
  methods: {
    // 查询职位信息
    queryPositionInfo() {
      const para = Object.assign({}, this.positionInfo)
      getPositionDetailById(para).then(res => {
        this.positionInfo = res.data
        this.companyInfo.id = this.positionInfo.companyId
        this.queryCompanyInfo()
      })
    },
    // 查询企业信息
    queryCompanyInfo() {
      const para = Object.assign({}, this.companyInfo)
      getCompanyDetail(para).then(res => {
        this.companyInfo = res.data
      })
    },
    // 查询简历信息
    queryResumeInfo() {
      const para = Object.assign({}, this.resumeInfo.detail)
      getResumeInfoById(para).then(res => {
        this.resumeInfo = res.data
        this.searchList()
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = {}
      para.pageNumber = 1
      para.pageSize = 3
      para.searchName = this.resumeInfo.detail.currentPosition
      para.workCityId = this.resumeInfo.detail.liveCity
      para.degreeRequired = this.resumeInfo.detail.degreeCode
      getPositionList(para).then(res => {
        this.loading = false
        this.dataTableObj.list = res.data.records
      })
    },
    // 新窗口打开页面
    toDetail(url) {
      window.open(url)
    },
    // 返回首页
    backHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  .send-success {
    // width: 900px;
    width: 1200px;
    padding: 40px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    margin: 0 auto 40px;
    .success-icon {
      margin-bottom: 20px;
      .el-icon-success {
        font-size: 60px;
        color: $main-color;
      }
    }
    .success-title {
      font-size: 16px;
      color: #333333ff;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .success-sub {
      font-size: 14px;
      color: #b2b2b2ff;
      margin-bottom: 40px;
    }
    .success-btn {
      .el-button {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        margin: 0 40px;
      }
    }
  }
  .title-bar {
    font-size: 16px;
    color: #333333ff;
    margin-bottom: 20px;
  }
  .list-area {
    margin-bottom: 0;
    .list-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>

