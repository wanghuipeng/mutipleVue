<template>
  <div
    class="conversation-item-container"
    :class="{ 'choose': conversation.conversationID === currentConversation.conversationID }"
    @click="selectConversation"
  >
    <!-- <div class="close-btn">
      <span class="tim-icon-close" title="删除会话" @click="deleteConversation" />
    </div> -->
    <div class="warp">
      <avatar :src="avatar" :type="conversation.type" :user="conversation.userProfile" />
      <div class="content">
        <div class="row-1">
          <div class="name">
            <div class="text-ellipsis">
              <span
                v-if="conversation.type === TIM.TYPES.CONV_C2C"
                :title="conversation.userProfile.nick || conversation.userProfile.userID"
              >{{ conversation.userProfile.nick || conversation.userProfile.userID }}</span>
              <span
                v-else-if="conversation.type === TIM.TYPES.CONV_GROUP"
                :title="conversation.groupProfile.name || conversation.groupProfile.groupID"
              >{{ conversation.groupProfile.name || conversation.groupProfile.groupID }}</span>
              <span v-else-if="conversation.type === TIM.TYPES.CONV_SYSTEM">系统通知</span>
              <span v-if="conversation.userProfile.customRole" class="label">{{ conversation.userProfile.customRole }}</span>
            </div>
          </div>
          <div class="unread-count">
            <span v-if="conversation.unreadCount > 0" class="badge">
              <template v-if="conversation.unreadCount > 99">···</template>
              <template v-else>{{ conversation.unreadCount }}</template>
            </span>
          </div>
          <div class="date">{{ date }}</div>
        </div>
        <div class="row-2">
          <div class="summary">
            <div v-if="conversation.lastMessage" class="text-ellipsis">
              <span v-if="hasMessageAtMe" class="remind" style="color:red;">[有人提到我]</span>
              <span
                class="text"
                :title="messageForShow"
              >{{ messageForShow }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { isToday, isYesterday, isTishYear, getDate, getTime } from '../../utils/date'
export default {
  name: 'ConversationItem',
  props: ['conversation'],
  data() {
    return {
      popoverVisible: false,
      hasMessageAtMe: false
    }
  },
  computed: {
    showUnreadCount() {
      // 是否显示未读计数。当前会话和未读计数为0的会话，不显示。
      return (
        this.currentConversation.conversationID !==
          this.conversation.conversationID && this.conversation.unreadCount > 0
      )
    },
    date() {
      if (
        !this.conversation.lastMessage ||
        !this.conversation.lastMessage.lastTime
      ) {
        return ''
      }
      const date = new Date(this.conversation.lastMessage.lastTime * 1000)
      if (isToday(date)) {
        return getTime(date)
      }
      if (isTishYear(date)) {
        if (isYesterday(date)) {
          return '昨天'
        }
        return getDate(date).split('-')[1] + '-' + getDate(date).split('-')[2]
      } else {
        return getDate(date).split('-')[0] + '-' + getDate(date).split('-')[1]
      }
      return getDate(date).split('-')[0] + '-' + getDate(date).split('-')[1]
    },
    avatar: function() {
      switch (this.conversation.type) {
        case 'GROUP':
          return this.conversation.groupProfile.avatar
        case 'C2C':
          return this.conversation.userProfile.avatar
        default:
          return ''
      }
    },
    conversationName: function() {
      if (this.conversation.type === this.TIM.TYPES.CONV_C2C) {
        return (
          this.conversation.userProfile.nick ||
          this.conversation.userProfile.userID
        )
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_GROUP) {
        return (
          this.conversation.groupProfile.name ||
          this.conversation.groupProfile.groupID
        )
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_SYSTEM) {
        return '系统通知'
      }
      return ''
    },
    showGrayBadge() {
      if (this.conversation.type !== this.TIM.TYPES.CONV_GROUP) {
        return false
      }
      return (
        this.conversation.groupProfile.selfInfo.messageRemindType ===
        'AcceptNotNotify'
      )
    },
    messageForShow() {
      if (this.conversation.lastMessage.type === 'TIMFileElem') {
        return `[${this.conversation.lastMessage.payload.fileName}]`
      } else if (this.conversation.lastMessage.type === 'TIMAudioElem') {
        return '[语音消息]'
      } else if (this.conversation.lastMessage.type === 'TIMCustomElem') {
        const payload = this.isJSON(this.conversation.lastMessage.payload.data)
        ? JSON.parse(this.conversation.lastMessage.payload.data)
        : this.conversation.lastMessage.payload.data
        if (payload.type === 'position') {
          return `[职位-${payload.positionName}]`
        } else if (payload.type === 'order') {
          return `[订单-${payload.reportName}]`
        } else if (payload.type === 'resume') {
          return `[简历-${payload.resumeName}]`
        }

        // 视频消息解析
        if (payload.action === 0) {
          return `正在呼叫`
        } else if (payload.action === 1) {
          return `取消通话`
        } else if (payload.action === 2) {
          return `拒绝通话`
        } else if (payload.action === 3) {
          return `无人接听`
        } else if (payload.action === 4 || payload.action === 5) {
          return `结束通话，通话时长${payload.duration}秒`
        } else if (payload.action === 6) {
          return `正在通话中`
        }
      }
      return this.conversation.lastMessage.messageForShow
    },
    ...mapState({
      currentConversation: state => state.conversation.currentConversation
    }),
    ...mapGetters(['toAccount'])
  },
  watch: {
    currentConversation(next) {
      if (next.conversationID === this.conversation.conversationID) {
        this.hasMessageAtMe = false
      }
    }
  },
  mounted() {
    this.$bus.$on('new-messsage-at-me', event => {
      if (
        event.data.conversationID === this.conversation.conversationID &&
        this.conversation.conversationID !==
          this.currentConversation.conversationID
      ) {
        this.hasMessageAtMe = true
      }
    })
  },
  methods: {
    selectConversation() {
      this.$store.commit('updateShowOrder', false)
      this.$store.commit('updateShowPosition', false)
      if (
        this.conversation.conversationID !==
        this.$store.state.conversation.currentConversation.conversationID
      ) {
        this.$store.dispatch(
          'checkoutConversation',
          this.conversation.conversationID
        )
      }
      this.tim.getConversationList().then(res => {
        const list = res.data.conversationList
        let num = 0
        list.map(item => {
          num += item.unreadCount
        })
        this.$store.commit('setUnreadCount', num)
      })
    },
    deleteConversation(event) {
      // 停止冒泡，避免和点击会话的事件冲突
      event.stopPropagation()
      this.tim
        .deleteConversation(this.conversation.conversationID)
        .then(() => {
          this.$store.commit('showMessage', {
            message: `会话【${this.conversationName}】删除成功!`,
            type: 'success'
          })
          this.popoverVisible = false
          this.$store.commit('resetCurrentConversation')
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            message: `会话【${this.conversationName}】删除失败!, error=${error.message}`,
            type: 'error'
          })
          this.popoverVisible = false
        })
    },
    showContextMenu() {
      this.popoverVisible = true
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.conversation-item-container {
  width: 100%;
  padding: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
  border-bottom: 1px solid #E5E5E5;
  box-sizing: border-box;

  // &:first-child
  // padding-top 30px
  &:hover {
    background-color: #F7F7F7;

    .close-btn {
      right: 3px;
    }
  }

  .close-btn {
    position: absolute;
    right: -20px;
    top: 3px;
    color: $font-dark;
    transition: all 0.2s ease;

    &:hover {
      color: $danger;
    }
  }

  .warp {
    display: flex;
    align-items center;
  }

  .avatar {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    height: 54px;
    overflow: hidden;

    .row-1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      line-height: 28px;
      margin-bottom: 4px;
      .text-ellipsis {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        color: #4D4D4D;
        flex: 1;
        min-width: 0px;
        .label {
          margin-left 20px;
          padding 3px 9px;
          font-size 14px;
          line-height 20px;
          color: #FFFFFF;
          background: #1678F9;
          border-radius 5px;
          opacity: 0.5;
        }
      }

      .unread-count {
        padding-left: 10px;
        flex-shrink: 0;
        color: $font-dark;
        font-size: 12px;
        position: absolute;
        left: 44px;
        top: 25px;

        .badge {
          vertical-align: bottom;
          background-color: $danger;
          border-radius: 10px;
          color: #FFF;
          display: inline-block;
          font-size: 12px;
          height: 18px;
          max-width: 25px;
          line-height: 18px;
          padding: 0 6px;
          text-align: center;
          white-space: nowrap;
        }
      }

      .date {
        font-size: 12px;
        color: #B2B2B2;
        line-height: 17px;
      }
    }

    .row-2 {
      display: flex;
      font-size: 16px;
      line-height: 22px;
      color: #808080;

      .summary {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        min-width: 0px;
        .text-ellipsis {
          flex: 1;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.choose {
  background-color: #F7F7F7;
}

.context-menu-button {
  padding: 10px;
  border: 2px solid $primary;
  border-radius: 8px;
}
</style>
