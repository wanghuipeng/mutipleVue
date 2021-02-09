<template>
  <div class="home">
    <div class="tab">
      <el-radio-group v-if="companyRole === 4" v-model="switchTab" size="mini" @change="changeWorkbench">
        <el-radio-button :label="1">企业工作台</el-radio-button>
        <el-radio-button :label="2">个人工作台</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 企业 -->
    <company :data-type="switchTab" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import company from './workbench/company'
export default {
  components: {
    company
  },
  data() {
    return {
      switchTab: 1
    }
  },
  computed: {
    ...mapState({
      companyRole: state => state.userInfo.companyRole
    })
  },
  created() {
    this.switchTab = this.companyRole === 4 ? 1 : 2
    document.title = '首页-大猎英才'
  },
  methods: {
    changeWorkbench(e) {
      this.switchTab = e
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 16px 0;
  .tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
    p {
      &:last-child {
        font-size: 14px;
        color: #14171A;
        margin-left: auto;
      }
      span {
        font-weight: 500;
        position: relative;
        cursor: pointer;
        &:last-child::after {
          content: '';
          width: 1px;
          height: 14px;
          border-left: 1px solid #B3B3B3;
          position: absolute;
          top: 3px;
          left: -10px;
        }
        &.active {
          color: #1678F9;
        }
      }
      span + span {
        margin-left: 20px;
      }
    }
  }
}
</style>
