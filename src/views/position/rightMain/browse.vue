<template>
  <div class="wrap">
    <!-- 标题栏 -->
    <div class="title-bar">
      <p>今日已浏览{{ todayBrowseNum }}个职位（只保存最近七天的浏览记录）</p>
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
  getPositionBrowseRecord,
  getPositionTodayBrowseNum
} from '@/api/position'
export default {
  components: {
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  data() {
    return {
      // 查询条件
      queryForm: {
        day: 7
      },
      // 今日已浏览职位数量
      todayBrowseNum: 0
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
    document.title = '最近浏览-大猎英才'
    // 查询今日已浏览职位数量
    this.searchTodayBrowseNum()
  },
  methods: {
    // 查询今日已浏览职位数量
    searchTodayBrowseNum() {
      const para = {}
      getPositionTodayBrowseNum(para).then(res => {
        if (JSON.stringify(res.data) === '{}') {
           this.todayBrowseNum = 0
        } else {
           this.todayBrowseNum = res.data
        }
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      getPositionBrowseRecord(para).then(res => {
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
  .title-bar {
    padding: 12px 20px;
    font-size: 18px;
    color: #808080ff;
    margin-bottom: 20px;
  }
}
</style>

