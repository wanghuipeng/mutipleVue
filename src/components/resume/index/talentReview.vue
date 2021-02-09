<template>
  <div class="review">
    <el-card class="content" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/resume' }">人才库</el-breadcrumb-item>
        <el-breadcrumb-item>人才盘点</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row type="flex" justify="space-between" align="middle" style="margin-top: 12px;">
        <el-popover
          width="160"
          placement="bottom-end"
          trigger="hover"
        >
          <el-tree
            ref="dataTree"
            class="data-tree"
            :data="treeData"
            :props="{ label: 'name' }"
            node-key="id"
            :expand-on-click-node="false"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="data-tree-tool-bar">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <span slot="reference" class="el-dropdown-link" style="cursor: pointer;font-size: 15px;color: #0D121A;">
            {{ currData.name }}<i class="el-icon-arrow-down" style="margin-left: 8px;"></i>
          </span>
        </el-popover>
        <el-button size="small" @click="dialogVisible = true">维度设置</el-button>
      </el-row>
      <div class="main">
        <el-card v-for="(item, i) in list" :key="i" shadow="hover" class="card">
          <el-row type="flex" justify="end" class="dropdown">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ item.description | filterArr(type) }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeCharts(i, item.value, 1)">饼图</el-dropdown-item>
                <el-dropdown-item @click.native="changeCharts(i, item.value, 2)">横向柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="changeCharts(i, item.value, 3)">纵向柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="changeCharts(i, item.value, 4)">矩形树图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <img src="@/assets/images/resume/full.png" @click="fullScreen(i, item.value, Number(item.description))" />
          </el-row>
          <div :id="`echart${i}`" class="echarts"></div>
          <p v-if="item.empty" class="empty">暂无数据~</p>
        </el-card>
      </div>
    </el-card>

    <!-- 人才盘点设置 -->
    <el-dialog
      title="人才盘点设置"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <p>您可以自由设置需要进行盘点的人才数据维度</p>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="userDimensionList">
          <el-checkbox-group v-model="form.userDimensionList" size="small">
            <el-checkbox v-for="(item, index) in dimensionList" :key="index" :label="item.value" border>{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="save('form')">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 全屏 -->
    <el-dialog
      v-if="centerDialogVisible"
      :visible.sync="centerDialogVisible"
      center
      :fullscreen="true"
      close-on-press-escape
      lock-scroll
      :show-close="false"
    >
      <img class="close" src="@/assets/images/resume/full.png" @click="centerDialogVisible = false" />
      <div id="fullEcharts" style="width: 100%; height: calc(100% - 100px);"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTalentPoolSelect,
  getUserDimensionList,
  saveTalentDimensionUserSaveDTO,
  getTalentDimensionReportData
} from '@/api/resume'
export default {
  data() {
    return {
      centerDialogVisible: false,
      dialogVisible: false,
      treeData: [], // 人才库数据源
      currData: {}, // 当前选中节点
      dimensionList: [],
      form: {
        userDimensionList: []
      },
      rules: {
        userDimensionList: [
          { type: 'array', required: true, message: '请至少选择一个维度', trigger: 'change' }
        ]
      },
      list: [],
      type: [
        { label: '饼图', value: 1 },
        { label: '横向柱状图', value: 2 },
        { label: '纵向柱状图', value: 3 },
        { label: '矩形树图', value: 4 }
      ],
      pieOption: { // 饼图
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      crosswiseBarOption: { // 横向
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
          show: false
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '数量',
          type: 'bar',
          barMinWidth: 10, // 柱图宽度
          barMaxWidth: 30, // 柱图最大宽度
          itemStyle: {
            normal: {
              color: function(params) {
                // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = [
                  '#37A2DA', '#32C4E8', '#67E0E3', '#9FE6B8', '#FFDB5C',
                  '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3',
                  '#9D96F5', '#8378EA', '#96BFFF', '#26C0C0'
                ]
                return colorList[params.dataIndex]
              }
            }
          },
          data: [120, 200, 150, 80, 70, 110, 130]
        }]
      },
      lengthwaysBarOption: { // 纵向
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 1]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            barMinWidth: 10, // 柱图宽度
            barMaxWidth: 30, // 柱图最大宽度
            itemStyle: {
              normal: {
                color: function(params) {
                  // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = [
                    '#37A2DA', '#32C4E8', '#67E0E3', '#9FE6B8', '#FFDB5C',
                    '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3',
                    '#9D96F5', '#8378EA', '#96BFFF', '#26C0C0'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            },
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      },
      treemapOption: { // 矩形树图
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          formatter: function(info) {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name);
            }
            return [
              '<div class="tooltip-title">' + info.name + '</div>',
              '数量: ' + value
            ].join('');
          }
        },
        series: [
          {
            name: '',
            type: 'treemap',
            visibleMin: 300,
            roam: false,
            label: {
              show: true,
              formatter: '{b}'
            },
            data: []
          }
        ]
      }
    }
  },
  created() {
    // 查询人才库
    this.queryTalentPool();
  },
  methods: {
    // 查询人才库
    queryTalentPool() {
      const para = {};
      getTalentPoolSelect(para).then(data => {
        this.treeData = data.data || [];
        this.currData = this.treeData[0]; // 默认选中第一个
        // 查询维度
        this.getDimension()
      });
    },
    // 切换人才库
    handleNodeClick(data) {
      this.currData = data;
      this.list.forEach((item, index) => {
        this.getChartsData(index, item.value, 1)
      })
    },
    // 查询用户设置的维度
    getDimension() {
      getUserDimensionList().then(res => {
        this.dimensionList = res.data.allDimensionList
        this.form.userDimensionList = []
        res.data.userDimensionList.forEach((item, index) => {
          item.empty = false
          this.form.userDimensionList.push(item.value)
          if (!item.description) {
            item.description = 1
          }
          // console.log(item.description)
          // item.description = Math.abs(parseInt(Math.random(0, 1) * 10 - 6))
          this.getChartsData(index, item.value, Number(item.description))
        })
        this.list = res.data.userDimensionList
      })
    },
    // 保存维度
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(valid)
          const params = {
            dimensionIds: this.form.userDimensionList
          }
          saveTalentDimensionUserSaveDTO(params).then(res => {
            this.dialogVisible = false
            this.getDimension()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 获取人才盘点维度数据
    getChartsData(i, id, type) {
      const params = {
        dimensionId: id,
        talentPoolId: this.currData.id
      }
      getTalentDimensionReportData(params).then(res => {
        this.list[i].empty = false
        if (res.data.length === 0) {
          this.list[i].empty = true
        }
        this.initChart(i, res.data, type)
      })
    },
    // 切换图表
    changeCharts(i, id, type) {
      this.list[i].description = type
      this.getChartsData(i, id, type)
    },
    // 图表初始化
    initChart(i, data, type) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = []
      const arr = []
      for (var j = 0; j < this.list.length; j++) {
        arr.push(document.getElementById('echart' + j))
      }
      myChart[i] = this.$echarts.init(arr[i], 'light')
      // 绘制图表，this.setOption是数据
      if (type === 2) {
        this.lengthwaysBarOption.title.text = this.list[i].text
        this.lengthwaysBarOption.legend.data = []
        this.lengthwaysBarOption.yAxis.data = []
        this.lengthwaysBarOption.series[0].data = []
        data.forEach(item => {
          this.lengthwaysBarOption.legend.data.push(item.name)
          this.lengthwaysBarOption.yAxis.data.push(item.name)
          this.lengthwaysBarOption.series[0].data.push({
            value: item.count,
            name: item.name
          })
        })
        myChart[i].setOption(this.lengthwaysBarOption, true)
      } else if (type === 3) {
        this.crosswiseBarOption.title.text = this.list[i].text
        this.crosswiseBarOption.legend.data = []
        this.crosswiseBarOption.xAxis.data = []
        this.crosswiseBarOption.series[0].data = []
        data.forEach(item => {
          this.crosswiseBarOption.legend.data.push(item.name)
          this.crosswiseBarOption.xAxis.data.push(item.name)
          this.crosswiseBarOption.series[0].data.push({
            value: item.count,
            name: item.name
          })
        })
        myChart[i].setOption(this.crosswiseBarOption, true)
      } else if (type === 4) {
        this.treemapOption.title.text = this.list[i].text
        this.treemapOption.series[0].data = []
        data.forEach(item => {
          this.treemapOption.series[0].data.push({
            value: item.count,
            name: item.name
          })
        })
        myChart[i].setOption(this.treemapOption, true)
      } else {
        this.pieOption.title.text = this.list[i].text
        this.pieOption.legend.data = []
        this.pieOption.series[0].name = this.list[i].text
        this.pieOption.series[0].data = []
        data.forEach(item => {
          this.pieOption.legend.data.push(item.name)
          this.pieOption.series[0].data.push({
            value: item.count,
            name: item.name
          })
        })
        myChart[i].setOption(this.pieOption, true)
      }
    },
    fullScreen(i, id, type) {
      this.centerDialogVisible = true
      this.list[i].description = type
      const params = {
        dimensionId: id,
        talentPoolId: this.currData.id
      }
      getTalentDimensionReportData(params).then(res => {
        if (res.data.length === 0) {
          this.list[i].empty = true
        }
        const myChart = this.$echarts.init(document.getElementById('fullEcharts'), 'light')
        // 绘制图表，this.setOption是数据
        if (type === 2) {
          this.lengthwaysBarOption.title.text = this.list[i].text
          this.lengthwaysBarOption.legend.data = []
          this.lengthwaysBarOption.yAxis.data = []
          this.lengthwaysBarOption.series[0].data = []
          res.data.forEach(item => {
            this.lengthwaysBarOption.legend.data.push(item.name)
            this.lengthwaysBarOption.yAxis.data.push(item.name)
            this.lengthwaysBarOption.series[0].data.push({
              value: item.count,
              name: item.name
            })
          })
          myChart.setOption(this.lengthwaysBarOption, true)
        } else if (type === 3) {
          this.crosswiseBarOption.title.text = this.list[i].text
          this.crosswiseBarOption.legend.data = []
          this.crosswiseBarOption.xAxis.data = []
          this.crosswiseBarOption.series[0].data = []
          res.data.forEach(item => {
            this.crosswiseBarOption.legend.data.push(item.name)
            this.crosswiseBarOption.xAxis.data.push(item.name)
            this.crosswiseBarOption.series[0].data.push({
              value: item.count,
              name: item.name
            })
          })
          myChart.setOption(this.crosswiseBarOption, true)
        } else if (type === 4) {
          this.treemapOption.title.text = this.list[i].text
          this.treemapOption.series[0].data = []
          res.data.forEach(item => {
            this.treemapOption.series[0].data.push({
              value: item.count,
              name: item.name
            })
          })
          myChart.setOption(this.treemapOption, true)
        } else {
          this.pieOption.title.text = this.list[i].text
          this.pieOption.legend.data = []
          this.pieOption.series[0].name = this.list[i].text
          this.pieOption.series[0].data = []
          res.data.forEach(item => {
            this.pieOption.legend.data.push(item.name)
            this.pieOption.series[0].data.push({
              value: item.count,
              name: item.name
            })
          })
          myChart.setOption(this.pieOption, true)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  padding: 16px 0;
  overflow: hidden;
  box-sizing: border-box;
  .content {
    min-height: 660px;
  }
  .main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .card {
      width: calc(33.33% - 16px);
      margin: 16px 16px 0 0;
      position: relative;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .dropdown {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 9;
      }
      img {
        width: 18px;
        height: 18px;
        margin-left: 10px;
      }
      .empty {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .echarts {
    height: 300px;
    background: #ffffff;
  }
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
    p {
      padding-bottom: 20px;
    }
    .el-checkbox {
      margin: 0 10px 10px 0;
    }
    .close {
      width: 18px;
      height: 18px;
      position: fixed;
      top: 20px;
      right: 20px;
    }
    // .el-checkbox:nth-child(4n) {
    //   margin-right: 0;
    // }
  }
}
</style>
