<template>
  <div ref="analyseResume" class="analyse-resume">
    <!-- 导航 -->
    <ul class="nav">
      <li
        v-for="(item,index) in navList"
        :key="index"
        :class="[item.current && 'current']"
        @click="anchorJump(index)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <!-- 内容 -->
    <div class="resume-cont">
      <div ref="leftCont" class="left-cont">
        <resume-detail :resume-id="$route.query.id - 0" />
      </div>
      <div class="right-cont">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文本简历" name="textResume">
            <textarea v-model="textFileWebUrl" class="origin-text" readonly></textarea>
          </el-tab-pane>
          <el-tab-pane label="原始简历" name="originResume">
            <img v-if="extension === 'jpg' || extension === 'png'" :src="dbPathUrl" />
            <iframe
              v-else
              id="resume-iframe"
              width="100%"
              height="100%"
              :src="dbPathUrl"
              frameborder="0"
            ></iframe>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 保存并上传 -->
    <!-- <el-button
      v-loading="uploadLoading"
      type="primary"
      class="fixed-btn"
      @click="saveAndUpload"
    >保存并上传</el-button>-->
  </div>
</template>

<script>
import { updateResumeInfoById } from '@/api/resume'
import { mapState } from 'vuex'
import { isRealNum } from '@/utils/common'
import ResumeDetail from '@/components/resume/index/resumeDetail'

export default {
  components: {
    ResumeDetail
  },
  data() {
    return {
      clientHeight: '',
      textFileWebUrl: null,
      extension: null,
      dbPathUrl: null,
      activeName: 'textResume',
      navList: [
        {
          id: 'basic-info',
          name: '基本信息',
          current: true
        },
        {
          id: 'apply-intent',
          name: '求职意向',
          current: false
        },
        {
          id: 'edu-exp',
          name: '教育经历',
          current: false
        },
        {
          id: 'work-exp',
          name: '工作经历',
          current: false
        },
        {
          id: 'project-exp',
          name: '项目经验',
          current: false
        },
        {
          id: 'train-exp',
          name: '培训经历',
          current: false
        },
        {
          id: 'lang-power',
          name: '语言能力',
          current: false
        },
        {
          id: 'certify-info',
          name: '证书信息',
          current: false
        },
        {
          id: 'self-eval',
          name: '自我评价',
          current: false
        },
        {
          id: 'append-info',
          name: '附加信息',
          current: false
        },
        {
          id: 'my-prod',
          name: '我的作品',
          current: false
        }
      ],
      baseInfoForm: {
        name: null,
        gender: '1',
        address: null,
        telephone: null,
        email: null,
        age: null,
        workAge: null,
        companyName: null,
        jobName: null,
        school: null,
        edu: null
      },
      baseInfoFormRules: {
        name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        address: [{ required: true, message: '请选择所在地', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请填写手机号', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请填写邮箱', trigger: 'blur' }],
        age: [{ required: true, message: '请填写年龄', trigger: 'blur' }],
        workAge: [
          { required: true, message: '请选择工作年限', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请填写目前公司', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请填写目前职位', trigger: 'blur' }
        ],
        school: [
          { required: true, message: '请填写毕业学校', trigger: 'blur' }
        ],
        edu: [{ required: true, message: '请选择最高学历', trigger: 'blur' }]
      },
      jobIntentForm: {
        jobStatus: null,
        yearSalary: null,
        hopeJob: null,
        hopeIndustry: null,
        hopeCity: null
      },
      jobIntentFormRules: {
        jobStatus: [
          { required: true, message: '请选择求职状态', trigger: 'change' }
        ],
        yearSalary: [
          { required: true, message: '请选择年薪', trigger: 'change' }
        ],
        hopeJob: [
          { required: true, message: '请填写期望职位', trigger: 'blur' }
        ],
        hopeIndustry: [
          { required: true, message: '请选择期望行业', trigger: 'blur' }
        ],
        hopeCity: [
          { required: true, message: '请选择期望城市', trigger: 'blur' }
        ]
      },
      eduExpForm: {
        attendStartDate: null,
        attendEndDate: null,
        schoolName: null,
        specialtyName: null,
        edu: null,
        recruitment: '1',
        remark: null
      },
      eduExpFormRules: {
        attendStartDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        attendEndDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        schoolName: [
          { required: true, message: '请填写学校名称', trigger: 'blur' }
        ],
        specialtyName: [
          { required: true, message: '请填写就读专业', trigger: 'blur' }
        ],
        edu: [{ required: true, message: '请选择学历', trigger: 'change' }],
        recruitment: [
          { required: true, message: '请选择是否统招', trigger: 'change' }
        ]
      },
      workExpForm: {
        takeStartDate: null,
        takeEndDate: null,
        companyName: null,
        belongIndustry: null,
        companyScale: null,
        companyProperty: null,
        introduce: null,
        jobName: null,
        department: null,
        takeArea: null,
        overseas: '1',
        reportTo: null,
        understrapper: null,
        duty: null,
        performance: null,
        dimission: null
      },
      workExpFormRules: {
        takeStartDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        takeEndDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请填写职位名称', trigger: 'blur' }
        ],
        belongIndustry: [
          { required: true, message: '请选择所属行业', trigger: 'blur' }
        ]
      },
      projectExpForm: {
        projectStartDate: null,
        projectEndDate: null,
        projectName: null,
        projectCompany: null,
        projectJob: null,
        projectDescribe: null,
        projectDuty: null,
        projectPerformance: null
      },
      projectExpFormRules: {
        projectStartDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        projectEndDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        projectDescribe: [
          { required: true, message: '请填写项目描述', trigger: 'blur' }
        ]
      },
      trainExpForm: {
        trainStartDate: null,
        trainEndDate: null,
        trainCourse: null,
        trainOrg: null
      },
      trainExpFormRules: {
        trainStartDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        trainEndDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        trainCourse: [
          { required: true, message: '请填写培训课程', trigger: 'blur' }
        ],
        trainOrg: [
          { required: true, message: '请填写培训机构', trigger: 'blur' }
        ]
      },
      langPowerForm: {
        language: null,
        tongue: null,
        write: null,
        langLevel: null
      },
      langPowerFormRules: {
        language: [{ required: true, message: '请填写语种', trigger: 'blur' }],
        tongue: [
          { required: true, message: '请选择口语能力', trigger: 'change' }
        ],
        write: [
          { required: true, message: '请选择书写能力', trigger: 'change' }
        ]
      },
      certInfoForm: {
        getDate: null,
        certInfoName: null,
        certInfoDesc: null
      },
      certInfoFormRules: {
        getDate: [
          { required: true, message: '请选择获取时间', trigger: 'change' }
        ],
        certInfoName: [
          { required: true, message: '请填写证书名称', trigger: 'change' }
        ]
      },
      selfEvalForm: {
        evaluate: null
      },
      myProductForm: {
        uploadFile: null,
        productUrl: null
      },
      myProductFormRules: {
        productUrl: [
          { required: true, message: '请填写链接作品', trigger: 'blur' }
        ]
      },
      eduExpArr: [0, 1], // 教育经历数据list
      workExpArr: [0, 1], // 工作经历数据list
      eduExpEditFlag: null, // 教育经历编辑标识
      workExpEditFlag: null, // 工作经历编辑标识
      projectExpEditFlag: null, // 项目经验编辑标识
      trainExpEditFlag: null, // 培训经历编辑标识
      langPowerEditFlag: null, // 培训经历编辑标识
      certInfoEditFlag: null, // 证书信息编辑标识
      addressArr: [], // 省市区数据字典
      industryArr: [], // 行业数据字典
      firstTabNameAddress: '', // selectPicker选中项tab
      firstTabNameCity: '', // selectPicker选中项tab
      firstTabNameIndustry: '', // selectPicker选中项tab
      firstTabNameBelongIndustry: '', // selectPicker选中项tab
      defaultValueAddress: ['330500'], // 所在地初始值
      defaultValueCity: ['321100'], // 期望城市初始值
      defaultValueIndustry: ['104001'], // 期望行业初始值
      defaultValueBelongIndustry: ['104001'], // 所属行业初始值
      baseInfoVisible: false, // 编辑基本信息
      jobIntentVisible: false, // 编辑求职意向
      eduExpVisible: false, //  编辑教育经历
      workExpVisible: false, // 编辑工作经历
      projectExpVisible: false, // 编辑项目经验
      trainExpVisible: false, // 编辑培训经历
      langPowerVisible: false, // 编辑语言能力
      certInfoVisible: false, // 编辑证书信息能力
      selfEvalVisible: false, // 编辑自我评价能力
      addEduExpVisible: false, // 添加教育经历
      addWorkExpVisible: false, // 添加工作经历
      addProjectExpVisible: false, // 添加项目经验
      addTrainExpVisible: false, // 添加培训经历
      addLangPowerVisible: false, // 添加语言能力
      addCertInfoVisible: false, // 添加证书信息
      addMyProductVisible: false, // 添加我的作品
      uploadLoading: false
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData
    })
  },
  watch: {
    clientHeight() {
      // 如果clientHeight 发生改变，这个函数就会运行
      this.changeFixed(this.clientHeight)
    }
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}` // 获取浏览器可视区域高度
    const that = this
    window.onresize = function() {
      that.clientHeight = `${document.documentElement.clientHeight}`
      if (that.$refs.analyseResume) {
        that.$refs.analyseResume.style.height = that.clientHeight - 50 + 'px'
      }
    }
    this.$nextTick(() => {
      this.textFileWebUrl = localStorage.getItem('textFileWebUrl')
      this.extension = this.$route.query.extension
      if (
        this.$route.query.extension === 'jpg' ||
        this.$route.query.extension === 'png'
      ) {
        this.dbPathUrl = localStorage.getItem('dbPathUrl')
      } else {
        const index = localStorage.getItem('dbPathUrl').lastIndexOf('.')
        const endText = localStorage
          .getItem('dbPathUrl')
          .substring(index + 1, localStorage.getItem('dbPathUrl').length)
        if (endText.indexOf('pdf') !== -1 || endText.indexOf('html') !== -1) {
          this.dbPathUrl = localStorage.getItem('dbPathUrl')
          console.log(111111, this.dbPathUrl)
        } else {
          this.dbPathUrl =
            'https://view.officeapps.live.com/op/view.aspx?src=' +
            encodeURIComponent(localStorage.getItem('dbPathUrl'))
        }
      }
    })

    // 滚动监听
    this.$nextTick(() => {
      this.scollInnerComponent(this.navList, 'leftCont')
    })

    // 所在地
    this.addressArr = this.dictData.areas
    this.addressArr.map(item => {
      if (item.children && item.children.length > 0) {
        item.children.map(x => {
          delete x.children
        })
      } else {
        delete item.children
      }
    })
    Array.isArray(this.defaultValueAddress) &&
      this.defaultValueAddress.length > 0 &&
      this.addressArr.filter(item => {
        item.children &&
          item.children.filter(i => {
            if (i.value === this.defaultValueAddress[0]) {
              this.firstTabNameAddress = item.value
              return i.value
            }
          })
      })
    // 期望城市
    Array.isArray(this.defaultValueCity) &&
      this.defaultValueCity.length > 0 &&
      this.addressArr.filter(item => {
        item.children &&
          item.children.filter(i => {
            if (i.value === this.defaultValueCity[0]) {
              this.firstTabNameCity = item.value
              return i.value
            }
          })
      })
    // 期望行业
    this.industryArr = this.dictData.industry
    this.industryArr.map(item => {
      if (item.children && item.children.length > 0) {
        item.children.map(x => {
          delete x.children
        })
      } else {
        delete item.children
      }
    })
    Array.isArray(this.defaultValueIndustry) &&
      this.defaultValueIndustry.length > 0 &&
      this.industryArr.filter(item => {
        if (item.value === this.defaultValueIndustry[0]) {
          this.firstTabNameIndustry = item.value
          return item.value
        } else {
          item.children &&
            item.children.filter(i => {
              if (i.value === this.defaultValueIndustry[0]) {
                this.firstTabNameIndustry = item.value
                return i.value
              }
            })
        }
      })
    // 所属行业
    Array.isArray(this.defaultValueBelongIndustry) &&
      this.defaultValueBelongIndustry.length > 0 &&
      this.industryArr.filter(item => {
        if (item.value === this.defaultValueBelongIndustry[0]) {
          this.firstTabNameBelongIndustry = item.value
          return item.value
        } else {
          item.children &&
            item.children.filter(i => {
              if (i.value === this.defaultValueBelongIndustry[0]) {
                this.firstTabNameBelongIndustry = item.value
                return i.value
              }
            })
        }
      })
    this.$nextTick(() => {
      // 初始化数据
      this.baseInfoForm.hopeCity = this.selectedData.hopeCity
      this.baseInfoForm.hopeIndustry = this.selectedData.hopeIndustry
      this.workExpForm.belongIndustry = this.selectedData.belongIndustry
    })
  },
  methods: {
    saveAndUpload() {
      this.uploadLoading = true
      this.updateResumeInfoById()
    },
    updateResumeInfoById() {
      const params = {
        id: this.$route.query.id
      }
      updateResumeInfoById(params).then(res => {
        this.uploadLoading = false
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    changeFixed(clientHeight) {
      if (this.$refs.analyseResume) {
        this.$refs.analyseResume.style.height = clientHeight - 50 + 'px'
      }
    },
    // 锚点定位
    anchorJump(index) {
      document.getElementById(this.navList[index]['id']).scrollIntoView()
      this.navList.map((item, i) => {
        if (i === index) {
          item.current = true
        } else {
          item.current = false
        }
        return item
      })
    },
    // 页面局部滚动锚点定位监听
    scollInnerComponent(arr, ref) {
      this.$refs[ref].addEventListener('scroll', () => {
        const offsetTopTemp = this.$refs[ref].offsetTop
        arr &&
          arr.map(item => {
            if (
              document.getElementById(item.id).offsetTop - offsetTopTemp <=
              this.$refs[ref].scrollTop
            ) {
              arr &&
                arr.map(i => {
                  if (item.id === arr && arr[0].id) {
                    i.current = true
                  } else {
                    i.current = false
                  }
                })
              item.current = true
              return item
            } else {
              if (item.id === arr && arr[0].id) {
                item.current = true
              } else {
                item.current = false
              }
              return item
            }
          })
      })
    },
    // tab切换
    handleClick() {},
    // 编辑
    editIt(name, index) {
      this[name + 'EditFlag'] = index
      this[name + 'Visible'] = true
    },
    // 添加
    addIt(name) {
      this[name + 'Visible'] = true
      console.log(222222222, this.addTrainExpVisible)
    },
    // 取消编辑
    cancelForm(name) {
      console.log(name)
      // this.eduExpArr = [0, 1]
      // this.workExpArr = [0, 1]
      this[name.slice(0, -4) + 'EditFlag'] = null
      this[name.slice(0, -4) + 'Visible'] = false
    },
    // 保存
    submitForm(formName, keyNameArr, isRefArr) {
      // 初始化表单校验
      keyNameArr &&
        keyNameArr.filter(item => {
          if (
            Array.isArray(this.selectedData[item.keyName]) &&
            this.selectedData[item.keyName].length > 0
          ) {
            this.deleteRules({ formName, keyName: item.keyName })
          } else {
            this[formName + 'Rules'][item.keyName] = [
              { required: true, message: item.rules, trigger: 'change' }
            ]
          }
        })
      if (isRefArr) {
        // 循环ref表单校验（循环的表单类型是数组）
        this.$refs[formName][0].validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        // 一般默认表单校验
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
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
        delete this[val.formName + 'Rules'][val.keyName]
        this.$refs[val.formName].clearValidate(val.keyName)
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/resume/analyseResume.scss';
</style>
