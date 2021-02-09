<template>
  <div id="message-send-box-wrapper" :style="focus ? {'backgroundColor': 'white'} : {}">
    <div class="send-header-bar">
      <el-popover placement="top" width="400" trigger="click">
        <div class="emojis">
          <div v-for="item in emojiName" :key="item" class="emoji" @click="chooseEmoji(item)">
            <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px" />
          </div>
        </div>
        <span slot="reference" class="send-face" title="发表情" />
      </el-popover>
      <span class="send-photo" title="发图片" @click="handleSendImageClick" />
      <span class="send-file" title="发文件" @click="handleSendFileClick" />
      <span class="send-position" :class="{sendPositions: showPosition}" title="发职位" @click="sendPosition" />
      <span class="send-order" :class="{sendOrders: showOrder}" title="发订单" @click="sendOrder" />
      <!-- <i v-if="currentConversationType === 'C2C' && toAccount !== userID" class="el-icon-video-camera" style="font-size: 24px;" title="视频通话" @click="videoCall"></i> -->
    </div>
    <el-dialog title="发自定义消息" :visible.sync="sendCustomDialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="data">
          <el-input v-model="form.data" />
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="extension">
          <el-input v-model="form.extension" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendCustomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCustomMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="对IM Web demo的建议和使用感受" :visible.sync="surveyDialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="评分">
          <div class="block">
            <el-rate v-model="rate" :colors="colors" show-text />
          </div>
        </el-form-item>
        <el-form-item label="建议">
          <el-input
            v-model="suggestion"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="surveyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSurvey">确 定</el-button>
      </span>
    </el-dialog>
    <el-popover
      v-model="showAtGroupMember"
      trigger="manual"
      placement="top"
      style="max-height:500px;overflow-y:scroll;"
    >
      <el-radio-group
        v-model="atUserID"
        v-for="member in memberList"
        :key="member.userID"
        style="display:flex;flex-decoration: column;"
        @change="handleSelectAtUser"
      >
        <el-radio :label="member.userID">{{ member.nameCard || member.nick || member.userID }}</el-radio>
      </el-radio-group>
    </el-popover>
    <div class="bottom">
      <textarea
        v-model="messageContent"
        rows="4"
        resize="false"
        class="text-input"
        @focus="focus = true"
        @blur="focus = false"
        @keydown.enter.exact.prevent="handleEnter"
        @keyup.ctrl.enter.prevent.exact="handleLine"
        @keydown.up.stop="handleUp"
        @keydown.down.stop="handleDown"
      />
      <el-tooltip
        class="item"
        effect="dark"
        content="按Enter发送消息，Ctrl+Enter换行"
        placement="left-start"
      >
        <div class="btn-send">
          <!-- <div class="tim-icon-send" /> -->
          <p v-if="messageContent" class="send" @click="sendTextMessage">发 送</p>
          <p v-else>发 送</p>
        </div>
      </el-tooltip>
    </div>
    <input
      id="imagePicker"
      ref="imagePicker"
      type="file"
      accept=".jpg, .jpeg, .png, .gif"
      style="display:none"
      @change="sendImage"
    />
    <input id="filePicker" ref="filePicker" type="file" style="display:none" @change="sendFile" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  Form,
  FormItem,
  Input,
  Dialog,
  Popover,
  RadioGroup,
  Radio,
  Tooltip,
  Rate
} from 'element-ui'
import { emojiMap, emojiName, emojiUrl } from '../../utils/emojiMap'
export default {
  name: 'MessageSendBox',
  components: {
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElPopover: Popover,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElTooltip: Tooltip,
    ElRate: Rate
  },
  props: ['scrollMessageListToButtom'],
  data() {
    return {
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      messageContent: '',
      isSendCustomMessage: false,
      sendCustomDialogVisible: false,
      surveyDialogVisible: false,
      form: {
        data: '',
        description: '',
        extension: ''
      },
      rate: 5, // 评分
      suggestion: '', // 建议
      file: '',
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      showAtGroupMember: false,
      atUserID: '',
      focus: false
    }
  },

  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      memberList: state => state.group.currentMemberList,
      userID: state => state.userInfo.userId
    }),
    showPosition: {
      get() {
        return this.$store.state.positionList.showPosition
      },
      set(val) {
        this.$store.state.positionList.showPosition = val
      }
    },
    showOrder: {
      get() {
        return this.$store.state.orderList.showOrder
      },
      set(val) {
        this.$store.state.orderList.showOrder = val
      }
    }
  },
  methods: {
    handleSelectAtUser() {
      this.messageContent += this.atUserID + ' '
      this.showAtGroupMember = false
    },
    handleUp() {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index - 1 < 0) {
        return
      }
      this.atUserID = this.memberList[index - 1].userID
    },
    handleDown() {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index + 1 >= this.memberList.length) {
        return
      }
      this.atUserID = this.memberList[index + 1].userID
    },
    handleEnter() {
      if (this.showAtGroupMember) {
        this.handleSelectAtUser()
      } else {
        this.sendTextMessage()
      }
    },
    handleLine() {
      this.messageContent += '\n'
    },
    sendTextMessage() {
      if (
        this.messageContent === '' ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = ''
        this.$store.commit('showMessage', {
          message: '不能发送空消息哦！',
          type: 'info'
        })
        return
      }
      console.log(this.toAccount, this.messageContent)
      const message = this.tim.createTextMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: { text: this.messageContent }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      this.messageContent = ''
    },
    sendCustomMessage() {
      if (
        this.form.data.length === 0 &&
        this.form.description.length === 0 &&
        this.form.extension.length === 0
      ) {
        this.$store.commit('showMessage', {
          message: '不能发送空消息',
          type: 'info'
        })
        return
      }
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.sendCustomDialogVisible = false
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    sendSurvey() {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: 'survey',
          description: String(this.rate),
          extension: this.suggestion
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.tim
        .sendMessage(message)
        .then(() => {
          Object.assign(this, {
            rate: 5,
            suggestion: ''
          })
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
      this.surveyDialogVisible = false
    },
    chooseEmoji(item) {
      console.log(123)
      this.messageContent += item
    },
    handleSendImageClick() {
      this.$refs.imagePicker.click()
    },
    handleSendFileClick() {
      this.$refs.filePicker.click()
    },
    sendImage() {
      console.log(document.getElementById('imagePicker'))
      const message = this.tim.createImageMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('imagePicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.imagePicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendFile() {
      const message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('filePicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.imagePicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendOrder() {
      this.showOrder = !this.showOrder
      this.$store.commit('updateShowOrder', this.showOrder)
      this.$store.commit('updateShowPosition', false)
    },
    sendPosition() {
      this.showPosition = !this.showPosition
      this.$store.commit('updateShowPosition', this.showPosition)
      this.$store.commit('updateShowOrder', false)
    },
    videoCall() {
      this.$bus.$emit('video-call')
    }
  }
}
</script>

<style lang="stylus" scoped>
#message-send-box-wrapper {
  box-sizing: border-box;
  overflow: hidden;
  padding: 12px 20px;
}

.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.emoji {
  height: 40px;
  width: 40px;
  box-sizing: border-box;
}

.send-header-bar {
  box-sizing: border-box;
  span {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100%;
    margin-right: 20px;
  }
  .send-order {
    width: 17px;
    height: 19px;
  }
}

.send-face {
  background: url('~@/assets/images/notice/face.png') no-repeat
}
.send-face:hover {
  background: url('~@/assets/images/notice/face_active.png') no-repeat
  background-size: 100%;
}

.send-photo {
  background: url('~@/assets/images/notice/photo.png') no-repeat
}
.send-photo:hover {
  background: url('~@/assets/images/notice/photo_active.png') no-repeat
  background-size: 100%;
}

.send-file {
  background: url('~@/assets/images/notice/file.png') no-repeat
}
.send-file:hover {
  background: url('~@/assets/images/notice/file_active.png') no-repeat
  background-size: 100%;
}

.send-position {
  background: url('~@/assets/images/notice/position.png') no-repeat
}
.send-position:hover, .sendPositions {
  background: url('~@/assets/images/notice/position_active.png') no-repeat
  background-size: 100%;
}

.send-order {
  background: url('~@/assets/images/notice/order.png') no-repeat
}
.send-order:hover, .sendOrders {
  background: url('~@/assets/images/notice/order_active.png') no-repeat
  background-size: 100%;
}

textarea {
  resize: none;
}

.text-input {
  font-size: 16px;
  width: 100%;
  box-sizing: box-sizing;
  border: none;
  outline: none;
  background-color: transparent;
}

.block {
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.bottom {
  padding-top: 10px;
  position: relative;

  .btn-send {
    cursor: pointer;
    position: absolute;
    color: $primary;
    font-size: 30px;
    right: 0;
    bottom: -5px;
    padding: 6px 6px 4px 4px;
    border-radius: 50%;
    p {
      width: 64px;
      height: 28px;
      font-size: 16px;
      line-height: 26px;
      text-align: center;
      color: #B2B2B2;
      border: 1px solid #B2B2B2;
      border-radius: 15px;
      box-sizing: border-box;
    }
    .send {
      color: #fff;
      background: #1678f9;
      border: 1px solid #1678f9;
    }
  }
}
</style>
