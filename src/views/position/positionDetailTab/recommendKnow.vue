<template>
  <div class="wrap">
    <!-- 付费规则 -->
    <div v-if="renderInfo.paymentRules" class="panel">
      <p class="panel-title">付费规则</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.paymentRules }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 归属权判定规则 -->
    <div v-if="renderInfo.attributionRule" class="panel">
      <p class="panel-title">归属权判定规则</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.attributionRule }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 做单规则 -->
    <div v-if="renderInfo.singleRule" class="panel">
      <p class="panel-title">做单规则</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.singleRule }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 补充说明 -->
    <div v-if="renderInfo.addInstructions" class="panel">
      <p class="panel-title">补充说明</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.addInstructions }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 推荐须知信息
    companyRecommendInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的企业推荐须知信息
    renderInfo() {
      const data = Object.assign({}, this.companyRecommendInfo)
      return data
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .panel {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .panel-title {
      font-size: 15px;
      color: #191919ff;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .panel-body {
      .list {
        line-height: 20px;
        font-size: 14px;
        color: #4d4d4dff;
        li {
          display: flex;
          .title {
            flex: none;
          }
          .content {
            white-space: pre-wrap;
            flex: auto;
          }
        }
      }
    }
  }
}
</style>

