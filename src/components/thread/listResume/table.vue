<template>
  <div class="thread-table">
    <el-table
      v-loading="$props.listLoading"
      :data="$props.resumeData"
      border
      fit
      highlight-current-row
      empty-text="暂时还没有新增简历投递"
      class="tables"
    >
      <el-table-column align="center" label="候选人" fit="true" min-width="300px">
        <template slot-scope="{row}">
          <!-- 转介绍 -->
          <div v-if="row.applyUserType === 2" class="candidate introduce">
            <img v-if="row.applyUserVistAvatar" class="avatar" :src="row.applyUserVistAvatar" />
            <img v-else class="avatar" src="../../../assets/images/notice/avatar_unknown.png" />
            <div class="info">
              <p v-if="row.name" class="info-name">{{ row.name }}</p>
              <p class="info-desc">
                <span v-if="row.mobile">{{ row.mobile }}</span>
                <span v-if="row.email">{{ row.email }}</span>
              </p>
              <div v-if="row.companyName || row.positionTitle" class="info-experience">
                <img class="icon" src="@/assets/images/thread/job.png" />
                <p>
                  <span v-if="row.companyName">{{ row.companyName }}</span>
                  <span v-if="row.positionTitle">{{ row.positionTitle }}</span>
                </p>
                <p v-if="row.applyUserWorkMonth" class="line"></p>
                <p>{{ row.applyUserWorkMonth }}</p>
              </div>
              <p v-if="row.introduction" class="info-experience">
                <img class="icon" src="@/assets/images/thread/reson.png" />
                <span class="reson">{{ row.introduction }}</span>
              </p>
            </div>
            <div v-if="false" class="tag">
              <el-popover placement="top-start" title="简历来源" trigger="hover">
                <div>
                  <p>渠道：转介绍</p>
                  <p>
                    分享人：{{ row.recommendUserName }}
                    <span
                      v-if="row.recommendUserId && userId !== row.recommendUserId"
                      style="cursor: pointer;"
                      @click="sendMsg(row.recommendUserId)"
                    >（发消息）</span>
                  </p>
                  <p>时间：{{ row.applyTime }}</p>
                </div>
                <p slot="reference" @mouseenter="mouseenter(row.id)">
                  转介绍
                  <img class="icon" src="@/assets/images/thread/question.png" />
                </p>
              </el-popover>
            </div>
          </div>

          <!-- 猎头直推 | 自行投递 -->
          <div v-else class="candidate" :class="{ 'direct' : row.applyUserType === 1}">
            <img v-if="row.applyUserVistAvatar" class="avatar" :src="row.applyUserVistAvatar" />
            <img v-else class="avatar" src="../../../assets/images/notice/avatar_unknown.png" />
            <div class="info">
              <p
                v-if="row.applyUserName"
                class="info-name"
                :class="{'active': row.hhResumeId}"
                @click="resumeDetails(row.hhResumeId)"
              >{{ row.applyUserName }}</p>
              <p class="info-desc">
                <span
                  v-if="row.applyUserProvince"
                >{{ row.applyUserProvince | filterCommonDict(dictData.areas) }}</span>
                <span
                  v-if="row.applyUserGender"
                >{{ row.applyUserGender | filterArr(dictData.dicts.gender) }}</span>
                <span v-if="row.applyUserAge">{{ row.applyUserAge }}岁</span>
                <span v-if="row.applyUserWorkMonth">{{ row.applyUserWorkMonth }}</span>
                <span
                  v-if="row.applyUserDegreeCode"
                >{{ row.applyUserDegreeCode | filterArr(resumeDict.degree) }}</span>
              </p>
              <div v-for="(item, index) in row.experiences" :key="index" class="info-experience">
                <img class="icon" src="@/assets/images/thread/job.png" />
                <p class="ellipsis">
                  <span v-if="item.title">{{ item.title }}</span>
                  <span v-if="item.companyName">{{ item.companyName }}</span>
                </p>
                <p v-if="item.startToEndDate" class="line"></p>
                <p>{{ item.startToEndDate }}</p>
              </div>
              <div v-if="row.educations && row.educations[0]" class="info-experience">
                <img class="icon" src="@/assets/images/thread/education.png" />
                <p>{{ row.educations[0].school }}</p>
                <p class="line"></p>
                <p>{{ row.educations[0].startToEndDate }}</p>
              </div>
            </div>
            <div v-if="false && row.applyUserType === 1" class="tag">
              <el-popover placement="top-start" title="简历来源" width="200" trigger="hover">
                <div>
                  <p>渠道：自行投递</p>
                  <p>
                    分享人：{{ row.recommendUserName }}
                    <span
                      v-if="row.recommendUserId && userId !== row.recommendUserId"
                      style="cursor: pointer;"
                      @click="sendMsg(row.recommendUserId)"
                    >（发消息）</span>
                  </p>
                  <p>时间：{{ row.applyTime }}</p>
                </div>
                <p slot="reference" @mouseenter="mouseenter(row.id)">
                  自行投递
                  <img class="icon" src="@/assets/images/thread/question.png" />
                </p>
              </el-popover>
            </div>
            <div v-if="false" class="tag">
              <el-popover placement="top-start" title="简历来源" width="200" trigger="hover">
                <div>
                  <p>渠道：猎头直推</p>
                  <p>
                    分享人：{{ row.recommendUserName }}
                    <span
                      v-if="row.recommendUserId && userId !== row.recommendUserId"
                      style="cursor: pointer;"
                      @click="sendMsg(row.recommendUserId)"
                    >（发消息）</span>
                  </p>
                  <p>时间：{{ row.applyTime }}</p>
                </div>
                <p slot="reference" @mouseenter="mouseenter(row.id)">
                  猎头直推
                  <img class="icon" src="@/assets/images/thread/question.png" />
                </p>
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源" width="160px">
        <template slot-scope="{row}">
          <el-popover
            v-if="row.applyUserType === 1 || row.applyUserType === 2"
            placement="top-start"
            title="简历来源"
            trigger="hover"
          >
            <div v-loading="loading" style="min-width: 350px; min-height: 50px;">
              <!-- <template v-if="shareUserLinkList.length > 0">
                <span v-for="(item, index) in shareUserLinkList" :key="index">
                  {{ item.nickName }}
                  <span v-if="item.imUserId && item.imUserId !== userId" style="cursor: pointer;" @click="sendMsg(item.imUserId)">（发消息）</span>
                  <i v-if="shareUserLinkList.length-1 !== index" class="el-icon-right"></i>
                </span>
              </template>-->
              <el-timeline class="timelines">
                <el-timeline-item v-for="(item, index) in shareUserLinkList" :key="index">
                  <div
                    class="link"
                    style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;"
                  >
                    <p
                      class="left"
                      style="display: flex; flex-direction: row; align-items: center; justify-content: center;"
                    >
                      <img
                        v-if="item.avator"
                        :src="item.avator"
                        style="width: 40px; height: 40px; border-radius: 20px;"
                      />
                      <img
                        v-else
                        src="../../../assets/images/notice/avatar_unknown.png"
                        style="width: 40px; height: 40px; border-radius: 20px;"
                      />
                      <el-link
                        style="margin-left: 10px;"
                        type="primary"
                        @click="visitorDetail(item.appUserId)"
                      >{{ item.nickName }}</el-link>
                      <i
                        v-if="item.imUserId && item.imUserId !== userId"
                        class="el-icon-s-comment"
                        style="cursor: pointer;"
                        @click="sendMsg(item.imUserId)"
                      ></i>
                    </p>
                    <p class="link-right">
                      <span
                        class="time"
                        style="font-size: 12px; margin-right: 5px;"
                      >{{ item.operateTime }}</span>
                      <template v-if="row.applyUserType === 1">
                        <el-tag
                          v-if="shareUserLinkList.length-1 === index"
                          type="info"
                          size="mini"
                        >投递</el-tag>
                        <el-tag v-else type="info" size="mini">分享转发</el-tag>
                      </template>
                      <template v-else>
                        <el-tag
                          v-if="shareUserLinkList.length-1 === index"
                          type="info"
                          size="mini"
                        >转介绍</el-tag>
                        <el-tag v-else type="info" size="mini">分享转发</el-tag>
                      </template>
                    </p>
                  </div>
                </el-timeline-item>
              </el-timeline>
              <p
                v-if="!loading && shareUserLinkList.length <= 0"
                style="text-align: center; line-height: 30px;"
              >未找到简历来源</p>
            </div>
            <div slot="reference" class="source" @mouseenter="mouseenter(row.id)">
              <p
                class="time"
              >{{ row.applyTime && row.applyTime.length > 16 ? row.applyTime.slice(0, 16) : '' }}</p>
              <p class="lable">
                <span v-if="row.applyUserType === 1">自行投递</span>
                <span v-else-if="row.applyUserType === 2">转介绍</span>
              </p>
              <p class="desc">来自：{{ row.recommendUserName }}</p>
            </div>
          </el-popover>
          <div v-else class="source" @mouseenter="mouseenter(row.id)">
            <p
              class="time"
            >{{ row.applyTime && row.applyTime.length > 16 ? row.applyTime.slice(0, 16) : '' }}</p>
            <p class="lable">
              <span>猎头直推</span>
            </p>
            <p class="desc">
              来自：{{ row.recommendUserName }}
              <i
                v-if="row.recommendUserId && userId !== row.recommendUserId"
                class="el-icon-s-comment"
                style="cursor: pointer;"
                @click="sendMsg(row.recommendUserId)"
              ></i>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位" width="260px">
        <template slot-scope="{row}">
          <div v-if="row.applyPositionName || row.applyCompanyName" class="position">
            <p
              v-if="row.applyPositionName"
              class="position-title"
              @click="lookDetail(row.positionId)"
            >{{ row.applyPositionName }}</p>
            <p
              v-if="row.applyCompanyName"
              class="position-desc"
              @click="toCompanyDetail(row.applyCompanyId)"
            >{{ row.applyCompanyName }}</p>
          </div>
          <div v-else style=" position: absolute; left: 50%; top: 50%;">-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120px">
        <template slot-scope="{row}">
          <span
            v-if="row.statusNo"
            class="lable"
          >{{ row.statusNo | filterArr(dictData.dicts.deliveryStatus) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈" width="240px">
        <template slot-scope="{row}">
          <div v-if="row.lastLogCreateTime" class="feedback">
            <p v-if="row.lastLogCreateTime" class="time">
              <span>{{ row.lastLogCreateTime }}</span>
              <span @click="feedbackDialog(row.id)">
                更多
                <i class="el-icon-arrow-right"></i>
              </span>
            </p>
            <p v-if="row.lastLogDescription" class="reson">{{ row.lastLogDescription }}</p>
            <p v-if="row.lastLogRemarks" class="desc">{{ row.lastLogRemarks }}</p>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" fixed="right" width="195px">
        <template slot-scope="{row}">
          <div v-if="row.statusNo === 10" class="operate">
            <p v-if="row.applyUserType === 2">
              <el-button type="primary" size="small" @click="introduceDialog(row)">查看</el-button>
            </p>
            <p v-else>
              <el-button
                type="primary"
                size="small"
                :loading="row.isLook"
                :class="{addWidth: row.isLook}"
                @click="toResumeDetail(row.id)"
              >{{ row.isLook ? '正在打开简历' : '查看' }}</el-button>
            </p>
          </div>
          <div v-if="row.statusNo === 11" class="operate">
            <p>
              <el-button type="primary" size="small" @click="adoptDialog(row.id, false)">采用</el-button>
            </p>
            <p>
              <el-button size="small" @click="noAdoptDialog(row.id)">不采用</el-button>
            </p>
          </div>
          <div v-if="row.statusNo === 13 || row.statusNo === 23" class="operate">
            <p>
              <el-button type="primary" size="small" @click="adoptDialog(row.id, true)">重新采用</el-button>
            </p>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 采用简历弹窗 -->
    <el-dialog title="请确认是否采用该简历" :visible.sync="adoptDialogVisible" width="500px" center>
      <div class="main">
        <el-form ref="adoptForm" :model="adoptForm" label-width="80px">
          <el-form-item label="备注" prop="desc" size="small">
            <el-input v-model="adoptForm.desc" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="adoptDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm1('adoptForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 不采用简历弹窗 -->
    <el-dialog title="请确认是否采用该简历" :visible.sync="noAdoptDialogVisible" width="500px" center>
      <div class="main">
        <el-form ref="noAdoptForm" :model="noAdoptForm" :rules="noAdoptRules" label-width="100px">
          <el-form-item label="不合适原因" prop="reason" size="small">
            <el-select v-model="noAdoptForm.reason" placeholder="请选择不适合原因" style="width: 100%;">
              <el-option
                v-for="item in dictData.dicts.noUserReason"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="desc" size="small">
            <el-input v-model="noAdoptForm.desc" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="noAdoptDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm2('noAdoptForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 推荐反馈弹窗 -->
    <el-dialog title="推荐反馈" :visible.sync="feedbackDialogVisible" width="800px">
      <div class="timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in logList"
            :key="index"
            :timestamp="item.createTime"
            placement="top"
          >
            <p class="tag">{{ item.description }}</p>
            <p class="reson">{{ item.remarks }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <!-- 转介绍信息 -->
    <el-dialog title="转介绍信息" :visible.sync="introduceDialogVisible" width="500px">
      <div class="introduceInfo">
        <p v-if="introduceInfo.name">姓名：{{ introduceInfo.name }}</p>
        <p v-if="introduceInfo.mobile">手机：{{ introduceInfo.mobile }}</p>
        <p v-if="introduceInfo.email">邮箱：{{ introduceInfo.email }}</p>
        <p v-if="introduceInfo.companyName">所在公司：{{ introduceInfo.companyName }}</p>
        <p v-if="introduceInfo.positionTitle">TITLE：{{ introduceInfo.positionTitle }}</p>
        <p v-if="introduceInfo.introduction">推荐理由：{{ introduceInfo.introduction }}</p>
      </div>
    </el-dialog>

    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :direction="'btt'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier v-if="drawer" slot="inner-body" :company-account-type="1" />
    </drawer-common>

    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />

    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionId"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="positionId" />
    </drawer-common>

    <!-- 访客详情 -->
    <el-dialog
      :visible.sync="visitorDetailVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
      :show-close="false"
      class="visitor-detail-modal"
      @close="closeIt"
    >
      <keep-alive v-if="isRouterAlive">
        <visitor-detail
          ref="change"
          :visitor-detail-data="visitorDetailData"
          :resume-info="resumeInfo"
          :resume-detail="resumeDetail"
          :visitor-detail-visible="visitorDetailVisible"
          :app-user-id="appUserId"
          :educations="educations"
          :experiences="experiences"
          :share-chain-user-avatars="shareChainUserAvatars"
          @hideFooter="hideFooter"
        />
      </keep-alive>
      <span v-if="footerVisible" slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeIt">取 消</el-button>
        <el-button size="small" type="primary" @click="checkLabels(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DrawerCommon from '@/components/common/drawerCommon'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'
import resumeDict from '@/assets/js/resume'
import dialogChat from '@/components/common/dialogChat.vue'
import positionDetail from '@/views/position/positionDetail'
import { TableMixin } from '@/mixins/position'
import {
  getShareUserBrowse,
  selectShareApplyLogList,
  insertShareApplyLogBO,
  synShareResume,
  getShareUserLinkList
} from '@/api/thread'
import { filterDates } from '@/utils/common'
import VisitorDetail from '@/components/thread/visitorDetail'
export default {
  components: {
    DrawerCommon,
    ResumeDetailSupplier,
    dialogChat,
    positionDetail,
    VisitorDetail
  },
  mixins: [TableMixin],
  props: {
    resumeData: {
      required: true,
      type: Array
    },
    listLoading: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      footerVisible: false,
      isRouterAlive: true,
      adoptDialogVisible: false,
      noAdoptDialogVisible: false,
      feedbackDialogVisible: false,
      introduceDialogVisible: false,
      drawer: false,
      dialogVisible: false,
      adoptForm: {
        desc: ''
      },
      noAdoptForm: {
        reason: '',
        desc: ''
      },
      noAdoptRules: {
        reason: [
          { required: true, message: '请选择不合适原因', trigger: 'change' }
        ]
      },
      resumeDict: [],
      operateMethod: [
        { lable: '查看', value: 1 },
        { lable: '采用', value: 2 },
        { lable: '不采用', value: 3 },
        { lable: '重新采用', value: 4 }
      ],
      id: '',
      againAdopt: false, // 是否重新采用
      introduceInfo: '',
      logList: [],
      loading: false,
      shareUserLinkList: [],
      visitorDetailVisible: false,
      visitorDetailData: {}, // 访客详情
      resumeInfo: {}, // 简历详情
      resumeDetail: {}, // 简历基本信息
      educations: [], // 教育经历
      experiences: [], // 工作经历
      shareChainUserAvatars: [], // 共同人脉
      appUserId: ''
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userId: state => state.userInfo.userId
    })
  },
  mounted() {
    this.resumeDict = resumeDict
    sessionStorage.setItem('prvId', '')
  },
  methods: {
    // 是否隐藏模态框底部按钮组
    hideFooter() {
      this.footerVisible = true
    },
    searchList() {},
    // 企业详情
    toCompanyDetail(id) {
      this.$router.push({
        path: 'companyDetail',
        query: {
          tab: 'companyDescription',
          companyId: id
        }
      })
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 介绍信息
    introduceDialog(info) {
      this.introduceInfo = info
      this.introduceDialogVisible = true
      const params = {
        applyId: info.id,
        operateMethod: 1
      }
      this.operate(params)
    },
    // 采用弹窗
    adoptDialog(id, val) {
      this.id = id
      this.againAdopt = val
      this.adoptForm.desc = ''
      this.adoptDialogVisible = true
    },
    // 不采用弹窗
    noAdoptDialog(id) {
      this.id = id
      this.noAdoptForm.reason = ''
      this.noAdoptForm.desc = ''
      this.noAdoptDialogVisible = true
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            applyId: this.id,
            operateMethod: this.againAdopt ? 4 : 2,
            remarks: this.adoptForm.desc
          }
          this.operate(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            applyId: this.id,
            operateMethod: 3,
            description: this.noAdoptForm.reason,
            remarks: this.noAdoptForm.desc
          }
          this.operate(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 操作
    operate(params) {
      insertShareApplyLogBO(params)
        .then(res => {
          console.log(res)
          if (res.code === '000000') {
            this.adoptDialogVisible = false
            this.noAdoptDialogVisible = false
            this.$emit('reload')
            if (params.operateMethod === 2) {
              this.$message.success('简历已采用')
            } else if (params.operateMethod === 3) {
              this.$message.success('简历未采用')
            } else if (params.operateMethod === 4) {
              this.$message.success('简历重新采用')
            }
          }
        })
        .catch(err => {
          this.adoptDialogVisible = false
          this.noAdoptDialogVisible = false
          console.log(err)
        })
    },
    // 全部操作动态
    feedbackDialog(id) {
      this.feedbackDialogVisible = true
      const params = {
        applyId: id
      }
      selectShareApplyLogList(params).then(res => {
        console.log(res)
        this.logList = res.data
      })
    },
    resumeDetails(id) {
      if (id) {
        this.drawer = true
        sessionStorage.setItem('resumeId', id)
      }
    },
    // 同步建立跳转简历详情
    toResumeDetail(id) {
      this.id = id
      this.resumeData.forEach(item => {
        if (item.id === id) {
          item.isLook = true
        }
      })
      const params = {
        applyId: id
      }
      synShareResume(params)
        .then(res => {
          this.resumeData.forEach(item => {
            if (item.id === id) {
              item.isLook = false
            }
          })
          console.log(res)
          if (res) {
            this.drawer = true
            sessionStorage.setItem('resumeId', res.data)
          } else {
            this.$message.error('简历打开失败')
          }
          const data = {
            applyId: this.id,
            operateMethod: 1
          }
          this.operate(data)
        })
        .catch(err => {
          this.resumeData.forEach(item => {
            if (item.id === id) {
              item.isLook = false
            }
          })
          console.log(err)
        })
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.drawer = false
      // this.$emit('refreshList', 1)
    },
    mouseenter(id) {
      const prvId = sessionStorage.getItem('prvId')
      if (prvId && prvId * 1 === id * 1) {
        this.loading = false
        return
      } else {
        const params = {
          // applyId: 100033
          applyId: id
        }
        this.loading = true
        this.shareUserLinkList = []
        getShareUserLinkList(params)
          .then(res => {
            this.shareUserLinkList = res.data
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
      }
      sessionStorage.setItem('prvId', id)
    },
    // 发信息
    sendMsg(userID) {
      if (userID) {
        this.$bus.$emit('closeChat')
      }
      this.$store
        .dispatch('checkoutConversation', `C2C${userID}`)
        .then(() => {
          this.dialogVisible = true
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 关闭访客详情弹窗
    closeIt() {
      this.visitorDetailVisible = false
      this.footerVisible = false
    },
    // 访客详情
    visitorDetail(appUserId) {
      this.appUserId = appUserId
      this.visitorDetailVisible = true
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
      this.getShareUserBrowse(appUserId)
    },
    getShareUserBrowse(appUserId) {
      const params = {
        appUserId
      }
      getShareUserBrowse(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.visitorDetailData = data
          this.visitorDetailData.lastBrowseTime &&
            this.$set(
              this.visitorDetailData,
              'lastBrowseTime',
              filterDates(this.visitorDetailData.lastBrowseTime)
            )
          this.resumeInfo =
            (this.visitorDetailData && this.visitorDetailData.resumeInfo) || {}
          this.resumeDetail = (this.resumeInfo && this.resumeInfo.detail) || {}
          this.educations =
            (this.resumeInfo && this.resumeInfo.educations) || []
          this.experiences =
            (this.resumeInfo && this.resumeInfo.experiences) || []
          this.shareChainUserAvatars =
            (this.visitorDetailData &&
              this.visitorDetailData.shareChainUserAvatars) ||
            []
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
@import '@/assets/sass/thread/table.scss';
.visitor-detail-modal ::v-deep .el-dialog__body {
  padding: 0;
  overflow: hidden;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.tables {
  width: 100%;
  ::v-deep .el-table__row {
    td:not(.is-hidden):last-child {
      right: -1px;
    }
  }
  ::v-deep .el-table__body .el-table__row > td {
    padding: 0;
    .cell {
      padding: 0;
    }
  }
  .candidate {
    display: flex;
    flex-direction: row;
    width: 100%;
    // height: 190px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
    .info {
      flex: 1;
      text-align: left;
      margin-left: 20px;
      .info-name {
        font-size: 16px;
        font-weight: 600;
        color: #323232;
        line-height: 28px;
      }
      .active:hover {
        color: #1678f9;
        text-decoration: underline;
        cursor: pointer;
      }
      .info-desc {
        font-size: 14px;
        color: #808080;
        line-height: 20px;
        margin: 4px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          margin-right: 19px;
          position: relative;
          &::before {
            content: '';
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #7e7e7e;
            position: absolute;
            top: 50%;
            right: -11px;
            transform: translateY(-50%);
          }
          &:last-child::before {
            display: none;
          }
        }
      }
      .info-experience {
        font-size: 14px;
        color: #808080;
        line-height: 20px;
        margin-top: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .ellipsis {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .line {
          flex: 1;
          border: 1px dashed #b3b3b3;
          margin: 0 10px;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          vertical-align: top;
        }
        span {
          margin-right: 19px;
          position: relative;
          &::before {
            content: '';
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #7e7e7e;
            position: absolute;
            top: 50%;
            right: -11px;
            transform: translateY(-50%);
          }
          &:last-child {
            margin: 0;
          }
          &:last-child::before {
            display: none;
          }
        }
        .reson {
          float: right;
          width: 288px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          white-space: pre-wrap;
          margin: 0;
        }
      }
    }
    .tag {
      width: 0;
      height: 0;
      border-right: 72px solid #ffa380;
      border-bottom: 72px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      p {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100px;
        font-size: 12px;
        color: #ffffff;
        line-height: 17px;
        padding-left: 2px;
        box-sizing: border-box;
        position: absolute;
        top: 20px;
        left: -8px;
        transform: rotate(45deg);
        .icon {
          margin-left: 2px;
          width: 17px;
          height: 17px;
        }
      }
    }
  }
  .direct {
    .tag {
      border-right: 72px solid #7db2f9;
    }
  }
  .introduce {
    .info {
      .info-name {
        &:hover {
          color: #323232;
          text-decoration: none;
          cursor: none;
        }
      }
    }
    .tag {
      border-right: 72px solid #69c5d3;
    }
  }
  .source {
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    .time,
    .desc {
      font-size: 14px;
      color: #15181b;
      line-height: 20px;
    }
    .lable {
      margin: 8px 0 5px;
    }
  }
  .position {
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    .position-title {
      font-size: 16px;
      font-weight: 600;
      color: #323232;
      line-height: 22px;
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: #1678f9;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .position-desc {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .lable {
    display: inline-block;
    font-size: 12px;
    color: #ff5d1e;
    line-height: 17px;
    border: 1px solid #ff5d1e;
    border-radius: 2px;
    padding: 2px 4px;
  }
  .feedback {
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    .time {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      color: #15181b;
      line-height: 20px;
      span:last-child {
        font-size: 12px;
        color: #1678f9;
        cursor: pointer;
        margin-left: auto;
      }
    }
    .reson {
      display: inline-block;
      font-size: 12px;
      color: #7db2f9;
      line-height: 17px;
      border: 1px solid #7db2f9;
      border-radius: 2px;
      padding: 2px 4px;
      margin: 17px 0;
    }
    .desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      white-space: pre-wrap;
    }
  }
  .operate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 8px;
      .el-button {
        width: 100px;
      }
      .addWidth {
        width: 120px;
      }
      .el-button--primary {
        color: #ffffff;
        background: #1678f9;
      }
      .el-button--default {
        color: #1678f9;
        border: 1px solid #1678f9;
      }
    }
  }
}
.el-dialog {
  .main {
    ::v-deep .el-tag {
      width: 80px;
      text-align: center;
      margin-right: 20px;
    }
  }
  .timeline {
    height: 500px;
    overflow-y: auto;
    .tag {
      display: inline-block;
      font-size: 12px;
      color: #7db2f9;
      line-height: 17px;
      border: 1px solid #7db2f9;
      border-radius: 2px;
      padding: 2px 4px;
      margin-top: 5px;
    }
    .reson {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      margin-top: 10px;
    }
  }
  .introduceInfo {
    p {
      white-space: pre-wrap;
      margin-bottom: 10px;
    }
  }
}
</style>
