<template>
  <div class="wrap">
    <!-- 顶部边栏 -->
    <div class="top-bar">
      <div class="bar-left">
        <div class="left-title">{{ selectedFolder.name }}</div>
        <div class="left-sub">{{ selectedFolder.remark }}</div>
      </div>
      <div class="bar-right">
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="search-bar">
      <div class="bar-one">
        <el-form ref="queryForm" class="query-form" :model="queryForm" :inline="true" size="mini">
          <el-form-item class="query-pos-func">
            <select-picker-three
              ref="functionType"
              form-name="queryForm"
              key-name="functionType"
              class-name="more-picker"
              placeholder="职能"
              :default-value="queryForm.functionType"
              :data-source="dictData && dictData.functions"
              :first-tab-name="dictData && dictData.functions[0].value"
              @afterClose="afterCloseFunctionType"
            />
          </el-form-item>
          <el-form-item class="query-key">
            <el-input
              v-model="queryForm.searchName"
              placeholder="请输入职位名称/目标城市/雇主名称等关键字进行搜索职位"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item class="query-btn">
            <el-button type="primary" size="mini" @click="handleSearch()">
              <i class="el-icon-search" />
            </el-button>
          </el-form-item>
        </el-form>
        <span class="one-toggle" @click="handleToggle">更多搜索条件</span>
      </div>
      <div class="bar-two">
        <el-collapse v-model="activeNames">
          <el-collapse-item title name="1">
            <!-- 热搜 -->
            <div class="hot-search">
              <span class="title">热门搜索：</span>
              <span class="result">
                <el-link
                  v-for="item in (dictData && dictData.dicts && dictData.dicts.popularSearch)"
                  :key="item.value"
                  @click="handleSearch(item.label)"
                >{{ item.label }}</el-link>
              </span>
            </div>
            <!-- 地址搜索 -->
            <div class="class-search address-search">
              <span class="title">
                城市
                <i class="el-icon-arrow-right" />
              </span>
              <span class="result">
                <el-link
                  v-for="item in popularCity"
                  :key="item.value"
                  :underline="false"
                  :class="{active: JSON.stringify(queryForm.workCityId).indexOf(JSON.stringify({type: 'workCityId', ...item})) !== -1}"
                  @click="handleSelectAddress({type: 'workCityId', ...item})"
                >{{ item.label }}</el-link>
                <el-link :underline="false" class="all-link">
                  <select-picker
                    ref="moreCity"
                    key-name="moreCity"
                    class-name="more-picker"
                    :default-value="[]"
                    :data-source="moreCity"
                    :first-tab-name="moreCity[0].value"
                    :max-number="5"
                    :level-number="2"
                    :popover-modal="true"
                    @afterClose="afterCloseMoreCity"
                  />更多城市
                  <i class="el-icon-arrow-down" />
                </el-link>
              </span>
              <!-- <span class="all">
                <el-link :underline="false">
                  <select-picker
                    ref="moreCity"
                    key-name="moreCity"
                    class-name="more-picker"
                    :default-value="[]"
                    :data-source="moreCity"
                    :first-tab-name="moreCity[0].value"
                    :max-number="5"
                    :level-number="2"
                    :popover-modal="true"
                    @afterClose="afterCloseMoreCity"
                  />更多城市
                  <i class="el-icon-arrow-down" />
                </el-link>
              </span> -->
            </div>
            <!-- 行业搜索 -->
            <div class="class-search profession-search">
              <span class="title">
                行业
                <i class="el-icon-arrow-right" />
              </span>
              <span class="result">
                <el-link
                  v-for="item in popularIndustry"
                  :key="item.value"
                  :underline="false"
                  :class="{active: JSON.stringify(queryForm.industry).indexOf(JSON.stringify({type: 'industry', ...item})) !== -1}"
                  @click="handleSelectIndustry({type: 'industry', ...item})"
                >{{ item.label }}</el-link>
                <el-link :underline="false" class="all-link">
                  <select-picker-double
                    ref="moreIndustry"
                    key-name="moreIndustry"
                    class-name="more-picker"
                    :default-value="[]"
                    :data-source="moreIndustry"
                    :first-tab-name="moreIndustry[0].value"
                    :max-number="3"
                    :level-number="2"
                    :popover-modal="true"
                    @afterClose="afterCloseMoreIndustry"
                  />更多行业
                  <i class="el-icon-arrow-down" />
                </el-link>
              </span>
              <!-- <span class="all">
                <el-link :underline="false">
                  <select-picker-double
                    ref="moreIndustry"
                    key-name="moreIndustry"
                    class-name="more-picker"
                    :default-value="[]"
                    :data-source="moreIndustry"
                    :first-tab-name="moreIndustry[0].value"
                    :max-number="3"
                    :level-number="2"
                    :popover-modal="true"
                    @afterClose="afterCloseMoreIndustry"
                  />更多行业
                  <i class="el-icon-arrow-down" />
                </el-link>
              </span> -->
            </div>
            <!-- 标签搜索 -->
            <div class="class-search tag-search">
              <span class="title">
                标签
                <i class="el-icon-arrow-right" />
              </span>
              <span class="result">
                <el-link
                  v-for="item in popularLabel"
                  :key="item.value"
                  :underline="false"
                  :class="{active: JSON.stringify(queryForm.label).indexOf(JSON.stringify({type: 'label', ...item})) !== -1}"
                  @click="handleSelectLabel({type: 'label', ...item})"
                >{{ item.label }}</el-link>
              </span>
            </div>
            <!-- 其它搜索 -->
            <div class="class-search other-search">
              <span class="title">
                其它
                <i class="el-icon-arrow-right" />
              </span>
              <span class="result">
                <el-select
                  v-model="queryForm.workYearRequired"
                  placeholder="工作经验"
                  clearable
                  @change="handleChangeWorkYearRequired"
                >
                  <el-option
                    v-for="item in (dictData && dictData.dicts && dictData.dicts.workYear)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="queryForm.degreeRequired"
                  placeholder="学历要求"
                  clearable
                  @change="handleChangeDegreeRequired"
                >
                  <el-option
                    v-for="item in (dictData && dictData.dicts && dictData.dicts.degreeRequired)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="queryForm.salaryRequired"
                  placeholder="年薪区间"
                  clearable
                  @change="handleChangeSalaryRequired"
                >
                  <el-option
                    v-for="item in (dictData && dictData.dicts &&dictData.dicts.goodAtSalary)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="queryForm.financing"
                  placeholder="融资轮次"
                  clearable
                  @change="handleChangeFinancing"
                >
                  <el-option
                    v-for="item in (dictData && dictData.dicts && dictData.dicts.financing)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="queryForm.style"
                  placeholder="企业性质"
                  clearable
                  @change="handleChangeStyle"
                >
                  <el-option
                    v-for="item in (dictData && dictData.dicts && dictData.dicts.enterpriseProperty)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
            </div>
            <!-- 已选择 -->
            <div
              v-if="functionType.length || searchName.length || queryForm.workCityId.length || queryForm.industry.length || queryForm.label.length || workYearRequired.length || degreeRequired.length || salaryRequired.length || financing.length || style.length"
              class="class-search select-search"
            >
              <span class="title">已选择</span>
              <span class="result">
                <el-tag
                  v-for="(item, index) in functionType"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in searchName"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in queryForm.workCityId"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.label }}</el-tag>
                <el-tag
                  v-for="(item, index) in queryForm.industry"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.label }}</el-tag>
                <el-tag
                  v-for="(item, index) in queryForm.label"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.label }}</el-tag>
                <el-tag
                  v-for="(item, index) in workYearRequired"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in degreeRequired"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in salaryRequired"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in financing"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-tag
                  v-for="(item, index) in style"
                  :key="index"
                  effect="dark"
                  closable
                  @close="removeParams(item)"
                >{{ item.name }}</el-tag>
                <el-link :underline="false" @click="removeParams()">清空</el-link>
                <el-link :underline="false" @click="addSubscription">常用筛选条件一键添加到订阅</el-link>
              </span>
              <!-- <span class="subscription">
                <span>常用筛选条件一键</span>
                <el-link :underline="false" @click="addSubscription">添加到订阅</el-link>
              </span> -->
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort-bar">
      <span class="total-num">共 {{ dataTableObj.total > 200 ? '200+' : dataTableObj.total }} 职位</span>
      <el-select v-model="queryForm.sortType" placeholder="排序" clearable @change="handleChangeSort">
        <el-option
          v-for="item in (dictData && dictData.dicts && dictData.dicts.positionSort)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <!-- 职位列表 -->
    <div v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-body">
          <position-item :position-info="item" @lookDetail="lookDetail" />
        </div>
      </div>
    </div>
    <!-- 列表为空 -->
    <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
      <img src="@/assets/images/position/psition_empty.png" />
      <p>抱歉，未能找到相关的职位</p>
    </div>
    <!-- 列表分页 -->
    <div
      v-if="dataTableObj.total && dataTableObj.total > dataTableObj.list.length"
      class="page-area"
    >
      <el-pagination
        ref="listPage"
        class="list-page"
        layout="prev, pager, next"
        :current-page="dataTableObj.currPage"
        :page-size="dataTableObj.pageSize"
        :total="dataTableObj.total"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 订阅模态框 -->
    <subscription ref="modalForm" @ok="modalFormOk" />
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionId"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="positionId" />
    </drawer-common>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins/position'
import selectPicker from '@/components/common/selectPicker'
import selectPickerDouble from '@/components/common/selectPickerDouble'
import selectPickerThree from '@/components/common/selectPickerThree'
import subscription from '../modules/subscription'
import positionItem from '../common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
import { getPositionList } from '@/api/position'
import filters from '@/utils/filters'
export default {
  components: {
    selectPicker,
    selectPickerDouble,
    selectPickerThree,
    subscription,
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  props: {
    // 职位类别
    positionType: {
      type: [String, Number],
      default: '',
      require: false
    },
    // 订阅条件
    subscriptionParams: {
      type: Object,
      default() {
        return {}
      },
      require: false
    },
    // 已选中的文件夹
    selectedFolder: {
      type: Object,
      default() {
        return {
          name: '全部需求',
          remark: ''
        }
      },
      require: false
    }
  },
  data() {
    return {
      // 查询条件折叠面板显示隐藏
      activeNames: ['1'],
      // 查询条件
      queryForm: {
        positionType: this.positionType,
        functionType:
          (this.subscriptionParams.queryForm &&
            this.subscriptionParams.queryForm.functionType) ||
          [],
        searchName:
          (this.subscriptionParams.queryForm &&
            this.subscriptionParams.queryForm.searchName) ||
          '',
        workCityId:
          (this.subscriptionParams.queryForm &&
            this.subscriptionParams.queryForm.workCityId) ||
          [],
        industry: [],
        label:
          (this.subscriptionParams.queryForm &&
            this.subscriptionParams.queryForm.label) ||
          [],
        workYearRequired: '',
        degreeRequired: '',
        salaryRequired:
          (this.subscriptionParams.queryForm &&
            this.subscriptionParams.queryForm.salaryRequired) ||
          '',
        financing: '',
        style: '',
        sortType: '0'
      },
      // 已选择-职能
      functionType: this.subscriptionParams.functionType || [],
      // 已选择-搜索框
      searchName: this.subscriptionParams.searchName || [],
      // 已选择-工作经验
      workYearRequired: [],
      // 已选择-学历要求
      degreeRequired: [],
      // 已选择-年薪区间
      salaryRequired: this.subscriptionParams.salaryRequired || [],
      // 已选择-融资轮次
      financing: [],
      // 已选择-企业性质
      style: []
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 城市搜索栏
    popularCity() {
      const that = this
      const result = that.dictData && that.dictData.dicts && JSON.parse(JSON.stringify(that.dictData.dicts.popularCity))
      result && result.forEach(item => {
        delete item.children
      })
      return result
    },
    // 更多城市
    moreCity() {
      const that = this
      const result = that.dictData && JSON.parse(JSON.stringify(that.dictData.areas))
      result.unshift({
        label: '热门城市',
        value: '0',
        children: that.popularCity
      })
      return result
    },
    // 行业搜索栏
    popularIndustry() {
      const that = this
      const result = that.dictData && JSON.parse(JSON.stringify(that.dictData.industry))
      result.forEach(item => {
        delete item.children
      })
      return result
    },
    // 更多行业
    moreIndustry() {
      const that = this
      const result = that.dictData && JSON.parse(JSON.stringify(that.dictData.industry))
      return result
    },
    // 标签搜索栏
    popularLabel() {
      const that = this
      const result = that.dictData && that.dictData.dicts && JSON.parse(JSON.stringify(that.dictData.dicts.positionTag))
      result.forEach(item => {
        delete item.children
      })
      return result
    }
  },
  watch: {
    subscriptionParams(val) {
      this.queryForm.functionType = (this.subscriptionParams.queryForm && this.subscriptionParams.queryForm.functionType) || []
      this.queryForm.searchName = (this.subscriptionParams.queryForm && this.subscriptionParams.queryForm.searchName) || ''
      this.queryForm.workCityId = (this.subscriptionParams.queryForm && this.subscriptionParams.queryForm.workCityId) || []
      this.queryForm.label = (this.subscriptionParams.queryForm && this.subscriptionParams.queryForm.label) || []
      this.queryForm.salaryRequired = (this.subscriptionParams.queryForm && this.subscriptionParams.queryForm.salaryRequired) || ''
      this.functionType = this.subscriptionParams.functionType || []
      this.searchName = this.subscriptionParams.searchName || []
      this.salaryRequired = this.subscriptionParams.salaryRequired || []
      this.searchList();
    }
  },
  mounted() {
    document.title = '全部需求-大猎英才'
  },
  methods: {
    // 查询条件折叠面板显示隐藏
    handleToggle() {
      if (this.activeNames.length > 0) {
        this.activeNames = []
      } else {
        this.activeNames = ['1']
      }
    },
    // 选择好职能后
    afterCloseFunctionType() {
      const functionType = this.selectedData.functionType
      if (functionType && functionType.length) {
        const code = functionType[0]
        const index = code.length / 3
        this.functionType = [
          {
            type: 'functionType',
            name:
              index === 1
                ? filters.filterCommonDict(code, this.dictData.functions)
                : filters[`filterLevel${index}`](code, this.dictData.functions)
          }
        ]
      } else {
        this.functionType = []
      }
      this.searchList()
    },
    // 点击查询按钮
    handleSearch(key) {
      if (key) {
        this.queryForm.searchName = key
      }
      const searchName = this.queryForm.searchName
      if (searchName) {
        this.searchName = [
          {
            type: 'searchName',
            name: searchName
          }
        ]
      } else {
        this.searchName = []
      }
      this.searchList()
    },
    // 选择城市
    handleSelectAddress(item) {
      if (
        JSON.stringify(this.queryForm.workCityId).indexOf(
          JSON.stringify(item)
        ) !== -1
      ) {
        this.queryForm.workCityId.forEach((cityItem, index) => {
          if (cityItem.value === item.value) {
            this.queryForm.workCityId.splice(index, 1)
          }
        })
      } else {
        if (this.queryForm.workCityId.length >= 5) {
          this.$message({
            message: '期望城市最多选择5个!',
            type: 'warning',
            showClose: true,
            center: true
          })
          return false
        } else {
          this.queryForm.workCityId.push(item)
        }
      }
      this.searchList()
    },
    // 选择好更多城市后
    afterCloseMoreCity() {
      const moreCity = this.selectedData.moreCity
      const result = []
      moreCity.forEach(item => {
        const code = item
        const index = code.length / 3
        result.push({
          type: 'workCityId',
          value: code,
          label:
            index === 1
              ? filters.filterCommonDict(code, this.dictData.areas)
              : filters[`filterLevel${index}`](code, this.dictData.areas)
        })
      })
      this.queryForm.workCityId = result
      this.searchList()
    },
    // 选择行业
    handleSelectIndustry(item) {
      if (
        JSON.stringify(this.queryForm.industry).indexOf(
          JSON.stringify(item)
        ) !== -1
      ) {
        this.queryForm.industry = []
      } else {
        this.queryForm.industry = [item]
      }
      this.searchList()
    },
    // 选择好更多行业后
    afterCloseMoreIndustry() {
      const moreIndustry = this.selectedData.moreIndustry
      const result = []
      moreIndustry.forEach(item => {
        const code = item
        const index = code.length / 3
        result.push({
          type: 'industry',
          value: code,
          label:
            index === 1
              ? filters.filterCommonDict(code, this.dictData.industry)
              : filters[`filterLevel${index}`](code, this.dictData.industry)
        })
      })
      this.queryForm.industry = result
      this.searchList()
    },
    // 选择标签
    handleSelectLabel(item) {
      if (
        JSON.stringify(this.queryForm.label).indexOf(JSON.stringify(item)) !==
        -1
      ) {
        this.queryForm.label.forEach((labelItem, index) => {
          if (labelItem.value === item.value) {
            this.queryForm.label.splice(index, 1)
          }
        })
      } else {
        this.queryForm.label.push(item)
      }
      this.searchList()
    },
    // 选择工作经验
    handleChangeWorkYearRequired(value) {
      if (value) {
        this.workYearRequired = [
          {
            type: 'workYearRequired',
            name: filters.filterCommonDict(value, this.dictData.dicts.workYear)
          }
        ]
      } else {
        this.workYearRequired = []
      }
      this.searchList()
    },
    // 选择学历要求
    handleChangeDegreeRequired(value) {
      if (value) {
        this.degreeRequired = [
          {
            type: 'degreeRequired',
            name: filters.filterCommonDict(
              value,
              this.dictData.dicts.degreeRequired
            )
          }
        ]
      } else {
        this.degreeRequired = []
      }
      this.searchList()
    },
    // 选择年薪区间
    handleChangeSalaryRequired(value) {
      if (value) {
        this.salaryRequired = [
          {
            type: 'salaryRequired',
            name: filters.filterCommonDict(
              value,
              this.dictData.dicts.goodAtSalary
            )
          }
        ]
      } else {
        this.salaryRequired = []
      }
      this.searchList()
    },
    // 选择融资轮次
    handleChangeFinancing(value) {
      if (value) {
        this.financing = [
          {
            type: 'financing',
            name: filters.filterCommonDict(value, this.dictData.dicts.financing)
          }
        ]
      } else {
        this.financing = []
      }
      this.searchList()
    },
    // 选择企业性质
    handleChangeStyle(value) {
      if (value) {
        this.style = [
          {
            type: 'style',
            name: filters.filterCommonDict(
              value,
              this.dictData.dicts.enterpriseProperty
            )
          }
        ]
      } else {
        this.style = []
      }
      this.searchList()
    },
    // 移除已选择标签
    removeParams(item) {
      if (item) {
        switch (item.type) {
          case 'functionType':
            this.$refs.functionType.clearItem()
            break
          case 'searchName':
            this.searchName = []
            this.queryForm.searchName = ''
            break
          case 'workCityId':
            this.queryForm.workCityId.forEach((cityItem, index) => {
              if (cityItem.value === item.value) {
                this.queryForm.workCityId.splice(index, 1)
              }
            })
            break
          case 'industry':
            this.queryForm.industry = []
            break
          case 'label':
            this.queryForm.label.forEach((labelItem, index) => {
              if (labelItem.value === item.value) {
                this.queryForm.label.splice(index, 1)
              }
            })
            break
          case 'workYearRequired':
            this.workYearRequired = []
            this.queryForm.workYearRequired = ''
            break
          case 'degreeRequired':
            this.degreeRequired = []
            this.queryForm.degreeRequired = ''
            break
          case 'salaryRequired':
            this.salaryRequired = []
            this.queryForm.salaryRequired = ''
            break
          case 'financing':
            this.financing = []
            this.queryForm.financing = ''
            break
          case 'style':
            this.style = []
            this.queryForm.style = ''
            break
        }
      } else {
        this.$refs.functionType.clearItem()
        this.searchName = []
        this.queryForm.searchName = ''
        this.queryForm.workCityId = []
        this.queryForm.industry = []
        this.queryForm.label = []
        this.workYearRequired = []
        this.queryForm.workYearRequired = ''
        this.degreeRequired = []
        this.queryForm.degreeRequired = ''
        this.salaryRequired = []
        this.queryForm.salaryRequired = ''
        this.financing = []
        this.queryForm.financing = ''
        this.style = []
        this.queryForm.style = ''
      }
      this.searchList()
    },
    // 添加到订阅
    addSubscription() {
      const row = {}
      // 城市
      row.cityId = this.queryForm.workCityId.length
        ? this.queryForm.workCityId[0].value
        : ''
      // 职能
      const functionType = this.selectedData.functionType
      if (functionType && functionType.length) {
        const index = functionType[0].length / 3
        row[`functionType${index}`] = functionType[0]
      }
      // 年薪
      row.annualSalary = this.queryForm.salaryRequired
      // 标签
      row.positionLabel = this.queryForm.label.length
        ? this.queryForm.label[0].value
        : ''
      this.$refs.modalForm.edit(row)
      this.$refs.modalForm.title = ''
    },
    // 订阅模态框完成后处理
    modalFormOk() {},
    // 切换排序方式
    handleChangeSort() {
      this.searchList()
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      // 职能
      const functionType = this.selectedData.functionType
      if (functionType && functionType.length) {
        const index = functionType[0].length / 3
        para[`functionType${index}`] = functionType[0]
      }
      delete para.functionType
      // 城市
      para.workCityId = para.workCityId.map(item => {
        return item.value
      })
      para.workCityId = para.workCityId.join(',')
      // 行业
      if (para.industry && para.industry.length) {
        para.industry = para.industry.map(item => {
          return item.value
        })
        const index = para.industry[0].length / 3
        para[`industrys${index}`] = para.industry.join(',')
      }
      delete para.industry
      // 标签
      para.label = para.label.map(item => {
        return item.value
      })
      para.label = para.label.join(',')
      // 年薪
      if (para.salaryRequired) {
        switch (para.salaryRequired) {
          case '1':
            para.salaryStart = 0
            para.salaryEnd = 10
            break
          case '2':
            para.salaryStart = 10
            para.salaryEnd = 30
            break
          case '3':
            para.salaryStart = 30
            para.salaryEnd = 50
            break
          case '4':
            para.salaryStart = 50
            para.salaryEnd = 70
            break
          case '5':
            para.salaryStart = 70
            para.salaryEnd = 100
            break
          case '6':
            para.salaryStart = 100
            para.salaryEnd = 150
            break
          case '7':
            para.salaryStart = 150
            para.salaryEnd = 200
            break
          case '8':
            para.salaryStart = 200
            para.salaryEnd = ''
            break
        }
      } else {
        para.salaryStart = ''
        para.salaryEnd = ''
      }
      getPositionList(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .top-bar {
    display: flex;
    height: 64px;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    background-color: #FFFFFF;
    border-bottom: 1px solid #eee;
    .bar-left{
      .left-title{
        height: 27px;
        line-height: 27px;
        font-size: 14px;
        font-weight: bold;
        color: #0D121A;
      }
      .left-sub{
        font-size: 12px;
        color: #8D9299;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .bar-right{
      flex: none;
    }
  }
  .search-bar {
    padding: 16px;
    .query-form {
      display: inline-flex;
      width: 500px;
      height: 32px;
      justify-content: space-between;
      align-items: stretch;
      background-color: #fff;
      margin: 0;
      border-radius: 2px;
      border: 1px solid #eee;
      overflow: hidden;
      vertical-align: middle;
      .el-form-item {
        margin: 0;
        &.query-pos-func {
          width: 100px;
          ::v-deep .el-input--mini .el-input__inner {
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            border: none;
            color: #4d4d4dff;
            text-align: center;
            padding: 0 25px 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &::placeholder{
              color:#606266;
            }
          }
          ::v-deep .diy-select {
            width: 100%;
            .el-icon-caret-bottom {
              display: block;
              right: 10px;
              top: 9px;
              background-size: 8px;
            }
            .el-icon-circle-close {
              right: 4px;
              top: 8px;
              background-color: #fff;
              z-index: 999;
            }
          }
        }
        &.query-key {
          flex: auto;
          ::v-deep .el-form-item__content {
            width: 100%;
            &:before {
              content: '';
              display: block;
              width: 1px;
              height: 22px;
              background-color: #ddd;
              position: absolute;
              left: 0;
              top: 5px;
            }
            .el-input__inner {
              font-size: 14px;
              height: 32px;
              line-height: 32px;
              background-color: transparent;
              border: none;
            }
          }
        }
        &.query-btn {
          width: 42px;
          .el-button {
            width: 42px;
            padding: 0;
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            background-color: #d9d9d9;
            border: none;
            border-radius: 0;
          }
        }
      }
    }
    .one-toggle{
      display: inline-block;
      font-size: 14px;
      color: #1678F9;
      cursor: pointer;
      margin-left: 16px;
      &::after {
        content: "";
        width: 16px;
        height: 16px;
        background: url('~@/assets/images/resume/arrow_d_blue.png') no-repeat;
        background-size: 16px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: -3px;
      }
    }
    .el-collapse{
      border: none;
      ::v-deep .el-collapse-item__header{
        display: none;
      }
      ::v-deep .el-collapse-item__wrap{
        border: none;
        .el-collapse-item__content{
          padding: 16px 0 0;
        }
      }
    }
  }
  .hot-search {
    font-size: 14px;
    padding: 8px 0;
    margin: -16px 0 0;
    .title {
      color: #808080;
      vertical-align: middle;
    }
    .result {
      .el-link {
        color: #4D4D4D;
        margin: 0 5px;
        &.is-underline:hover:after {
          border-color: #4D4D4D;
        }
      }
    }
  }
  .class-search {
    font-size: 14px;
    align-content: center;
    display: flex;
    .title {
      color: #808080;
      width: 60px;
      margin: 7px 0;
      flex: none;
    }
    .result {
      flex: auto;
      .el-link {
        display: inline-block;
        padding: 2px 10px;
        font-size: 14px;
        border-radius: 15px;
        margin: 3px 5px 5px 0;
        border: 2px solid transparent;
        &.active {
          color: $main-color;
        }
        &.all-link{
          position: relative;
          color: #BCBDC0;
          ::v-deep .diy-select {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
            opacity: 0;
            height: 28px;
            width: 92px;
            overflow: hidden;
          }
        }
      }
    }
    &.other-search {
      .title {
        line-height: 26px;
      }
      .result {
        .el-select {
          width: 100px;
          overflow: hidden;
          margin: 5px 0;
          ::v-deep .el-input__inner {
            height: 30px;
            line-height: 30px;
            border: none;
            &::placeholder{
              color:#606266;
            }
          }
          ::v-deep .el-input__suffix {
            right: 0;
          }
          ::v-deep .el-input__icon {
            width: 30px;
            line-height: 30px;
            color: #606266;
          }
        }
      }
    }
    &.select-search {
      .result {
        .el-tag {
          margin: 5px 15px 5px 0;
          background-color: #eee;
          border: none;
          color: #000;
          border-radius: 2px;
          height: 26px;
          line-height: 26px;
          ::v-deep .el-tag__close {
            background-color: #c6c6c6ff;
            color: #fff;
          }
        }
        .el-link {
          color: $main-color;
        }
      }
    }
    .all {
      width: 80px;
      padding-top: 8px;
      flex: none;
      text-align: right;
      overflow: hidden;
      .el-link {
        position: relative;
        color: #808080ff;
        ::v-deep .diy-select {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 10;
          opacity: 0;
          height: 20px;
          width: 80px;
          overflow: hidden;
        }
      }
    }
    .subscription {
      flex: none;
      display: flex;
      line-height: 35px;
      font-size: 12px;
      color: #808080ff;
      .el-link {
        display: block;
        color: $main-color;
        margin-left: 10px;
      }
    }
  }
  .sort-bar {
    display: flex;
    height: 44px;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    .total-num {
      font-size: 14px;
      color: #323232ff;
    }
    .el-select {
      width: 160px;
      ::v-deep .el-input__inner {
        height: 28px;
        line-height: 28px;
        border: 1px solid #eee;
        border-radius: 2px;
      }
      ::v-deep .el-input__suffix {
        right: 0;
      }
      ::v-deep .el-input__icon {
        width: 50px;
        line-height: 28px;
        color: #000000ff;
      }
    }
  }
}
</style>

