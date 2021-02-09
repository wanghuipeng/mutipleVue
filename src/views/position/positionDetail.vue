<template>
  <div class="wrap-box wrap-box-detail">
    <!-- 左侧主内容 -->
    <div class="left-main">
      <!-- 主体内容 -->
      <div class="main-content">
        <div class="title">
          <p>
            <span class="title-item">#{{ renderInfo.id }}</span>
            <span class="title-item">{{ renderInfo.releaseDateFormat }}发布</span>
            <span class="title-item">{{ renderInfo.updateTimeFormat }}更新</span>
          </p>
          <p v-if="currUserInfo.companyAccountType === 1 && !renderInfo.showData && (currUserInfo.companyRole === 2 || currUserInfo.companyRole === 3 || currUserInfo.companyRole === 4)">
            <span class="title-item link" @click="editPosition">编辑</span>
            <span v-if="renderInfo.statusNo === 3" class="title-item link" @click="changeStatus">下架</span>
            <span v-else class="title-item link" @click="changeStatus">重新上架</span>
          </p>
        </div>
        <div v-if="renderInfo.positionAnnouncement" :class="['announcement', {expand: isExpand}]">
          <p class="text">
            <b>公告：{{ renderInfo.positionAnnouncement }}</b>
            <span></span>
          </p>
          <el-link
            class="more"
            :underline="false"
            @click="isExpand = !isExpand"
          >{{ isExpand ? '收起' : '更多' }}</el-link>
        </div>
        <div class="important">
          <div class="info">
            <div class="info-main">
              <div class="main-left">
                <img v-if="companyRecommendInfo.logoImg" class="left-logo" :src="companyRecommendInfo.logoImg" />
                <img v-else class="left-logo" src="~@/assets/images/common/company_avatar.png" />
              </div>
              <div class="main-right">
                <div class="right-title">
                  <div class="title-name">
                    <p class="name-value ellipsis">{{ renderInfo.title }}</p>
                    <el-tag v-if="currUserInfo.companyAccountType === 2 && renderInfo.positionType" type="warning" size="small" class="name-tag">{{ renderInfo.positionType | filterCommonDict(dictData.dicts.positionType) }}</el-tag>
                  </div>
                  <div v-if="currUserInfo.companyAccountType === 2" class="title-btn">
                    <el-button
                      v-if="renderInfo.isProject === 1"
                      class="white-btn"
                      @click="toDetail(`/projectDetail?positionId=${renderInfo.id}`)"
                    >
                      项目详情
                    </el-button>
                    <el-button v-else class="white-btn" @click="addProject(renderInfo.id)">
                      加入项目
                    </el-button>
                    <el-popover placement="bottom-end" trigger="click">
                      <!-- <div class="item">
                        <el-button type="text" @click="recommendCheck">推荐查重</el-button>
                      </div> -->
                      <div v-if="renderInfo.statusNo === 3" class="item">
                        <el-button type="text" @click="sharerPosition">邀请猎头</el-button>
                      </div>
                      <!-- <div v-if="renderInfo.isOrder === 1" class="item">
                        <el-button type="text" @click="cancelOrder">取消接单</el-button>
                      </div> -->
                      <i slot="reference" class="more-operate icon iconfont icon-zhiwei-quanbuzhiwei15" />
                    </el-popover>
                  </div>
                </div>
                <p class="right-price">
                  <span v-if="renderInfo.salaryType === 1">
                    {{ renderInfo.salaryStart / 10000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 10000 }}</span>万/年
                  </span>
                  <span v-if="renderInfo.salaryType === 2 && renderInfo.monthlySalaryRegime">
                    {{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K*{{ renderInfo.monthlySalaryRegime }}薪
                  </span>
                  <span v-if="renderInfo.salaryType === 2 && !renderInfo.monthlySalaryRegime">
                    {{ renderInfo.salaryStart / 1000 }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd / 1000 }}</span>K/月
                  </span>
                  <span v-if="renderInfo.salaryType === 3">
                    {{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/天
                  </span>
                  <span v-if="renderInfo.salaryType === 4">
                    {{ renderInfo.salaryStart }}<span v-if="renderInfo.salaryStart !== renderInfo.salaryEnd">-{{ renderInfo.salaryEnd }}</span>元/小时
                  </span>
                  <span v-if="renderInfo.salaryType === 5">
                    面议
                  </span>
                  <span v-if="renderInfo.workCityId"> · {{ renderInfo.workCityId | filterLevel2(dictData.areas) }}</span>
                  <span
                    v-if="renderInfo.degreeRequired"
                  > · {{ renderInfo.degreeRequired | filterCommonDict(dictData.dicts.degreeRequired) }}</span>
                  <span v-if="renderInfo.recruitmentNumber"> · 招聘{{ renderInfo.recruitmentNumber }}人</span>
                </p>
                <p class="right-sub">
                  <span>{{ companyInfo.shortName }}</span>
                  <span v-if="companyInfo.industrys1"> · {{ companyInfo.industrys1 | filterCommonDict(dictData.industry) }}</span>
                  <span v-if="companyInfo.style"> · {{ companyInfo.style | filterCommonDict(dictData.dicts.enterpriseProperty) }}</span>
                  <span v-if="companyInfo.scale"> · {{ companyInfo.scale | filterCommonDict(dictData.dicts.enterpriseScale) }}</span>
                </p>
              </div>
            </div>
          </div>
          <div v-if="currUserInfo.companyAccountType === 2" class="tag">
            <el-tag
              v-for="(item, index) in renderInfo.positionLabel"
              :key="index"
              effect="dark"
            >{{ item | filterCommonDict(dictData.dicts.positionTag) }}</el-tag>
          </div>
          <div v-if="currUserInfo.companyAccountType === 2" class="des">
            <template v-if="renderInfo.positionType === 1">
              <div class="tag left">
                <p class="tag-item">
                  <i class="value ellipsis" :title="renderInfo.commissionAmount">
                    {{ renderInfo.commissionAmount }}
                    <span
                      v-if="renderInfo.commissionSettlementType === 1"
                    >（{{ renderInfo.commissionRatio }}%）</span>
                  </i>
                  <span class="name">预计佣金</span>
                  <el-tooltip v-if="renderInfo.commissionSupplement" effect="dark" placement="top">
                    <div slot="content" style="max-width: 200px;">{{ renderInfo.commissionSupplement }}</div>
                    <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
                  </el-tooltip>
                </p>
              </div>
              <div class="tag center">
                <p class="tag-item">
                  <i
                    class="value ellipsis"
                  >{{ renderInfo.hhCommissionRatio }}%</i>
                  <span class="name">成单分成</span>
                  <el-tooltip
                    effect="dark"
                    placement="top"
                  >
                    <div
                      slot="content"
                      style="max-width: 200px;"
                    >推荐成功后，您可以按照对应比例获得相应佣金分成</div>
                    <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
                  </el-tooltip>
                  <!-- <el-tooltip
                    v-if="renderInfo.recommendedSupplementaryNotes"
                    effect="dark"
                    placement="top"
                  >
                    <div
                      slot="content"
                      style="max-width: 200px;"
                    >{{ renderInfo.recommendedSupplementaryNotes }}</div>
                    <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
                  </el-tooltip> -->
                </p>
                <!-- <p class="tag-item">
                  <i
                    class="value ellipsis"
                  >10%</i>
                  <el-tooltip
                    effect="dark"
                    placement="top"
                  >
                    <div
                      slot="content"
                      style="max-width: 200px;"
                    >推荐成功后，您可以按照对应比例获得相应佣金分成</div>
                    <i class="icon iconfont icon-zhiwei-quanbuzhiwei10" />
                  </el-tooltip>
                </p> -->
              </div>
              <div class="tag right">
                <p class="tag-item">
                  <i class="value ellipsis">
                    {{ renderInfo.guaranteePeriod }}
                    <span v-if="renderInfo.guaranteePeriodType === 2">个</span>
                    {{ renderInfo.guaranteePeriodType | filterCommonDict(dictData.dicts.guaranteePeriodType) }}
                  </i>
                  <span class="name">保证期</span>
                </p>
              </div>
            </template>
            <template v-if="renderInfo.positionType === 2">
              <p class="des-text">{{ renderInfo.commissionSupplementDescription || '暂无佣金说明' }}</p>
            </template>
          </div>
          <div v-if="currUserInfo.companyAccountType === 2" class="status">
            <span>
              <i class="icon iconfont icon-zhiwei-quanbuzhiwei9" />
              猎头
              <i class="num">{{ renderInfo.hhCount }}</i>
            </span>
            <span>
              <i class="icon iconfont icon-zhiwei-quanbuzhiwei8" />
              推荐
              <i class="num">{{ renderInfo.recommendCount }}</i>
            </span>
            <span>
              <i class="icon iconfont icon-zhiwei-quanbuzhiwei13" style="font-size: 20px;" />
              面试
              <i class="num">{{ renderInfo.interviewCount }}</i>
            </span>
            <span>
              <i class="icon iconfont icon-zhiwei-quanbuzhiwei5" />
              offer
              <i class="num">{{ renderInfo.offerCount }}</i>
            </span>
            <span>
              <i class="icon iconfont icon-zhiwei-quanbuzhiwei12" />
              入职
              <i class="num">{{ renderInfo.entryCount }}</i>
            </span>
            <span>
              <i class="text-icon">HR</i>
              大于
              <i class="num">{{ renderInfo.recommendedFeedbackCycle }}</i>
              天
            </span>
          </div>
        </div>
        <!-- tab切换 -->
        <el-tabs>
          <el-tab-pane label="职位说明">
            <position-description :position-info="positionInfo" />
          </el-tab-pane>
          <el-tab-pane label="公司背景">
            <company-background :company-info="companyInfo" />
          </el-tab-pane>
          <el-tab-pane
            v-if="companyRecommendInfo.paymentRules || companyRecommendInfo.attributionRule || companyRecommendInfo.singleRule || companyRecommendInfo.addInstructions"
            label="推荐须知"
          >
            <recommend-know :company-recommend-info="companyRecommendInfo" />
          </el-tab-pane>
          <el-tab-pane
            label="职位动态"
          >
            <position-record :position-id="positionInfo.id" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 底部边栏 -->
      <div v-if="!isNewWindow && currUserInfo.companyAccountType === 2" class="footer-bar">
        <div class="title">
          <img
            v-if="userInfo.avatarImg"
            class="avatar"
            :src="userInfo.avatarImg"
            @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
          />
          <img
            v-else-if="userInfo.gender === 1"
            class="avatar"
            src="~@/assets/images/common/man_avatar.png"
            @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
          />
          <img
            v-else-if="userInfo.gender === 2"
            class="avatar"
            src="~@/assets/images/common/women_avatar.png"
            @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
          />
          <img
            v-else
            class="avatar"
            src="~@/assets/images/common/avatar.png"
            @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
          />
          <p class="name ellipsis">
            <span
              @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
            >{{ userInfo.nickName }}（PM）</span>
          </p>
          <p class="btn">
            <el-button class="cancel-btn" @click="sendMsg">
              <i class="icon iconfont icon-zhiwei-zhiweixiangqing-choutidanchuangbeifen2" />
              在线沟通
            </el-button>
            <el-button class="cancel-btn" @click="callPhone">
              <i class="icon iconfont icon-zhiwei-zhiweixiangqing-choutidanchuangbeifen1" />
              打电话
            </el-button>
            <a :href="`mailto:${userInfo.email}`">
              <el-button class="cancel-btn">
                <i class="icon iconfont icon-zhiwei-zhiweixiangqing-choutidanchuangbeifen" />
                发邮件
              </el-button>
            </a>
          </p>
        </div>
        <div
          class="look ellipsis"
          @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
        >
          查看{{ userInfo.gender === 1 ? '他' : '她' }}负责的{{ userInfo.positionCount }}个职位
          <i
            class="el-icon-arrow-right"
          />
        </div>
      </div>
    </div>
    <!-- 右侧边栏 -->
    <div v-if="isNewWindow && currUserInfo.companyAccountType === 2" class="right-bar">
      <div id="fixedHeaderRoot" :class="['bar-area',headerFixed && 'isFixed']">
        <!-- 上面板 -->
        <div class="panel">
          <div class="panel-body">
            <div class="title">
              <img
                v-if="userInfo.avatarImg"
                class="avatar"
                :src="userInfo.avatarImg"
                @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
              />
              <img
                v-else-if="userInfo.gender === 1"
                class="avatar"
                src="~@/assets/images/common/man_avatar.png"
                @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
              />
              <img
                v-else-if="userInfo.gender === 2"
                class="avatar"
                src="~@/assets/images/common/women_avatar.png"
                @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
              />
              <img
                v-else
                class="avatar"
                src="~@/assets/images/common/avatar.png"
                @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
              />
              <p class="name ellipsis">{{ userInfo.nickName }}（PM）</p>
              <p class="icon">
                <img src="@/assets/images/position/wechat-icon.png" />
                <img src="@/assets/images/position/phone-icon.png" />
                <img src="@/assets/images/position/email-icon.png" />
              </p>
            </div>
            <div class="contact">
              <p class="phone">电话：{{ userInfo.mobile }}</p>
              <p class="email">
                邮箱：
                <span>{{ userInfo.email }}</span>
              </p>
            </div>
            <div class="btn">
              <el-button
                class="cancel-btn ellipsis"
                @click="toDetail(`/deliverDetail?tab=allPosition&userId=${userInfo.id}`)"
              >
                查看她负责的{{ userInfo.positionCount }}个职位
                <img
                  style="width: 16px; height: 16px; margin-bottom: -3px;"
                  src="@/assets/images/position/more.png"
                />
              </el-button>
            </div>
          </div>
        </div>
        <!-- 下面板 -->
        <div class="panel">
          <div class="panel-body">
            <div class="title">
              <img v-if="companyInfo.logoImg" class="avatar" :src="companyInfo.logoImg" />
              <img v-else class="avatar" src="~@/assets/images/common/company_avatar.png" />
              <p class="name ellipsis">{{ companyInfo.shortName }}</p>
            </div>
            <div class="tag">
              <el-tag
                v-for="(item, index) in renderCompanyInfo.welfareHighlights"
                :key="index"
                effect="dark"
                :class="index % 2 === 0 ? 'red' : 'blue'"
              >{{ item | filterCommonDict(dictData.dicts.lightLabel) }}</el-tag>
            </div>
            <div class="info">
              <p>行业：{{ companyInfo.industrys1 | filterCommonDict(dictData.industry) }}</p>
              <p>规模：{{ companyInfo.scale | filterCommonDict(dictData.dicts.enterpriseScale) }}</p>
              <p>阶段：{{ companyInfo.financing | filterCommonDict(dictData.dicts.financing) }}</p>
              <p>性质：{{ companyInfo.style | filterCommonDict(dictData.dicts.enterpriseProperty) }}</p>
              <p>地址：{{ companyInfo.provinceId | filterCommonDict(dictData.areas) }}{{ companyInfo.cityId | filterLevel2(dictData.areas) }}{{ companyInfo.areaId | filterLevel3(dictData.areas) }}{{ companyInfo.address }}</p>
            </div>
          </div>
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
import { mapState } from 'vuex'
import recommendCheck from './modules/recommendCheck'
import sharePosition from './modules/sharePosition'
import dialogChat from '@/components/common/dialogChat.vue'
import positionDescription from './positionDetailTab/positionDescription'
import companyBackground from './positionDetailTab/companyBackground'
import recommendKnow from './positionDetailTab/recommendKnow'
import positionRecord from './positionDetailTab/positionRecord'
import {
  getPositionDetailById,
  getCompanyDetail,
  getCompanyRecommendDetail,
  getUserDetail,
  addProjectPosition,
  addPositionOrderRecord,
  cancelOrderById,
  editPositionStatus
} from '@/api/position'
export default {
  components: {
    recommendCheck,
    sharePosition,
    dialogChat,
    positionDescription,
    companyBackground,
    recommendKnow,
    positionRecord
  },
  props: {
    // 是否是新窗口打开
    isNewWindow: {
      type: Boolean,
      default: true,
      required: false
    },
    // 职位ID
    positionId: {
      type: [String, Number],
      default: '',
      required: false
    }
  },
  data() {
    return {
      // 公告是否展开
      isExpand: false,
      // 聊天对话框是否显示
      dialogVisible: false,
      // 职位信息
      positionInfo: {
        id: this.positionId || this.$route.query.positionId
      },
      // 企业信息
      companyInfo: {},
      // 企业推荐须知信息
      companyRecommendInfo: {},
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      currUserInfo: state => {
        return state.userInfo
      }
    }),
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
    },
    // 渲染的企业信息
    renderCompanyInfo() {
      const data = Object.assign({}, this.companyInfo)
      data.welfareHighlights =
        this.companyInfo.companyDetail &&
        this.companyInfo.companyDetail.welfareHighlights
          ? this.companyInfo.companyDetail.welfareHighlights.split(',')
          : []
      return data
    }
  },
  watch: {
    positionId(val) {
      this.positionInfo.id = val
      // 查询职位信息
      this.queryPositionInfo()
    }
  },
  mounted() {
    // 查询职位信息
    this.queryPositionInfo()
  },
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
    recommendCheck() {
      const row = Object.assign({}, this.renderInfo)
      this.$refs.modalForm.edit(row)
    },
    // 分享职位
    sharerPosition() {
      const row = Object.assign({ entrySourceType: 'positionDetail' }, this.renderInfo)
      this.$refs.modalShare.edit(row)
    },
    // 取消接单
    cancelOrder() {
      this.$confirm('是否取消接单', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {}
          para.id = this.renderInfo.id
          cancelOrderById(para).then(res => {
            this.$set(this.positionInfo, 'isOrder', 0)
          })
        })
        .catch(() => {})
    },
    // 编辑职位
    editPosition() {
      this.$router.push({ name: 'releasePosition', query: { positionId: this.renderInfo.id } })
    },
    // 切换职位状态
    changeStatus() {
      // 对上架进行认证状态判断
      if (this.renderInfo.statusNo === 4) {
        if (this.currUserInfo.companyCertificationStatus === 0 || this.currUserInfo.companyCertificationStatus === 3) {
          this.$confirm(
            '根据平台用户规则，您需要预先完成企业信息认证才可以上架职位',
            '企业未认证',
            {
              type: 'warning',
              confirmButtonText: '立即认证'
            }
          )
            .then(() => {
              this.$router.push('/certification');
            })
            .catch(() => {})
            return;
        }
        if (this.currUserInfo.companyCertificationStatus === 2) {
          this.$alert(
            '您的企业信息正在认证中，认证通过后即可上架企业职位',
            '企业认证中',
            {
              type: 'warning'
            }
          )
            .then(() => {})
            return;
        }
      }
      this.$confirm(this.renderInfo.statusNo === 3 ? '下架该职位后，候选人将无法再查看职位的信息' : '上架该职位后，候选人将可以继续查看职位的信息', this.renderInfo.statusNo === 3 ? '下架提示' : '上架提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {};
          para.id = this.renderInfo.id;
          para.statusNo = this.renderInfo.statusNo === 3 ? 4 : 3;
          editPositionStatus(para).then(res => {
            this.$set(this.positionInfo, 'statusNo', para.statusNo)
          });
        })
        .catch(() => {})
    },
    // 新窗口打开页面
    toDetail(url) {
      window.open(url)
    },
    // 在线沟通
    sendMsg() {
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userInfo.id}`)
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
    // 打电话
    callPhone() {
      this.$alert('电话号码：' + this.userInfo.mobile, '提示', {
        showClose: false
      }).then(() => {})
    },
    // 查询职位信息
    queryPositionInfo() {
      const para = {}
      para.id = this.positionInfo.id
      getPositionDetailById(para).then(res => {
        this.positionInfo = res.data
        this.companyInfo.id = this.positionInfo.companyId
        this.userInfo.id = this.positionInfo.dockPmId
        this.queryCompanyInfo()
        this.queryCompanyRecommendInfo()
        this.queryUserInfo()
      })
    },
    // 查询企业信息
    queryCompanyInfo() {
      const para = {}
      para.id = this.companyInfo.id
      getCompanyDetail(para).then(res => {
        this.companyInfo = res.data
        // 查询到职位和企业信息后才更改页面title
        if (this.isNewWindow) {
          document.title =
            this.positionInfo.title +
            '-' +
            this.companyInfo.shortName +
            '-大猎英才'
        }
      })
    },
    // 查询企业推荐须知信息
    queryCompanyRecommendInfo() {
      const para = {}
      para.companyId = this.companyInfo.id
      getCompanyRecommendDetail(para).then(res => {
        this.companyRecommendInfo = res.data
      })
    },
    // 查询用户信息
    queryUserInfo() {
      const para = {}
      para.cwUserId = this.userInfo.id
      getUserDetail(para).then(res => {
        this.userInfo = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box-detail {
  &.wrap-box {
    display: flex;
    justify-content: space-between;
    min-height: 100%;
    .left-main {
      min-height: 100%;
      overflow: hidden;
      flex: auto;
      position: relative;
      .main-content {
        min-height: 100%;
        padding: 20px;
        background-color: #fff;
        box-shadow: 2px 4px 30px 0 rgba(0, 0, 0, 0.07);
        .wrap {
          padding-bottom: 40px;
        }
        .title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .title-item{
            font-size: 14px;
            color: #989898ff;
            padding-right: 12px;
            margin-right: 12px;
            position: relative;
            &:after{
              content: '';
              display: block;
              width: 2px;
              height: 15px;
              background-color: #b9b7b7;
              position: absolute;
              right: 0;
              top: 2px;
            }
            &:last-child{
              padding-right: 0;
              margin-right: 0;
              &:after{
                display: none;
              }
            }
            &.link{
              cursor: pointer;
            }
          }
        }
        .announcement {
          padding: 20px;
          max-height: 120px;
          box-sizing: border-box;
          line-height: 20px;
          font-size: 14px;
          color: #4d4d4dff;
          background-color: #F4F6F9;
          border-radius: 8px;
          position: relative;
          margin-bottom: 20px;
          white-space: pre-wrap;
          &.expand {
            max-height: none;
            .text {
              display: block;
            }
          }
          .text {
            height: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            b {
              color: $red-color;
            }
          }
          .more {
            font-size: 12px;
            color: $orange-color;
            position: absolute;
            right: 4px;
            bottom: 19px;
          }
        }
        .important{
          padding: 20px;
          background-color: #3D5D9F;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          .info {
            display: flex;
            .info-main {
              flex: auto;
              display: flex;
              .main-left {
                margin-right: 20px;
                .left-logo {
                  display: block;
                  width: 88px;
                  height: 88px;
                  border-radius: 4px;
                  object-fit: cover;
                }
              }
              .main-right{
                flex: auto;
                .right-title{
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                  .title-name{
                    display: flex;
                    align-items: center;
                    .name-value{
                      line-height: 32px;
                      font-size: 18px;
                      font-weight: bold;
                      color: #fff;
                      max-width: 380px;
                    }
                    .name-tag{
                      margin-left: 10px;
                    }
                  }
                  .title-btn {
                    flex: none;
                    width: 235px;
                    text-align: right;
                    margin-left: 20px;
                    .white-btn {
                      vertical-align: top;
                    }
                    .more-operate {
                      width: 32px;
                      height: 32px;
                      line-height: 32px;
                      font-size: 30px;
                      color: #fff;
                      border: none;
                      &:last-child {
                        margin-left: 15px;
                      }
                    }
                  }
                }
                .right-price{
                  font-size: 14px;
                  color: #fff;
                  margin-bottom: 8px;
                }
                .right-sub{
                  font-size: 14px;
                  color: #fff;
                }
              }
            }
          }
          .tag {
            margin-top: 20px;
            margin-bottom: 10px;
            .el-tag {
              border: none;
              height: 24px;
              line-height: 22px;
              margin-right: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
              background: transparent;
              border: 1px solid #fff;
              color: #fff;
            }
          }
          .des {
            display: flex;
            align-items: center;
            border: 1px solid #fff;
            border-radius: 8px;
            margin-bottom: 20px;
            .tag {
              position: relative;
              margin: 0;
              &:after{
                content: '';
                display: block;
                width: 1px;
                height: 32px;
                background-color: #fff;
                position: absolute;
                right: 0;
                top: 50%;
                margin-top: -16px;
              }
              &.left {
                flex: 3;
                padding: 0 20px;
              }
              &.center {
                flex: 2;
                padding: 0 20px;
              }
              &.right {
                flex: 3;
                padding: 0 20px;
                &:after{
                  display: none;
                }
              }
              .tag-item{
                display: flex;
                padding: 8px 0;
                justify-content: center;
                align-items: center;
                // border-bottom: 1px dashed #fff;
                &:last-child{
                  border: none;
                }
                .value {
                  font-size: 18px;
                  color: #FFE900;
                  font-style: normal;
                  font-weight: 500;
                  margin-right: 8px;
                  max-width: 150px;
                }
                .name {
                  font-size: 12px;
                  color: #fff;
                }
                .icon {
                  color: #fff;
                  margin-left: 8px;
                }
              }
            }
            .des-text{
              padding: 12px;
              font-size: 14px;
              color: #fff;
            }
          }
          .status {
            font-size: 14px;
            color: #fff;
            span {
              display: inline-block;
              margin-right: 20px;
              .icon {
                font-size: 18px;
              }
              .text-icon {
                display: inline-block;
                padding: 0 1px;
                height: 12px;
                line-height: 12px;
                font-size: 12px;
                font-style: normal;
                border-radius: 2px;
                border: 1px solid #fff;
              }
              .num {
                font-style: normal;
              }
            }
          }
        }
        .el-tabs {
          ::v-deep .el-tabs__header {
            margin-bottom: 20px;
            .el-tabs__nav-wrap::after {
              background-color: #b3b3b3ff;
              height: 1px;
            }
            .el-tabs__item {
              line-height: 25px;
              font-size: 16px;
              color: #808080ff;
              &.is-active {
                color: $main-color;
              }
            }
            .el-tabs__active-bar {
              background-color: $main-color;
            }
          }
        }
      }
      .footer-bar {
        display: flex;
        width: 834px;
        height: 46px;
        line-height: 46px;
        position: fixed;
        bottom: 0;
        z-index: 10;
        .title {
          display: flex;
          flex: auto;
          padding: 8px 20px;
          background-color: #203148ff;
          .avatar {
            display: block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            object-fit: cover;
          }
          .name {
            flex: auto;
            padding: 0 15px;
            font-size: 15px;
            color: #fff;
            font-weight: bold;
            line-height: 30px;
            span {
              cursor: pointer;
            }
          }
          .btn {
            display: flex;
            justify-content: space-between;
            width: 330px;
            .cancel-btn {
              margin: 2px 0;
            }
          }
        }
        .look {
          width: 200px;
          padding: 0 20px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background-color: $main-color;
          cursor: pointer;
        }
      }
    }
    .right-bar {
      width: 260px;
      margin-left: 20px;
      flex: none;
      overflow: hidden;
      .bar-area {
        width: 260px;
        .panel {
          background-color: #fff;
          margin-bottom: 20px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 2px 4px 30px 0 rgba(0, 0, 0, 0.07);
          .panel-body {
            .title {
              display: flex;
              height: 30px;
              line-height: 30px;
              .avatar {
                display: block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
              }
              .name {
                flex: auto;
                padding: 0 8px;
                font-size: 15px;
                color: #343434ff;
                font-weight: bold;
              }
              .icon {
                display: flex;
                justify-content: space-between;
                width: 72px;
                img {
                  display: block;
                  width: 18px;
                  height: 18px;
                  margin: 6px 0;
                }
              }
            }
            .contact {
              line-height: 28px;
              padding: 12px;
              font-size: 14px;
              color: #7f7f7fff;
              padding-left: 38px;
              .email {
                overflow: hidden;
                span {
                  float: right;
                  width: 128px;
                  word-wrap: break-word;
                }
              }
            }
            .btn {
              .cancel-btn {
                width: 100%;
                padding: 0;
                border-radius: 3px;
              }
            }
            .tag {
              margin: 8px 0;
              .el-tag {
                border: none;
                padding: 0 5px;
                height: 20px;
                line-height: 20px;
                margin-right: 8px;
                margin-bottom: 8px;
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
            .info {
              line-height: 28px;
              font-size: 14px;
              color: #4d4d4d;
            }
          }
        }
      }
    }
  }
}
</style>

