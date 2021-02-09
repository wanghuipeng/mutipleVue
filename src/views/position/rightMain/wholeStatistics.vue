<template>
  <div class="whole-statistics">
    <h4>全局统计</h4>
    <p class="sub-title">截至，{{ userInfo.companyName }}累计业绩统计如下：</p>
    <div class="charts">
      <el-card class="item" shadow="hover" >
        <h5>累计业绩</h5>
        <div class="table">
          <div class="cell">
            <span>累计统计</span>
            <span>124</span>
          </div>
          <div class="cell">
            <span>累计面试</span>
            <span>124</span>
          </div>
          <div class="cell">
            <span>累计offer</span>
            <span>124</span>
          </div>
          <div class="cell">
            <span>累计入职</span>
            <span>124</span>
          </div>
          <div class="cell">
            <span>累计过保</span>
            <span>124</span>
          </div>
        </div>
      </el-card>
      <el-card class="item" shadow="hover">
        <h5>业绩趋势</h5>
        <p class="labels">
          <span>今天</span>
          <span>本周</span>
          <span>本月</span>
        </p>
        <div id="echart1" class="echarts"></div>
      </el-card>
    </div>
    <div class="charts">
      <el-card class="item" shadow="hover">
        <h5>转化漏斗</h5>
        <div id="echart2" class="echarts"></div>
      </el-card>
      <el-card class="item" shadow="hover">
        <h5>人效排名</h5>
        <p class="labels">
          <span>今天</span>
          <span>本周</span>
          <span>本月</span>
        </p>
        <div id="echart3" class="echarts"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
       option: {
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true
          }]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo
    })
  },
  mounted() {
    document.title = '全局统计-大猎英才'
    this.initChart1()
    this.initChart2()
    this.initChart3()
  },
  methods: {
    // 业绩趋势
    initChart1() {
      // 基于准备好的dom，初始化echarts实例
      const typeChart = this.$echarts.init(document.getElementById('echart1'))
      // 指定图表的配置项和数据
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }]
      }
      typeChart.setOption(option);
    },
    // 转化漏斗
    initChart2() {
      // 基于准备好的dom，初始化echarts实例
      const typeChart = this.$echarts.init(document.getElementById('echart2'))
      // 指定图表的配置项和数据
      const option = {
        title: {
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
            data: ['面试率', 'offer率', '过保率']
        },
        series: [
            {
                name: '转化漏斗',
                type: 'funnel',
                left: '10%',
                top: 60,
                // x2: 80,
                bottom: 20,
                width: '80%',
                // height: {totalHeight} - y - y2,
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: [
                    { value: 20, name: '过保率' },
                    { value: 40, name: 'offer率' },
                    { value: 60, name: '面试率' }
                ]
            }
        ]
      }
      typeChart.setOption(option);
    },
    // 人效排名
    initChart3() {
      // 基于准备好的dom，初始化echarts实例
      const typeChart = this.$echarts.init(document.getElementById('echart3'))
      // 指定图表的配置项和数据
      const option = {
        dataset: {
        source: [
            [19.6, '推荐数'],
            [32.7, 'offer数']
        ]
        },
        grid: { containLabel: true },
        xAxis: { name: 'amount' },
        yAxis: { type: 'category' },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 10,
            max: 50,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                },
                barWidth: 30
            }
        ]
      }
      typeChart.setOption(option);
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.whole-statistics{
  padding: 12px 20px;
  .sub-title{
    font-size: 14px;
    margin-top: 10px;
  }
  .charts{
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    justify-content: space-between;
    .echarts{
      width: 100%;
      height:400px;
    }
    .table{
      border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      .cell{
        line-height: 50px;
        display: flex;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        font-size: 14px;
        justify-content: space-between;
        span{
          padding: 0 6px;
          text-align: center;
          display: block;
          flex: 1;
          &:last-child{
            border-right: 1px solid #eee;
            border-left: 1px solid #eee;
          }
        }
      }
    }
    ::v-deep .el-card__body{
      padding: 0;
    }
    .item{
       width: 49%;
       padding: 15px;
       box-sizing: border-box;
       position: relative;
       h5{
         padding: 0;
         margin: 0;
         margin-bottom: 15px;
       }
       .labels{
          position: absolute;
          top: 15px;
          right: 15px;
          span{
            font-size: 13px;
            position: relative;
            margin-left: 15px;
            cursor: pointer;
            &:hover{
              color: #1678F9;
            }
            &::before{
              content: "";
              width: 1px;
              display: inline-block;
              height: 12px;
              background-color: #ccc;
              position: absolute;
              left: 34px;
              top: 3px;
            }
            &:last-child{
              &::before{
                display: none;
              }
            }
          }
        }
    }
  }
}
</style>

