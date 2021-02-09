<template>
  <div>
    <div class="wrap">
      <!-- 上面板 -->
      <div class="panel">
        <div class="panel-body">
          <router-link to="/position/all" tag="div" class="position-item">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu151" />
            </span>
            <span class="item-name">全部需求</span>
            <span class="item-badge">{{ totalObj.ALL }}</span>
          </router-link>
          <router-link to="/position/hunter" tag="div" class="position-item">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu12" />
            </span>
            <span class="item-name">猎头职位</span>
            <span class="item-badge">{{ totalObj.HH }}</span>
          </router-link>
          <router-link to="/position/rpo" tag="div" class="position-item">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu6" />
            </span>
            <span class="item-name">RPO职位</span>
            <span class="item-badge">{{ totalObj.RPO }}</span>
          </router-link>
          <div class="position-item static">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu133" />
            </span>
            <span class="item-name">我的订阅</span>
            <span class="item-badge" style="right: 33px;cursor: pointer;" @click="handleAdd">
              <i class="icon iconfont icon-jiahao" style="font-size: 22px;" />
            </span>
          </div>
          <div v-for="(item, index) in subscriptionList" :key="index" class="position-item static-item">
            <span
              class="item-name ellipsis"
              style="width: 100%;font-weight: normal;"
              @click="toAllPosition(item)"
            >{{ item.name }}</span>
            <span class="item-badge">{{ item.positionCount }}</span>
            <span class="item-btn">
              <el-popover placement="bottom-end" width="80" trigger="click">
                <div class="item">
                  <el-link
                    :underline="false"
                    style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                    @click="handleModify(item)"
                  >编辑</el-link>
                </div>
                <div class="item">
                  <el-link
                    :underline="false"
                    style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                    @click="handleDel(item)"
                  >删除</el-link>
                </div>
                <i slot="reference" class="icon iconfont icon-zhiwei-quanbuzhiwei15" />
              </el-popover>
            </span>
          </div>
          <div v-if="!subscriptionList.length" style="padding: 0 20px;font-size: 12px;font-style: italic;color: #909399;">您可以根据自己的需求创建订阅条件，分门别类查询数据</div>
          <router-link to="/position/browse" tag="div" class="position-item" style="margin-top: 6px;">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu142" />
            </span>
            <span class="item-name">最近浏览</span>
          </router-link>
          <!-- <router-link to="/position/wholeStatistics" tag="div" class="position-item" style="margin-top: 6px;">
            <span class="item-icon">
              <i class="icon iconfont icon-bianzu142" />
            </span>
            <span class="item-name">全局统计</span>
          </router-link> -->
        </div>
      </div>
    </div>
    <!-- 订阅模态框 -->
    <subscription ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import subscription from '../modules/subscription'
import {
  getPositionCount,
  getPositionSubscribeRecordList,
  deleteById
} from '@/api/position'
import filters from '@/utils/filters'
export default {
  components: {
    subscription
  },
  data() {
    return {
      // 查询条件
      queryForm: {},
      // 统计对象
      totalObj: {},
      // 订阅列表
      subscriptionList: []
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    // 查询统计对象
    this.queryTotalObj()
    // 查询订阅
    this.searchList()
  },
  methods: {
    // 查询统计对象
    queryTotalObj() {
      const para = {}
      getPositionCount(para).then(res => {
        this.totalObj = res.data
      })
    },
    // 跳转全部职位页面
    toAllPosition(row) {
      const data = {}
      data.queryForm = {}
      // 名称
      data.name = row.name
      // 城市
      const cityId = row.cityId
      if (cityId) {
        const index = cityId.length / 3
        data.queryForm.workCityId = [
          {
            type: 'workCityId',
            value: cityId,
            label:
              index === 1
                ? filters.filterCommonDict(cityId, this.dictData.areas)
                : filters[`filterLevel${index}`](cityId, this.dictData.areas)
          }
        ]
      }
      // 职能
      const functionType =
        row.functionType1 || row.functionType2 || row.functionType3
      if (functionType) {
        data.queryForm.functionType = [functionType]
        const index = functionType.length / 3
        data.functionType = [
          {
            type: 'functionType',
            name:
              index === 1
                ? filters.filterCommonDict(
                    functionType,
                    this.dictData.functions
                  )
                : filters[`filterLevel${index}`](
                    functionType,
                    this.dictData.functions
                  )
          }
        ]
        this.$store.commit('setSelectedData', { functionType: [functionType] })
      }
      // 公司
      const companyName = row.companyName
      if (companyName) {
        data.queryForm.searchName = companyName
        data.searchName = [
          {
            type: 'searchName',
            name: companyName
          }
        ]
      }
      // 年薪
      if (row.annualSalaryStart) {
        switch (row.annualSalaryStart) {
          case 0:
            data.queryForm.salaryRequired = '1'
            break
          case 10:
            data.queryForm.salaryRequired = '2'
            break
          case 30:
            data.queryForm.salaryRequired = '3'
            break
          case 50:
            data.queryForm.salaryRequired = '4'
            break
          case 70:
            data.queryForm.salaryRequired = '5'
            break
          case 100:
            data.queryForm.salaryRequired = '6'
            break
          case 150:
            data.queryForm.salaryRequired = '7'
            break
          case 200:
            data.queryForm.salaryRequired = '8'
            break
        }
      } else {
        data.queryForm.salaryRequired = ''
      }
      data.salaryRequired = [
        {
          type: 'salaryRequired',
          name: filters.filterCommonDict(
            data.queryForm.salaryRequired,
            this.dictData.dicts.goodAtSalary
          )
        }
      ]
      // 标签
      const positionLabel = row.positionLabel
      if (positionLabel) {
        data.queryForm.label = [
          {
            type: 'label',
            value: positionLabel,
            label: filters.filterCommonDict(
              positionLabel,
              this.dictData.dicts.positionTag
            )
          }
        ]
      }
      this.$store.dispatch('dispatchUpdateSubscriptionParams', data)
      this.$router.push({
        name: 'subscription'
      })
    },
    // 查询订阅
    searchList() {
      const para = Object.assign({}, this.queryForm)
      getPositionSubscribeRecordList(para).then(res => {
        this.subscriptionList = res.data
      })
    },
    // 添加订阅
    handleAdd() {
      this.$refs.modalForm.edit({})
      this.$refs.modalForm.title = ''
    },
    // 修改订阅
    handleModify(row) {
      this.$refs.modalForm.edit(row)
      this.$refs.modalForm.title = ''
    },
    // 删除订阅
    handleDel(row) {
      this.$confirm('确认删除', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {}
          para.id = row.id
          deleteById(para).then(res => {
            this.searchList()
          })
        })
        .catch(() => {})
    },
    // 订阅模态框完成后处理
    modalFormOk() {
      this.searchList()
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  width: 240px;
  .panel {
    padding: 10px 0;
    .panel-body {
      .position-item {
        height: 40px;
        padding: 0 38px;
        line-height: 40px;
        color: #4d4d4dff;
        position: relative;
        cursor: pointer;
        margin-bottom: 6px;
        &:hover{
          background-color: #F5F7FA;
          .item-btn {
            visibility: visible;
          }
        }
        &.static{
          cursor: default;
          margin-bottom: 0;
          &:hover{
            background-color: transparent;
          }
        }
        &.static-item{
          margin-bottom: 0;
        }
        .item-icon {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          position: absolute;
          left: 10px;
          top: 5px;
          .icon {
            font-size: 19px;
          }
        }
        .item-name {
          box-sizing: border-box;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          padding-left: 10px;
          padding-right: 30px;
        }
        .item-badge {
          font-size: 14px;
          color: #0D121A;
          position: absolute;
          right: 40px;
          top: 0;
        }
        .item-btn {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          position: absolute;
          right: 8px;
          top: 5px;
          cursor: pointer;
          visibility: hidden;
        }
      }
    }
  }
}
</style>

