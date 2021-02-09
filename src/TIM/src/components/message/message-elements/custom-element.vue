<template>
  <message-bubble :is-mine="isMine">
    <div class="custom-element-wrapper">
      <div v-if="payload.data === 'survey'" class="bill">
        <!-- <p class="bill-title">提现到账通知</p>
        <div class="bill-desc">
          <p>您的提现申请已于2019-11-22到账，请查收：</p>
          <p>账单金额：20272.06元</p>
          <p>账单编号：393033889EEE</p>
        </div>-->
      </div>
      <div v-else-if="customData.type === 'order'" @click="toOrder(customData)">
        <div v-if="customData.desc" class="desc">{{ customData.desc }}</div>
        <div class="custom order">
          <img
            v-if="customData.candidateAvatar"
            :src="customData.candidateAvatar"
            class="custom-left"
          />
          <img
            v-else
            src="../../../../../assets/images/notice/avatar_unknown.png"
            class="custom-left"
          />
          <div class="custom-right">
            <p class="custom-right-title">{{ customData.candidateName }}</p>
            <p class="custom-right-position">
              {{ customData.company }}
              <span v-if="customData.positionName" />
              {{ customData.positionName }}
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="customData.type === 'position'" @click="toPosition(customData)">
        <div v-if="customData.desc" class="desc">{{ customData.desc }}</div>
        <div class="custom">
          <img v-if="customData.companyLogo" :src="customData.companyLogo" class="custom-left" />
          <img
            v-else
            src="../../../../../assets/images/notice/avatar_company.png"
            class="custom-left"
          />
          <div class="custom-right">
            <p class="custom-right-title">{{ customData.positionName }}</p>
            <p class="custom-right-position">
              {{ customData.company }}
              <span v-if="customData.industry1" />
              {{ customData.industry1 | filterCommonDict(dictData.industry) }}
              <span
                v-if="customData.industry2"
              />
              {{ customData.industry2 | filterLevel2(dictData.industry) }}
              <span
                v-if="customData.phase"
              />
              {{ customData.phase | filterArr(dictData.dicts.financing) }}
              <!-- <span
                v-if="customData.minSalary || customData.maxSalary"
              />
              {{ customData.minSalary }}-{{ customData.maxSalary }}万 -->
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="customData.type === 'resume'" @click="toResumePage(customData.resumeId)">
        <div v-if="customData.desc" class="desc">{{ customData.desc }}</div>
        <div class="custom order">
          <img
            v-if="customData.resumeAvatar"
            :src="customData.resumeAvatar"
            class="custom-left"
          />
          <img
            v-else
            src="../../../../../assets/images/notice/avatar_unknown.png"
            class="custom-left"
          />
          <div class="custom-right">
            <p class="custom-right-title">{{ customData.resumeName }}</p>
            <p class="custom-right-position">
              {{ customData.liveCity }}
              <span v-if="customData.age" />
              {{ customData.age }}岁
              <span v-if="customData.degreeCode" />
              {{ customData.degreeCode }}
              <span v-if="customData.workMonth" />
              {{ customData.workMonth }}
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="customData.action || customData.action === 0">
        <p v-if="customData.action === 0">正在呼叫</p>
        <p v-else>{{ customData.action | filterArr(actions) }}</p>
      </div>
      <span v-else class="text" title="您可以自行解析自定义消息">{{ text }}</span>
    </div>
  </message-bubble>
</template>

<script>
import MessageBubble from '../message-bubble'
export default {
  name: 'CustomElement',
  components: {
    MessageBubble
  },
  props: {
    payload: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  data() {
    return {
      actions: [
        { label: '正在呼叫', value: 0 },
        { label: '取消通话', value: 1 },
        { label: '拒绝通话', value: 2 },
        { label: '无人接听', value: 3 },
        { label: '通话结束', value: 4 },
        { label: '通话结束', value: 5 },
        { label: '正在通话中', value: 6 }
      ]
    }
  },
  computed: {
    dictData() {
      return this.$store.state.common.dictData
    },
    text() {
      return this.translateCustomMessage(this.payload)
    },
    customData() {
      return this.isJSON(this.payload.data)
        ? JSON.parse(this.payload.data)
        : this.payload.data
    }
  },
  methods: {
    toOrder(order) {
      window.open(`/orderDetail?orderId=${order.orderId}`)
      // this.$router.push({
      //   path: '/orderDetail',
      //   query: {
      //     orderId: order.orderId
      //   }
      // })
    },
    toPosition(position) {
      window.open(`/positionDetail?positionId=${position.positionId}`)
      // this.$router.push({
      //   path: '/positionDetail',
      //   query: {
      //     positionId: position.positionId
      //   }
      // })
    },
    translateCustomMessage(payload) {
      if (payload.data === 'group_create') {
        return `${payload.extension}`
      }
      return '[自定义消息]'
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.text {
  // font-weight: bold;
}

.title {
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 10px;
}

.desc {
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  margin-bottom: 12px;
}

.custom {
  display: flex;
  flex-direction: row;
  width: 328px;
  height: 80px;
  border: 1px solid #1E75FF;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
  background: #FFFFFF;
  cursor: pointer;

  .custom-left {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 4px;
  }

  .custom-right {
    flex: 1;
    display: flex;
    flex-direction: column;

    p {
      width: 225px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .custom-right-title {
      font-size: 16px;
      color: #323232;
      line-height: 22px;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .custom-right-position {
      font-size: 12px;
      color: #4d4d4d;
      line-height: 17px;

      span {
        display: inline-block;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #4d4d4d;
        margin: 3px 4px;
      }
    }
  }
}

.order {
  img {
    border-radius: 50%;
  }
}

.bill {
  width: 330px;

  p {
    font-size: 16px;
    line-height: 24px;
  }

  .bill-title {
    font-weight: 1000;
    color: #333333;
    margin-bottom: 12px;
  }

  .bill-desc {
    color: #808080;
  }
}

.openProfile {
  .custom {
    width: 274px;

    p {
      width: 182px;
    }
  }

  .bill {
    width: 274px;
  }
}

.suggestion {
  padding-top: 10px;
  font-size: 14px;
}
</style>
