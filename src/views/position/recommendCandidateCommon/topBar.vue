<template>
  <div class="wrap">
    <div class="top-info">
      <div class="position-info">
        <p class="info-title">
          <span
            v-if="renderInfo.statusNo !== 5"
            class="title-name"
            @click="lookDetail"
          >{{ renderInfo.title }}</span>
          <span
            v-else
            class="title-name"
            @click="toDetail(`/positionDetail?positionId=${renderInfo.id}`)"
          >{{ renderInfo.title }}</span>
          <span class="title-address">
            [{{ renderInfo.workCityId | filterLevel2(dictData.areas) }}
            <span
              v-if="renderInfo.degreeRequired"
            >·</span>
            {{ renderInfo.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}
            <span
              v-if="renderInfo.workYearRequired"
            >·</span>
            {{ renderInfo.workYearRequired }}]
          </span>
        </p>
        <p class="info-sub">
          <span class="sub-power">
            佣金：{{ renderInfo.commissionAmount }}
            <span
              v-if="renderInfo.commissionSettlementType === 1"
            >（{{ renderInfo.commissionRatio }}%）</span>
            <span v-if="renderInfo.salaryType === 1">
              · 年薪：{{ renderInfo.salaryStart / 10000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 10000 }}</span>万/年
            </span>
            <span v-if="renderInfo.salaryType === 2 && renderInfo.monthlySalaryRegime">
              · 月薪：{{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K*{{ renderInfo.monthlySalaryRegime }}薪
            </span>
            <span v-if="renderInfo.salaryType === 2 && !renderInfo.monthlySalaryRegime">
              · 月薪：{{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K/月
            </span>
            <span v-if="renderInfo.salaryType === 3">
              · 日薪：{{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/天
            </span>
            <span v-if="renderInfo.salaryType === 4">
              · 时薪：{{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/小时
            </span>
            <span v-if="renderInfo.salaryType === 5">
              · 薪资：面议
            </span>
            <span> · 保证期：{{ renderInfo.guaranteePeriod }}</span>
            <span v-if="renderInfo.guaranteePeriodType === 2">个</span>
            {{ renderInfo.guaranteePeriodType | filterCommonDict(dictData.dicts.guaranteePeriodType) }}
          </span>
        </p>
      </div>
      <div class="company-info">
        <p class="info-title">
          <img v-if="companyInfo.logoImg" class="title-logo" :src="companyInfo.logoImg" />
          <img v-else class="title-logo" src="~@/assets/images/common/company_avatar.png" />
          <span
            class="title-name ellipsis"
            @click="toDetail(`/companyDetail?tab=companyDescription&companyId=${companyInfo.id}`)"
          >{{ companyInfo.shortName }}</span>
        </p>
        <p
          class="info-sub"
        >{{ companyInfo.industrys1 | filterCommonDict(dictData.industry) }} · {{ companyInfo.financing | filterCommonDict(dictData.dicts.financing) }}</p>
      </div>
    </div>
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + renderInfo.id"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="renderInfo.id" />
    </drawer-common>
  </div>
</template>

<script>
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
export default {
  components: {
    drawerCommon,
    positionDetail
  },
  props: {
    // 职位信息
    positionInfo: {
      type: Object,
      required: true
    },
    // 企业信息
    companyInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 是否显示详情模态框
      positionDetailVisible: false
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的职位信息
    renderInfo() {
      const data = Object.assign({}, this.positionInfo)
      if (data.workYearRequiredStart && data.workYearRequiredEnd) {
        data.workYearRequired =
          data.workYearRequiredStart + '~' + data.workYearRequiredEnd + '年'
      } else if (data.workYearRequiredStart) {
        data.workYearRequired = data.workYearRequiredStart + '年以上'
      } else if (data.workYearRequiredEnd) {
        data.workYearRequired = data.workYearRequiredEnd + '年以下'
      }
      return data
    }
  },
  mounted() {},
  methods: {
    // 打开详情模态框
    lookDetail() {
      this.positionDetailVisible = true
    },
    // 新窗口打开页面
    toDetail(url) {
      window.open(url)
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .top-info {
    display: flex;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    .position-info {
      flex: auto;
      .info-title {
        line-height: 28px;
        margin-bottom: 8px;
        .title-name {
          font-size: 18px;
          color: #1a1a1aff;
          font-weight: 600;
          cursor: pointer;
          &:hover {
            color: $main-color;
            text-decoration: underline;
          }
        }
        .title-address {
          font-size: 14px;
          color: #7f7f7f;
          margin-right: 20px;
        }
      }
      .info-sub {
        font-size: 14px;
        color: #7f7f7f;
      }
    }
    .company-info {
      width: 280px;
      margin-left: 20px;
      flex: none;
      .info-title {
        display: flex;
        line-height: 28px;
        margin-bottom: 8px;
        .title-logo {
          display: block;
          width: 28px;
          height: 28px;
          border-radius: 3px;
          margin-right: 16px;
          object-fit: cover;
        }
        .title-name {
          font-size: 18px;
          color: #1a1a1aff;
          font-weight: 600;
          cursor: pointer;
          &:hover {
            color: $main-color;
            text-decoration: underline;
          }
        }
      }
      .info-sub {
        font-size: 14px;
        color: #7f7f7f;
      }
    }
  }
}
</style>

