<template>
  <div class="wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <span class="result">
        <el-select
          v-model="queryForm.operateType"
          placeholder="职位动态"
          clearable
          @change="searchList"
        >
          <el-option
            v-for="item in dictData.dicts.recordType"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <el-checkbox v-model="queryForm.contactMe" @change="searchList">与我相关</el-checkbox>
      </span>
      <div class="form">
        <el-input
          v-model="queryForm.serachName"
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
    <div v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-body">
          <el-tag
            effect="dark"
            class="status-tag"
            :class="(item.operateType === 1) ? 'blue' : (([2, 4, 6].indexOf(item.operateType) !== -1) ? 'green' : 'red')"
          >{{ item.operateType | filterCommonDict(dictData.dicts.recordType) }}</el-tag>
          <div class="position-item">
            <div class="item-body">
              <div class="position-info">
                <p class="date">{{ item.createTime }}</p>
                <el-link
                  :underline="false"
                  class="name"
                  @click="toPositionDetail(`/positionDetail?positionId=${item.positionId}`)"
                >{{ item.title }} — {{ item.companyName }}</el-link>
                <p class="des">{{ item.operateDescribe }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表为空 -->
    <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
      <img src="@/assets/images/position/psition_empty.png" />
      <p>暂⽆相关订单动态</p>
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
</template>

<script>
import { TableMixin } from '@/mixins/position'
import { getPositionOpeationLogList } from '@/api/position'
export default {
  components: {},
  mixins: [TableMixin],
  data() {
    return {
      // 查询条件
      queryForm: {
        operateType: '',
        contactMe: false,
        serachName: ''
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
    document.title = '职位动态-大猎英才'
  },
  methods: {
    // 跳转职位详情页
    toPositionDetail(url) {
      window.open(url)
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      getPositionOpeationLogList(para).then(res => {
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
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    justify-content: space-between;
    .result {
      flex: auto;
      .el-select {
        width: 120px;
        border-radius: 15px;
        overflow: hidden;
        vertical-align: middle;
        margin-right: 30px;
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
      .el-checkbox {
        ::v-deep .el-checkbox__inner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          &::after {
            left: 6px;
            top: 3px;
          }
        }
        ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: $main-color;
          border-color: $main-color;
        }
        ::v-deep .el-checkbox__label {
          vertical-align: top;
          color: #343434ff;
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
    .status-tag {
      border: none;
      border-radius: 0 8px 0 8px;
      height: 25px;
      line-height: 26px;
      background: transparent;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      &.blue {
        border: 1px solid $main-color;
        color: $main-color;
      }
      &.grey {
        border: 1px solid $grey-color;
        color: $grey-color;
      }
      &.green {
        border: 1px solid $green-color;
        color: $green-color;
      }
      &.red {
        border: 1px solid $red-color;
        color: $red-color;
      }
    }
    .position-item {
      display: block;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      &:hover {
        box-shadow: 2px 4px 30px 0 rgba(0, 0, 0, 0.07);
      }
      .item-body {
        .position-info {
          .date {
            font-size: 14px;
            color: #7f7f7fff;
            margin-bottom: 10px;
          }
          .name {
            font-size: 17px;
            color: #323232ff;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .des {
            font-size: 14px;
            color: #7f7f7fff;
          }
        }
      }
    }
  }
}
</style>

