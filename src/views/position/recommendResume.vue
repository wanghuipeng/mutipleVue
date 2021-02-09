<template>
  <div class="wrap-box">
    <!-- 顶部信息 -->
    <top-bar :position-info="positionInfo" :company-info="companyInfo" />
    <!-- 标题栏 -->
    <div class="title-bar">选择候选人</div>
    <!-- 选择简历 -->
    <div class="select-resume">
      <div class="search-bar">
        <div class="bar-form">
          <el-input
            v-model="queryForm.searchName"
            placeholder="请输入姓名/职位/电话/公司/城市搜索"
            autocomplete="off"
            clearable
          />
          <el-button type="primary" size="mini" @click="searchList">
            <i class="el-icon-search" />
          </el-button>
        </div>
        <div class="bar-btn">
          <el-button class="cancel-btn" @click="uploadResume">+ 添加候选人</el-button>
        </div>
      </div>
      <div class="other-search">
        <el-select v-model="queryForm.age" placeholder="年龄范围" clearable @change="searchList">
          <el-option
            v-for="item in dictData.dicts.ageRange"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <el-select v-model="queryForm.degreeCode" placeholder="学历学位" clearable @change="searchList">
          <el-option
            v-for="item in dictData.dicts.degreeRequired"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <el-select v-model="queryForm.workMonth" placeholder="工作经验" clearable @change="searchList">
          <el-option
            v-for="item in dictData.dicts.workYear"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <select-picker
          ref="intentionCity"
          key-name="intentionCity"
          placeholder="期望城市"
          :default-value="queryForm.intentionCity"
          :data-source="dictData.areas"
          :first-tab-name="dictData.areas[0].value"
          :max-number="1"
          :level-number="2"
          @afterClose="searchList"
        />
        <el-select
          v-model="queryForm.currentSalarySpecific"
          placeholder="目前年薪"
          clearable
          @change="searchList"
        >
          <el-option
            v-for="item in dictData.dicts.goodAtSalary"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
      </div>
      <!-- 简历列表 -->
      <div v-loading="loading" class="list-area">
        <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
          <div class="item-body">
            <div class="resume-item" @click="currSelectResume = item">
              <div
                :class="['item-select', { active: currSelectResume.detail.id === item.detail.id }]"
              >
                <i class="el-icon-success" />
              </div>
              <div class="item-main">
                <img v-if="item.detail.avatarImg" class="main-avatar" :src="item.detail.avatarImg" />
                <img
                  v-else-if="item.detail.gender === 1"
                  class="main-avatar"
                  src="~@/assets/images/common/man_avatar.png"
                />
                <img
                  v-else-if="item.detail.gender === 2"
                  class="main-avatar"
                  src="~@/assets/images/common/women_avatar.png"
                />
                <img v-else class="main-avatar" src="~@/assets/images/common/avatar.png" />
                <div class="main-info">
                  <p class="info-title">
                    <span class="title-name">{{ item.detail.name }}</span>
                    <span
                      class="title-sub"
                    >{{ item.detail.liveCity | filterLevel2(dictData.areas) }} · {{ item.detail.gender | filterCommonDict(dictData.dicts.gender) }} · {{ item.detail.age }}岁 · 工作{{ item.detail.workMonth }} · {{ item.detail.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
                  </p>
                  <p
                    v-for="(experiencesItem, experiencesIndex) in item.experiences"
                    :key="experiencesIndex"
                    class="info-job"
                  >{{ experiencesItem.companyName }} · {{ experiencesItem.title }} · {{ experiencesItem.startDate }}-{{ experiencesItem.endDate }}（{{ experiencesItem.startToEndDate }}）</p>
                  <p
                    v-for="(educationsItem, educationsIndex) in item.educations"
                    :key="educationsIndex"
                    class="info-job"
                  >{{ educationsItem.school }} · {{ educationsItem.speciality }} · {{ educationsItem.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }} · {{ educationsItem.startDate }}-{{ educationsItem.endDate }}（{{ educationsItem.startToEndDate }}）</p>
                </div>
              </div>
              <div class="item-contact">
                <p>
                  <img src="@/assets/images/position/hollow-phone-icon.png" />
                  <span>{{ item.detail.mobile }}</span>
                </p>
                <p>
                  <img src="@/assets/images/position/hollow-email-icon.png" />
                  <span>{{ item.detail.email }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 列表为空 -->
      <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
        <img src="@/assets/images/position/resume_empty.png" />
        <p>抱歉，未能找到您相关的简历</p>
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
    <!-- 简历上传解析（抽屉） -->
    <drawer-common :drawer.sync="uploadResumeVisible" :no-new-window="true" @close="close">
      <upload-drawer slot="inner-body" ref="uploadDrawer" @fatherMethod="close" />
    </drawer-common>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins/position'
import selectPicker from '@/components/common/selectPicker'
import topBar from './recommendCandidateCommon/topBar'
import DrawerCommon from '@/components/common/drawerCommon'
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer'
import {
  getPositionDetailById,
  getCompanyDetail,
  getResumeInfoListByUserId,
  recommendReportInit
} from '@/api/position'
export default {
  components: {
    selectPicker,
    topBar,
    DrawerCommon,
    UploadDrawer
  },
  mixins: [TableMixin],
  data() {
    return {
      // 下一步按钮是否loading状态
      nextLoading: false,
      // 上传简历模态框是否显示
      uploadResumeVisible: false,
      // 是否固定底部
      fixedFooter: false,
      // 职位信息
      positionInfo: {
        id: this.$route.query.positionId
      },
      // 企业信息
      companyInfo: {},
      // 查询条件
      queryForm: {
        searchName: '',
        age: '',
        degreeCode: '',
        workMonth: '',
        intentionCity: [],
        currentSalarySpecific: ''
      },
      // 当前选中简历
      currSelectResume: {
        detail: {}
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
    this.handleScroll()
    // handleScroll为页面滚动的监听回调
    window.addEventListener('scroll', this.handleScroll)
    // 查询职位信息
    this.queryPositionInfo()
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
    // 添加候选人
    uploadResume() {
      this.uploadResumeVisible = true
    },
    // 添加候选人完成
    close() {
      this.searchList()
      this.uploadResumeVisible = false
      this.$refs.uploadDrawer.destroyedInterval()
    },
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
    // 查询简历列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      // 城市
      const intentionCity = this.selectedData.intentionCity
      if (
        intentionCity &&
        intentionCity[0] &&
        intentionCity[0] !== 'undefined'
      ) {
        para.intentionCity = intentionCity
      } else {
        para.intentionCity = []
      }
      getResumeInfoListByUserId(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        let records = res.data.records
        records = records.map(item => {
          item.experiences = item.experiences
            ? item.experiences.splice(0, 2)
            : []
          item.educations = item.educations ? item.educations.splice(0, 1) : []
          return item
        })
        this.dataTableObj.list = records
      })
    },
    // 下一步
    next() {
      if (this.currSelectResume.detail.id) {
        this.nextLoading = true
        const para = {}
        para.positionId = this.positionInfo.id
        para.resumeId = this.currSelectResume.detail.id
        recommendReportInit(para).then(res => {
          this.nextLoading = false
          this.$router.push({
            path: '/recommendReport',
            query: {
              routeType: 'recommendResume',
              positionId: this.positionInfo.id,
              companyId: this.positionInfo.companyId,
              resumeId: this.currSelectResume.detail.id,
              reportId: res.data.data
            }
          })
        })
      } else {
        this.$message({
          message: '请选择一个候选人!',
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
    font-size: 16px;
    color: #333333ff;
    margin-bottom: 20px;
  }
  .select-resume {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    .search-bar {
      display: flex;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid #ccc;
      .bar-form {
        display: flex;
        width: 407px;
        justify-content: space-between;
        align-items: stretch;
        height: 34px;
        background-color: #fff;
        border-radius: 22px;
        border: 1px solid #d8d8d8ff;
        overflow: hidden;
        .el-input {
          flex: auto;
          ::v-deep .el-input__inner {
            height: 34px;
            line-height: 34px;
            background-color: transparent;
            border: none;
          }
          ::v-deep .el-input__icon {
            line-height: 34px;
          }
        }
        .el-button {
          width: 60px;
          padding: 0;
          height: 34px;
          line-height: 34px;
          font-size: 18px;
          background-color: #d8d8d8ff;
          border: none;
          border-radius: 0;
        }
      }
      .bar-btn {
        .cancel-btn {
          width: 160px;
          box-sizing: border-box;
          height: 36px;
          line-height: 36px;
          border-radius: 22px;
        }
      }
    }
    .other-search {
      display: flex;
      padding: 0 10px;
      .el-select {
        width: 110px;
        margin-right: 40px;
        ::v-deep .el-input__inner {
          border: none;
          font-size: 14px;
          color: #7f7f7f;
        }
        ::v-deep .el-select__caret {
          color: #000000ff;
        }
      }
      ::v-deep .diy-select {
        width: 110px;
        margin-right: 40px;
        .el-input__inner {
          border: none;
          font-size: 14px;
          color: #7f7f7f;
          height: 40px;
          line-height: 40px;
          padding: 0 15px;
          padding-right: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-icon-caret-bottom {
          right: 13px;
          top: 13px;
        }
        .el-icon-circle-close {
          right: 8px;
          top: 11px;
        }
      }
    }
    .list-area {
      margin: 0;
      padding: 0 20px;
      .resume-item {
        display: flex;
        padding: 20px;
        border-radius: 8px;
        cursor: pointer;
        border: 1px solid #ccc;
        margin: 15px 0;
        &:hover {
          background-color: rgba(30, 117, 255, 0.1);
        }
        .item-select {
          width: 26px;
          height: 26px;
          border: 2px solid #ccc;
          border-radius: 50%;
          margin-top: 15px;
          cursor: pointer;
          position: relative;
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
          flex: auto;
          padding: 0 40px;
          display: flex;
          .main-avatar {
            display: block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 20px;
          }
          .main-info {
            flex: auto;
            .info-title {
              line-height: 60px;
              .title-name {
                font-size: 18px;
                color: #323232ff;
                font-weight: 600;
                margin-right: 16px;
              }
              .title-sub {
                font-size: 14px;
                color: #7f7f7f;
              }
            }
            .info-job {
              line-height: 32px;
              font-size: 14px;
              color: #7f7f7f;
            }
          }
        }
        .item-contact {
          width: 268px;
          p {
            display: flex;
            margin-bottom: 16px;
            img {
              display: block;
              width: 18px;
              height: 18px;
              margin-right: 16px;
            }
            span {
              font-size: 14px;
              color: #7f7f7fff;
            }
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

