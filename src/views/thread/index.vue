<template>
  <div class="list-visitor">
    <el-tabs v-model="activeName" size="small" @tab-click="handleTab">
      <el-tab-pane name="visitor">
        <span slot="label">
          直接访客
          <el-badge v-if="total1" type="info" :value="total1" size="small"></el-badge>
        </span>
        <!-- 操作 -->
        <visitor-operation :export-query="query1" @searchTable1="searchTable1" />
        <!-- table -->
        <visitor-table
          :visitor-data="visitorData"
          :list-loading="listLoading1"
          @searchTable1="searchTable1"
        />
        <!-- 分页 -->
        <pagination
          v-show="total1>0"
          :total="total1"
          :page.sync="pageNumber1"
          :limit.sync="pageSize1"
          @pagination="getCluesByUserId"
        />
      </el-tab-pane>
      <el-tab-pane name="recommend">
        <span slot="label">
          转介绍
          <el-badge v-if="total2" type="info" :value="total2" size="small"></el-badge>
        </span>
        <!-- 操作 -->
        <recommend-operation :export-query="query2" @searchTable2="searchTable2" />
        <!-- table -->
        <recommend-table :recommend-data="recommendData" :list-loading="listLoading2" />
        <!-- 分页 -->
        <pagination
          v-show="total2>0"
          :total="total2"
          :page.sync="pageNumber2"
          :limit.sync="pageSize2"
          @pagination="getCluesByUserId1"
        />
      </el-tab-pane>
      <el-tab-pane v-if="false" name="resume">
        <span slot="label">
          投递简历
          <el-badge v-if="total3" type="info" :value="total3" size="small"></el-badge>
        </span>
        <!-- 操作 -->
        <resume-operation @searchTable3="searchTable3" />
        <!-- table -->
        <resume-table :resume-data="resumeData" :list-loading="listLoading3" @reload="reload" />
        <!-- 分页 -->
        <pagination
          v-show="total3>0"
          :total="total3"
          :page.sync="pageNumber3"
          :limit.sync="pageSize3"
          @pagination="getCluesDTOPage"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import visitorOperation from '@/components/thread/listVisitor/operation.vue'
import visitorTable from '@/components/thread/listVisitor/table.vue'
import recommendOperation from '@/components/thread/listRecommend/operation.vue'
import recommendTable from '@/components/thread/listRecommend/table.vue'
import resumeOperation from '@/components/thread/listResume/operation.vue'
import resumeTable from '@/components/thread/listResume/table.vue'
import pagination from '@/components/adminStyle/pagination.vue'
import {
  getCluesByUserId,
  getCluesByUserId1,
  getCluesDTOPage
} from '@/api/thread'

export default {
  components: {
    visitorOperation,
    visitorTable,
    recommendOperation,
    recommendTable,
    resumeOperation,
    resumeTable,
    pagination
  },
  data() {
    return {
      activeName: 'visitor',
      pageNumber1: 1,
      pageSize1: 10,
      pageSizes1: [10, 20, 50, 100],
      total1: 0,
      query1: {
        type: this.$route.query.type && this.$route.query.type + '',
        positionId:
          this.$route.query.positionId && this.$route.query.positionId - 0,
        hhUserIds: this.$route.query.userId && [this.$route.query.userId],
        labelIds: []
      }, // 参数
      visitorData: [],
      pageNumber2: 1,
      pageSize2: 10,
      pageSizes2: [10, 20, 50, 100],
      total2: 0,
      query2: {}, // 参数
      recommendData: [],
      pageNumber3: 1,
      pageSize3: 10,
      pageSizes3: [10, 20, 50, 100],
      total3: 0,
      query3: {}, // 参数
      resumeData: [],
      listLoading1: false,
      listLoading2: false,
      listLoading3: false
    }
  },
  mounted() {
    this.getCluesByUserId()
  },
  methods: {
    handleTab(e) {
      if (e.name === 'visitor') {
        this.getCluesByUserId()
      } else if (e.name === 'recommend') {
        this.getCluesByUserId1()
      } else {
        this.getCluesDTOPage()
      }
    },
    // 直接访客
    getCluesByUserId() {
      this.listLoading1 = true
      const { pageNumber1: pageNumber, pageSize1: pageSize } = this
      const {
        startDate,
        endDate,
        type,
        haveMobile,
        positionId,
        hhUserIds,
        labelIds
      } = this.query1
      const params = {
        pageNumber,
        pageSize,
        startDate,
        endDate,
        type,
        haveMobile,
        positionId,
        hhUserIds,
        labelIds
      }
      getCluesByUserId(params).then(res => {
        this.listLoading1 = false
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          this.visitorData = records
          this.total1 = total
        }
      })
    },
    // 转介绍
    getCluesByUserId1() {
      this.listLoading2 = true
      const { pageNumber2: pageNumber, pageSize2: pageSize } = this
      const { startDate, endDate, positionId, hhUserIds } = this.query2
      const params = {
        pageNumber,
        pageSize,
        startDate,
        endDate,
        positionId,
        hhUserIds
      }
      getCluesByUserId1(params).then(res => {
        this.listLoading2 = false
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          this.recommendData = records
          this.total2 = total
        }
      })
    },
    // 简历列表
    getCluesDTOPage() {
      this.listLoading3 = true
      const { pageNumber3: pageNumber, pageSize3: pageSize } = this
      const {
        statusNo,
        applyUserType,
        applyStartTime,
        applyEndTime,
        positionId,
        hhUserIds
      } = this.query3
      const params = {
        pageNumber,
        pageSize,
        statusNo,
        applyUserType,
        applyStartTime,
        applyEndTime,
        positionId,
        hhUserIds
      }
      getCluesDTOPage(params)
        .then(res => {
          this.listLoading3 = false
          const { code, data } = res
          if (code === '000000') {
            const { records, total } = data
            records.forEach(item => {
              item.isLook = false
              item.hideMobile = item.mobile
                ? item.mobile.slice(0, 3) + '****' + item.mobile.slice(-4)
                : ''
              item.hideEmail = item.email
                ? item.email.slice(0, 3) + '****' + item.email.slice(7)
                : ''
            })
            this.resumeData = records
            this.total3 = total
          }
        })
        .catch(err => {
          this.listLoading3 = false
          console.log(err)
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 查询
    searchTable1(e) {
      console.log(e)
      this.query1 = e || this.query1
      this.getCluesByUserId()
    },
    // 查询
    searchTable2(e) {
      this.query2 = e
      this.getCluesByUserId1()
    },
    // 查询
    searchTable3(e) {
      this.query3 = e
      this.getCluesDTOPage()
    },
    // 刷新
    reload() {
      this.getCluesDTOPage()
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/index.scss';
</style>
