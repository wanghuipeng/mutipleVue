<template>
  <div class="wrap">
    <all :subscription-params="subscriptionParams" :selected-folder="selectedFolder" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import all from './all'
export default {
  components: {
    all
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      subscriptionParams: state => {
        return state.subscriptionParams
      },
      selectedFolder: state => {
        return {
          name: state.subscriptionParams.name,
          remark: ''
        }
      }
    })
  },
  mounted() {
    document.title = '我的订阅-大猎英才'
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {}
</style>

