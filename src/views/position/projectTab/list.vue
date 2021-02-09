<template>
  <div class="wrap">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 顶部边栏 -->
      <div class="top-bar">
        <div class="bar-left">
          <div class="left-title">{{ selectedFolder.name }}</div>
          <div class="left-sub">{{ selectedFolder.remark }}</div>
        </div>
        <div class="bar-right">
        </div>
      </div>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="bar-one">
          <el-input
            v-model="queryForm.searchName"
            placeholder="搜索职位名称"
            clearable
            @keyup.enter.native="searchList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
          </el-input>
          <span class="one-toggle" @click="handleToggle">更多搜索条件</span>
          <div class="filter-keywords">
            <i class="filter-icon"></i>
            <el-select v-model="filterArr" multiple popper-class="filter-keywords-select" @change="changeFilter">
              <el-option
                v-for="item in filterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="bar-two">
          <el-collapse v-model="activeNames">
            <el-collapse-item title name="1">
              <el-select
                v-model="queryForm.companyId"
                filterable
                size="small"
                placeholder="招聘企业"
                style="width: 165px"
                clearable
                @change="searchList"
              >
                <el-option v-for="(item, index) in companyArr" :key="index" :label="item.text" :value="item.value"></el-option>
              </el-select>
              <el-select
                v-model="queryForm.positionType"
                clearable
                size="small"
                placeholder="项目类型"
                style="width: 165px"
                @change="searchList"
              >
                <el-option
                  v-for="item in dictData.dicts.positionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- 职位列表 -->
      <div class="list-area">
        <div class="list-item">
          <div class="item-body">
            <el-table
              ref="dataTable"
              v-loading="loading"
              class="data-table"
              :data="dataTableObj.list"
              border
              fit
              highlight-current-row
              :row-class-name="tableRowClassName"
            >
              <el-table-column v-if="filterArr.indexOf('title') !== -1" label="职位名称" align="center" min-width="200px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="position-info">
                    <el-popover width="80" placement="bottom-start" trigger="click">
                      <div class="item">
                        <el-link
                          v-if="scope.row.positionType === 2"
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="addTalent(scope.row.positionId)"
                        >新增推荐</el-link>
                        <el-link
                          v-if="scope.row.positionType === 1"
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="nowRecommend(scope.row.positionId)"
                        >新增推荐</el-link>
                      </div>
                      <div style="height: 1px;background-color: #eee;margin: 5px 0;"></div>
                      <div class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="addFolder(scope.row.positionId)"
                        >加入文件夹</el-link>
                      </div>
                      <div class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="recommendCheck(scope.row)"
                        >推荐查重</el-link>
                      </div>
                      <div v-if="scope.row.releaseProperties === 1 && (userInfo.companyRole === 3 || userInfo.companyRole === 4)" class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="quitProject(scope.row)"
                        >退出项目</el-link>
                      </div>
                      <i slot="reference" class="info-btn icon iconfont icon-zhiwei-quanbuzhiwei15" @click.stop />
                    </el-popover>
                    <p class="info-main ellipsis" @click="handleRowClick(scope.row,0,queryType)">{{ scope.row.title }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('emergencyDegree') !== -1"
                prop="emergencyDegree"
                label="紧急度"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.emergencyDegree | filterCommonDict(dictData.dicts.recommendationPriority) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('companyName') !== -1"
                prop="companyName"
                label="招聘企业"
                align="center"
                min-width="200px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.companyName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('workProvinceId') !== -1"
                prop="workProvinceId"
                label="工作地点"
                align="center"
                min-width="180px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.workProvinceId | filterCommonDict(dictData.areas) }}<label v-if="scope.row.workCityId">-</label>{{ scope.row.workCityId | filterLevel2(dictData.areas) }}<label v-if="scope.row.workAreaId">-</label>{{ scope.row.workAreaId | filterLevel3(dictData.areas) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('positionType') !== -1"
                prop="positionType"
                label="项目类型"
                align="center"
                min-width="80px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.positionType | filterCommonDict(dictData.dicts.positionType) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('statusNo') !== -1"
                prop="statusNo"
                label="职位状态"
                align="center"
                min-width="90px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.statusNo === 3" size="small" type="success">进行中</el-tag>
                  <el-tag v-if="scope.row.statusNo === 4" size="small" type="info">已结束</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('recruitmentNumber') !== -1"
                prop="recruitmentNumber"
                label="招聘人数"
                align="center"
                min-width="70px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-tag size="small" type="info">{{ scope.row.recruitmentNumber || 0 }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('recommendedCount') !== -1"
                prop="recommendedCount"
                label="推荐"
                align="center"
                min-width="60px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.recommendedCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 0)">{{ scope.row.recommendedCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('interviewCount') !== -1"
                prop="interviewCount"
                label="面试"
                align="center"
                min-width="60px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.interviewCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 0)">{{ scope.row.interviewCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('entryCount') !== -1"
                prop="entryCount"
                label="入职"
                align="center"
                min-width="60px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.entryCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 6)">{{ scope.row.entryCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('day') !== -1"
                prop="day"
                label="进行天数"
                align="center"
                min-width="80px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.day || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('salaryStart') !== -1"
                prop="salaryStart"
                label="薪资"
                align="center"
                min-width="100px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.salaryType === 1" style="font-size:14px;color:#909399;">
                    {{ scope.row.salaryStart / 10000 }}<span v-if="scope.row.salaryStart !== scope.row.salaryEnd">-{{ scope.row.salaryEnd / 10000 }}</span>万/年
                  </span>
                  <span v-if="scope.row.salaryType === 2 && scope.row.monthlySalaryRegime" style="font-size:14px;color:#909399;">
                    {{ scope.row.salaryStart / 1000 }}<span v-if="scope.row.salaryStart !== scope.row.salaryEnd">-{{ scope.row.salaryEnd / 1000 }}</span>K*{{ scope.row.monthlySalaryRegime }}薪
                  </span>
                  <span v-if="scope.row.salaryType === 2 && !scope.row.monthlySalaryRegime" style="font-size:14px;color:#909399;">
                    {{ scope.row.salaryStart / 1000 }}<span v-if="scope.row.salaryStart !== scope.row.salaryEnd">-{{ scope.row.salaryEnd / 1000 }}</span>K/月
                  </span>
                  <span v-if="scope.row.salaryType === 3" style="font-size:14px;color:#909399;">
                    {{ scope.row.salaryStart }}<span v-if="scope.row.salaryStart !== scope.row.salaryEnd">-{{ scope.row.salaryEnd }}</span>元/天
                  </span>
                  <span v-if="scope.row.salaryType === 4" style="font-size:14px;color:#909399;">
                    {{ scope.row.salaryStart }}<span v-if="scope.row.salaryStart !== scope.row.salaryEnd">-{{ scope.row.salaryEnd }}</span>元/小时
                  </span>
                  <span v-if="scope.row.salaryType === 5" style="font-size:14px;color:#909399;">
                    面议
                  </span>
                  <span v-if="scope.row.salaryType === null" style="font-size:14px;color:#909399;">
                    -
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('degreeRequired') !== -1"
                prop="degreeRequired"
                label="学历"
                align="center"
                min-width="100px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.degreeRequired" style="font-size:14px;color:#909399;">{{ scope.row.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('functionType1') !== -1"
                prop="functionType1"
                label="职能类型"
                align="center"
                min-width="180px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.functionType1" style="font-size:14px;color:#909399;">{{ scope.row.functionType1 | filterCommonDict(dictData.functions) }}-{{ scope.row.functionType2 | filterLevel2(dictData.functions ) }}-{{ scope.row.functionType3 | filterLevel3(dictData.functions) }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('releaseDate') !== -1"
                prop="releaseDate"
                label="发布时间"
                align="center"
                min-width="120px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.releaseDate" style="font-size:14px;color:#909399;">{{ scope.row.releaseDate | filterDateTime }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('updateTime') !== -1"
                prop="updateTime"
                label="更新时间"
                align="center"
                min-width="120px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime" style="font-size:14px;color:#909399;">{{ scope.row.updateTime }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
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
    </div>
    <!-- 从人才库导入 -->
    <add-from-talent-pool
      v-if="talentPoolVisible"
      :dialog.sync="talentPoolVisible"
      :position-id="positionId"
    />
    <!-- 单个文件夹 -->
    <single-folder ref="modalSingleFolder" :company-folder-type="1"></single-folder>
    <!-- 推荐查重模态框 -->
    <recommend-check ref="modalForm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { TableMixin } from '@/mixins/position'
import addFromTalentPool from '@/views/order/candidate/addTalent/addFromTalentPool'
import singleFolder from '@/components/folder/singleFolder'
import recommendCheck from '../modules/recommendCheck'
import { getSPositionByUserId, getSPositionByUserIdOfGB, selectSulipperCompany, signOutPosition,
listUserTableFields,
updateUserTableFields } from '@/api/position'
export default {
  components: {
    addFromTalentPool,
    singleFolder,
    recommendCheck
  },
  mixins: [TableMixin],
  props: {},
  data() {
    return {
      filterArr: [],
      filterOptionsName: [
        {
          value: 'title',
          label: '职位名称'
        }, {
          value: 'emergencyDegree',
          label: '紧急度'
        }, {
          value: 'companyName',
          label: '招聘企业'
        }, {
          value: 'workProvinceId',
          label: '工作地点'
        }, {
          value: 'positionType',
          label: '项目类型'
        }, {
          value: 'statusNo',
          label: '职位状态'
        }, {
          value: 'recruitmentNumber',
          label: '招聘人数'
        }, {
          value: 'recommendedCount',
          label: '推荐'
        }, {
          value: 'interviewCount',
          label: '面试'
        }, {
          value: 'entryCount',
          label: '入职'
        }, {
          value: 'day',
          label: '进行天数'
        }, {
          value: 'salaryStart',
          label: '薪资'
        }, {
          value: 'degreeRequired',
          label: '学历'
        }, {
          value: 'functionType1',
          label: '职能类型'
        }, {
          value: 'releaseDate',
          label: '发布时间'
        }, {
          value: 'updateTime',
          label: '更新时间'
        }
      ],
      filterOptions: [],
      // 是否显示添加人才模态框
      talentPoolVisible: false,
      // 查询条件折叠面板显示隐藏
      activeNames: [],
      // 招聘企业数据源
      companyArr: [],
      // 查询类型
      queryType: 1,
      // 已选中的文件夹
      selectedFolder: {
        name: '进行中项目',
        remark: ''
      },
      // 查询条件
      queryForm: {
        searchName: '',
        companyId: '',
        positionType: ''
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      }
    }),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    this.listUserTableFields()
    // 查询企业下拉
    this.queryCompany()
  },
  methods: {
    // 筛选过滤显示
    changeFilter(e) {
        const userTableFieldDTO = []
        this.filterOptions && this.filterOptions.filter(item => {
          if (e.indexOf(item.value) !== -1) {
            userTableFieldDTO.push({
              fieldCode: item.value,
              showType: 1
            })
          } else {
            userTableFieldDTO.push({
              fieldCode: item.value,
              showType: 0
            })
          }
        })
        const params = {
          tableCode: 'ProjectList',
          userTableFieldDTO
        }
        updateUserTableFields(params).then(res => {
          const { success } = res
          if (success) {
            return
          }
        })
    },
    // 获取筛选字段
    listUserTableFields() {
      const params = {
        tableCode: 'ProjectList' // ProjectList（项目），PositionList（职位）
      }
      listUserTableFields(params).then(res => {
        // 生成所有的
        this.filterOptionsName && this.filterOptionsName.forEach(element => {
          res.data && res.data.filter(item => {
            if (item.fieldCode === element.value) {
              this.filterOptions.push({
                value: item.fieldCode,
                label: element.label,
                showType: item.showType
              })
            }
          })
        })
        // 生成选中的
        this.filterOptions && this.filterOptions.filter(item => {
          if (item.showType) {
            this.filterArr.push(item.value)
          }
        })
      })
    },
    // 立即推荐
    nowRecommend(positionId) {
      this.$router.push(`/recommendResume?positionId=${positionId}`)
    },
    // 查询条件折叠面板显示隐藏
    handleToggle() {
      if (this.activeNames.length > 0) {
        this.activeNames = []
      } else {
        this.activeNames = ['1']
      }
    },
    // 查询企业下拉
    queryCompany() {
      const para = {}
      selectSulipperCompany(para).then(res => {
        this.companyArr = res.data;
      })
    },
    // 表格行状态
    tableRowClassName({ row, rowIndex }) {
      if (row.statusNo === 4) {
        return 'grey-row';
      }
      return '';
    },
    // 新增推荐
    addTalent(id) {
      this.positionId = id;
      this.talentPoolVisible = true;
    },
    // 加入文件夹
    addFolder(id) {
      this.$refs.modalSingleFolder.edit({ fileId: id })
      this.$refs.modalSingleFolder.title = '加入文件夹'
    },
    // 推荐查重
    recommendCheck(row) {
      this.$refs.modalForm.edit(row)
    },
    // 退出项目
    quitProject(row) {
      this.$confirm(
        '是否确认退出该项目',
        '退出项目提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          const para = {}
          para.positionId = row.positionId
          signOutPosition(para).then(res => {
            this.searchList()
          })
        })
        .catch(() => {})
    },
    // 点击项目整行
    handleRowClick(row, orderTab = 0, queryType) {
      this.$router.push({
        path: '/projectDetail',
        query: {
          positionId: row.positionId,
          tab: 'resume',
          orderTab: orderTab,
          queryType // 3已结束
        }
      })
    },
    // 查询项目列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      para.folderId = this.selectedFolder.id
      let api = null;
      if (this.queryType === 1 || this.queryType === 2) {
        api = getSPositionByUserId;
      } else {
        api = getSPositionByUserIdOfGB;
      }
      api(para).then(res => {
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
.filter-keywords-select {
  .el-select-dropdown__item{
    width: auto !important;
    padding: 0 42px 0 15px;
  }
  .el-select-dropdown__item{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}
.wrap {
  .filter-keywords{
    position: absolute;
    right: 85px;
    top:5px;
    .el-select{
      width: 20px;
    }
    ::v-deep input{
      opacity: 0;
      width: 110px;
      height: 30px !important;
    }
    ::v-deep .el-input__suffix{
      width: 20px;
      height: 20px;
      right: 0px;
      top: 0px;
      opacity: 0;
    }
    ::v-deep .el-select__tags{
      display: none;
    }
    .filter-icon{
      width: 32px;
      height: 32px;
      background: url('~@/assets/images/common/filter.png') no-repeat;
      background-size: 32px;
      display: inline-block;
      cursor: pointer;
      position: absolute;
      right: -87px;
      &::before{
        content: "";
        width: 78px;
        position: absolute;
        left: -75px;
        height: 30px;
        z-index: 10;
      }
    }
  }
  .main-content {
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
      .bar-one{
        position: relative;
        .el-input{
          width: 400px;
          ::v-deep .el-input__inner{
            height: 32px;
            line-height: 32px;
            border-radius: 2px 0 0 2px;
            border: 1px solid #eee;
          }
          ::v-deep .el-input-group__append{
            background-color: #d9d9d9;
            color: #FFFFFF;
            border-color: #eee;
            border-radius: 0 2px 2px 0;
            .el-button{
              width: 40px;
              height: 32px;
              padding: 0;
              text-align: center;
              line-height: 32px;
              font-size: 16px;
            }
          }
          ::v-deep .el-input__icon{
            line-height: 32px;
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
      }
      .bar-two{
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
          .el-select {
            margin-right: 10px;
            ::v-deep .el-input__inner{
              border: 1px solid #eee;
            }
          }
        }
      }
    }
    ::v-deep .el-table__header-wrapper,
    ::v-deep .el-table__fixed-right {
      .el-table__header {
        th {
          font-size: 12px;
        }
      }
    }
    ::v-deep .el-table__body-wrapper,
    ::v-deep .el-table__fixed-right {
      .el-table__body {
        .grey-row{
          background-color: #f9f9f9;
        }
        td {
          font-size: 12px;
        }
      }
    }
    .position-info {
      display: flex;
      align-items: center;
      &:hover{
        .info-btn{
          visibility: visible;
        }
      }
      .info-btn{
        flex: none;
        display: block;
        width: 40px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        font-size: 18px;
        color: #626466;
        cursor: pointer;
        margin-right: 5px;
        visibility: hidden;
      }
      .info-main {
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        color:#409eff;
        cursor: pointer;
      }
    }
  }
}
</style>

