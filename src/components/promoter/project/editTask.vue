<template>
  <div
    class="edit-task"
  >
    <el-tabs v-model="activeName" size="small" class="mtv-15" @tab-click="handleTab">
      <el-tab-pane name="baseInfo">
        <span slot="label">
          任务基本信息
        </span>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="105px"
          class="ruleForm"
        >
          <el-form-item label="编号" prop="taskCode" size="small">
            <el-input v-model="ruleForm.taskCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="任务名称" prop="taskName" size="small">
            <el-input v-model="ruleForm.taskName" :disabled="userInfo.companyAccountType === 3"></el-input>
          </el-form-item>
          <el-row class="two-row">
            <el-col span="12">
              <el-form-item label="任务地址" prop="areas" size="small">
                <el-cascader v-model="ruleForm.areas" :options="areas" clearable style="width: 100%;" :disabled="userInfo.companyAccountType === 3" />
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item prop="address" size="small" label-width="10px">
                <el-input v-model="ruleForm.address" :disabled="userInfo.companyAccountType === 3"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="执行周期" prop="rangeDate" size="small">
            <el-date-picker
              v-model="ruleForm.rangeDate"
              :disabled="userInfo.companyAccountType === 3"
              style="width:299px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行频次" prop="frequency" size="small">
            <el-radio-group v-model="ruleForm.frequency" :disabled="userInfo.companyAccountType === 3">
              <el-radio v-for="(item,index) in dictData.dicts.promoterTaskFrequency" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="userInfo.companyAccountType === 3" label="执行人" prop="promoterUserId" size="small">
            <el-input v-model="taskDetail.promoterUserName" disabled></el-input>
          </el-form-item>
          <el-form-item v-else label="执行人" prop="promoterUserId" size="small">
            <el-select
              v-model="ruleForm.promoterUserId"
              style="width:100%"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethodUserId"
              @change="handleChangeUserId"
            >
              <el-option v-for="(item,index) in promoterUserArr" :key="index" :label="item.userName+'（'+item.userMobile+'）'" :value="item.promoterUserId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="userInfo.companyAccountType !== 3" size="small">
            <el-button type="primary" size="small" :loading="loading" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="plan">
        <span slot="label">
          执行计划
        </span>
        <el-table
          ref="dataTable"
          v-loading="loading"
          :data="listData2"
          border
          highlight-current-row
        >
          <el-table-column label="开始时间至结束时间" prop="startDate" align="center" width="180" >
            <template slot-scope="scope">
              <p style="font-size:12px;color:#909399;font-weight:600" >{{ scope.row.startDate }}至{{ scope.row.endDate }}</p>
            </template>
          </el-table-column>
          <el-table-column label="执行人" prop="promoterUserName" align="center" >
            <template slot-scope="scope">
              <p style="font-size:12px;color:#909399;" >{{ scope.row.promoterUserName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="completionTime" align="center" width="140">
            <template slot-scope="scope">
              <p style="font-size:12px;color:#909399;" >{{ scope.row.completionTime }}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="planStatus" align="center" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.planStatus === 2" size="small" >进行中</el-tag>
              <el-tag v-if="scope.row.planStatus === 3" size="small" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.planStatus === 4" size="small" type="danger" style="width:54px">异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标签" prop="labelList" align="center" width="120">
            <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.labelList" :key="index" class="mr-5" size="small" :type="item === '逾期' ? 'warning' : 'danger'" >{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="content" align="center" >
            <template slot-scope="scope">
              <el-button v-if="scope.row.planStatus !== 2" type="text" size="mini" @click="toEdit(scope)">查看</el-button>
              <el-button v-if="scope.row.planStatus === 2" type="text" size="mini">-</el-button>
              <el-button v-if="scope.row.planStatus != 2 && userInfo.companyAccountType !== 3" type="text" size="mini" @click="toRepeat(scope)">重做</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-if="total2 !== 0"
          size="mini"
          class="mt-10"
          background
          :current-page="pageNumber2"
          :page-size="pageSize2"
          :total="total2"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        />
      </el-tab-pane>
      <el-tab-pane name="task">
        <span slot="label">
          任务动态
        </span>
        <el-table
          ref="dataTable"
          v-loading="loading"
          :data="listData1"
          border
          highlight-current-row
        >
          <el-table-column label="时间" prop="dynamicTime" align="center" width="140px" >
            <template slot-scope="scope">
              <p style="font-size:12px;color:#909399;" >{{ scope.row.dynamicTime }}</p>
            </template>
          </el-table-column>
          <el-table-column label="动态" prop="content" align="center" >
            <template slot-scope="scope">
              <p style="font-size:12px;color:#909399;" >{{ scope.row.content }}</p>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-if="total1 !== 0"
          size="mini"
          class="mt-10"
          background
          :current-page="pageNumber1"
          :page-size="pageSize1"
          :total="total1"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 重做弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="400"
      :show-close="false"
      :append-to-body="true"
      @close="handleClose('repeatForm')"
    >
      <el-form ref="repeatForm" :model="repeatForm" :rules="repeatRules" label-width="90px">
        <el-form-item label="重做原因" prop="redoReason">
          <el-input v-model="repeatForm.redoReason" type="textarea" placeholder="请输入任务重做原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose('repeatForm')">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSure('repeatForm')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 查看抽屉 -->
    <drawer-common
      :drawer.sync="lookVisible"
      class="edit"
      :no-new-window="true"
      @close="closeDrawer"
    >
      <result-component v-if="lookVisible" slot="inner-body" ref="child" :task-plan-id="taskPlanId" />
    </drawer-common>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { searchTaskDynamicPage, getPromoterTaskDetail, savePromoterTaskForm, userSearchPage, planSearchPage, operatePlanRedo } from '@/api/promoter/projectApi'
import resultComponent from '@/components/promoter/project/resultComponent'
import DrawerCommon from '@/components/common/drawerCommon'

export default {
  components: {
    DrawerCommon,
    resultComponent
  },
  props: {
    taskId: {
      type: Number,
      default: null
    },
    tabName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lookVisible: false,
      dialogVisible: false,
      loading: false,
      activeName: this.$props.tabName || 'baseInfo',
      paramsData: {},
      uploadAction: '/api/common/upload',
      uploadHeader: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      limit: 9,
      companyParamsData: {},
      videoParamsData: {},
      uploadCompanyImgsAction: '/api/company/upload',
      areas: [], // 地区
      repeatForm: {
        redoReason: ''
      },
      repeatRules: {
        redoReason: [{ required: true, message: '请输入任务重做原因', trigger: 'blur' }]
      },
      ruleForm: {

      },
      companyImgs: [],
      rules: {
        taskCode: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        areas: [{ required: true, message: '请选择任务地址', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        rangeDate: [
          { required: true, message: '请选择执行周期', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请选择执行频次', trigger: 'blur' }
        ],
        promoterUserId: [
          { required: true, message: '请选择促销员', trigger: 'blur' }
        ]
      },
      days: [],
      localArr: [{
        label: '100M',
        value: '100'
      }, {
        label: '200M',
        value: '200'
      }, {
        label: '300M',
        value: '300'
      }, {
        label: '400M',
        value: '400'
      }, {
        label: '500M',
        value: '500'
      }],
      startTime: '',
      endTime: '',
      companyArr: [],
      listData1: [],
      total1: 0,
      pageSize1: 20,
      pageNumber1: 1,
      listData2: [],
      total2: 0,
      pageSize2: 20,
      pageNumber2: 1,
      promoterUserArr: [],
      taskDetail: {},
      id: null,
      taskPlanId: null,
      searchName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      },
      dictData: state => state.common.dictData,
      selfCompanyId: state => state.userInfo.companyId
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas
      this.areas.map(item => {
        item.children &&
          item.children.map(x => {
            x.children &&
              x.children.map(y => {
                delete y.children
              })
          })
      })
    }
  },
  created() {
    // 修改限制
    this.days = []
    for (let i = 1; i < 31; i++) {
      this.days.push(i)
    }
    this.areas = this.dictData.areas
    this.areas.map(item => {
      item.children &&
        item.children.map(x => {
          x.children &&
            x.children.map(y => {
              delete y.children
            })
        })
    })
  },
  mounted() {
    this.getPromoterTaskDetail()
    if (this.userInfo.companyAccountType !== 3) {
       this.searchList()
    }
    this.$props.taskId && this.planSearchPage()
  },
  methods: {
    // 输入联想
    remoteMethodUserId(e) {
      this.searchName = e
      this.searchList()
    },
    handleChangeUserId(e) {
      this.ruleForm.promoterUserId = e
    },
    closeDrawer() {
      console.log('关闭')
    },
    operatePlanRedo() {
      const { redoReason } = this.repeatForm
      const { taskPlanId } = this
      const params = {
        redoReason,
        taskPlanId
      }
      console.log(params)
      operatePlanRedo(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message.success('保存成功')
          this.pageNumber2 = 1
          this.planSearchPage()
        }
      })
    },
    // 查看
    toEdit(row) {
      console.log(row.row.taskPlanId)
      this.taskPlanId = row.row.taskPlanId
      this.lookVisible = true
    },
    // 重做
    toRepeat(row) {
      console.log(row.row.taskPlanId)
      this.dialogVisible = true
      this.taskPlanId = row.row.taskPlanId
    },
    handleSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.operatePlanRedo()
          this.handleClose(formName)
        } else {
          return false;
        }
      });
    },
    handleClose(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    // 查询促销员列表
    searchList() {
      this.promoterUserArr = []
      const para = {}
      para.pageNumber = 1
      para.pageSize = 999
      para.searchName = this.searchName
      let api = null;
      api = userSearchPage
      api(para).then(res => {
        const arr = res.data.records
        arr && arr.filter(item => {
          if (item.userId) {
            this.promoterUserArr.push(item)
          }
        })
        console.log('促销员', this.promoterUserArr)
      })
    },
    handleSizeChange1(val) {
    console.log(`每页 ${val} 条`)
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`)
      this.pageNumber1 = val
      this.searchTaskDynamicPage()
    },
     handleSizeChange2(val) {
    console.log(`每页 ${val} 条`)
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`)
      this.pageNumber2 = val
      this.planSearchPage()
    },
    // 任务动态
    searchTaskDynamicPage() {
      const { pageSize1: pageSize,
        pageNumber1: pageNumber } = this
      const params = {
        pageSize,
        pageNumber,
        taskId: this.$props.taskId
      }
      searchTaskDynamicPage(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.total1 = data.total
          this.listData1 = data.records
        }
      })
    },
    // 执行计划
    planSearchPage() {
      console.log(2222222222, this.$props.taskId)
      const { pageSize2: pageSize,
        pageNumber2: pageNumber } = this
      const params = {
        pageSize,
        pageNumber,
        taskId: this.$props.taskId
      }
      planSearchPage(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.total2 = data.total
          this.listData2 = data.records
        }
      })
    },
    // 任务详情
    getPromoterTaskDetail() {
      const params = {
        promoterTaskId: this.$props.taskId
      }
      getPromoterTaskDetail(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.taskDetail = data
          this.id = data.id
          this.$set(this.ruleForm, 'areas', [data.provinceCode + '', data.cityCode + '', data.areaCode + ''])
          this.$set(this.ruleForm, 'taskCode', data.taskCode)
          this.$set(this.ruleForm, 'taskName', data.taskName)
          this.$set(this.ruleForm, 'provinceCode', data.provinceCode)
          this.$set(this.ruleForm, 'cityCode', data.cityCode)
          this.$set(this.ruleForm, 'areaCode', data.areaCode)
          this.$set(this.ruleForm, 'address', data.address)
          const startDate = data.startDate && data.startDate.split(' ')
          const endDate = data.endDate && data.endDate.split(' ')
          this.$set(this.ruleForm, 'rangeDate', [startDate[0], endDate[0]])
          this.$set(this.ruleForm, 'frequency', data.frequency + '')
          this.$set(this.ruleForm, 'promoterUserId', data.promoterUserId)
        }
      })
    },
    handleTab(e) {
      if (e.name === 'task') {
         this.searchTaskDynamicPage()
      } else if (e.name === 'plan') {
         this.planSearchPage()
      }
      console.log(e.name)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
           this.savePromoterTaskForm()
        }
      })
    },
    savePromoterTaskForm() {
      const params = this.ruleForm
      const areas = params.areas
      const rangeDate = params.rangeDate
      params.provinceCode = areas[0]
      params.cityCode = areas[1]
      params.areaCode = areas[2]
      params.startDate = rangeDate[0]
      params.endDate = rangeDate[1]
      params.id = this.id
      params.projectId = this.$route.query.projectId
      console.log('参数', params)
      savePromoterTaskForm(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.$message.success('保存成功')
          this.$emit('reload')
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.edit-task{
  padding: 16px;
  ::v-deep .el-tabs__nav-wrap::after{
    background-color: #E4E7ED !important;
  }
  .el-radio-group{
    height: 32px;
    line-height: 32px;
    .el-radio{
      height: 32px;
      line-height: 32px;
    }
  }
.el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
  font-size: 12px;
}
.el-table__empty-block{
        height: auto !important;
    }
.edit {
  padding: 16px;
  .el-radio-group{
    vertical-align: middle;
    height: 32px;
    line-height: 32px;
    .el-radio{
      height: 32px;
      line-height: 32px;
    }
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #14171a;
      line-height: 22px;
    }
  }
  .ruleForm {
    .title1 {
      font-size: 14px;
      color: #333;
      margin: 15px 0 20px;
    }
    ::v-deep .el-form-item__content {
      position: relative;
      .desc {
        font-size: 13px;
        position: absolute;
        left: 160px;
        bottom: 0;
      }
    }
  }
  .avatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: contain;
  }
}
}

</style>
