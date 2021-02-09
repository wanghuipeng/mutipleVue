<template>
  <div class="app-container">
    <el-card shadow="never">
      <p class="title">业绩趋势统计</p>
      <div class="wall">
        通过本张报表，您可以查看一段时间内内全公司的业绩产出趋势变化情况，并可以筛选到具体部门/成员。
      </div>

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
        <span class="filter-item filter-lable">部门</span>
        <el-select v-model="listQuery.deptId" placeholder="请选择" clearable style="width: 140px" class="filter-item" size="small" @change="changeDept">
          <el-option v-for="item in departmentList" :key="item.id" :label="item.deptName" :value="item.id" />
        </el-select>
        <span class="filter-item filter-lable">成员</span>
        <el-select v-if="showMember" v-model="listQuery.userIds" clearable multiple placeholder="请选择" style="width: 140px" class="filter-item" size="small">
          <el-option v-for="item in userIdsArr" :key="item.value" :label="item.label" :value="item.value" />
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
      >
        <el-table-column label="日期" prop="dataTime" align="center" />
        <el-table-column label="推荐数" prop="recommendCount" align="center" />
        <el-table-column label="面试数" prop="interviewCount" align="center" />
        <el-table-column label="Offer数" prop="offerCount" align="center" />
        <el-table-column label="入职数" prop="onboardCount" align="center" />
        <el-table-column label="过保数" prop="overdueCount" align="center" />
      </el-table>

      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/utils/common'
import { getStageProcessDayDistribution } from '@/api/statistics'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import { mapState } from 'vuex'
import { searchPage } from '@/api/set'
import { findMemberVOList } from '@/api/releasePosition'

export default {
  components: { Pagination },
  data() {
    return {
      showMember: true,
      departmentList: [],
      userIdsArr: [],
      departmentIds: [],
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date: '',
        deptId: null,
        userIds: []
      },
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
          data: ['推荐数', '面试数', 'Offer数', '入职数', '过保数']
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
            name: '推荐数',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '面试数',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: 'Offer数',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '入职数',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '过保数',
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
    this.searchPage()
    this.findMemberVOList()
  },
  methods: {
    changeDept(e) {
      console.log(e)
      this.listQuery.userIds = []
      this.departmentIds = [e]
      this.findMemberVOList()
    },
    // 部门
    searchPage() {
      const params = {
        pageNumber: 1,
        pageSize: 999
      }
      searchPage(params).then((res) => {
        this.departmentList = res.data.records
      })
    },
    // 数组去重（深拷贝）
    deteleObject(obj) {
      var uniques = []
      var stringify = {}
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i])
        keys.sort((a, b) => {
          return Number(a) - Number(b)
        })
        var str = ''
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j])
          str += JSON.stringify(obj[i][keys[j]])
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i])
          stringify[str] = true
        }
      }
      return uniques
    },
    // 成员
    findMemberVOList() {
      const params = {
        departmentIds: this.departmentIds
      }
      findMemberVOList(params).then((res) => {
        this.showMember = false
        const { code, data } = res
        if (code === '000000') {
          const arr = []
          data &&
            data.filter((item) => {
              item.memberDTOs &&
                item.memberDTOs.filter((itemInner) => {
                  arr.push({
                    value: itemInner.id,
                    gender: itemInner.gender,
                    visitAvatarUrl: itemInner.visitAvatarUrl,
                    label: itemInner.trueName
                  })
                })
            })
          this.userIdsArr = this.deteleObject(arr)
        }
        this.showMember = true
      })
    },
    getList() {
      this.listLoading = true
      const start = this.listQuery.date.length > 0 && this.listQuery.date[0]
      const end = this.listQuery.date.length > 0 && this.listQuery.date[1]
      const params = {
        startDate: start,
        endDate: end,
        companyId: this.companyId,
        deptId: this.listQuery.deptId,
        userIds: this.listQuery.userIds
      }
      getStageProcessDayDistribution(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.list && this.list.filter(item => {
          item.dataTime = item.dataTime || '-'
          item.recommendCount = item.recommendCount || 0
          item.interviewCount = item.interviewCount || 0
          item.offerCount = item.offerCount || 0
          item.onboardCount = item.onboardCount || 0
          item.overdueCount = item.overdueCount || 0
        })
      })
    },
    getCharts() {
      const start = this.listQuery.date.length > 0 && this.listQuery.date[0]
      const end = this.listQuery.date.length > 0 && this.listQuery.date[1]
      const params = {
        startDate: start,
        endDate: end,
        companyId: this.companyId,
        deptId: this.listQuery.deptId,
        userIds: this.listQuery.userIds
      }
      this.setOption.xAxis.data = this.formatEveryDay(start.split(' ')[0], end.split(' ')[0])
      getStageProcessDayDistribution(params).then(res => {
        const list = res.data
        const days = this.setOption.xAxis.data
        const recommendCount = []
        const interviewCount = []
        const offerCount = []
        const onboardCount = []
        const overdueCount = []
        days.forEach((item, index) => {
          recommendCount.push(0)
          interviewCount.push(0)
          offerCount.push(0)
          onboardCount.push(0)
          overdueCount.push(0)
          list && list.forEach(items => {
            if (item === items.dataTime) {
              recommendCount[index] = items.recommendCount || 0
              interviewCount[index] = items.interviewCount || 0
              offerCount[index] = items.offerCount || 0
              onboardCount[index] = items.onboardCount || 0
              overdueCount[index] = items.overdueCount || 0
            }
          })
        })
        this.setOption.series[0].data = recommendCount
        this.setOption.series[1].data = interviewCount
        this.setOption.series[2].data = offerCount
        this.setOption.series[3].data = onboardCount
        this.setOption.series[4].data = overdueCount
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
      start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
      this.listQuery.date = [formatDate(start, 'yyyy-MM-dd hh:mm:ss'), formatDate(end, 'yyyy-MM-dd hh:mm:ss')]
      this.listQuery.deptId = null
      this.listQuery.userIds = []
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .wall{
    border: 1px solid #a1c1ea;
    background-color: #f0faff;
    border-radius: 4px;
    padding: 15px;
    margin: 0 0 32px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
    color: #666;
  }
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
    margin: 0px auto 45px;
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
