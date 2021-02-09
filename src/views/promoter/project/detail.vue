<template>
  <div
    class="promoter-project-detail"
  >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/promoterProject' }">全部项目</el-breadcrumb-item>
      <el-breadcrumb-item>{{ projectDetail.projectName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="mt-15">
      <div class="header">
        <div class="left">
          <p v-if="projectDetail.companyName" class="title">{{ projectDetail.projectName }}</p>
          <span class="id-text">#{{ projectDetail.projectId }}</span>
          <el-tag v-if="projectDetail.statusNo == 1" size="small" class="mr-15">草稿</el-tag>
          <el-tag v-else size="small" class="mr-15">{{ projectDetail.statusNo | filterCommonDict(dictData.dicts.promoterStatus) }}</el-tag>
          <el-tooltip v-if="projectDetail.projectInstructions || projectDetail.performRequired" popper-class="detail-popper" class="item" effect="dark" placement="bottom-start">
            <div slot="content">项目说明：{{ projectDetail.projectInstructions }}<br />执行要求：{{ projectDetail.performRequired }}</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div v-if="userInfo.companyAccountType !== 3" class="right">
          <el-button v-if="projectDetail.statusNo !== 3" size="small" class="mr-15" @click="editProject">编辑项目</el-button>
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            :hide-on-click="false"
            @command="handleCommand"
          >
            <el-button>更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-popconfirm
                v-if="projectDetail.statusNo === 2"
                title="是否结束项目？"
                @onConfirm="closeProject"
              >
                <el-dropdown-item
                  slot="reference"
                  command="closeProject"
                >结束项目</el-dropdown-item>
              </el-popconfirm>
              <el-popconfirm
                v-if="projectDetail.statusNo === 3"
                title="是否开启项目？"
                @onConfirm="openPromoterProject"
              >
                <el-dropdown-item
                  slot="reference"
                  command="openPromoterProject"
                >开启项目</el-dropdown-item>
              </el-popconfirm>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="mess">
        <el-row :gutter="20">
          <el-col>
            <p class="part1">客户</p>
            <p class="part2">{{ projectDetail.companyName }}</p>
          </el-col>
          <el-col>
            <p class="part1">本月任务数</p>
            <p class="part2">{{ projectDetail.monthTaskCount }}</p>
          </el-col>
          <el-col>
            <p class="part1">本月进度</p>
            <p class="part2">{{ projectDetail.monthTaskProgress }}</p>
          </el-col>
          <el-col>
            <p class="part1">促销员</p>
            <p class="part2">{{ projectDetail.promoterUserCount }}</p>
          </el-col>
          <el-col>
            <p class="part1">项目经理</p>
            <p class="part2">{{ projectDetail.customerPmName || '-' }}</p>
          </el-col>
          <el-col>
            <p class="part1">创建时间</p>
            <p class="part2">{{ projectDetail.createDate || '-' }}</p>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="mt-15">
      <div class="oprerate-div">
        <el-button v-if="userInfo.companyAccountType !== 3" :disabled="projectDetail.statusNo === 3" size="small" class="blue-btn" @click="sendTask">
          <i class="el-icon-plus"></i> 导入任务
        </el-button>
        <el-button size="small" class="blue-btn" @click="exportTask">导出报告</el-button>
      </div>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="bar-two">
          <el-cascader
            v-model="queryForm.areas"
            placeholder="所在区域"
            size="small"
            :options="areaOptions"
            clearable
            style="width: 200px;margin-right:15px"
            @change="changeCity"
          />
          <el-select
            v-model="queryForm.promoterUserId"
            clearable
            size="small"
            placeholder="执行人"
            style="width: 125px;margin-right:15px"
            @change="searchList"
          >
            <el-option
              v-for="item in promoterUserArr"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="queryForm.taskStatus"
            clearable
            size="small"
            placeholder="任务执行状态"
            style="width: 125px"
            @change="searchList"
          >
            <el-option
              v-for="item in dictData.dicts.promoterTaskStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="bar-one">
          <el-input
            v-model="queryForm.searchName"
            placeholder="搜索任务名称"
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
            >
              <el-table-column label="编号" prop="taskCode" align="center" max-width="90">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.taskCode }}</p>
                </template>
              </el-table-column>
              <el-table-column label="任务名称" prop="taskName" align="center" show-overflow-tooltip min-width="210">
                <template slot-scope="scope">
                  <div class="position-info">
                    <p class="info-main" @click="editTask(scope.row)">{{ scope.row.taskName }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="省" prop="provinceCode" align="center" max-width="90">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.provinceCode | filterCommonDict(dictData.areas) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="市" prop="cityCode" align="center" max-width="90">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.cityCode | filterLevel2(dictData.areas) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="详细地址" prop="address" show-overflow-tooltip align="center" min-width="210">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.address }}</p>
                </template>
              </el-table-column>

              <el-table-column label="开始时间-结束时间" prop="startDate" width="190" align="center" >
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.startDate | filterDate }} 至 {{ scope.row.endDate | filterDate }}</p>
                </template>
              </el-table-column>
              <el-table-column label="执行频次" prop="frequency" align="center" max-width="90">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.frequency | filterCommonDict(dictData.dicts.promoterTaskFrequency) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="执行人" prop="promoterUserName" align="center" >
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.promoterUserName }}</p>
                </template>
              </el-table-column>
              <el-table-column label="任务进度" prop="taskStatus" align="center" max-width="100">
                <template slot-scope="scope">
                  <p style="font-size:14px;color:#909399;">{{ scope.row.taskStatus | filterCommonDict(dictData.dicts.promoterTaskStatus) }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                align="center"
                label="任务结果"
                width="100"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{row}">
                  <el-button
                    type="text"
                    size="mini"
                    @click="lookIt(row)"
                  >查看</el-button>
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
    </el-card>

    <!-- 发布任务抽屉 -->
    <drawer-common
      :drawer.sync="taskVisible"
      class="edit resume-detail-supplier-drawer"
      direction="btt"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
    >
      <send-task v-if="taskVisible" slot="inner-body" @reload="getList"/>
    </drawer-common>

    <!-- 导出报告抽屉 -->
    <el-dialog
      v-loading="makeLoading"
      title="导出报告"
      :visible.sync="exportTaskVisible"
      class="export-modal"
      width="600px"
      :close-on-click-modal="false"
      element-loading-text="正在生成报告中，请不要关闭窗口..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @close="closeDialog"
    >
      <p class="sub-title">
        请选择需要生成报告的问卷，生成报告后下载到本地
      </p>
      <el-form
        ref="exportForm"
        :model="exportForm"
        :rules="storyRules"
        size="small"
        label-width="120px"
      >
        <el-form-item label="选择导出时间段" prop="name" class="name-input">
          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="formArr1 && formArr1.length > 0" label="陈列核查" >
          <el-checkbox-group v-model="checkList1">
            <el-checkbox v-for="(item,index) in formArr1" :key="index" :label="item.questionnaireId">{{ item.questionnaireName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="skuListData && skuListData.length > 0" label="理货（SKU）" >
          <el-checkbox-group v-model="checkList2">
            <el-checkbox v-for="(item,index) in skuListData" :key="index" :label="item.id">{{ item.skuName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="formArr3 && formArr3.length > 0" label="异常报告" >
          <el-checkbox-group v-model="checkList3">
            <el-checkbox v-for="(item,index) in formArr3" :key="index" :label="item.questionnaireId">{{ item.questionnaireName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="formArr4 && formArr4.length > 0" label="自定义报告" >
          <el-checkbox-group v-model="checkList4">
            <el-checkbox v-for="(item,index) in formArr4" :key="index" :label="item.questionnaireId">{{ item.questionnaireName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="export-dialog-footer">
        <el-button v-loading="makeLoading" type="primary" size="small" @click="saveStory">生成报告</el-button>
        <p class="tip">
          1. 选择导出的每个问卷报告，在导出文件中为一个独立sheet，如sheet1：陈列核查
        </p>
        <p class="tip">
          2. 问卷中的图片在导出文件中显示为网页地址，点击后可以打开浏览器在线查看
        </p>
      </span>
    </el-dialog>

    <!-- 任务修改抽屉 -->
    <drawer-common
      :drawer.sync="editTaskVisible"
      class="edit"
      :no-new-window="true"
      @close="closeDrawer"
    >
      <edit-task v-if="editTaskVisible" slot="inner-body" ref="child" :task-id="taskId" :tab-name="tabName" @reload="getList" />
    </drawer-common>

    <!-- 编辑项目抽屉 -->
    <drawer-common
      :drawer.sync="editVisible"
      size="900"
      class="edit"
      :no-new-window="true"
    >
      <edit-project v-if="editVisible" ref="child" slot="inner-body" :project-id="$route.query.projectId" :flag="flag" @reload="getList"/>
    </drawer-common>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { TableMixin } from '@/mixins/position'
import { searchTaskPage } from '@/api/promoter/projectApi'
import DrawerCommon from '@/components/common/drawerCommon'
import sendTask from '@/components/promoter/project/sendTask'
import editTask from '@/components/promoter/project/editTask'
import { getByProjectId, searchSelectList, closePromoterProject, openPromoterProject, getQuestionTemplate, skuSearchPage, exportPromoterProjectReport } from '@/api/promoter/projectApi'
import editProject from '@/components/promoter/project/editProject'

export default {
  components: {
    DrawerCommon,
    sendTask,
    editTask,
    editProject
  },
  mixins: [TableMixin],
  data() {
    return {
      makeLoading: false,
      promoterUserArr: [],
      projectDetail: {},
      value1: '',
      value2: '',
      taskVisible: false,
      exportTaskVisible: false,
      editTaskVisible: false,
      exportForm: {},
      // 查询条件
      queryForm: {
        taskStatus: '',
        promoterUserId: '',
        searchName: this.$route.query.searchName || ''
      },
      listData: [],
      editVisible: false,
      storyRules: [],
      checked: false,
      taskId: '',
      lookVisible: false,
      formArr1: [], // 陈列核查
      formArr2: [], // 理货汇报
      skuListData: [], // SKU
      formArr3: [], // 异常报告
      formArr4: [], // 自定义模板
      tabName: '',
      checkList1: [],
      checkList2: [],
      checkList3: [],
      checkList4: [],
      dateRange: '',
      areaOptions: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyRole: state => state.userInfo.companyRole
    }),
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    this.nowDate()
    const temp = JSON.parse(JSON.stringify(this.dictData.areas))
    temp && temp.filter(item => {
      console.log(item.children)
      item.children && item.children.filter(a => {
        delete a.children
      })
    })
    this.areaOptions = temp
    this.getDetail()
    console.log(333333333)
    this.searchList()
    // this.searchPromoterList()
  },
  methods: {
    nowDate() {
      var firstDate = new Date();
        var startDate = firstDate.getFullYear() + '-' + ((firstDate.getMonth() + 1) < 10 ? '0' : '') + (firstDate.getMonth() + 1) + '-' + '01';
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        var lastDate = new Date(nextMonthFirstDay - oneDay);
        var endDate = lastDate.getFullYear() + '-' + ((lastDate.getMonth() + 1) < 10 ? '0' : '') + (lastDate.getMonth() + 1) + '-' + (lastDate.getDate() < 10 ? '0' : '') + lastDate.getDate();
        this.dateRange = [startDate, endDate]
    },
    saveStory() {
      const { checkList1, checkList2, checkList3, checkList4, dateRange } = this
      console.log(checkList1, checkList2, checkList3, checkList4, dateRange)
      this.exportPromoterProjectReport()
    },
    // 查询sku列表
    skuSearchPage() {
      const para = {
        projectId: this.$route.query.projectId || this.projectId,
        pageNumber: 1,
        pageSize: 999
      }
      const api = skuSearchPage
      api(para).then(res => {
        if (res.success) {
          this.skuListData = res.data.records
          console.log('sku', this.skuListData)
          this.skuListData && this.skuListData.filter(item => {
            this.checkList2.push(item.id)
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    closeDialog() {
      this.checkList1 = []
      this.checkList2 = []
      this.checkList3 = []
      this.checkList4 = []
    },
    // 导出
    exportPromoterProjectReport() {
      let arr = []
      arr = arr.concat(this.checkList1).concat(this.checkList3).concat(this.checkList4)
      console.log('questionnaireIds', arr)
      const params = {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1],
        projectId: this.$route.query.projectId
      }
      if (arr && arr.length > 0) {
        params.questionnaireIds = arr
      }
      if (this.checkList2 && this.checkList2.length > 0) {
        params.skuIds = this.checkList2
      }
      console.log(params)
      if ((params.skuIds && params.skuIds.length > 0) || (params.questionnaireIds && params.questionnaireIds.length) > 0) {
        this.makeLoading = true
        exportPromoterProjectReport(params).then(res => {
            this.makeLoading = false
            console.log(res)
            console.log(res.data)
            if (res.data.type === 'application/octet-stream') {
              this.$message({
                message: '导出成功',
                type: 'success'
              })
              const url = window.URL.createObjectURL(
                new Blob([res.data], {
                  type: 'application/vnd.ms-excel'
                })
              )
              const link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link &&
                link.setAttribute(
                  'download',
                  decodeURI(
                    res.headers['content-disposition']
                      .split('filename=')[1]
                      .replace(/"/g, '')
                  )
                )
              document.body.appendChild(link)
              link.click()
            } else if (res.headers['content-type'].indexOf('application/json') !== -1) {
              this.$message({
                message: '暂无数据导出',
                type: 'warning'
              })
            }
        })
      } else {
        this.$message({
          message: '请选择需要生成报告的问卷',
          type: 'warning'
        })
      }
    },
    getQuestionTemplate() {
      const params = {
        projectId: this.$route.query.projectId
      }
      getQuestionTemplate(params).then(res => {
        this.formArr1 = []
        this.formArr2 = []
        this.formArr3 = []
        this.formArr4 = []
        const { success, data, message } = res
        if (success && data) {
          // 数据重构
          data && data.filter(item => {
            if (item.questionnaireType === 1) {
              this.formArr1.push(item)
            } else if (item.questionnaireType === 2) {
              this.formArr2.push(item)
            } else if (item.questionnaireType === 3) {
              this.formArr3.push(item)
            } else if (item.questionnaireType === 4) {
              this.formArr4.push(item)
            }
          })
          this.formArr1 && this.formArr1.filter(item => {
            this.checkList1.push(item.questionnaireId)
          })
          this.formArr3 && this.formArr3.filter(item => {
            this.checkList3.push(item.questionnaireId)
          })
          this.formArr4 && this.formArr4.filter(item => {
            this.checkList4.push(item.questionnaireId)
          })
          console.log('formArr1', this.formArr1, this.checkList1)
          console.log('formArr2', this.skuListData, this.formArr2, this.checkList2)
          console.log('formArr3', this.formArr3, this.checkList3)
          console.log('formArr4', this.formArr4, this.checkList4)
        } else {
          this.$message.error(message)
        }
      })
    },
    // 更多
    handleCommand(command) {
      // switch (command) {
      //   case 'openProject':
      //     this.openPromoterProject();
      //     break;
      // }
    },
    lookIt(row) {
      this.editTaskVisible = true
      this.taskId = row.id
      console.log('taskId', this.taskId)
      this.tabName = 'plan'
    },
    closeDrawer() {
      console.log('关闭')
      this.$refs.child.resetForm()
    },
    editTask(row) {
      this.editTaskVisible = true
      this.taskId = row.id
      console.log('taskId', this.taskId)
    },
    editProject() {
      this.flag = 'edit'
      this.editVisible = true
    },
    changeCity(e) {
      this.queryForm.areas = e
      this.queryForm.provinceCode = e[0]
      this.queryForm.cityCode = e[1]
      this.searchList()
    },
    getList() {
      this.editTaskVisible = false
      this.editVisible = false
      this.taskVisible = false
      this.getDetail()
      this.searchList()
    },
    sendTask() {
       this.taskVisible = true
    },
    exportTask() {
     this.exportTaskVisible = true
     this.getQuestionTemplate()
     this.skuSearchPage()
    },
    // 查询任务列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      para.projectId = this.$route.query.projectId
      para.provinceCode = para && para.areas && para.areas[0]
      para.cityCode = para && para.areas && para.areas[1]
      delete para.areas
      let api = null;
      api = searchTaskPage
      api(para).then(res => {
        console.log(111, res)
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    },
    // 项目详情
    getDetail() {
      const params = {
        projectId: this.$route.query.projectId
      }
      getByProjectId(params).then(res => {
        const { success, data } = res
        if (success && data) {
          this.projectDetail = data
          this.promoterUserArr = data.promoterUserList
          console.log(this.projectDetail)
        }
      })
    },
    closeProject() {
      console.log('关闭')
      this.closePromoterProject()
    },
    // 关闭项目
    closePromoterProject() {
      const params = {
        projectId: this.$route.query.projectId
      }
      closePromoterProject(params).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.success('操作成功')
          this.getDetail()
        } else {
          this.$message.error(message)
        }
      })
    },
    // 开启项目
    openPromoterProject() {
      const params = {
        projectId: this.$route.query.projectId
      }
      openPromoterProject(params).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.success('操作成功')
          this.getDetail()
        } else {
          this.$message.error(message)
        }
      })
    },
    // 查询促销员列表
    searchPromoterList() {
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = 1
      para.pageSize = 999
      let api = null;
      api = searchSelectList
      api(para).then(res => {
       //  this.promoterUserArr = res.data
      })
    }
  }
}
</script>

<style lang="scss" >
.detail-popper{
  max-width: 500px;
}
.blue-btn{
  color: #1678F9;
  border-color:#1678F9 ;
  border-radius: 0;
}
.export-modal{
  .el-dialog__footer{
    padding-left: 0;
    padding-right: 0;
  }
  .el-dialog__body{
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
  }
  .sub-title{
    position: absolute;
    top: 48px;
    left: 20px;
    color: #999;
  }
  .el-form{
    padding: 30px 30px 0 30px;
    border-top: 1px solid #eee;
    .el-checkbox-group{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .el-checkbox{
      height: 32px;
      line-height: 32px;
      .el-checkbox__label{
        line-height: 32px;
      }
    }
  }

}
.export-dialog-footer{
  border-top: 1px solid #eee;
  text-align: center;
  padding: 20px 0 0px 0 ;
  display: block;
  .tip{
    margin-top: 10px;
    font-size: 12px;
    width: 100%;
    text-align: left;
    padding-left: 20px;
  }
}
.promoter-project-detail{
  padding-top: 20px;
  .el-table .cell{
    white-space: initial !important;
  }
  .id-text{
    font-size: 12px;
    color: #282c32;
    margin-right: 16px;
  }
  .page-area{
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .list-area{
    padding: 0;
    margin-bottom: 0;
  }
  .el-table__empty-block{
        height: 47vh !important;
    }
  .info-main {
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        color:#409eff;
        margin: 0 auto;
        cursor: pointer;
      }
    .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 12px;
    }
    .el-table .cell p{
      font-size: 12px !important;
    }
    .search-bar {
      padding: 16px 0;
      display: flex;
      justify-content: space-between;
      position: relative;
      .bar-one{
        position: absolute;
        top: -30px;
        right: 0;
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
    .oprerate-div{
           display: flex;
       }
    .header{
        display: flex;
        justify-content: space-between;
        .left{
            p{
                display: inline-block;
            }
            .title{
                    font-size: 18px;
                    font-weight: bold;
                    color: #282c32;
                    cursor: pointer;
                    margin-right: 16px;
            }
        }
        .right{
          .el-button {
            width: 72px;
            height: 28px;
            padding: 0;
            line-height: 28px;
            font-size: 12px;
            border-radius: 1px;
          }
        }
    }
    .el-card{
      border: none;
      box-shadow: none;
    }
    .mess .el-row{
        margin: 30px 0 10px 0 !important;
        display: flex;
        width: 100%;
        justify-content: space-between;
        .el-col {
            padding: 0 0;
        }
       .part1{
            font-size: 14px;
            color: #c3c7cd;
            margin-bottom: 12px;
       }
       .part2{
            font-size: 14px;
            color: #4c5967;
       }
    }
}
.resume-detail-supplier-drawer {
    .drawer-detail-inner {
        width: 100%;
        border-radius: 4px;
        margin-left: 0;
    }
    .el-drawer.btt {
        top: 60px;
        height: auto !important;
        width: 98%;
        margin-left: 1%;
    }
}
</style>
