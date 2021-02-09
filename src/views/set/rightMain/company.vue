<template>
  <div class="app-container">
    <el-card shadow="never">
      <edit-company v-if="userInfo.companyId" title="企业信息" operator-type="edit" :company-id="userInfo.companyId" />
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import editCompany from '@/views/company/editCompany'
export default {
  components: {
    editCompany
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    console.log(this.userInfo)
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
}
</style>
