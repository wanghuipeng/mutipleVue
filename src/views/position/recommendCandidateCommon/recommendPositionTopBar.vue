<template>
  <div class="wrap">
    <div class="top-info">
      <div class="user-info">
        <img
          v-if="renderInfo.detail.avatarImg"
          class="info-avatar"
          :src="renderInfo.detail.avatarImg"
        />
        <img
          v-else-if="renderInfo.detail.gender === 1"
          class="info-avatar"
          src="~@/assets/images/common/man_avatar.png"
        />
        <img
          v-else-if="renderInfo.detail.gender === 2"
          class="info-avatar"
          src="~@/assets/images/common/women_avatar.png"
        />
        <img v-else src="~@/assets/images/common/avatar.png" class="info-avatar" />
        <div class="info-main">
          <p class="main-title">
            <span class="title-name">{{ renderInfo.detail.name }}</span>
            <span
              class="title-sub"
            >{{ renderInfo.detail.liveCity | filterLevel2(dictData.areas) }} · {{ renderInfo.detail.gender | filterCommonDict(dictData.dicts.gender) }} · {{ renderInfo.detail.age }}岁 · 工作{{ renderInfo.detail.workMonth }} · {{ renderInfo.detail.advancedDegree | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
          </p>
          <p
            class="main-sub"
          >{{ renderInfo.detail.currentCompanyName }} · {{ renderInfo.detail.currentPosition }}</p>
        </div>
      </div>
      <div class="contact-info">
        <p class="info-main">
          <img class="main-icon" src="@/assets/images/position/hollow-phone-icon.png" />
          <span class="main-content">{{ renderInfo.detail.mobile }}</span>
        </p>
        <p class="info-main">
          <img class="main-icon" src="@/assets/images/position/hollow-email-icon.png" />
          <span class="main-content">{{ renderInfo.detail.email }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 简历信息
    resumeInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的简历信息
    renderInfo() {
      const data = Object.assign({}, this.resumeInfo)
      data.detail = data.detail || {}
      return data
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .top-info {
    display: flex;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    .user-info {
      flex: auto;
      display: flex;
      .info-avatar {
        display: block;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .info-main {
        .main-title {
          line-height: 28px;
          margin-bottom: 4px;
          .title-name {
            font-size: 18px;
            color: #323232ff;
            font-weight: 600;
            margin-right: 16px;
          }
          .title-sub {
            font-size: 14px;
            color: #7f7f7f;
          }
        }
        .main-sub {
          font-size: 14px;
          color: #7f7f7f;
        }
      }
    }
    .contact-info {
      width: 280px;
      margin-left: 20px;
      flex: none;
      .info-main {
        display: flex;
        height: 18px;
        line-height: 18px;
        &:first-child {
          margin-bottom: 16px;
        }
        .main-icon {
          display: block;
          width: 18px;
          height: 18px;
          margin-right: 16px;
        }
        .main-content {
          font-size: 14px;
          color: #7f7f7fff;
        }
      }
    }
  }
}
</style>

