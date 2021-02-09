<template>
  <div class="wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <span class="result">
        <select-picker
          ref="workCityId"
          key-name="workCityId"
          placeholder="城市"
          :default-value="queryForm.workCityId"
          :data-source="dictData.areas"
          :first-tab-name="dictData.areas[0].value"
          :max-number="1"
          :level-number="2"
          @afterClose="searchList"
        />
        <select-picker-three
          ref="functionType"
          key-name="functionType"
          placeholder="职能"
          :default-value="queryForm.functionType"
          :data-source="dictData.functions"
          :first-tab-name="dictData.functions[0].value"
          @afterClose="searchList"
        />
        <el-select v-model="queryForm.statusNo" placeholder="职位状态" clearable @change="searchList">
          <el-option
            v-for="item in dictData.dicts.positionStatus"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <el-select v-model="queryForm.updateType" placeholder="更新时间" clearable @change="searchList">
          <el-option
            v-for="item in dictData.dicts.positionUpdateType"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
      </span>
      <div class="form">
        <el-input
          v-model="queryForm.searchName"
          placeholder="搜索职位/公司"
          autocomplete="off"
          clearable
        />
        <el-button type="primary" size="mini" @click="searchList">
          <i class="el-icon-search" />
        </el-button>
      </div>
    </div>
    <!-- 职位列表 -->
    <div class="list-area">
      <div class="list-item">
        <div class="item-body">
          <el-table
            ref="dataTable"
            v-loading="loading"
            class="data-table"
            :data="dataTableObj.list"
            :height="600"
            size="medium"
            stripe
            border
          >
            <el-table-column label="职位" align="center" width="183" show-overflow-tooltip>
              <template slot-scope="scope">
                <p
                  class="position-name ellipsis"
                  @click="toDetail(`/positionDetail?positionId=${scope.row.id}`)"
                >{{ scope.row.title }}</p>
                <p
                  class="company-name ellipsis"
                  @click="toDetail(`/companyDetail?tab=companyDescription&companyId=${scope.row.companyId}`)"
                >{{ scope.row.shortName }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="workCityId"
              label="城市"
              align="center"
              width="90"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.workCityId | filterLevel2(dictData.areas) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="佣金" align="center" width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <p class="money-name">
                  {{ scope.row.commissionAmount }}
                  <span
                    v-if="scope.row.commissionSettlementType === 1"
                  >（{{ scope.row.commissionRatio }}）%</span>
                </p>
                <p class="money-name">{{ `分成：${scope.row.hhCommissionRatio}%` }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="statusNo"
              label="职位状态"
              align="center"
              width="90"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.statusNo | filterCommonDict(dictData.dicts.positionStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进度" align="center" width="350" show-overflow-tooltip>
              <el-table-column
                prop="recommendedCount"
                label="推荐"
                align="center"
                width="70"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p
                    class="order-num"
                    @click="toOrder(`/order/recommendStage?positionId=${scope.row.id}`)"
                  >{{ scope.row.recommendedCount ? scope.row.recommendedCount : '-' }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="interviewCount"
                label="面试"
                align="center"
                width="70"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p
                    class="order-num"
                    @click="toOrder(`/order/interviewStage?positionId=${scope.row.id}`)"
                  >{{ scope.row.interviewCount ? scope.row.interviewCount : '-' }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="offerCount"
                label="offer"
                align="center"
                width="70"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p
                    class="order-num"
                    @click="toOrder(`/order/offerStage?positionId=${scope.row.id}`)"
                  >{{ scope.row.offerCount ? scope.row.offerCount : '-' }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="singleCount"
                label="到岗"
                align="center"
                width="70"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p
                    class="order-num"
                    @click="toOrder(`/order/entryStage?positionId=${scope.row.id}`)"
                  >{{ scope.row.singleCount ? scope.row.singleCount : '-' }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="overInsuranceCount"
                label="过保"
                align="center"
                width="70"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p
                    class="order-num"
                    @click="toOrder(`/order/overProtectionStage?positionId=${scope.row.id}`)"
                  >{{ scope.row.overInsuranceCount ? scope.row.overInsuranceCount : '-' }}</p>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button
                  class="confirm-btn"
                  :disabled="scope.row.statusNo !== 3"
                  @click="toDetail(`/recommendResume?positionId=${scope.row.id}`)"
                >推荐</el-button>
                <el-popover placement="bottom-end" trigger="click">
                  <div class="item">
                    <el-button type="text" @click="recommendCheck(scope.row)">推荐查重</el-button>
                  </div>
                  <div v-if="scope.row.statusNo === 3" class="item">
                    <el-button type="text" @click="sharerPosition(scope.row)">邀请猎头</el-button>
                  </div>
                  <div class="item">
                    <el-button type="text" @click="cancelOrder(scope.row.id)">取消接单</el-button>
                  </div>
                  <i slot="reference" class="more-operate icon iconfont icon-zhiwei-quanbuzhiwei6" />
                </el-popover>
              </template>
            </el-table-column>
            <!-- 列表为空 -->
            <div v-show="!loading" slot="empty">
              <div
                v-if="(!selectedData.workCityId || !selectedData.workCityId[0]) && (!selectedData.functionType || !selectedData.functionType[0]) && !queryForm.statusNo && !queryForm.updateType && !queryForm.searchName"
                class="empty-area"
              >
                <img src="@/assets/images/position/psition_empty.png" />
                <p>您还没有接取过职位</p>
                <el-button class="confirm-btn" @click="toOrder('/position/all')">⽴即接单</el-button>
              </div>
              <div v-else class="empty-area">
                <img src="@/assets/images/position/psition_empty.png" />
                <p>抱歉，未能找到相关的职位或企业</p>
              </div>
            </div>
          </el-table>
        </div>
      </div>
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
    <!-- 推荐查重模态框 -->
    <recommend-check ref="modalForm" />
    <!-- 分享职位模态框 -->
    <share-position ref="modalShare" />
  </div>
</template>

<script>
import recommendCheck from '../modules/recommendCheck'
import sharePosition from '../modules/sharePosition'
import { TableMixin } from '@/mixins/position'
import selectPicker from '@/components/common/selectPicker'
import selectPickerThree from '@/components/common/selectPickerThree'
import { getPositionOrderRecordByUserId, cancelOrderById } from '@/api/position'
export default {
  components: {
    recommendCheck,
    sharePosition,
    selectPicker,
    selectPickerThree
  },
  mixins: [TableMixin],
  data() {
    return {
      // 查询条件
      queryForm: {
        workCityId: [],
        functionType: [],
        statusNo: '',
        updateType: '',
        searchName: ''
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
    document.title = '我的接单-大猎英才'
  },
  methods: {
    // 跳转详情页
    toDetail(url) {
      window.open(url)
    },
    // 跳转订单页
    toOrder(url) {
      this.$router.push(url)
    },
    // 推荐查重
    recommendCheck(row) {
      this.$refs.modalForm.edit(row)
    },
    // 分享职位
    sharerPosition(row) {
      this.$refs.modalShare.edit(row)
    },
    // 取消接单
    cancelOrder(id) {
      this.$confirm('是否取消接单', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {}
          para.id = id
          cancelOrderById(para).then(res => {
            this.searchList()
          })
        })
        .catch(() => {})
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      // 城市
      const workCityId = this.selectedData.workCityId
      if (workCityId && workCityId.length) {
        para.workCityId = workCityId[0]
      } else {
        para.workCityId = ''
      }
      // 职能
      const functionType = this.selectedData.functionType
      if (functionType && functionType.length) {
        const index = functionType[0].length / 3
        para[`functionType${index}`] = functionType[0]
      }
      delete para.functionType
      getPositionOrderRecordByUserId(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .search-bar {
    display: flex;
    width: 100%;
    height: 30px;
    margin-bottom: 20px;
    justify-content: space-between;
    .result {
      display: flex;
      justify-content: space-between;
      flex: auto;
      ::v-deep .diy-select {
        width: 120px;
        border-radius: 15px;
        overflow: hidden;
        .diy-input input {
          height: 30px;
          line-height: 30px;
          border: none;
          font-size: 14px;
          padding: 0 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-icon-caret-bottom {
          right: 10px;
          top: 8px;
        }
        .el-icon-circle-close {
          right: 6px;
          top: 6px;
        }
      }
      .el-select {
        width: 120px;
        border-radius: 15px;
        overflow: hidden;
        ::v-deep .el-input__inner {
          height: 30px;
          line-height: 30px;
          border: none;
        }
        ::v-deep .el-input__suffix {
          background-color: #edededff;
          right: 0;
        }
        ::v-deep .el-input__icon {
          width: 30px;
          line-height: 30px;
          color: #000000ff;
        }
      }
    }
    .form {
      display: flex;
      width: 240px;
      margin-left: 90px;
      justify-content: space-between;
      align-items: stretch;
      height: 100%;
      background-color: #fff;
      border-radius: 20px;
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
        background-color: $main-color;
        border: none;
        border-radius: 0;
      }
    }
  }
  .item-body {
    .data-table {
      width: 1000px;
      ::v-deep .el-table__header-wrapper,
      ::v-deep .el-table__fixed-right {
        .el-table__header {
          th {
            font-size: 16px;
            color: #000000d9;
            background: transparent;
          }
        }
      }
      .position-name {
        cursor: pointer;
        font-size: 14px;
        color: #000000d9;
        font-weight: bold;
        text-align: left;
      }
      .company-name {
        cursor: pointer;
        font-size: 12px;
        color: #9a9a9aff;
        text-align: left;
      }
      .money-name {
        color: $red-color;
      }
      .order-num {
        cursor: pointer;
      }
      .el-button {
        float: left;
      }
      .more-operate {
        float: right;
      }
    }
  }
}
</style>

