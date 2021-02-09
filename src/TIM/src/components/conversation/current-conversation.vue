<template>
  <div class="current-conversation-wrapper">
    <div v-if="showCurrentConversation" class="current-conversation" :class="{openProfile: showOrder || showPosition}" @scroll="onScroll">
      <div class="header">
        <div class="name">
          {{ name }}
          <span v-if="customRole" class="label">{{ customRole }}</span>
        </div>

        <!-- <el-dropdown trigger="click" placement="bottom" class="btn-more" @command="handleCommand">
          <div
            class="btn-more-info el-dropdown-link"
            title="设置"
          >
            <img src="../../../../assets/images/notice/setting.png" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">投诉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

      </div>
      <div class="content">
        <div ref="message-list" class="message-list" @scroll="onScroll">
          <div v-if="!isCompleted" class="more">
            <el-button
              type="text"
              @click="$store.dispatch('getMessageList', currentConversation.conversationID)"
            >查看更多</el-button>
          </div>
          <div v-else class="no-more">没有更多了</div>
          <message-item v-for="message in currentMessageList" :key="message.ID" :message="message" />
          <image-previewer />
        </div>
        <div
          v-show="isShowScrollButtomTips"
          class="newMessageTips"
          @click="scrollMessageListToButtom"
        >回到最新位置</div>
      </div>
      <div v-if="showMessageSendBox" class="footer">
        <message-send-box v-if="customRole !== 'AI'" />
      </div>
    </div>

    <div v-if="!showCurrentConversation" class="noMsg">
      <img src="../../../../assets/images/notice/noMsg.png" />
    </div>

    <!-- 职位 -->
    <div v-if="showPosition" class="profile">
      <conversation-position />
    </div>

    <!-- 订单 -->
    <div v-if="showOrder" class="profile">
      <conversation-order />
    </div>

    <!-- 群成员资料组件 -->
    <member-profile-card />

    <!-- 投诉 -->
    <el-dialog title="投诉建议" :visible.sync="complaintDialogVisible" class="dialog" width="800px" center :show-close="false">
      <p class="desc">您在使用产品上的任何问题，或者对运营小伙伴的服务不满意的都可以在这里告诉我们哟，投诉绝对是匿名投诉！</p>
      <el-form
        ref="form"
        :rules="formRules"
        :model="form"
      >
        <el-form-item prop="content" label="请写下您的意见或建议：">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="如果您想得到回复，请留下您的联系方式，处理好以后会第一时间回复您。">
          <el-input v-model="form.userContact" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendComplaint">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MessageSendBox from '../message/message-send-box'
import MessageItem from '../message/message-item'
import ConversationPosition from './conversation-position.vue'
import ConversationOrder from './conversation-order.vue'
import MemberProfileCard from '../group/member-profile-card'
import ImagePreviewer from '../message/image-previewer.vue'
import { saveUserComplain } from '@/api/TIM/index'
export default {
  name: 'CurrentConversation',
  components: {
    MessageSendBox,
    MessageItem,
    ConversationPosition,
    ConversationOrder,
    MemberProfileCard,
    ImagePreviewer
  },
  data() {
    return {
      isShowScrollButtomTips: false,
      preScrollHeight: 0,
      showConversationProfile: false,
      timeout: '',
      complaintDialogVisible: false, // 投诉
      form: {
        content: '',
        userContact: '',
        objUserId: ''
      },
      formRules: {
        content: [
          { required: true, message: '请输入您的意见或建议', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
      currentMessageList: state => state.conversation.currentMessageList,
      isCompleted: state => state.conversation.isCompleted,
      showOrder: state => state.orderList.showOrder,
      showPosition: state => state.positionList.showPosition
    }),
    ...mapGetters(['toAccount']),
    // 是否显示当前会话组件
    showCurrentConversation() {
      return !!this.currentConversation.conversationID
    },
    name() {
      if (this.currentConversation.type === 'C2C') {
        return this.currentConversation.userProfile.nick || this.toAccount
      } else if (this.currentConversation.type === 'GROUP') {
        return this.currentConversation.groupProfile.name || this.toAccount
      } else if (this.currentConversation.conversationID === '@TIM#SYSTEM') {
        return '系统通知'
      }
      return this.toAccount
    },
    customRole() {
      const arr = this.currentConversation.userProfile.profileCustomField &&
      this.currentConversation.userProfile.profileCustomField[0] &&
      this.currentConversation.userProfile.profileCustomField[0].value &&
      this.currentConversation.userProfile.profileCustomField[0].value.split(',')
      if (arr) {
        if (arr.indexOf('ai') !== -1) {
          return 'AI'
        } else if (arr.indexOf('orion') !== -1) {
          return 'PM'
        } else if (arr.indexOf('hr') !== -1) {
          return 'HR'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    role() {
       if (this.currentConversation.type === 'C2C') {
        return this.currentConversation.userProfile.role
      } else if (this.currentConversation.type === 'GROUP') {
        return this.currentConversation.groupProfile.name || this.toAccount
      } else if (this.currentConversation.conversationID === '@TIM#SYSTEM') {
        return '系统通知'
      }
      return this.toAccount
    },
    showMessageSendBox() {
      return this.currentConversation.type !== this.TIM.TYPES.CONV_SYSTEM
    }
  },
  mounted() {
    console.log(this.currentMessageList)
    this.$bus.$on('image-loaded', this.onImageLoaded)
    this.$bus.$on('scroll-bottom', this.scrollMessageListToButtom)
    if (this.currentConversation.conversationID === '@TIM#SYSTEM') {
      return false
    }
  },
  updated() {
    this.keepMessageListOnButtom()
    // 1. 系统会话隐藏右侧资料组件
    // 2. 没有当前会话时，隐藏右侧资料组件。
    //    背景：退出群组/删除会话时，会出现一处空白区域
    if (
      this.currentConversation.conversationID === '@TIM#SYSTEM' ||
      typeof this.currentConversation.conversationID === 'undefined'
    ) {
      this.showConversationProfile = false
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.complaintDialogVisible = true
      }
    },
    sendComplaint() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.objUserId = this.currentConversation.userProfile.userID
          saveUserComplain(this.form).then(res => {
            if (res.code === '000000') {
              this.$message({
                message: '投诉成功',
                type: 'success',
                showClose: true,
                center: true
              });
              this.complaintDialogVisible = false
            }
          })
        }
      })
    },
    onScroll({ target: { scrollTop }}) {
      const messageListNode = this.$refs['message-list']
      if (!messageListNode) {
        return
      }
      if (
        this.preScrollHeight - messageListNode.clientHeight - scrollTop <
        20
      ) {
        this.isShowScrollButtomTips = false
      }
    },
    // 如果滚到底部就保持在底部，否则提示是否要滚到底部
    keepMessageListOnButtom() {
      const messageListNode = this.$refs['message-list']
      if (!messageListNode) {
        return
      }
      // 距离底部20px内强制滚到底部,否则提示有新消息
      if (
        this.preScrollHeight -
          messageListNode.clientHeight -
          messageListNode.scrollTop <
        20
      ) {
        this.$nextTick(() => {
          messageListNode.scrollTop = messageListNode.scrollHeight
        })
        this.isShowScrollButtomTips = false
      } else {
        this.isShowScrollButtomTips = true
      }
      this.preScrollHeight = messageListNode.scrollHeight
    },
    // 直接滚到底部
    scrollMessageListToButtom() {
      this.$nextTick(() => {
        const messageListNode = this.$refs['message-list']
        if (!messageListNode) {
          return
        }
        messageListNode.scrollTop = messageListNode.scrollHeight
        this.preScrollHeight = messageListNode.scrollHeight
        this.isShowScrollButtomTips = false
      })
    },
    onImageLoaded() {
      this.keepMessageListOnButtom()
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 当前会话的骨架屏 */
.current-conversation-wrapper {
  height: $height;
  background-color: #FFFFFF;
  color: $base;
  display: flex;
  border-radius: 0 8px 8px 0;
  position: relative;

  .noMsg {
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .current-conversation {
    flex: 1;
    display: flex;
    flex-direction: column;
    // width: 100%;
    height: $height;
  }

  .openProfile {
    width: 420px;
  }

  .profile {
    height: $height;
    overflow-y: scroll;
    width: 239px;
    border-left: 1px solid #e7e7e7;
    flex-shrink: 0;
  }

  .more {
    display: flex;
    justify-content: center;
    font-size: 12px;
  }

  .no-more {
    display: flex;
    justify-content: center;
    color: $secondary;
    font-size: 12px;
    padding: 10px 10px;
  }
}

.header {
  height: 64px;
  background: #F1F1F1;
  position: relative;
  border-radius: 0 8px 0 0;
  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    color: #4D4D4D;
    font-size: 20px;

    .label {
      margin-left 20px;
      padding 0 8px;
      font-size 16px;
      line-height: 22px;
      color: #1E75FF;
      border 1px solid #1E75FF;
      border-radius 4px;
      opacity: 0.5;
    }
  }

  .btn-more {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    ::v-deep .el-dropdown-menu {
      left: 1004px;
    }
  }

  .btn-more-info {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background: #FFFFFF;
    cursor: pointer;

    &:hover {
      &::after {
        border-color: $light-primary;
      }
    }
  }
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  .message-list {
    width: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
    padding: 0 20px;
  }

  .newMessageTips {
    position: absolute;
    cursor: pointer;
    padding: 5px;
    width: 120px;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 5px;
    font-size: 12px;
    text-align: center;
    border-radius: 10px;
    border: $border-light 1px solid;
    background-color: $white;
    color: $primary;
  }
}

.footer {
  border-top: 1px solid $border-base;
}

.show-more {
  text-align: right;
  padding: 10px 20px 0 0;
}

.dialog {
  .desc {
    font-size: 14px;
    line-height: 20px;
    color: #B3B3B3;
    margin-bottom: 20px;
  }
  ::v-deep .el-dialog__header {
    padding: 40px 0;
  }
  ::v-deep .el-dialog__title {
    font-size: 24px;
    line-height: 33px;
    color: #1A1A1A;
  }
  ::v-deep .el-dialog__body {
    padding: 0 40px 40px 40px;
  }
  ::v-deep .el-form-item__label {
    font-size: 16px;
    line-height: 22px;
    color: #4C4C4C;
    margin: 20px 0 8px;
  }
  .el-form-item {
    margin: 0;
  }
  ::v-deep .el-dialog__footer {
    padding: 0 0 40px 0;
    button {
      width: 100px;
      height: 40px;
      font-size: 19px;
      color: #FFFFFF;
      line-height: 26px;
      background: #0E68F7;
      border-radius: 22px;
      padding: 0;
    }
  }
}
</style>
