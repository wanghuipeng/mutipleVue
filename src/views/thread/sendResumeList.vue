<template>
  <div class="sendResume">
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
  </div>
</template>

<script>
import resumeOperation from '@/components/thread/listResume/operation.vue'
import resumeTable from '@/components/thread/listResume/table.vue'
import pagination from '@/components/adminStyle/pagination.vue'
import { getCluesDTOPage } from '@/api/thread'
export default {
  components: {
    resumeOperation,
    resumeTable,
    pagination
  },
  data() {
    return {
      pageNumber3: 1,
      pageSize3: 10,
      pageSizes3: [10, 20, 50, 100],
      total3: 0,
      query3: {}, // 参数
      resumeData: [],
      listLoading3: false
    }
  },
  mounted() {
    this.getCluesDTOPage()
  },
  methods: {
    // 简历列表
    getCluesDTOPage() {
      this.listLoading3 = true
      const { pageNumber3: pageNumber, pageSize3: pageSize } = this
      const { statusNo, applyUserType, applyStartTime, applyEndTime, positionId, hhUserIds } = this.query3
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
      getCluesDTOPage(params).then(res => {
        this.listLoading3 = false
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          records.forEach(item => {
            item.isLook = false
            item.hideMobile = item.mobile ? item.mobile.slice(0, 3) + '****' + item.mobile.slice(-4) : ''
            item.hideEmail = item.email ? item.email.slice(0, 3) + '****' + item.email.slice(7) : ''
            item.experiences = item.experiences && item.experiences.length > 0 ? item.experiences.slice(0, 2) : []
            if (item.educations && item.educations.length > 0) {
              // item.educations[0].startDate = item.educations[0].startDate && item.educations[0].startDate.split('-')[0]
              // item.educations[0].endDate = item.educations[0].endDate && item.educations[0].endDate.split('-')[0]
              // item.educations[0].startToEndDate = item.educations[0].startToEndDate
            }
          })
          this.resumeData = records
          this.total3 = total
        }
      }).catch(err => {
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
.sendResume {
  padding-top: 16px;
}
</style>
