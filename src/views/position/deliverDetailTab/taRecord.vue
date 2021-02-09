<template>
  <div class="wrap">
    <!-- 职位动态 -->
    <div v-loading="loading" class="timeline">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in dataTableObj.list"
          :key="index"
          :timestamp="item.updateDate"
          placement="top"
        >
          <div class="info">
            <p class="title">推荐了职位『{{ item.title }}』</p>
            <p class="content">{{ item.positionAnnouncement }}</p>
            <div class="position">
              <position-item :position-info="item" @lookDetail="lookDetail" />
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
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
import { getPositionList } from '@/api/position'
export default {
  components: {
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  props: {
    // 分析师信息
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 查询条件
      queryForm: {
        dockPmId: this.userInfo.id,
        boutique: 1
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
  mounted() {},
  methods: {
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
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
  .timeline {
    .el-timeline-item {
      margin-left: 100px;
    }
    ::v-deep .el-timeline-item__tail {
      border-left: 2px dashed #ccc;
    }
    ::v-deep .el-timeline-item__node {
      width: 14px;
      height: 14px;
      border: 2px solid #ccc;
      background-color: #fff;
      left: 20px;
    }
    ::v-deep .el-timeline-item__wrapper {
      position: static;
      padding-left: 50px;
    }
    ::v-deep .el-timeline-item__timestamp.is-top {
      font-size: 15px;
      color: #4d4d4dff;
      width: 110px;
      line-height: 30px;
      margin: 0;
      padding: 0;
      position: absolute;
      left: -100px;
      top: -6px;
    }
    .title {
      font-size: 15px;
      color: #323232ff;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .content {
      font-size: 14px;
      color: #808080ff;
      margin-bottom: 12px;
    }
    .position{
      background-color: #fff;
    }
  }
}
</style>

