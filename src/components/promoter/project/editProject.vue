<template>
  <div
    :class="[slotPage === 'releasePositionPage' ? 'release-position-page edit' : 'edit']"
    :style="{padding: title ? 0 : '16px'}"
  >
    <div v-if="$props.flag === 'edit'" class="header">
      <p class="title">{{ ruleForm.projectName }}</p>
    </div>
    <el-tabs v-model="activeName" size="small" class="mtv-15" @tab-click="handleTab">
      <el-tab-pane name="baseInfo">
        <span slot="label">
          基本信息
        </span>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="105px"
          class="ruleForm"
        >
          <!-- 基本信息 -->
          <el-form-item label="客户名称" prop="companyId" size="small">
            <el-select v-model="ruleForm.companyId" style="width:100%">
              <el-option v-for="(item,index) in companyArr" :key="index" :value="item.companyId" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName" size="small">
            <el-input v-model="ruleForm.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="businessType" size="small">
            <el-radio-group v-model="ruleForm.businessType" :disabled="$props.flag === 'edit'">
              <el-radio v-for="(item,index) in dictData.dicts.promoterProjectBusinessType" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
            <p v-if="$props.flag === 'add'" class="tip">项目一旦发布成功后项目类型不可修改，请仔细设置</p>
          </el-form-item>
          <el-form-item label="项目说明" prop="projectInstructions" size="small">
            <el-input
              v-model="ruleForm.projectInstructions"
              type="textarea"
              :rows="5"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="执行要求" prop="performRequired" size="small">
            <el-input
              v-model="ruleForm.performRequired"
              type="textarea"
              :rows="5"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>

          <!-- 执行规则 -->
          <p class="title1">执行规则</p>
          <div class="rule-form">
            <el-form-item label="定位限制" prop="contactUserName" size="small">
              促销员只有在定位距离
              <el-select v-model="ruleForm.lbsDistance" clearable class="w-100" placeholder="">
                <el-option
                  v-for="(item,index) in localArr"
                  :key="index"
                  :value="item.value - 0"
                  :label="item.label"
                />
              </el-select>
              以内才可以提交任务结果，否则不予提交
            </el-form-item>
            <el-form-item label="时间限制" prop="contactUserMobile" size="small">
              促销员只有在
              <el-time-select
                v-model="ruleForm.taskSubmitStartTime"
                clearable
                style="width:100px"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
              >
              </el-time-select>
              至
              <el-time-select
                v-model="ruleForm.taskSubmitEndTime"
                clearable
                style="width:100px"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: ruleForm.taskSubmitStartTime
                }"
              >
              </el-time-select>
              之间才可以提交任务结果，否则不予提交
            </el-form-item>
            <el-form-item label="修改限制" prop="contactUserEmail" size="small">
              促销员提交任务后，在<el-select v-model="ruleForm.taskResultUpdateTime" clearable class="w-100" placeholder="">
                <el-option
                  v-for="item in days"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>天内可以修改提交结果
            </el-form-item>
            <el-form-item size="small">
              <el-button type="primary" size="small" :loading="loading" class="mt-20" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="$props.flag === 'edit' || showPaper" name="paper">
        <span slot="label">
          问卷
        </span>
        <paperPanel v-if="activeName === 'paper'" project-id="$props.projectId" />
      </el-tab-pane>
      <el-tab-pane v-if="$props.flag === 'edit' || showPaper" name="sku">
        <span slot="label">
          SKU管理
        </span>
        <skuPanel v-if="activeName === 'sku'" project-id="$props.projectId" />
      </el-tab-pane>
    </el-tabs>

    <!-- 项目创建成功 -->
    <el-dialog
      :visible.sync="resultVisible"
      class="guide-modal"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      width="400px"
    >
      <template v-if="$props.flag === 'edit' && different === true">
        <p class="content">
          您的项目执行要求发生了变化
          <br />
          是否确认保存？
        </p>
        <span slot="footer">
          <el-button size="small" @click="cancelIt">取消</el-button>
          <el-button type="primary" size="small" @click="sendIt">确认</el-button>
        </span>
      </template>
      <template v-if="$props.flag === 'add'">
        <p class="title">
          项目创建成功！
        </p>
        <p class="content">
          您还需要进一步完成项目的问卷配置
          <br />
          才可发布任务至促销员
        </p>
        <span slot="footer">
          <el-button size="small" @click="cancelIt">稍后再说</el-button>
          <el-button type="primary" size="small" @click="goIt">去配置问卷</el-button>
        </span>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { searchCompanyPage } from '@/api/company'
import { getByProjectId, savePromoterProjectForm } from '@/api/promoter/projectApi'
import paperPanel from './paperPanel'
import skuPanel from './skuPanel'

export default {
  components: {
    paperPanel,
    skuPanel
  },
  props: {
    flag: {
      type: String,
      default: ''
    },
    projectId: {
      type: Number,
      default: null
    },
    backTo: {
      type: String,
      default: ''
    },
    slotPage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPaper: false,
      resultVisible: false,
      activeName: 'baseInfo',
      loading: false,
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
      ruleForm: {
        businessType: '1',
        taskSubmitStartTime: '06:00',
        taskSubmitEndTime: '21:00',
        taskResultUpdateTime: '1',
        lbsDistance: 1000
      },
      companyImgs: [],
      rules: {
        companyId: [{ required: true, message: '请选择客户名称', trigger: 'blur' }],
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        businessType: [
          { required: true, message: '请选择项目类型', trigger: 'blur' }
        ],
        projectInstructions: [
          { required: true, message: '请输入项目说明', trigger: 'blur' }
        ]
      },
      days: [],
      localArr: [{
        label: '600M',
        value: '600'
      }, {
        label: '700M',
        value: '700'
      }, {
        label: '800M',
        value: '800'
      }, {
        label: '900M',
        value: '900'
      }, {
        label: '1000M',
        value: '1000'
      }],
      startTime: '',
      endTime: '',
      companyArr: [],
      tempPerformRequired: '',
      different: false,
      projectIdTemp: null
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => {
        return state.userInfo
      }
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
    // 客户列表
    this.searchCompanyPage()
  },
  mounted() {
    if (this.$props.flag === 'edit') {
       this.getDetail()
    }
  },
  methods: {
    sendIt() {
        this.loading = true
        this.savePromoterProjectForm()
    },
    cancelIt() {
      if (this.$props.flag === 'add') {
        this.resultVisible = false
        this.$emit('closeDrawer', {})
        this.$emit('reload')
      } else if (this.$props.flag === 'edit') {
        this.resultVisible = false
        this.$emit('closeDrawer', {})
      }
    },
    goIt() {
      this.resultVisible = false
      this.showPaper = true
      this.activeName = 'paper'
    },
    handleTab(e) {
      console.log(e)
    },
    // 查询客户列表
    searchCompanyPage() {
      const para = {}
      para.pageNumber = 1
      para.pageSize = 999
      let api = null;
      api = searchCompanyPage
      api(para).then(res => {
        this.companyArr = res.data.records
      })
    },
    // 项目详情
    getDetail() {
      const params = {
        projectId: this.$props.projectId || this.projectIdTemp
      }
      console.log('传参', params)
      getByProjectId(params).then(res => {
        const { success, data } = res
        if (success && data) {
          this.$set(this.ruleForm, 'companyId', data.companyId)
          this.$set(this.ruleForm, 'projectName', data.projectName)
          this.$set(this.ruleForm, 'businessType', data.businessType + '')
          console.log('ssssssss', data.businessType, typeof data.businessType)
          this.$set(this.ruleForm, 'projectInstructions', data.projectInstructions)
          this.tempPerformRequired = data.performRequired
          this.$set(this.ruleForm, 'performRequired', data.performRequired)
          this.$set(this.ruleForm, 'lbsDistance', data.lbsDistance)
          console.log(data.taskSubmitStartTime)
          if (data.taskSubmitStartTime) {
            const temp = data.taskSubmitStartTime.substring(0, 5)
            this.$set(this.ruleForm, 'taskSubmitStartTime', temp)
          }
          if (data.taskSubmitEndTime) {
            const temp = data.taskSubmitEndTime.substring(0, 5)
            this.$set(this.ruleForm, 'taskSubmitEndTime', temp)
          }
          this.$set(this.ruleForm, 'taskResultUpdateTime', data.taskResultUpdateTime)
          console.log(this.ruleForm)
        }
      })
    },
    submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.$props.flag === 'edit') {
              if (this.tempPerformRequired !== this.ruleForm.performRequired) {
                this.different = true
                this.resultVisible = true
              } else {
                this.loading = true
                this.savePromoterProjectForm()
              }
            } else if (this.$props.flag === 'add') {
              this.loading = true
              this.savePromoterProjectForm()
            }
          }
        })
    },
    // 编辑企业
    savePromoterProjectForm() {
      let params = {}
      if (this.$props.flag === 'edit') {
         params.id = this.$props.projectId
      }
      params = Object.assign(params, this.ruleForm)
      const { lbsDistance, taskSubmitStartTime, taskSubmitEndTime, taskResultUpdateTime } = this.ruleForm
      if (!lbsDistance) {
        params.lbsDistance = ''
      }
      if (!taskSubmitStartTime) {
        params.taskSubmitStartTime = ''
      }
      if (!taskSubmitEndTime) {
        params.taskSubmitEndTime = ''
      }
      if (!taskResultUpdateTime) {
        params.taskResultUpdateTime = ''
      }
      console.log('参数', params)
      savePromoterProjectForm(params).then(res => {
        this.loading = false
        if (res.code === '000000') {
          this.projectIdTemp = res.data
          this.$store.dispatch('dispatchUpdateProjectId', this.projectIdTemp)
          if (this.$props.flag === 'add') {
            this.resultVisible = true
          } else if (this.$props.flag === 'edit') {
            this.$emit('closeDrawer', {})
            this.$emit('reload')
          }
          this.$message.success('保存成功')
        } else {
          this.$message.success(res.message)
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.ruleForm.shortName = null
      this.ruleForm.replaceName = null
      this.ruleForm.areas = []
      this.ruleForm.address = null
      this.ruleForm.scale = null
      this.ruleForm.industry = null
      this.ruleForm.style = null
      this.ruleForm.logo = null
      this.ruleForm.logoWeb = null
      this.ruleForm.introduce = null
      this.ruleForm.fileList = []
      this.ruleForm.companyPictures = []
      this.ruleForm.companyVideo = null
      this.ruleForm.companyVideoWeb = null
      this.ruleForm.companyWxMp = null
      this.ruleForm.website = null
      this.ruleForm.companyWxQr = null
      this.ruleForm.companyWxQrUrl = null
      this.ruleForm.companyWzLogo = null
      this.ruleForm.companyWzLogoUrl = null
      this.ruleForm.companyWzFirstLogo = null
      this.ruleForm.companyWzFirstLogoUrl = null
    }

  }
}
</script>

<style lang="scss" scoped>
  .tip{
      font-size: 13px;
      color: #1678f9;
    }
.guide-modal{
  text-align: center;
  .title{
    font-size: 16px;
    font-weight: bold;
  }
  .content{
    margin-top: 20px;
    line-height: 22px;
  }
  ::v-deep  .el-dialog__footer{
    text-align: center;
  }
}
::v-deep .el-tabs__nav-wrap::after{
  background-color: #E4E7ED !important;
}
.el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 14px;
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
.release-position-page {
  // 兼容发布职位页样式
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 30px 20px 0 20px;
  box-sizing: border-box;
  width: 695px;
  margin-left: -20px;
  margin-bottom: 30px;

  &.edit{
    .el-textarea{
        input{
          width: 315px !important;
        }
      }
      .el-input,.el-select,.el-cascader{
        width: 315px !important;
      }
      ::v-deep .el-input,.el-textarea{
        input{
          width: 315px !important;
        }
        width: 315px !important;
      }
      ::v-deep .el-form-item__label{
        width: 110px !important;
      }
      .two-row{
        .el-col-10{
          width: 100%;
          float: inherit;
          ::v-deep el-form-item__content{
            margin-left: 0;
          }
          .el-form-item{
            margin-bottom: 15px;
          }
        }
        .el-col-14{
          float: inherit;
          width: 315px;
          margin-left: 102px;
        }
      }
      .desc{
        left: 180px !important;
      }
      ::v-deep  .el-upload__tip{
        margin-left: 20px;
      }
    }

}
</style>
