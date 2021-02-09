<template>
  <div class="middle-page"></div>
</template>

<script>
import { getCurrentUserInfo } from '@/api/myCenter'
import Vue from 'vue'

export default {
  data() {
    return {}
  },
  created() {
    Vue.ls.set('x-client-token', this.$route.query.accessToken)
    this.login()
  },
  methods: {
    // 登录
    login() {
      this.$store.commit('toggleIsLogin', true)
      getCurrentUserInfo().then(res => {
        this.$store.dispatch('dispatchUpdateUserInfo', res.data)
        if (res.data.companyAccountType === 1) {
          if (res.data.packageItems && res.data.packageItems.workBenchSwitch) {
            this.$router.push({ name: 'home' })
          } else {
            this.$router.push({ name: 'customer' })
          }
        } else if (res.data.companyAccountType === 2) {
          if (res.data.packageItems && res.data.packageItems.openHuntingGroundSwitch) {
            this.$router.push({ name: 'all' })
          } else {
            this.$router.push({ name: 'customer' })
          }
        } else if (res.data.companyAccountType === 3) {
          if (res.data.packageItems && res.data.packageItems.promoterProjectSwitch) {
            this.$router.push({ name: 'promoterProject' })
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
