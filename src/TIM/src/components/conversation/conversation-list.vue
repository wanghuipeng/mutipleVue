<template>
  <div class="list-container">
    <div class="header-bar">
      <el-autocomplete
        v-model="userID"
        :fetch-suggestions="querySearch"
        placeholder="请输入联系人"
        placement="bottom"
        :popper-append-to-body="false"
        :trigger-on-focus="false"
        class="inline-input"
        @select="handleSelect"
      >
        <img slot="prefix" src="../../../../assets/images/notice/search.png"/>
        <template slot-scope="{ item }">
          <p class="title">联系人</p>
          <div class="linkman">
            <!-- <img :src="item.userProfile.avatar" /> -->
            <avatar :src="avatar" :type="item.type" :user="item.userProfile" />
            <div class="linkman-right">
              <p class="linkman-right-name">{{ item.userProfile.nick }}</p>
              <!-- <p class="linkman-right-desc">{{ item.userProfile.allowType }}</p> -->
              <img class="linkman-right-icon" src="../../../../assets/images/notice/linkman_right.png">
            </div>
          </div>
        </template>
      </el-autocomplete>
      <!-- <button title="刷新列表" @click="handleRefresh">
        <i class="tim-icon-refresh" />
      </button> -->
    </div>
    <div class="scroll-container">
      <conversation-item
        v-for="(item, index) in conversationList"
        :key="item.conversationID + index"
        :conversation="item"
      />
      <p v-if="conversationList.length === 0" class="noMsg">暂无对话记录</p>
    </div>
  </div>
</template>

<script>
import ConversationItem from './conversation-item'
import { mapState } from 'vuex'
export default {
  name: 'ConversationList',
  components: { ConversationItem },
  data() {
    return {
      userID: '',
      isCheckouting: false, // 是否正在切换会话
      timeout: null
    }
  },
  computed: {
    ...mapState({
      conversationList(state) {
        let conversationList = state.conversation.conversationList
        for (let i = 0; i < conversationList.length; i++) {
          const options = {
            userIDList: [conversationList[i].userProfile.userID]
          }
          if (state.user.isSDKReady === true) {
            this.tim.getUserProfile(options) && this.tim.getUserProfile(options).then(res => {
              const profileCustomField = res.data && res.data[0] && res.data[0].profileCustomField
              const arr = profileCustomField &&
              profileCustomField[0] &&
              profileCustomField[0].value &&
              profileCustomField[0].value.split(',')
              if (arr) {
                if (arr.indexOf('ai') !== -1) {
                  conversationList[i].userProfile.customRole = 'AI'
                } else if (arr.indexOf('orion') !== -1) {
                  conversationList[i].userProfile.customRole = 'PM'
                } else if (arr.indexOf('hr') !== -1) {
                  conversationList[i].userProfile.customRole = 'HR'
                } else {
                  conversationList[i].userProfile.customRole = ''
                }
              } else {
                conversationList[i].userProfile.customRole = ''
              }
            })
          }
        }
        return conversationList
      },
      currentConversation: state => state.conversation.currentConversation
    }),
    avatar: function() {
      switch (this.conversationList.type) {
        case 'GROUP':
          return this.conversationList.groupProfile.avatar
        case 'C2C':
          return this.conversationList.userProfile.avatar
        default:
          return ''
      }
    }
  },
  mounted() {
    console.log(this.conversationList)
    window.addEventListener('keydown', this.handleKeydown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.conversationList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.userProfile.nick.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.userID = item.userProfile.userID
      this.handleConfirm()
    },
    handleRefresh() {
      this.refreshConversation()()
    },
    refreshConversation() {
      const that = this
      return function() {
        if (!that.timeout) {
          that.timeout = setTimeout(() => {
            that.timeout = null
            that.tim.getConversationList().then(() => {
              that.$store.commit('showMessage', {
                message: '刷新成功',
                type: 'success'
              })
            })
          }, 1000)
        }
      }
    },
    handleConfirm() {
      if (this.userID !== '@TIM#SYSTEM') {
        this.$store
          .dispatch('checkoutConversation', `C2C${this.userID}`)
          .then(() => {})
          .catch(() => {
            this.$store.commit('showMessage', {
              message: '没有找到该用户',
              type: 'warning'
            })
          })
      } else {
        this.$store.commit('showMessage', {
          message: '没有找到该用户',
          type: 'warning'
        })
      }
      this.userID = ''
    },
    handleKeydown(event) {
      if (
        (event.keyCode !== 38 && event.keyCode !== 40) ||
        this.isCheckouting
      ) {
        return
      }
      const currentIndex = this.conversationList.findIndex(
        item => item.conversationID === this.currentConversation.conversationID
      )
      if (event.keyCode === 38 && currentIndex - 1 >= 0) {
        this.checkoutPrev(currentIndex)
      }
      if (
        event.keyCode === 40 &&
        currentIndex + 1 < this.conversationList.length
      ) {
        this.checkoutNext(currentIndex)
      }
    },
    checkoutPrev(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex - 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    },
    checkoutNext(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex + 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column; // -reverse

  .header-bar {
    flex-shrink: 0;
    height: 40px;
    padding: 12px 19px 12px 20px;
    background: #F1F1F1;

    .el-autocomplete {
      width: 260px;
      img {
        width: 20px;
        height 20px;
      }
      ::v-deep .el-autocomplete-suggestion li {
        padding: 0;
        &:hover {
          background: #FFFFFF;
        }
      }
      ::v-deep .el-autocomplete-suggestion__wrap {
        padding: 0;
      }
      ::v-deep .el-autocomplete-suggestion {
        top: 32px!important;
      }
      ::v-deep .el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
      }
      .title {
        display: none;
      }
      .linkman {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 60px;
        padding: 10px 12px;
        box-sizing: border-box;
        // img {
        //   width: 40px;
        //   height: 40px;
        //   margin-right: 12px;
        // }
        .avatar {
         width: 40px;
          height: 40px;
          margin-right: 12px;
          margin-right: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .linkman-right {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          position: relative;
          .linkman-right-name {
            font-size: 14px;
            line-height: 20px;
            color: #333333;
          }
          .linkman-right-desc {
            font-size: 12px;
            line-height: 17px;
            color: #B1B1B1;
            margin-top: 3px;
          }
          .linkman-right-icon {
            width: 12px;
            height: 12px;
          }
          // &::after {
          //   content: '';
          //   width: 12px;
          //   height: 12px;
          //   background: url('~@/assets/images/notice/linkman_right.png');
          //   position: absolute;
          //   top: 50%;
          //   right: 0;
          //   transform: translateY(-50%);
          // }
        }
        &:hover {
          background: #F3F3F3;
        }
      }
      .el-autocomplete-suggestion li:first-child .title {
        display: block;
        border-bottom: 1px solid #E5E5E5;
        padding-left: 12px;
      }
    }

    ::v-deep input::placeholder {
      color: #B3B3B3;
    }

    ::v-deep ..el-input--prefix {
      padding-left: 40px;
    }

    ::v-deep .el-input__inner {
      border-color: #F1F1F1;
      border-radius: 22px;
      padding-left: 40px;
    }

    ::v-deep .el-input__prefix {
      height 20px;
      top: 50%;
      left: 17px;
      transform: translateY(-50%);
    }

    button {
      float: right;
      display: inline-block;
      cursor: pointer;
      background: $background-deep-dark;
      border: none;
      color: $font-dark;
      box-sizing: border-box;
      transition: 0.3s;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      margin: 0 10px 0 0;
      padding: 0;
      width: 30px;
      height: 30px;
      line-height: 34px;
      font-size: 24px;
      text-align: center;
      white-space: nowrap;
      border-radius: 50%;
      outline: 0;

      &:hover {
        // background $light-primary
        // color $white
        transform: rotate(360deg);
        color: $light-primary;
      }
    }
  }

  .scroll-container {
    overflow-y: scroll;
    flex: 1;
    background: #FFFFFF;
    .conversation-item-container:last-child {
      border: none;
    }
    .noMsg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.bottom-circle-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.refresh {
  bottom: 70px;
}
</style>
