<template>
  <div class="top-part">
    <div class="part-left">
      <div class="left-title">{{ currData.name || '全部人才' }}</div>
      <div class="left-sub">{{ currData.remark }}</div>
    </div>
    <div class="part-right">
      <el-menu class="sub-menu" :default-active="activeIndex" mode="horizontal">
        <el-submenu index="1" popper-class="sub-menu-popper">
          <template slot="title"><el-button class="right-btn w-68">新增简历</el-button></template>
          <el-menu-item index="fastUpload" class="hand-create" @click="uploadResume">快速上传</el-menu-item>
          <el-menu-item index="handCreate" class="fast-upload" @click="handCreate">手动创建</el-menu-item>
        </el-submenu>
      </el-menu>
      <el-button class="right-btn w-68" @click="toTalentReview">人才盘点</el-button>
    </div>

    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer v-if="drawer" slot="inner-body" ref="uploadDrawer" @fatherMethod="close" @finishUpload="finishUpload" />
    </drawer-common>

    <el-dialog
      title="手动创建简历"
      :visible.sync="createResumeVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <!-- 基本信息 -->
      <!-- 表单编辑 -->
      <div class="base-info">
        <div class="edit-form">
          <el-form
            ref="baseInfoForm"
            :rules="baseInfoFormRules"
            :model="baseInfoForm"
            label-width="95px"
            :inline="true"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="baseInfoForm.name" class="w-100"></el-input>
              <el-radio-group v-model="baseInfoForm.gender" class="ml-8">
                <el-radio :label="1">先生</el-radio>
                <el-radio :label="2">女士</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="mini-orange-dot" label="所在地" prop="liveCity">
              <select-picker
                :class-name="'live-city-picker'"
                :key-name="'liveCity'"
                :first-tab-name="firstTabNameAddress"
                :data-source="addressArr1"
                :max-number="1"
                :level-number="2"
                :default-value="['']"
                :form-name="'baseInfoForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
              />
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="baseInfoForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="baseInfoForm.email"></el-input>
            </el-form-item>
            <el-form-item label="出生年月" prop="birthday">
              <el-date-picker
                v-model="baseInfoForm.birthday"
                :clearable="false"
                value-format="yyyy-MM"
                type="month"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="工作年份" prop="startWorkMonth">
              <el-date-picker
                v-model="baseInfoForm.startWorkMonth"
                :clearable="false"
                value-format="yyyy-MM"
                type="month"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="目前公司" prop="currentCompanyName">
              <el-input v-model="baseInfoForm.currentCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="目前职位" prop="currentPosition">
              <el-input v-model="baseInfoForm.currentPosition"></el-input>
            </el-form-item>
            <el-form-item label="毕业院校" prop="graduateSchool">
              <el-input v-model="baseInfoForm.graduateSchool"></el-input>
            </el-form-item>
            <el-form-item label="最高学历" prop="degreeCode">
              <el-select v-model="baseInfoForm.degreeCode" placeholder="请选择">
                <el-option
                  v-for="(item,index) in degreeArrTemp"
                  :key="index"
                  :label="item.label"
                  :value="item.value - 0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('baseInfoForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('baseInfoForm',[{keyName:'liveCity',rules:'请选择所在地'}])">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SelectPicker from '@/components/common/selectPicker'
import { isRealNum } from '@/utils/common'
import DrawerCommon from '@/components/common/drawerCommon'
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer'
import { getResumeFile, addResumeDetail } from '@/api/resume'
import resumeDict from '@/assets/js/resume'
import { getDict } from '@/api/common'

export default {
  components: {
    DrawerCommon,
    UploadDrawer,
    SelectPicker
  },
  props: {
    // 查询类型
    queryType: {
      type: Number,
      required: true
    },
    // 当前选中文件夹
    selectedFolder: {
      type: Object,
      required: true
    },
    // 当前选中标签
    selectedLabels: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      degreeArrTemp: resumeDict.degree,
      activeIndex: '1',
      drawer: false,
      folderIds: null,
      createResumeVisible: false,
      baseInfoForm: {
        name: null,
        gender: null,
        liveCity: null,
        mobile: null,
        email: null,
        age: null,
        startWorkMonth: null,
        currentCompanyName: null,
        title: null,
        graduateSchool: null,
        degreeCode: null
      },
      baseInfoFormRules: {
        name: [
          {
            required: true,
            validator: this.$verify.trueNameFormat,
            trigger: 'blur'
          }
        ],
        liveCity: [
          { required: true, message: '请选择所在地', trigger: 'blur' }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     validator: this.$verify.phoneFormat,
        //     trigger: 'blur'
        //   }
        // ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        birthday: [
          { required: true, message: '请选择出生年月', trigger: 'blur' }
        ],
        startWorkMonth: [
          { required: true, message: '请选择工作年限', trigger: 'blur' }
        ],
        currentCompanyName: [
          { required: true, message: '请填写目前公司', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请填写目前职位', trigger: 'blur' }],
        graduateSchool: [
          { required: true, message: '请填写毕业学校', trigger: 'blur' }
        ],
        degreeCode: [
          { required: true, message: '请选择最高学历', trigger: 'blur' }
        ]
      },
      firstTabNameAddress: '', // selectPicker选中项tab
      addressArr1: [] // 省市区数据字典
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData
    }),
    // 当前展示数据
    currData() {
      if (this.queryType === 1) {
        return {
          name: '全部人才',
          remark: ''
        }
      } else if (this.queryType === 2) {
          return this.selectedFolder
      } else if (this.queryType === 4) {
        this.$set(this.selectedLabels, 'name', this.selectedLabels.labelName)
        return this.selectedLabels
      } else {
        return {
          name: '回收站',
          remark: ''
        }
      }
    }
  },
  mounted() {
    let dictDataRes = {}
      getDict().then(res => {
        dictDataRes = res
        const dictData = dictDataRes
        const selectedData = dictDataRes.selectedData
        console.log(dictDataRes, dictData, selectedData)
        // 所在地
        this.addressArr1 =
          dictData && JSON.parse(JSON.stringify(dictData.areas))
        this.addressArr1 &&
          this.addressArr1.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 期望城市
        this.addressArr2 =
          dictData && JSON.parse(JSON.stringify(dictData.areas))
        this.addressArr2 &&
          this.addressArr2.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 期望行业
        this.industryArr1 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr1 &&
          this.industryArr1.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 所属行业
        this.industryArr2 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr2 &&
          this.industryArr2.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        this.industryArr3 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr3 &&
          this.industryArr3.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 求职状态
        this.jobStatusArr =
          dictData && dictData.dicts && dictData.dicts.jobStatus
        // 企业规模
        this.scaleArr =
          dictData && dictData.dicts && dictData.dicts.enterpriseScale
        // 公司性质
        this.enterprisePropertyArr =
          dictData && dictData.dicts && dictData.dicts.enterpriseProperty
        // 口语听力能力
        this.readListenSkillsArr =
          dictData && dictData.dicts && dictData.dicts.readListenSkills
        this.$nextTick(() => {
          // 初始化数据
          this.baseInfoForm.intentionCity =
            selectedData && selectedData.intentionCity
          this.baseInfoForm.intentionIndustryId =
            selectedData && selectedData.intentionIndustryId
          this.workExpForm.vocation = selectedData && selectedData.vocation
        })
        // 简历详情
        this.loading = true
        this.getResumeInfoById()
        this.loading = false
      })
  },
  methods: {
    // 基本信息（编辑）
    addResumeDetail(values) {
      const params = values
      params.name = values.name
      params.gender = values.gender - 0
      params.liveCity =
        this.selectedData.liveCity && this.selectedData.liveCity[0] - 0
      params.mobile = values.mobile
      params.birthday = values.birthday
      params.startWorkMonth = values.startWorkMonth
      params.currentCompanyName = values.currentCompanyName
      params.currentPosition = values.currentPosition
      params.graduateSchool = values.graduateSchool
      params.degreeCode = values.degreeCode - 0
      // params.avatar = values.avatar
      // params.avatarImg = this.avatarImg
      delete params.workMonth
      console.log('基本信息params', params)
      addResumeDetail(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('baseInfoForm')
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$emit('searchList')
          }, 500)
        }
      })
    },
    // 取消编辑
    cancelForm(name) {
      this.baseInfoForm = {}
      this.createResumeVisible = false
    },
    // 保存
    submitForm(formName, keyNameArr, isRefArr, id) {
        // 一般默认表单校验
        this.$refs[formName].validate((valid, object) => {
          console.log(444, formName, object)
          if (valid) {
            if (formName === 'baseInfoForm') {
              this.addResumeDetail(this[formName])
            }
            setTimeout(() => {
              this.createResumeVisible = false
            }, 1000)
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },
    // 删除指定校验
    deleteRules(val) {
      const num = val.formName[val.formName.length - 1] - 0
      if (isRealNum(num)) {
        // 循环ref表单校验删除（循环的表单类型是数组）
        delete this[val.formName.slice(0, -1) + 'Rules'][val.keyName]
        this.$refs[val.formName][0].clearValidate(val.keyName)
      } else {
        // 循环ref表单校验删除
        console.log(
          555,
          val.keyName,
          this[val.formName + 'Rules'][val.keyName][0].required
        )
        this[val.formName + 'Rules'][val.keyName][0].required = false
        // delete this[val.formName + 'Rules'][val.keyName]
        this.$refs[val.formName].clearValidate(val.keyName)
      }
    },
    handleClose() {
      this.createResumeVisible = false
    },
    handCreate() {
      this.createResumeVisible = true
    },
    finishUpload() {
      this.$message.success('上传成功')
      const folderDataResume = JSON.parse(sessionStorage.getItem('folderDataResume'))
      if (folderDataResume && folderDataResume.id) {
        setTimeout(() => {
          this.$emit('searchList')
        }, 500)
      }
      setTimeout(() => {
        this.close()
      }, 1500)
    },
    getResumeFile() {
      getResumeFile().then(res => {
      })
    },
    // 跳转到人才盘点页
    toTalentReview() {
      this.$router.push({
        name: 'talentReview',
        params: {}
      });
    },
    // 快速上传
    uploadResume() {
      this.drawer = true
    },
    // 手动创建
    handleCreate() {

    },
    close() {
      this.drawer = false
      this.$refs.uploadDrawer.destroyedInterval()
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/resume/topPart.scss';
.top-part{
   .dialog-footer{
     button{
       border-radius: 4px;
       height: auto;
       margin-left: 15px;
     }
   }
   .el-dialog__body{
     padding-bottom: 0;
   }
  .base-info {
      .el-date-editor {
          .el-input__prefix {
              right: -14px !important;
          }
      }
      .edit-form .el-form-item {
          min-width: 400px;
      }
  }
  .edit-form {
        padding: 0px 5px 0px 30px;
        border-radius: 4px;
        .el-date-editor {
            .el-icon-date {
                font-family: 'iconfont' !important;
                font-size: 13px;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                line-height: 27px;
                &::before {
                    content: '\e62b';
                    color: #1678f9;
                }
            }
            .el-input__prefix {
                background-color: #eee;
                border-left: 1px solid #e5e5e5;
                width: 60px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                top: 0.5px !important;
                height: 27px;
                right: 21px;
            }
        }
        .diy-select {
            width: 200px;
            .el-icon-caret-bottom {
                right: 12px;
                top: 6px;
            }
            .el-icon-circle-close {
                right: -27px;
                top: 5px;
            }
        }
        .btns {
            width: 100% !important;
            margin-top: 20px;
            text-align: center;
            &.btns-thin {
                button {
                    margin: 0 9px;
                }
            }
            .el-form-item__content {
                margin: 0 auto;
            }
            button {
                margin: 0 49px;
                border-radius: 4px;
                font-size: 13px;
                height: 30px;
                line-height: 30px;
                width: 80px;
                padding: 0;
                &.el-button--default {
                    color: #1678f9;
                    border: 1px solid rgba(22, 120, 249, 1);
                }
                &.el-button--primary {
                    background: rgba(22, 120, 249, 1);
                    border-radius: 4px;
                }
                &.el-button--text {
                    color: #979899;
                    border-color: #979899;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
        .el-form-item {
            width: 48%;
            min-width: 600px;
            margin-bottom: 20px;
        }
        .el-form-item__label {
            line-height: 28px;
            text-align: left;
            color: #8D9299;
            position: relative;
            font-size: 13px;
        }
        .el-radio-group {
            height: 22px;
            margin-top: 5px;
            overflow: hidden;
            .el-radio {
                margin-right: 20px;
                overflow: hidden;
            }
            .el-radio__input.is-checked {
                border: 3px solid #1678f9;
                border-radius: 100%;
                .el-radio__inner {
                    width: 12px;
                    height: 12px;
                }
            }
            .el-radio__inner {
                border-color: #eee;
                width: 18px;
                height: 18px;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: #fff;
                background: #fff;
                border-radius: 100%;
            }
            .el-radio__inner::after {
                background-color: #1678f9;
                border-radius: 6px;
                width: 6px;
                height: 6px;
            }
            .el-radio__label {
                font-size: 13px;
                color: #0D121A;
                vertical-align: middle;
            }
        }
        .el-input__suffix {
            top: 7px;
            right: 11px;
            .el-icon-arrow-up {
                transition: transform 0.3s;
                transform: rotate(0deg);
                background: url('~@/assets/images/common/arrow.png') no-repeat;
                background-size: 9px;
                width: 10px;
                height: 16px;
                &::before {
                    display: none;
                }
            }
        }
        .el-input {
            height: 28px;
            background-color: transparent;
            &.w-100 {
                .el-input__inner {
                    width: 100px;
                }
            }
            .el-input__inner {
                padding: 0 12px;
                width: 235px;
                height: 28px;
                line-height: 28px;
                background-color: transparent;
                color: #0D121A;
                font-size: 13px;
                border-color: #e5e5e5;
            }
        }
        .el-textarea {
            .el-input__count {
                background-color: transparent;
            }
            .el-textarea__inner {
                width: 644px;
                resize: none;
                height: 130px !important;
                padding: 0 12px;
                line-height: 28px;
                background-color: transparent;
                color: #0D121A;
                font-size: 13px;
                border-color: #e5e5e5;
            }
            .el-input__count {
                bottom: -22px;
                right: 0;
            }
        }
    }
  .base-info {
        background-color: #fff;
        padding: 0;
        box-sizing: border-box;
        h3 {
            margin-bottom: 20px;
            color: #333333;
            font-size: 13px;
            font-weight: 600;
            position: relative;
            &::before {
                content: "";
                width: 20px;
                height: 20px;
                display: inline-block;
                background: url('~@/assets/images/resume/resumeDetailSupplier/baseinfo.png') no-repeat;
                background-size: 20px;
                vertical-align: -5px;
                margin-right: 8px;
            }
            .edit {
                cursor: pointer;
                color: #808080;
                font-size: 13px;
                font-weight: normal;
                position: absolute;
                z-index: 10;
                right: 0;
                &::before {
                    content: '';
                    width: 16px;
                    height: 16px;
                    display: inline-block;
                    background: url('~@/assets/images/resume/icon_edit.png') no-repeat;
                    background-size: 16px;
                    vertical-align: -3px;
                    margin-right: 3px;
                }
                &.disabled {
                    &::after {
                        content: " ";
                        position: absolute;
                        left: 0;
                        top: 0px;
                        width: 101%;
                        height: 16px;
                        background: #fff;
                        opacity: 0.65;
                        z-index: 20;
                    }
                }
            }
        }
        .text-form {
            .avatar {
                top: 5px;
            }
        }
    }
    .edit-form {
        .el-form-item {
            &.mini-orange-dot {
                .el-form-item__label {
                    position: relative;
                    &::before {
                        color: #FF5D1E;
                        content: "*";
                        font-size: 13px;
                        display: inline-block;
                        position: absolute;
                        left: -10px;
                        top: -2px;
                    }
                }
            }
        }
    }
  .base-info .edit-form .el-date-editor .el-input__prefix {
        left: inherit;
    }
  .part-right{
    display: flex;
    .sub-menu{
      display: inline-block;
      .el-submenu__title{
            border-bottom-color: transparent;
            padding: 0;
            height: auto;
            line-height: inherit;
            border: none;
            button{
               margin: 0;
            }
      }
      .el-submenu__icon-arrow{
        display: none;
      }
    }
  }
}
.sub-menu-popper{
  .el-menu--popup{
    min-width: 103px;
  }
  ul li{
    font-size: 13px;
    position: relative;
    padding-left: 38px !important;
    &::before{
      content: "";
      width: 20px;
      height: 20px;
      display: inline-block;
      position: absolute;
      left: 10px;
      top: 7.5px;
    }
    &.fast-upload{
      &::before{
        background: url('~@/assets/images/resume/add_icon.png') no-repeat;
        background-size: 20px;
      }
    }
    &.hand-create{
      &::before{
        background: url('~@/assets/images/resume/upload_icon.png') no-repeat;
        background-size: 20px;
      }
    }
    &:hover{
      color:#1678F9 !important;
      &.fast-upload{
        &::before{
          background: url('~@/assets/images/resume/add_icon_active.png') no-repeat;
          background-size: 20px;
        }
      }
      &.hand-create{
        &::before{
          background: url('~@/assets/images/resume/upload_icon_active.png') no-repeat;
          background-size: 20px;
        }
      }
    }
  }
}

</style>
