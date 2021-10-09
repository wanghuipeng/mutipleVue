<template>
  <div class="content">
    <div class="header">
      <div class="header-info" @click="toDemo">
        <p class="name">{{ userInfo.nickName }}，{{ nowTime }}</p>
        <p>
          <span v-if="nowDate">{{ nowDate }} </span>
          <span v-if="ipLbs">{{ ipLbs.city }} </span>
          <span
            v-if="weather"
          >{{ weather.today.weatherType }}，{{ weather.today.low }}-{{
            weather.today.high
          }}度</span>
        </p>
      </div>
      <div class="header-search">
        <p class="tab">
          <span
            :class="{ active: actIdx === 1 }"
            @click="switchTab(1)"
          >职位</span>
          <span
            :class="{ active: actIdx === 2 }"
            @click="switchTab(2)"
          >候选人</span>
        </p>
        <p class="search">
          <!-- <el-input v-model="search" :placeholder="`${actIdx === 1 ? '搜索职位名称' : '人才姓名、手机号搜索'}`" size="medium" clearable>
            <p slot="append" @click="searchPage"><img src="@/assets/images/home/search.png" /></p>
          </el-input> -->
          <el-autocomplete
            v-model="search"
            value-key="text"
            :placeholder="`${
              actIdx === 1 ? '搜索职位名称' : '人才姓名、手机号搜索'
            }`"
            size="medium"
            clearable
            :fetch-suggestions="querySearch"
          >
            <p slot="append" @click="searchPage">
              <img src="@/assets/images/home/search.png" />
            </p>
          </el-autocomplete>
        </p>
      </div>
      <div class="header-btns">
        <el-button
          v-if="
            userInfo.companyRole === 2 ||
              userInfo.companyRole === 3 ||
              userInfo.companyRole === 4
          "
          size="mini"
          plain
          @click="releasePosition"
        >新增职位</el-button>
        <el-button size="mini" plain @click="drawer = true">新增简历</el-button>
      </div>
    </div>
    <el-card class="task" shadow="never">
      <div class="title">
        <p>待处理</p>
        <p>
          <el-select
            v-model="taskPositionId"
            size="mini"
            placeholder="请选择"
            filterable
            @change="getTaskCount"
          >
            <el-option
              v-for="item in positionOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="taskDateType"
            size="mini"
            placeholder="请选择"
            @change="getTaskCount"
          >
            <el-option
              v-for="item in dateDicts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <ul class="task-list">
        <li
          v-for="(item, index) in taskList"
          :key="index"
          @click="toCandidateList(item)"
        >
          <p>{{ item.name }}</p>
          <p class="num">
            <span>{{ item.count }}</span>
            <img :src="item.img" />
          </p>
        </li>
      </ul>
    </el-card>

    <div class="main">
      <el-card class="main-left" shadow="never">
        <div class="title">
          <p>重要事项</p>
          <el-select
            v-model="orderStage"
            size="mini"
            placeholder="请选择"
            @change="getList"
          >
            <el-option
              v-for="item in orderType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="calendar">
          <i class="el-icon-arrow-left cursor-pointer" @click="prevDay"></i>
          <div class="box" style="overflow: hidden; flex: 1">
            <ul
              v-if="weekList && weekList.length > 0"
              class="week"
              :style="[
                { 'margin-right': distance },
                { transition: 'all .3s ease-out .1s' },
              ]"
            >
              <li
                v-for="(item, index) in weekList"
                :key="index"
                class="week-item"
              >
                <p class="name">{{ item.week }}</p>
                <div class="value" @click="changeDay(item)">
                  <p :class="{ active: checkDay === item.date }">
                    {{ item.month ? item.month + "/" : "" }}{{ item.day }}
                  </p>
                  <p :class="[item.mark ? 'mark' : 'noMark']"></p>
                </div>
              </li>
            </ul>
          </div>
          <i class="el-icon-arrow-right cursor-pointer" @click="nextDay"></i>
        </div>
        <el-timeline v-if="scheduleList.length > 0" class="timeline">
          <el-timeline-item v-for="(item, index) in scheduleList" :key="index">
            <div
              class="interview"
              @click="toDetail(item.resumeId, item.candidateId)"
            >
              <div class="interviewer">
                <p>{{ item.scheduleTime }}</p>
                <p>{{ item.itemTypeName }}丨候选人：{{ item.resumeName }}</p>
              </div>
              <div class="interviewee">
                <p>{{ item.processNodeName }}</p>
                <p v-if="item.processNode === 2">
                  {{
                    item.interviewMethod
                      | filterArr(dictData.dicts.interviewType)
                  }}：<span
                    style="color: #1678f9"
                  >{{ item.positionName }}(面试官：{{
                    item.interviewerName
                  }})</span>
                </p>
                <p v-if="item.processNode === 4">
                  入职岗位：<span
                    style="color: #1678f9"
                  >{{ item.positionName }}(试用期：{{
                    item.probationPeriod
                  }}个月)</span>
                </p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <div v-else class="empty">暂时还没有日程安排哦~</div>
      </el-card>
      <div class="main-right">
        <el-card class="position" shadow="never">
          <div class="title">
            <p>最近访问职位</p>
            <span
              @click="morePosition"
            >更多在招职位<i
              class="el-icon-arrow-right"
            /></span>
          </div>
          <ul v-if="browsePositionList.length > 0">
            <li
              v-for="item in browsePositionList"
              :key="item.id"
              class="ellipsis"
              @click="toPosition(item.id)"
            >
              {{ item.title }}({{ item.id }})
            </li>
          </ul>
          <div v-else class="empty">暂时还没有访问职位哦~</div>
        </el-card>
        <el-card class="echart" shadow="never">
          <div class="title">
            <p>招聘趋势</p>
            <el-select
              v-model="dateType"
              size="mini"
              placeholder="请选择"
              @change="getCharts"
            >
              <el-option
                v-for="item in dateDicts1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div ref="main" class="echarts"></div>
        </el-card>
      </div>
    </div>

    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionId"
    >
      <position-detail
        slot="inner-body"
        :is-new-window="false"
        :position-id="positionId"
      />
    </drawer-common>

    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :no-new-window="true"
      @close="closeUpload"
    >
      <upload-drawer
        v-if="drawer"
        slot="inner-body"
        ref="uploadDrawer"
        @fatherMethod="close"
      />
    </drawer-common>

    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="orderVisible"
      :router="'resumeDetail'"
      :direction="'btt'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier
        v-if="orderVisible"
        slot="inner-body"
        :company-account-type="userInfo.companyAccountType"
        :candidate-id="candidateId"
      />
    </drawer-common>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@/utils/common';
import drawerCommon from '@/components/common/drawerCommon';
import positionDetail from '@/views/position/positionDetail';
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer';
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier';
import {
  selectPosition,
  countPositionCandidateStage,
  getHrPortalCandidateDayDistribution,
  getWorkbenchInfo,
  getCandidateScheduleList
} from '@/api/home';
import { getAllResumeList } from '@/api/resume';
export default {
  components: {
    drawerCommon,
    positionDetail,
    UploadDrawer,
    ResumeDetailSupplier
  },
  props: {
    dataType: {
      // 1 企业， 2 个人
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      num: 0,
      weekWidth: 0,
      distance: 0,
      nowTime: '早安',
      nowDate: '',
      ipLbs: '',
      weather: '',
      actIdx: 1,
      search: '',
      positionList: [],
      positionOptions: [],
      resumeList: [],
      taskList: [
        {
          name: '待处理简历',
          stage: '9',
          state: '0',
          count: 0,
          img: require('@/assets/images/home/icon1.png')
        },
        {
          name: '待筛选确认',
          stage: '11',
          state: 1,
          count: 0,
          img: require('@/assets/images/home/icon2.png')
        },
        {
          name: '待安排面试',
          stage: '20',
          state: 3,
          count: 0,
          img: require('@/assets/images/home/icon3.png')
        },
        {
          name: '待发OFFER',
          stage: '30',
          state: 4,
          count: 0,
          img: require('@/assets/images/home/icon4.png')
        },
        {
          name: '待录用',
          stage: '40',
          state: 5,
          count: 0,
          img: require('@/assets/images/home/icon5.png')
        }
      ],
      taskPositionId: '',
      taskDateType: null,
      dateDicts: [
        { label: '全部', value: null },
        { label: '今天', value: 1 },
        { label: '近3天', value: 3 },
        { label: '近7天', value: 7 },
        { label: '近30天', value: 30 }
      ],
      orderStage: '',
      orderType: [
        { label: '全部', value: '' },
        { label: '面试', value: 2 },
        { label: '入职', value: 4 }
      ],
      dateType: 7,
      dateDicts1: [
        { label: '近3天', value: 3 },
        { label: '近7天', value: 7 },
        { label: '近30天', value: 30 }
      ],
      browsePositionList: [],
      checkDay: formatDate(new Date(), 'yyyy-MM-dd'),
      weekList: [],
      scheduleList: [],
      setOption: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增简历', '入职']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '新增简历',
            type: 'bar',
            data: []
          },
          {
            name: '入职',
            type: 'bar',
            data: []
          },
          {
            name: '浏览人数',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      },
      positionDetailVisible: false,
      positionId: '',
      drawer: false,
      orderVisible: false,
      candidateId: ''
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      companyId: (state) => state.userInfo.companyId,
      dictData: (state) => state.common.dictData
    })
  },
  watch: {
    dataType(val) {
      // 切换个人|企业工作台重置数据
      this.search = '';
      this.actIdx = 1;
      this.taskPositionId = '';
      this.taskDateType = 7;
      this.orderStage = '';
      this.dateType = 7;
      const now = new Date();
      this.getInfo();
      this.getTaskCount();
      this.getWeek(formatDate(now, 'yyyy-MM-dd'));
      this.getCharts();
    }
  },
  created() {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) {
      this.nowTime = '凌晨好';
    } else if (hour < 9) {
      this.nowTime = '早上好';
    } else if (hour < 12) {
      this.nowTime = '上午好';
    } else if (hour < 14) {
      this.nowTime = '中午好';
    } else if (hour < 17) {
      this.nowTime = '下午好';
    } else if (hour < 19) {
      this.nowTime = '傍晚好';
    } else if (hour < 24) {
      this.nowTime = '晚上好';
    }
    this.getInfo();
    this.getTaskCount();
    this.getPosition();
    this.getAllResumeList();
    this.getWeek(formatDate(now, 'yyyy-MM-dd'));
    this.getCharts();
  },
  methods: {
    toDemo() {
      window.location.href = '/demo/notFound'
    },
    // 基本信息
    getInfo() {
      const params = {
        dataType: this.dataType
      };
      getWorkbenchInfo(params).then((res) => {
        const day = res.data.currentDate && res.data.currentDate.split(' ')[0];
        const week = this.formatDateObj(day, 0);
        this.nowDate =
          day.replace(/-/, '年').replace(/-/, '月') + '日 ' + week.week;
        this.ipLbs = res.data.ipLbs;
        this.weather = res.data.weather;
        this.browsePositionList =
          res.data && res.data.browsePositionList.splice(0, 6);
      });
    },
    // 切换Tab
    switchTab(val) {
      this.actIdx = val;
      this.search = '';
    },
    // 跳转职位 | 候选人页面
    searchPage() {
      if (this.actIdx === 1) {
        this.$router.push({
          path: 'job',
          query: this.search ? { searchName: this.search } : ''
        });
      } else {
        this.$router.push({
          name: 'resume',
          params: { searchName: this.search }
        });
      }
    },
    // 发布职位
    releasePosition() {
      this.$router.push('/releasePosition');
    },
    // 输入联想
    querySearch(queryString, cb) {
      let restaurants = [];
      if (this.actIdx === 1) {
        restaurants = this.positionList;
      } else {
        restaurants = this.resumeList;
      }
      console.log(restaurants);
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.text && restaurant.text.indexOf(queryString) === 0;
      };
    },
    // 获取候选人列表
    getAllResumeList() {
      const params = {
        pageNumber: 1,
        pageSize: 99999
      };
      getAllResumeList(params).then((res) => {
        res.data &&
          res.data.records.forEach((item) => {
            item.text = item.detail.name;
          });
        this.resumeList = (res.data && res.data.records) || [];
      });
    },
    // 获取职位列表
    getPosition() {
      this.positionOptions = [
        {
          text: '全部职位',
          value: ''
        }
      ];
      const params = {
        maxCount: 99999
      };
      selectPosition(params).then((res) => {
        this.restaurants = res.data;
        this.positionList = res.data;
        this.positionOptions = this.positionOptions.concat(res.data);
      });
    },
    // 获取待处理数量
    getTaskCount() {
      const params = {
        dataType: this.dataType,
        positionId: this.taskPositionId,
        rangeDay: this.taskDateType
      };
      countPositionCandidateStage(params).then((res) => {
        this.taskList.forEach((item) => {
          for (var key in res.data) {
            if (key === item.stage) {
              item.count = res.data[key];
            }
          }
        });
        console.log(2222222, this.taskList);
      });
    },
    // 跳转订单列表
    toCandidateList(item) {
      if (this.taskPositionId) {
        this.$router.push({
          path: 'jobDetail',
          query: {
            positionId: this.taskPositionId,
            tab: 'resume',
            orderTab: item.state,
            dataType: this.dataType
          }
        });
      } else {
        this.$router.push({
          path: 'candidateList',
          query: {
            positionId: this.taskPositionId,
            state: item.state,
            dataType: this.dataType
          }
        });
      }
    },
    dislodgeZero(str) {
      let strArray = str.split('-');
      strArray = strArray.map(function(val) {
        if (val[0] === '0') {
          return (val = val.slice(1));
        } else {
          return val;
        }
      });
      return strArray.join('-');
    },
    // 日程列表
    getList() {
      const params = {
        dataType: this.dataType,
        startDate: this.weekList[0].date,
        endDate: this.weekList[6].date,
        processNode: this.orderStage
      };
      getCandidateScheduleList(params).then((res) => {
        this.scheduleList = [];
        const data = res.data;
        this.weekList.forEach((item) => {
          item.mark = false;
          for (var key in data) {
            if (item.date === key) {
              item.mark = true;
              if (this.checkDay === key) {
                this.scheduleList = data[key];
              }
            }
          }
        });
        console.log('重要事项', this.weekList, this.scheduleList);
      });
    },
    // 前一天
    prevDay() {
      const arr = [-4, -3, -2, -1, 0, 1, 2];
      for (let i = 0; i < 7; i++) {
        this.getWeek(this.weekList[3].date, arr);
      }
    },
    // 后一天
    nextDay() {
      const arr = [-2, -1, 0, 1, 2, 3, 4];
      for (let i = 0; i < 7; i++) {
        this.getWeek(this.weekList[3].date, arr);
      }
    },
    changeDay(data) {
      this.checkDay = data.date;
      this.scheduleList = [];
      this.getList();
    },
    // 当前时间前后三天list
    getWeek(now, days) {
      let arr = [];
      if (days) {
        arr = days;
      } else {
        arr = [-3, -2, -1, 0, 1, 2, 3];
      }
      const list = [];
      for (var i = 0; i < arr.length; i++) {
        const day = this.formatDateObj(now, arr[i]);
        list.push(day);
      }
      this.weekList = list;
      this.weekList.forEach((item) => {
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        if (item.date === today) {
          item.month = '';
        } else {
          item.month = item.date && item.date.split('-')[1];
          item.month = this.dislodgeZero(item.month);
        }
      });
      this.getList();
    },
    // 时间处理
    formatDateObj(now, day) {
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const time = new Date(now);
      const week = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ];
      const d = new Date(time.setDate(time.getDate() + day));
      return {
        week: week[d.getDay()],
        day: today === formatDate(d, 'yyyy-MM-dd') ? '今' : d.getDate(),
        date: formatDate(d, 'yyyy-MM-dd'),
        mark: false
      };
    },
    // 开始到结束的每一天
    formatEveryDay(start, end) {
      const dateList = [];
      var startTime = this.getDate(start);
      var endTime = this.getDate(end);
      while (endTime.getTime() - startTime.getTime() >= 0) {
        var year = startTime.getFullYear();
        var month =
          startTime.getMonth() + 1 < 10
            ? '0' + (startTime.getMonth() + 1)
            : startTime.getMonth() + 1;
        var day =
          startTime.getDate().toString().length === 1
            ? '0' + startTime.getDate()
            : startTime.getDate();
        dateList.push(year + '-' + month + '-' + day);
        startTime.setDate(startTime.getDate() + 1);
      }
      return dateList;
    },
    getDate(datestr) {
      var temp = datestr.split('-');
      var date = new Date(temp[0], temp[1] - 1, temp[2]);
      return date;
    },
    // 更多职位
    morePosition() {
      this.$router.push('/job');
    },
    // 职位详情
    toPosition(id) {
      // this.positionDetailVisible = true
      this.positionId = id;
      this.$router.push({
        path: 'jobDetail',
        query: {
          positionId: id,
          tab: 'resume',
          orderTab: 0,
          dataType: this.dataType
        }
      });
    },
    // 图表
    getCharts() {
      const params = {
        dataType: this.dataType,
        rangeDay: this.dateType
      };
      getHrPortalCandidateDayDistribution(params).then((res) => {
        console.log(res);
        this.setOption.xAxis.data = [];
        this.setOption.series[0].data = [];
        this.setOption.series[1].data = [];
        res.data.forEach((item) => {
          this.setOption.xAxis.data.push(item.date);
          this.setOption.series[0].data.push(item.recommendCount);
          this.setOption.series[1].data.push(item.entryCount);
        });
        // 升序处理
        const arr1 = this.setOption.xAxis.data;
        this.setOption.xAxis.data = arr1.reverse();
        const arr2 = this.setOption.series[0].data;
        this.setOption.series[0].data = arr2.reverse();
        const arr3 = this.setOption.series[1].data;
        this.setOption.series[1].data = arr3.reverse();
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.main, 'light');
        // 绘制图表，this.setOption是数据
        myChart.setOption(this.setOption);
      });
    },
    // 关闭上传简历弹窗
    closeUpload() {
      this.drawer = false;
      this.$refs.uploadDrawer.destroyedInterval();
    },
    // 订单详情
    toDetail(id, candidateId) {
      this.orderVisible = true;
      this.candidateId = candidateId;
      sessionStorage.setItem('resumeId', id);
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto';
      this.orderVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/sass/home/index.scss";
::v-deep .el-timeline-item__tail {
  left: 5px;
}
::v-deep .el-timeline-item__node--normal {
  left: 0;
}
</style>
