<template>
  <div class="personal">
    <el-card class="header" shadow="never">
      <div class="content">
        <el-avatar class="avatar" :size="80" :src="info.avatarUrlView"></el-avatar>
        <div v-if="info" class="desc">
          <p class="name">{{ nowTime }}，<span>{{ info.nickName }}</span>，祝你开心每一天！</p>
          <p class="info">{{ info.gender | filterArr(dictData.dicts.gender) }} - {{ info.titileCode | filterArr(dictData.dicts.hunterIdentity) }} - {{ info.city | filterLevel2(dictData.areas) }}</p>
        </div>
        <ul>
          <li>
            <p>招聘职位</p>
            <p>{{ companyCount.positionCount || 0 }}</p>
          </li>
          <li>
            <p>招聘企业</p>
            <p>{{ companyCount.companyCount || 0 }}</p>
          </li>
          <li>
            <p>人才数量</p>
            <p>{{ companyCount.resumeCount || 0 }}</p>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="main" shadow="never">
      <!-- <div class="title">招聘效果</div> -->
      <div class="content">
        <ul v-if="countList" class="nums">
          <li v-for="(item, index) in countList" :key="index">
            <p>{{ item.name }}</p>
            <p>{{ item.count }}</p>
          </li>
        </ul>
        <div class="statisticsbox">
          <div class="echartbox">
            <p class="name">招聘趋势</p>
            <div ref="main" class="echarts"></div>
          </div>
          <div class="visitor">
            <p class="name">最常来的访客</p>
            <ul v-if="visitorList.length > 0" class="visitors">
              <li v-for="(item, index) in visitorList" :key="index" class="visitors-item">
                <el-avatar v-if="item.appUserAvatarUrl" class="avatar" :size="48" :src="item.appUserAvatarUrl"></el-avatar>
                <img v-else class="avatar" src="../../../assets/images/notice/avatar_unknown.png" />
                <p class="nickName">{{ item.appUserName }}</p>
                <p class="num">浏览 {{ item.browseCount }}次</p>
              </li>
            </ul>
            <p v-else class="empty">暂无访客~</p>
          </div>
        </div>
      </div>
    </el-card>
    <div class="footer">
      <el-card class="left" shadow="never">
        <p class="title">职位动态 <span @click="more">查看更多<i class="el-icon-arrow-right"/></span></p>
        <el-timeline v-if="positionDynamic.length > 0" class="timeline">
          <el-timeline-item
            v-for="(item, index) in positionDynamic"
            :key="index"
            :timestamp="item.createTime"
            placement="top"
          >
            <p class="company">
              <span @click="lookDetail(item.positionId)">{{ item.title }}</span> - {{ item.companyName }}
            </p>
            <p v-if="item.operateDescribe" class="operateDescribe">{{ item.operateDescribe }}</p>
          </el-timeline-item>
        </el-timeline>
        <p v-else class="empty">暂无职位动态~</p>
      </el-card>
      <el-card class="right" shadow="never">
        <p class="title">我的职位</p>
        <ul v-if="myPositionList.length > 0" class="recods">
          <li v-for="(item, index) in myPositionList" :key="index" class="recods-item">
            <p class="recods-item-top">
              <span @click="lookDetail(item.id)">{{ item.title }}</span>
              <span>{{ item.browseUserCount }}人浏览</span>
            </p>
            <p class="recods-item-bottom">{{ item.companyName }}</p>
          </li>
        </ul>
        <p v-else class="empty">暂无职位~</p>
        <!-- 分页 -->
        <div v-if="total > 0" class="page">
          <el-pagination
            small
            background
            :pager-count="5"
            layout="prev, pager, next"
            :total="total"
            :current-page="pageNumber"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 职位详情 -->
      <drawer-common
        :drawer.sync="positionDetailVisible"
        :router="'positionDetail?positionId=' + positionId"
      >
        <position-detail slot="inner-body" :is-new-window="false" :position-id="positionId" />
      </drawer-common>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/utils/common'
import { getUserProfile } from '@/api/myCenter'
import { getDayHhShareBrowseDateStatistical } from '@/api/statistics'
import { getPositionOpeationLogList } from '@/api/position'
import { getHhShareBrowseDateStatistical, getUserAdminInfoDTO, countRangeCandidateByStage, getSharePositionBrowseCountVOList, getPositionListByUserId } from '@/api/home'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '@/views/position/positionDetail'
import { TableMixin } from '@/mixins/position'
export default {
  components: {
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  props: {
    dateType: { // 1 周， 2 月
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      nowTime: '早安',
      info: '',
      companyCount: '',
      startTime: '',
      endTime: '',
      countList: [
        { name: '线索人数', count: 0 },
        { name: '对话人数', count: 0 },
        { name: '投递人数', count: 0 },
        { name: '转发人数', count: 0 },
        { name: '推荐好友', count: 0 },
        { name: '推荐人数', count: 0 },
        { name: '面试人数', count: 0 },
        { name: 'OFFER人数', count: 0 },
        { name: '待报到人数', count: 0 },
        { name: '入职人数', count: 0 }
      ], // 数量列表
      rankingType: '1', // 排行榜类型
      visitorList: [], // 访客列表
      positionDynamic: [], // 职位动态
      total: 0, // 总条数
      pageNumber: 1, // 页码
      pageSize: 5, // 每页条数
      myPositionList: [], // 我的职位
      setOption: {
        // title: {
        //   text: '柱状图'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['投递人数', '推荐人数', '浏览人数']
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '投递人数',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '推荐人数',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '浏览人数',
            type: 'line',
            smooth: true,
            data: [2.0, 2.2, 3.3, 205, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.userInfo.userId,
      companyRole: state => state.userInfo.companyRole,
      dictData: state => state.common.dictData
    })
  },
  watch: {
    dateType(val) {
      this.changeDate(val)
    }
  },
  created() {
    const now = new Date()
    const hour = now.getHours()
    if (hour < 6) {
      this.nowTime = '凌晨好'
    } else if (hour < 9) {
      this.nowTime = '早上好'
    } else if (hour < 12) {
      this.nowTime = '上午好'
    } else if (hour < 14) {
      this.nowTime = '中午好'
    } else if (hour < 17) {
      this.nowTime = '下午好'
    } else if (hour < 19) {
      this.nowTime = '傍晚好'
    } else if (hour < 24) {
      this.nowTime = '晚上好'
    }
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
    this.startTime = formatDate(start, 'yyyy-MM-dd')
    this.endTime = formatDate(end, 'yyyy-MM-dd')
    this.myInfo()
    this.getCompanyCount()
    this.getCount()
    this.getCharts()
    this.getVisitorList()
    // this.searchList()
    this.getMyPositionList()
  },
  methods: {
    // 个人信息
    myInfo() {
      getUserProfile().then(res => {
        console.log(res)
        this.info = res.data
      })
    },
    getCompanyCount() {
      getUserAdminInfoDTO().then(res => {
        console.log(res)
        this.companyCount = res.data
      })
    },
    changeDate(val) {
      const day = val === 1 ? 6 : 29
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
      this.startTime = formatDate(start, 'yyyy-MM-dd')
      this.endTime = formatDate(end, 'yyyy-MM-dd')
      this.getCount()
      this.getCharts()
    },
    // 数量
    async getCount() {
      const countList = this.countList
      await getHhShareBrowseDateStatistical().then(res => {
        const data = this.dateType === 1 ? res.data.weekStatistical : res.data.monthStatistical
        countList[0] = { name: '线索人数', count: data.browseUserCount }
        countList[1] = { name: '对话人数', count: data.contactedUserCount }
        countList[2] = { name: '投递人数', count: data.interestedUserCount }
        countList[3] = { name: '转发人数', count: data.shareUserCount }
        countList[4] = { name: '推荐好友', count: data.recommendCount }
      })
      const params = {
        startTime: this.startTime
      }
      await countRangeCandidateByStage(params).then(res => {
        console.log(res)
        res.data.forEach(item => {
          if (item.code === 1) {
            countList[5] = { name: '推荐人数', count: item.count }
          } else if (item.code === 3) {
            countList[6] = { name: '面试人数', count: item.count }
          } else if (item.code === 4) {
            countList[7] = { name: 'OFFER人数', count: item.count }
          } else if (item.code === 5) {
            countList[8] = { name: '待报到人数', count: item.count }
          } else if (item.code === 6) {
            countList[9] = { name: '入职人数', count: item.count }
          }
        })
      })
      this.countList = this.countList.concat([])
    },
    // 图表
    getCharts() {
      const start = this.startTime
      const end = this.endTime
      const params = {
        lastBrowseStartTime: start + ' 00:00:00',
        lastBrowseEndTime: end + ' 00:00:00',
        statisticType: 1
      }
      this.setOption.xAxis.data = this.formatEveryDay(start, end)
      getDayHhShareBrowseDateStatistical(params).then(res => {
        const list = res.data.records
        const days = this.setOption.xAxis.data
        const interestedUserCount = []
        const recommendCount = []
        const browseUserCount = []
        days.forEach((item, index) => {
          interestedUserCount.push(0)
          recommendCount.push(0)
          browseUserCount.push(0)
          list.forEach(items => {
            if (item === items.browseDate) {
              interestedUserCount[index] = items.interestedUserCount
              recommendCount[index] = items.recommendCount
              browseUserCount[index] = items.browseUserCount
            }
          })
        })
        this.setOption.series[0].data = interestedUserCount
        this.setOption.series[1].data = recommendCount
        this.setOption.series[2].data = browseUserCount
        console.log(this.setOption.series)
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.main, 'light')
        // 绘制图表，this.setOption是数据
        myChart.setOption(this.setOption)
      })
    },
    // 排行榜切换
    changeRanking(e) {

    },
    // 访客列表
    getVisitorList() {
      getSharePositionBrowseCountVOList().then(res => {
        this.visitorList = res.data.slice(0, 5)
      })
    },
    // 职位动态
    searchList() {
      const params = {
        pageNumber: 1,
        pageSize: 5,
        contactMe: true
      }
      getPositionOpeationLogList(params).then(res => {
        this.positionDynamic = res.data.records
      })
    },
    // 查看更多动态
    more() {
      this.$router.push('/position/record')
    },
    // 我的职位
    getMyPositionList() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: 5,
        type: 1
      }
      getPositionListByUserId(params).then(res => {
        this.myPositionList = res.data.records
        this.total = res.data.total
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getMyPositionList()
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
.personal {
  .header {
    .content {
      display: flex;
      flex-direction: row;
      align-items: center;
      .desc {
        margin-left: 20px;
        .name {
          font-size: 18px;
          color: #14171A;
          line-height: 25px;
          margin-bottom: 12px;
        }
        .info {
          font-size: 14px;
          line-height: 20px;
          color: #999999;
        }
      }
      ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        li {
          text-align: center;
          margin-left: 80px;
          position: relative;
          &::after {
            display: none;
            content: '';
            width: 1px;
            height: 30px;
            border-left: 1px solid #DCDFE6;
            position: absolute;
            left: -20px;
            top: 5px;
          }
          &:first-child::after {
            display: none;
          }
          p:first-child {
            font-size: 14px;
            color: #999999;
            line-height: 22px;
            margin-bottom: 6px;
          }
          p:last-child {
            font-size: 28px;
            color: #1678F9;
            line-height: 40px;
            font-weight: 600;
          }
        }
      }
    }
  }
  .main {
    margin: 16px 0;
    // ::v-deep .el-card__body {
    //   padding: 0;
    // }
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20px 20px 20px 34px;
      border-bottom: 1px solid #DCDFE6;
      font-size: 18px;
      font-weight: 600;
      color:#14171A;
      line-height: 28px;
      position: relative;
      &::before {
        content: '';
        width: 6px;
        height: 20px;
        background:linear-gradient(360deg,rgba(49,176,253,0) 0%,rgba(22,120,249,1) 100%);
        position: absolute;
        left: 20px;
        top: 24px;
      }
      p {
        &:last-child {
          font-size: 14px;
          color: #14171A;
          margin-left: auto;
        }
        span {
          font-weight: 500;
          margin-left: 20px;
          position: relative;
          cursor: pointer;
          &:last-child::after {
            content: '';
            width: 1px;
            height: 14px;
            border-left: 1px solid #DCDFE6;
            position: absolute;
            top: 3px;
            left: -10px;
          }
          &.active {
            color: #1678F9;
          }
        }
      }
    }
    .content {
      padding: 20px;
      .nums {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-bottom: 20px;
        border-bottom: 1px solid #DCDFE6;
        position: relative;
        &::after {
          content: '';
          width: 1px;
          height: 60px;
          border-left: 1px solid #DCDFE6;
          position: absolute;
          left: 49%;
          top: 6px;
          transform: translateX(-49%);
        }
        li {
          font-size: 14px;
          color:rgba(153,153,153,1);
          line-height: 20px;
          text-align: center;
          p:last-child {
            font-size: 28px;
            font-weight: 500;
            color:rgba(20,23,26,1);
            line-height: 40px;
            margin-top: 8px;
          }
        }
      }
      .statisticsbox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 40px;
        .echartbox {
          flex: 1;
          margin-right: 50px;
          .name {
            padding-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
            color:#14171A;
            line-height: 22px;
            padding-left: 14px;
            position: relative;
            &::before {
              content: '';
              width: 6px;
              height: 20px;
              background:linear-gradient(360deg,rgba(49,176,253,0) 0%,rgba(22,120,249,1) 100%);
              position: absolute;
              left: 0;
              top: 4px;
            }
          }
          .echarts {
            height: 290px;
          }
        }
        .visitor {
          width: 500px;
          position: relative;
          .name {
            padding-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
            color:#14171A;
            line-height: 22px;
            padding-left: 14px;
            position: relative;
          }
          .visitors {
            height: 300px;
            overflow: auto;
            .visitors-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-size: 14px;
              color: #333333;
              line-height: 20px;
              margin-top: 10px;
              .avatar {
                width: 48px;
                height: 48px;
              }
              .nickName {
                margin-left: 20px;
              }
              .num {
                margin-left: auto;
              }
            }
          }
          .empty {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    height: 600px;
    .left {
      flex: 1;
      position: relative;
      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #DCDFE6;
        padding-bottom: 20px;
        padding-left: 14px;
        font-size: 18px;
        font-weight: 600;
        color:#14171A;
        line-height: 25px;
        position: relative;
        &::before {
          content: '';
          width: 6px;
          height: 20px;
          background:linear-gradient(360deg,rgba(49,176,253,0) 0%,rgba(22,120,249,1) 100%);
          position: absolute;
          left: 0;
          top: 4px;
        }
        span {
          font-size: 14px;
          font-weight: 400;
          color:rgba(51,51,51,1);
          line-height: 20px;
          margin-left: auto;
          cursor: pointer;
        }
      }
      .timeline {
        margin-top: 20px;
        .company {
          font-size:14px;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:22px;
          margin-bottom: 8px;
          span {
            cursor: pointer;
          }
        }
        .operateDescribe {
          font-size: 12px;
          color:rgba(153,153,153,1);
          line-height: 20px;
          margin-bottom: 8px;
        }
        .el-timeline-item {
          padding-bottom: 10px;
        }
      }
    }
    .right {
      width: 500px;
      margin-left: 16px;
      position: relative;
      ::v-deep .el-card__body {
        padding: 0;
      }
      .title {
        border-bottom: 1px solid #DCDFE6;
        padding: 20px;
        font-size: 18px;
        font-weight: 600;
        color:#14171A;
        line-height: 25px;
        padding-left: 34px;
        position: relative;
        &::before {
          content: '';
          width: 6px;
          height: 20px;
          background:linear-gradient(360deg,rgba(49,176,253,0) 0%,rgba(22,120,249,1) 100%);
          position: absolute;
          left: 20px;
          top: 24px;
        }
      }
      .recods {
        padding: 0 20px;
        .recods-item {
          padding: 20px 0;
          border-bottom: 1px solid #DCDFE6;
          &:last-child {
            border: 0;
          }
          .recods-item-top {
            display: flex;
            span {
              font-size: 14px;
              font-weight: 600;
              color:rgba(51,51,51,1);
              line-height: 22px;
              &:first-child {
                cursor: pointer;
              }
              &:last-child {
                font-size: 14px;
                font-weight: 400;
                color:rgba(153,153,153,1);
                line-height: 20px;
                margin-left: auto;
              }
            }
          }
          .recods-item-bottom {
            font-size: 12px;
            font-weight: 400;
            color:rgba(153,153,153,1);
            line-height: 20px;
            margin-top: 10px;
          }
        }
      }
      .page {
        float: right;
        .el-pagination {
          padding: 10px 20px;
        }
      }
    }
    .empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
