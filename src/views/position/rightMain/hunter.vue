<template>
  <div class="wrap">
    <all :position-type="1" :selected-folder="selectedFolder" />
  </div>
</template>

<script>
import all from './all'
export default {
  components: {
    all
  },
  data() {
    return {
      selectedFolder: {
        name: '猎头职位',
        remark: ''
      }
    }
  },
  computed: {},
  mounted() {
    document.title = '猎头职位-大猎英才'
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {}
</style>

