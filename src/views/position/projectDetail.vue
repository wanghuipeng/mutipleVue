<template>
  <div class="wrap-box">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/project' }">项目</el-breadcrumb-item>
        <el-breadcrumb-item>{{ renderInfo.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="position-info">
        <div class="info-title">
          <p class="title-name" @click="lookDetail">{{ renderInfo.title }}</p>
          <span class="title-id">#{{ renderInfo.id }}</span>
          <el-tag v-if="renderInfo.statusNo === 3" type="success" size="small" class="title-tag">进行中</el-tag>
          <el-tag v-if="renderInfo.statusNo === 4" type="info" size="small" class="title-tag">已结束</el-tag>
          <el-tag v-if="renderInfo.positionType" type="warning" size="small" class="title-tag">{{ renderInfo.positionType | filterCommonDict(dictData.dicts.positionType) }}</el-tag>
        </div>
        <div class="info-des">
          <img
            class="des-icon"
            src="@/assets/images/position/des-icon.png"
          />
          <div v-if="renderInfo.positionType === 1" class="des-item">
            <p class="tag">
              预计佣金：
              <i>
                {{ renderInfo.commissionAmount }}元
                <span
                  v-if="renderInfo.commissionSettlementType === 1"
                >（{{ renderInfo.commissionRatio }}%）</span>
              </i>
              <el-tooltip v-if="renderInfo.commissionSupplement" effect="dark" placement="top">
                <div slot="content" style="max-width: 200px;">{{ renderInfo.commissionSupplement }}</div>
                <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
              </el-tooltip>
            </p>
            <p class="tag">
              佣金分成：
              <i>{{ renderInfo.hhCommissionRatio }}%</i>
              <el-tooltip
                v-if="renderInfo.recommendedSupplementaryNotes"
                effect="dark"
                placement="top"
              >
                <div
                  slot="content"
                  style="max-width: 200px;"
                >{{ renderInfo.recommendedSupplementaryNotes }}</div>
                <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
              </el-tooltip>
            </p>
            <p class="tag">
              保证期：
              <i>
                {{ renderInfo.guaranteePeriod }}
                <span v-if="renderInfo.guaranteePeriodType === 2">个</span>
                {{ renderInfo.guaranteePeriodType | filterCommonDict(dictData.dicts.guaranteePeriodType) }}
              </i>
            </p>
          </div>
          <div v-if="renderInfo.positionType === 2" class="des-item">
            <p class="des-text">{{ renderInfo.commissionSupplementDescription || '暂无佣金说明' }}</p>
          </div>
        </div>
        <div class="info-body">
          <div v-if="renderInfo.companyName" class="body-item">
            <p class="item-label">客户公司</p>
            <p class="item-value">{{ renderInfo.companyName }}</p>
          </div>
          <div v-if="renderInfo.functionType3" class="body-item">
            <p class="item-label">职能</p>
            <p class="item-value">{{ renderInfo.functionType3 | filterLevel3(dictData.functions) }}</p>
          </div>
          <div class="body-item">
            <p class="item-label">招聘要求</p>
            <p class="item-value">
              <span>{{ renderInfo.workCityId | filterLevel2(dictData.areas) }}</span>
              <span v-if="renderInfo.degreeRequired"> · {{ renderInfo.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}</span>
              <span v-if="renderInfo.recruitmentNumber"> · 招聘{{ renderInfo.recruitmentNumber }}人</span>
            </p>
          </div>
          <div class="body-item">
            <p class="item-label">薪资待遇</p>
            <p class="item-value">
              <span v-if="renderInfo.salaryType === 1">
                {{ renderInfo.salaryStart / 10000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 10000 }}</span>万/年
              </span>
              <span v-if="renderInfo.salaryType === 2 && renderInfo.monthlySalaryRegime">
                {{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K*{{ renderInfo.monthlySalaryRegime }}薪
              </span>
              <span v-if="renderInfo.salaryType === 2 && !renderInfo.monthlySalaryRegime">
                {{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K/月
              </span>
              <span v-if="renderInfo.salaryType === 3">
                {{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/天
              </span>
              <span v-if="renderInfo.salaryType === 4">
                {{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/小时
              </span>
              <span v-if="renderInfo.salaryType === 5">
                面议
              </span>
            </p>
          </div>
          <div v-if="renderInfo.emergencyDegree" class="body-item">
            <p class="item-label">紧急度</p>
            <p class="item-value">{{ renderInfo.emergencyDegree | filterCommonDict(dictData.dicts.recommendationPriority) }}</p>
          </div>
          <div v-if="renderInfo.updateTimeFormat" class="body-item">
            <p class="item-label">最近更新</p>
            <p class="item-value">{{ renderInfo.updateTimeFormat }}</p>
          </div>
        </div>
        <div class="info-btn">
          <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
            <el-button>管理<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="addFolder"
              >加入文件夹</el-dropdown-item>
              <el-dropdown-item
                command="recommendCheck"
              >推荐查重</el-dropdown-item>
              <div v-if="renderInfo.releaseProperties === 1 && (currUserInfo.companyRole === 3 || currUserInfo.companyRole === 4)">
                <el-dropdown-item
                  command="quitProject"
                >退出项目</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- tab切换 -->
      <el-tabs v-model="tab">
        <el-tab-pane name="resume">
          <span slot="label"><span class="detail-link" @click="lookDetail">职位详情</span> 候选人</span>
          <resume-list :position-info="positionInfo" :tab="orderTab" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionInfo.id"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="positionInfo.id" />
    </drawer-common>
    <!-- 单个文件夹 -->
    <single-folder ref="modalSingleFolder" :company-folder-type="1"></single-folder>
    <!-- 推荐查重模态框 -->
    <recommend-check ref="modalForm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from './positionDetail'
import singleFolder from '@/components/folder/singleFolder'
import recommendCheck from './modules/recommendCheck'
import resumeList from '@/views/order/candidate/supplier/list'
import { getPositionDetailById, signOutPosition } from '@/api/position'
export default {
  components: {
    drawerCommon,
    positionDetail,
    singleFolder,
    recommendCheck,
    resumeList
  },
  props: {},
  data() {
    return {
      // 默认展示TAB
      tab: this.$route.query.tab || 'resume',
      // 默认展示订单TAB
      orderTab: this.$route.query.orderTab || 0,
      // 是否显示详情模态框
      positionDetailVisible: false,
      // 职位信息
      positionInfo: {
        id: this.$route.query.positionId
      }
    }
  },
  computed: {
    ...mapState({
      currUserInfo: state => {
        return state.userInfo
      }
    }),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的职位信息
    renderInfo() {
      const data = Object.assign({}, this.positionInfo)
      return data
    }
  },
  mounted() {
    // 查询职位信息
    this.queryPositionInfo()
  },
  methods: {
    // 打开详情模态框
    lookDetail() {
      this.positionDetailVisible = true;
    },
    // 管理操作
    handleCommand(command) {
      switch (command) {
        case 'addFolder':
          this.addFolder();
          break;
        case 'recommendCheck':
          this.recommendCheck();
          break;
        case 'quitProject':
          this.quitProject();
          break;
      }
    },
    // 加入文件夹
    addFolder() {
      this.$refs.modalSingleFolder.edit({ fileId: this.renderInfo.id })
      this.$refs.modalSingleFolder.title = '加入文件夹'
    },
    // 推荐查重
    recommendCheck() {
      const row = Object.assign({}, this.renderInfo)
      this.$refs.modalForm.edit(row)
    },
    // 退出项目
    quitProject() {
      this.$confirm(
        '是否确认退出该项目',
        '退出项目提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          const para = {}
          para.positionId = this.renderInfo.id
          signOutPosition(para).then(res => {
            this.$message({
              message: '退出成功!',
              type: 'success'
            });
            this.$router.push({
              path: '/project'
            })
          })
        })
        .catch(() => {})
    },
    // 查询职位信息
    queryPositionInfo() {
      const para = {}
      para.id = this.positionInfo.id
      getPositionDetailById(para).then(res => {
        this.positionInfo = res.data
        console.log('项目详情', this.positionInfo)
        document.title = this.positionInfo.title + '-大猎英才'
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
  min-height: calc(100% - 76px);
  padding: 16px 0;
  background-color: #f7f7f7;
  overflow: hidden;
  .main-content {
    flex: auto;
    min-height: 100%;
    background-color: #fff;
    position: relative;
    .el-breadcrumb{
      padding: 8px 20px;
      background-color: #f7f7f7;
    }
    .position-info{
      padding: 20px;
      background-color: #fff;
      position: relative;
      .info-title{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .title-name{
          font-size: 18px;
          font-weight: bold;
          color: #282C32;
          cursor: pointer;
          margin-right: 16px;
        }
        .title-id{
          font-size: 12px;
          color: #282C32;
          margin-right: 16px;
        }
        .title-tag{
          margin-right: 12px;
        }
      }
      .info-des {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .des-icon{
          flex: none;
          display: block;
          width: 51px;
          height: 29px;
          margin-right: 16px;
        }
        .des-item{
          flex: auto;
          padding: 5px 12px;
          background-color: #FAECA9;
          border-radius: 2px;
        }
        .tag {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          color: #0D121A;
          &:last-child {
            margin-right: 0;
          }
          i {
            color: $red-color;
            font-style: normal;
          }
          .icon {
            font-size: 15px;
            color: $main-color;
            margin-left: 5px;
          }
        }
        .des-text{
          font-size: 14px;
          color: #0D121A;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .info-body{
        display: flex;
        .body-item{
          margin-right: 120px;
          &:last-child{
            margin-right: 0;
          }
          .item-label{
            font-size: 14px;
            color: #C3C7CD;
            margin-bottom: 12px;
          }
          .item-value{
            font-size: 14px;
            color: #4C5967;
          }
        }
      }
      .info-btn{
        position: absolute;
        right: 16px;
        top: 16px;
        .el-button{
          width: 72px;
          height: 28px;
          padding: 0;
          line-height: 28px;
          font-size: 12px;
          border-radius: 1px;
        }
      }
    }
    .el-tabs {
      ::v-deep .el-tabs__header {
        padding: 0 20px;
        background-color: #F9FAFB;
        margin: 0;
        .el-tabs__nav-wrap::after {
          display: none;
        }
        .el-tabs__item {
          height: 40px;
          padding-top: 0;
          line-height: 40px;
          font-size: 14px;
          color: #808080;
          &.is-active {
            color: $main-color;
          }
        }
        .el-tabs__active-bar {
          background-color: $main-color;
        }
      }
    }
  }
}
</style>

