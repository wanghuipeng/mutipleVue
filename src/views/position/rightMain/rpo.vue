<template>
  <div class="wrap">
    <all :position-type="2" :selected-folder="selectedFolder" />
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
        name: 'RPO职位',
        remark: ''
      }
    }
  },
  computed: {},
  mounted() {
    document.title = 'RPO职位-大猎英才'
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {}
</style>

