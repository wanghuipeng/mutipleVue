<template>
  <div>
    <div class="position-item">
      <div class="item-body">
        <div class="position-info">
          <div class="name">
            <el-link
              v-if="renderInfo.statusNo !== 5"
              :underline="false"
              class="name-link"
              @click="lookDetail"
            >{{ renderInfo.title }}</el-link>
            <el-link
              v-else
              :underline="false"
              class="name-link"
              @click="toDetail(`/positionDetail?positionId=${renderInfo.id}`)"
            >{{ renderInfo.title }}</el-link>
            <el-tag v-if="renderInfo.positionType" size="small" class="name-tag">{{ renderInfo.positionType | filterCommonDict(dictData.dicts.positionType) }}</el-tag>
          </div>
          <div v-if="renderInfo.positionLabel.length" class="tag">
            <el-tag
              v-for="(item, index) in renderInfo.positionLabel"
              :key="index"
              effect="dark"
              :class="['7'].indexOf(item) !== -1 ? 'red' : (['3', '4', '6'].indexOf(item) !== -1 ? 'orange' : 'blue')"
            >{{ item | filterCommonDict(dictData.dicts.positionTag) }}</el-tag>
          </div>
          <p class="sub">
            <span class="price">
              <span v-if="renderInfo.salaryType === 1">
                {{ renderInfo.salaryStart / 10000 }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 10000 }}</span>万/年
              </span>
              <span v-if="renderInfo.salaryType === 2 && renderInfo.monthlySalaryRegime">
                {{ renderInfo.salaryStart / 1000 }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 1000 }}</span>
                K*{{ renderInfo.monthlySalaryRegime }}薪
              </span>
              <span v-if="renderInfo.salaryType === 2 && !renderInfo.monthlySalaryRegime">
                {{ renderInfo.salaryStart / 1000 }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd / 1000 }}</span>K/月
              </span>
              <span v-if="renderInfo.salaryType === 3">
                {{ renderInfo.salaryStart }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd }}</span>元/天
              </span>
              <span v-if="renderInfo.salaryType === 4">
                {{ renderInfo.salaryStart }}<span
                  v-if="renderInfo.salaryStart !== renderInfo.salaryEnd"
                >-{{ renderInfo.salaryEnd }}</span>元/小时
              </span>
              <span v-if="renderInfo.salaryType === 5">面议</span>
              <span>· {{ renderInfo.workCityId | filterLevel2(dictData.areas) }}</span>
              <span
                v-if="renderInfo.degreeRequired"
              >· {{ renderInfo.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}</span>
              · 招聘{{ renderInfo.recruitmentNumber }}人
            </span>
          </p>
        </div>
        <div class="company-info">
          <img v-if="renderInfo.logoImg" :src="renderInfo.logoImg" class="info-avatar" />
          <img v-else src="~@/assets/images/common/company_logo.png" class="info-avatar" />
          <div class="info-main">
            <el-link
              :underline="false"
              class="main-title"
              @click="toDetail(`/companyDetail?tab=companyDescription&companyId=${renderInfo.companyId}`)"
            >{{ renderInfo.replaceName }}</el-link>
            <p class="main-sub">
              {{ renderInfo.industrys1 | filterCommonDict(dictData.industry) }}
              <span
                v-if="renderInfo.financing"
              >({{ renderInfo.financing | filterCommonDict(dictData.dicts.financing) }})</span>
            </p>
          </div>
        </div>
      </div>
      <div class="item-footer">
        <div class="des">
          <div v-if="renderInfo.positionType === 1">
            <p class="tag">预计佣金：<i>{{ renderInfo.commissionAmount }}<span v-if="renderInfo.commissionSettlementType === 1">({{ renderInfo.commissionRatio }}%)</span></i>
              <el-tooltip v-if="renderInfo.commissionSupplement" effect="dark" placement="top">
                <div slot="content" style="max-width: 200px;">{{ renderInfo.commissionSupplement }}</div>
                <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
              </el-tooltip>
            </p>
            <p class="tag">佣金分成：<i>{{ renderInfo.hhCommissionRatio }}%</i>
              <el-tooltip
                v-if="renderInfo.recommendedSupplementaryNotes"
                effect="dark"
                placement="top"
              >
                <div
                  slot="content"
                  style="max-width: 200px;"
                >{{ renderInfo.recommendedSupplementaryNotes }}</div>
                <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
              </el-tooltip>
            </p>
            <p class="tag">保证期：<i>{{ renderInfo.guaranteePeriod }}<span v-if="renderInfo.guaranteePeriodType === 2">个</span>{{ renderInfo.guaranteePeriodType | filterCommonDict(dictData.dicts.guaranteePeriodType) }}</i></p>
          </div>
          <div v-if="renderInfo.positionType === 2">
            <p class="des-text">{{ renderInfo.commissionSupplementDescription || '暂无佣金说明' }}</p>
          </div>
        </div>
        <div class="btn">
          <el-button class="cancel-btn" @click="sendMsg(renderInfo.dockPmId)"><i class="icon iconfont icon-bianzu81" />咨询</el-button>
          <el-button
            v-if="renderInfo.isProject === 1"
            class="cancel-btn"
            @click="toDetail(`/projectDetail?positionId=${renderInfo.id}`)"
          >项目详情</el-button>
          <el-button v-else class="cancel-btn" @click="addProject(renderInfo.id)"><i class="icon iconfont icon-bianzu9" />加入项目</el-button>
          <!-- <el-popover placement="bottom-end" trigger="click">
            <div class="item">
              <el-button type="text" @click="recommendCheck(renderInfo)">推荐查重</el-button>
            </div>
            <div v-if="renderInfo.statusNo === 3" class="item">
              <el-button type="text" @click="sharerPosition(renderInfo)">邀请猎头</el-button>
            </div>
            <div v-if="renderInfo.isOrder === 1" class="item">
              <el-button type="text" @click="cancelOrder(renderInfo.id)">取消接单</el-button>
            </div>
            <i slot="reference" class="more-operate icon iconfont icon-zhiwei-quanbuzhiwei6" />
          </el-popover> -->
        </div>
      </div>
    </div>
    <!-- 推荐查重模态框 -->
    <recommend-check ref="modalForm" />
    <!-- 分享职位模态框 -->
    <share-position ref="modalShare" />
    <!-- 聊天 -->
    <dialog-chat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import recommendCheck from '../modules/recommendCheck'
import sharePosition from '../modules/sharePosition'
import dialogChat from '@/components/common/dialogChat.vue'
import { addProjectPosition, addPositionOrderRecord, cancelOrderById } from '@/api/position'
export default {
  components: {
    recommendCheck,
    sharePosition,
    dialogChat
  },
  props: {
    // 职位信息
    positionInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 聊天对话框是否显示
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的职位信息
    renderInfo() {
      const data = Object.assign({}, this.positionInfo)
      data.positionLabel = this.positionInfo.positionLabel
        ? this.positionInfo.positionLabel.split(',')
        : []
      return data
    }
  },
  mounted() {},
  methods: {
    // 联系TA
    connectMsg() {
      this.$store
        .dispatch(
          'checkoutConversation',
          `C2C${this.$store.state.userInfo.cwUserId}`
        )
        .then(() => {
          this.dialogVisible = true
          const textMsg = this.tim.createTextMessage({
            to: this.toAccount,
            conversationType: this.currentConversationType,
            payload: {
              text: '您好，我想接单这个职位，请尽快帮我完成实名认证。'
            }
          })
          setTimeout(() => {
            this.$store.commit('pushCurrentMessageList', textMsg)
            this.tim.sendMessage(textMsg).catch(error => {
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          }, 0)
          const data = {
            type: 'position',
            positionId: this.positionInfo.id,
            positionName: this.positionInfo.title,
            minSalary: this.positionInfo.salaryStart,
            maxSalary: this.positionInfo.salaryEnd,
            companyLogo: this.positionInfo.logoImg,
            company: this.positionInfo.companyName,
            industry1: this.positionInfo.industrys1,
            industry2: this.positionInfo.industrys2,
            phase: this.positionInfo.financing
          }
          console.log('传参', data)
          const message = this.tim.createCustomMessage({
            to: this.toAccount,
            conversationType: this.currentConversationType,
            payload: {
              data: JSON.stringify(data),
              description: '',
              extension: ''
            }
          })
          setTimeout(() => {
            this.$store.commit('pushCurrentMessageList', message)
            this.tim.sendMessage(message).catch(error => {
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          }, 0)
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 咨询
    sendMsg(id) {
      this.$store
        .dispatch('checkoutConversation', `C2C${id}`)
        .then(() => {
          this.dialogVisible = true
          const data = {
            type: 'position',
            positionId: this.positionInfo.id,
            positionName: this.positionInfo.title,
            minSalary: this.positionInfo.salaryStart,
            maxSalary: this.positionInfo.salaryEnd,
            companyLogo: this.positionInfo.logoImg,
            company: this.positionInfo.companyName,
            industry1: this.positionInfo.industrys1,
            industry2: this.positionInfo.industrys2,
            phase: this.positionInfo.financing,
            desc: ''
          }
          const message = this.tim.createCustomMessage({
            to: this.toAccount,
            conversationType: this.currentConversationType,
            payload: {
              data: JSON.stringify(data),
              description: '',
              extension: ''
            }
          })
          setTimeout(() => {
            this.$store.commit('pushCurrentMessageList', message)
            this.tim.sendMessage(message).catch(error => {
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          }, 0)
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 加入项目
    addProject(id) {
      const para = {}
      para.positionId = id
      addProjectPosition(para).then(res => {
        this.$set(this.positionInfo, 'isProject', 1)
      })
    },
    // 接单
    acceptOrder(id) {
      const certificationStatus = this.$store.state.common.userProfile
        .certificationStatus
      if (Number(certificationStatus) === 0) {
        this.$confirm(
          '为了保证您和候选人的合法权益，我们需要认证您的身份信息。此信息完全保密，请放心填写',
          '实名认证邀请',
          {
            confirmButtonText: '去认证',
            cancelButtonText: '暂不认证',
            type: 'info'
          }
        )
          .then(() => {
            this.$router.push({ name: 'identification' })
          })
          .catch(() => {
            console.log('用户点击取消')
          })
      } else if (Number(certificationStatus) === 1) {
        const para = {}
        para.positionId = id
        addPositionOrderRecord(para).then(res => {
          this.$set(this.positionInfo, 'isOrder', 1)
        })
      } else if (Number(certificationStatus) === 2) {
        this.$confirm(
          '您的认证申请正在审核中，通过后即可进行接单。请耐心等待，如果有问题可直接联系PM',
          '认证中',
          {
            confirmButtonText: '联系PM',
            cancelButtonText: '暂不联系',
            type: 'info'
          }
        )
          .then(() => {
            this.connectMsg()
          })
          .catch(() => {
            console.log('用户点击取消')
          })
      } else if (Number(certificationStatus) === 3) {
        this.$confirm(
          '您的认证未通过，请修改并重新提交您的认证资料',
          '认证未通过',
          {
            confirmButtonText: '去修改',
            type: 'info'
          }
        ).then(() => {
          this.$router.push({ name: 'identification' })
        })
      }
    },
    // 推荐查重
    recommendCheck(row) {
      this.$refs.modalForm.edit(row)
    },
    // 分享职位
    sharerPosition(row) {
      this.$refs.modalShare.edit(row)
    },
    // 取消接单
    cancelOrder(id) {
      this.$confirm('是否取消接单', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {}
          para.id = id
          cancelOrderById(para).then(res => {
            this.$set(this.positionInfo, 'isOrder', 0)
          })
        })
        .catch(() => {})
    },
    // 新窗口打开页面
    toDetail(url) {
      window.open(url)
    },
    // 打开详情模态框
    lookDetail() {
      this.$emit('lookDetail', this.positionInfo.id)
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.position-item {
  display: block;
  padding: 24px 0;
  margin: 0 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  .item-body {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .position-info {
      width: 65%;
      .name{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .name-link {
          font-size: 18px;
          color: #1a1a1aff;
          font-weight: bold;
          &:hover {
            color: $main-color;
            text-decoration: underline;
          }
        }
        .name-tag{
          margin-left: 10px;
        }
      }
      .tag {
        margin-bottom: 10px;
        .el-tag {
          border: none;
          padding: 0 5px;
          height: 20px;
          line-height: 19px;
          margin-right: 10px;
          border-radius: 2px;
          background: transparent;
          &.red {
            border: 1px solid $red-color;
            color: $red-color;
          }
          &.orange {
            border: 1px solid $orange-color;
            color: $orange-color;
          }
          &.blue {
            border: 1px solid $main-color;
            color: $main-color;
          }
        }
      }
      .sub {
        font-size: 14px;
        .price {
          color: #949699;
          margin-right: 40px;
        }
        .power {
          color: #808080;
          i {
            font-style: normal;
            color: $green-color;
          }
        }
      }
    }
    .company-info {
      width: 35%;
      display: flex;
      .info-avatar{
        flex: none;
        display: block;
        width: 48px;
        height: 48px;
        margin-right: 16px;
        object-fit: cover;
      }
      .info-main {
        .main-title {
          font-size: 18px;
          color: #323232ff;
          font-weight: bold;
          margin-bottom: 4px;
          &:hover {
            color: $main-color;
            text-decoration: underline;
          }
        }
        .main-sub {
          font-size: 14px;
          color: #7F7F7F;
        }
      }
    }
  }
  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .des {
      width: 65%;
      .tag {
        display: inline-block;
        margin-right: 20px;
        font-size: 14px;
        color: #2E3033;
        &:last-child {
          margin-right: 0;
        }
        i {
          color: $red-color;
          font-style: normal;
        }
        .icon {
          font-size: 14px;
          color: $main-color;
          margin-left: 5px;
        }
      }
      .des-text{
        font-size: 14px;
        color: #F8A53A;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding-right: 15px;
      }
    }
    .btn {
      width: 35%;
      .el-button{
        width: 84px;
        padding: 0;
      }
      .el-button+.el-button{
        margin-left: 16px;
      }
    }
  }
}
</style>

