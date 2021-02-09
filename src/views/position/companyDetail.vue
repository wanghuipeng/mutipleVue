<template>
  <div class="wrap-box">
    <!-- 公司信息 -->
    <div class="company-info">
      <div class="info-logo">
        <img v-if="renderInfo.logoImg" :src="renderInfo.logoImg" />
        <img v-else src="~@/assets/images/common/company_avatar.png" />
      </div>
      <div class="info-main">
        <p class="main-title">
          <span class="title-name">{{ renderInfo.shortName }}</span>
          <el-tag
            v-for="(item, index) in renderInfo.areasInvolved"
            :key="index"
            effect="dark"
            :class="index % 2 === 0 ? 'red' : 'blue'"
          >{{ item | filterCommonDict(dictData.dicts.involvedField) }}</el-tag>
        </p>
        <p
          class="main-sub"
        >{{ renderInfo.industrys1 | filterCommonDict(dictData.industry) }} | {{ renderInfo.cityId | filterLevel2(dictData.areas) }} | {{ renderInfo.style | filterCommonDict(dictData.dicts.enterpriseProperty) }} | {{ renderInfo.financing | filterCommonDict(dictData.dicts.financing) }} | {{ renderInfo.scale | filterCommonDict(dictData.dicts.enterpriseScale) }}</p>
      </div>
      <div class="info-btn">
        <el-button v-if="renderInfo.isFollow === 1" class="confirm-btn" @click="cancelFollow">取消关注</el-button>
        <el-button v-else class="cancel-btn" @click="handleFollow">关注</el-button>
      </div>
    </div>
    <!-- tab切换 -->
    <el-tabs v-model="tab">
      <el-tab-pane label="在招职位" name="onMovePosition">
        <on-move-position :company-info="companyInfo" />
      </el-tab-pane>
      <el-tab-pane label="公司简介" name="companyDescription">
        <company-description :company-info="companyInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import onMovePosition from './companyDetailTab/onMovePosition'
import companyDescription from './companyDetailTab/companyDescription'
import {
  getCompanyDetail,
  followComapny,
  deleteUserFollowCompany
} from '@/api/position'
export default {
  components: {
    onMovePosition,
    companyDescription
  },
  data() {
    return {
      // 默认展示TAB
      tab: this.$route.query.tab || 'onMovePosition',
      // 企业信息
      companyInfo: {
        id: this.$route.query.companyId
      }
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的企业信息
    renderInfo() {
      const data = Object.assign({}, this.companyInfo)
      data.areasInvolved = this.companyInfo.areasInvolved
        ? this.companyInfo.areasInvolved.split(',')
        : []
      return data
    }
  },
  mounted() {
    // 查询企业信息
    this.queryCompanyInfo()
  },
  methods: {
    // 关注
    handleFollow() {
      const para = {}
      para.dataId = this.companyInfo.id
      followComapny(para).then(res => {
        this.$set(this.companyInfo, 'isFollow', 1)
      })
    },
    // 取消关注
    cancelFollow() {
      const para = {}
      para.dataId = this.companyInfo.id
      deleteUserFollowCompany(para).then(res => {
        this.$set(this.companyInfo, 'isFollow', 0)
      })
    },
    // 查询企业信息
    queryCompanyInfo() {
      const para = Object.assign({}, this.companyInfo)
      getCompanyDetail(para).then(res => {
        this.companyInfo = res.data
        // 查询到企业信息后才更改页面title
        document.title =
          '『' + this.companyInfo.shortName + '』企业主页-大猎英才'
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/common/imgShadow.scss';
@import '@/assets/sass/position/common.scss';
.wrap-box {
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 180px;
    position: absolute;
    left: 0;
    top: 44px;
    background-color: #ecececff;
  }
  .company-info {
    display: flex;
    padding: 20px 0 60px;
    position: relative;
    z-index: 10;
    .info-logo {
      @include imgShadow(100px, 100px, 8px, 1px 2px 6px 0px rgba(0, 0, 0, 0.2));
    }
    .info-main {
      flex: auto;
      padding: 0 20px;
      .main-title {
        height: 42px;
        line-height: 42px;
        padding-top: 7px;
        margin-bottom: 16px;
        .title-name {
          font-size: 30px;
          color: #000000ff;
          font-weight: bold;
          margin-right: 20px;
          vertical-align: sub;
        }
        .el-tag {
          border: none;
          height: 28px;
          line-height: 28px;
          margin-right: 10px;
          border-radius: 4px;
          background: transparent;
          &.red {
            border: 1px solid $red-color;
            color: $red-color;
          }
          &.blue {
            border: 1px solid $main-color;
            color: $main-color;
          }
        }
      }
      .main-sub {
        font-size: 16px;
        color: #7f7f7f;
      }
    }
    .info-btn {
      padding: 10px 0;
      width: 100px;
      .el-button {
        width: 100px;
        text-align: center;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        font-size: 16px;
        margin: 5px 0;
      }
    }
  }
  .el-tabs {
    ::v-deep .el-tabs__header {
      margin-bottom: 10px;
      .el-tabs__item {
        line-height: 28px;
        font-size: 18px;
        color: #808080ff;
        &.is-active {
          color: $main-color;
        }
      }
      .el-tabs__active-bar {
        background-color: $main-color;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #b3b3b3ff;
      }
    }
  }
}
</style>

