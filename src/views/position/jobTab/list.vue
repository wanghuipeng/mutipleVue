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
          <el-button
            v-if="userInfo.companyRole === 2 || userInfo.companyRole === 3 || userInfo.companyRole === 4"
            class="right-btn"
            @click="addPosition"
          ><i class="el-icon-position"></i> 新增职位</el-button>
          <!-- 职位模块，配合本次上线，需要隐藏「代招企业管理」入口 -->
          <!-- <el-button
            v-if="(userInfo.companyRole === 2 || userInfo.companyRole === 3 || userInfo.companyRole === 4) && listData && listData.length > 1"
            class="right-btn-auto"
            @click="agencyManage"
          >代招企业管理</el-button> -->
        </div>
      </div>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="bar-one">
          <el-input
            v-model="queryForm.searchName"
            placeholder="搜索职位名称/职位ID"
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
                v-model="queryForm.recruitType"
                clearable
                size="small"
                placeholder="职位类型"
                style="width: 165px"
                @change="searchList"
              >
                <el-option
                  v-for="item in dictData.dicts.recruitType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="queryForm.positionDepartment"
                filterable
                size="small"
                placeholder="招聘部门"
                style="width: 165px"
                clearable
                @change="searchList"
              >
                <el-option v-for="(item, index) in departmentArr" :key="index" :label="item.text" :value="item.value"></el-option>
              </el-select>
              <el-select
                v-model="queryForm.recruitNature"
                clearable
                size="small"
                placeholder="招聘性质"
                style="width: 165px"
                @change="searchList"
              >
                <el-option
                  v-for="item in dictData.dicts.recruitProperties"
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
              style="width: 100%"
              class="data-table"
              :data="dataTableObj.list"
              border
              fit
              highlight-current-row
              :row-class-name="tableRowClassName"
              @sort-change="sortChange"
            >
              <el-table-column
                v-if="filterArr.indexOf('positionId') !== -1"
                prop="positionId"
                label="职位ID"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <span style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;">{{ scope.row.positionId }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="filterArr.indexOf('title') !== -1" label="职位名称" align="center" min-width="180px" show-overflow-tooltip >
                <template slot-scope="scope">
                  <div class="position-info">
                    <el-popover width="80" placement="bottom-start" trigger="click">
                      <div class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="addTalent(scope.row.positionId)"
                        >添加人才</el-link>
                      </div>
                      <div style="height: 1px;background-color: #eee;margin: 5px 0;"></div>
                      <div class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="addFolder(scope.row.positionId)"
                        >加入文件夹</el-link>
                      </div>
                      <div v-if="userInfo.companyRole === 2 || userInfo.companyRole === 3 || userInfo.companyRole === 4" class="item">
                        <el-link
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="editPosition(scope.row.positionId)"
                        >编辑职位</el-link>
                        <el-link
                          v-if="scope.row.statusNo === 3"
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="changeStatus(scope.row)"
                        >结束招聘</el-link>
                        <el-link
                          v-else
                          :underline="false"
                          style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                          @click="changeStatus(scope.row)"
                        >重新开启</el-link>
                      </div>
                      <i slot="reference" class="info-btn icon iconfont icon-zhiwei-quanbuzhiwei15" @click.stop />
                    </el-popover>
                    <p class="info-main ellipsis" @click="handleRowClick(scope.row)">{{ scope.row.title }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('positionSupplierType') !== -1"
                prop="positionSupplierType"
                label="职位类型"
                align="center"
                min-width="80px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.positionSupplierType === 1" size="small" >直招</el-tag>
                  <el-tag v-if="scope.row.positionSupplierType === 2" size="small" type="warning">代招</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('positionDepartmentName') !== -1"
                prop="positionDepartmentName"
                label="部门/企业"
                align="center"
                min-width="180px"
                show-overflow-tooltip
              >
                <template slot-scope="scope" >
                  <span v-if="scope.row.positionSupplierType === 1" style="font-size:14px;color: #409eff;cursor: pointer;" @click="lookDetail(scope.row.positionId)">{{ scope.row.positionDepartmentName }}</span>
                  <span v-if="scope.row.positionSupplierType === 2" style="font-size:14px;color: #409eff;cursor: pointer;" @click="lookDetail(scope.row.positionId)">{{ scope.row.companyName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('emergencyDegree') !== -1"
                prop="emergencyDegree"
                label="紧急度"
                align="center"
                show-overflow-tooltip
                sortable="custom"
                min-width="90px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.emergencyDegree" style="font-size:14px;color:#909399;">{{ scope.row.emergencyDegree | filterCommonDict(dictData.dicts.recommendationPriority) }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('workProvinceId') !== -1"
                prop="workProvinceId"
                label="工作地点"
                align="center"
                min-width="140px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.workProvinceId" style="font-size:14px;color:#909399;">{{ scope.row.workProvinceId | filterCommonDict(dictData.areas) }}<label v-if="scope.row.workCityId">-</label>{{ scope.row.workCityId | filterLevel2(dictData.areas) }}<label v-if="scope.row.workAreaId">-</label>{{ scope.row.workAreaId | filterLevel3(dictData.areas) }}</span>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
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
                  <span style="font-size:14px;color:#909399;">{{ scope.row.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('statusNo') !== -1"
                prop="statusNo"
                label="职位状态"
                align="center"
                min-width="120px"
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
                  <el-tag v-if="scope.row.recruitmentNumber" size="small" type="info">{{ scope.row.recruitmentNumber }}</el-tag>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('allCount') !== -1"
                prop="allCount"
                label="所有简历"
                align="center"
                min-width="70px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.allCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 0)">{{ scope.row.allCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('recommendedCount') !== -1"
                prop="recommendedCount"
                label="新增简历"
                align="center"
                min-width="70px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.recommendedCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 1)">{{ scope.row.recommendedCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('interviewCount') !== -1"
                prop="interviewCount"
                label="面试人数"
                align="center"
                min-width="70px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.interviewCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 3)">{{ scope.row.interviewCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('entryCount') !== -1"
                prop="entryCount"
                label="入职人数"
                align="center"
                min-width="70px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.entryCount" type="primary" style="font-size:16px;" @click="handleRowClick(scope.row, 5)">{{ scope.row.entryCount }}</el-link>
                  <span v-else style="font-size:16px;color:#909399;">-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterArr.indexOf('recruitNature') !== -1"
                prop="recruitNature"
                label="招聘性质"
                align="center"
                min-width="120px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.recruitNature | filterCommonDict(dictData.dicts.recruitProperties) }}</span>
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
                v-if="filterArr.indexOf('createName') !== -1"
                prop="createName"
                label="招聘负责人"
                align="center"
                min-width="100px"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.createName }}</span>
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

    <!-- 公司管理（抽屉） -->
    <drawer-common :drawer.sync="companyDialog" :no-new-window="true">
      <company v-if="companyDialog" slot="inner-body" />
    </drawer-common>

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
import { mapState } from 'vuex'
import { TableMixin } from '@/mixins/position'
import addFromTalentPool from '@/views/order/candidate/addTalent/addFromTalentPool'
import singleFolder from '@/components/folder/singleFolder'
import { getCPositionByUserId, getCPositionByUserIdOfGB, getSelectDeptList, editPositionStatus,
listUserTableFields,
updateUserTableFields
} from '@/api/position'
import DrawerCommon from '@/components/common/drawerCommon'
import company from '@/views/company'
import { getCompanyList } from '@/api/company'
import positionDetail from '../positionDetail'

export default {
  components: {
    addFromTalentPool,
    singleFolder,
    DrawerCommon,
    company,
    positionDetail
  },
  mixins: [TableMixin],
  props: {
    // 文件夹ID
    folderId: {
      type: null,
      required: true
    }
  },
  data() {
    return {
      filterArr: [],
      filterOptionsName: [{
          value: 'positionId',
          label: '职位ID'
        },
        {
          value: 'title',
          label: '职位名称'
        }, {
          value: 'positionSupplierType',
          label: '职位类型'
        }, {
          value: 'positionDepartmentName',
          label: '部门/企业'
        }, {
          value: 'emergencyDegree',
          label: '紧急度'
        }, {
          value: 'workProvinceId',
          label: '工作地点'
        }, {
          value: 'salaryStart',
          label: '薪资'
        }, {
          value: 'degreeRequired',
          label: '学历'
        }, {
          value: 'statusNo',
          label: '职位状态'
        }, {
          value: 'recruitmentNumber',
          label: '招聘人数'
        }, {
          value: 'allCount',
          label: '所有简历'
        }, {
          value: 'recommendedCount',
          label: '新增简历'
        }, {
          value: 'interviewCount',
          label: '面试人数'
        }, {
          value: 'entryCount',
          label: '入职人数'
        }, {
          value: 'recruitNature',
          label: '招聘性质'
        }, {
          value: 'functionType1',
          label: '职能类型'
        }, {
          value: 'createName',
          label: '招聘负责人'
        }, {
          value: 'releaseDate',
          label: '发布时间'
        }, {
          value: 'updateTime',
          label: '更新时间'
        }
      ],
      filterOptions: [],
      companyDialog: false,
      // 是否显示添加人才模态框
      talentPoolVisible: false,
      // 查询条件折叠面板显示隐藏
      activeNames: [],
      // 招聘部门数据源
      departmentArr: [],
      // 查询类型
      queryType: 1,
      // 已选中的文件夹
      selectedFolder: {
        name: '进行中职位',
        remark: ''
      },
      // 查询条件
      queryForm: {
        searchName: this.$route.query.searchName || '',
        recruitType: '',
        positionDepartment: '',
        recruitNature: ''
      },
      listData: [],
      positionDetailVisible: false,
      orderType: null
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
    this.getList()
    // 查询部门下拉
    this.queryDepartment()
  },
  methods: {
    sortChange(e) {
      const { order, prop } = e
      if (e) {
        this.orderType = Object.create(null)
      }
      this.orderType[prop] = order === 'ascending' ? 1 : 2
      this.searchList()
     console.log(this.orderType)
    },
    // 打开详情模态框
    lookDetail(id) {
      console.log(id)
      this.positionId = id
      this.positionDetailVisible = true
    },
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
          tableCode: 'PositionList',
          userTableFieldDTO
        }
        updateUserTableFields(params).then(res => {
          const { success } = res
          if (success) {
            return
          }
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
    // 获取筛选字段
    listUserTableFields() {
      const params = {
        tableCode: 'PositionList' // ProjectList（项目），PositionList（职位）
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
        // 去重
        this.filterOptions = this.deteleObject(this.filterOptions)
      })
    },
    // 公司列表
    getList() {
      const params = {
        companyId: this.userInfo.companyId
      }
      getCompanyList(params).then(res => {
        this.listData = res.data
      })
    },
    // 代招企业管理
    agencyManage() {
      this.companyDialog = true
    },
    // 发布职位
    addPosition() {
      if (this.userInfo.companyPublishPositionBalance) {
        if (this.$props.folderId) {
          sessionStorage.setItem('clearSession', 0)
          this.$router.push({ name: 'releasePosition', query: { folderIds: this.$props.folderId } })
        } else {
          this.$router.push({ name: 'releasePosition' })
        }
      } else {
        this.$message({
          message: '您所在企业的发布职位数量已达上限，请联系客服更改套餐内容。',
          type: 'warning'
        });
      }
    },
    // 查询条件折叠面板显示隐藏
    handleToggle() {
      if (this.activeNames.length > 0) {
        this.activeNames = []
      } else {
        this.activeNames = ['1']
      }
    },
    // 查询部门下拉
    queryDepartment() {
      const para = {}
      getSelectDeptList(para).then(res => {
        this.departmentArr = res.data;
      })
    },
    // 表格行状态
    tableRowClassName({ row, rowIndex }) {
      if (row.statusNo === 4) {
        return 'grey-row';
      }
      return '';
    },
    // 添加人才
    addTalent(id) {
      this.positionId = id;
      this.talentPoolVisible = true;
    },
    // 加入文件夹
    addFolder(id) {
      this.$refs.modalSingleFolder.edit({ fileId: id })
      this.$refs.modalSingleFolder.title = '加入文件夹'
    },
    // 编辑职位
    editPosition(id) {
      this.$router.push({ name: 'releasePosition', query: { positionId: id } })
    },
    // 切换职位状态
    changeStatus(row) {
      // 对上架进行认证状态判断
      if (row.statusNo === 4) {
        if (this.userInfo.companyCertificationStatus === 0 || this.userInfo.companyCertificationStatus === 3) {
          this.$confirm(
            '根据平台用户规则，您需要预先完成企业信息认证才可以上架职位',
            '企业未认证',
            {
              type: 'warning',
              confirmButtonText: '立即认证'
            }
          )
            .then(() => {
              this.$router.push('/certification');
            })
            .catch(() => {})
            return;
        }
        if (this.userInfo.companyCertificationStatus === 2) {
          this.$alert(
            '您的企业信息正在认证中，认证通过后即可上架企业职位',
            '企业认证中',
            {
              type: 'warning'
            }
          )
            .then(() => {})
            return;
        }
      }
      this.$confirm(
        row.statusNo === 3
          ? '结束招聘该职位后，候选人将无法再查看职位的信息'
          : '重新开启该职位后，候选人将可以继续查看职位的信息',
        row.statusNo === 3 ? '结束招聘提示' : '重新开启提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          const para = {}
          para.id = row.positionId
          para.statusNo = row.statusNo === 3 ? 4 : 3
          editPositionStatus(para).then(res => {
            this.searchList()
          })
        })
        .catch(() => {})
    },
    // 点击职位整行
    handleRowClick(row, orderTab = 0) {
      this.$router.push({
        path: '/jobDetail',
        query: {
          positionId: row.positionId,
          tab: 'resume',
          orderTab: orderTab
        }
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      para.folderId = this.selectedFolder.id
      para.orderType = this.orderType
      let api = null;
      if (this.queryType === 1 || this.queryType === 2) {
        api = getCPositionByUserId;
      } else {
        api = getCPositionByUserIdOfGB;
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
    padding: 0 30px 0 15px;
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
        .right-btn{
          width: 92px;
          height: 28px;
          padding: 0;
          line-height: 28px;
          font-size: 14px;
          color: #1678F9;
          border-color: #1678F9;
          border-radius: 1px;
          margin-left: 16px;
        }
        .right-btn-auto{
          width:auto;
          padding: 0 10px;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          color: #1678F9;
          border-color: #1678F9;
          border-radius: 1px;
          margin-left: 16px;
        }
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

