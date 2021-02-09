<template>
  <div>
    <div
      v-if="['/notFound','/resumeUpload','/login','/forgetPassword','/register','/completeInfo', '/scan','/srp', '/upgrade', '/material', '/signup', '/capital', '/reserve'].indexOf(routeName) === -1"
      id="footerCommon"
      class="footer-common"
    >
      <el-footer>
        <!-- <div class="left">Copyright ©2020 上海大猎英才科技有限公司 保留所有权利 沪ICP备19047210号-1</div> -->
        <!-- <ul class="right">
          <li @click="sendMessage($store.state.userInfo.cwUserId)">意见反馈</li>
          <li @click="()=>this.$router.push({ path: '/protocol1' })">业务合作协议</li>
          <li @click="()=>this.$router.push({ path: '/protocol2' })">平台用户协议</li>
        </ul>-->
      </el-footer>
    </div>
    <!-- <div v-if="['/scan','/srp'].indexOf(routeName) !== -1" class="login-footer">
      <div class="footer-main">Copyright ©2020 上海大猎英才科技有限公司 保留所有权利 沪ICP备19047210号-1</div>
    </div>-->
    <!-- <div
      v-if="['/login','/forgetPassword','/register','/completeInfo', '/upgrade', '/material', '/signup', '/capital'].indexOf(routeName) !== -1"
      class="login-footer"
      style="position: fixed;bottom: -30px;z-index: 999;background-color: transparent;height: 100px;"
    >
      <div class="footer-main">Copyright ©2020 上海大猎英才科技有限公司 保留所有权利 沪ICP备19047210号-1</div>
    </div>-->
    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import dialogChat from '@/components/common/dialogChat.vue'
export default {
  name: 'FooterCommon',
  components: {
    dialogChat
  },
  data() {
    return {
      routeName: '',
      dialogVisible: false
    }
  },
  watch: {
    $route(to, from) {
      this.routeName = to.path
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    sendMessage(userId) {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${userId}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
</style>

