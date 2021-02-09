<template>
  <div class="wrap-box">
    <!-- 分析师信息 -->
    <div class="teacher-info">
      <div class="info-avatar">
        <img :src="renderInfo.avatarImg" />
      </div>
      <div class="info-main">
        <p class="main-title">
          <span class="title-name">{{ renderInfo.nickName }}（PM）</span>
        </p>
        <p class="main-sub">
          <!--<span>{{ renderInfo.englishName }}</span>-->
          <span>电话：{{ renderInfo.mobile }}</span>
          <span>邮箱：{{ renderInfo.email }}</span>
        </p>
      </div>
      <div class="info-btn">
        <el-button v-if="renderInfo.isFollow" class="confirm-btn" @click="cancelFollow">取消关注</el-button>
        <el-button v-else class="cancel-btn" @click="handleFollow">关注</el-button>
        <el-button class="cancel-btn" @click="sendMsg">在线沟通</el-button>
      </div>
    </div>
    <!-- tab切换 -->
    <el-tabs v-model="tab">
      <el-tab-pane :label="'精品职位（' + renderInfo.positionBoutiqueCount + '）'" name="taRecord">
        <ta-record :user-info="userInfo" />
      </el-tab-pane>
      <el-tab-pane :label="'全部职位（' + renderInfo.positionCount + '）'" name="allPosition">
        <all-position :user-info="userInfo" />
      </el-tab-pane>
    </el-tabs>
    <!-- 聊天 -->
    <dialog-chat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import dialogChat from '@/components/common/dialogChat.vue'
import taRecord from './deliverDetailTab/taRecord'
import allPosition from './deliverDetailTab/allPosition'
import { getUserDetail, followCw, deleteUserFollowCW } from '@/api/position'
export default {
  components: {
    dialogChat,
    taRecord,
    allPosition
  },
  data() {
    return {
      // 默认展示TAB
      tab: this.$route.query.tab || 'taRecord',
      // 聊天对话框是否显示
      dialogVisible: false,
      // 分析师信息
      userInfo: {
        id: this.$route.query.userId
      }
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的分析师信息
    renderInfo() {
      const data = Object.assign({}, this.userInfo)
      return data
    }
  },
  mounted() {
    document.title = '分析师主页-大猎英才'
    // 查询分析师信息
    this.queryUserInfo()
  },
  methods: {
    // 关注
    handleFollow() {
      const para = {}
      para.dataId = this.userInfo.id
      followCw(para).then(res => {
        this.$set(this.userInfo, 'isFollow', true)
      })
    },
    // 取消关注
    cancelFollow() {
      const para = {}
      para.dataId = this.userInfo.id
      deleteUserFollowCW(para).then(res => {
        this.$set(this.userInfo, 'isFollow', false)
      })
    },
    // 在线沟通
    sendMsg() {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userInfo.id}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 查询分析师信息
    queryUserInfo() {
      const para = {}
      para.cwUserId = this.userInfo.id
      getUserDetail(para).then(res => {
        this.userInfo = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/common/imgShadow.scss';
@import '@/assets/sass/position/common.scss';
.wrap-box {
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 180px;
    position: absolute;
    left: 0;
    top: 44px;
    background-color: #ecececff;
  }
  .teacher-info {
    display: flex;
    padding: 20px 0 60px;
    position: relative;
    z-index: 10;
    .info-avatar {
      @include imgShadow(100px, 100px, 8px, 1px 2px 6px 0px rgba(0, 0, 0, 0.2));
    }
    .info-main {
      flex: auto;
      padding: 0 20px;
      .main-title {
        height: 42px;
        line-height: 42px;
        padding-top: 7px;
        margin-bottom: 16px;
        .title-name {
          font-size: 30px;
          color: #000000ff;
          font-weight: bold;
        }
      }
      .main-sub {
        font-size: 16px;
        color: #7f7f7f;
        span {
          margin-right: 20px;
        }
      }
    }
    .info-btn {
      padding: 10px 0;
      width: 100px;
      .el-button {
        width: 100px;
        text-align: center;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        font-size: 16px;
        margin: 5px 0;
      }
    }
  }
  .el-tabs {
    ::v-deep .el-tabs__header {
      margin-bottom: 10px;
      .el-tabs__item {
        line-height: 28px;
        font-size: 18px;
        color: #808080ff;
        &.is-active {
          color: $main-color;
        }
      }
      .el-tabs__active-bar {
        background-color: $main-color;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #b3b3b3ff;
      }
    }
  }
}
</style>

