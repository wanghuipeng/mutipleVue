<template>
  <div class="app-container">
    <el-card shadow="never">
      <p class="title">业绩趋势统计</p>
      <div class="wall">
        「推荐转化分析」报表，主要是帮助您跟踪分析指定日期产生的推荐报告，后续的转化数据情况。比如3月1日内，推荐数=10，面试数=5，入职数=3，代表在3月1日内企业提交的10个推荐报告中，截至当前共产生了5个面试、3个入职（此数据生成后，会根据时间的推移发生变化）。
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

      <!-- 两个图表 -->
      <div class="echarts-two">
        <div ref="main1" class="echarts"></div>
        <div ref="main2" class="echarts"></div>
      </div>

      <!-- 表格 -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        class="table"
      >
        <el-table-column label="日期" prop="dataTime" sortable="custom" align="center" />
        <el-table-column label="推荐数" prop="recommendCount" align="center" />
        <el-table-column label="面试数" prop="interviewCount" align="center" />
        <el-table-column label="Offer数" prop="offerCount" align="center" />
        <el-table-column label="入职数" prop="onboardCount" align="center" />
        <el-table-column label="过保数" prop="overdueCount" align="center" />
        <el-table-column label="面试率" prop="interviewRate" align="center">
          <template slot-scope="scope">{{ scope.row.interviewRate || 0 }}%</template>
        </el-table-column>
        <el-table-column label="Offer率" prop="offerRate" align="center">
          <template slot-scope="scope">{{ scope.row.offerRate || 0 }}%</template>
        </el-table-column>
        <el-table-column label="入职率" prop="onboardRate" align="center">
          <template slot-scope="scope">{{ scope.row.onboardRate || 0 }}%</template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/utils/common'
import { getStageRecommendDayDistribution } from '@/api/statistics'
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
      setOption1: {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['', '推荐数', '面试数', 'Offer数', '入职数', '过保数']
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      },
      setOption2: {
        // title: {
        //   text: '折线图'
        // },
        tooltip: {
          trigger: 'axis',
          formatter: '{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%'
        },
        legend: {
          data: ['面试率', 'Offer率', '入职率']
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
          min: 0,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '面试率',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: 'Offer率',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          },
          {
            name: '入职率',
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
      getStageRecommendDayDistribution(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.list && this.list.filter(item => {
          item.dataTime = item.dataTime || '-'
          item.recommendCount = item.recommendCount || 0
          item.interviewCount = item.interviewCount || 0
          item.offerCount = item.offerCount || 0
          item.onboardCount = item.onboardCount || 0
          item.overdueCount = item.overdueCount || 0
          item.interviewRate = item.interviewRate || 0
          item.offerRate = item.offerRate || 0
          item.onboardRate = item.onboardRate || 0
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
      this.setOption1.xAxis.data = this.formatEveryDay(start.split(' ')[0], end.split(' ')[0])
      this.setOption2.xAxis.data = this.formatEveryDay(start.split(' ')[0], end.split(' ')[0])
      getStageRecommendDayDistribution(params).then(res => {
        // 柱状图表
        const list1 = res.data

        const arrTemp1 = []

        list1.map(item => {
          const obj = {}
          obj.dataTime = item.dataTime
          obj.recommendCount = item.recommendCount || 0
          obj.interviewCount = item.interviewCount || 0
          obj.offerCount = item.offerCount || 0
          obj.onboardCount = item.onboardCount || 0
          obj.overdueCount = item.overdueCount || 0
          arrTemp1.push(obj)
        })

        const arr1 = this.setOption1.dataset.source[0]

        this.setOption1.dataset.source = []

        this.setOption1.dataset.source.push(arr1)

        arrTemp1.forEach(item => {
          const num = [item.dataTime, item.recommendCount, item.interviewCount, item.offerCount, item.onboardCount, item.overdueCount]
          this.setOption1.dataset.source.push(num)
        })

        // 基于准备好的dom，初始化echarts实例
        const myChart1 = this.$echarts.init(this.$refs.main1, 'light')

        // 绘制图表，this.setOption是数据
        myChart1.setOption(this.setOption1)

        // 曲线图表
        const list2 = res.data
        const days = this.setOption2.xAxis.data
        const interviewRate = []
        const offerRate = []
        const onboardRate = []
        days.forEach((item, index) => {
          interviewRate.push(0)
          offerRate.push(0)
          onboardRate.push(0)
          list2 && list2.forEach(items => {
            if (item === items.dataTime) {
              interviewRate[index] = items.interviewRate || 0
              offerRate[index] = items.offerRate || 0
              onboardRate[index] = items.onboardRate || 0
            }
          })
        })
        this.setOption2.series[0].data = interviewRate
        this.setOption2.series[1].data = offerRate
        this.setOption2.series[2].data = onboardRate
        // 基于准备好的dom，初始化echarts实例
        const myChart2 = this.$echarts.init(this.$refs.main2, 'light')
        // 绘制图表，this.setOption2是数据
        myChart2.setOption(this.setOption2)
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
  .echarts-two{
    display: flex;
    justify-content: space-between;
    .echarts {
      width: 50%;
      height: 300px;
      margin: 0px auto 45px;
      &:first-child{
        height: 331px;
      }
    }
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
