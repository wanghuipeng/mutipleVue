<template>
  <div class="release-postion-page">
    <el-card v-loading="!loadingPage" class="box-card">
      <div slot="header" class="clearfix">
        <p class="bold">新增职位</p>
      </div>
      <el-form
        v-if="loadingPage"
        ref="ruleForm"
        v-loading="formLoading"
        :model="ruleForm"
        size="small"
        :rules="rules"
        label-width="90px"
        class="rule-form"
      >
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col v-if="ownNum > 1" :span="24">
                <el-form-item label="职位类型" required>
                  <el-radio
                    v-model="jobType"
                    label="1"
                    border
                    size="small"
                    @change="handleJobType('1')"
                  >直招职位</el-radio>
                  <el-radio
                    v-model="jobType"
                    label="2"
                    border
                    size="small"
                    @change="handleJobType('2')"
                  >代招职位</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item label="招聘性质" prop="recruitNature">
                <el-radio
                  v-for="(item,index) in recruitPropertiesArr"
                  :key="index"
                  v-model="ruleForm.recruitNature"
                  :label="item.value"
                  border
                  size="small"
                >{{ item.label }}</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="positionId" label="职位名称" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  class="w-315"
                  :disabled="!userInfo.positionTitleUpdateAuth"
                  placeholder="请输入职位名称"
                ></el-input>
              </el-form-item>
              <el-form-item v-else label="职位名称" prop="title">
                <el-input v-model="ruleForm.title" class="w-315" placeholder="请输入职位名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="jobType === '1'" :span="24">
              <el-form-item label="所属部门" prop="positionDepartment">
                <el-select
                  v-model="ruleForm.positionDepartment"
                  class="w-315"
                  placeholder="请选择所属部门"
                  @change="handleChangeDepartment"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-else-if="jobType === '2'" :span="24">
              <el-form-item label="所属企业" prop="companyId">
                <el-select
                  v-model="searchName"
                  class="w-315"
                  placeholder="请选择所属企业"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remoteMethod"
                  @change="handleChangeCompanyId"
                >
                  <el-option
                    v-for="item in companySubArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px;padding-left:10px;box-sizing: border-box;">{{ item.key }}</span>
                  </el-option>
                </el-select>
                <el-button v-if="jobType === '2'" type="text" class="link" @click="addCompany">新增企业</el-button>
                <el-button v-else type="text" class="link" @click="toCompanyList">企业管理</el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职位类别" prop="recruitType">
              <el-radio
                v-for="(item,index) in recruitTypeArr"
                :key="index"
                v-model="ruleForm.recruitType"
                :label="item.value"
                border
                size="small"
              >{{ item.label }}</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职能类型" prop="functionType">
              <el-cascader
                v-model="ruleForm.functionType"
                filterable
                class="w-315"
                :options="functionTypeArr"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChangeFunctionType"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="薪酬范围" required class="salary-item">
              <el-form-item
                prop="salaryType"
                :class="[Number(ruleForm.salaryType) === 5 ? 'item-select w-315' : 'item-select w-95']"
              >
                <el-select
                  v-model="ruleForm.salaryType"
                  :class="[Number(ruleForm.salaryType) === 5 ? 'w-315' : 'w-95']"
                  @change="handleChangeSalaryType"
                >
                  <el-option label="年薪" value="1"></el-option>
                  <el-option label="月薪" value="2"></el-option>
                  <el-option label="日薪" value="3"></el-option>
                  <el-option label="时薪" value="4"></el-option>
                  <el-option label="面议" value="5"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="Number(ruleForm.salaryType) !== 5" class="range-salary">
                <el-form-item
                  v-if="isRouterShow && Number(ruleForm.salaryType) !== 5"
                  prop="salaryStart"
                  class="item-select"
                >
                  <el-select
                    v-model="ruleForm.salaryStart"
                    placeholder="最低薪资"
                    @change="handleChangeSalaryStart"
                  >
                    <el-option
                      v-for="(item,index) in salaryRangeFirstArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <span class="range-text">至</span>
                <el-form-item
                  v-if="Number(ruleForm.salaryType) !== 5"
                  prop="salaryEnd"
                  class="item-select"
                >
                  <el-select
                    v-model="ruleForm.salaryEnd"
                    placeholder="最高薪资"
                    @change="handleChangeSalaryEnd"
                  >
                    <el-option
                      v-for="(item,index) in salaryRangeSecondArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="Number(item.value) < limitNum"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- <span v-if="Number(ruleForm.salaryType) === 1">/年</span>
              <span v-else-if="Number(ruleForm.salaryType) === 2">/月</span>
              <span v-else-if="Number(ruleForm.salaryType) === 3">/天</span>
              <span v-else-if="Number(ruleForm.salaryType) === 4">/时</span>
              <span
                v-else-if="Number(ruleForm.salaryType) === 5"
                style="width:34px;display: inline-block;"
                :class="[Number(ruleForm.salaryType) === 5 ? 'hidden-select' : '']"
              ></span>-->
              <el-form-item prop="monthlySalaryRegime" class="item-select select-month">
                <el-select
                  v-model="ruleForm.monthlySalaryRegime"
                  :class="[Number(ruleForm.salaryType) !== 2 ? 'hidden-select' : '']"
                  @change="handleChangeRegime"
                >
                  <el-option
                    v-for="(item,index) in monthlySalaryRegimeArr"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作城市" prop="workCity">
              <el-cascader
                v-model="ruleForm.workCity"
                class="w-315"
                :options="cityOptions"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChangeCity"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="学历要求" prop="degreeRequired">
              <el-select
                v-model="ruleForm.degreeRequired"
                class="w-315"
                @change="handleChangeDegreeRequired"
              >
                <el-option
                  v-for="(item,index) in degreeRequiredArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作年限" prop="workYearRequired">
              <el-select
                v-model="ruleForm.workYearRequired"
                class="w-315"
                @change="handleChangeWorkYearRequired"
              >
                <el-option
                  v-for="(item,index) in workYearArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="招聘人数" prop="recruitmentNumber">
              <el-input
                v-model.number="ruleForm.recruitmentNumber"
                class="w-315"
                placeholder="请输入招聘人数"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职位福利" prop="positionWelfare">
              <el-select
                v-model="ruleForm.positionWelfare"
                class="w-315"
                multiple
                placeholder="请选择"
                @change="handleChangePositionWelfare"
              >
                <el-option
                  v-for="item in lightLabelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职位描述" prop="positionDescription">
              <el-input
                v-model="ruleForm.positionDescription"
                placeholder="简要说明该职位的工作内容或其他信息"
                show-word-limit
                type="textarea"
                maxlength="5000"
                :rows="6"
                class="w-426"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row v-if="jobFairList && jobFairList.length > 0">
          <el-col :span="24">
            <el-form-item label="招聘会" prop="jobFairId">
              <el-select
                v-model="ruleForm.jobFairId"
                class="w-315"
                multiple
                @change="handleChangeJobFair"
              >
                <el-option
                  v-for="(item,index) in jobFairList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>-->
        <!-- 完善企业 -->
        <div v-if="!isover" class="complete-tip">
          <p>为了让候选人更好了解职位，首次发布职位请顺带完善一下企业资料</p>
        </div>
        <editCompany
          v-if="!isover && isRouterShow"
          ref="editComanyRef"
          :slot-page="'releasePositionPage'"
          :operator-type="'edit'"
          :company-id="ruleForm.companyId"
          @getCompanyValid="getCompanyValid"
        />
        <!-- /完善企业 -->
        <el-form-item class="mt-20">
          <el-button
            class="w-80"
            :loading="submitLoading"
            type="primary"
            @click="submitForm('ruleForm')"
          >发布</el-button>
          <el-button class="w-80" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="!loadingPage" class="job-set">
      <div slot="header" class="clearfix">
        <p class="bold">职位设置</p>
      </div>
      <el-form
        v-if="loadingPage"
        ref="ruleForm-set"
        v-loading="formLoading"
        :model="ruleForm"
        size="small"
        :rules="rules"
        label-width="100px"
        class="rule-form-set"
        label-position="top"
      >
        <template v-if="positionId">
          <el-button
            v-if="statusNo === 3"
            class="over-recruit-btn"
            type="info"
            @click="changeStatus(statusNo,positionId)"
          >结束招聘</el-button>
          <el-button
            v-if="statusNo === 4"
            class="over-recruit-btn"
            type="primary"
            @click="changeStatus(statusNo,positionId)"
          >重新开始招聘</el-button>
        </template>
        <el-form-item label="招聘优先级" prop="emergencyDegree">
          <el-tooltip
            popper-class="release-postion-tooltip-class"
            class="item"
            effect="dark"
            content="根据您设定的招聘优先级不同，微站职位列表上会显示不同的紧急度标签，如紧急、特急"
            placement="right-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="ruleForm.emergencyDegree" size="small">
            <el-radio-button
              v-for="(item,index) in emergencyDegreeArr"
              :key="index"
              :label="item.value"
              @change="handleemergencyDegree(item.value)"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职位有效期" prop="endTime">
          <el-tooltip
            popper-class="release-postion-tooltip-class"
            class="item"
            effect="dark"
            content="设置职位有效期后，职位到达指定时间后将自动更新为结束招聘状态"
            placement="right-start"
          >
            <i class="el-icon-question el-icon-question-1"></i>
          </el-tooltip>
          <el-date-picker
            v-model="ruleForm.endTime"
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="招聘负责人" prop="name">
          <el-tooltip
            popper-class="release-postion-tooltip-class"
            class="item"
            effect="dark"
            content="设定招聘负责人后，只有具备相关权限的用户才能够对参与该职位招聘"
            placement="right-start"
          >
            <i class="el-icon-question el-icon-question-2"></i>
          </el-tooltip>
          <!-- <el-select
            v-model="ruleForm.userIds"
            multiple
            placeholder="请选择"
            @remove-tag="removeUserId"
          >
            <el-option
              v-for="item in userIdsArr"
              :key="item.value"
              :disabled="userInfo.userId == item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
          <!-- <el-select v-model="ruleForm.userIds[0]" placeholder="请选择" @remove-tag="removeUserId">
            <el-option
              v-for="item in userIdsArr"
              :key="item.value"
              :label="item.trueName"
              :value="item.value"
            >
              <span style="float: left">{{ item.trueName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-left:10px;box-sizing: border-box;">{{ item.label }}</span>
            </el-option>
          </el-select> -->
          <el-select
            v-model="userIdSearchName"
            placeholder="请选择招聘负责人"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodUserId"
            @remove-tag="removeUserId"
            @change="handleChangeUserId"
          >
            <el-option
              v-for="item in userIdsArr"
              :key="item.value"
              :label="item.trueName"
              :value="item.value"
            >
              <span style="float: left">{{ item.trueName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-left:10px;box-sizing: border-box;">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 企业管理（抽屉） -->
    <drawer-common :drawer="drawer" :no-new-window="true" @close="close">
      <company v-if="drawer" slot="inner-body" />
    </drawer-common>

    <!-- 编辑企业抽屉 -->
    <drawer-common v-if="editVisible" :drawer.sync="editVisible" size="800" class="edit">
      <edit-company slot="inner-body" :operator-type="type" :company-id="companyId" @closeDrawer="closeDrawer" />
    </drawer-common>

    <!-- 快捷操作 -->
    <el-dialog
      class="fast-operation-dialog"
      title="职位发布成功"
      :visible.sync="fastOperationVisible"
      width="300px"
      lock-scroll
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
    >
      <p>您可以选择以下快捷操作</p>
      <el-button size="small" @click="fastOperate('jobDetail')">查看职位</el-button>
      <el-button size="small" @click="fastOperate('addJob')">继续发布新职位</el-button>
      <el-button size="small" @click="fastOperate('returnJobList')">返回职位列表</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { uniqueArr } from '@/utils/common'
import { mapState } from 'vuex'
import {
  findMemberVOList,
  addPosition,
  editPosition,
  selectJobFairList,
  checkCompanyInfo,
  getCompanyAccountLinkCount,
  getCompanySubordinatesList
} from '@/api/releasePosition'
import { getCompanyList } from '@/api/company'
import { getPositionDetailById } from '@/api/position'
import DrawerCommon from '@/components/common/drawerCommon'
import Company from '@/views/company'
import editCompany from '@/views/company/editCompany'
import { getUserProfile } from '@/api/myCenter'
import { getSelectDeptList } from '@/api/miniPortal'
import { formatDate } from '@/utils/common'
import { editPositionStatus } from '@/api/position'
// import { addFolderFileBatch } from '@/api/common'

export default {
  components: {
    DrawerCommon,
    Company,
    editCompany
  },
  inject: ['reload'],
  data() {
    const checkNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        if (value === '' || value === null || value === 'undefined') {
          callback()
        } else {
          callback(new Error('请输入数字值'))
        }
      } else {
        callback()
      }
    }
    const checkSalaryStart = (rule, value, callback) => {
      if (
        Number(value) > Number(this.ruleForm.salaryEnd) &&
        Number(this.ruleForm.salaryEnd) !== 0
      ) {
        callback(new Error('薪酬下限应小于薪酬上限'))
      } else if (!value) {
        callback(new Error('请选择薪酬下限'))
      } else {
        callback()
      }
    }
    const checkSalaryEnd = (rule, value, callback) => {
      if (Number(value) >= Number(this.ruleForm.salaryStart)) {
        // this.rules.salaryStart[0].required = false
        // this.reloadComponent()
        callback()
      } else if (!value) {
        callback(new Error('请选择薪酬上限'))
      } else {
        callback()
      }
    }
    return {
      userIdSearchName: '',
      fastOperationVisible: false,
      pickerOptions: {
        disabledDate: (time) => {
          // 设置可选择的日期为今天之后的一个月内
          const curDate = new Date().getTime()
          // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
          const day = 30 * 24 * 3600 * 1000 * 3
          const dateRegion = curDate + day
          return (
            time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion
          )
          // 设置选择的日期小于当前的日期,小于返回true,日期不可选
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      ownNum: 2, // 随意值
      jobType: '1',
      editVisible: false,
      type: '',
      companyId: null,
      jobFairId: null,
      jobFairList: [], // 招聘会集合
      formLoading: false,
      submitLoading: false,
      drawer: false,
      isRouterShow: true,
      limitNum: null,
      userIdsArr: [],
      position: {},
      positionDetail: {},
      positionRequirements: [],
      userIds: {},
      salaryRangeFirstArr: [],
      salaryRangeSecondArr: [],
      monthlySalaryRegimeArr: [],
      recruitPropertiesArr: [],
      emergencyDegreeArr: [],
      ruleForm: {
        companyId: '',
        title: '',
        salaryType: '2',
        salaryStart: '',
        salaryEnd: '',
        workCity: [],
        degreeRequired: '',
        workYearRequired: '',
        monthlySalaryRegime: '',
        recruitmentNumber: null,
        positionWelfare: [],
        positionDescription: '',
        positionRequirement: '',
        userIds: [],
        jobFairId: [],
        functionType: '',
        recruitType: '1',
        recruitNature: 1,
        emergencyDegree: 1,
        endTime: '',
        positionDepartment: ''
      },
      rules: {
        recruitNature: [
          { required: true, message: '请选择招聘性质', trigger: 'change' }
        ],
        companyId: [
          { required: true, message: '请选择招聘企业', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入职位名称', trigger: 'change' }
        ],
        salaryType: [
          { required: true, message: '请选择薪酬范围', trigger: 'change' }
        ],
        salaryStart: [
          {
            validator: checkSalaryStart,
            trigger: 'change'
          }
        ],
        salaryEnd: [
          {
            validator: checkSalaryEnd,
            trigger: 'change'
          }
        ],
        workCity: [
          { required: true, message: '请选择工作城市', trigger: 'change' }
        ],
        degreeRequired: [
          { required: true, message: '请选择学历要求', trigger: 'change' }
        ],
        positionDescription: [
          {
            required: true,
            message: '请输入职位描述',
            trigger: 'change'
          }
        ],
        recruitmentNumber: [{ validator: checkNum, trigger: 'change' }],
        positionDepartment: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ]
        // functionType: [
        //   { required: true, message: '请选择职能类型', trigger: 'change' }
        // ]
      },
      cityOptions: [],
      degreeRequiredArr: [],
      workYearArr: [
        {
          label: '不限',
          value: 0
        }
      ],
      lightLabelOptions: [],
      companyArr: [],
      positionId: this.$route.query.positionId,
      jobDetail: {},
      functionTypeArr: [],
      recruitTypeArr: [],
      flag: null,
      isover: 1,
      companyValid: false,
      companyCertificationStatus: null,
      info: {},
      departmentList: [],
      companySubArr: [],
      statusNo: null, // 职位类型
      loadingPage: false,
      searchName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      dictData: (state) => state.common.dictData
    })
  },
  created() {
    const curDate = new Date()
    curDate.setTime(curDate.getTime() + 3600 * 1000 * 24 * 30 * 3)
    const dateRegion = curDate
    this.ruleForm.endTime = dateRegion && formatDate(dateRegion, 'yyyy-MM-dd')

    this.myInfo().then((res) => {
      // 租户认证状态
      this.companyCertificationStatus =
        this.$store.state.userInfo &&
        this.$store.state.userInfo.companyCertificationStatus
      // 初始化工作年限
      this.ruleForm.workYearRequired = 0
      // 初始化学历要求
      this.ruleForm.degreeRequired = '1'
      this.positionRequirements.push({
        propertyKey: 'degreeRequired',
        propertyValue: 1,
        propertyWeight: 1,
        positionId: this.positionId
      })

      // 初始化多少薪
      this.ruleForm.monthlySalaryRegime = '12'
      this.$set(this.positionDetail, 'monthlySalaryRegime', '12')
      // 初始化招聘企业
      // if (!this.positionId) {
      //   if (localStorage.getItem('companyId')) {
      //     this.ruleForm.companyId = localStorage.getItem('companyId') - 0
      //   } else if (this.userInfo && this.userInfo.companyId) {
      //     this.ruleForm.companyId = this.userInfo.companyId - 0
      //   } else if (res && res.companyId) {
      //     this.ruleForm.companyId = res.companyId - 0
      //   }
      //   this.ruleForm.companyId &&
      //     this.selectJobFairList(this.ruleForm.companyId)
      //   this.checkCompanyInfo(this.ruleForm.companyId)
      // }

      // 编辑回显数据
      if (this.positionId) {
        this.getPositionDetailById()
      } else {
        // 初始化招聘成员
        // 招聘负责人多选改成单选，以前的多选数据默认取当前用户
        this.ruleForm.userIds = [this.userInfo.userId]
        // 初始化薪酬范围（默认为月薪）
        this.$set(this.position, 'salaryType', 2)
        // 月薪
        for (let i = 1; i <= 500; i++) {
          this.salaryRangeFirstArr.push({
            label: i + 'k',
            value: i
          })
        }
        this.salaryRangeSecondArr = JSON.parse(
          JSON.stringify(this.salaryRangeFirstArr)
        )
      }
      // 面议
      for (let i = 12; i <= 100; i++) {
        this.monthlySalaryRegimeArr.push({
          label: i + '薪',
          value: i + ''
        })
      }
       this.getDict()
        this.getCompanyList()
        this.getCompanySubordinatesList()
        this.findMemberVOList()
        this.getSelectDeptList()
        this.getCompanyAccountLinkCount()
    })
  },
  methods: {
    // 所属企业输入联想
    remoteMethod(e) {
      this.searchName = e
      this.getCompanySubordinatesList()
    },
    // 招聘负责人输入联想
    remoteMethodUserId(e) {
      this.userIdSearchName = e
      this.findMemberVOList()
    },
    // 关闭新增企业弹框
    closeDrawer(companyId) {
      this.editVisible = false
      this.getCompanySubordinatesList()
      this.handleChangeCompanyId(companyId)
    },
    // 快捷操作
    fastOperate(flag) {
      console.log('快捷操作', flag)
      this.fastOperationVisible = false
      if (flag === 'jobDetail') {
        this.$router.push({
          path: '/jobDetail',
          query: {
            positionId: this.positionId
          }
        })
      } else if (flag === 'addJob') {
        this.reload()
      } else if (flag === 'returnJobList') {
        this.$router.push({ name: 'job' })
      }
    },
    // 时间戳转时间
    getLocalTime(nS) {
      const date = new Date(parseInt(nS)).toLocaleString().replace(/:\d{1}$/)
      return date && date.split('/').join('-')
    },
    // 招聘优先级
    handleemergencyDegree(e) {
      console.log(e)
    },
    // 职位类型
    handleJobType(type) {
      this.jobType = type
    },
    // 上下架
    changeStatus(statusNo, positionId) {
      // 对上架进行认证状态判断
      if (statusNo === 4) {
        if (
          this.userInfo.companyCertificationStatus === 0 ||
          this.userInfo.companyCertificationStatus === 3
        ) {
          this.$confirm(
            '根据平台用户规则，您需要预先完成企业信息认证才可以上架职位',
            '企业未认证',
            {
              type: 'warning',
              confirmButtonText: '立即认证'
            }
          )
            .then(() => {
              this.$router.push('/certification')
            })
            .catch(() => {})
          return
        }
        if (this.userInfo.companyCertificationStatus === 2) {
          this.$alert(
            '您的企业信息正在认证中，认证通过后即可上架企业职位',
            '企业认证中',
            {
              type: 'warning'
            }
          ).then(() => {})
          return
        }
      }
      this.$confirm(
        statusNo === 3
          ? '下架该职位后，候选人将无法再查看职位的信息'
          : '上架该职位后，候选人将可以继续查看职位的信息',
        statusNo === 3 ? '下架提示' : '上架提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          const para = {}
          para.id = positionId
          para.statusNo = statusNo === 3 ? 4 : 3
          editPositionStatus(para).then((res) => {
            this.$message.success('操作成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          })
        })
        .catch(() => {})
    },
    // 获取部门
    getSelectDeptList() {
      getSelectDeptList().then((res) => {
        this.departmentList = res.data
      })
    },
    // 个人信息
    myInfo() {
      const promise = getUserProfile().then((res) => {
        new Promise(function(resolve, reject) {
          if (res.data) {
            resolve(res.data)
          }
        })
      })
      return promise
    },
    getDict() {
             const that = this
             const it = window
            const dictData = it.DICTDATA
            // 招聘性质
            that.recruitPropertiesArr =
            dictData &&
            dictData.dicts.recruitProperties &&
            dictData.dicts.recruitProperties.map((item) => {
                const obj = {}
                obj.value = item.value - 0
                obj.label = item.label
                return obj
            })
            console.log(that.recruitPropertiesArr)
            // 招聘优先级
            that.emergencyDegreeArr = dictData.dicts.recommendationPriority
            // 工作城市
            that.cityOptions = JSON.parse(JSON.stringify(dictData.areas))
            that.cityOptions.filter((item) => {
            item.children.filter((itemInner) => {
                delete itemInner.children
            })
            })
            // 职位类型
            that.functionTypeArr = JSON.parse(JSON.stringify(dictData.functions))
            that.functionTypeArr &&
            that.functionTypeArr.filter((item) => {
                item.children &&
                item.children.filter((itemInner) => {
                    itemInner.children &&
                    itemInner.children.filter((itemInnerFinal) => {
                        delete itemInnerFinal.children
                    })
                })
            })
            // 招聘类型
            that.recruitTypeArr = JSON.parse(
            JSON.stringify(dictData.dicts.recruitType)
            )
            // 学历要求
            that.degreeRequiredArr = dictData.dicts.degreeRequired
            // 工作年限
            for (let i = 1; i <= 20; i++) {
            that.workYearArr.push({
                label: i + '年以上',
                value: i
            })
            }
            // 职位福利
            that.lightLabelOptions = dictData.dicts.lightLabel
     this.loadingPage = true
    },
    // 查询招聘会集合
    selectJobFairList(companyId) {
      this.jobFairList = []
      const params = { companyId }
      selectJobFairList(params).then((res) => {
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.filter((item) => {
              const obj = {}
              obj.value = item.id
              obj.label = item.statusName + ' - ' + item.name
              this.jobFairList.push(obj)
            })
        }
      })
    },
    removeUserId(e) {
      if (e - 0 === this.userInfo.userId - 0) {
        this.$message.success('不能删除自己哦~')
        // 初始化招聘成员
        this.ruleForm.userIds.unshift(this.userInfo.userId)
      }
    },
    close() {
      this.drawer = false
      this.getCompanyList()
    },
    async reloadComponent() {
      this.isRouterShow = false
      await this.$nextTick()
      this.isRouterShow = true
    },
    cancel() {
      this.$router.go(-1)
    },
    toCompanyList() {
      this.drawer = true
    },
    handleChangeCompanyId(e) {
      console.log(111111111, e)
      this.ruleForm.companyId = e
      this.checkCompanyInfo(e)
      // this.selectJobFairList(e)
    },
    handleChangeUserId(e) {
      console.log(111111111, e)
      this.ruleForm.userIds = [e]
    },
    handleChangeDepartment(e) {
      this.ruleForm.positionDepartment = e
    },
    getPositionDetailById() {
      this.formLoading = true
      const params = {
        id: this.positionId
      }
      getPositionDetailById(params).then((res) => {
        this.formLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.jobDetail = data
          this.jobType = this.jobDetail.companyType + ''
          this.statusNo = this.jobDetail.statusNo
          this.ruleForm.recruitNature = this.jobDetail.recruitNature
          this.ruleForm.positionDepartment = this.jobDetail.positionDepartment
          this.ruleForm.emergencyDegree = this.jobDetail.emergencyDegree
          this.ruleForm.endTime = this.jobDetail.endTime
          if (this.jobType === '1') {
            // 直招
            this.ruleForm.companyId = null
          } else if (this.jobType === '2') {
            // 代理
            this.ruleForm.companyId = this.jobDetail.companyId - 0
            this.searchName = this.jobDetail.companyId - 0
          }

          // this.checkCompanyInfo(this.jobDetail.companyId - 0)
          // this.selectJobFairList(this.ruleForm.companyId)
          this.ruleForm.title = this.jobDetail.title
          this.ruleForm.salaryType = this.jobDetail.salaryType + ''
          this.position.salaryType = this.jobDetail.salaryType + ''
          if (this.position.salaryType - 0 === 1) {
            // 年薪
            for (let i = 1; i <= 500; i++) {
              this.salaryRangeFirstArr.push({
                label: i + 'w',
                value: i
              })
            }
            this.salaryRangeSecondArr = JSON.parse(
              JSON.stringify(this.salaryRangeFirstArr)
            )
          } else if (this.position.salaryType - 0 === 2) {
            // 月薪
            for (let i = 1; i <= 500; i++) {
              this.salaryRangeFirstArr.push({
                label: i + 'k',
                value: i
              })
            }
            this.salaryRangeSecondArr = JSON.parse(
              JSON.stringify(this.salaryRangeFirstArr)
            )
          } else if (this.position.salaryType - 0 === 3) {
            // 日薪
            for (let i = 1; i <= 300; i++) {
              this.salaryRangeFirstArr.push({
                label: 10 * i + '元',
                value: 10 * i
              })
            }
            this.salaryRangeSecondArr = JSON.parse(
              JSON.stringify(this.salaryRangeFirstArr)
            )
          } else if (this.position.salaryType - 0 === 4) {
            // 时薪
            for (let i = 1; i <= 500; i++) {
              this.salaryRangeFirstArr.push({
                label: i + '元',
                value: i
              })
            }
            this.salaryRangeSecondArr = JSON.parse(
              JSON.stringify(this.salaryRangeFirstArr)
            )
          }
          if (this.jobDetail.salaryType - 0 === 1) {
            this.ruleForm.salaryStart = this.jobDetail.salaryStart / 10000
            this.position.salaryStart = this.jobDetail.salaryStart
            this.ruleForm.salaryEnd = this.jobDetail.salaryEnd / 10000
            this.position.salaryEnd = this.jobDetail.salaryEnd
          } else if (this.jobDetail.salaryType - 0 === 2) {
            this.ruleForm.salaryStart = this.jobDetail.salaryStart / 1000
            this.position.salaryStart = this.jobDetail.salaryStart
            this.ruleForm.salaryEnd = this.jobDetail.salaryEnd / 1000
            this.position.salaryEnd = this.jobDetail.salaryEnd
          } else {
            this.ruleForm.salaryStart = this.jobDetail.salaryStart
            this.position.salaryStart = this.jobDetail.salaryStart
            this.ruleForm.salaryEnd = this.jobDetail.salaryEnd
            this.position.salaryEnd = this.jobDetail.salaryEnd
          }

          this.ruleForm.monthlySalaryRegime =
            this.jobDetail.monthlySalaryRegime || '12'
          this.$set(
            this.positionDetail,
            'monthlySalaryRegime',
            this.ruleForm.monthlySalaryRegime
          )
          this.ruleForm.workProvinceId = this.jobDetail.workProvinceId
          this.ruleForm.workCityId = this.jobDetail.workCityId
          this.position.workProvinceId = this.jobDetail.workProvinceId
          this.position.workCityId = this.jobDetail.workCityId
          this.ruleForm.workCity = [
            this.ruleForm.workProvinceId,
            this.ruleForm.workCityId
          ]

          this.jobDetail.positionRequirements &&
            this.jobDetail.positionRequirements.filter((item) => {
              item.positionId = this.positionId
              if (item.propertyKey === 'degreeRequired') {
                this.ruleForm.degreeRequired = item.propertyValue
                this.positionRequirements.push({
                  id: item.id,
                  propertyKey: 'degreeRequired',
                  propertyValue: item.propertyValue - 0,
                  propertyWeight: 1,
                  positionId: this.positionId
                })
              }
              if (item.propertyKey === 'workYearRequired') {
                this.ruleForm.workYearRequired = item.propertyValueMin
                this.positionRequirements.push({
                  id: item.id,
                  propertyKey: 'workYearRequired',
                  propertyValueMin: item.propertyValueMin - 0,
                  propertyWeight: 1,
                  positionId: this.positionId
                })
              }
            })

          this.jobFairId = this.jobDetail.jobFairIds
          // this.jobFairList &&
          //   this.jobFairList.filter(item => {
          //     if (item.value === this.jobFairId) {
          //       this.ruleForm.jobFairId = item.label
          //     }
          //   })

          this.jobDetail.jobFairIds &&
            this.jobDetail.jobFairIds.filter((item) => {
              this.ruleForm.jobFairId.push(item)
            })
          this.ruleForm.recruitmentNumber = this.jobDetail.recruitmentNumber
          this.ruleForm.positionWelfare =
            this.jobDetail.positionWelfare &&
            this.jobDetail.positionWelfare.split(',')
          this.positionDetail.positionWelfare = this.jobDetail.positionWelfare
          this.ruleForm.positionDescription = this.jobDetail.positionDescription
          this.ruleForm.positionRequirement = this.jobDetail.positionRequirement
          this.jobDetail.members &&
            this.jobDetail.members.filter((item) => {
              this.ruleForm.userIds.push(item.id)
            })

          this.ruleForm.functionType1 = this.jobDetail.functionType1
          this.ruleForm.functionType2 = this.jobDetail.functionType2
          this.ruleForm.functionType3 = this.jobDetail.functionType3
          this.position.functionType1 = this.jobDetail.functionType1
          this.position.functionType2 = this.jobDetail.functionType2
          this.position.functionType3 = this.jobDetail.functionType3
          this.ruleForm.functionType = [
            this.ruleForm.functionType1,
            this.ruleForm.functionType2,
            this.ruleForm.functionType3
          ]
          this.ruleForm.recruitType = this.jobDetail.recruitType + ''
          // 招聘成员去重
          this.ruleForm.userIds = uniqueArr(this.ruleForm.userIds)
          console.log('招聘负责人1', this.ruleForm.userIds)
          // 招聘负责人多选改成单选，以前的多选数据默认取当前用户
          if (
            this.ruleForm &&
            this.ruleForm.userIds &&
            this.ruleForm.userIds.length > 0
          ) {
            this.ruleForm.userIds.filter((item) => {
              if (Number(item) === Number(this.userInfo.userId)) {
                this.ruleForm.userIds = [this.userInfo.userId]
              }
            })
          } else {
            this.ruleForm.userIds = [this.userInfo.userId]
          }
          console.log('招聘负责人1', this.ruleForm.userIds)
          this.userIdSearchName = this.ruleForm.userIds && this.ruleForm.userIds[0]
        }
      })
    },
    getCompanyList() {
      const params = {
        companyId: this.userInfo.companyId
      }
      getCompanyList(params).then((res) => {
        const { code } = res
        if (code === '000000') {
          this.companyArr = res.data
          this.companyArr.filter((item) => {
            item.label = item.name
            item.key = item.shortName
            item.value = item.id
          })
        }
      })
    },
    getCompanySubordinatesList() {
      const { searchName } = this
      const params = {
        searchName
      }
      getCompanySubordinatesList(params).then((res) => {
        const { code } = res
        if (code === '000000') {
          this.companySubArr = res.data
          this.companySubArr.filter((item) => {
            item.label = item.replaceName
            item.key = item.name
            item.value = item.id
          })
        }
      })
    },
    findMemberVOList() {
      const params = {
        searchName: this.userIdSearchName
      }
      findMemberVOList(params).then((res) => {
        const { code, data } = res
        if (code === '000000') {
          const arr = []
          data &&
            data.filter((item) => {
              item.memberDTOs &&
                item.memberDTOs.filter((itemInner) => {
                  arr.push({
                    value: itemInner.id,
                    gender: itemInner.gender,
                    visitAvatarUrl: itemInner.visitAvatarUrl,
                    label: itemInner.nickName,
                    trueName: itemInner.trueName
                  })
                })
            })
          this.userIdsArr = arr
        }
      })
    },
    handleChangePositionWelfare(e) {
      this.$set(this.positionDetail, 'positionWelfare', e && e.join(','))
    },
    handleChangeDegreeRequired(e) {
      this.positionRequirements.push({
        propertyKey: 'degreeRequired',
        propertyValue: e - 0,
        propertyWeight: 1,
        positionId: this.positionId
      })
    },
    // 添加公司
    addCompany() {
      this.type = 'add'
      this.editVisible = true
      this.companyId = null
    },
    handleChangeWorkYearRequired(e) {
      this.positionRequirements.push({
        propertyKey: 'workYearRequired',
        propertyValueMin: e - 0,
        propertyWeight: 1,
        positionId: this.positionId
      })
    },
    handleChangeJobFair(e) {
      this.jobFairId = e
    },
    handleChangeSalaryType(e) {
      this.$set(this.position, 'salaryType', e)
      this.salaryRangeFirstArr = []
      this.salaryRangeSecondArr = []
      this.ruleForm.salaryStart = ''
      this.ruleForm.salaryEnd = ''
      this.position.salaryStart = ''
      this.position.salaryEnd = ''
      if (Number(e) === 1) {
        // 年薪
        for (let i = 1; i <= 500; i++) {
          this.salaryRangeFirstArr.push({
            label: i + 'w',
            value: i
          })
        }
        this.salaryRangeSecondArr = JSON.parse(
          JSON.stringify(this.salaryRangeFirstArr)
        )
      } else if (Number(e) === 2) {
        // 月薪
        for (let i = 1; i <= 500; i++) {
          this.salaryRangeFirstArr.push({
            label: i + 'k',
            value: i
          })
        }
        this.salaryRangeSecondArr = JSON.parse(
          JSON.stringify(this.salaryRangeFirstArr)
        )
      } else if (Number(e) === 3) {
        // 日薪
        for (let i = 1; i <= 300; i++) {
          this.salaryRangeFirstArr.push({
            label: 10 * i + '元',
            value: 10 * i
          })
        }
        this.salaryRangeSecondArr = JSON.parse(
          JSON.stringify(this.salaryRangeFirstArr)
        )
      } else if (Number(e) === 4) {
        // 时薪
        for (let i = 1; i <= 500; i++) {
          this.salaryRangeFirstArr.push({
            label: i + '元',
            value: i
          })
        }
        this.salaryRangeSecondArr = JSON.parse(
          JSON.stringify(this.salaryRangeFirstArr)
        )
      }
    },
    handleChangeSalaryStart(e) {
      this.limitNum = Number(e)
      if (this.ruleForm.salaryType - 0 === 1) {
        this.$set(this.position, 'salaryStart', e * 10000)
      } else if (this.ruleForm.salaryType - 0 === 2) {
        this.$set(this.position, 'salaryStart', e * 1000)
      } else {
        this.$set(this.position, 'salaryStart', e)
      }
    },
    handleChangeSalaryEnd(e) {
      if (this.ruleForm.salaryType - 0 === 1) {
        this.$set(this.position, 'salaryEnd', e * 10000)
      } else if (this.ruleForm.salaryType - 0 === 2) {
        this.$set(this.position, 'salaryEnd', e * 1000)
      } else {
        this.$set(this.position, 'salaryEnd', e)
      }
    },
    handleChangeRegime(e) {
      this.$set(this.positionDetail, 'monthlySalaryRegime', e)
    },
    handleChangeCity(e) {
      this.$set(this.position, 'workProvinceId', e[0])
      this.$set(this.position, 'workCityId', e[1])
    },
    handleChangeFunctionType(e) {
      this.$set(this.position, 'functionType1', e[0])
      this.$set(this.position, 'functionType2', e[1])
      this.$set(this.position, 'functionType3', e[2])
    },
    handleChangeRecruitType(e) {
      this.$set(this.positionDetail, 'recruitType', e)
    },
    getCompanyValid(e) {
      this.companyValid = e
    },
    submitForm(formName) {
      if (this.isover) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.oparatePostion()
          } else {
            return false
          }
        })
      } else {
        this.$refs.editComanyRef.submitForm(formName) // 编辑企业校验
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.companyValid && this.oparatePostion()
          } else {
            return false
          }
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    oparatePostion() {
      this.submitLoading = true

      let params = {}
      this.position = Object.assign(this.position, {
        id: this.positionId ? this.positionId : null,
        companyId:
          this.jobType - 0 === 1
            ? this.userInfo.companyId
            : this.ruleForm.companyId,
        recruitmentNumber: this.ruleForm.recruitmentNumber,
        title: this.ruleForm.title,
        emergencyDegree: this.ruleForm.emergencyDegree
      })
      this.positionDetail = Object.assign(this.positionDetail, {
        positionDescription: this.ruleForm.positionDescription,
        positionRequirement: this.ruleForm.positionRequirement,
        recruitNature: this.ruleForm.recruitNature,
        recruitType: this.ruleForm.recruitType,
        endTime: this.ruleForm.endTime,
        positionDepartment: this.ruleForm.positionDepartment
      })
      // 招聘成员去重
      this.ruleForm.userIds = uniqueArr(this.ruleForm.userIds)
      params = Object.assign(
        {},
        // { jobFairIds: this.jobFairId },
        { position: this.position },
        { positionDetail: this.positionDetail },
        { positionRequirements: this.positionRequirements },
        { userIds: this.ruleForm.userIds || [this.userInfo.userId] }
      )
      if (this.positionId) {
        // 编辑
        editPosition(params)
          .then((res) => {
            this.submitLoading = false
            const { code } = res
            if (code === '000000') {
              localStorage.setItem('companyId', this.ruleForm.companyId)
              this.$message.success('发布成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 1500)
            }
          })
          .catch((err) => {
            this.submitLoading = false
            console.log(err)
          })
      } else {
        // 新增
        console.log('新增', params)
        params.folderId = this.$route.query.folderIds
        addPosition(params)
          .then((res) => {
            this.submitLoading = false
            const { code, data } = res
            if (code === '000000') {
              this.positionId = data
              localStorage.setItem('companyId', this.ruleForm.companyId)
              if (!this.$route.query.folderIds) {
                this.fastOperationVisible = true
              } else {
                this.$message.success('发布成功')
                this.addFolderFileBatchMethod()
              }
              //   if (this.companyCertificationStatus === 1) {
              //     // 已认证
              //     this.$confirm(
              //       '职位已发布成功，可在招聘会主页查看职位发布效果',
              //       '职位发布成功',
              //       {
              //         confirmButtonText: '继续发布职位',
              //         cancelButtonText: '关闭',
              //         type: 'success'
              //       }
              //     )
              //       .then(() => {
              //         this.$router.push({
              //           name: 'releasePosition',
              //           query: { flag: 'pushRouter' }
              //         })
              //         this.formLoading = true
              //         setTimeout(() => {
              //           this.reload()
              //           this.formLoading = false
              //         }, 500)
              //       })
              //       .catch(() => {})
              //   } else if (this.companyCertificationStatus === 2) {
              //     // 认证中
              //     this.$confirm(
              //       '您的企业信息正在认证中，认证通过后您发布的职位将上架',
              //       '职位发布成功',
              //       {
              //         confirmButtonText: '继续发布职位',
              //         cancelButtonText: '关闭',
              //         type: 'success'
              //       }
              //     )
              //       .then(() => {
              //         this.$router.push({
              //           name: 'releasePosition',
              //           query: { flag: 'pushRouter' }
              //         })
              //         this.formLoading = true
              //         setTimeout(() => {
              //           this.reload()
              //           this.formLoading = false
              //         }, 500)
              //       })
              //       .catch(() => {})
              //   } else {
              //     // 未认证或认证未通过
              //     this.$confirm(
              //       '根据平台招聘会参展要求，您需要预先完成企业信息认证，方可将您发布的职位上架到招聘会',
              //       '职位发布成功',
              //       {
              //         confirmButtonText: '立即认证',
              //         cancelButtonText: '继续发布职位',
              //         type: 'success'
              //       }
              //     )
              //       .then(() => {
              //         this.$router.push({ name: 'certification' })
              //       })
              //       .catch(() => {
              //         this.$router.push({
              //           name: 'releasePosition',
              //           query: { flag: 'pushRouter' }
              //         })
              //         this.formLoading = true
              //         setTimeout(() => {
              //           this.reload()
              //           this.formLoading = false
              //         }, 500)
              //       })
              //   }
            }
          })
          .catch((err) => {
            this.submitLoading = false
            console.log(err)
          })
      }
    },
    // 加入文件夹
    addFolderFileBatchMethod() {
      // const para = {}
      // para.fileIds = [this.positionId]
      // para.folderIds = [this.$route.query.folderIds]
      // addFolderFileBatch(para).then(data => {
      //   setTimeout(() => {
      //     this.$router.go(-1)
      //   }, 1500)
      // })
      setTimeout(() => {
        this.$router.go(-1)
      }, 1500)
    },
    checkCompanyInfo(companyId) {
      this.reloadComponent() // 刷新当前组件
      const params = { companyId }
      checkCompanyInfo(params)
        .then((res) => {
          const { code, data } = res
          if (code === '000000') {
            this.isover = data.isover
          }
        })
        .catch((err) => {
          this.submitLoading = false
          console.log(err)
        })
    },
    // 获取租户套餐的企业数量
    getCompanyAccountLinkCount() {
      getCompanyAccountLinkCount().then((res) => {
        const { code, data } = res
        if (code === '000000') {
          this.ownNum = data
          console.log('租户套餐企业数量', data)
        }
      })
    },
    // 编辑公司
    editComp(id) {
      this.type = 'edit'
      this.editVisible = true
      this.companyId = id
    }
  }
}
</script>
<style  lang="scss" >
.release-postion-tooltip-class {
  max-width: 200px;
  line-height: 1.3;
}
.release-postion-page {
  min-height: calc(100% - 80px);
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  .el-radio {
    margin-right: 5px;
  }
  .el-radio--small {
    width: 95px;
  }
  .job-set {
    width: 300px;
    margin-left: 16px;
    box-shadow: none;
    border-radius: 0;
    .rule-form-set {
      .el-radio-group {
        width: 100%;
        .el-radio-button {
          width: 33.33%;
          .el-radio-button__inner {
            width: 100%;
          }
        }
      }

      .over-recruit-btn {
        width: 260px;
        display: block;
        margin: 10px auto 20px auto;
      }
      .el-select,
      .el-date-editor {
        width: 100%;
      }
      .el-icon-question {
        position: absolute;
        top: -33px;
        left: 74px;
        font-size: 17px;
        cursor: pointer;
        &.el-icon-question-1 {
          left: 136px;
        }
        &.el-icon-question-2 {
          left: 75px;
        }
      }
    }
  }
  .complete-tip {
    width: 695px;
    margin-left: -20px;
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin-bottom: 30px;
    box-sizing: border-box;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
      margin: 1em 0;
    }
  }
  .range-salary {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    width: 203px;
    margin-left: 5px;
    margin-right: 5px;
    .range-text {
      display: inline-block;
      padding: 0 5px;
      margin: 0;
      text-align: center;
      font-size: 14px;
      color: #303133;
    }
    .el-select,
    .el-form-item {
      margin: 0 !important;
    }
    .el-input__inner {
      border: none;
      padding-right: 20px;
    }
    .el-input__suffix {
      right: -2px;
    }
    .item-select,
    .el-select {
      width: 89px !important;
    }
  }
  .el-textarea {
    .el-input__count {
      background-color: transparent;
      bottom: -2px;
    }
  }

  .w-315 {
    width: 315px !important;
  }
  .w-95 {
    width: 95px !important;
  }
  .w-426 {
    width: 426px !important;
  }
  margin-top: 20px;
  .hidden-select {
    visibility: hidden;
  }
  .link {
    margin-left: 15px;
  }
  .el-button + .el-button {
    margin-left: 15px;
  }
  .box-card {
    flex: 1;
    box-shadow: none;
    border-radius: 0;
    .el-card__body {
      padding-top: 30px;
    }
  }
  .rule-form {
    padding-left: 150px;
    .el-form-item {
      margin-bottom: 32px;
    }
    .el-col-12 {
      text-align: center;
      display: flex;
      justify-content: center;
      .el-form-item {
        text-align: center;
      }
      .el-form-item__content,
      .el-cascader,
      .el-select,
      .el-input-number {
        width: 300px;
      }
    }
    .salary-item {
      width: 880px;
      .item-select {
        width: 181px;
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 0;
      }
      .el-select {
        width: 95px;
        margin-right: 10px;
      }
      .select-month {
        margin-left: 12px;
        margin-right: 0;
      }
    }
    .el-input-number {
      .el-input-number__decrease,
      .el-input-number__increase {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .edit {
    .fix-drawer .drawer-detail-inner {
      background: #ffffff;
      width: 740px;
    }
    .icon-newWindow {
      display: none;
    }
  }
}
.fast-operation-dialog {
  text-align: center;
  .el-dialog__body {
    padding: 10px 0 15px 0;
  }
  p {
    margin-bottom: 20px;
  }
  .el-button {
    margin: 0px auto 15px auto;
    width: 116px;
    text-align: center;
    display: block;
  }
}
</style>
