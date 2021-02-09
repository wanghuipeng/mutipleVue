<template>
  <div>
    <!--新增admin风格页面 -->
    <div
      v-if="[
        '/threadList',
        '/position/all',
        '/position/hunter',
        '/position/rpo',
        '/position/subscription',
        '/position/browse',
        '/position/wholeStatistics',
        '/job',
        '/jobDetail',
        '/project',
        '/projectDetail',
        '/statistics/tendency',
        '/statistics/companyTendency',
        '/statistics/companyDistribution',
        '/statistics/performanceTendency',
        '/statistics/kpiTendency',
        '/statistics/recommendTendency',
        '/home',
        '/sendResumeList',
        '/set/companyInfo',
        '/set/department',
        '/set/member',
        '/set/protocol',
        '/miniPortal',
        '/miniPortal/officialAccounts',
        '/miniPortal/personality',
        '/miniPortal/enterpriseStory',
        '/miniPortal/recruitmentZone',
        '/miniPortal/recruitmentDetail',
        '/releasePosition',
        '/set/interfaceConfig',
        '/resumeUpload',
        '/talentReview',
        '/set/talentPoolManagement',
        '/set/talentPoolLabel',
        '/set/supplierRate',
        '/set/rpoList',
        '/resume',
        '/candidateList',
        '/customer',
        '/promoterProject',
        '/promoterPromotion',
        '/promoterProjectDetail'
      ].indexOf(routeName) !== -1"
      class="admin-main"
      :class="{noStyle: [
        '/position/all',
        '/position/hunter',
        '/position/rpo',
        '/position/subscription',
        '/position/browse',
        '/position/wholeStatistics',
        '/job',
        '/jobDetail',
        '/project',
        '/projectDetail',
        '/statistics/tendency',
        '/statistics/companyTendency',
        '/statistics/companyDistribution',
        '/statistics/performanceTendency',
        '/statistics/kpiTendency',
        '/statistics/recommendTendency',
        '/home',
        '/set/companyInfo',
        '/set/department',
        '/set/member',
        '/set/protocol',
        '/miniPortal',
        '/miniPortal/officialAccounts',
        '/miniPortal/personality',
        '/miniPortal/enterpriseStory',
        '/miniPortal/recruitmentZone',
        '/miniPortal/recruitmentDetail',
        '/releasePosition',
        '/set/interfaceConfig',
        '/resumeUpload',
        '/talentReview',
        '/set/talentPoolManagement',
        '/set/talentPoolLabel',
        '/set/supplierRate',
        '/set/rpoList',
        '/resume',
        '/candidateList',
        '/customer',
        '/promoterProject',
        '/promoterPromotion',
        '/promoterProjectDetail'
      ].indexOf(routeName) !== -1}"
      :style="mainCommonStyle"
    >
      <div class="main-body">
        <keep-alive v-if="isRouterAlive">
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive && isRouterAlive" />
      </div>
    </div>
    <!-- 登录注册页 -->
    <div
      v-else-if="['/login','/forgetPassword','/register','/completeInfo', '/scan','/srp', '/upgrade', '/material', '/signup', '/capital'].indexOf(routeName) !== -1"
      class="login-main"
    >
      <div class="main-body">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
    </div>
    <!-- 招聘会页 -->
    <div v-else-if="['/reserve'].indexOf(routeName) !== -1" class="jobfair-main">
      <div class="main-body">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
    </div>
    <!-- 其他主页面 -->
    <div v-else class="main-common" :style="mainCommonStyle">
      <el-main>
        <keep-alive v-if="isRouterAlive">
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive && isRouterAlive" />
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainCommon',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      routeName: '',
      isRouterAlive: true
    }
  },
  computed: {
    mainCommonStyle() {
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      const commonHeight = 27
      const minHeight = clientHeight - commonHeight
      return {
        minHeight: minHeight
      }
    }
  },
  watch: {
    $route(to, from) {
      this.routeName = to.path
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style scoped lang="scss">
.noStyle {
  padding: 0 !important;
  .main-body {
    background: none !important;
  }
}
</style>

