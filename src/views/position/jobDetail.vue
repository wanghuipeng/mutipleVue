<template>
  <div class="wrap-box">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/job' }">职位</el-breadcrumb-item>
        <el-breadcrumb-item>{{ renderInfo.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="position-info">
        <div class="info-title">
          <p class="title-name" @click="lookDetail">{{ renderInfo.title }}</p>
          <span class="title-id">#{{ renderInfo.id }}</span>
          <el-tag
            v-if="renderInfo.recruitNature"
            size="small"
            class="title-tag"
          >{{
            renderInfo.recruitNature
              | filterCommonDict(dictData.dicts.recruitProperties)
          }}</el-tag>
          <el-tag
            v-if="renderInfo.statusNo === 3"
            type="success"
            size="small"
            class="title-tag"
          >进行中</el-tag>
          <el-tag
            v-if="renderInfo.statusNo === 4"
            type="info"
            size="small"
            class="title-tag"
          >已结束</el-tag>
          <el-tag
            v-if="renderInfo.positionType"
            type="warning"
            size="small"
            class="title-tag"
          >{{
            renderInfo.positionType
              | filterCommonDict(dictData.dicts.positionType)
          }}</el-tag>
        </div>
        <div class="info-body">
          <div
            v-if="
              renderInfo.positionSupplierType &&
                (renderInfo.companyName || renderInfo.positionDepartmentName)
            "
            class="body-item"
          >
            <p class="item-label">部门/企业</p>
            <p v-if="renderInfo.positionSupplierType === 1" class="item-value">
              {{ renderInfo.positionDepartmentName }}
            </p>
            <p v-if="renderInfo.positionSupplierType === 2" class="item-value">
              {{ renderInfo.companyName }}
            </p>
          </div>
          <div v-if="renderInfo.functionType3" class="body-item">
            <p class="item-label">职能</p>
            <p class="item-value">
              {{ renderInfo.functionType3 | filterLevel3(dictData.functions) }}
            </p>
          </div>
          <div class="body-item">
            <p class="item-label">招聘要求</p>
            <p class="item-value">
              <span>{{
                renderInfo.workCityId | filterLevel2(dictData.areas)
              }}</span>
              <span v-if="renderInfo.degreeRequired">
                ·
                {{
                  renderInfo.degreeRequired
                    | filterCommonDict(dictData.dicts.degreeRequired)
                }}</span>
              <span v-if="renderInfo.recruitmentNumber">
                · 招聘{{ renderInfo.recruitmentNumber }}人</span>
            </p>
          </div>
          <div class="body-item">
            <p class="item-label">薪资待遇</p>
            <p class="item-value">
              <span v-if="renderInfo.salaryType === 1">
                {{ renderInfo.salaryStart / 10000
                }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 10000 }}</span>万/年
              </span>
              <span
                v-if="
                  renderInfo.salaryType === 2 && renderInfo.monthlySalaryRegime
                "
              >
                {{ renderInfo.salaryStart / 1000
                }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 1000 }}</span>K*{{ renderInfo.monthlySalaryRegime }}薪
              </span>
              <span
                v-if="
                  renderInfo.salaryType === 2 && !renderInfo.monthlySalaryRegime
                "
              >
                {{ renderInfo.salaryStart / 1000
                }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 1000 }}</span>K/月
              </span>
              <span v-if="renderInfo.salaryType === 3">
                {{ renderInfo.salaryStart
                }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd }}</span>元/天
              </span>
              <span v-if="renderInfo.salaryType === 4">
                {{ renderInfo.salaryStart
                }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd }}</span>元/小时
              </span>
              <span v-if="renderInfo.salaryType === 5"> 面议 </span>
            </p>
          </div>
          <div v-if="renderInfo.emergencyDegree" class="body-item">
            <p class="item-label">紧急度</p>
            <p class="item-value">
              {{
                renderInfo.emergencyDegree
                  | filterCommonDict(dictData.dicts.recommendationPriority)
              }}
            </p>
          </div>
          <div v-if="renderInfo.updateTimeFormat" class="body-item">
            <p class="item-label">最近更新</p>
            <p class="item-value">{{ renderInfo.updateTimeFormat }}</p>
          </div>
        </div>
        <div class="info-btn">
          <el-button class="mr-15" @click="editPosition">编辑职位</el-button>
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            @command="handleCommand"
          >
            <el-button>管理<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="addFolder"
              >加入文件夹</el-dropdown-item>
              <div
                v-if="
                  currUserInfo.companyRole === 2 ||
                    currUserInfo.companyRole === 3 ||
                    currUserInfo.companyRole === 4
                "
              >
                <!-- <el-dropdown-item
                  command="editPosition"
                >编辑职位</el-dropdown-item> -->
                <el-dropdown-item
                  v-if="renderInfo.statusNo === 3"
                  command="changeStatus"
                >结束招聘</el-dropdown-item>
                <el-dropdown-item
                  v-else
                  command="changeStatus"
                >重新开启</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- tab切换 -->
      <el-tabs v-model="tab" class="common-position-tab">
        <el-tab-pane
          :label="'候选人（' + renderInfo.recommendCount + '）'"
          name="resume"
        >
          <span
            slot="label"
          ><span class="detail-link" @click="lookDetail">职位详情</span>
            候选人</span>
          <resume-list
            v-if="tab === 'resume'"
            :position-info="positionInfo"
            :tab="orderTab"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="
            currUserInfo.companyRole === 3 || currUserInfo.companyRole === 4
          "
          label="招聘渠道"
          name="set"
        >
          <job-set v-if="tab === 'set'" :position-info="positionInfo" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionInfo.id"
    >
      <position-detail
        slot="inner-body"
        :is-new-window="false"
        :position-id="positionInfo.id"
      />
    </drawer-common>
    <!-- 单个文件夹 -->
    <single-folder
      ref="modalSingleFolder"
      :company-folder-type="1"
    ></single-folder>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import drawerCommon from '@/components/common/drawerCommon';
import positionDetail from './positionDetail';
import singleFolder from '@/components/folder/singleFolder';
import resumeList from '@/views/order/candidate/company/list';
import jobSet from './jobDetailTab/jobSet';
import { getPositionDetailById, editPositionStatus } from '@/api/position';
export default {
  components: {
    drawerCommon,
    positionDetail,
    singleFolder,
    resumeList,
    jobSet
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
    };
  },
  computed: {
    ...mapState({
      currUserInfo: (state) => {
        return state.userInfo;
      }
    }),
    selectedData() {
      return this.$store.state.common.selectedData;
    },
    dictData() {
      return this.$store.state.common.dictData;
    },
    // 渲染的职位信息
    renderInfo() {
      const data = Object.assign({}, this.positionInfo);
      return data;
    }
  },
  mounted() {
    // 查询职位信息
    this.queryPositionInfo();
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
        case 'editPosition':
          this.editPosition();
          break;
        case 'changeStatus':
          this.changeStatus();
          break;
      }
    },
    // 加入文件夹
    addFolder() {
      this.$refs.modalSingleFolder.edit({ fileId: this.renderInfo.id });
      this.$refs.modalSingleFolder.title = '加入文件夹';
    },
    // 编辑职位
    editPosition() {
      this.$router.push({
        name: 'releasePosition',
        query: { positionId: this.renderInfo.id }
      });
    },
    // 切换职位状态
    changeStatus() {
      // 对上架进行认证状态判断
      if (this.renderInfo.statusNo === 4) {
        if (
          this.currUserInfo.companyCertificationStatus === 0 ||
          this.currUserInfo.companyCertificationStatus === 3
        ) {
          this.$confirm(
            '根据平台用户规则，您需要预先完成企业信息认证才可以上架职位',
            '企业未认证',
            {
              type: 'warning',
              confirmButtonText: '立即认证'
            }
          )
            .then(() => {
              this.$router.push('/certification');
            })
            .catch(() => {});
          return;
        }
        if (this.currUserInfo.companyCertificationStatus === 2) {
          this.$alert(
            '您的企业信息正在认证中，认证通过后即可上架企业职位',
            '企业认证中',
            {
              type: 'warning'
            }
          ).then(() => {});
          return;
        }
      }
      this.$confirm(
        this.renderInfo.statusNo === 3
          ? '结束招聘该职位后，候选人将无法再查看职位的信息'
          : '重新开启该职位后，候选人将可以继续查看职位的信息',
        this.renderInfo.statusNo === 3 ? '结束招聘提示' : '重新开启提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          const para = {};
          para.id = this.renderInfo.id;
          para.statusNo = this.renderInfo.statusNo === 3 ? 4 : 3;
          editPositionStatus(para).then((res) => {
            this.$set(this.positionInfo, 'statusNo', para.statusNo);
          });
        })
        .catch(() => {});
    },
    // 查询职位信息
    queryPositionInfo() {
      const para = {};
      para.id = this.positionInfo.id;
      getPositionDetailById(para).then((res) => {
        this.positionInfo = res.data;
        document.title = this.positionInfo.title + '-大猎英才';
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/position/common.scss";
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
    .el-breadcrumb {
      padding: 8px 20px;
      background-color: #f7f7f7;
    }
    .position-info {
      padding: 20px;
      background-color: #fff;
      position: relative;
      .info-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .title-name {
          font-size: 18px;
          font-weight: bold;
          color: #282c32;
          cursor: pointer;
          margin-right: 16px;
        }
        .title-id {
          font-size: 12px;
          color: #282c32;
          margin-right: 16px;
        }
        .title-tag {
          margin-right: 12px;
        }
      }
      .info-body {
        display: flex;
        .body-item {
          margin-right: 120px;
          &:last-child {
            margin-right: 0;
          }
          .item-label {
            font-size: 14px;
            color: #c3c7cd;
            margin-bottom: 12px;
          }
          .item-value {
            font-size: 14px;
            color: #4c5967;
          }
        }
      }
      .info-btn {
        position: absolute;
        right: 16px;
        top: 16px;
        .el-button {
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
        background-color: #f9fafb;
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

