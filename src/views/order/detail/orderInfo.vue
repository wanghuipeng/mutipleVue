<template>
  <div class="order">
    <!-- 推荐阶段 -->
    <template v-if="step === 1 || step === 2">
      <div class="order-left">
        <p class="order-left-id">订单号：{{ detail.id || $route.query.orderId }}</p>
        <p v-if="detail.statusNo === 11 || detail.statusNo === 12" class="order-left-state">推荐待审</p>
        <p v-else-if="detail.statusNo === 16" class="order-left-state">待提交HR</p>
        <p v-else-if="detail.statusNo === 21" class="order-left-state">待HR反馈</p>
        <p v-else-if="detail.statusNo === 22" class="order-left-state">HR评估通过</p>
        <p v-else-if="detail.statusNo === 13" class="order-left-state">打回重推</p>
        <p v-else-if="detail.statusNo === 14 || detail.statusNo === 15 || detail.statusNo === 23" class="order-left-state">HR评估不通过</p>
        <p v-else class="order-left-state">{{ detail.statusNo | filterArr(initStatusNo) }}</p>
        <p class="order-left-consult" @click="sendMsg">订单咨询</p>
        <p class="order-left-btn">
          <el-button v-if="detail.statusNo === 13" round @click="handleBtn(detail, 7, true)">重新推荐</el-button>
          <el-button v-if="detail.statusNo === 11 || detail.statusNo === 12 || detail.statusNo === 16 || detail.statusNo === 21 || detail.statusNo === 22|| detail.statusNo === 13" round @click="handleBtn(detail, 2)">取消推荐</el-button>
        </p>
      </div>
      <div class="order-right">
        <p class="order-right-title">推荐记录</p>
        <p v-if="detail.position && detail.position.title" class="order-right-desc"><span>推荐职位：</span>{{ detail.position.title }}</p>
        <p v-if="detail.company && detail.company.shortName" class="order-right-desc"><span>推荐公司：</span>{{ detail.company.shortName }}</p>
        <p v-if="detail.position && detail.position.commissionAmount" class="order-right-desc"><span>预计佣金：</span>{{ detail.position.commissionAmount }}元</p>
        <p v-if="detail.position && detail.position.commissionRatio" class="order-right-desc"><span>分成比例：</span>{{ detail.position.commissionRatio }}%</p>
        <p v-if="detail.guaranteePeriod" class="order-right-desc"><span>保证期限：</span>{{ detail.guaranteePeriod }}个月</p>
        <p v-if="detail.subsidyAmount" class="order-right-desc"><span>平台补贴：</span>{{ detail.subsidyAmount }}</p>
      </div>
    </template>

    <!-- 面试阶段 -->
    <template v-if="step === 3">
      <div class="order-left">
        <p class="order-left-id">订单号：{{ detail.id }}</p>
        <p v-if="detail.statusNo === 31" class="order-left-state">待猎头约面</p>
        <p v-else-if="detail.statusNo === 32" class="order-left-state">约面成功</p>
        <p v-else-if="detail.statusNo === 34" class="order-left-state">已到面</p>
        <p v-else-if="detail.statusNo === 36" class="order-left-state">面试通过</p>
        <p v-else class="order-left-state">{{ detail.statusNo | filterArr(initStatusNo) }}</p>
        <p class="order-left-consult" @click="sendMsg">订单咨询</p>
        <p class="order-left-btn">
          <template v-if="detail.statusNo === 31">
            <el-button round @click="handleBtn(detail, 14, true)">安排面试</el-button>
            <el-button round @click="handleBtn(detail, 15)">取消面试</el-button>
          </template>
          <template v-if="detail.statusNo === 32">
            <el-button round @click="handleBtn(detail, 17, true)">修改面试</el-button>
            <el-button round @click="handleBtn(detail, 15)">取消面试</el-button>
          </template>
          <template v-if="detail.statusNo === 34 || detail.statusNo === 36">
            <el-button round @click="handleBtn(detail, 15)">候选人放弃</el-button>
          </template>
        </p>
      </div>
      <div v-if="detail.candidateInterviewList[0]" class="order-right">
        <p class="order-right-title">面试安排</p>
        <p v-if="detail.candidateInterviewList[0].interviewMethod" class="order-right-desc"><span>面试方式：</span>{{ detail.candidateInterviewList[0].interviewMethod | filterArr(dictData.dicts.interviewType) }}</p>
        <p v-if="detail.candidateInterviewList[0].plannedInterviewTime" class="order-right-desc"><span>面试时间：</span>{{ detail.candidateInterviewList[0].plannedInterviewTime }}</p>
        <p v-if="detail.candidateInterviewList[0].interviewCity || detail.candidateInterviewList[0].interviewAddress" class="order-right-desc"><span>面试地点：</span>
          {{ detail.candidateInterviewList[0].interviewProvince | filterArr(dictData.areas) }}
          {{ detail.candidateInterviewList[0].interviewCity | filterLevel2(dictData.areas) }}
          {{ detail.candidateInterviewList[0].interviewArea | filterLevel3(dictData.areas) }}
          {{ detail.candidateInterviewList[0].interviewAddress }}
        </p>
        <p v-if="detail.candidateInterviewList[0].contactName" class="order-right-desc"><span>联系人：</span>{{ detail.candidateInterviewList[0].contactName }}</p>
        <p v-if="detail.candidateInterviewList[0].contactMobile" class="order-right-desc"><span>联系方式：</span>{{ detail.candidateInterviewList[0].contactMobile }}</p>
        <p v-if="detail.candidateInterviewList[0].description" class="order-right-desc"><span>补充说明：</span>{{ detail.candidateInterviewList[0].description }}</p>
      </div>
    </template>

    <!-- offer阶段 -->
    <template v-if="step === 4">
      <div class="order-left">
        <p class="order-left-id">订单号：{{ detail.id }}</p>
        <p v-if="detail.statusNo === 41" class="order-left-state">准备Offer</p>
        <p v-else-if="detail.statusNo === 42" class="order-left-state">已发offer</p>
        <p v-else-if="detail.statusNo === 44" class="order-left-state">放弃offer</p>
        <p v-else class="order-left-state">{{ detail.statusNo | filterArr(initStatusNo) }}</p>
        <p class="order-left-consult" @click="sendMsg">订单咨询</p>
        <p class="order-left-btn">
          <el-button v-if="detail.statusNo === 41 || detail.statusNo === 42" round @click="handleBtn(detail, 29)">候选人放弃</el-button>
          <el-button v-if="detail.statusNo === 44" round @click="handleBtn(detail, 7, true)">重新推荐</el-button>
        </p>
      </div>
      <div v-if="detail.candidateOffer" class="order-right">
        <p class="order-right-title">OFFER</p>
        <p v-if="detail.candidateOffer.position" class="order-right-desc"><span>入职岗位：</span>{{ detail.candidateOffer.position }}</p>
        <p v-if="detail.candidateOffer.department" class="order-right-desc"><span>入职部门：</span>{{ detail.candidateOffer.department }}</p>
        <p v-if="detail.candidateOffer.positionLevel" class="order-right-desc"><span>任职级别：</span>{{ detail.candidateOffer.positionLevel }}</p>
        <p v-if="detail.candidateOffer.attachmentUrl" class="order-right-desc"><span>OFFER附件：</span>
          <el-link type="primary" :href="detail.candidateOffer.attachmentUrl">预览</el-link>
          <!-- <img :src="detail.candidateOffer.attachmentUrl" style="width: 50px;" @click="previewImg('offer附件', detail.candidateOffer.attachmentUrl)"> -->
        </p>
        <p v-if="detail.candidateOffer.yearlySalary" class="order-right-desc"><span>OFFER年薪：</span>{{ detail.candidateOffer.yearlySalary }}元</p>
        <p v-if="detail.position.commissionRatio" class="order-right-desc"><span>年薪比例：</span>{{ detail.position.commissionRatio }}%</p>
        <p v-if="detail.candidateOffer.plannedArrivaDate" class="order-right-desc"><span>到岗日期：</span>{{ detail.candidateOffer.plannedArrivaDate }}</p>
        <p v-if="detail.candidateOffer.probationPeriod" class="order-right-desc"><span>试用期：</span>{{ detail.candidateOffer.probationPeriod }}个月</p>
        <p v-if="detail.candidateOffer.contactName" class="order-right-desc"><span>联系人：</span>{{ detail.candidateOffer.contactName }}</p>
        <p v-if="detail.candidateOffer.contactMobile" class="order-right-desc"><span>联系方式：</span>{{ detail.candidateOffer.contactMobile }}</p>
        <p v-if="detail.candidateOffer.description" class="order-right-desc"><span>补充说明：</span>{{ detail.candidateOffer.description }}</p>
      </div>
    </template>

    <!-- 到岗阶段 -->
    <template v-if="step === 5">
      <div class="order-left">
        <p class="order-left-id">订单号：{{ detail.id }}</p>
        <p v-if="detail.statusNo === 51" class="order-left-state">到岗成功</p>
        <p v-else-if="detail.statusNo === 43" class="order-left-state">放弃到岗</p>
        <p v-else class="order-left-state">{{ detail.statusNo | filterArr(initStatusNo) }}</p>
        <p class="order-left-consult" @click="sendMsg">订单咨询</p>
      </div>
      <div class="order-right">
        <p class="order-right-title">OFFER</p>
        <p v-if="detail.candidateOffer.yearlySalary" class="order-right-desc"><span>OFFER年薪：</span>{{ detail.candidateOffer.yearlySalary }}元</p>
        <p v-if="detail.position.commissionRatio" class="order-right-desc"><span>年薪比例：</span>{{ detail.position.commissionRatio }}%</p>
        <p v-if="detail.candidateOffer.plannedArrivaDate" class="order-right-desc"><span>到岗日期：</span>{{ detail.candidateOffer.plannedArrivaDate }}</p>
        <p v-if="detail.candidateOffer.probationPeriod" class="order-right-desc"><span>试用期：</span>{{ detail.candidateOffer.probationPeriod }}个月</p>
        <p v-if="detail.candidateOffer.contactName" class="order-right-desc"><span>联系人：</span>{{ detail.candidateOffer.contactName }}</p>
        <p v-if="detail.candidateOffer.contactMobile" class="order-right-desc"><span>联系方式：</span>{{ detail.candidateOffer.contactMobile }}</p>
        <p v-if="detail.candidateOffer.description" class="order-right-desc"><span>补充说明：</span>{{ detail.candidateOffer.description }}</p>
      </div>
    </template>

    <!-- 过保阶段 -->
    <template v-if="step === 6">
      <div class="order-left">
        <p class="order-left-id">订单号：{{ detail.id }}</p>
        <p v-if="detail.statusNo === 52" class="order-left-state">已过保</p>
        <p v-else-if="detail.statusNo === 53" class="order-left-state">未过保</p>
        <p v-else class="order-left-state">{{ detail.statusNo | filterArr(initStatusNo) }}</p>
        <p class="order-left-consult" @click="sendMsg">订单咨询</p>
        <p class="order-left-btn">
          <!-- <el-button v-if="detail.statusNo === 52" round @click="handleBtn(detail, 30)">领取佣金</el-button> -->
        </p>
      </div>
      <div class="order-right">
        <p class="order-right-title">在职跟踪</p>
        <p v-if="detail.candidateOffer.yearlySalary" class="order-right-desc"><span>OFFER年薪：</span>{{ detail.candidateOffer.yearlySalary }}元</p>
        <p v-if="detail.position.commissionRatio" class="order-right-desc"><span>年薪比例：</span>{{ detail.position.commissionRatio }}%</p>
        <p v-if="detail.candidateOffer.plannedArrivaDate" class="order-right-desc"><span>入职日期：</span>{{ detail.candidateOffer.plannedArrivaDate }}</p>
        <p v-if="detail.candidateOffer.probationPeriod" class="order-right-desc"><span>试用期：</span>{{ detail.candidateOffer.probationPeriod }}个月</p>
        <p v-if="detail.overdueDate" class="order-right-desc"><span>过保日期：</span>{{ detail.overdueDate.split(' ')[0] }}</p>
        <p v-if="detail.candidateOffer.contactMobile" class="order-right-desc"><span>联系方式：</span>{{ detail.candidateOffer.contactMobile }}</p>
        <p v-if="detail.candidateOffer.description" class="order-right-desc"><span>补充说明：</span>{{ detail.candidateOffer.description }}</p>
      </div>
    </template>

    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />

    <!-- 取消推荐弹窗 -->
    <handle-dialog v-if="recommendVisible" :dialog.sync="recommendVisible" :info="orderInfo" :operate-method="operateMethod" title="请确认是否取消推荐" @reload="reloadPage"/>

    <!-- 面试安排弹窗 -->
    <handle-dialog v-if="interviewVisible" :dialog.sync="interviewVisible" :info="orderInfo" :operate-method="operateMethod" type="confirmInterview" title="确认面试安排" @reload="reloadPage"/>

    <!-- 取消面试弹窗 -->
    <handle-dialog v-if="cancelInterviewVisible" :dialog.sync="cancelInterviewVisible" :info="orderInfo" :operate-method="operateMethod" title="请确认是否取消面试" @reload="reloadPage"/>

    <!-- 修改面试弹窗 -->
    <handle-dialog v-if="modifyInterviewVisible" :dialog.sync="modifyInterviewVisible" :info="orderInfo" :operate-method="operateMethod" type="modifyInterview" title="修改面试安排" @reload="reloadPage"/>

    <!-- 取消OFFER弹窗 -->
    <handle-dialog v-if="cancelOfferVisible" :dialog.sync="cancelOfferVisible" :info="orderInfo" :operate-method="operateMethod" title="请确认是否取消OFFER" @reload="reloadPage"/>

    <!-- 预览 -->
    <el-dialog
      class="preview-modal"
      :title="previewImgTitle"
      :visible="previewVisible"
      :append-to-body="true"
      :before-close="() => previewVisible = false"
    >
      <img :src="previewImgUrl" class="preview-img" >
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { operation } from '@/api/order'
import { reportName } from '@/api/TIM/index'
import dialogChat from '@/components/common/dialogChat.vue'
import handleDialog from '../dialog/handleDialog'
export default {
  components: {
    handleDialog,
    dialogChat
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      previewImgTitle: null,
      loadingImg: false,
      previewImgUrl: '',
      previewVisible: false,
      dialogVisible: false,
      recommendVisible: false, // 取消推荐弹窗
      interviewVisible: false, // 面试弹窗
      cancelInterviewVisible: false, // 取消面试
      modifyInterviewVisible: false, // 修改面试
      cancelOfferVisible: false, // 修改offer
      orderInfo: {},
      operateMethod: null, // 操作类型
      userID: this.detail.pmId,
      initStatusNo: [
        { value: '11', label: '合格待审' },
        { value: '12', label: '不合格待审' },
        { value: '13', label: '待重推' },
        { value: '14', label: '已重复' },
        { value: '15', label: '不合格' },
        { value: '16', label: '待提交HR' },
        { value: '17', label: '取消推荐' },
        { value: '21', label: '待HR反馈' },
        { value: '22', label: '评估已通过' },
        { value: '23', label: '评估未通过' },
        { value: '31', label: '待猎头约面' },
        { value: '32', label: '约面成功' },
        { value: '33', label: '约面失败' },
        { value: '34', label: '已到面' },
        { value: '35', label: '面试未到' },
        { value: '36', label: '面试通过' },
        { value: '37', label: '面试未通过' },
        { value: '38', label: '面试取消' },
        { value: '41', label: '待发offer' },
        { value: '42', label: '已发offer' },
        { value: '44', label: '放弃offer' },
        { value: '51', label: '已到岗' },
        { value: '52', label: '放弃到岗' },
        { value: '61', label: '已过保' },
        { value: '62', label: '过保关闭' }
      ]
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    dictData() {
      return this.$store.state.common.dictData;
    },
    step() {
      console.log('no:', this.detail.statusNo)
      return parseInt(this.detail.statusNo.toString().slice(0, 1))
    }
  },
  methods: {
    reloadPage() {
      this.$emit('getDetail')
    },
    async sendMsg() {
      let title = ''
      await reportName({ id: this.detail.id }).then(res => {
        const { code, data } = res
        if (code === '000000') {
          title = data.reportTitle ? data.reportTitle : ''
        }
      })
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userID}`)
        .then(() => {
          this.dialogVisible = true
          const data = {
            type: 'order',
            orderId: this.detail.id,
            positionName: this.detail.positionName,
            company: this.detail.companyName,
            candidateName: this.detail.jobhunterName,
            candidateAvatar: this.detail.jobhunterAvatarUrl,
            reportName: title,
            desc: ''
          }
          const message = this.tim.createCustomMessage({
            to: this.toAccount,
            conversationType: this.currentConversationType,
            payload: {
              data: JSON.stringify(data),
              description: '',
              extension: ''
            }
          })
          setTimeout(() => {
            this.$store.commit('pushCurrentMessageList', message)
            this.tim.sendMessage(message).catch(error => {
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          }, 0)
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    handleBtn(order, method, flag) {
      this.orderInfo = order
      this.operateMethod = method
      if (order.statusNo === 11 ||
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
          this.reloadPage()
          if (method === 7) {
            this.$router.push({
              path: '/reviewReport',
              query: {
                positionId: order.positionId,
                companyId: order.companyId,
                reportId: order.companyId,
                resumeId: order.resumeId,
                orderId: order.id
              }
            })
          }
        }
      })
    },
    // 预览
    previewImg(title, url) {
      this.loadingImg = true
      this.previewVisible = true
      this.previewImgTitle = title
      this.previewImgUrl = url
    }
  }
}
</script>

<style lang="scss" scoped>
.el-drawer__wrapper {
  .order {
    background: #ffffff;
  }
}
.order {
  display: flex;
  justify-content: center;
  // height: 260px;
  padding: 20px 0;
  margin-bottom: 40px;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  .order-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    .order-left-id {
      font-size: 14px;
      color: #323232;
      line-height: 20px;
      margin-top: 20px;
    }
    .order-left-state {
      font-size: 24px;
      font-weight: 600;
      color: #ea2b3f;
      line-height: 33px;
      margin-top: 20px;
    }
    .order-left-consult {
      font-size: 14px;
      color: #1678f9;
      line-height: 20px;
      margin-top: 40px;
      cursor: pointer;
    }
    .order-left-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 20px;
      .el-button {
        font-size: 14px;
        color: #1678f9;
        line-height: 19px;
        border-color: #1678f9;
      }
      .el-button.is-round {
        padding: 4px 11px;
      }
      .el-button + .el-button {
        margin-left: 20px;
      }
    }
  }

  .order-right {
    width: 50%;
    padding: 0 20px 0 60px;
    box-sizing: border-box;
    background: url('~@/assets/images/order/dashed.png') repeat-y;
    p {
      font-size: 14px;
      color: #323232;
      line-height: 20px;
    }
    .order-right-title {
      font-weight: 600;
      margin-bottom: 20px;
    }
    .order-right-desc {
      display: flex;
      flex-direction: row;
      color: #808080;
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        display: inline-block;
        min-width: 75px;
      }
      &:last-child {
        margin: 0;
      }
    }
  }
}
.preview-modal {
    .preview-img {
      margin: 0 auto;
      max-width: 350px;
      display: block;
    }
  }
</style>
