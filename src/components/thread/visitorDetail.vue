<template>
  <div class="visitor-detail">
    <!-- 详细信息 -->
    <div class="resume-link">
      <template v-if="!labelVisible">
        <p class="left">
          <span class="time">近30天访问{{ visitorDetailData.browseMonthCount || 0 }}次</span>
          <span class="dot">·</span>
          <span class="day">最近来访{{ visitorDetailData.lastBrowseTime }}</span>
        </p>
        <p class="right">
          <el-button type="primary" size="small" @click="sendMessage(visitorDetailData.userId)">发消息</el-button>
        </p>
      </template>
      <template v-else>
        <p class="left">
          <span class="label-title">添加访客标签</span>
        </p>
        <!-- <p class="right">
          <el-button type="primary" class="return" size="small" @click="goBack">返回</el-button>
        </p>-->
      </template>
    </div>
    <template v-if="!labelVisible">
      <div class="box-card">
        <div class="header">
          <p v-if="resumeDetail && resumeDetail.isNegotiated" class="salary">面议</p>
          <p v-else-if="resumeDetail && resumeDetail.intentionSalaryMonthStart" class="salary">
            {{ resumeDetail && resumeDetail.intentionSalaryMonthStart }}
            -
            {{ resumeDetail && resumeDetail.intentionSalaryMonthEnd }}k
            · {{ resumeDetail && resumeDetail.intentionSalaryMonth }}薪
          </p>
          <div class="mess">
            <el-avatar size="large" :src="visitorDetailData && visitorDetailData.avatarUrl"></el-avatar>
            <div class="info">
              <p class="name">
                {{ visitorDetailData && visitorDetailData.nickName }}
                <i
                  :class="[visitorDetailData && visitorDetailData.gender === 1 ? 'man' : 'woman'] "
                ></i>
              </p>
              <p class="labels">
                <span
                  v-if="visitorDetailData"
                >{{ visitorDetailData && (visitorDetailData.city || visitorDetailData.province) }}</span>
                <span
                  v-if="resumeDetail && resumeDetail.age && (visitorDetailData.city || visitorDetailData.province)"
                  class="dot"
                >·</span>
                <span
                  v-if="resumeDetail && resumeDetail.age"
                >{{ resumeDetail && resumeDetail.age }}岁</span>
                <span
                  v-if="resumeDetail && (visitorDetailData.city || visitorDetailData.province || resumeDetail.age) && resumeDetail.degreeCode"
                  class="dot"
                >·</span>
                <span
                  v-if="resumeDetail && resumeDetail.degreeCode"
                >{{ resumeDetail && resumeDetail.degreeCode | filterArr(resumeDict.degree) }}</span>
                <span
                  v-if="resumeDetail &&(visitorDetailData.city || visitorDetailData.province || resumeDetail.age || resumeDetail.degreeCode) && resumeDetail && resumeDetail.workMonth"
                  class="dot"
                >·</span>
                <span
                  v-if="resumeDetail && resumeDetail.workMonth"
                >工作{{ resumeDetail && resumeDetail.workMonth }}</span>
              </p>
            </div>
          </div>
        </div>

        <ul v-if="experiences && experiences.length > 0" class="process">
          <li v-for="(item,index) in experiences" :key="index" class="workExp">
            <p v-if="index < 2" class="left">
              <span>{{ item.companyName }}</span>
              <span class="dot">·</span>
              <span>{{ item.title }}</span>
            </p>
            <p v-if="index < 2" class="right">
              <span>{{ item.startToEndDate }}</span>
            </p>
          </li>
          <li v-for="(item,index) in educations" :key="index" class="eduExp">
            <p v-if="index < 1" class="left">
              <span>{{ item.school }}</span>
              <span class="dot">·</span>
              <span>{{ item.speciality }}</span>
            </p>
            <p v-if="index < 1" class="right">
              <span>{{ item.startToEndDate }}</span>
            </p>
          </li>
        </ul>
        <p
          v-if="resumeDetail && resumeDetail.id"
          class="to-resume"
          @click="toResumeDetail(resumeDetail.id)"
        >查看详细简历</p>
      </div>
      <!-- 共同人脉 -->
      <div v-if="shareChainUserAvatars && shareChainUserAvatars.length > 0" class="persons">
        <span
          v-if="userInfo && userInfo.companyRole === 4 || userInfo && userInfo.companyRole === 3"
          class="title"
        >{{ userInfo.trueName }}和TA的共同人脉</span>
        <span v-if="userInfo && userInfo.companyRole === 1" class="title">你和TA的共同人脉</span>
        <div class="imgs">
          <span v-for="(item,index) in shareChainUserAvatars" :key="index" class="img">
            <el-avatar v-if="index < 10" size="medium" :src="item.avator"></el-avatar>
          </span>
        </div>
      </div>
      <!-- tabs -->
      <el-tabs v-model="activeName" size="small" @tab-click="handleClick">
        <el-tab-pane label="TA的浏览" name="record">
          <el-timeline
            v-if="recordList && recordList.length > 0"
            v-infinite-scroll="load1"
            infinite-scroll-disabled="disabled1"
            class="record-list"
          >
            <el-timeline-item
              v-for="(item,index) in recordList"
              :key="index"
              :timestamp="item.browseTime | filterDates"
              placement="top"
            >
              <el-card class="glance-card">
                <h4>查看了「{{ item.positionTitle }} - {{ item.companyReplaceName }}」</h4>
                <p class="labels">
                  <span v-if="item.haveContacted">问一问</span>
                  <span v-if="item.haveCollected">投简历</span>
                  <span v-if="item.haveShare">转发</span>
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div v-else-if="total1 === 0" class="empty-page">
            <img style="height:auto;width:100px" src="@/assets/images/resume/resume_empty.png" />
            <p style="font-size:13px">暂无数据</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="TA的分享" name="share">
          <el-timeline
            v-if="shareList && shareList.length > 0"
            v-infinite-scroll="load3"
            infinite-scroll-disabled="disabled3"
            class="share-list"
          >
            <el-timeline-item
              v-for="(item,index) in shareList"
              :key="index"
              :timestamp="item.applyTime | filterDates"
              placement="top"
            >
              <el-card>
                <h4>
                  <el-avatar v-if="item.avatarUrlImg" size="small" :src="item.avatarUrlImg"></el-avatar>
                  <el-avatar
                    v-else-if="item.gender === 1"
                    size="small"
                    src="~@/assets/images/common/man_avatar.png"
                  ></el-avatar>
                  <el-avatar
                    v-else-if="item.gender === 2"
                    size="small"
                    src="~@/assets/images/common/women_avatar.png"
                  ></el-avatar>
                  <el-avatar v-else size="small" src="~@/assets/images/common/avatar.png"></el-avatar>
                  {{ item.name }}
                </h4>
                <p>投递了TA分享的「{{ item.positionTitle }} - {{ item.companyName }}」</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div v-else-if="total3 === 0" class="empty-page">
            <img style="height:auto;width:100px" src="@/assets/images/resume/resume_empty.png" />
            <p style="font-size:13px">暂无数据</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="TA的推荐" name="recommend">
          <el-timeline
            v-if="recommendList && recommendList.length > 0"
            v-infinite-scroll="load2"
            infinite-scroll-disabled="disabled2"
            class="recommend-list"
          >
            <el-timeline-item
              v-for="(item,index) in recommendList"
              :key="index"
              :timestamp="item.applyTime | filterDates"
              placement="top"
            >
              <el-card>
                <div class="cont">
                  <el-form ref="form" label-width="90px">
                    <el-form-item v-if="item.positionName" label="推荐职位：">{{ item.positionName }}</el-form-item>
                    <el-form-item
                      v-if="item.positionCompanyName"
                      label="推荐企业："
                    >{{ item.positionCompanyName }}</el-form-item>
                    <el-form-item v-if="item.name" label="姓名：">{{ item.name }}</el-form-item>
                    <el-form-item v-if="item.mobile" label="电话：">{{ item.mobile }}</el-form-item>
                    <el-form-item v-if="item.email" label="邮箱：">{{ item.email }}</el-form-item>
                    <el-form-item v-if="item.companyName" label="公司：">{{ item.companyName }}</el-form-item>
                    <el-form-item v-if="item.positionTitle" label="TITLE：">{{ item.positionTitle }}</el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <!-- <ul
          v-if="recommendList && recommendList.length > 0"
          v-infinite-scroll="load2"
          infinite-scroll-disabled="disabled2"
          class="recommend-list"
        >
          <li v-for="(item,index) in recommendList" :key="index">
            <el-card>
              <div slot="header">
                <div class="left">推荐于{{ item.applyTime | filterDates }}</div>
              </div>
              <div class="cont">
                <el-form ref="form" label-width="90px">
                  <el-form-item v-if="item.positionName" label="推荐职位：">{{ item.positionName }}</el-form-item>
                  <el-form-item
                    v-if="item.positionCompanyName"
                    label="推荐企业："
                  >{{ item.positionCompanyName }}</el-form-item>
                  <el-form-item v-if="item.name" label="姓名：">{{ item.name }}</el-form-item>
                  <el-form-item v-if="item.mobile" label="电话：">{{ item.mobile }}</el-form-item>
                  <el-form-item v-if="item.email" label="邮箱：">{{ item.email }}</el-form-item>
                  <el-form-item v-if="item.companyName" label="公司：">{{ item.companyName }}</el-form-item>
                  <el-form-item v-if="item.positionTitle" label="TITLE：">{{ item.positionTitle }}</el-form-item>
                </el-form>
              </div>
            </el-card>
          </li>
          </ul>-->
          <div v-else-if="total2 === 0" class="empty-page">
            <img style="height:auto;width:100px" src="@/assets/images/resume/resume_empty.png" />
            <p style="font-size:13px">暂无数据</p>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 打标签 -->
      <div class="set-labels">
        <div
          v-if="visitorDetailData && visitorDetailData.labels && visitorDetailData.labels.length > 0"
          class="labels"
        >
          <span
            v-for="(item,index) in visitorDetailData.labels"
            :key="index"
            :title="item"
          >{{ item }}</span>
          <span class="add-icon" @click="addLabel">
            <i class="el-icon-plus"></i>添加标签
          </span>
        </div>
        <div v-else class="labels">
          <span class="add-icon" @click="addLabel">
            <i class="el-icon-plus"></i>添加标签
          </span>
          <span class="tip">给访客打上标签，帮助您更好的管理访客数据</span>
        </div>
      </div>
    </template>
    <div v-else class="label-panel">
      <template v-if="labelOptions2 && labelOptions2.length > 0">
        <div v-for="(item,index) in labelOptions2" :key="'info1-'+index" class="item item-comp">
          <p class="sub-title">{{ item.userLabelPoolGroup }}</p>
          <div v-if="loading1" class="labels">
            <span
              v-for="(itemInner,indexInner) in item.userLabelPools"
              :key="indexInner"
              :class="[itemInner.active && 'active']"
              @click="checkItem1(itemInner.id)"
            >{{ itemInner.labelName }}</span>
          </div>
        </div>
      </template>

      <template v-if="labelOptions1 && labelOptions1.length > 0">
        <p class="title">自定义标签</p>
        <div v-for="(item,index) in labelOptions1" :key="'info2-'+index" class="item">
          <div v-if="loading2" class="labels">
            <span
              v-for="(itemInner,indexInner) in item.userLabelPools"
              :key="indexInner"
              :class="[itemInner.active && 'active']"
              @click="checkItem2(itemInner)"
            >
              {{ itemInner.labelName }}
              <i
                title="编辑自定义标签"
                class="el-icon-edit-outline"
                @click.stop="editLabel(itemInner)"
              ></i>
            </span>
            <span class="add-icon" @click="addLabels">
              <i class="el-icon-plus"></i>添加
            </span>
          </div>
          <div v-if="inputVisible" class="label-input">
            <el-input v-model="labelInput" size="small" placeholder="请输入标签名称"></el-input>
            <span v-if="labelInput" class="del" @click="closeInput1">删除</span>
            <span v-else class="del" @click="()=>{inputVisible = false}">删除</span>
            <span class="add" @click="checkInput1">保存</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="orderVisible"
      :router="'resumeDetail'"
      :direction="'btt'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier
        v-if="orderVisible"
        slot="inner-body"
        :company-account-type="userInfo && userInfo.companyAccountType"
      />
    </drawer-common>
    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getSharePositionBrowseVOPage,
  findShareApplyPage,
  getInformantClueList,
  getUserAppLabelList,
  addUserLabelPoolOfUser,
  deleteUserLabelPoolOfUser,
  editUserLabelPoolOfAll,
  editUserLabelPoolOfUser
} from '@/api/thread'

import DrawerCommon from '@/components/common/drawerCommon'
import dialogChat from '@/components/common/dialogChat.vue'
import resumeDict from '@/assets/js/resume'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'

export default {
  components: {
    DrawerCommon,
    dialogChat,
    ResumeDetailSupplier
  },
  props: {
    visitorDetailData: {
      required: true,
      type: Object
    },
    resumeDetail: {
      required: true,
      type: null
    },
    educations: {
      required: true,
      type: Array
    },
    experiences: {
      required: true,
      type: Array
    },
    shareChainUserAvatars: {
      required: true,
      type: Array
    },
    appUserId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      orderVisible: false,
      resumeDict: [],
      dialogVisible: false,
      drawer: false,
      activeName: 'record',
      pageNumber1: 1,
      pageSize1: 10,
      total1: null,
      recordList: [], // 访问记录
      pageNumber2: 1,
      pageSize2: 10,
      total2: null,
      recommendList: [], // 转介绍
      pageNumber3: 1,
      pageSize3: 10,
      total3: null,
      shareList: [], // 转介绍
      labelVisible: false,
      inputVisible: false,
      labelInput: null,
      labelOptions1: [],
      labelOptions2: [],
      ids1: [],
      ids2: [],
      labelIds: [],
      loading1: true,
      loading2: true,
      id: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyId: state => state.userInfo.companyId
    }),
    disabled1() {
      return this.total1 - 0 === this.recordList.length
    },
    disabled2() {
      return this.total2 - 0 === this.recommendList.length
    },
    disabled3() {
      return this.total3 - 0 === this.shareList.length
    }
  },
  mounted() {
    this.resumeDict = resumeDict
    this.getSharePositionBrowseVOPage()
    console.log('简历详情', this.resumeDetail)
  },
  methods: {
    checkItem1(id) {
      console.log(id)
      this.loading1 = false
      //
      this.labelOptions2 &&
        this.labelOptions2.filter((item, index) => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === id) {
              item.userLabelPools.filter(itemItem => {
                if (itemItem.id === id && !itemItem.active) {
                  itemItem.active = true
                } else {
                  itemItem.active = false
                }
              })
            }
          })
        })
      //
      localStorage.setItem('labelOptions2', JSON.stringify(this.labelOptions2))
      this.loading1 = true
    },
    checkItem2(itemData) {
      this.loading2 = false
      //
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === itemData.id) {
              itemInner.active = !itemInner.active
            }
          })
        })
      this.ids2.push(itemData.id)
      //
      localStorage.setItem('labelOptions1', JSON.stringify(this.labelOptions1))

      this.loading2 = true
    },
    editLabel(itemData) {
      this.id = itemData.id
      this.userLabelId = itemData.id
      this.labelInput = itemData.labelName
      this.inputVisible = true
      this.checkIconVisible = false
    },
    editUserLabelPoolOfAll() {
      const { labelIds, appUserId } = this
      const params = {
        labelIds,
        appUserId
      }
      console.log('params', params)
      editUserLabelPoolOfAll(params).then(res => {
        const { code, data } = res
        console.log(data)
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.ids1 = []
          this.ids2 = []
          this.labelIds = []
        }
      })
    },
    deleteUserLabelPoolOfUser() {
      const { userLabelId } = this
      const params = {
        userLabelId
      }
      console.log('params', params)
      userLabelId &&
        deleteUserLabelPoolOfUser(params).then(res => {
          const { code, data } = res
          console.log(data)
          if (code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.labelOptions1 = []
            this.labelOptions2 = []
            this.labelInput = null
            this.inputVisible = false
            this.userLabelId = null
            this.getUserAppLabelList()
          }
        })
    },
    editUserLabelPoolOfUser() {
      const { labelInput: labelName, id } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2,
        id
      }
      console.log('params', params)
      editUserLabelPoolOfUser(params).then(res => {
        const { code, data } = res
        console.log(data)
        if (code === '000000') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.userLabelId = null
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    addUserLabelPoolOfUser() {
      const { labelInput: labelName } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2
      }
      addUserLabelPoolOfUser(params).then(res => {
        const { code, data } = res
        console.log(data)
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    addLabels() {
      this.labelInput = null
      this.inputVisible = true
      this.checkIconVisible = true
    },
    closeInput1() {
      this.inputVisible = false
      this.deleteUserLabelPoolOfUser()
    },
    checkInput1() {
      let or = false
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.labelName === this.labelInput) {
              or = true
            }
          })
        })
      if (this.labelInput && this.labelInput.length > 10) {
        this.$message({
          message: '标签名最大长度为10',
          type: 'warning'
        })
      } else if (!this.labelInput) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
      } else {
        console.log(333333333333, this.userLabelId)
        if (this.userLabelId) {
          this.loading2 = false
          this.editUserLabelPoolOfUser()
          this.loading2 = true
        } else {
          if (or) {
            this.$message({
              message: '标签名已存在，不能重复添加',
              type: 'warning'
            })
          } else {
            this.loading2 = false
            this.addUserLabelPoolOfUser()
            this.loading2 = true
          }
        }
      }
    },
    getUserAppLabelList() {
      const params = {}
      getUserAppLabelList(params).then(res => {
        const { code, data } = res
        console.log(data)
        if (code === '000000') {
          data &&
            data.filter(item => {
              if (item.userLabelPoolGroup === '个人标签') {
                this.labelOptions1.push(item)
              } else {
                this.labelOptions2.push(item)
              }
            })

          this.labelOptions1 &&
            this.labelOptions1.filter(item => {
              item.userLabelPools.filter(b => {
                this.$props.visitorDetailData.labels.filter(a => {
                  if (b.labelName === a) {
                    b.active = 'true'
                  }
                })
              })
            })
          this.labelOptions2 &&
            this.labelOptions2.filter(item => {
              item.userLabelPools.filter(b => {
                this.$props.visitorDetailData.labels.filter(a => {
                  if (b.labelName === a) {
                    b.active = 'true'
                  }
                })
              })
            })
          console.log(
            '标签',
            this.$props.visitorDetailData.labels,
            this.labelOptions1,
            this.labelOptions2
          )
        }
      })
    },
    closeInput() {
      this.inputVisible = false
    },
    checkInput() {
      this.inputVisible = false
    },
    goBack() {
      this.labelVisible = false
    },
    // 添加标签
    addLabel(e) {
      this.labelVisible = true
      this.labelOptions1 = []
      this.labelOptions2 = []
      this.labelInput = null
      this.getUserAppLabelList()
      this.$emit('hideFooter')
    },
    // 关闭简历详情
    close() {
      document.body.style['overlow'] = 'auto'
      this.drawer = false
      this.$emit('refreshList', 1)
    },
    sendMessage(imUserId) {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${imUserId}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 跳转简历详情
    toResumeDetail(resumeId) {
      document.body.style['overflow'] = 'hidden'
      this.orderVisible = true
      sessionStorage.setItem('resumeId', resumeId)
    },
    handleClick(e) {
      if (e.name === 'record') {
        this.pageSize1 = 10
        this.pageNumber1 = 1
        this.total1 = null
        this.recordList = []
        this.getSharePositionBrowseVOPage()
      } else if (e.name === 'recommend') {
        this.recommendList = []
        this.pageSize2 = 10
        this.pageNumber2 = 1
        this.total2 = null
        this.findShareApplyPage()
      } else if (e.name === 'share') {
        this.shareList = []
        this.pageSize3 = 10
        this.pageNumber3 = 1
        this.total3 = null
        this.getInformantClueList()
      }
    },
    load1() {
      console.log('浏览', this.recordList.length, this.total1)
      if (this.recordList && this.recordList.length !== this.total1) {
        this.pageNumber1 += 1
        this.getSharePositionBrowseVOPage()
      } else if (this.total1 === this.recordList.length) {
        return true
      }
    },
    load2() {
      console.log('推荐', this.recommendList.length, this.total2)
      if (this.recommendList && this.recommendList.length !== this.total2) {
        this.pageNumber2 += 1
        this.findShareApplyPage()
      } else if (this.total2 === this.recommendList.length) {
        return true
      }
    },
    load3() {
      console.log('分享', this.shareList.length, this.total2)
      if (this.shareList && this.shareList.length !== this.total3) {
        this.pageNumber3 += 1
        this.getInformantClueList()
      } else if (this.total3 === this.shareList.length) {
        return true
      }
    },
    // TA的浏览
    getSharePositionBrowseVOPage() {
      const { pageNumber1: pageNumber, pageSize1: pageSize } = this
      const params = {
        pageNumber,
        pageSize,
        visitorAppUserId: this.$props.appUserId
      }
      getSharePositionBrowseVOPage(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          this.recordList = this.recordList.concat(records)
          this.total1 = total
        }
      })
    },
    // TA的推荐
    getInformantClueList() {
      const { pageNumber3: pageNumber, pageSize3: pageSize } = this
      const params = {
        pageNumber,
        pageSize,
        appUserId: this.$props.appUserId
      }
      getInformantClueList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          this.shareList = this.shareList.concat(records)
          this.total3 = total
        }
      })
    },
    // TA的介绍
    findShareApplyPage() {
      const { pageNumber2: pageNumber, pageSize2: pageSize } = this
      const params = {
        pageNumber,
        pageSize,
        appUserId: this.$props.appUserId
      }
      findShareApplyPage(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          const { records, total } = data
          this.recommendList = this.recommendList.concat(records)
          this.total2 = total
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/thread/visitorDetail.scss';
</style>
