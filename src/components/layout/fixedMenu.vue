<template>
  <div>
    <ul class="fixed-menu">
      <!-- <li class="resume" @click="uploadResume">上传简历</li> -->
      <!-- <li class="consult" @click="toChat">咨询客服</li>
      <li class="wechat">
        关注微信
        <div class="qrcode">
          <img src="~@/assets/images/common/qrcode.jpg" />
          <p>关注大猎英才公众号</p>
        </div>
      </li>-->
      <li v-if="showBackTop" class="top" @click="handleScrollTop">回到顶部</li>
    </ul>
    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer v-if="drawer" slot="inner-body" ref="uploadDrawer" @fatherMethod="close" />
    </drawer-common>

    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DrawerCommon from '@/components/common/drawerCommon'
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer'
import dialogChat from '@/components/common/dialogChat.vue'

export default {
  components: {
    DrawerCommon,
    UploadDrawer,
    dialogChat
  },
  data() {
    return {
      dialogVisible: false,
      drawer: false,
      showBackTop: false
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      userID: state => state.userInfo.cwUserId
    })
  },
  mounted() {
    // handlePageScroll为页面滚动的监听回调
    window.addEventListener('scroll', this.handlePageScroll)
  },
  destroyed() {
    // 销毁页面滚动的监听回调
    window.removeEventListener('scroll', this.handlePageScroll)
  },
  methods: {
    handlePageScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.showBackTop = scrollTop > 300
    },
    toChat() {
      if (this.userID) {
        this.$bus.$emit('closeChat')
      }
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userID}`)
        .then(() => {
          this.dialogVisible = true
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    uploadResume() {
      if (this.$route.name === 'resume') {
        console.log(444, this.$route.name)
        //  只有在非简历页才跳转简历页
        this.$router.push({ name: 'resume', query: {} })
      }
      this.drawer = true
    },
    close() {
      this.drawer = false
      this.$refs.uploadDrawer.destroyedInterval()
    },
    handleScrollTop() {
      if (this.$route.name === 'recommendReport') {
        window.scrollTo(0, 0)
      } else {
        const gotoTop = () => {
          let currentPosition =
            document.documentElement.scrollTop || document.body.scrollTop
          currentPosition -= 35
          if (currentPosition > 0) {
            window.scrollTo(0, currentPosition)
          } else {
            window.scrollTo(0, 0)
            clearInterval(timer)
            timer = null
          }
        }
        let timer = setInterval(gotoTop, 1)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.fixed-menu {
  text-align: center;
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1000;
  width: 60px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 2px 4px 30px 0px rgba(0, 0, 0, 0.13);
  box-sizing: border-box;
  li {
    font-size: 12px;
    width: 60px;
    text-align: center;
    color: #808080;
    position: relative;
    margin: 15px 0;
    padding-top: 30px;
    cursor: pointer;
    .qrcode {
      display: none;
      background: white;
      padding: 5px;
      border: 1px solid #eee;
      position: absolute;
      left: -160px;
      padding-right: 10px;
      top: -125px;
      img {
        width: 140px;
        height: 140px;
      }
      p {
        margin-top: 10px;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: 50%;
    }
    &.resume {
      &::before {
        width: 22px;
        height: 25px;
        background: url('~@/assets/images/common/resume.png') no-repeat;
        background-size: 22px;
        top: 0px;
        margin-left: -11px;
      }
    }
    &.consult {
      &::before {
        width: 24px;
        height: 21px;
        background: url('~@/assets/images/common/consult.png') no-repeat;
        background-size: 24px;
        top: 0px;
        margin-left: -12px;
      }
    }
    &.wechat {
      &:hover {
        .qrcode {
          display: block;
        }
      }
      &::before {
        width: 24px;
        height: 20px;
        background: url('~@/assets/images/common/wechat.png') no-repeat;
        background-size: 24px;
        top: 0px;
        margin-left: -12px;
      }
    }
    &.top {
      &::before {
        width: 24px;
        height: 13px;
        background: url('~@/assets/images/common/top.png') no-repeat;
        background-size: 24px;
        top: 0px;
        margin-left: -12px;
      }
    }
  }
}
</style>

