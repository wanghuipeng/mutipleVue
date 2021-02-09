<template>
  <div class="list">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in showTab"
          :key="index"
          :label="item.value"
          :name="index+''"
        >
          <span v-if="item.count" slot="label">{{ item.label }}({{ item.count }})</span>
          <span v-else slot="label">{{ item.label }}</span>
        </el-tab-pane>
        <el-tab-pane v-if="hideTab.length > 0" disabled>
          <div slot="label" class="nav">
            <div :class="{active: isActive}" class="title" @click="clickTab(hideTabShow.value)">
              <p v-if="hideTabShow.count">{{ hideTabShow.label }}({{ hideTabShow.count }})</p>
              <p v-else>{{ hideTabShow.label }}</p>
            </div>
            <el-dropdown placement="bottom" @command="handleCommand">
              <span class="el-dropdown-link">
                <span slot="label">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in hideTab"
                  :key="index"
                  :label="item"
                  :command="item"
                >{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="search">
        <el-input v-model="search" placeholder="搜索候选人姓名、面试公司" autocomplete="off" clearable />
        <el-button type="primary" size="mini" @click="searchList">
          <i class="el-icon-search" />
        </el-button>
      </div>
    </div>
    <listMain :list-data="listData" @getList="reloadList" />
    <!-- 分页 -->
    <div v-if="total > 0" class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNumber"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import listMain from './listMain'
import { countCandidateByStage, orderList } from '@/api/order'
export default {
  components: {
    listMain
  },
  data() {
    return {
      search: '', // 搜索关键字
      tabList: [], // tab数据
      showTab: [], // 显示的tab
      hideTab: [], // 隐藏的tab
      hideTabShow: '', // 隐藏tab要显示的文案
      activeName: '0', // 所选tab
      isActive: false,
      initStatusNo: [
        { value: '11', label: '合格待审' },
        { value: '12', label: '不合格待审' },
        { value: '13', label: '待重推' },
        { value: '14', label: '已重复' },
        { value: '15', label: '不合格' },
        { value: '16', label: '待提交HR' },
        { value: '17', label: '取消推荐' },
        { value: '21', label: '待HR反馈' },
        { value: '22', label: '评估已通过' },
        { value: '23', label: '评估未通过' },
        { value: '31', label: '待猎头约面' },
        { value: '32', label: '约面成功' },
        { value: '33', label: '约面失败' },
        { value: '34', label: '已到面' },
        { value: '35', label: '面试未到' },
        { value: '36', label: '面试通过' },
        { value: '37', label: '面试未通过' },
        { value: '38', label: '面试取消' },
        { value: '41', label: '待发offer' },
        { value: '42', label: '已发offer' },
        { value: '44', label: '放弃offer' },
        { value: '51', label: '已到岗' },
        { value: '52', label: '放弃到岗' },
        { value: '61', label: '已过保' },
        { value: '62', label: '过保关闭' }
      ],
      total: 0, // 总条数
      pageNumber: 1, // 第几页
      pageSize: 20, // 多少条
      statusNo: '', // 订单状态
      stage: '0', // 阶段
      listData: {}, // 列表数据
      a: '',
      b: ''
    }
  },
  created() {
    this.getTabList(this.$route.name)
  },
  methods: {
    reloadList() {
      this.getTabList(this.$route.name, 'reload')
    },
    getTabList(name, flag) {
      if (name === 'allOrder') {
        this.tabList = [{ value: '', label: '全部' }]
      } else if (name === 'recommendStage') {
        this.stage = '1'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '7', label: '推荐待审' },
          { value: '16', label: '待提交HR' },
          { value: '13', label: '待重推' },
          { value: '17', label: '取消推荐' },
          { value: '21', label: '待HR反馈' },
          { value: '22', label: '评估通过' }
        ]
      } else if (name === 'interviewStage') {
        this.stage = '3'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '31', label: '待猎头约面' },
          { value: '32', label: '约面成功' },
          { value: '34', label: '已到面' },
          { value: '36', label: '面试通过' },
          { value: '38', label: '取消面试' }
        ]
      } else if (name === 'offerStage') {
        this.stage = '4'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '41', label: '待发offer' },
          { value: '42', label: '已发offer' },
          { value: '44', label: '放弃offer' }
        ]
      } else if (name === 'entryStage') {
        this.stage = '5'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '51', label: '已到岗' },
          { value: '52', label: '放弃到岗' }
        ]
      } else if (name === 'overProtectionStage') {
        this.stage = '6'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '61', label: '已过保' },
          { value: '62', label: '过保关闭' }
        ]
      } else if (name === 'fail') {
        this.stage = '8'
        this.tabList = [
          { value: '', label: '全部' },
          { value: '17', label: '取消推荐' },
          { value: '38', label: '取消面试' },
          { value: '44', label: '放弃offer' },
          { value: '52', label: '放弃到岗' },
          { value: '62', label: '未过保' }
        ]
      }
      let allCount = 0
      let a = 0
      let b = 0
      countCandidateByStage({
        stage: this.stage
      }).then(res => {
        if (res.code === '000000') {
          // 对应状态订单数量
          res.data &&
            res.data.map(item => {
              allCount += item.count
              this.tabList.map(items => {
                if (parseInt(item.code) === parseInt(items.value)) {
                  items.count = item.count
                }
                if (this.stage === '1' && items.value === '7') {
                  if (parseInt(item.code) === 11) {
                    a = parseInt(item.count)
                  }
                  if (parseInt(item.code) === 12) {
                    b = parseInt(item.count)
                  }
                  items.count = a + b
                }
              })
            })
          // 订单总数量
          if (this.tabList[0].label === '全部') {
            this.tabList[0].count = allCount
          }

          this.showTab = this.tabList.slice(0, 5)
          this.hideTab = this.tabList.slice(5, this.tabList.length)
          if (!flag) {
            // if (this.tabList[1].value === '7') {
            //   this.stage = '7'
            //   this.statusNo = ''
            // } else {
            //   this.stage = ''
            //   this.statusNo = this.tabList[0].value
            // }
            this.activeName = '0'
            this.hideTabShow = this.hideTab[0]
          }
          this.getOrderList()
        }
      })
    },
    handleClick(tab) {
      this.activeName = tab.index
      this.isActive = false
      if (tab.label === '7') {
        this.stage = '7'
        this.statusNo = ''
      } else if (this.$route.name === 'recommendStage' && tab.label === '') {
        this.stage = '1'
        this.statusNo = ''
      } else if (this.$route.name === 'interviewStage' && tab.label === '') {
        this.stage = '3'
        this.statusNo = ''
      } else if (this.$route.name === 'offerStage' && tab.label === '') {
        this.stage = '4'
        this.statusNo = ''
      } else if (this.$route.name === 'entryStage' && tab.label === '') {
        this.stage = '5'
        this.statusNo = ''
      } else if (
        this.$route.name === 'overProtectionStage' &&
        tab.label === ''
      ) {
        this.stage = '6'
        this.statusNo = ''
      } else if (this.$route.name === 'fail' && tab.label === '') {
        this.stage = '8'
        this.statusNo = ''
      } else {
        this.statusNo = tab.label
        this.stage = ''
      }
      this.getOrderList()
    },
    clickTab(val) {
      this.isActive = true
      this.activeName = ''
      this.stage = ''
      this.statusNo = val
      this.getOrderList()
    },
    handleCommand(command) {
      this.hideTabShow = command
      this.activeName = command.label
      this.isActive = true
      this.stage = ''
      this.statusNo = command.value
      this.getOrderList()
    },
    searchList() {
      if (this.search) {
        this.getOrderList()
      } else {
        this.$message({
          message: '请输入查询条件',
          type: 'error'
        })
      }
    },
    getOrderList() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        statusNo: this.statusNo,
        stage: this.stage,
        searchName: this.search,
        resumeId: this.$route.query.resumeId
      }
      orderList(params).then(res => {
        if (res.code === '000000') {
          this.listData = res.data
          this.total = res.data.total
          console.log('订单数', this.total)
          if (this.$route.query.resumeId) {
            // 订单总数量
            if (this.tabList[0].label === '全部') {
              this.tabList[0].count = res.data.total
            }
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  .tabs {
    position: relative;
    .el-tabs {
      ::v-deep .el-tabs__header {
        margin-bottom: 20px;
        .el-tabs__item {
          height: 32px;
          font-size: 14px;
          line-height: 28px;
          color: #808080;
          &.is-active {
            color: #1678f9;
          }
          .nav {
            display: flex;
            flex-direction: row;
            .title {
              margin-right: 20px;
            }
            .active {
              color: #1678f9;
            }
          }
        }
        .el-tabs__nav-wrap::after {
          height: 0.5px;
          background-color: #b3b3b3;
        }
        .el-tabs__active-bar {
          height: 1px;
          background-color: #1678f9;
        }
      }
    }
    .search {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      width: 250px;
      height: 32px;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 8px;
      .el-input {
        flex: 1;
        ::v-deep .el-input__inner {
          height: 32px;
          line-height: 32px;
          background-color: transparent;
          border: none;
          padding-right: 0;
        }
        ::v-deep .el-input__suffix {
          top: -3px;
        }
      }
      .el-button {
        width: 60px;
        padding: 0;
        height: 32px;
        line-height: 32px;
        font-size: 18px;
        background-color: #d9d9d9;
        border: none;
        border-radius: 0;
      }
    }
  }
  .page {
    text-align: center;
    margin-top: 10px;
    .el-pagination.is-background .el-pager li {
      background-color: #ededed;
    }
  }
}
</style>
