<template>
  <div>
    <list></list>
  </div>
</template>

<script>
import list from '../list/index'

export default {
  components: {
    list
  },
  data() {
    return {}
  },
  created() {
    document.title = '订单（过保阶段）-大猎英才'
  }
}
</script>

<style lang="scss" scoped>

</style>
