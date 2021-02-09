<template>
  <div id="app">
    <div class="wrapper">
      <!-- 公共头部 -->
      <header-common />
      <!-- 主要内容 -->
      <main-common />
      <!-- 公共底部 -->
      <!-- <footer-common /> -->
      <!-- 悬浮固定 -->
      <fixed-menu
        v-if="['/login','/forgetPassword','/register','/completeInfo', '/guide1', '/guide2','/protocol1','/protocol2', '/scan','/srp', '/upgrade', '/material', '/signup', '/capital', '/certification', '/certificationWait', '/certificationFail', '/reserve'].indexOf(routeName) === -1"
      />
      <!-- 企业未认证 -->
      <!-- <company-certification
        v-if="['/login','/forgetPassword','/register','/completeInfo', '/guide1', '/guide2','/protocol1','/protocol2', '/scan','/srp', '/upgrade', '/material', '/signup', '/capital', '/certification', '/certificationWait', '/certificationFail', '/reserve'].indexOf(routeName) === -1 && userInfo.companyId && !userInfo.companyCertificationStatus"
      />-->
      <!-- 返回顶部 -->
      <!-- <back-top /> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderCommon from '@/components/layout/headerCommon'
import MainCommon from '@/components/layout/mainCommon'
// import FooterCommon from '@/components/layout/footerCommon'
import FixedMenu from '@/components/layout/fixedMenu'
// import companyCertification from '@/components/layout/companyCertification'
export default {
  name: 'App',
  components: {
    HeaderCommon,
    MainCommon,
    // FooterCommon
    FixedMenu
    // companyCertification
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      routeName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  watch: {
    $route(to, from) {
      this.routeName = to.path
    }
  },
  mounted() {
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('dictData', JSON.stringify(this.$store.state.common))
    })

    // 在页面加载时读取localStorage里的状态信息
    localStorage.getItem('dictData') &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem('dictData'))
        )
      )

    // 全局loading
    this.pageLoading('loading')
  },
  methods: {
    // 全局loading
    pageLoading(ele) {
      const child = document.getElementById(ele)
      child.style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/sass/layout/index.scss';
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Segoe UI',
    'Helvetica Neue', 'PingFang SC', 'Noto Sans', 'Noto Sans CJK SC',
    'Microsoft YaHei', 微软雅黑, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #343434;
}
</style>
