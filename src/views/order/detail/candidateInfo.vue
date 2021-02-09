<template>
  <div class="info">
    <div class="time">
      <p><span>创建时间 </span>{{ detail.createTime | filterDateTime }}</p>
      <p v-if="detail.updateTime"><span>更新时间 </span>{{ detail.updateTime | filterDateTime }}</p>
    </div>
    <div class="user">
      <el-card v-if="detail.resumeInfo" class="user-item">
        <div @click="toResumeDetail">
          <img v-if="detail.resumeInfo.detail.avatarImg" :src="detail.resumeInfo.detail.avatarImg" class="user-item-img">
          <img v-else src="../../../assets/images/notice/avatar_unknown.png" class="user-item-img">
          <div class="user-item-desc">
            <p>{{ detail.jobhunterName }}（{{ detail.resumeInfo.detail.currentPosition }}）</p>
            <p>
              <span v-if="detail.resumeInfo.detail.liveProvince">{{ detail.resumeInfo.detail.liveProvince | filterCommonDict(dictData.areas) }}</span>
              <span v-if="detail.resumeInfo.detail.liveProvince && detail.resumeInfo.detail.gender" style="padding: 0 8px;">·</span>
              <span v-if="detail.resumeInfo.detail.gender">{{ detail.resumeInfo.detail.gender | filterArr(dictData.dicts.gender) }}</span>
              <span v-if="detail.resumeInfo.detail.gender || detail.resumeInfo.detail.age" style="padding: 0 8px;">·</span>
              <span v-if="detail.resumeInfo.detail.age">{{ detail.resumeInfo.detail.age }}岁</span>
              <span v-if="detail.resumeInfo.detail.age && detail.resumeInfo.detail.workMonth" style="padding: 0 8px;">·</span>
              <span v-if="detail.resumeInfo.detail.workMonth">{{ detail.resumeInfo.detail.workMonth }}</span>
              <span v-if="detail.resumeInfo.detail.workMonth && detail.resumeInfo.detail.degreeCode" style="padding: 0 8px;">·</span>
              <span v-if="detail.resumeInfo.detail.degreeCode">{{ detail.resumeInfo.detail.degreeCode | filterArr(resumeDict.degree) }}</span>
            </p>
          </div>
        </div>
      </el-card>
      <el-card v-if="detail.company" class="user-item">
        <div @click="toPositionDetail">
          <img v-if="detail.company.logo" :src="detail.company.logo" class="user-item-img">
          <img v-else src="../../../assets/images/notice/avatar_company.png" class="user-item-img">
          <div class="user-item-desc">
            <p>{{ detail.position.title }}</p>
            <p>{{ detail.company.shortName }}</p>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 流程 -->
    <!-- 推荐阶段 -->
    <div v-if="step === 1 || step === 2" class="flow">
      <div class="flow-item">
        <div class="flow-item-img" style="margin-left: 30px;">
          <img src="../../../assets/images/order/flow_wait.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc" style="left: 10px;">
          <p class="flow-item-desc-title">推荐</p>
          <p v-if="detail.candidateRecommendReport && detail.candidateRecommendReport.createTime" class="flow-item-desc-date">{{ detail.candidateRecommendReport.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">面试</p>
          <p v-if="detail.candidateInterviewList[0] && detail.candidateInterviewList[0].createTime" class="flow-item-desc-date">{{ detail.candidateInterviewList[0].createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">offer</p>
          <p v-if="detail.candidateOffer && detail.candidateOffer.createTime" class="flow-item-desc-date">{{ detail.candidateOffer.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">到岗</p>
          <p v-if="detail.arrivalDate" class="flow-item-desc-date">{{ detail.arrivalDate | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
        </div>
        <div class="flow-item-desc" style="width: 76px;">
          <p class="flow-item-desc-title">过保</p>
          <p v-if="detail.overdueDate" class="flow-item-desc-date">{{ detail.overdueDate | filterDate }}</p>
        </div>
      </div>
    </div>

    <!-- 面试阶段 -->
    <div v-if="step === 3" class="flow">
      <div class="flow-item">
        <div class="flow-item-img" style="margin-left: 30px;">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc" style="left: 10px;">
          <p class="flow-item-desc-title">推荐</p>
          <p v-if="detail.candidateRecommendReport && detail.candidateRecommendReport.createTime" class="flow-item-desc-date">{{ detail.candidateRecommendReport.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_wait.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">面试</p>
          <p v-if="detail.candidateInterviewList[0] && detail.candidateInterviewList[0].createTime" class="flow-item-desc-date">{{ detail.candidateInterviewList[0].createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">offer</p>
          <p v-if="detail.candidateOffer && detail.candidateOffer.createTime" class="flow-item-desc-date">{{ detail.candidateOffer.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">到岗</p>
          <p v-if="detail.arrivalDate" class="flow-item-desc-date">{{ detail.arrivalDate | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
        </div>
        <div class="flow-item-desc" style="width: 76px;">
          <p class="flow-item-desc-title">过保</p>
          <p v-if="detail.overdueDate" class="flow-item-desc-date">{{ detail.overdueDate | filterDate }}</p>
        </div>
      </div>
    </div>

    <!-- offer阶段 -->
    <div v-if="step === 4" class="flow">
      <div class="flow-item">
        <div class="flow-item-img" style="margin-left: 30px;">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc" style="left: 10px;">
          <p class="flow-item-desc-title">推荐</p>
          <p v-if="detail.candidateRecommendReport && detail.candidateRecommendReport.createTime" class="flow-item-desc-date">{{ detail.candidateRecommendReport.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">面试</p>
          <p v-if="detail.candidateInterviewList[0] && detail.candidateInterviewList[0].createTime" class="flow-item-desc-date">{{ detail.candidateInterviewList[0].createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_wait.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">offer</p>
          <p v-if="detail.candidateOffer && detail.candidateOffer.createTime" class="flow-item-desc-date">{{ detail.candidateOffer.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">到岗</p>
          <p v-if="detail.arrivalDate" class="flow-item-desc-date">{{ detail.arrivalDate | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
        </div>
        <div class="flow-item-desc" style="width: 76px;">
          <p class="flow-item-desc-title">过保</p>
          <p v-if="detail.overdueDate" class="flow-item-desc-date">{{ detail.overdueDate | filterDate }}</p>
        </div>
      </div>
    </div>

    <!-- 到岗阶段 -->
    <div v-if="step === 5" class="flow">
      <div class="flow-item">
        <div class="flow-item-img" style="margin-left: 30px;">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc" style="left: 10px;">
          <p class="flow-item-desc-title">推荐</p>
          <p v-if="detail.candidateRecommendReport && detail.candidateRecommendReport.createTime" class="flow-item-desc-date">{{ detail.candidateRecommendReport.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">面试</p>
          <p v-if="detail.candidateInterviewList[0] && detail.candidateInterviewList[0].createTime" class="flow-item-desc-date">{{ detail.candidateInterviewList[0].createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">offer</p>
          <p v-if="detail.candidateOffer && detail.candidateOffer.createTime" class="flow-item-desc-date">{{ detail.candidateOffer.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_wait.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">到岗</p>
          <p v-if="detail.arrivalDate" class="flow-item-desc-date">{{ detail.arrivalDate | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_unchecked.png" class="flow-item-img-icon">
        </div>
        <div class="flow-item-desc" style="width: 76px;">
          <p class="flow-item-desc-title">过保</p>
          <p v-if="detail.overdueDate" class="flow-item-desc-date">{{ detail.overdueDate | filterDate }}</p>
        </div>
      </div>
    </div>

    <!-- 过保阶段 -->
    <div v-if="step === 6" class="flow">
      <div class="flow-item">
        <div class="flow-item-img" style="margin-left: 30px;">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc" style="left: 10px;">
          <p class="flow-item-desc-title">推荐</p>
          <p v-if="detail.candidateRecommendReport && detail.candidateRecommendReport.createTime" class="flow-item-desc-date">{{ detail.candidateRecommendReport.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">面试</p>
          <p v-if="detail.candidateInterviewList[0] && detail.candidateInterviewList[0].createTime" class="flow-item-desc-date">{{ detail.candidateInterviewList[0].createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">offer</p>
          <p v-if="detail.candidateOffer && detail.candidateOffer.createTime" class="flow-item-desc-date">{{ detail.candidateOffer.createTime | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_success.png" class="flow-item-img-icon">
          <img src="../../../assets/images/order/flow_dashed_active.png" class="flow-item-img-line">
        </div>
        <div class="flow-item-desc">
          <p class="flow-item-desc-title">到岗</p>
          <p v-if="detail.arrivalDate" class="flow-item-desc-date">{{ detail.arrivalDate | filterDate }}</p>
        </div>
      </div>
      <div class="flow-item">
        <div class="flow-item-img">
          <img src="../../../assets/images/order/flow_wait.png" class="flow-item-img-icon">
        </div>
        <div class="flow-item-desc" style="width: 76px;">
          <p class="flow-item-desc-title">过保</p>
          <p v-if="detail.overdueDate" class="flow-item-desc-date">{{ detail.overdueDate | filterDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import resumeDict from '@/assets/js/resume'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resumeDict: []
    }
  },
  computed: {
    dictData() {
      return this.$store.state.common.dictData;
    },
    step() {
      return parseInt(this.detail.statusNo.toString().slice(0, 1))
    }
  },
  mounted() {
    this.resumeDict = resumeDict
  },
  methods: {
    toResumeDetail() {
      window.open(`/resumeDetail?id=${this.detail.resumeId}`)
    },
    toPositionDetail() {
      window.open(`/positionDetail?positionId=${this.detail.position.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .time {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    color: #989898;
    line-height: 20px;
    p {
      margin-right: 40px;
    }
  }
	.user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 40px;
		.user-item {
      width: 48.75%;
      height: 98px;
      border-radius: 8px;
      cursor: pointer;
      overflow: hidden;
			.user-item-img {
        float: left;
				width: 60px;
				height: 60px;
        margin-right: 12px;
        object-fit: scale-down;
			}
			.user-item-desc {
        float: left;
        width: 260px;
        p:first-child {
          font-size: 20px;
          color: #191919;
          line-height: 28px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p:last-child {
          font-size: 14px;
          color: #808080;
          line-height: 20px;
          margin-top: 8px;
        }
			}
		}
  }
  .flow {
    display: flex;
    flex-direction: row;
    justify-content: center;
		padding: 60px 0;
		overflow: hidden;
		.flow-item {
      float: left;
      height: 96px;
			text-align: center;
      font-size: 13px;
      position: relative;
			.flow-item-img {
        display: flex;
        flex-direction: row;
        align-items: center;
        .flow-item-img-icon {
          width: 32px;
          height: 32px;
        }
				.flow-item-img-line {
          width: 120px;
          height: 1px;
          padding: 0 8px;
        }
      }
      .flow-item-desc {
        position: absolute;
        top: 32px;
        left: -22px;
        .flow-item-desc-title {
          width: 76px;
          font-size: 20px;
          color: #191919;
          line-height: 28px;
          margin-top: 12px;
        }
        .flow-item-desc-date {
          font-size: 14px;
          color: #B2B2B2;
          line-height: 20px;
          margin-top: 4px;
        }
      }
		}
	}
}
</style>
