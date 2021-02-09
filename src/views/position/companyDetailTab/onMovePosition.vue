<template>
  <div class="wrap">
    <!-- 地址搜索 -->
    <div v-if="companyPositionAddress.length" class="class-search address-search">
      <span class="title">地点</span>
      <span class="result">
        <el-link
          v-for="item in companyPositionAddress"
          :key="item.value"
          :underline="false"
          :class="{active: queryForm.workCityId.indexOf(item.value) !== -1}"
          @click="handleSelectAddress(item.value)"
        >{{ item.label }}</el-link>
      </span>
    </div>
    <!-- 职能搜索 -->
    <div v-if="companyPositionFunctionType.length" class="class-search profession-search">
      <span class="title">职能</span>
      <span class="result">
        <el-link
          v-for="item in companyPositionFunctionType"
          :key="item.value"
          :underline="false"
          :class="{active: queryForm.functionType.indexOf(item.value) !== -1}"
          @click="handleSelectFunctionType(item.value)"
        >{{ item.label }}</el-link>
      </span>
    </div>
    <!-- 排序 -->
    <div class="sort-bar">
      <el-select v-model="queryForm.sortType" placeholder="排序" clearable @change="handleChangeSort">
        <el-option
          v-for="item in dictData.dicts.positionSort"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span class="total-num">共 {{ dataTableObj.total > 200 ? '200+' : dataTableObj.total }} 职位</span>
      <div class="form">
        <el-input
          v-model="queryForm.searchName"
          placeholder="请输入关键词查询"
          autocomplete="off"
          clearable
        />
        <el-button type="primary" size="mini" @click="searchList()">
          <i class="el-icon-search" />
        </el-button>
      </div>
    </div>
    <!-- 职位列表 -->
    <div v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-body">
          <position-item :position-info="item" @lookDetail="lookDetail" />
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
import positionItem from '../common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
import {
  getPositionList,
  getCompanyPositionAddress,
  getCompanyPositionFunctionType
} from '@/api/position'
export default {
  components: {
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  props: {
    // 公司信息
    companyInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 企业职位地点
      companyPositionAddress: [],
      // 企业职位职能
      companyPositionFunctionType: [],
      // 查询条件
      queryForm: {
        companyIds: [this.companyInfo.id],
        workCityId: [],
        functionType: [],
        searchName: '',
        sortType: '0'
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
    // 查询企业职位地点
    this.queryCompanyPositionAddress()
    // 查询企业职位职能
    this.queryCompanyPositionFunctionType()
  },
  methods: {
    // 查询企业职位地点
    queryCompanyPositionAddress() {
      const para = {}
      para.companyId = this.companyInfo.id
      getCompanyPositionAddress(para).then(res => {
        this.companyPositionAddress = res.data
      })
    },
    // 查询企业职位职能
    queryCompanyPositionFunctionType() {
      const para = {}
      para.companyId = this.companyInfo.id
      getCompanyPositionFunctionType(para).then(res => {
        this.companyPositionFunctionType = res.data
      })
    },
    // 选择地点
    handleSelectAddress(value) {
      if (this.queryForm.workCityId.indexOf(value) !== -1) {
        this.queryForm.workCityId = []
      } else {
        this.queryForm.workCityId = [value]
      }
      this.searchList()
    },
    // 选择职能
    handleSelectFunctionType(value) {
      if (this.queryForm.functionType.indexOf(value) !== -1) {
        this.queryForm.functionType = []
      } else {
        this.queryForm.functionType = [value]
      }
      this.searchList()
    },
    // 切换排序方式
    handleChangeSort() {
      this.searchList()
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      // 城市
      para.workCityId = para.workCityId.join(',')
      // 职能
      const functionType = para.functionType.join(',')
      if (functionType) {
        const index = functionType.length / 3
        para[`functionType${index}`] = functionType
      }
      delete para.functionType
      getPositionList(para).then(res => {
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
  .class-search {
    font-size: 14px;
    padding: 3px 0;
    align-content: center;
    display: flex;
    .title {
      color: #808080ff;
      width: 60px;
      margin: 5px 0;
      flex: none;
    }
    .result {
      flex: auto;
      .el-link {
        display: inline-block;
        padding: 2px 10px;
        font-size: 14px;
        border-radius: 13px;
        margin: 3px 5px 5px 0;
        &.active {
          background-color: #dadadaff;
          color: #323232ff;
          font-weight: bold;
        }
      }
    }
    &.profession-search {
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
  }
  .sort-bar {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
    .el-select {
      width: 110px;
      ::v-deep .el-input__inner {
        height: 30px;
        line-height: 30px;
        border: none;
        margin: 5px 0;
        border-radius: 15px;
      }
      ::v-deep .el-input__suffix {
        right: 0;
      }
      ::v-deep .el-input__icon {
        width: 30px;
        line-height: 30px;
        color: #000000ff;
      }
    }
    .total-num {
      font-size: 14px;
      color: #323232ff;
      flex: auto;
      padding: 0 40px;
    }
    .form {
      display: flex;
      width: 240px;
      justify-content: space-between;
      align-items: stretch;
      height: 30px;
      background-color: #fff;
      border-radius: 20px;
      margin: 5px 0;
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
}
</style>

