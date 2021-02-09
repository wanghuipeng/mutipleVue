<template>
  <div class="resume-order-supplier">
    <template v-if="statusNo">
      <template>
        <!-- 头部 -->
        <div v-if="isRouterShow" class="order-cont">
          <!-- 选择推荐报告 -->
          <div class="select-input" @click="selectShow=false">
            <div class="value" @click.stop="selectShow=!selectShow">
              <span class="id">#{{ selectValue.applyId }}</span>
              <span class="job-name">{{ selectValue.positionName }}&nbsp;-&nbsp;</span>
              <span class="comp-name">{{ selectValue.companyName }}</span>
            </div>
            <ul v-if="selectShow" class="list">
              <li v-for="item in arr" :key="item.applyId" @click="checkIt(item)">
                <span class="id">#{{ item.applyId }}</span>
                <span class="job-name">{{ item.positionName }}</span>
                <span class="comp-name">{{ item.companyName }}</span>
              </li>
            </ul>
          </div>
          <!-- 步骤条 -->
          <el-steps :active="active" class="steps" align-center>
            <el-step v-if="active === 1" title="推荐" icon="el-icon el-icon-active"></el-step>
            <el-step v-else title="推荐" icon="el-icon"></el-step>
            <el-step v-if="active === 2" title="面试" icon="el-icon el-icon-active"></el-step>
            <el-step v-else title="面试" icon="el-icon"></el-step>
            <el-step v-if="active === 3" title="offer" icon="el-icon el-icon-active"></el-step>
            <el-step v-else title="offer" icon="el-icon"></el-step>
            <el-step v-if="active === 4" title="到岗" icon="el-icon el-icon-active"></el-step>
            <el-step v-else title="到岗" icon="el-icon"></el-step>
            <el-step v-if="active === 5" title="过保" icon="el-icon el-icon-active"></el-step>
            <el-step v-else title="过保" icon="el-icon"></el-step>
          </el-steps>
        </div>
        <!-- 操作按钮 -->
        <template v-if="orderData">
          <!-- 推荐待审，待提交HR，待HR反馈，评估已通过 -->
          <div
            v-if="orderData.statusNo === 11 || orderData.statusNo === 12 || orderData.statusNo === 16 || orderData.statusNo === 21 || orderData.statusNo === 22"
            class="btns"
          >
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 2)"
            >取消推荐</el-button>
          </div>
          <!-- 待重推 -->
          <div v-if="orderData.statusNo === 13" class="btns">
            <el-button size="mini" type="primary" @click="handleBtn(orderData, 7)">重新推荐</el-button>
            <el-button class="btn-orange" size="mini" @click="handleBtn(orderData, 2)">取消推荐</el-button>
          </div>
          <!-- 取消推荐 -->
          <div v-if="orderData.statusNo === 17" class="btns">
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 7)"
            >重新推荐</el-button>
          </div>
          <!-- 待猎头约面 -->
          <div v-if="orderData.statusNo === 31" class="btns">
            <el-button size="mini" type="primary" @click="handleBtn(orderData, 14, true)">安排面试</el-button>
            <el-button class="btn-orange" size="mini" @click="handleBtn(orderData, 15)">取消面试</el-button>
          </div>
          <!-- 已安排面试 -->
          <div v-if="orderData.statusNo === 32" class="btns">
            <el-button size="mini" type="primary" @click="handleBtn(orderData, 17, true)">修改面试</el-button>
            <el-button class="btn-orange" size="mini" @click="handleBtn(orderData, 15)">取消面试</el-button>
          </div>
          <!-- 已到面 -->
          <div v-if="orderData.statusNo === 34" class="btns">
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 15)"
            >取消面试</el-button>
          </div>
          <!-- 面试通过 -->
          <div v-if="orderData.statusNo === 36" class="btns">
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 15)"
            >取消面试</el-button>
          </div>
          <!-- 放弃offer -->
          <div v-if="orderData.statusNo === 41" class="btns">
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 29)"
            >放弃offer</el-button>
          </div>
          <!-- 已发offer -->
          <div v-if="orderData.statusNo === 42" class="btns">
            <el-button
              size="mini"
              type="primary"
              class="block"
              @click="handleBtn(orderData, 28)"
            >放弃入职</el-button>
          </div>
        </template>
        <!-- 订单状态 -->
        <div class="log-cont">
          <el-collapse v-if="orderData" v-model="activeNames" accordion>
            <el-collapse-item
              v-if="orderData.statusNo === 61 || orderData.statusNo === 62 || orderData.statusNo === 53"
              name="1"
            >
              <template slot="title">
                过保结佣
                <span class="label">通过</span>
                <span class="time">{{ orderData.overdueDate }}</span>
              </template>
              <div
                v-if="orderData.plfCommissionAmount && orderData.plfCommissionSettlementType === 1"
                class="order-item"
              >
                <label>本单佣金：</label>
                <span>{{ orderData.plfCommissionAmount }}元</span>
              </div>
              <div
                v-if="orderData.plfCommissionAmount && orderData.plfCommissionSettlementType === 2"
                class="order-item"
              >
                <label>本单佣金：</label>
                <span>{{ orderData.plfCommissionAmount }}元</span>
              </div>
              <div v-if="orderData.hhCommissionRatio" class="order-item">
                <label>分成比例：</label>
                <span>{{ orderData.hhCommissionRatio }}%</span>
              </div>
              <div v-if="orderData.subsidyAmount" class="order-item">
                <label>成单补贴：</label>
                <span>{{ orderData.subsidyAmount }}</span>
              </div>
              <div
                v-if="orderData.hhCommissionAmount || orderData.subsidyAmount"
                class="order-item"
              >
                <label>最终佣金：</label>
                <span>{{ finalAmount }}元</span>
              </div>
              <div v-if="orderData.overdueRemarks" class="order-item">
                <label>备注：</label>
                <span>{{ orderData.overdueRemarks }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item
              v-if="orderData.statusNo === 51 || orderData.statusNo === 52 || orderData.statusNo === 43 || orderData.statusNo === 61 || orderData.statusNo === 62 || orderData.statusNo === 53"
              name="2"
            >
              <template slot="title">
                入职跟踪
                <span class="label">通过</span>
                <span
                  class="time"
                >{{ orderData.candidateRecommendReport && orderData.candidateRecommendReport.createTime }}</span>
              </template>
              <div v-if="orderData.arrivalDate" class="order-item">
                <label>入职日期：</label>
                <span>{{ orderData.arrivalDate }}</span>
              </div>
              <div
                v-if="orderData.statusNo === 51 || orderData.statusNo === 52 || orderData.statusNo === 43"
                class="order-item"
              >
                <label>入职结果：</label>
                <span v-if="orderData.statusNo === 51">到岗成功</span>
                <span v-if="orderData.statusNo === 52">未到岗</span>
                <span v-if="orderData.statusNo === 43">放弃到岗</span>
              </div>
              <div v-if="orderData.candidateOffer.description" class="order-item">
                <label>补充说明：</label>
                <span>{{ orderData.candidateOffer.description }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item
              v-if="orderData.statusNo === 41 || orderData.statusNo === 42 || orderData.statusNo === 44 || orderData.statusNo === 51 || orderData.statusNo === 52 || orderData.statusNo === 43 || orderData.statusNo === 61 || orderData.statusNo === 62 || orderData.statusNo === 53"
              name="3"
            >
              <template slot="title">
                OFFER
                <span class="label">通过</span>
                <span
                  class="time"
                >{{ orderData.candidateOffer && orderData.candidateOffer.createTime }}</span>
              </template>
              <template v-if="orderData.candidateOffer">
                <div v-if="orderData.candidateOffer.department" class="order-item">
                  <label>入职部门：</label>
                  <span>{{ orderData.candidateOffer.department }}</span>
                </div>
                <div v-if="orderData.candidateOffer.position" class="order-item">
                  <label>入职职位：</label>
                  <span>{{ orderData.candidateOffer.position }}</span>
                </div>
                <div v-if="orderData.candidateOffer.positionLevel" class="order-item">
                  <label>入职级别：</label>
                  <span>{{ orderData.candidateOffer.positionLevel }}</span>
                </div>
                <div v-if="orderData.candidateOffer.yearlySalary" class="order-item">
                  <label>OFFER年薪：</label>
                  <span>{{ orderData.candidateOffer.yearlySalary }}元</span>
                </div>
                <div
                  v-if="orderData.plfCommissionSettlementType === 1 && orderData.position.commissionRatio"
                  class="order-item"
                >
                  <label>年薪比例：</label>
                  <span>{{ orderData.position.commissionRatio }}%</span>
                </div>
                <div
                  v-if="orderData.plfCommissionSettlementType === 2 && orderData.plfCommissionAmount"
                  class="order-item"
                >
                  <label>固定佣金：</label>
                  <span>{{ orderData.plfCommissionAmount }}</span>
                </div>
                <div v-if="orderData.candidateOffer.actualArrivaDate" class="order-item">
                  <label>到岗日期：</label>
                  <span>{{ orderData.candidateOffer.actualArrivaDate }}</span>
                </div>
                <div v-if="orderData.candidateOffer.offerProvince" class="order-item">
                  <label>到岗地点：</label>
                  <span>{{ orderData.candidateOffer.offerProvince | filterCommonDict(dictData.areas) }}-{{ orderData.candidateOffer.offerCity | filterLevel2(dictData.areas) }}-{{ orderData.candidateOffer.offerArea | filterLevel3(dictData.areas) }}-{{ orderData.candidateOffer.offerAddress }}</span>
                </div>
                <div v-if="orderData.candidateOffer.probationPeriod" class="order-item">
                  <label>试用期：</label>
                  <span>{{ orderData.candidateOffer.probationPeriod }}个月</span>
                </div>
                <div v-if="orderData.candidateOffer.contactName" class="order-item">
                  <label>联系人：</label>
                  <span>{{ orderData.candidateOffer.contactName }}</span>
                </div>
                <div v-if="orderData.candidateOffer.contactMobile" class="order-item">
                  <label>联系方式：</label>
                  <span>{{ orderData.candidateOffer.contactMobile }}</span>
                </div>
                <div v-if="orderData.candidateOffer.attachmentUrl" class="order-item">
                  <label>OFFER附件：</label>
                  <template
                    v-if="orderData.candidateOffer.attachment.indexOf('png') !== -1 || orderData.candidateOffer.attachment.indexOf('jpg') !== -1"
                  >
                    <img class="file-img" :src="orderData.candidateOffer.attachmentUrl" />
                  </template>
                  <el-button v-else size="mini" type="text" class="preview-btn">
                    <a :href="orderData.candidateOffer.attachmentUrl" target="blank">预览</a>
                  </el-button>
                </div>
              </template>
              <div v-if="orderData.offerRemarks" class="order-item">
                <label>补充说明：</label>
                <span>{{ orderData.offerRemarks }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item
              v-if="orderData.candidateInterviewList && orderData.candidateInterviewList.length > 0"
              name="4"
            >
              <template slot="title">
                面试
                <span class="label">通过</span>
                <span
                  class="time"
                >{{ orderData.candidateInterviewList[0] && orderData.candidateInterviewList[0].createTime }}</span>
              </template>
              <ul>
                <li v-for="(item,index) in orderData.candidateInterviewList" :key="index">
                  <h3 v-if="item.round">{{ item.round }}轮面试</h3>
                  <div v-if="item.interviewMethod" class="order-item">
                    <label>面试方式：</label>
                    <span>{{ item.interviewMethod==1 ? '面谈' : (item.interviewMethod==2 ? '笔试' : (item.interviewMethod==3 ? '机试' : (item.interviewMethod==4 ? '电话面试' : (item.interviewMethod==5 ? '视频面试' : '')))) }}</span>
                  </div>
                  <div v-if="item.plannedInterviewTime" class="order-item">
                    <label>面试时间：</label>
                    <span>{{ item.plannedInterviewTime }}</span>
                  </div>
                  <div v-if="item.interviewProvince" class="order-item">
                    <label>面试地点：</label>
                    <span>{{ item.interviewProvince | filterCommonDict(dictData.areas) }}-{{ item.interviewCity | filterLevel2(dictData.areas) }}-{{ item.interviewArea | filterLevel3(dictData.areas) }}-{{ item.interviewAddress }}</span>
                  </div>
                  <div v-if="item.contactName" class="order-item">
                    <label>联系人：</label>
                    <span>{{ item.contactName }}</span>
                  </div>
                  <div v-if="item.contactMobile" class="order-item">
                    <label>联系方式：</label>
                    <span>{{ item.contactMobile }}</span>
                  </div>
                  <div v-if="item.description" class="order-item">
                    <label>温馨提示：</label>
                    <span>{{ item.description }}</span>
                  </div>
                </li>
              </ul>
            </el-collapse-item>
            <el-collapse-item v-if="orderData" name="5">
              <template slot="title">
                推荐记录
                <span class="label">通过</span>
                <span
                  class="time"
                >{{ orderData.candidateRecommendReport && orderData.candidateRecommendReport.createTime }}</span>
              </template>
              <div v-if="orderData.id" class="order-item">
                <label>订单编号：</label>
                <span>{{ orderData.id }}</span>
              </div>
              <div v-if="orderData.recommendTime" class="order-item">
                <label>推荐时间：</label>
                <span>{{ orderData.recommendTime | filterDate }}</span>
              </div>
              <div v-if="orderData.position && orderData.position.title" class="order-item">
                <label>推荐职位：</label>
                <span>{{ orderData.position && orderData.position.title }}</span>
              </div>
              <div v-if="orderData.company && orderData.company.shortName" class="order-item">
                <label>推荐公司：</label>
                <span>{{ orderData.company && orderData.company.shortName }}</span>
              </div>
              <div
                v-if="orderData.position && orderData.position.commissionAmount"
                class="order-item"
              >
                <label>预计佣金：</label>
                <span>{{ orderData.position && orderData.position.commissionAmount }}元</span>
              </div>
              <div
                v-if="orderData.position && orderData.position.commissionRatio"
                class="order-item"
              >
                <label>分成比例：</label>
                <span>{{ orderData.position && orderData.position.commissionRatio }}%</span>
              </div>
              <div v-if="orderData.subsidyAmount" class="order-item">
                <label>平台补贴：</label>
                <span>{{ orderData.subsidyAmount }}</span>
              </div>
              <div v-if="orderData.guaranteePeriod" class="order-item">
                <label>保证期限：</label>
                <span>{{ orderData.guaranteePeriod }}{{ orderData.guaranteePeriodType === 1 ? '天' : (orderData.guaranteePeriodType === 2 ? '个月' : '') }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </template>
    </template>
    <div v-else-if="statusNo === 0" class="empty">
      <img src="~@/assets/images/order/blank.png" />
      <p>该候选人暂无相关投递记录</p>
    </div>
    <!-- 取消推荐弹窗 -->
    <handle-dialog
      v-if="recommendVisible"
      :dialog.sync="recommendVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消推荐"
      @reload="reloadPage"
    />

    <!-- 面试安排弹窗 -->
    <handle-dialog
      v-if="interviewVisible"
      :dialog.sync="interviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      type="confirmInterview"
      title="确认面试安排"
      @reload="reloadPage"
    />

    <!-- 取消面试弹窗 -->
    <handle-dialog
      v-if="cancelInterviewVisible"
      :dialog.sync="cancelInterviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消面试"
      @reload="reloadPage"
    />

    <!-- 修改面试弹窗 -->
    <handle-dialog
      v-if="modifyInterviewVisible"
      :dialog.sync="modifyInterviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      type="modifyInterview"
      title="修改面试安排"
      @reload="reloadPage"
    />

    <!-- 取消OFFER弹窗 -->
    <handle-dialog
      v-if="cancelOfferVisible"
      :dialog.sync="cancelOfferVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消OFFER"
      @reload="reloadPage"
    />
  </div>
</template>

<script>
import { detail, operation } from '@/api/order'
import { getApplyListByResumeId } from '@/api/resume'
import handleDialog from '@/views/order/dialog/handleDialog'

export default {
  components: {
    handleDialog
  },
  props: {
    resumeId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      recommendVisible: false, // 取消推荐弹窗
      interviewVisible: false, // 面试弹窗
      cancelInterviewVisible: false, // 取消面试
      modifyInterviewVisible: false, // 修改面试
      cancelOfferVisible: false, // 修改offer
      finalAmount: null, // 最终佣金
      selectShow: false,
      arr: [],
      active: 1,
      activeNames: [],
      selectValue: '',
      orderData: null,
      orderInfo: null,
      operateMethod: null,
      isRouterShow: true,
      statusNo: null,
      applyId: null
    }
  },
  computed: {
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    this.getApplyListByResumeId()
    console.log('供應商')
  },
  methods: {
    reloadPage() {
      console.log('刷新')
      this.orderDetail(this.applyId)
      this.reloadComponent()
      this.$message.success('保存成功')
    },
    // 订单操作
    handleBtn(order, method, flag) {
      this.orderInfo = order
      this.operateMethod = method
      if (
        order.statusNo === 11 ||
        order.statusNo === 12 ||
        order.statusNo === 16 ||
        order.statusNo === 21 ||
        order.statusNo === 22
      ) {
        this.recommendVisible = !this.recommendVisible
      } else if (order.statusNo === 13) {
        if (flag) {
          this.operations(order, method)
        } else {
          this.recommendVisible = !this.recommendVisible
        }
      } else if (order.statusNo === 31) {
        if (flag) {
          this.interviewVisible = !this.interviewVisible
        } else {
          this.cancelInterviewVisible = !this.cancelInterviewVisible
        }
      } else if (order.statusNo === 32) {
        if (flag) {
          this.modifyInterviewVisible = !this.modifyInterviewVisible
        } else {
          this.cancelInterviewVisible = !this.cancelInterviewVisible
        }
      } else if (order.statusNo === 34) {
        this.cancelInterviewVisible = !this.cancelInterviewVisible
      } else if (order.statusNo === 41 || order.statusNo === 42) {
        this.cancelOfferVisible = !this.cancelOfferVisible
      } else {
        this.operations(order, method)
      }
    },
    operations(order, method) {
      const params = {
        candidateId: order.id,
        operateMethod: method,
        operatorType: 1,
        operatorUserId: this.$store.state.userInfo.userId
      }
      operation(params).then(res => {
        if (res.code === '000000') {
          if (method === 7) {
            this.$router.push({
              path: '/reviewReport',
              query: {
                positionId: order.positionId,
                companyId: order.companyId,
                reportId: order.recommendReportId,
                resumeId: order.resumeId,
                orderId: order.id
              }
            })
          }
        }
      })
    },
    checkIt(item) {
      console.log(item)
      this.selectValue = item
      this.orderDetail(item.applyId)
    },
    async reloadComponent() {
      this.isRouterShow = false
      await this.$nextTick()
      this.isRouterShow = true
    },
    // 获取简历对应的订单列表
    getApplyListByResumeId() {
      this.rightLoading = true
      const params = {
        resumeId: this.$props.resumeId
      }
      getApplyListByResumeId(params).then(res => {
        this.rightLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.selectValue = data && data[0]
          data &&
            data[0] &&
            data[0].applyId &&
            this.orderDetail(data && data[0] && data[0].applyId)
          this.arr = data
          if ((data && data.length === 0) || !data) {
            this.statusNo = 0
          }
        }
      })
    },
    orderDetail(applyId) {
      this.applyId = applyId
      const params = {
        id: applyId
      }
      detail(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.orderData = data
          this.statusNo = data && data.statusNo
          console.log('推荐报告', data)
          this.$store.commit('setReportDetail', data)
          if (
            this.orderData.statusNo === 61 ||
            this.orderData.statusNo === 62 ||
            this.orderData.statusNo === 53
          ) {
            this.activeNames = ['1']
          } else if (
            this.orderData.statusNo === 51 ||
            this.orderData.statusNo === 52 ||
            this.orderData.statusNo === 43 ||
            this.orderData.statusNo === 61 ||
            this.orderData.statusNo === 62 ||
            this.orderData.statusNo === 53
          ) {
            this.activeNames = ['2']
          } else if (
            this.orderData.statusNo === 41 ||
            this.orderData.statusNo === 42 ||
            this.orderData.statusNo === 44 ||
            this.orderData.statusNo === 51 ||
            this.orderData.statusNo === 52 ||
            this.orderData.statusNo === 43 ||
            this.orderData.statusNo === 61 ||
            this.orderData.statusNo === 62 ||
            this.orderData.statusNo === 53
          ) {
            if (this.orderData.candidateOffer) {
              this.activeNames = ['3']
            }
          } else {
            if (
              this.orderData.candidateInterviewList &&
              this.orderData.candidateInterviewList.length > 0
            ) {
              this.activeNames = ['4']
            } else {
              this.activeNames = ['5']
            }
          }
          // 最终佣金
          this.finalAmount =
            this.orderData.hhCommissionAmount + this.orderData.subsidyAmount
          this.finalAmount = this.finalAmount && this.finalAmount.toFixed(2)
          console.log('订单详情', this.orderData)
          const step = parseInt(this.orderData.statusNo.toString().slice(0, 1))
          if (step === 1 || step === 2) {
            this.active = 1
          } else if (step === 3) {
            this.active = 2
          } else if (step === 4) {
            this.active = 3
          } else if (step === 5) {
            this.active = 4
          } else if (step === 6) {
            this.active = 5
          }
          console.log('active', this.active)
        }
      })
    }
  }
}
</script>
<style  lang="scss">
.resume-order-supplier {
  .preview-btn {
    background: transparent;
    border: none;
    width: auto !important;
    a {
      color: #1678f9;
    }
  }
  .empty {
    padding: 50px;
    img {
      display: block;
      width: 220px;
      height: 168px;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      color: #b3b3b3;
      text-align: center;
      margin-top: 30px;
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    button {
      height: 28px;
      border-radius: 2px;
      &:first-child {
        margin-right: 16px;
      }
      &.btn-orange {
        color: #f64f4f;
        border-color: #f64f4f;
      }
      &.block {
        width: 100%;
      }
    }
  }
  .log-cont {
    border-radius: 2px;
    h3 {
      margin-bottom: 16px;
      position: relative;
      margin-top: 10px;
    }
    .el-collapse {
      background: #f9fafb;
      margin-top: 24px;
    }
    .order-item {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      label {
        color: #8d9299;
        font-size: 13px;
        width: 90px;
        display: inline-block;
      }
      span {
        color: #0d121a;
      }
    }
    .el-collapse-item__wrap {
      background: #f9fafb;
      padding: 0 16px;
    }
    .el-collapse-item__header {
      padding: 0 16px;
      background: #f9fafb;
      font-size: 13px;
      font-weight: 600;
      color: #0d121a;
      position: relative;
      &::before {
        content: '';
        width: 4px;
        height: 16px;
        display: inline-block;
        background-color: #1678f9;
        left: 0px;
        top: 16px;
        position: absolute;
      }
      .label {
        display: inline-block;
        color: #46ba86;
        height: 18px;
        line-height: 18px;
        width: 34px;
        text-align: center;
        font-size: 11px;
        font-weight: normal;
        border-radius: 11px;
        background: rgba(70, 186, 134, 0.1);
        margin-left: 14px;
      }
      .time {
        color: #595f66;
        font-size: 11px;
        font-weight: normal;
        float: right;
        position: absolute;
        right: 40px;
      }
    }
  }
  .file-img {
    width: 90px;
    height: 60px;
    border-radius: 1px;
    vertical-align: top;
    margin-top: 6px;
    margin-left: 6px;
    object-fit: cover;
  }
  .steps {
    margin: 24px 0;
    .el-step__title {
      color: #8d9299;
      font-size: 11px;
      &.is-finish {
        color: #1678f9;
      }
    }
    .el-icon {
      width: 12px;
      height: 12px;
      display: inline-block;
      background: url('~@/assets/images/resume/resumeDetailSupplier/gray_circle.png')
        no-repeat;
      background-size: 12px;
    }
    .is-finish {
      .el-icon {
        width: 12px;
        height: 12px;
        background: url('~@/assets/images/resume/resumeDetailSupplier/blue_circle.png')
          no-repeat;
        background-size: 12px;
        &.el-icon-active {
          width: 20px;
          height: 20px;
          background: url('~@/assets/images/resume/resumeDetailSupplier/active_circle.png')
            no-repeat !important;
          background-size: 20px !important;
        }
      }
    }
  }
  .select-input {
    width: 100%;
    height: 28px;
    line-height: 28px;
    color: #282c32;
    font-size: 13px;
    padding: 0 16px;
    border: 1px solid #e9edf1;
    border-radius: 2px;
    box-sizing: border-box;
    position: relative;
    .list {
      position: absolute;
      left: 0;
      top: 28px;
      width: 100%;
      z-index: 10;
      list-style: none;
      padding: 6px 0;
      margin: 0;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      margin: 5px 0;
      li {
        padding: 6px 16px;
        cursor: pointer;
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
    .value {
      span {
        &.id {
          margin-right: 8px;
        }
        &.comp-name {
          color: #8d9299;
        }
      }
    }
  }
}
</style>
