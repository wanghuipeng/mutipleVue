<template>
  <div class="my-center-page">
    <!-- 左侧 -->
    <left-menu :route-name="routeName" :menu-list="menuList" />
    <!-- 主要内容 -->
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        :class="[routeName === 'attention' ? 'other-style' : '']"
      />
      <router-view v-else :class="[routeName === 'attention' ? 'other-style' : '']" />
    </keep-alive>
  </div>
</template>

<script>
import LeftMenu from '@/components/myCenter/leftMenu'

export default {
  components: {
    LeftMenu
  },
  data() {
    return {
      routeName: '',
      menuList: this.$store.state.common.menuList
    }
  },
  watch: {
    $route(to, from) {
      this.routeName = to.name
      console.log('路由', to.name)
      const arr = JSON.parse(JSON.stringify(this.$store.state.common.menuList))
      arr.filter(item => {
        if (item.name === to.name) {
          item.className = 'active'
        } else {
          item.className = ''
        }
      })
      this.$store.commit('setMenuList', arr)
      console.log('菜单数据', this.$store.state.common.menuList)
    }
  },
  mounted() {
    this.$store.commit('setMenuList', this.menuList)
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/myCenter/index.scss';
.other-style {
  background-color: transparent !important;
  padding: 0;
}
</style>
