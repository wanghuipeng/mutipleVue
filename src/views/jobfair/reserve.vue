<template>
  <div class="wrap">
    <!-- banner -->
    <div class="banner">
      <div class="banner-main">
        <img :src="info.showImagePc" />
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="content">
      <div class="content-main">
        <!-- 步骤条 -->
        <div class="step-bar">
          <img src="@/assets/images/jobfair/step-bar.png" class="bar-bg" />
          <div class="bar-main">
            <p class="main-item ellipsis" style="padding: 0 20px;">
              <span class="item-text">企业参展流程</span>
            </p>
            <p class="main-item ellipsis" style="padding: 0 60px;">
              <span class="item-text">企业订展</span>
            </p>
            <p class="main-item ellipsis" style="padding: 0 66px;">
              <span class="item-text">发布参展职位</span>
            </p>
            <p class="main-item ellipsis" style="padding: 0 20px 0 45px;text-align: center;">
              <span
                class="item-text"
                style="font-size: 16px;"
              >{{ info.startFormat }} - {{ info.endFormat }}</span>
              <span class="item-text" style="font-size: 14px;">招聘会开启</span>
            </p>
          </div>
        </div>
        <!-- 主体面板 -->
        <div class="main-box">
          <div v-if="status === 'wait' || status === 'start'" class="box-brage">
            <img src="@/assets/images/jobfair/brage-bg.png" class="brage-bg" />
            <p class="brage-text">距离招聘会开始还剩</p>
          </div>
          <div class="box-main">
            <div v-if="status === 'wait'" class="main-left">
              <div class="time-count">
                <span v-for="(item, index) in d" :key="index" class="count-item">{{ item }}</span>
                <span class="count-text">天</span>
                <span v-for="(item, index) in h" :key="index" class="count-item">{{ item }}</span>
                <span class="count-text">时</span>
                <span v-for="(item, index) in m" :key="index" class="count-item">{{ item }}</span>
                <span class="count-text">分</span>
                <span v-for="(item, index) in s" :key="index" class="count-item">{{ item }}</span>
                <span class="count-text">秒</span>
              </div>
              <div class="entry-btn" @click="companyEnter">
                <img src="@/assets/images/jobfair/entry-btn.png" />
              </div>
            </div>
            <div v-if="status === 'start'" class="main-left">
              <img src="@/assets/images/jobfair/box-bg.png" class="box-bg" />
              <div class="time-show">
                <p class="show-title">招聘会持续时间：</p>
                <p class="show-main">{{ info.startFormat }} - {{ info.endFormat }}</p>
              </div>
              <div class="entry-btn" @click="companyEnter">
                <img src="@/assets/images/jobfair/entry-btn.png" />
              </div>
            </div>
            <div v-if="status === 'stop'" class="main-left">
              <p class="stop-text">本场招聘会已结束</p>
            </div>
            <div class="main-right">
              <div>
                <img :src="info.shareQrCodeImage" />
                <p>扫描上方二维码可预览招聘会</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 主体介绍 -->
        <div class="main-des" v-html="info.jobFairDetail"></div>
      </div>
    </div>
    <!-- 底部版权 -->
    <!-- <div class="footer">
      <div class="footer-main">Copyright ©2020 上海大猎英才科技有限公司 保留所有权利 沪ICP备19047210号-1</div>
    </div>-->

    <!-- 登录模态框 -->
    <login
      ref="login"
      @upgrade="upgrade"
      @forgetPassword="forgetPassword"
      @enterJoin="enterJoin"
      @updateIsJoin="updateIsJoin"
    />

    <!-- 忘记密码模态框 -->
    <forget-password ref="forgetPassword" @login="login" />

    <!-- 注册模态框 -->
    <upgrade ref="upgrade" @login="login" @material="material" />

    <!-- 完善资料模态框 -->
    <material ref="material" @login="login" @enterJoin="enterJoin" />

    <!-- 确认参展模态框 -->
    <enter-join ref="enterJoin" @joinSuccess="joinSuccess" />

    <!-- 参展成功模态框 -->
    <join-success ref="joinSuccess" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getJobFairIntroductionVO } from '@/api/jobfair'
import { formatTime } from '@/utils/common'
import login from '@/views/login/modules/login'
import forgetPassword from '@/views/login/modules/forgetPassword'
import upgrade from '@/views/login/modules/upgrade'
import material from '@/views/login/modules/material'
import enterJoin from './modules/enterJoin'
import joinSuccess from './modules/joinSuccess'
export default {
  components: {
    login,
    forgetPassword,
    upgrade,
    material,
    enterJoin,
    joinSuccess
  },
  data() {
    return {
      jobFairBaseId: '', // 展会code
      info: {}, // 招聘数据
      status: '', // 当前招聘会所属状态
      d: '',
      h: '',
      m: '',
      s: ''
    }
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLogin
      },
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  mounted() {
    document.title = '招聘会-大猎英才'
    this.jobFairBaseId = this.$route.query.jobFairBaseId
    // 首页数据
    this.getData()
  },
  methods: {
    // 倒计时
    countTime(curr, start) {
      // 时间差
      const leftTime = start - curr
      // 定义变量 d,h,m,s保存倒计时的时间
      const d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
      this.d = d + ''
      const h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      this.h = h >= 10 ? h + '' : '0' + h
      const m = Math.floor((leftTime / 1000 / 60) % 60)
      this.m = m >= 10 ? m + '' : '0' + m
      const s = Math.floor((leftTime / 1000) % 60)
      this.s = s >= 10 ? s + '' : '0' + s
      // 递归每秒调用countTime方法，显示动态时间效果
      setTimeout(() => {
        const newCurr = curr + 1000
        if (newCurr >= start) {
          this.status = 'start'
        } else {
          this.countTime(newCurr, start)
        }
      }, 1000)
    },
    // 首页数据
    getData() {
      const params = {
        jobFairId: this.jobFairBaseId
      }
      getJobFairIntroductionVO(params).then(res => {
        res.data.currentDate = res.data.currentDate.replace(/-/g, '/')
        res.data.startTime = res.data.startTime.replace(/-/g, '/')
        res.data.endTime = res.data.endTime.replace(/-/g, '/')
        res.data.startFormat = formatTime(new Date(res.data.startTime)).ymd
        res.data.endFormat = formatTime(new Date(res.data.endTime)).ymd
        this.info = res.data
        const curr = new Date(res.data.currentDate).getTime()
        const start = new Date(res.data.startTime).getTime()
        const end = new Date(res.data.endTime).getTime()
        if (curr < start) {
          this.status = 'wait'
          // 倒计时
          this.countTime(curr, start)
        } else if (curr >= start && curr < end) {
          this.status = 'start'
        } else {
          this.status = 'stop'
        }
      })
    },
    // 企业入住
    companyEnter() {
      if (!this.isLogin) {
        this.$refs.login.edit()
      } else if (!this.info.companyIsJoin) {
        this.enterJoin()
      } else {
        this.$confirm(
          '您已参展报名该招聘会了哦，是否需要去发布参展职位？',
          '温馨提示',
          {
            type: 'success',
            confirmButtonText: '前往发布职位'
          }
        )
          .then(() => {
            this.$router.push({ name: 'releasePosition' })
          })
          .catch(() => {})
      }
    },
    // 登录成功后更新是否参展字段
    updateIsJoin(companyIsJoin) {
      this.$set(this.info, 'companyIsJoin', companyIsJoin)
      this.companyEnter()
    },
    // 打开注册模态框
    upgrade() {
      this.$refs.upgrade.edit()
    },
    // 打开忘记密码模态框
    forgetPassword() {
      this.$refs.forgetPassword.edit()
    },
    // 打开登录模态框
    login() {
      this.$refs.login.edit()
    },
    // 打开完善资料模态框
    material() {
      this.$refs.material.edit()
    },
    // 打开确认参展模态框
    enterJoin() {
      if (this.userInfo.registerProcess === 1) {
        this.$refs.material.edit()
      } else {
        this.$refs.enterJoin.edit({
          jobFairId: this.jobFairBaseId
        })
      }
    },
    // 打开参展成功模态框
    joinSuccess() {
      this.$set(this.info, 'companyIsJoin', true)
      this.$refs.joinSuccess.edit(this.info)
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/jobfair/common.scss';
.wrap {
  background-color: #2d4059;
  .banner {
    .banner-main {
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .content {
    .content-main {
      width: 1120px;
      padding: 46px 0 40px;
      margin: 0 auto;
      .step-bar {
        height: 60px;
        margin-bottom: 78px;
        position: relative;
        .bar-bg {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
        }
        .bar-main {
          display: flex;
          height: 100%;
          align-items: center;
          position: relative;
          z-index: 5;
          .main-item {
            width: 25%;
            box-sizing: border-box;
            .item-text {
              display: block;
              font-size: 20px;
              font-weight: bold;
              color: #ffffff;
            }
          }
        }
      }
      .main-box {
        width: 899px;
        height: 311px;
        background-color: #fff;
        border-radius: 16px;
        margin: 0 auto 80px;
        position: relative;
        .box-brage {
          width: 518px;
          height: 77px;
          position: absolute;
          top: -28px;
          left: 27px;
          .brage-bg {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 3;
          }
          .brage-text {
            padding: 0 75px;
            line-height: 77px;
            font-size: 28px;
            color: #fff;
            position: relative;
            z-index: 5;
          }
        }
        .box-main {
          display: flex;
          height: 100%;
          justify-content: space-between;
          align-items: stretch;
          .main-left {
            width: 600px;
            position: relative;
            &:after {
              content: '';
              display: block;
              width: 1px;
              height: 160px;
              background-color: #ffe9dd;
              position: absolute;
              right: 0;
              top: 76px;
            }
            .time-count {
              display: flex;
              padding: 89px 0 40px;
              justify-content: center;
              align-items: center;
              position: relative;
              z-index: 5;
              .count-text {
                font-size: 20px;
                font-weight: bold;
                color: #15181b;
                margin: 0 3px;
              }
              .count-item {
                width: 40px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                font-size: 38px;
                font-weight: bold;
                color: #ffffff;
                background: linear-gradient(
                  135deg,
                  rgba(68, 239, 248, 1) 0%,
                  rgba(26, 174, 253, 1) 100%
                );
                border-radius: 6px;
                margin: 0 3px;
                position: relative;
                &:after {
                  content: '';
                  display: block;
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(
                    180deg,
                    rgba(232, 246, 255, 1) 0%,
                    rgba(248, 253, 255, 0) 100%
                  );
                  border-radius: 6px;
                  position: absolute;
                  left: 0;
                  bottom: -40px;
                }
              }
            }
            .box-bg {
              display: block;
              width: 599px;
              height: 335px;
              position: absolute;
              left: 0;
              bottom: 0;
              z-index: 3;
            }
            .time-show {
              padding: 93px 0 37px;
              text-align: center;
              color: #ff5d00;
              position: relative;
              z-index: 5;
              .show-title {
                font-size: 16px;
              }
              .show-main {
                font-size: 24px;
                font-weight: bold;
              }
            }
            .entry-btn {
              width: 317px;
              height: 94px;
              margin: 0 auto;
              cursor: pointer;
              position: relative;
              z-index: 5;
              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            .stop-text {
              width: 440px;
              height: 130px;
              text-align: center;
              line-height: 130px;
              font-size: 30px;
              font-weight: bold;
              color: #15181b;
              background: rgba(216, 216, 216, 1);
              border-radius: 12px;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-left: -220px;
              margin-top: -65px;
            }
          }
          .main-right {
            display: flex;
            width: 299px;
            justify-content: center;
            align-items: center;
            img {
              display: block;
              width: 160px;
              height: 160px;
              border-radius: 50%;
              margin-bottom: 12px;
            }
            p {
              font-size: 14px;
              color: #15181b;
            }
          }
        }
      }
      .main-des {
        color: #fff;
        ::v-deep * {
          color: #fff !important;
        }
        ::v-deep h3 {
          margin-bottom: 8px;
        }
        ::v-deep p {
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .footer {
    height: 40px;
    background-color: #223145;
    .footer-main {
      width: 1120px;
      height: 100%;
      text-align: center;
      line-height: 40px;
      font-size: 12px;
      color: #cdcdcd;
      margin: 0 auto;
    }
  }
}
</style>
