<template>
  <div class="container">
    <div
      v-loading="showLoading"
      class="loading"
      element-loading-text="正在拼命初始化..."
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="chat-wrapper" style="position">
        <el-row>
          <el-col :xs="10" :sm="10" :md="8" :lg="8" :xl="7" class="chat-wrapper-left">
            <side-bar />
          </el-col>
          <el-col :xs="14" :sm="14" :md="16" :lg="16" :xl="17" class="chat-wrapper-right">
            <current-conversation />
          </el-col>
        </el-row>
      </div>
      <call-layer ref="callLayer" class="chat-wrapper"/>
    </div>
    <div class="bg">
    </div>
  </div>
</template>

<script>
import SideBar from '@/TIM/src/components/layout/side-bar'
import CurrentConversation from '@/TIM/src/components/conversation/current-conversation'
import { mapState, mapMutations } from 'vuex'
import { translateGroupSystemNotice } from '@/TIM/src/utils/common'
import MTA from '@/TIM/src/utils/mta'
import CallLayer from '@/TIM/src/components/message/call-layer'
export default {
  components: {
    SideBar,
    CurrentConversation,
    CallLayer
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      btnLoading: state => state.demo.btnLoading,
      currentUserProfile: state => state.user.currentUserProfile,
      currentConversation: state => state.conversation.currentConversation,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      userInfo: state => state.userInfo
    }),
    // 是否显示 Loading 状态
    showLoading() {
      return !this.isSDKReady
    }
  },
  watch: {
    isLogin(next) {
      if (next) {
        MTA.clickStat('link_two', { show: 'true' })
      }
    }
  },
  mounted() {
    // 初始化监听器
    this.initListener()
  },
  methods: {
    ...mapMutations(['setLoginDialog']),
    // TIM---使用
    initListener() {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
      // SDK NOT READT
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this)
      // 被踢出
      this.tim.on(this.TIM.EVENT.KICKED_OUT, () => {
        this.$store.commit('showMessage', {
          message: '被踢出，请重新登录。',
          type: 'error'
        })
        this.$store.commit('toggleIsLogin', false)
        this.$store.commit('reset')
      })
      // SDK内部出错
      this.tim.on(this.TIM.EVENT.ERROR, this.onError)
      // 收到新消息
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
      // 会话列表更新
      this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
        this.$store.commit('updateConversationList', event.data)
      })
      // 群组列表更新
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, event => {
        this.$store.commit('updateGroupList', event.data)
      })
      // 收到新的群系统通知
      this.tim.on(this.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, event => {
        const isKickedout = event.data.type === 4
        const isCurrentConversation =
          `GROUP${event.data.message.payload.groupProfile.groupID}` ===
          this.currentConversation.conversationID
        // 在当前会话被踢，需reset当前会话
        if (isKickedout && isCurrentConversation) {
          this.$store.commit('resetCurrentConversation')
        }
        Notification({
          title: '新系统通知',
          message: translateGroupSystemNotice(event.data.message),
          duration: 3000,
          onClick: () => {
            const SystemConversationID = '@TIM#SYSTEM'
            this.$store.dispatch('checkoutConversation', SystemConversationID)
          }
        })
      })
    },
    onReceiveMessage({ data: messageList }) {
      this.handleAt(messageList)
      this.$store.commit('pushCurrentMessageList', messageList)
    },
    onError({ data }) {
      if (data.message !== 'Network Error') {
        this.$store.commit('showMessage', {
          message: data.message,
          type: 'error'
        })
      }
    },
    onReadyStateUpdate({ name }) {
      const isSDKReady = name === this.TIM.EVENT.SDK_READY
      this.$store.commit('toggleIsSDKReady', isSDKReady)
      if (isSDKReady) {
        this.tim
          .getMyProfile()
          .then(({ data }) => {
            this.$store.commit('updateCurrentUserProfile', data)
          })
          .catch(error => {
            this.$store.commit('showMessage', {
              type: 'error',
              message: error.message
            })
          })
        this.$store.dispatch('getBlacklist')
      }
    },
    /**
     * 处理 @ 我的消息
     * @param {Message[]} messageList
     */
    handleAt(messageList) {
      // 筛选有 @ 符号的文本消息
      const atTextMessageList = messageList.filter(
        message =>
          message.type === this.TIM.TYPES.MSG_TEXT &&
          message.payload.text.includes('@')
      )
      for (let i = 0; i < atTextMessageList.length; i++) {
        const message = atTextMessageList[i]
        const matched = message.payload.text.match(/@\w+/g)
        if (!matched) {
          continue
        }
        // @ 我的
        if (matched.includes(`@${this.currentUserProfile.userID}`)) {
          // 当前页面不可见时，调用window.Notification接口，系统级别通知。
          if (document.hidden) {
            this.notifyMe(message)
          }
          Notification({
            title: `有人在群${message.conversationID.slice(5)}提到了你`,
            message: message.payload.text,
            duration: 3000
          })
          this.$bus.$emit('new-messsage-at-me', {
            data: { conversationID: message.conversationID }
          })
        }
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe(message) {
      // 需检测浏览器支持和用户授权
      if (!('Notification' in window)) {
        return
      } else if (window.Notification.permission === 'granted') {
        this.handleNotify(message)
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission().then(permission => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            this.handleNotify(message)
          }
        })
      }
    },
    handleNotify(message) {
      const notification = new window.Notification('有人提到了你', {
        body: message.payload.text
      })
      notification.onclick = () => {
        window.focus()
        this.$store.dispatch('checkoutConversation', message.conversationID)
        notification.close()
      }
    },
    handleLinkClick() {
      MTA.clickStat('link_two', { click: 'true' })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  position: relative;
}
.chat-wrapper {
  width: 960px;
  height: 100%;
  position: absolute;
  z-index: 1000;
  // -webkit-box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
  // box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
  .chat-wrapper-left {
    width: 31.25%;
    border-right: 1px solid #e7e7e7;
  }
  .chat-wrapper-right {
    width: 68.75%;
    border-top-right-radius: 8px;
  }
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: url('~@/TIM/src/assets/image/bg.jpg') no-repeat 0 0;
  background-size: cover;
  // filter blur(67px)
}
</style>
