<template>
  <div class="wrap-box">
    <!-- 顶部信息 -->
    <recommend-position-top-bar :resume-info="resumeInfo" />
    <!-- 标题栏 -->
    <div class="title-bar">
      <div class="bar-name">选择您要推荐的职位</div>
      <div class="bar-form">
        <el-input
          v-model="queryForm.searchName"
          placeholder="请输入职位、公司搜索已接单职位"
          autocomplete="off"
          clearable
        />
        <el-button type="primary" size="mini" @click="searchList">
          <i class="el-icon-search" />
        </el-button>
      </div>
    </div>
    <!-- 选择职位 -->
    <div class="select-position">
      <div class="list-title">
        <span class="title-item item-1">职位信息</span>
        <!-- <span class="title-item item-2">地点</span>
        <span class="title-item item-3">保证期</span>
        <span class="title-item item-4">年薪（万）</span>
        <span class="title-item item-5">佣金</span> -->
      </div>
      <!-- 职位列表 -->
      <div v-loading="loading" class="list-area">
        <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
          <div class="item-body">
            <div class="position-item" @click="currSelectPosition = item">
              <div :class="['item-select', { active: currSelectPosition.positionId === item.positionId }]">
                <i class="el-icon-success" />
              </div>
              <div class="item-main main-1">
                <img class="main-logo" src="~@/assets/images/common/company_avatar.png" />
                <div class="main-info">
                  <p class="info-title">{{ item.title }}</p>
                  <p class="info-sub">{{ item.companyName }}</p>
                </div>
              </div>
              <!-- <div class="item-main main-1">
                <img v-if="item.logoImg" class="main-logo" :src="item.logoImg" />
                <img v-else class="main-logo" src="~@/assets/images/common/company_avatar.png" />
                <div class="main-info">
                  <p class="info-title">{{ item.title }}</p>
                  <p class="info-sub">{{ item.shortName }}</p>
                </div>
              </div>
              <div class="item-main main-2">
                <div class="main-text">{{ item.workCityId | filterLevel2(dictData.areas) }}</div>
              </div>
              <div class="item-main main-3">
                <div class="main-text">
                  {{ item.guaranteePeriod }}
                  <span v-if="item.guaranteePeriodType === 2">个</span>
                  {{ item.guaranteePeriodType | filterCommonDict(dictData.dicts.guaranteePeriodType) }}
                </div>
              </div>
              <div class="item-main main-4">
                <div v-if="item.salaryType === 1" class="main-text">
                  {{ item.salaryStart / 10000 }}<span v-if="item.salaryStart !== item.salaryEnd">-{{ item.salaryEnd / 10000 }}</span>万/年
                </div>
                <div v-if="item.salaryType === 2 && item.monthlySalaryRegime" class="main-text">
                  {{ item.salaryStart / 1000 }}<span v-if="item.salaryStart !== item.salaryEnd">-{{ item.salaryEnd / 1000 }}</span>K*{{ item.monthlySalaryRegime }}薪
                </div>
                <div v-if="item.salaryType === 2 && !item.monthlySalaryRegime" class="main-text">
                  {{ item.salaryStart / 1000 }}<span v-if="item.salaryStart !== item.salaryEnd">-{{ item.salaryEnd / 1000 }}</span>K/月
                </div>
                <div v-if="item.salaryType === 3" class="main-text">
                  {{ item.salaryStart }}<span v-if="item.salaryStart !== item.salaryEnd">-{{ item.salaryEnd }}</span>元/天
                </div>
                <div v-if="item.salaryType === 4" class="main-text">
                  {{ item.salaryStart }}<span v-if="item.salaryStart !== item.salaryEnd">-{{ item.salaryEnd }}</span>元/小时
                </div>
                <div v-if="item.salaryType === 5" class="main-text">
                  面议
                </div>
              </div>
              <div class="item-main main-5">
                <div class="main-text">
                  {{ item.commissionAmount }}
                  <span v-if="item.commissionSettlementType === 1">（{{ item.commissionRatio }}%）</span>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 列表为空 -->
      <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
        <img src="@/assets/images/position/psition_empty.png" />
        <p>抱歉，未能找到相关的职位</p>
      </div>
      <!-- 列表分页 -->
      <div
        v-if="dataTableObj.total && dataTableObj.total > dataTableObj.list.length"
        class="page-area"
      >
        <el-pagination
          ref="listPage"
          class="list-page"
          layout="prev, pager, next"
          :current-page="dataTableObj.currPage"
          :page-size="dataTableObj.pageSize"
          :total="dataTableObj.total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!-- 底部栏 -->
    <div :class="['footer-bar',fixedFooter && 'isFixedFooter']">
      <div class="wrap-bar">
        <div class="bar-main">
          <div class="main-step">
            <div class="step-left">
              <p class="step-des green">1、确认已经和候选人沟通过该职位</p>
              <p class="step-des">3、如果未经候选人同意产生的推荐，将会受到平台处罚</p>
            </div>
            <div class="step-right">
              <p class="step-des green">2、确认该候选人没有通过其他渠道推荐</p>
              <p class="step-des">4、HR在发起面试之前将无法看到候选人的联系方式</p>
            </div>
          </div>
          <div class="main-btn">
            <el-button class="confirm-btn" :loading="nextLoading" @click="next">下一步，简历确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins/position'
import recommendPositionTopBar from './recommendCandidateCommon/recommendPositionTopBar'
import {
  getResumeInfoById,
  getSPositionByUserId,
  recommendReportInit
} from '@/api/position'
export default {
  components: {
    recommendPositionTopBar
  },
  mixins: [TableMixin],
  data() {
    return {
      // 下一步按钮是否loading状态
      nextLoading: false,
      // 是否固定底部
      fixedFooter: false,
      // 简历信息
      resumeInfo: {
        id: this.$route.query.resumeId
      },
      // 查询条件
      queryForm: {
        searchName: ''
      },
      // 当前选中职位
      currSelectPosition: {}
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
    this.handleScroll()
    // handleScroll为页面滚动的监听回调
    window.addEventListener('scroll', this.handleScroll)
    // 查询简历信息
    this.queryResumeInfo()
  },
  destroyed() {
    // 销毁页面滚动的监听回调
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 监听页面滚动实现吸顶
    handleScroll() {
      // 得到页面滚动的距离
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      // 得到页面可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 得到页面文档高度
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 监听dom渲染完成
      this.$nextTick(() => {
        // 这里要得到top的距离和元素自身的高度
        this.fixedFooter = scrollTop + clientHeight < scrollHeight - 110
      })
    },
    // 查询简历信息
    queryResumeInfo() {
      const para = Object.assign({}, this.resumeInfo)
      getResumeInfoById(para).then(res => {
        this.resumeInfo = res.data
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      para.statusNo = 3
      getSPositionByUserId(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    },
    // 下一步
    next() {
      // if (this.currSelectPosition.id) {
      //   this.nextLoading = true
      //   const para = {}
      //   para.resumeId = this.resumeInfo.detail.id
      //   para.positionId = this.currSelectPosition.id
      //   recommendReportInit(para).then(res => {
      //     this.nextLoading = false
      //     this.$router.push({
      //       path: '/recommendReport',
      //       query: {
      //         routeType: 'recommendPosition',
      //         positionId: this.currSelectPosition.id,
      //         companyId: this.currSelectPosition.companyId,
      //         resumeId: this.resumeInfo.detail.id,
      //         reportId: res.data.data
      //       }
      //     })
      //   })
      // } else {
      //   this.$message({
      //     message: '请选择一个职位!',
      //     type: 'warning',
      //     showClose: true,
      //     center: true
      //   })
      // }
      if (this.currSelectPosition.positionId) {
        this.nextLoading = true
        const para = {}
        para.resumeId = this.resumeInfo.detail.id
        para.positionId = this.currSelectPosition.positionId
        recommendReportInit(para).then(res => {
          this.nextLoading = false
          this.$router.push({
            path: '/recommendReport',
            query: {
              routeType: 'recommendPosition',
              positionId: this.currSelectPosition.positionId,
              companyId: this.currSelectPosition.companyId,
              resumeId: this.resumeInfo.detail.id,
              reportId: res.data.data
            }
          })
        })
      } else {
        this.$message({
          message: '请选择一个职位!',
          type: 'warning',
          showClose: true,
          center: true
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  .title-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .bar-name {
      font-size: 16px;
      color: #333333ff;
      margin-top: 10px;
    }
    .bar-form {
      display: flex;
      width: 240px;
      justify-content: space-between;
      align-items: stretch;
      height: 30px;
      background-color: #fff;
      border-radius: 22px;
      border: 1px solid #d8d8d8ff;
      overflow: hidden;
      .el-input {
        flex: auto;
        ::v-deep .el-input__inner {
          height: 30px;
          line-height: 30px;
          background-color: transparent;
          border: none;
        }
        ::v-deep .el-input__icon {
          line-height: 30px;
        }
      }
      .el-button {
        width: 60px;
        padding: 0;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        background-color: #d8d8d8ff;
        border: none;
        border-radius: 0;
      }
    }
  }
  .select-position {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    .list-title {
      padding: 40px 20px 20px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      overflow: hidden;
      .title-item {
        font-size: 14px;
        color: #333333ff;
        float: left;
        &.item-1 {
          width: 380px;
          margin-left: 80px;
        }
        &.item-2 {
          width: 120px;
        }
        &.item-3 {
          width: 120px;
        }
        &.item-4 {
          width: 150px;
        }
        &.item-5 {
          width: 150px;
        }
      }
    }
    .list-area {
      margin: 0;
      padding: 0 20px;
      .position-item {
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #ccc;
        overflow: hidden;
        margin: 15px  0;
        .item-select {
          width: 26px;
          height: 26px;
          border: 2px solid #ccc;
          border-radius: 50%;
          margin-top: 15px;
          cursor: pointer;
          margin-right: 30px;
          position: relative;
          float: left;
          &.active i {
            display: block;
          }
          i {
            display: none;
            font-size: 33px;
            color: $main-color;
            position: absolute;
            left: -4px;
            top: -4px;
          }
        }
        .item-main {
          display: flex;
          float: left;
          &.main-1 {
            width: 380px;
          }
          &.main-2 {
            width: 120px;
          }
          &.main-3 {
            width: 120px;
          }
          &.main-4 {
            width: 150px;
          }
          &.main-5 {
            width: 150px;
          }
          .main-logo {
            display: block;
            width: 60px;
            height: 60px;
            border-radius: 8px;
            margin-right: 20px;
          }
          .main-info {
            .info-title {
              font-size: 18px;
              color: #323232ff;
              font-weight: 600;
              line-height: 32px;
              margin-bottom: 4px;
            }
            .info-sub {
              font-size: 14px;
              color: #7f7f7f;
            }
          }
          .main-text {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #4d4d4dff;
          }
        }
      }
    }
  }
  .footer-bar {
    .wrap-bar {
      width: 1200px;
      margin: 0 auto;
      .bar-main {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        .main-step {
          display: flex;
          .step-left {
            margin-right: 20px;
          }
          .step-des {
            font-size: 14px;
            color: #7f7f7f;
            &.green {
              margin-bottom: 12px;
              color: #07bf62ff;
            }
          }
        }
        .main-btn {
          display: flex;
          padding: 3px 0;
          line-height: 44px;
          .confirm-btn {
            width: 200px;
            box-sizing: border-box;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
          }
        }
      }
    }
  }
}
</style>

