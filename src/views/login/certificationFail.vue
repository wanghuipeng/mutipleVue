<template>
  <div class="wrap">
    <div class="main">
      <div class="panel" style="width: 1200px;">
        <div class="panel-body">
          <div class="body-main">
            <div class="main-title">
              <p class="title-name">企业认证</p>
              <p class="title-sub">根据国家相关规定的要求，您需要进行企业信息认证，认证完成后即可正常发布职位</p>
            </div>
            <div class="main-content">
              <div class="content-step">
                <div class="step-item">
                  <span class="item-num">①</span> 填写认证资料
                </div>
                <div class="step-item active">
                  <span class="item-num">②</span> 认证审核
                </div>
                <div class="step-item">
                  <span class="item-num">③</span> 完成认证
                </div>
              </div>
              <div class="content-info">
                <p class="info-title">
                  <i class="el-icon-warning" style="font-size: 14px;color: #f00;margin-right: 5px;"></i>抱歉，您的认证未通过，请重新提交认证
                </p>
                <div class="info-main">
                  <div class="main-item">
                    <span class="item-label">失败原因</span>
                    <span class="item-value">{{ certificationInfo.auditFailureReason }}</span>
                  </div>
                  <div class="main-item">
                    <span class="item-label">审核备注</span>
                    <span class="item-value">{{ certificationInfo.auditRemark }}</span>
                  </div>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  class="info-btn"
                  @click="resetSubmit"
                >重新提交</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyCertificationByUserId } from '@/api/login'
export default {
  data() {
    return {
      certificationInfo: {}
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    document.title = '企业认证-大猎英才'
    // 获取企业认证信息
    this.queryCertificationInfo();
  },
  methods: {
    // 重新提交
    resetSubmit() {
      this.$router.push('/certification');
    },
    // 获取企业认证信息
    queryCertificationInfo() {
      const para = {}
      getCompanyCertificationByUserId(para).then(res => {
        this.certificationInfo = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/login/common.scss';
.body-main{
  width: 100%;
  .main-title{
    padding: 20px 20px 12px;
    border: 1px solid #CDCDCD;
    .title-name{
      font-size: 18px;
      color: #14171A;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .title-sub{
      font-size: 12px;
      color: #999999;
    }
  }
  .main-content{
    padding: 40px 250px;
    .content-step{
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 40px;
      &:after{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #999999;
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1;
      }
      .step-item{
        padding: 0 10px;
        font-size: 14px;
        color: #999999;
        background-color: #fff;
        position: relative;
        z-index: 9;
        &.active{
          color: $main-color;
        }
        .item-num{
          font-size: 16px;
        }
      }
    }
    .content-info{
      .info-title{
        text-align: center;
        font-size: 14px;
        color: #999999;
        margin-bottom: 40px;
        .title-chat{
          color: $main-color;
          cursor: pointer;
        }
      }
      .info-main{
        width: 600px;
        padding: 20px;
        box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.2);
        border-radius: 4px;
        margin: 0 auto;
        .main-name{
          font-size: 14px;
          color: #333333;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .main-item{
          display: flex;
          margin-bottom: 12px;
          &:last-child{
            margin-bottom: 0;
          }
          .item-label{
            width: 100px;
            font-size: 12px;
            color: #999999;
          }
          .item-value{
            font-size: 12px;
            color: #333333;
            img{
              display: block;
              width: 96px;
              height: 137px;
            }
          }
        }
      }
      .info-btn{
        display: block;
        margin: 40px auto 0;
      }
    }
  }
}
</style>

