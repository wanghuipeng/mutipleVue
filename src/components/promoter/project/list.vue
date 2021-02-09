<template>
  <div class="wrap customer-wrap">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 顶部边栏 -->
      <div class="top-bar">
        <div class="bar-left">
          <div class="left-title">项目管理</div>
          <div class="left-sub">企业主在这里可以管理合作客户的所有执行项目信息，设定促销任务并下发到促销员终端，通过项目汇总管理所有促销员上传数据</div>
        </div>
        <div class="bar-right">
          <el-button
            v-if="userInfo.companyAccountType !== 3"
            class="right-btn"
            @click="addProject"
          ><i class="el-icon-plus"></i> 新增项目</el-button>
        </div>
      </div>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="bar-two">
          <el-select
            v-model="queryForm.businessType"
            clearable
            size="small"
            placeholder="项目类型"
            style="width: 125px;margin-right:15px"
            @change="searchList"
          >
            <el-option
              v-for="item in dictData.dicts.promoterProjectBusinessType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="queryForm.statusNo"
            clearable
            size="small"
            placeholder="执行状态"
            style="width: 125px"
            @change="searchList"
          >
            <el-option
              v-for="item in dictData.dicts.promoterStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="bar-one">
          <el-input
            v-model="queryForm.searchName"
            placeholder="搜索项目名称"
            clearable
            size="small"
            @keyup.enter.native="searchList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 项目列表 -->
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
              highlight-current-row
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="项目名称" prop="projectName" align="center" min-width="180px" show-overflow-tooltip >
                <template slot-scope="scope">
                  <div class="position-info">
                    <p class="info-main ellipsis" @click="toDetail(`/promoterProjectDetail?projectId=${scope.row.projectId}`)">{{ scope.row.projectName }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="项目类型" prop="businessType" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.businessType | filterCommonDict(dictData.dicts.promoterProjectBusinessType) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="客户" prop="companyName" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.companyName }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="statusNo"
                label="执行状态"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.statusNo === 1" size="small" type="success">草稿</el-tag>
                  <el-tag v-if="scope.row.statusNo === 2" size="small" type="primary">执行中</el-tag>
                  <el-tag v-if="scope.row.statusNo === 3" size="small" type="info">已结束</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="monthTaskCount"
                label="本月任务"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.monthTaskCount }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="monthTaskProgress"
                label="本月进度"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.monthTaskProgress }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="promoterUserCount"
                label="促销员"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.promoterUserCount }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customerPmName"
                label="项目经理"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="font-size:14px;color:#909399;">{{ scope.row.customerPmName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                align="center"
                label="操作"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="userInfo.companyAccountType === 3"
                    type="text"
                    size="mini"
                    @click="toManage(scope.row.projectId)"
                  >编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 列表分页 -->
      <div
        v-if="dataTableObj.total > 20"
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

    <!-- 新增/编辑项目抽屉 -->
    <drawer-common
      :drawer.sync="editVisible"
      size="900"
      class="edit"
      :no-new-window="true"
      @close="closeIt"
    >
      <edit-project v-if="editVisible" ref="child" slot="inner-body" :project-id="projectId" :flag="flag" @reload="getList"/>
    </drawer-common>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { TableMixin } from '@/mixins/position'
import { getSelectDeptList, editPositionStatus,
updateUserTableFields
} from '@/api/position'
import DrawerCommon from '@/components/common/drawerCommon'
import { searchPage } from '@/api/promoter/projectApi'
import editProject from '@/components/promoter/project/editProject'

export default {
  components: {
    DrawerCommon,
    editProject
  },
  mixins: [TableMixin],
  data() {
    return {
      projectId: '',
      editVisible: false,
      type: '',
      filterOptions: [],
      // 是否显示添加人才模态框
      talentPoolVisible: false,
      // 查询条件折叠面板显示隐藏
      activeNames: [],
      // 招聘部门数据源
      departmentArr: [],
      dataTableObj: {
        currPage: 1,
        pageSize: 20,
        total: 0,
        list: []
      },
      // 查询类型
      queryType: 1,
      // 已选中的文件夹
      selectedFolder: {
        name: '进行中职位',
        remark: ''
      },
      // 查询条件
      queryForm: {
        businessType: '',
        statusNo: '',
        searchName: this.$route.query.searchName || ''
      },
      listData: [],
      positionDetailVisible: false,
      orderType: null,
      flag: ''
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
    this.getList()
    // 查询部门下拉
    this.queryDepartment()
  },
  methods: {
    closeIt() {
      this.getList()
    },
    // 新窗口打开页面
    toDetail(url) {
      this.$router.push({ path: url })
    },
    toManage(id) {
      this.flag = 'edit'
      this.projectId = id
      this.editVisible = true
      this.$store.dispatch('dispatchUpdateProjectId', id)
    },
    changeCity(e) {
      this.queryForm.areas = e
      this.queryForm.provinceId = e[0]
      this.queryForm.cityId = e[1]
      this.queryForm.areaId = e[2]
      this.searchList()
    },
    // 编辑
    toEdit(id) {
      this.editVisible = true
    },
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
    // 列表
    getList() {
      this.editVisible = false
      this.searchList()
    },
    // 新增
    addProject() {
      this.flag = 'add'
      this.editVisible = true
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
    // 查询项目列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      let api = null;
      api = searchPage
      api(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/position/common.scss';
.customer-wrap {
  .page-area{
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .list-area{
    margin-bottom: 0;
  }
  .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 14px;
    }
  .drawer-detail-inner{
    width: 740px;
  }
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
      display: flex;
      justify-content: space-between;
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
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        color:#409eff;
        margin: 0 auto;
        cursor: pointer;
      }
    }
  }
}

</style>

