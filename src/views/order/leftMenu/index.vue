<template>
  <div class="menu">
    <router-link to="/order/allOrder" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">全部订单</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/recommendStage" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">推荐阶段</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/interviewStage" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">面试阶段</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/offerStage" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">OFFER阶段</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/entryStage" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">入职阶段</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/overProtectionStage" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">过保阶段</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="/order/fail" tag="div" class="menu-item">
      <i class="menu-item-icon"></i>
      <span class="menu-item-title">未成功</span>
      <i class="menu-item-active"></i>
    </router-link>
    <router-link to="" tag="div" class="menu-item">
      <i class="menu-item-icon" @click="openDraft"></i>
      <span class="menu-item-title" style="color: #4D4D4D;" @click="openDraft">草稿箱</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    openDraft() {
      this.$bus.$emit('openDraft')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/order/leftMenu'
</style>
