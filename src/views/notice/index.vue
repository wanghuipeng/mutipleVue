<template>
  <div class="notice">
    <chat />
  </div>
</template>

<script>
import chat from '@/components/common/chat.vue'
export default {
  components: {
    chat
  },
  data() {
    return {}
  },
  created() {
    document.title = '消息-大猎英才'
  }
}
</script>

<style lang="scss" scoped>
</style>
