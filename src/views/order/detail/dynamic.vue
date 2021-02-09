<template>
  <div class="dynamic">
    <div v-for="(item, index) in list" :key="index" class="steps">
      <p class="steps-date">{{ item.createTime }}</p>
      <div class="steps-info">
        <p class="steps-info-title">{{ item.description }}</p>
        <!-- <p class="steps-info-time">过保时间：2019-11-4</p> -->
        <template v-if="item.operateMethod === 13">
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">邀请面试：{{ item.candidateInterviewDTO.plannedInterviewTime }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试地点：{{ item.candidateInterviewDTO.interviewProvince }}{{ item.candidateInterviewDTO.interviewCity }}{{ item.candidateInterviewDTO.interviewAddress }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">联系人：{{ item.candidateInterviewDTO.contactName }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">联系号码：{{ item.candidateInterviewDTO.contactMobile }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试官：{{ item.candidateInterviewDTO.interviewerName }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试方式：{{ item.candidateInterviewDTO.interviewMethod }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">温馨提示：{{ item.candidateInterviewDTO.description }}</p>
        </template>
        <template v-if="item.operateMethod === 17 || item.operateMethod === 20">
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">邀面时间：{{ item.candidateInterviewDTO.plannedInterviewTime }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试地点：{{ item.candidateInterviewDTO.interviewProvince }}{{ item.candidateInterviewDTO.interviewCity }}{{ item.candidateInterviewDTO.interviewAddress }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">联系人：{{ item.candidateInterviewDTO.contactName }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">联系号码：{{ item.candidateInterviewDTO.contactMobile }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试官：{{ item.candidateInterviewDTO.interviewerName }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">面试方式：{{ item.candidateInterviewDTO.interviewMethod }}</p>
          <p v-if="item.candidateInterviewDTO" class="steps-info-desc">温馨提示：{{ item.candidateInterviewDTO.description }}</p>
        </template>
        <template v-if="item.operateMethod === 22 || item.operateMethod === 25">
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">到岗时间：{{ item.candidateOfferDTO.plannedArrivaDate }}</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">到岗地点：{{ item.candidateOfferDTO.offerCity }}{{ item.candidateOfferDTO.offerAddress }}</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">offer年薪：{{ item.candidateOfferDTO.yearlySalary }}元</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">试用期：{{ item.candidateOfferDTO.probationPeriod }}个月</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">联系人：{{ item.candidateOfferDTO.contactName }}</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">联系号码：{{ item.candidateOfferDTO.contactMobile }}</p>
          <p v-if="item.candidateOfferDTO" class="steps-info-desc">温馨提示：{{ item.candidateOfferDTO.description }}</p>
        </template>
        <template v-if="item.operateMethod === 26 || item.operateMethod === 27 || item.operateMethod === 30 || item.operateMethod === 32">
          <p v-if="item.candidateDTO" class="steps-info-desc">实际到岗时间：{{ item.candidateDTO.arrivaDate }}</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">保证期：{{ item.candidateDTO.guaranteePeriod }}个月</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">过保日期：{{ item.candidateDTO.overdueDate }}</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">岗位年薪：{{ item.candidateDTO.positionAnnualSalary }}元</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">佣金金额：{{ item.candidateDTO.pcommissionAmount }}个月</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">猎头分成比例：{{ item.candidateDTO.hhCommissionRatio }}</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">猎头分成：{{ item.candidateDTO.hhCommissionAmount }}</p>
          <p v-if="item.candidateDTO" class="steps-info-desc">温馨提示：{{ item.candidateDTO.description }}</p>
        </template>
        <template v-else>
          <p v-if="item.remarks" class="steps-info-desc">备注说明：{{ item.remarks }}</p>
        </template>
      </div>
    </div>
    <div v-if="list.length <= 0" class="empty">
      <img src="../../../assets/images/order/blank.png" />
      <p>暂无订单动态</p>
    </div>
  </div>
</template>

<script>
import { dynamicList } from '@/api/order'
export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [], // 动态列表
      status: [
        { value: 1, label: '创建订单' }, { value: 2, label: '取消推荐' },
        { value: 3, label: '添加反馈' }, { value: 4, label: '审核通过' },
        { value: 5, label: '审核不通过' }, { value: 6, label: '打回重推' },
        { value: 7, label: '重新提交' }, { value: 8, label: '捞回' },
        { value: 9, label: '提交HR' }, { value: 10, label: '查重打回' },
        { value: 11, label: '评估不通过' }, { value: 12, label: '评估通过' },
        { value: 13, label: '发起面试' }, { value: 14, label: '安排面试' },
        { value: 15, label: '猎头取消面试' }, { value: 16, label: '后台取消面试' },
        { value: 17, label: '面试调整' }, { value: 18, label: '面试到达' },
        { value: 19, label: '面试未到' }, { value: 20, label: '发起下一轮面试' },
        { value: 21, label: '准备offer' }, { value: 22, label: '发布offer' },
        { value: 23, label: '面试通过' }, { value: 24, label: '面试未通过' },
        { value: 25, label: 'OFFER调整' }, { value: 26, label: '提前到岗' },
        { value: 27, label: '确认到岗' }, { value: 28, label: '确认未到岗' },
        { value: 29, label: '放弃OFFER' }, { value: 30, label: '确认过保' },
        { value: 31, label: '确认未过保' }, { value: 32, label: '更新过保' }
      ]
    }
  },
  created() {
    this.getDynamic()
  },
  methods: {
    getDynamic() {
      dynamicList({ candidateId: this.id }).then(res => {
        if (res.code === '000000') {
          this.list = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic {
  padding: 0 20px;
  .steps {
    margin-top: 20px;
    .steps-date {
      position: relative;
      padding-left: 40px;
      font-size: 16px;
      line-height: 22px;
      color: #4D4D4D;
      &::after {
        content: '';
        width: 16px;
        height: 16px;
        border: 2px solid #7E7E7E;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .steps-info {
      width: 100%;
      padding: 12px 0 20px 32px;
      margin: 4px 9.5px;
      background: url('~@/assets/images/order/dashed1.png') repeat-y;
      .steps-info-title {
        font-size: 16px;
        font-weight: 600;
        color:#323232;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .steps-info-time, .steps-info-desc {
        font-size: 14px;
        color:#808080;
        line-height: 20px;
      }
    }
    &:last-child .steps-info {
      padding: 12px 0 0 32px;
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
      color: #B3B3B3;
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
