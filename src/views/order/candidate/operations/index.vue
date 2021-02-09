<template>
  <el-dialog
    append-to-body
    :visible.sync="dialog"
    top="10vh"
    lock-scroll
    :width="`${width}px`"
    :before-close="handleClose"
  >
    <div slot="title" class="header">{{ title }}</div>
    <div v-if="!resultVisible">
      <!-- 面试 -->
      <div v-if="type === 1">
        <el-checkbox v-model="isOver" class="tips mb-20">该场面试为最后一轮面试（选择此项后，候选人将无法继续安排下一轮面试，请谨慎选择）</el-checkbox>
        <el-form
          ref="interviewForm"
          :model="interviewForm"
          :rules="interviewRules"
          label-width="90px"
          size="small"
        >
          <el-row type="flex" justify="space-between">
            <el-col class="date">
              <el-form-item label="面试时间" prop="interviewDate">
                <el-date-picker
                  v-model="interviewForm.interviewDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDateDisabledInterview"
                  style="width: 155px; margin-right: 8px;"
                />
              </el-form-item>
              <el-form-item label-width="0px" prop="interviewTime">
                <el-time-select
                  v-model="interviewForm.interviewTime"
                  size="small"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  placeholder="选择时间"
                  style="width: 120px;"
                />
              </el-form-item>
            </el-col>
            <el-col class="offset">
              <el-form-item label="面试方式" prop="interviewMethod">
                <el-select
                  v-model="interviewForm.interviewMethod"
                  placeholder="请选择面试方式"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in dictData.dicts.interviewType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item label="面试地址" prop="interviewArea">
                <el-cascader
                  v-model="interviewForm.interviewArea"
                  :options="areas"
                  clearable
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col class="offset">
              <el-form-item label-width="0" prop="interviewAddress">
                <el-input v-model="interviewForm.interviewAddress" placeholder="请输入面试详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item label="面试官">
                <el-input v-model="interviewForm.interviewerName" placeholder="请输入面试官姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="offset">
              <el-form-item label-width="0">
                <el-input v-model="interviewForm.interviewerMobile" placeholder="请输入联系号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注提示">
            <el-input
              v-model="interviewForm.interviewRemark"
              type="textarea"
              :rows="4"
              placeholder="请添加备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- offer -->
      <div v-else-if="type === 2">
        <el-form
          ref="offerForm"
          :model="offerForm"
          :rules="offerRules"
          label-width="120px"
          size="small"
        >
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item label="offer日期" prop="offerSendDate">
                <el-date-picker
                  v-model="offerForm.offerSendDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDateDisabled"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col class="offset date">
              <el-form-item label="预计入职日期" prop="plannedArrivalDate">
                <el-date-picker
                  v-model="offerForm.plannedArrivalDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDateDisabled"
                  style="width: 100%;"
                />
              </el-form-item>
              <el-form-item label-width="0px" prop="plannedArrivalTime">
                <el-time-select
                  v-model="offerForm.plannedArrivalTime"
                  size="small"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  placeholder="选择时间"
                  style="width: 115px; margin-left:8px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item label="试用期" prop="probationPeriod">
                <el-select
                  v-model="offerForm.probationPeriod"
                  placeholder="请选择试用期期限"
                  style="width: 100%;"
                >
                  <el-option v-for="item in 6" :key="item" :label="`${item}个月`" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="offset">
              <el-form-item label="薪资待遇" prop="salary">
                <el-input v-model="offerForm.salary" placeholder="请输入内容">
                  <el-select slot="prepend" v-model="offerForm.salaryType" placeholder="请选择">
                    <el-option
                      v-for="item in dictData.dicts.salaryType.slice(0, 2)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span slot="append">{{ offerForm.salaryType === '1' ? '万' : '元' }}</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="薪资说明">
            <el-input
              v-model="offerForm.salaryDescription"
              type="textarea"
              :rows="4"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item v-if="candidateIds.length <= 1" label="offer附件">
            <el-upload
              action="/api/common/upload"
              :data="{ossFileType: 'candidateOfferAttachment'}"
              :on-success="uploadSuccess"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">选择文件</el-button>
              <span v-if="offerForm.attachmentUrl" style="font-size: 14px; margin-left: 16px;" @click="priview(offerForm.attachmentUrl)">{{ offerForm.fileName }}（预览）</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="offerForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请添加备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 录用 -->
      <div v-else-if="type === 3">
        <el-form
          ref="hireForm"
          :model="hireForm"
          :rules="hireRules"
          label-width="90px"
          size="small"
        >
          <p class="date">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker
                v-model="hireForm.entryDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="startDateDisabled"
                style="width: 155px; margin-right: 8px;"
              />
            </el-form-item>
            <el-form-item label-width="0px" prop="entryTime">
              <el-time-select
                v-model="hireForm.entryTime"
                size="small"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                placeholder="选择时间"
                style="width: 120px;"
              />
            </el-form-item>
          </p>
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item label="试用到期" prop="probationPeriod">
                <el-select
                  v-model="hireForm.probationPeriod"
                  placeholder="请选择试用期"
                  style="width: 100%;"
                >
                  <el-option v-for="item in 6" :key="item" :label="`${item}个月`" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="offset">
              <el-form-item label-width="0">
                <p v-if="hireForm.overdueDate">试用期结束于{{ hireForm.overdueDate }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-form-item label="薪资待遇" prop="salary">
              <el-input v-model="hireForm.salary" placeholder="请输入内容" style="width: 295px;">
                <el-select slot="prepend" v-model="hireForm.salaryType" placeholder="请选择">
                  <el-option
                    v-for="item in dictData.dicts.salaryType.slice(0, 2)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span slot="append">{{ hireForm.salaryType === '1' ? '万' : '元' }}</span>
              </el-input>
            </el-form-item>
          </el-row>
          <el-form-item label="备注">
            <el-input
              v-model="hireForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请添加备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 淘汰 -->
      <div v-else-if="type === 4">
        <el-form
          ref="weedOutForm"
          :model="weedOutForm"
          :rules="weedOutRules"
          size="small"
        >
          <el-form-item>
            <el-radio-group v-model="weedOutForm.radio" style="margin-top: 10px;">
              <el-radio :label="1">候选人拒绝了我们</el-radio>
              <el-radio :label="2">我们拒绝了候选人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-select v-model="weedOutForm.weedOutReason" placeholder="请选择淘汰原因" style="width: 300px">
              <el-option
                v-for="(item, index) in weedOutReason"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="weedOutForm.weedOutReason === '其他'">
            <el-input
              v-model="weedOutForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请添加备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 其他 -->
      <div v-else>
        <p v-if="operateCode === 54" style="margin-bottom: 20px;">是否邀请候选人参加面试 ？</p>
        <p v-else-if="operateCode === 55" style="margin-bottom: 20px;">是否发送候选人入职通知 ？</p>
        <!-- <p v-else style="margin-bottom: 20px;">确定候选人{{ title }} ？</p> -->
        <el-form ref="remarkForm" :model="remarkForm" label-width="0" size="small">
          <el-form-item>
            <el-input
              v-model="remarkForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请添加备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="footer">
        <div v-if="candidates.length > 0" class="names">
          候选人：
          <p v-if="candidates.length > 1"><span style="color: #1678f9;">{{ selectNames }}</span>共{{ candidates.length }}人</p>
          <p v-else style="color: #1678f9;">{{ selectNames }}</p>
        </div>
        <div v-if="operateCode === 54" class="btns">
          <el-button size="mini" @click="handleClose">暂不邀请</el-button>
          <el-button type="primary" size="mini" @click="handleSure">邀 请</el-button>
        </div>
        <div v-else-if="operateCode === 55" class="btns">
          <el-button size="mini" @click="handleClose">暂不发送</el-button>
          <el-button type="primary" size="mini" @click="handleSure">发 送</el-button>
        </div>
        <div v-else class="btns">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleSure">确 定</el-button>
        </div>
      </div>
    </div>

    <!-- 结果 -->
    <result v-if="resultVisible" :dialog="resultVisible" :list="list" @close="handleClose" />
  </el-dialog>
</template>

<script>
// 订单操作石墨 https://shimo.im/docs/ZzkLVrgoKQHMZM3Q/read
import { mapState } from 'vuex'
import result from './operationsResult'
import {
  batchOperateCandidate,
  batchArrangeInterview,
  batchInterviewFeedback,
  batchOperateOffer,
  batchOperateEntry,
  getLastInterviewByBatch,
  getLastOfferByBatch
} from '@/api/order'
export default {
  components: {
    result
  },
  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '提示'
    },
    type: {
      type: Number,
      default: 0
    },
    candidates: {
      // 所选候选人
      type: Array,
      default: null
    },
    positionInfo: {
      // 职位信息
      type: Object,
      default: () => {}
    },
    operateType: {
      // 操作类型 1单项操作，2批量操作
      type: Number,
      default: 1
    },
    operateCode: {
      // 操作code
      type: Number,
      default: null
    },
    activateCode: {
      // 重新激活code
      type: Number,
      default: null
    },
    width: {
      type: Number,
      default: 800
    }
  },
  data() {
    return {
      isOver: null, // 是否终面
      areas: [],
      startDateDisabled: {}, // 禁止点击今天之前的日期
      startDateDisabledInterview: {},
      interviewForm: {
        interviewDate: '',
        interviewTime: '',
        interviewMethod: '',
        interviewArea: [],
        interviewAddress: '',
        interviewerName: '',
        interviewerMobile: '',
        interviewRemark: ''
      },
      interviewRules: {
        interviewDate: [
          { required: true, message: '请选择面试日期', trigger: 'change' }
        ],
        interviewTime: [
          { required: true, message: '请选择面试时间', trigger: 'change' }
        ],
        interviewArea: [
          { required: true, message: '请选择面试地区', trigger: 'change' }
        ],
        interviewAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        interviewMethod: [
          { required: true, message: '请选择面试方式', trigger: 'change' }
        ]
      },
      offerForm: {
        offerSendDate: '',
        plannedArrivalDate: '',
        plannedArrivalTime: '',
        probationPeriod: '',
        salaryType: '1',
        salary: '',
        salaryDescription: '',
        attachment: '',
        attachmentUrl: '',
        fileName: '',
        remark: ''
      },
      offerRules: {
        offerSendDate: [
          { required: true, message: '请选择offer日期', trigger: 'change' }
        ],
        plannedArrivalDate: [
          { required: true, message: '请选择入职日期', trigger: 'change' }
        ],
        plannedArrivalTime: [
          { required: true, message: '请选择入职时间', trigger: 'change' }
        ],
        probationPeriod: [
          { required: true, message: '请选择试用日期', trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请输入薪资待遇', trigger: 'blur' },
          { validator: this.$verify.numberFormat, trigger: 'blur' }
        ]
      },
      hireForm: {
        entryDate: '',
        entryTime: '',
        probationPeriod: '',
        overdueDate: '',
        salaryType: '1',
        salary: '',
        remark: ''
      },
      hireRules: {
        entryDate: [
          { required: true, message: '请选择面试日期', trigger: 'change' }
        ],
        entryTime: [
          { required: true, message: '请选择面试时间', trigger: 'change' }
        ],
        probationPeriod: [
          { required: true, message: '请选择试用期', trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请输入薪资待遇', trigger: 'blur' },
          { validator: this.$verify.numberFormat, trigger: 'blur' }
        ]
      },
      weedOutReason: [],
      weedOutForm: {
        radio: 1,
        weedOutReason: ''
      },
      weedOutRules: {},
      remarkForm: {},
      candidateIds: [],
      selectNames: '',
      resultVisible: false,
      list: {}
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo,
      eliminationReasonPersonal: state => {
        const arr = state.common.dictData.dicts.eliminationReasonPersonal
        if (arr[arr.length - 1].value !== '其他') {
          arr.push({
            label: '其他',
            value: '其他'
          })
        }
        return arr
      },
      eliminationReasonCompany: state => {
        const arr = state.common.dictData.dicts.eliminationReasonCompany
        if (arr[arr.length - 1].value !== '其他') {
          arr.push({
            label: '其他',
            value: '其他'
          })
        }
        return arr
      }
    }),
    dateRange() {
      const { entryDate, probationPeriod } = this.hireForm
      return {
        entryDate,
        probationPeriod
      }
    }
  },
  watch: {
    'weedOutForm.radio': {
      deep: true,
      handler: function(val) {
        if (val === 1) {
          this.weedOutReason = this.eliminationReasonPersonal || []
        } else {
          this.weedOutReason = this.eliminationReasonCompany || []
        }
      }
    },
    dateRange: {
      deep: true,
      handler: function(val) {
        if (val.entryDate && val.probationPeriod) {
          var d = new Date(val.entryDate)
          d.setMonth(d.getMonth() + val.probationPeriod)
          this.hireForm.overdueDate =
            d.getFullYear() +
            '-' +
            ((d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)) +
            '-' +
            (d.getDate() < 10 ? '0' : '') +
            d.getDate()
        } else {
          this.hireForm.overdueDate = ''
        }
      }
    }
  },
  created() {
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
    this.weedOutReason = this.eliminationReasonPersonal || []
    const arr = []
    this.candidateIds = []
    this.candidates.forEach(item => {
      arr.push(item.jobhunterName)
      this.candidateIds.push(item.id)
    })
    this.selectNames = arr.join('、')
    // 限制开始日期不能超过当前日期
   //  alert(Date.now())
    this.startDateDisabled.disabledDate = function(time) {
      return time.getTime() + 24 * 3600 * 1000 < Date.now()
    }
    // 面试时间默认从推荐时间开始
    const createTime = JSON.parse(sessionStorage.getItem('candidateCreateTime'))
    this.startDateDisabledInterview.disabledDate = function(time) {
      return time.getTime() + 24 * 3600 * 1000 < new Date(createTime)
    }
    // 面试安排初始赋值
    if (this.type === 1) {
      if (this.operateCode === 65 || this.operateCode === 74) {
        this.getInterviewInfo()
      } else {
        this.interviewForm.interviewerName = this.userInfo.nickName
        this.interviewForm.interviewerMobile = this.userInfo.userMobile
        this.interviewForm.interviewArea =
          this.positionInfo.interviewProvinceId &&
          this.positionInfo.interviewCityId
            ? [
                this.positionInfo.interviewProvinceId,
                this.positionInfo.interviewCityId,
                this.positionInfo.interviewAreaId
              ]
            : []
        this.interviewForm.interviewAddress = this.positionInfo.interviewDetailedAddress
      }
    } else if (this.type === 2) {
      if (this.operateCode === 69 || this.operateCode === 73) {
        // offer编辑信息回填
        this.getOfferInfo()
      }
    } else if (this.type === 3 && this.operateCode === 75) {
      this.getOfferInfo('hire')
    } else if (this.type === 3 && this.operateCode === 59) {
      this.getOfferInfo('hire')
    }
  },
  methods: {
    // 面试编辑信息回填
    getInterviewInfo() {
      const params = {
        candidateIds: this.candidateIds.join(',')
      }
      getLastInterviewByBatch(params).then(res => {
        const data = res.data
        this.interviewForm.interviewDate =
          data.plannedInterviewTime && data.plannedInterviewTime.split(' ')[0]
        this.interviewForm.interviewTime =
          data.plannedInterviewTime &&
          data.plannedInterviewTime.split(' ')[1].slice(0, 5)
        this.interviewForm.interviewMethod = data.interviewMethod
        this.interviewForm.interviewArea = [
          data.interviewProvince,
          data.interviewCity,
          data.interviewArea
        ]
        this.interviewForm.interviewAddress = data.interviewAddress
        this.interviewForm.interviewerName = data.interviewerName
        this.interviewForm.interviewerMobile = data.interviewerMobile
        this.interviewForm.interviewRemark = data.description
      })
    },
    // offer编辑信息回填
    getOfferInfo(type) {
      const params = {
        candidateIds: this.candidateIds.join(',')
      }
      getLastOfferByBatch(params).then(res => {
        const data = res.data
        if (type === 'hire') { // 录用信息回填
          this.hireForm.entryDate = data.plannedArrivalDate
          this.hireForm.probationPeriod = data.probationPeriod
          this.hireForm.salary =
            data.salaryType === 1 ? data.salary / 10000 : data.salary
          this.hireForm.salaryType = data.salaryType ? data.salaryType + '' : '1'
        } else {
          this.offerForm.offerSendDate = data.offerSendDate
          this.offerForm.plannedArrivalDate = data.plannedArrivalDate
          this.offerForm.probationPeriod = data.probationPeriod
          this.offerForm.salaryType = data.salaryType ? data.salaryType + '' : '1'
          this.offerForm.salary =
            data.salaryType === 1 ? data.salary / 10000 : data.salary
          this.offerForm.salaryDescription = data.salaryDescription
          this.offerForm.attachment = data.attachment
          this.offerForm.remark = data.description
        }
      })
    },
    // 确认操作
    handleSure() {
      let formName = ''
      if (this.type === 1) {
        formName = 'interviewForm'
      } else if (this.type === 2) {
        formName = 'offerForm'
      } else if (this.type === 3) {
        formName = 'hireForm'
      } else if (this.type === 4) {
        formName = 'weedOutForm'
      } else {
        formName = 'remarkForm'
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === 1) {
            // 面试
            this.batchInterview()
          } else if (this.type === 2) {
            // offer
            this.batchOffer()
          } else if (this.type === 3) {
            // 录用
            this.batchHire()
          } else if (this.type === 4) {
            // 淘汰
            this.batchRemarks()
          } else {
            const arr1 = [56, 57, 58] // 面试反馈
            const arr2 = [67] // offer反馈
            if (arr1.indexOf(this.operateCode) !== -1) {
              console.log('面试')
              this.batchFeedback()
            } else if (arr2.indexOf(this.operateCode) !== -1) {
              this.batchOffer(true)
            } else {
              console.log('其他')
              this.batchRemarks()
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 批量安排面试
    batchInterview() {
      const params = {
        candidateIds: this.candidateIds,
        operateCode: this.operateCode,
        plannedInterviewTime:
          this.interviewForm.interviewDate +
          ' ' +
          this.interviewForm.interviewTime +
          ':00',
        interviewMethod: this.interviewForm.interviewMethod,
        interviewProvince: this.interviewForm.interviewArea[0],
        interviewCity: this.interviewForm.interviewArea[1],
        interviewArea: this.interviewForm.interviewArea[2],
        interviewAddress: this.interviewForm.interviewAddress,
        interviewerName: this.interviewForm.interviewerName,
        interviewerMobile: this.interviewForm.interviewerMobile,
        remark: this.interviewForm.interviewRemark,
        isOver: this.isOver
      }
      console.log(params)
      batchArrangeInterview(params).then(res => {
        this.results(res.data)
        console.log(res)
      })
    },
    // 批量面试反馈
    batchFeedback() {
      const params = {
        candidateIds: this.candidateIds,
        operateCode: this.operateCode,
        remark: this.remarkForm.remark
      }
      batchInterviewFeedback(params).then(res => {
        this.results(res.data)
        console.log(res)
      })
    },
    // 批量操作Offer
    batchOffer(type) {
      let params = {}
      if (type) {
        params = {
          candidateIds: this.candidateIds,
          operateCode: this.operateCode,
          remark: this.remarkForm.remark
        }
      } else {
        params = {
          candidateIds: this.candidateIds,
          operateCode: this.operateCode,
          offerSendDate: this.offerForm.offerSendDate + ' 00:00:00',
          plannedArrivalDate: this.offerForm.plannedArrivalDate + ' ' + this.offerForm.plannedArrivalTime + ':00',
          probationPeriod: this.offerForm.probationPeriod,
          salary:
            this.offerForm.salaryType === '1'
              ? this.offerForm.salary * 10000
              : this.offerForm.salary,
          salaryType: this.offerForm.salaryType,
          salaryDescription: this.offerForm.salaryDescription,
          attachment: this.offerForm.attachment,
          remark: this.offerForm.remark
        }
      }
      console.log(params)
      batchOperateOffer(params).then(res => {
        this.results(res.data)
      })
    },
    // 上传附件成功
    uploadSuccess(res, file) {
      if (res.code === '000000') {
        this.offerForm.attachmentUrl = res.data.webPath
        this.offerForm.attachment = res.data.dbPath
        this.offerForm.fileName = res.data.fileName
        this.$message({
          message: '附件上传成功',
          type: 'success',
          showClose: true,
          center: true
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },
    // 预览附件
    priview(url) {
      window.open(url)
    },
    // 批量入职
    batchHire() {
      const params = {
        candidateIds: this.candidateIds,
        operateCode: this.operateCode,
        entryDate:
          this.hireForm.entryDate + ' ' + this.hireForm.entryTime + ':00',
        probationPeriod: this.hireForm.probationPeriod,
        salary:
          this.hireForm.salaryType === '1'
            ? this.hireForm.salary * 10000
            : this.hireForm.salary,
        salaryType: this.hireForm.salaryType,
        remark: this.hireForm.remark
      }
      batchOperateEntry(params).then(res => {
        this.results(res.data)
      })
    },
    // 其他批量备注
    batchRemarks() {
      const params = {
        candidateIds: this.candidateIds,
        operateCode: this.operateCode,
        eliminationUserType: this.weedOutReason.radio,
        eliminationReason:
          this.weedOutForm.remark || this.weedOutForm.weedOutReason,
        activationStatus: this.activateCode,
        remark: this.remarkForm.remark
      }
      batchOperateCandidate(params).then(res => {
        this.results(res.data)
      })
    },
    // 批量操作结果
    results(data) {
      this.$emit('updateList')
      if (this.operateType === 1) {
        this.handleClose()
        if (data.failureCount === 0) {
          this.$message.success({
            message: '操作成功',
            duration: 1000
          })
        } else {
          this.$message.error({
            message: `操作失败`,
            duration: 1000
          })
        }
      } else {
        this.resultVisible = true
        this.list = data
      }
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 14px;
  font-weight: bold;
}
.offset {
  margin-left: 16px;
}
.date {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
::v-deep .el-input-group__prepend {
  width: 40px;
  background: #ffffff;
  line-height: 31px;
}
::v-deep .el-input__inner {
  height: 33px;
}
::v-deep .el-input-group__append {
  background: #ffffff;
  line-height: 31px;
}
::v-deep .el-dialog__body {
  padding: 20px 20px 10px;
}
::v-deep .el-dialog__footer {
  padding-top: 0;
}
.footer {
  min-height: 30px;
  overflow: hidden;
  .names {
    float: left;
    display: flex;
    flex-direction: row;
    width: 70%;
    font-size: 13px;
    p {
      flex: 1;
      text-align: left;
    }
  }
  .btns {
    // float: right;
    font-size: 13px;
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
