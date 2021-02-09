<template>
  <div class="app-container">
    <el-card shadow="never">
      <p class="title">线索趋势统计</p>

      <!-- 筛选 -->
      <div class="filter-container">
        <span class="filter-item filter-lable">日期</span>
        <el-date-picker
          v-model="listQuery.date"
          class="filter-item"
          type="daterange"
          size="small"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
        <span class="filter-item filter-lable">统计单位</span>
        <el-select v-model="listQuery.type" placeholder="按人数" clearable style="width: 140px" class="filter-item" size="small">
          <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-button :loading="downloadLoading" class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
          生成报表
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="text" size="small" @click="handleReset">
          重置
        </el-button>
      </div>

      <div ref="main" class="echarts"></div>

      <!-- 表格 -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        show-summary
        fit
        highlight-current-row
        style="width: 100%;"
        class="table"
        @sort-change="sortChange"
      >
        <el-table-column label="日期" prop="browseDate" sortable="custom" align="center" />
        <el-table-column label="浏览" prop="browseUserCount" align="center" />
        <el-table-column label="投简历" prop="interestedUserCount" align="center" />
        <el-table-column label="问一问" prop="contactedUserCount" align="center" />
        <el-table-column label="转发分享" prop="shareUserCount" align="center" />
        <el-table-column label="推荐好友" prop="recommendCount" align="center" />
      </el-table>

      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/utils/common'
import { getDayHhShareBrowseDateStatistical } from '@/api/statistics'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date: '',
        type: '1',
        sort: '2'
      },
      typeOptions: [{ label: '按人数', key: '1' }, { label: '按次数', key: '2' }],
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      setOption: {
        // title: {
        //   text: '折线图'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['浏览', '投简历', '问一问', '转发分享', '推荐好友']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0
        },
        series: [
          {
            name: '浏览',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '投简历',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '问一问',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '转发分享',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '推荐好友',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      companyId: state => state.userInfo.companyId
    })
  },
  mounted() {
    document.title = '线索趋势-大猎英才'
    this.initData()
    this.getCharts()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const start = this.listQuery.date.length > 0 && this.listQuery.date[0]
      const end = this.listQuery.date.length > 0 && this.listQuery.date[1]
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit,
        lastBrowseStartTime: start,
        lastBrowseEndTime: end,
        statisticType: this.listQuery.type,
        orderByType: 1,
        orderByValue: this.listQuery.sort,
        companyId: this.companyId
      }
      getDayHhShareBrowseDateStatistical(params).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    getCharts() {
      const start = this.listQuery.date.length > 0 && this.listQuery.date[0]
      const end = this.listQuery.date.length > 0 && this.listQuery.date[1]
      const params = {
        lastBrowseStartTime: start,
        lastBrowseEndTime: end,
        statisticType: this.listQuery.type,
        companyId: this.companyId
      }
      this.setOption.xAxis.data = this.formatEveryDay(start.split(' ')[0], end.split(' ')[0])
      getDayHhShareBrowseDateStatistical(params).then(res => {
        const list = res.data.records
        const days = this.setOption.xAxis.data
        const browseUserCount = []
        const interestedUserCount = []
        const contactedUserCount = []
        const shareUserCount = []
        const recommendCount = []
        days.forEach((item, index) => {
          browseUserCount.push(0)
          interestedUserCount.push(0)
          contactedUserCount.push(0)
          shareUserCount.push(0)
          recommendCount.push(0)
          list.forEach(items => {
            if (item === items.browseDate) {
              browseUserCount[index] = items.browseUserCount
              interestedUserCount[index] = items.interestedUserCount
              contactedUserCount[index] = items.contactedUserCount
              shareUserCount[index] = items.shareUserCount
              recommendCount[index] = items.recommendCount
            }
          })
        })
        this.setOption.series[0].data = browseUserCount
        this.setOption.series[1].data = interestedUserCount
        this.setOption.series[2].data = contactedUserCount
        this.setOption.series[3].data = shareUserCount
        this.setOption.series[4].data = recommendCount
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.main, 'light')
        // 绘制图表，this.setOption是数据
        myChart.setOption(this.setOption)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCharts()
      this.getList()
    },
    handleReset() {
      this.initData()
      this.getCharts()
      this.getList()
    },
    // 初始化数据
    initData() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.listQuery.date = [formatDate(start, 'yyyy-MM-dd hh:mm:ss'), formatDate(end, 'yyyy-MM-dd hh:mm:ss')]
      this.listQuery.type = '1'
      this.listQuery.sort = '2'
    },
    formatEveryDay(start, end) {
      const dateList = []
      var startTime = this.getDate(start)
      var endTime = this.getDate(end)
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear();
        var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
        var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateList.push(year + '-' + month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateList
    },
    getDate(datestr) {
      var temp = datestr.split('-')
      var date = new Date(temp[0], temp[1] - 1, temp[2])
      return date
    },
    // 排序
    sortChange(data) {
      const { prop, order } = data
      console.log(data)
      if (prop === 'browseDate') {
        if (order === 'ascending') {
          this.listQuery.sort = '1'
        } else {
          this.listQuery.sort = '2'
        }
        this.handleFilter()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color:#14171A;
    line-height: 22px;
    margin-bottom: 20px;
  }
  .filter-container {
    padding-bottom: 10px;
    .filter-lable {
      font-size: 12px;
      margin-right: 10px;
    }
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px 10px 0;
    }
  }
  .echarts {
    width: 100%;
    height: 300px;
    margin: 30px auto 45px;
  }
  .table {
    ::v-deep .el-table__header {
      font-size: 12px;
    }
    ::v-deep .el-table__body {
      font-size: 12px;
    }
    ::v-deep .el-table__footer {
      font-size: 12px;
    }
  }
}

</style>
