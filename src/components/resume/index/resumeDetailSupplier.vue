/**
 * 人才详情（HR&供应商）
 */
<template >
  <div>
    <div ref="resumeDetailSupplier" class="resume-detail-supplier">
      <div class="resume-header">
        <p v-if="detailData.detail" class="left">
          <span>#{{ detailData.detail.id }}</span>
          <span v-if="detailData.detail.updateDay">更新时间 {{ detailData.detail.updateDay }}</span>
          <span
            v-if="detailData.detail.createTime"
          >创建时间 {{ detailData.detail.createTime }}</span>
          <span
            v-if="detailData.createUserName"
          >创建人 {{ detailData.createUserName }}</span>
        </p>
      </div>
      <div class="resume-cont">
        <!-- 左侧 -->
        <div class="supplier-left">
          <!-- 头部 -->
          <div v-loading="loading" class="supplier-header">
            <div v-if="detailData && detailData.detail" class="part-1">
              <img v-if="detailData.detail.avatarImg" :src="detailData.detail.avatarImg" />
              <img
                v-else-if="detailData.detail.gender === 1"
                src="~@/assets/images/common/man_avatar.png"
              />
              <img
                v-else-if="detailData.detail.gender === 2"
                src="~@/assets/images/common/women_avatar.png"
              />
              <img v-else src="~@/assets/images/common/avatar.png" />
              <p class="name">{{ detailData.detail.name }}</p>
              <p class="labels">
                <span v-for="(item,index) in resumeLabels" :key="index">{{ item && item.labelName }}</span>
                <span class="add" @click="setLabels">添加标签</span>
              </p>

              <div class="operate-btns">
                <template v-if="$props.companyAccountType">
                  <el-button
                    v-if="$props.companyAccountType === 2"
                    size="mini"
                    @click="nowRecommend"
                  >推荐其他职位</el-button>
                </template>
                <template v-else>
                  <el-button
                    v-if="userInfo && userInfo.companyAccountType === 2"
                    size="mini"
                    @click="nowRecommend"
                  >推荐其他职位</el-button>
                </template>
                <template v-if="userInfo && userInfo.companyAccountType === 1">
                  <el-button size="mini" class="icon-add" @click="addJob">加入职位</el-button>
                </template>
                <el-button
                  v-if="queryType === 1 || queryType === 2"
                  size="mini"
                  @click="addRemark"
                >添加备注</el-button>
                <el-dropdown v-if="queryType === 1 || queryType === 2" trigger="click">
                  <el-button size="small" class="resume-more-btn">更多</el-button>
                  <el-dropdown-menu slot="dropdown" class="resume-dropdown">
                    <el-dropdown-item>
                      <span @click="addToFile">加入文件夹</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span @click="addToLib">加入人才库</span>
                    </el-dropdown-item>
                    <el-popconfirm
                      title="是否放入回收站？"
                      class="divider-btn"
                      @onConfirm="editResumeToTalent(detailData.detail.id)"
                    >
                      <el-button slot="reference" size="small" class="item-dropdown-btn">放入回收站</el-button>
                    </el-popconfirm>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button v-if="queryType === 3" size="mini" @click="addToLib">移出回收站</el-button>
              </div>
            </div>

            <ul v-if="detailData && detailData.detail && baseInfoForm" class="part-2">
              <li>
                <p class="label">最近就职公司</p>
                <p class="company-name">{{ detailData.detail.currentCompanyName || '-' }}</p>
              </li>
              <li>
                <p class="label">最近就职职位</p>
                <p>{{ detailData.detail.currentPosition || '-' }}</p>
              </li>
              <li style="cursor:pointer">
                <p class="label">手机</p>
                <el-tooltip
                  v-if="detailData.detail.mobile"
                  effect="dark"
                  :content="detailData.detail.mobile"
                  placement="bottom"
                >
                  <p>{{ verfityMobile }}</p>
                </el-tooltip>
                <p v-else>{{ '-' }}</p>
              </li>
              <li style="cursor:pointer">
                <p class="label">邮箱</p>
                <el-tooltip
                  v-if="detailData.detail.email"
                  effect="dark"
                  :content="detailData.detail.email"
                  placement="bottom"
                >
                  <p>{{ verfityEmail }}</p>
                </el-tooltip>
                <p v-else>{{ '-' }}</p>
              </li>
              <li>
                <p class="label">工作经验</p>
                <p>{{ detailData.detail.workMonth|| '-' }}</p>
              </li>
            </ul>
            <ul v-if="detailData && detailData.detail && baseInfoForm" class="part-2">
              <li>
                <p class="label">年龄</p>
                <p v-if="detailData.detail.age">
                  {{ detailData.detail.age }}岁
                  <span
                    v-if="detailData.detail.birthday"
                  >({{ detailData.detail.birthday }})</span>
                </p>
                <p v-else>-</p>
              </li>
              <li>
                <p class="label">学历</p>
                <p
                  v-if="detailData.detail.degreeCode"
                >{{ detailData.detail.degreeCode | filterArr(degreeArrTemp) }}</p>
                <p v-else>-</p>
              </li>
              <li>
                <p class="label">所在城市</p>
                <p
                  v-if="detailData.detail.liveCity"
                >{{ detailData.detail.liveCity | filterLevel2(dictData.areas) }}</p>
                <p v-else>-</p>
              </li>
              <li>
                <p class="label">毕业院校</p>
                <p>{{ detailData.detail.graduateSchool || '-' }}</p>
              </li>
            </ul>
          </div>

          <!-- 简历信息&应聘记录 -->
          <div v-loading="loading" class="supplier-tabs">
            <el-tabs v-model="activeName">
              <el-tab-pane label="简历信息" name="resumeInfo">
                <!-- 操作 -->
                <div class="operate-part">
                  <div class="left">
                    <el-button-group>
                      <el-button
                        :class="[resumeFlag === 1 && 'active']"
                        @click="handleResume(1)"
                      >标准简历</el-button>
                      <el-button
                        :class="[resumeFlag === 2 && 'active']"
                        @click="handleResume(2)"
                      >原始简历</el-button>
                    </el-button-group>
                  </div>
                  <div class="right">
                    <a v-if="detailData && detailData.detail && detailData.detail.dbPathUrl" class="btn-download" :href="`/api/candidate/resumeBase/downloadAttachResume?resumeId=${resumeId}&x-client-token=${token}`">下载</a>
                    <span v-print="'#printTest'" class="btn-print">打印</span>
                  </div>
                </div>
                <!-- 简历&推荐报告 -->
                <div ref="resumeReport" class="resume-report">
                  <!-- 标准简历 -->
                  <resume-detail-new
                    v-if="resumeFlag == 1"
                    id="printTest"
                    :new-resume-detail="true"
                    :detail-data="detailData"
                  />
                  <!-- 原始简历 -->
                  <template v-if="resumeFlag == 2 && (detailData && detailData.detail)">
                    <template v-if="dbPathUrl">
                      <img
                        v-if="detailData.detail.extension === 'jpg' || detailData.detail.extension === 'png'"
                        :src="dbPathUrl"
                      />
                      <iframe
                        v-else
                        ref="resumeIframe"
                        width="100%"
                        height="100%"
                        :src="dbPathUrl"
                        frameborder="0"
                      ></iframe>
                    </template>
                    <div v-else class="empty">
                      <img src="~@/assets/images/order/blank.png" />
                      <p>暂无原始简历哦~</p>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane label="应聘记录" name="interviewRecord"></el-tab-pane> -->
            </el-tabs>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="supplier-right">
          <template v-if="$props.companyAccountType">
            <!-- 招聘管理 -->
            <resume-order-common
              v-if="$props.companyAccountType === 1"
              :resume-id="resumeId"
              :resume-name="detailData && detailData.detail && detailData.detail.name"
              :candidate-id="$props.candidateId"
            />
            <!-- 推荐管理 -->
            <resume-order-common
              v-if="$props.companyAccountType === 2"
              :resume-id="resumeId"
              :resume-name="detailData && detailData.detail && detailData.detail.name"
              :candidate-id="$props.candidateId"
            />
          </template>
          <!-- 人才库模块查看人才库详情 -->
          <template v-else>
            <!-- 企业角色（HR） -->
            <resume-order-common
              v-if="userInfo && userInfo.companyAccountType === 1"
              :resume-id="resumeId"
              :resume-name="detailData && detailData.detail && detailData.detail.name"
              :candidate-id="$props.candidateId"
            />
            <!-- 供应商角色 -->
            <resume-order-common
              v-if="userInfo && userInfo.companyAccountType === 2"
              :resume-id="resumeId"
              :resume-name="detailData && detailData.detail && detailData.detail.name"
              :candidate-id="$props.candidateId"
            />
          </template>

          <!-- 备注 -->
          <div class="remark-list">
            <p class="title">备注</p>
            <el-timeline v-if="remarkList && remarkList.length > 0">
              <el-timeline-item
                v-for="(item,index) in remarkList"
                :key="index"
                :timestamp="item.contactTime"
                placement="top"
              >
                <div class="operate-btn">
                  <el-button type="text" class="edit-btn" @click="editIt(item,'edit')">修改</el-button>
                  <el-popconfirm
                    title="您确认要删除本条备注信息吗？"
                    @onConfirm="confirmIt(item)"
                  >
                    <el-button slot="reference" type="text">删除</el-button>
                  </el-popconfirm>
                </div>
                <p>
                  <label v-if="item.contactUserName">{{ item.contactUserName }}：</label>
                  <span>{{ item.contactContent }}</span>
                </p>
              </el-timeline-item>
            </el-timeline>
            <div v-else-if="!remarkList" class="empty">
              <img src="~@/assets/images/order/blank.png" />
              <p>暂无备注</p>
            </div>
            <p
              v-if="remarkList && remarkList.length > 0 && remarkList.length < total"
              class="more-link"
              @click="moreRemark"
            >
              <span v-if="remarkLoading">正在加载...</span>
              <span v-else>点击查看更多</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 单个文件夹 -->
    <single-folder ref="modalSingleFolder" :company-folder-type="3"></single-folder>

    <!-- 单个人才库 -->
    <single-talent ref="modalSingleTalent"></single-talent>

    <!-- 添加备注弹窗 -->
    <el-dialog title="添加备注" :close-on-click-modal="false" append-to-body :visible.sync="remarkDialogVisible" width="500px" >
      <div class="main">
        <el-form ref="remarkForm" :model="remarkForm" :rules="remarkFormRules" label-width="0px">
          <el-form-item prop="desc" size="small">
            <el-input v-model="remarkForm.desc" type="textarea" :rows="10" placeholder="输入简历备注信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitRemark('remarkForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 打标签 -->
    <el-dialog
      append-to-body
      :visible.sync="setLabelVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
      class="visitor-detail-modal"
      @close="closeItLabel"
    >
      <div class="visitor-detail">
        <div class="resume-link">
          <p class="left">
            <span class="label-title">添加简历标签</span>
          </p>
        </div>
        <div class="label-panel">
          <template v-if="labelOptions1 && labelOptions1.length > 0">
            <p class="title">自定义标签</p>
            <div v-for="(item,index) in labelOptions1" :key="'info2-'+index" class="item">
              <div v-if="loading2" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem2(itemInner)"
                >
                  {{ itemInner.labelName }}
                  <i
                    title="编辑自定义标签"
                    class="el-icon-edit-outline"
                    @click.stop="editLabel(itemInner)"
                  ></i>
                </span>
                <span class="add-icon" @click="addLabels">
                  <i class="el-icon-plus"></i>添加
                </span>
              </div>
              <div v-if="inputVisible" class="label-input">
                <el-input v-model="labelInput" size="small" placeholder="请输入标签名称"></el-input>
                <span v-if="labelInput" class="del" @click="closeInput1">删除</span>
                <span v-else class="del" @click="()=>{inputVisible = false}">删除</span>
                <span class="add" @click="checkInput1">保存</span>
              </div>
            </div>
          </template>
          <template v-if="labelOptions2 && labelOptions2.length > 0">
            <div v-for="(item,index) in labelOptions2" :key="'info1-'+index" class="item item-comp">
              <p class="title">{{ item.userLabelPoolGroup }}</p>
              <div v-if="loading1" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem1(itemInner.id)"
                >{{ itemInner.labelName }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeItLabel">取 消</el-button>
        <el-button size="small" type="primary" @click="checkLabels(2)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 加入职位 -->
    <el-dialog
      top="8vh"
      append-to-body
      :visible.sync="addJobVisible"
      :close-on-click-modal="false"
      width="80%"
      :lock-scroll="true"
      :modal-append-to-body="true"
    >
      <addJobDialog :resume-id="resumeId" />
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  getResumeInfoById,
  saveContactRecord,
  pageContactRecord,
  editResumeToTalent,
  addResumeLabelBatch,
  downloadAttachResume,
  updateContactRecord
} from '@/api/resume'
import { getDict } from '@/api/common'
import resumeDict from '@/assets/js/resume'
import ResumeDetailNew from './resumeDetailNew'
// import ResumeOrderHR from './resumeOrderHR'
// import ResumeOrderSupplier from './resumeOrderSupplier'
import ResumeOrderCommon from './resumeOrderCommon'
import singleFolder from '@/components/folder/singleFolder'
import singleTalent from './singleTalent'
import addJobDialog from './addJobDialog'
import {
  getUserAppLabelList,
  editUserLabelPoolOfUser,
  addUserLabelPoolOfUser,
  deleteUserLabelPoolOfUser
} from '@/api/thread'

export default {
  components: {
    ResumeDetailNew,
    // ResumeOrderHR,
    // ResumeOrderSupplier,
    ResumeOrderCommon,
    singleFolder,
    singleTalent,
    addJobDialog
  },
  props: {
    companyAccountType: {
      type: Number,
      required: false,
      default: null
    },
    // 查询类型
    queryType: {
      type: Number,
      required: false,
      default: 1
    },
    candidateId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      flagContent: '',
      itemContent: null,
      token: '',
      addJobVisible: false,
      remarkLoading: false,
      libTitle: '',
      fileTitle: '',
      remarkForm: {
        desc: ''
      },
      remarkFormRules: {
        desc: [{ required: true, message: '请添加备注', trigger: 'blur' }]
      },
      remarkDialogVisible: false,
      clientHeight: '',
      extension: '', // 原始简历的文件类型,
      dbPathUrl: '', // 原始简历的文件路径
      resumeFlag: 1, // 简历类型
      activeName: 'resumeInfo',
      noticeLabel1: true,
      noticeLabel2: true,
      noticeLabel3: true,
      noticeLabel4: true,
      noticeLabel5: true,
      noticeLabel6: true,
      noticeLabel7: true,
      noticeLabel8: true,
      editDisabled: false,
      readListenSkillsArr: [],
      enterprisePropertyArr: [],
      scaleArr: [],
      jobStatusArr: [],
      degreeArrTemp: resumeDict.degree,
      ageArrTemp: resumeDict.age,
      eduArrTemp: resumeDict.degree,
      workExpArrTemp: resumeDict.workExp,
      intentionCityArrTemp: resumeDict.attentCity,
      salaryArrTemp: resumeDict.yearSalary,
      loading: true,
      value: '1', // 后续删掉
      value1: [], // 后续删掉
      options: [
        {
          value: '1',
          label: '更新简历'
        },
        {
          value: '2',
          label: '在线编辑'
        },
        {
          value: '3',
          label: '上传附件'
        }
      ],
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
      jobIntentForm: {
        jobStatus: null,
        currentSalary: null,
        currentSalaryMonth: null,
        currentSalaryTax: '1',
        currentOtherSalary: null,
        intentionIndustryId: null,
        intentionPosition: null,
        intentionCity: null,
        intentionSalary: null,
        intentionSalaryTax: '1'
      },
      jobIntentFormRules: {
        jobStatus: [
          { required: true, message: '请选择求职状态', trigger: 'change' }
        ],
        currentSalary: [
          { validator: this.$verify.salaryMonthFormat, trigger: 'change' }
        ],
        intentionIndustryId: [
          { required: true, message: '请选择期望行业', trigger: 'blur' }
        ],
        intentionCity: [
          { required: true, message: '请选择期望城市', trigger: 'blur' }
        ]
      },
      eduExpForm: {
        startDate: null,
        endDate: null,
        school: null,
        speciality: null,
        degreeCode: null,
        isUnifiedStrategy: '1',
        summary: null
      },
      eduExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        school: [
          { required: true, message: '请填写学校名称', trigger: 'blur' }
        ],
        speciality: [
          { required: true, message: '请填写就读专业', trigger: 'blur' }
        ],
        degreeCode: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        isUnifiedStrategy: [
          { required: true, message: '请选择是否统招', trigger: 'change' }
        ]
      },
      workExpForm: {
        startDate: null,
        endDate: null,
        companyName: null,
        vocation: null,
        companySize: null,
        companyType: null,
        companyIntroduce: null,
        title: null,
        department: null,
        responsibleArea: null,
        isOverseas: '1',
        leader: null,
        underlingNumber: null,
        summary: null,
        achievement: null,
        reasonOfLeaving: null
      },
      workExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请填写职位名称', trigger: 'blur' }],
        vocation: [
          { required: true, message: '请选择所属行业', trigger: 'blur' }
        ]
      },
      projectExpForm: {
        startDate: null,
        endDate: null,
        projectName: null,
        companyName: null,
        title: null,
        projectDescription: null,
        responsibilities: null,
        projectAchievement: null
      },
      projectExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        projectDescription: [
          { required: true, message: '请填写项目描述', trigger: 'blur' }
        ]
      },
      trainExpForm: {
        startDate: null,
        endDate: null,
        trainingCourse: null,
        trainingInstitution: null
      },
      trainExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        trainingCourse: [
          { required: true, message: '请填写培训课程', trigger: 'blur' }
        ],
        trainingInstitution: [
          { required: true, message: '请填写培训机构', trigger: 'blur' }
        ]
      },
      langPowerForm: {
        languages: null,
        listeningSpeakingSkills: null,
        readingWritingSkills: null,
        level: null
      },
      langPowerFormRules: {
        languages: [{ required: true, message: '请填写语种', trigger: 'blur' }],
        listeningSpeakingSkills: [
          { required: true, message: '请选择口语能力', trigger: 'change' }
        ],
        readingWritingSkills: [
          { required: true, message: '请选择书写能力', trigger: 'change' }
        ]
      },
      certInfoForm: {
        receivingDate: null,
        nameOfCertificate: null,
        score: null
      },
      certInfoFormRules: {
        receivingDate: [
          { required: true, message: '请选择获取时间', trigger: 'change' }
        ],
        nameOfCertificate: [
          { required: true, message: '请填写证书名称', trigger: 'change' }
        ]
      },
      selfEvalForm: {
        personal: null
      },
      surplusInfoForm: {
        attachmentInformation: null
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
      addressArr1: [], // 省市区数据字典
      addressArr2: [], // 省市区数据字典
      industryArr1: [], // 行业数据字典
      industryArr2: [], // 行业数据字典
      industryArr3: [], // 行业数据字典
      firstTabNameAddress: '', // selectPicker选中项tab
      firstTabNameCity: '', // selectPicker选中项tab
      firstTabNameIndustry: '', // selectPicker选中项tab
      firstTabNameBelongIndustry: '', // selectPicker选中项tab
      defaultValueIndustry: [], // 期望行业初始值
      defaultValueBelongIndustry: [], // 所属行业初始值
      baseInfoVisible: false, // 编辑基本信息
      jobIntentVisible: false, // 编辑求职意向
      eduExpVisible: false, //  编辑教育经历
      workExpVisible: false, // 编辑工作经历
      projectExpVisible: false, // 编辑项目经验
      trainExpVisible: false, // 编辑培训经历
      langPowerVisible: false, // 编辑语言能力
      certInfoVisible: false, // 编辑证书信息能力
      selfEvalVisible: false, // 编辑自我评价能力
      surplusInfoVisible: false, // 编辑附加信息
      addEduExpVisible: false, // 添加教育经历
      addWorkExpVisible: false, // 添加工作经历
      addProjectExpVisible: false, // 添加项目经验
      addTrainExpVisible: false, // 添加培训经历
      addLangPowerVisible: false, // 添加语言能力
      addCertInfoVisible: false, // 添加证书信息
      addMyProductVisible: false, // 添加我的作品
      detailData: {},
      paramsData: {},
      paramsDataAvatar: {},
      uploadResumeUrl: '/api/common/upload',
      opusUrl: '', // 文件dbPath
      opusName: '', // 文件名称
      avatarLoading: false,
      resumeId: '',
      remarkList: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      labelText: [],
      labelOptions1: [],
      labelOptions2: [],
      setLabelVisible: false,
      appUserId: null,
      loading1: true,
      loading2: true,
      ids1: [],
      ids2: [],
      userLabelId: null,
      labelInput: null,
      inputVisible: false,
      checkIconVisible: false,
      footerVisible: false,
      labelIds: [],
      resumeLabels: [],
      verfityMobile: null,
      verfityEmail: null
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo,
      companyId: state => state.userInfo.companyId
    })
  },
  watch: {
    clientHeight() {
      // 如果clientHeight 发生改变，这个函数就会运行
      this.changeFixed(this.clientHeight)
    }
  },
  created() {
    this.resumeId = sessionStorage.getItem('resumeId')
    this.token = Vue.ls.get('x-client-token')
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}` // 获取浏览器可视区域高度
    const that = this
    window.onresize = function() {
      that.clientHeight = `${document.documentElement.clientHeight}`
      if (that.$refs.resumeDetailSupplier) {
        that.$refs.resumeDetailSupplier.style.height =
          that.clientHeight - 60 + 'px'
      }
    }
    if (
      this.$route.name === 'resumeDetail' ||
      this.$route.name === 'resumeUpload'
    ) {
      let dictDataRes = {}
      getDict().then(res => {
        dictDataRes = res
        const dictData = dictDataRes
        const selectedData = dictDataRes.selectedData
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
      })
    } else {
      // 所在地
      this.addressArr1 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.areas))
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
        this.dictData && JSON.parse(JSON.stringify(this.dictData.areas))
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
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
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
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
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
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
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
        this.dictData && this.dictData.dicts && this.dictData.dicts.jobStatus
      // 企业规模
      this.scaleArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.enterpriseScale
      // 公司性质
      this.enterprisePropertyArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.enterpriseProperty
      // 口语听力能力
      this.readListenSkillsArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.readListenSkills
      this.$nextTick(() => {
        // 初始化数据
        this.baseInfoForm.intentionCity =
          this.selectedData && this.selectedData.intentionCity
        this.baseInfoForm.intentionIndustryId =
          this.selectedData && this.selectedData.intentionIndustryId
        this.workExpForm.vocation =
          this.selectedData && this.selectedData.vocation
      })
      // 简历详情
      this.loading = true
      this.getResumeInfoById()
    }
    this.pageContactRecord()
  },
  methods: {
    confirmIt(item) {
      this.editIt(item, 'del')
    },
    editIt(item, flag) {
      this.flagContent = flag
      this.itemContent = item
      if (flag === 'edit') {
        this.$set(this.remarkForm, 'desc', item.contactContent)
        this.addRemark()
      } else if (flag === 'del') {
        this.updateContactRecord(item, null)
      }
    },
    updateContactRecord(item, contactContent) {
      const params = {
        contactContent,
        id: item.id
      }
      updateContactRecord(params).then(res => {
          const { code, message } = res
          if (code === '000000') {
            this.$message.success(message)
            this.remarkList = []
            this.pageContactRecord()
            if (this.flagContent === 'edit') {
              this.remarkDialogVisible = false
            }
          }
        })
    },
    // 下载
    downloadFile() {
      console.log('下载')
      const params = {
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      downloadAttachResume(params).then(res => {
          const { code } = res
          if (code === '000000') {
            console.log('下载成功')
          }
        })
    },
    // 添加职位
    addJob() {
      this.addJobVisible = true
    },
    deleteUserLabelPoolOfUser() {
      const { userLabelId } = this
      const params = {
        userLabelId
      }
      userLabelId &&
        deleteUserLabelPoolOfUser(params).then(res => {
          const { code } = res
          if (code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.labelOptions1 = []
            this.labelOptions2 = []
            this.labelInput = null
            this.inputVisible = false
            this.userLabelId = null
            this.getUserAppLabelList()
          }
        })
    },
    // 立即推荐
    nowRecommend() {
      const resumeId = sessionStorage.getItem('resumeId')
      window.open(`/recommendPosition?resumeId=${resumeId}`)
    },
    editUserLabelPoolOfUser() {
      const { labelInput: labelName, id } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2,
        id
      }
      editUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.userLabelId = null
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    addUserLabelPoolOfUser() {
      const { labelInput: labelName } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2
      }
      addUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    getUserAppLabelList() {
      const params = {}
      getUserAppLabelList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.filter(item => {
              if (item.userLabelPoolGroup === '个人标签') {
                this.labelOptions1.push(item)
              } else {
                this.labelOptions2.push(item)
              }
            })
          this.labelOptions1 &&
            this.labelOptions1.filter(item => {
              item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a.labelName) {
                    b.active = true
                  }
                })
              })
            })
          this.labelOptions2 &&
            this.labelOptions2.filter(item => {
              item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a.labelName) {
                    b.active = true
                  }
                })
              })
            })
        }
      })
    },
    checkLabels(flag) {
      if (flag === 1) {
        const labelOptions1 = JSON.parse(localStorage.getItem('labelOptions1'))

        const labelOptions2 = JSON.parse(localStorage.getItem('labelOptions2'))
        //
        labelOptions1 &&
          labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 2 })
            })
          })
        labelOptions2 &&
          labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 1 })
            })
          })
        this.addResumeLabelBatch()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
        this.$emit('refreshListInner')
        this.$emit('toParent')
      } else if (flag === 2) {
        //
        this.labelOptions1 &&
          this.labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 2 })
            })
          })
        this.labelOptions2 &&
          this.labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 1 })
            })
          })
        //

        this.addResumeLabelBatch()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
        this.$emit('refreshListInner')
        this.$emit('toParent')
      }
    },
    checkInput1() {
      let or = false
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.labelName === this.labelInput) {
              or = true
            }
          })
        })
      if (this.labelInput && this.labelInput.length > 10) {
        this.$message({
          message: '标签名最大长度为10',
          type: 'warning'
        })
      } else if (!this.labelInput) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
      } else {
        if (this.userLabelId) {
          this.loading2 = false
          this.editUserLabelPoolOfUser()
          this.loading2 = true
        } else {
          if (or) {
            this.$message({
              message: '标签名已存在，不能重复添加',
              type: 'warning'
            })
          } else {
            this.loading2 = false
            this.addUserLabelPoolOfUser()
            this.loading2 = true
          }
        }
      }
    },
    closeIt() {
      this.visitorDetailVisible = false
      this.footerVisible = false
    },
    closeItLabel() {
      this.setLabelVisible = false
      this.labelInput = null
      this.inputVisible = false
      this.footerVisible = false
    },
    closeInput1() {
      this.inputVisible = false
      this.deleteUserLabelPoolOfUser()
    },
    addLabels() {
      this.labelInput = null
      this.inputVisible = true
      this.checkIconVisible = true
    },
    editLabel(itemData) {
      this.id = itemData.id
      this.userLabelId = itemData.id
      this.labelInput = itemData.labelName
      this.inputVisible = true
      this.checkIconVisible = false
    },
    addResumeLabelBatch() {
      this.labelIds.filter(item => {
        item.labelId = item.id
        delete item.id
      })
      const params = {
        labels: this.labelIds,
        resumeIds: [sessionStorage.getItem('resumeId')]
      }
      addResumeLabelBatch(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getResumeInfoById()
          localStorage.removeItem('ids1')
          localStorage.removeItem('ids2')
          this.ids1 = []
          this.ids2 = []
          this.labelIds = []
        }
      })
    },
    checkItem1(id) {
      this.loading1 = false
      //
      this.labelOptions2 &&
        this.labelOptions2.filter((item, index) => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === id) {
              item.userLabelPools.filter(itemItem => {
                if (itemItem.id === id && !itemItem.active) {
                  itemItem.active = true
                } else {
                  itemItem.active = false
                }
              })
            }
          })
        })
      //
      this.loading1 = true
    },
    checkItem2(itemData) {
      this.loading2 = false
      //
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === itemData.id) {
              itemInner.active = !itemInner.active
            }
          })
        })
      this.ids2.push(itemData.id)
      //

      this.loading2 = true
    },
    // 添加标签
    setLabels() {
      this.labelText = this.resumeLabels
      console.log(11111111, this.resumeLabels)
      // this.appUserId = row.appUserId
      this.labelOptions1 = []
      this.labelOptions2 = []
      this.getUserAppLabelList()
      this.setLabelVisible = true
    },
    // 放入回收站
    editResumeToTalent(resumeId) {
      const params = {
        resumeId
      }
      editResumeToTalent(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '移除成功',
            type: 'success'
          })
        }
      })
    },
    closeDialog() {
      this.$emit('close')
    },
    // 加入文件夹
    addToFile() {
      this.$refs.modalSingleFolder.edit({ fileId: this.detailData.detail.id })
      this.$refs.modalSingleFolder.title = '加入文件夹'
    },
    // 加入人才库
    addToLib() {
      this.$refs.modalSingleTalent.edit({ resumeId: this.detailData.detail.id })
      this.$refs.modalSingleTalent.title = '加入人才库'
    },
    // 获取联系记录列表
    pageContactRecord() {
      const { pageNumber, pageSize } = this
      const params = {
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId'),
        pageNumber,
        pageSize
      }
      this.remarkLoading = true
      pageContactRecord(params).then(res => {
        this.remarkLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.remarkList = data && this.remarkList.concat(data.records)
          this.total = data && data.total
          if (!this.total) {
            this.remarkList = null
          }
        }
      })
    },
    // 备注分页
    moreRemark() {
      this.pageNumber++
      this.pageContactRecord()
    },
    // 添加备注
    saveContactRecord() {
      const params = {
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId'),
        contactContent: this.remarkForm.desc
      }
      saveContactRecord(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.remarkDialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.remarkList = []
          this.pageContactRecord()
        }
      })
    },
    submitRemark(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.flagContent === 'edit') {
            this.updateContactRecord(this.itemContent, this.remarkForm.desc)
          } else {
            this.saveContactRecord()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加备注
    addRemark() {
      this.remarkDialogVisible = true
    },
    changeFixed(clientHeight) {
      if (this.$refs.resumeDetailSupplier) {
        this.$refs.resumeDetailSupplier.style.height = clientHeight - 60 + 'px'
      }
    },
    // 标准简历&原始简历
    handleResume(resumeFlag) {
      this.resumeFlag = resumeFlag
      this.extension = this.detailData.detail.extension
      if (resumeFlag === 2) {
        if (this.extension === 'jpg' || this.extension === 'png') {
          this.dbPathUrl = this.detailData.detail.dbPathUrl
        } else {
          const index =
            this.detailData.detail.dbPathUrl &&
            this.detailData.detail.dbPathUrl.lastIndexOf('.')
          const endText =
            this.detailData.detail.dbPathUrl &&
            this.detailData.detail.dbPathUrl.substring(
              index + 1,
              this.detailData.detail.dbPathUrl &&
                this.detailData.detail.dbPathUrl.length
            )
          if (endText) {
            if (
              endText.indexOf('pdf') !== -1 ||
              endText.indexOf('html') !== -1
            ) {
              this.dbPathUrl = this.detailData.detail.dbPathUrl
            } else {
              this.dbPathUrl =
                'https://view.officeapps.live.com/op/view.aspx?src=' +
                encodeURIComponent(this.detailData.detail.dbPathUrl)
            }
          } else {
            this.dbPathUrl = null
          }
        }
      }
      console.log(22222222, this.dbPathUrl)
    },
    // 简历详情
    getResumeInfoById() {
      this.loading = true
      const params = {
        id: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      getResumeInfoById(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.loading = false
          this.detailData = data
          if (this.detailData && this.detailData.detail && this.detailData.detail.createTime) {
            this.detailData.detail.createTime = this.detailData.detail.createTime.split(' ')[0]
          }
          this.resumeLabels = data && data.labels
          const verfity = /(\d{3})\d*(\d{4})/
          // 手机号
          this.verfityMobile =
            this.detailData.detail.mobile &&
            this.detailData.detail.mobile.replace(verfity, '$1****$2')
          // 邮箱
          this.verfityEmail =
            this.detailData.detail.email &&
            this.detailData.detail.email.substr(0, 3) +
              '****' +
              this.detailData.detail.email.substr(7)
          document.title = data.detail.name + '的简历-大猎英才'
          this.baseInfoForm = JSON.parse(JSON.stringify(data.detail)) // 基本信息
          this.selfEvalForm = JSON.parse(JSON.stringify(data.detail)) // 自我评价
          this.jobIntentForm = JSON.parse(JSON.stringify(data.detail)) // 求职意向
          // 期望年薪除以10000
          this.detailData.detail.intentionSalary =
            data.detail &&
            data.detail.intentionSalary &&
            data.detail.intentionSalary / 10000
          // 税前税后默认值
          if (!this.jobIntentForm.currentSalaryTax) {
            this.jobIntentForm.currentSalaryTax = '1'
          }
          if (!this.jobIntentForm.intentionSalaryTax) {
            this.jobIntentForm.intentionSalaryTax = '1'
          }
          // 所在地
          this.addressArr1 &&
            this.addressArr1.filter(item => {
              item.children &&
                item.children.filter(i => {
                  if (i.value === data.detail.liveCity + '') {
                    this.firstTabNameAddress = item.value
                    return i.value
                  }
                })
            })
          // 期望城市
          this.addressArr2 &&
            this.addressArr2.filter(item => {
              item.children &&
                item.children.filter(i => {
                  if (i.value === data.detail.intentionCity + '') {
                    this.firstTabNameCity = item.value
                    return i.value
                  }
                })
            })
          // 期望行业
          this.industryArr1 &&
            this.industryArr1.filter(item => {
              if (data.detail.intentionIndustryId1) {
                this.firstTabNameIndustry = item.value
                return item.value
              } else if (data.detail.intentionIndustryId2) {
                item.children &&
                  item.children.filter(i => {
                    if (
                      i.value === data.detail.intentionIndustryId2.split(',')[0]
                    ) {
                      this.firstTabNameIndustry = item.value
                      return i.value
                    }
                  })
              }
            })
          if (data.detail.intentionIndustryId1) {
            this.defaultValueIndustry = [data.detail.intentionIndustryId1 + ''] // 期望行业(一级)
          } else if (data.detail.intentionIndustryId2) {
            this.defaultValueIndustry = data.detail.intentionIndustryId2.split(
              ','
            ) // 期望行业(一级)
          }
          this.baseInfoForm.gender = data.detail.gender + ''
          // 基本信息
          if (
            data.detail.name &&
            data.detail.liveCity &&
            data.detail.mobile &&
            data.detail.email &&
            data.detail.age &&
            data.detail.workMonth &&
            data.detail.currentCompanyName &&
            data.detail.graduateSchool &&
            data.detail.degreeCode
          ) {
            this.noticeLabel1 = false
          }
          // 求职意向
          if (
            data.detail.jobStatus &&
            (data.detail.intentionIndustryId1 ||
              data.detail.intentionIndustryId2) &&
            data.detail.intentionCity
          ) {
            this.noticeLabel2 = false
          }
          // 教育经历
          const tempArr1 = []
          data.educations &&
            data.educations.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.school &&
                item.speciality &&
                item.degreeCode &&
                (item.isUnifiedStrategy === 1 || item.isUnifiedStrategy === 0)
              ) {
                tempArr1.push(0)
              } else {
                tempArr1.push(1)
              }
            })
          if (tempArr1.indexOf(1) !== -1) {
            this.noticeLabel3 = true
          } else {
            this.noticeLabel3 = false
          }
          // 工作经历
          const tempArr2 = []
          data.experiences &&
            data.experiences.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.companyName &&
                (item.industryId1 || item.industryId2) &&
                item.title
              ) {
                tempArr2.push(0)
              } else {
                tempArr2.push(1)
              }
            })
          if (tempArr2.indexOf(1) !== -1) {
            this.noticeLabel4 = true
          } else {
            this.noticeLabel4 = false
          }
          // 项目经验
          const tempArr3 = []
          data.projects &&
            data.projects.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.projectName &&
                item.projectDescription
              ) {
                tempArr3.push(0)
              } else {
                tempArr3.push(1)
              }
            })
          if (tempArr3.indexOf(1) !== -1) {
            this.noticeLabel5 = true
          } else {
            this.noticeLabel5 = false
          }
          // 培训经历
          const tempArr4 = []
          data.training &&
            data.training.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.trainingCourse &&
                item.trainingInstitution
              ) {
                tempArr4.push(0)
              } else {
                tempArr4.push(1)
              }
            })
          if (tempArr4.indexOf(1) !== -1) {
            this.noticeLabel6 = true
          } else {
            this.noticeLabel6 = false
          }
          // 语言能力
          const tempArr5 = []
          data.languages &&
            data.languages.filter(item => {
              if (
                item.languages &&
                item.listeningSpeakingSkills &&
                item.readingWritingSkills
              ) {
                tempArr5.push(0)
              } else {
                tempArr5.push(1)
              }
            })
          if (tempArr5.indexOf(1) !== -1) {
            this.noticeLabel7 = true
          } else {
            this.noticeLabel7 = false
          }
          // 证书信息
          const tempArr6 = []
          data.cerInfos &&
            data.cerInfos.filter(item => {
              if (item.receivingDate && item.nameOfCertificate) {
                tempArr6.push(0)
              } else {
                tempArr6.push(1)
              }
            })
          if (tempArr6.indexOf(1) !== -1) {
            this.noticeLabel8 = true
          } else {
            this.noticeLabel8 = false
          }
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/resume/resumeDetailSupplier.scss';
.visitor-detail {
  .return {
    width: 68px;
  }
  .label-input {
    margin-top: 10px;
    .el-input {
      width: 200px;
      margin-right: 15px;
    }
    span {
      margin-right: 10px;
      cursor: pointer;
    }
    .del {
      cursor: pointer;
    }
    .add {
      color: #409eff;
    }
  }
  .label-title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  .label-panel {
    padding: 20px;
    min-height: 300px;
    .item {
      margin-bottom: 20px;
      .add-icon {
        position: relative;
        cursor: pointer;
        padding-left: 32px;
        padding-right: 15px;
        i {
          position: absolute;
          left: 15px;
          top: 50%;
          margin-top: -6px;
          font-size: 13px;
        }
      }
    }
    .labels {
      margin-left: -8px;
      span {
        height: 31px;
        padding: 0 20px 0 15px;
        background: rgba(244, 246, 249, 1);
        border-radius: 3px;
        display: inline-block;
        margin: 8px;
        text-align: center;
        line-height: 31px;
        font-size: 12px;
        cursor: pointer;
        position: relative;
        i.el-icon-edit-outline {
          position: absolute;
          right: 0px;
          top: 50%;
          margin-top: -14px;
          padding: 9px 3px;
        }
        &.active {
          height: 31px;
          background: rgba(22, 120, 249, 1);
          border-radius: 3px;
          color: #fff;
        }
      }
    }
    .item-comp {
      .labels {
        span {
          padding-right: 15px;
        }
      }
    }
    .title {
      font-size: #333;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .sub-title {
      font-size: #333;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
    }
  }
  .el-card {
    box-shadow: none;
  }
  .el-card__body {
    padding: 12px;
  }
  .glance-card {
    h4 {
      font-weight: normal;
    }
    .el-card__body {
      width: 597px;
    }
  }
  .glance-card {
    h4 {
      font-weight: normal;
    }
    .el-card__body {
      width: 597px;
    }
  }
  .el-tabs__content {
    padding-left: 1px;
  }
  .share-list {
    .el-card {
      width: 620px;
    }
    .el-avatar--small {
      vertical-align: -9px;
      margin-right: 8px;
    }
    h4 {
      margin-bottom: 12px;
    }
  }
  .to-resume {
    color: #1678f9;
    font-size: 12px;
    padding: 20px 0;
    text-align: center;
    position: relative;
    cursor: pointer;
    &::after {
      content: '';
      width: 13px;
      height: 13px;
      display: inline-block;
      background: url('~@/assets/images/thread/arrow.png') no-repeat;
      background-size: 13px;
      vertical-align: -2px;
      margin-left: 4px;
    }
  }
  .workExp {
    position: relative;
    margin-bottom: 8px;
    overflow: hidden;
    &::before {
      content: '';
      width: 620px;
      border-bottom: 1px dashed #b3b3b3;
      height: 1px;
      display: inline-block;
      position: absolute;
      top: 10px;
      left: 20px;
      z-index: 1;
    }
    .left {
      position: relative;
      padding-left: 40px;
      background-color: #fff;
      z-index: 10;
      padding-right: 12px;
      &::before {
        content: '';
        width: 16px;
        height: 16px;
        display: inline-block;
        background: url('~@/assets/images/thread/job.png') no-repeat;
        background-size: 16px;
        position: absolute;
        top: 2px;
        left: 0;
      }
      span:first-child {
        position: relative;
        &::before {
          content: '';
          width: 8px;
          height: 8px;
          display: inline-block;
          background: url('~@/assets/images/thread/black_circle.png') no-repeat;
          background-size: 8px;
          position: absolute;
          left: -15px;
          top: 6px;
        }
      }
    }
    .right {
      background-color: #fff;
      padding-left: 12px;
      z-index: 10;
    }
  }
  .eduExp {
    position: relative;
    margin-bottom: 8px;
    overflow: hidden;
    &::before {
      content: '';
      width: 620px;
      border-bottom: 1px dashed #b3b3b3;
      height: 1px;
      display: inline-block;
      position: absolute;
      top: 10px;
      left: 20px;
      z-index: 1;
    }
    .left {
      position: relative;
      padding-left: 40px;
      background-color: #fff;
      z-index: 10;
      padding-right: 12px;
      &::before {
        content: '';
        width: 16px;
        height: 16px;
        display: inline-block;
        background: url('~@/assets/images/thread/job.png') no-repeat;
        background-size: 16px;
        position: absolute;
        top: 2px;
        left: 0;
      }
      span:first-child {
        position: relative;
        &::before {
          content: '';
          width: 8px;
          height: 8px;
          display: inline-block;
          background: url('~@/assets/images/thread/black_circle.png') no-repeat;
          background-size: 8px;
          position: absolute;
          left: -15px;
          top: 6px;
        }
      }
    }
    .right {
      background-color: #fff;
      padding-left: 12px;
      z-index: 10;
    }
  }
  .resume-link {
    padding: 8px 24px;
    color: #999999;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;
    align-items: center;
    .dot {
      margin: 0 5px;
      font-size: 30px;
      vertical-align: -5px;
    }
  }
  .el-divider--horizontal {
    margin: 14px 0;
  }
  .el-tabs {
    padding: 0 24px;
  }
  .el-tabs__content {
    height: 270px;
    width: 103%;
    overflow: auto;
  }
  .box-card {
    padding: 24px 24px 10px 24px;
    .header {
      display: flex;
      justify-content: space-between;
      position: relative;
      .salary {
        position: absolute;
        right: 0;
        color: #ff0000;
        font-size: 14px;
      }
      .mess {
        display: flex;
        justify-content: space-between;
        .info {
          padding-left: 14px;
          .name {
            color: #14171a;
            font-size: 14px;
            font-weight: 500;
            i {
              width: 12px;
              height: 12px;
              display: inline-block;
              vertical-align: -1px;
              margin-left: 4px;
              &.man {
                background: url('~@/assets/images/thread/man.png') no-repeat;
                background-size: 12px;
              }
              &.woman {
                background: url('~@/assets/images/thread/woman.png') no-repeat;
                background-size: 12px;
              }
            }
          }
          .labels {
            margin-top: -5px;
            height: 30px;
            line-height: 30px;
            span {
              color: #b2b2b2;
              font-size: 13px;
            }
            .dot {
              margin: 0 5px;
              font-size: 30px;
              vertical-align: -5px;
            }
          }
        }
      }
    }
    .process {
      margin-top: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;
      .dot {
        margin: 0 3px;
      }
      li {
        display: flex;
        justify-content: space-between;
        color: #333333;
        font-size: 14px;
        margin-bottom: 8px;
        .right {
          color: #999999;
        }
      }
    }
  }
  .persons {
    margin-top: 10px;
    margin-bottom: 5px;
    width: 625px;
    justify-content: space-between;
    height: 53px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    background: rgba(247, 248, 249, 1);
    padding: 0 16px;
    border-radius: 1px;
    color: #333333;
    font-size: 13px;
    .el-card__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-avatar--medium {
        position: relative;
        border: 2px solid #fff;
      }
    }
    .imgs {
      position: relative;
      display: flex;
      align-items: center;
      .el-avatar--medium {
        width: 20px;
        height: 20px;
        line-height: 36px;
        border: 1px solid #fff;
      }
      .img:nth-child(1) {
        right: 0;
        z-index: 0;
        position: absolute;
      }
      .img:nth-child(2) {
        right: 12px;
        z-index: 1;
        position: absolute;
      }
      .img:nth-child(3) {
        right: 24px;
        z-index: 2;
        position: absolute;
      }
      .img:nth-child(4) {
        right: 36px;
        z-index: 3;
        position: absolute;
      }
      .img:nth-child(5) {
        right: 48px;
        z-index: 4;
        position: absolute;
      }
      .img:nth-child(6) {
        right: 60px;
        z-index: 5;
        position: absolute;
      }
      .img:nth-child(7) {
        right: 72px;
        z-index: 6;
        position: absolute;
      }
      .img:nth-child(8) {
        right: 84px;
        z-index: 7;
        position: absolute;
      }
      .img:nth-child(9) {
        right: 96px;
        z-index: 8;
        position: absolute;
      }
      .img:nth-child(10) {
        right: 108px;
        z-index: 9;
        position: absolute;
      }
    }
  }
  .el-tabs__header {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-tabs__nav-wrap {
    padding-left: 0 !important;
  }
  .record-list {
    li {
      display: flex;
      .time {
        color: #6f6f6f;
        font-size: 14px;
      }
      .info {
        color: #333333;
        font-size: 14px;
        padding-left: 44px;
      }
      .labels {
        span {
          margin-top: 5px;
          border: 1px solid #999999;
          font-size: 12px;
          width: 40px;
          text-align: center;
          height: 16px;
          line-height: 16px;
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
  .recommend-list {
    .el-card {
      width: 620px;
    }
    .cont {
      .el-form {
        margin-bottom: 0;
      }
      .el-form-item {
        margin-bottom: 0px;
        color: #14171a;
        .el-form-item__label {
          text-align: left;
          line-height: 30px;
        }
        .el-form-item__content {
          line-height: 30px;
        }
      }
    }
    .el-card__header {
      padding: 10px 20px;
      & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          color: #999999;
          font-size: 13px;
          .el-avatar {
            vertical-align: middle;
            margin-right: 10px;
          }
        }
      }
      .time {
        color: #999999;
        font-size: 13px;
      }
    }
    .el-card__body {
      padding: 10px 20px;
    }
  }
  .set-labels {
    border-top: 1px solid #e4e7ed;
    padding: 5px 20px;
    .labels {
      display: flex;
      flex-wrap: wrap;
    }
    span {
      height: 24px;
      padding: 0 8px;
      line-height: 22px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fdf6ec;
      color: #e6a23c;
      border-radius: 4px;
      display: inline-block;
      border: 1px solid #faecd8;
      text-align: center;
      margin: 8px;
      &.active {
        background: #1678f9;
        color: #fff;
      }
      &.add-icon {
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #999;
        position: relative;
        cursor: pointer;
        padding-left: 25px;
        &:hover {
          border-color: #faecd8;
          background: #fdf6ec;
          color: #e6a23c;
        }
        i {
          position: absolute;
          left: 11px;
          top: 50%;
          margin-top: -6px;
          font-size: 12px;
        }
      }
      &.tip {
        width: auto;
        background: transparent;
        border: none;
        color: initial;
      }
    }
  }
}
.visitor-detail-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
