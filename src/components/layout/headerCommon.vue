<template>
  <div>
    <div
      v-if="
        [
          '/login',
          '/forgetPassword',
          '/register',
          '/completeInfo',
          '/protocol1',
          '/protocol2',
          '/scan',
          '/srp',
          '/upgrade',
          '/material',
          '/signup',
          '/capital',
          '/reserve',
        ].indexOf(routeName) === -1
      "
      class="header-common clear"
    >
      <el-header>
        <div
          class="logo"
          @click="
            () => {
              this.$router.push({ path: '/' });
            }
          "
        >
          <img
            src="~@/assets/images/common/logo.png"
            alt="大猎英才"
            title="大猎英才"
          />
        </div>
        <el-menu
          v-if="
            [
              '/recommendResume',
              '/recommendPosition',
              '/recommendReport',
              '/reviewReport',
              '/sendSuccess',
            ].indexOf(routeName) === -1
          "
          :default-active="activeIndex"
          class="nav"
          mode="horizontal"
          text-color="#8D9299"
          active-text-color="#1678F9"
          @select="handleSelect"
        >
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.workBenchSwitch
            "
            index="home"
            title="工作台"
          >工作台</el-menu-item>
          <el-menu-item v-if="userInfo.companyAccountType !== 3" index="customer" title="客户">客户</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.promoterProjectSwitch
            "
            index="promoterProject"
            title="促销项目"
          >促销项目</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.promoterUserSwitch && userInfo.companyAccountType !== 3
            "
            index="promoterPromotion"
            title="促销员"
          >促销员</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.companyWeiZhanSwitch
            "
            index="enterpriseStory"
            title="微门户"
          >微门户</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.positionManageSwitch
            "
            index="job"
            title="职位"
          >职位</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.cluesManageSwitch
            "
            index="threadList"
            title="线索"
          >线索</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.recruitManageSwitch
            "
            index="sendResumeList"
            title="招聘管理"
          >招聘管理</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.videoInterviewSwitch
            "
            index="interviewRoom"
            title="面试"
          >面试</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.openHuntingGroundSwitch
            "
            index="all"
            title="开放猎场"
          >开放猎场</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.projectManageSwitch
            "
            index="project"
            title="项目"
          >项目</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.recommendManageSwitch
            "
            index="allOrder"
            title="推荐管理"
          >推荐管理</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.resumePoolSwitch
            "
            index="resume"
            title="人才库"
          >人才库</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems && userInfo.packageItems.dataReportSwitch
            "
            index="tendency"
            title="数据"
          >数据</el-menu-item>
          <el-menu-item
            v-if="
              userInfo.packageItems &&
                userInfo.packageItems.systemSettingsSwitch &&
                userInfo.companyRole === 4
            "
            index="companyInfo"
            title="设置"
          >设置</el-menu-item>
          <el-menu-item
            v-if="userInfo.companyAccountType === 2"
            title="推荐查重"
            class="check-repeat"
            index="checkRepeat"
            @click="checkRepeat"
          >推荐查重</el-menu-item>
          <el-submenu
            index="resumeMenu"
            class="resume-menu"
            popper-class="sub-menu-pop"
          >
            <template slot="title"></template>
            <el-menu-item
              v-if="
                userInfo.packageItems &&
                  userInfo.packageItems.positionManageSwitch &&
                  (userInfo.companyRole === 2 ||
                  userInfo.companyRole === 3 ||
                  userInfo.companyRole === 4)
              "
              index="releasePosition"
            >新增职位</el-menu-item>
            <el-menu-item
              v-if="
                userInfo.packageItems &&
                  userInfo.packageItems.companyPublishCount > 1 &&
                  (userInfo.companyRole === 3 || userInfo.companyRole === 4)
              "
              @click="companyDialog = true"
            >新增企业</el-menu-item>
            <el-menu-item
              v-if="
                userInfo.packageItems && userInfo.packageItems.resumePoolSwitch
              "
              index="uploadResume"
            >新增简历</el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="notice">
            消息
            <span v-if="unreadCount > 0" class="notice-num">{{ unreadCount }}</span>
          </el-menu-item>-->
        </el-menu>
        <div
          v-if="
            [
              '/recommendResume',
              '/recommendPosition',
              '/recommendReport',
              '/reviewReport',
              '/sendSuccess',
            ].indexOf(routeName) === -1
          "
          class="me"
        >
          <!-- <p class="upload-text" title="简历上传" @click="uploadResume">简历上传</p> -->
          <p class="notice" title="消息" @click="toChat">
            <span v-if="unreadCount > 0" class="num">{{ unreadCount }}</span>
          </p>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <img
                v-if="
                  userInfo &&
                    $store.state.common &&
                    $store.state.common.userProfile &&
                    $store.state.common.userProfile.avatarUrlView
                "
                :src="$store.state.common.userProfile.avatarUrlView"
              />
              <img
                v-else-if="
                  userInfo &&
                    $store.state.common &&
                    $store.state.common.userProfile &&
                    $store.state.common.userProfile.gender === 1
                "
                src="~@/assets/images/common/man_avatar.png"
              />
              <img
                v-else-if="
                  userInfo &&
                    $store.state.common &&
                    $store.state.common.userProfile &&
                    $store.state.common.userProfile.gender === 2
                "
                src="~@/assets/images/common/women_avatar.png"
              />
              <img v-else src="~@/assets/images/common/avatar.png" />
            </span>
            <el-dropdown-menu
              v-if="$store.state.common && $store.state.common.userProfile"
              slot="dropdown"
              class="header-menu"
            >
              <el-dropdown-item command="a" class="user-info">
                <img
                  v-if="
                    userInfo &&
                      $store.state.common &&
                      $store.state.common.userProfile &&
                      $store.state.common.userProfile.avatarUrlView
                  "
                  :src="$store.state.common.userProfile.avatarUrlView"
                />
                <img
                  v-else-if="
                    userInfo &&
                      $store.state.common &&
                      $store.state.common.userProfile &&
                      $store.state.common.userProfile.gender === 1
                  "
                  src="~@/assets/images/common/man_avatar.png"
                />
                <img
                  v-else-if="
                    userInfo &&
                      $store.state.common &&
                      $store.state.common.userProfile &&
                      $store.state.common.userProfile.gender === 2
                  "
                  src="~@/assets/images/common/women_avatar.png"
                />
                <img v-else src="~@/assets/images/common/avatar.png" />
                <div class="right">
                  <p class="user-name">
                    {{ userInfo.nickName }}
                    <span
                      v-if="
                        $store.state.userInfo &&
                          $store.state.userInfo.companyCertificationStatus === 1
                      "
                      class="certify active"
                    >已认证</span>
                    <span
                      v-else-if="
                        $store.state.userInfo &&
                          $store.state.userInfo.companyCertificationStatus === 2
                      "
                      class="certify active"
                    >认证中</span>
                    <span
                      v-else-if="
                        $store.state.userInfo &&
                          $store.state.userInfo.companyCertificationStatus === 3
                      "
                      class="certify"
                    >认证未通过</span>
                    <span
                      v-else-if="
                        ($store.state.userInfo &&
                          $store.state.userInfo.companyCertificationStatus ===
                          0) ||
                          ($store.state.userInfo &&
                          $store.state.userInfo.companyCertificationStatus ===
                          null)
                      "
                      class="certify"
                      @click="handleCommand('f')"
                    >未认证</span>
                  </p>
                  <p class="company-name">{{ userInfo.companyName }}</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="b" class="user-version">
                当前版本
                <span
                  v-if="userInfo.companyAccountType === 1"
                  class="blue"
                >企业版</span>
                <span
                  v-if="userInfo.companyAccountType === 2"
                  class="blue"
                >供应商版</span>
              </el-dropdown-item>
              <el-dropdown-item
                command="c"
                divided
                class="user-user"
              >个人信息</el-dropdown-item>
              <el-dropdown-item
                command="d"
                class="user-password"
              >修改密码</el-dropdown-item>
              <el-dropdown-item
                command="e"
                divided
                class="user-contact"
              >联系客服</el-dropdown-item>
              <el-dropdown-item command="f" class="user-wechat">
                关注微信
                <div class="qrcode">
                  <img src="~@/assets/images/common/qrcode.jpg" />
                  <p>关注大猎英才公众号</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                command="g"
                class="user-web"
              >前往官网</el-dropdown-item>
              <el-dropdown-item
                command="h"
                divided
                class="user-quit"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div
          v-if="
            [
              '/recommendResume',
              '/recommendPosition',
              '/recommendReport',
              '/reviewReport',
              '/sendSuccess',
            ].indexOf(routeName) !== -1
          "
          class="recommend-candidate-nav"
        >
          <img
            v-if="
              routeName === '/recommendResume' ||
                routeName === '/recommendPosition'
            "
            class="nav-pic"
            src="@/assets/images/position/recommend-candidate-nav-1.png"
          />
          <img
            v-if="routeName === '/recommendReport'"
            class="nav-pic"
            src="@/assets/images/position/recommend-candidate-nav-2.png"
          />
          <img
            v-if="routeName === '/reviewReport' || routeName === '/sendSuccess'"
            class="nav-pic"
            src="@/assets/images/position/recommend-candidate-nav-3.png"
          />
          <p class="nav-des">
            <span
              v-if="routeName !== '/recommendPosition'"
              class="des-name"
            >选择候选人</span>
            <span
              v-if="routeName === '/recommendPosition'"
              class="des-name"
            >选择职位</span>
            <span class="des-name">撰写推荐报告</span>
            <span class="des-name">发送推荐报告</span>
          </p>
        </div>
      </el-header>
    </div>
    <div
      v-if="['/scan', '/srp'].indexOf(routeName) !== -1"
      class="login-header"
    >
      <div class="header-main">
        <img
          src="~@/assets/images/common/logo_white.png"
          @click="
            () => {
              this.$router.push({ path: '/' });
            }
          "
        />
      </div>
    </div>
    <div
      v-if="
        [
          '/login',
          '/forgetPassword',
          '/register',
          '/completeInfo',
          '/upgrade',
          '/material',
          '/signup',
          '/capital',
        ].indexOf(routeName) !== -1
      "
      class="login-header"
      style="display: none"
    >
      <div class="header-main">
        <img
          src="~@/assets/images/common/logo_white.png"
          @click="
            () => {
              this.$router.push({ path: '/' });
            }
          "
        />
      </div>
    </div>
    <!-- <div
      v-if="['/protocol1','/protocol2'].indexOf(routeName) !== -1"
      class="login-header"
      style="height44px;"
    >
      <div class="header-main">
        <img
          src="~@/assets/images/common/logo_white.png"
          @click="()=>{this.$router.push({ path: '/' })}"
        />
      </div>
    </div> -->

    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />

    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer
        v-if="drawer"
        slot="inner-body"
        ref="uploadDrawer"
        @fatherMethod="close"
      />
    </drawer-common>

    <!-- 公司管理（抽屉） -->
    <drawer-common
      :drawer.sync="companyDialog"
      :router="'company'"
      :no-new-window="true"
    >
      <!-- <company v-if="companyDialog" slot="inner-body" /> -->
      <edit-company
        slot="inner-body"
        :operator-type="'add'"
        @closeDrawer="closeDrawer"
      />
    </drawer-common>

    <!-- 查重功能弹框 -->
    <el-dialog
      v-if="repeatDialogVisible"
      title="推荐查重"
      :visible.sync="repeatDialogVisible"
      :close-on-click-modal="false"
      class="repeat-form"
      width="500px"
      @close="cancelRepeat('repeatForm')"
    >
      <el-form
        ref="repeatForm"
        :model="repeatForm"
        :rules="repeatFormRules"
        size="mini"
        label-width="90px"
      >
        <el-form-item label="查重企业" prop="companyName">
          <el-select
            v-model="repeatForm.companyName"
            clearable
            placeholder="请选择查重企业"
          >
            <el-option label="平安" value="pingan"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="repeatForm.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model.number="repeatForm.mobile"
            clearable
            maxlength="11"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="repeatForm.email" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="证件号码" prop="idNum">
          <el-input v-model="repeatForm.idNum" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button
          size="mini"
          @click="resetRepeat('repeatForm')"
        >重 置</el-button>
        <el-button
          :loading="submitLoading"
          type="primary"
          size="mini"
          @click="saveRepeat('repeatForm')"
        >快速查重</el-button>
      </span>
      <div class="result">
        <span>查询结果：</span>
        <p v-if="result === false">
          <i class="el-icon-success-a mr-5"></i>{{ message }}
        </p>
        <p v-if="result === true">
          <i
            class="el-icon-warning-outline mr-5"
            style="color: rgb(187, 110, 82)"
          ></i>{{ message }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { logout } from '@/api/myCenter';
import dialogChat from '@/components/common/dialogChat.vue';
import DrawerCommon from '@/components/common/drawerCommon';
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer';
// import company from '@/views/company'
import editCompany from '@/views/company/editCompany';
import { checkPingAnRepeat } from '@/api/common';

export default {
  name: 'HeaderCommon',
  components: {
    DrawerCommon,
    UploadDrawer,
    dialogChat,
    editCompany
    // company
  },
  data() {
    return {
      message: '',
      submitLoading: false,
      repeatForm: {
        companyName: 'pingan',
        name: '',
        mobile: '',
        email: '',
        idNum: ''
      },
      result: null,
      repeatFormRules: {
        companyName: [
          { required: true, message: '请选择查重企业', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.$verify.emailFormat, trigger: 'blur' }
        ]
      },
      storyRules: {
        name: [{ required: true, message: '请输入故事名称', trigger: 'blur' }],
        sort: [
          { required: true, message: '请选择故事排序', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请输入故事描述', trigger: 'blur' }]
      },
      repeatDialogVisible: false,
      drawer: false,
      companyDialog: false,
      activeIndex: 'index',
      routeName: '',
      dialogVisible: false, // 消息弹窗
      unreadCount: 0, // 未读消息
      menuList: [
        {
          name: 'baseInfo',
          title: '个人资料'
        },
        {
          name: 'skill',
          title: '擅长方向'
        },
        {
          name: 'editPassword',
          title: '修改密码'
        },
        {
          name: 'identification',
          title: '实名认证'
        },
        {
          name: 'attention',
          title: '我的关注'
        },
        {
          name: 'invote',
          title: '邀请好友'
        }
        // {
        //   name: 'earning',
        //   title: '我的收入'
        // }
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userID: (state) => state.userInfo.cwUserId
    })
  },
  watch: {
    $route(to, from) {
      this.routeName = to.path;
      console.log(111111111, to.name)
      if (to.name === 'job' || to.name === 'jobDetail') {
        this.activeIndex = 'job';
      } else if (to.name === 'project' || to.name === 'projectDetail') {
        this.activeIndex = 'project';
      } else if (
        to.name === 'all' ||
        to.name === 'hunter' ||
        to.name === 'rpo' ||
        to.name === 'subscription' ||
        to.name === 'recommend' ||
        to.name === 'follow' ||
        to.name === 'monad' ||
        to.name === 'record' ||
        to.name === 'browse'
      ) {
        this.activeIndex = 'all';
      } else if (
        to.name === 'allOrder' ||
        to.name === 'recommendStage' ||
        to.name === 'interviewStage' ||
        to.name === 'offerStage' ||
        to.name === 'entryStage' ||
        to.name === 'overProtectionStage' ||
        to.name === 'fail'
      ) {
        this.activeIndex = 'allOrder';
      } else if (to.name === 'resume') {
        this.activeIndex = 'resume';
      } else if (to.name === 'notice') {
        this.activeIndex = 'notice';
      } else if (to.name === 'home') {
        this.activeIndex = 'home';
      } else if (to.name === 'threadList') {
        this.activeIndex = 'threadList';
      } else if (to.name === 'sendResumeList') {
        this.activeIndex = 'sendResumeList';
      } else if (
        to.name === 'tendency' ||
        to.name === 'companyTendency' ||
        to.name === 'companyDistribution' ||
        to.name === 'performanceTendency' ||
        to.name === 'kpiTendency' ||
        to.name === 'recommendTendency'
      ) {
        this.activeIndex = 'tendency';
      } else if (
        to.name === 'companyInfo' ||
        to.name === 'department' ||
        to.name === 'member' ||
        to.name === 'protocol' ||
        to.name === 'interfaceConfig'
      ) {
        this.activeIndex = 'companyInfo';
      } else if (
        to.name === 'enterpriseStory' ||
        to.name === 'recruitmentZone' ||
        to.name === 'personality' ||
        to.name === 'officialAccounts'
      ) {
        this.activeIndex = 'enterpriseStory';
      } else if (to.name === 'interviewRoom') {
        this.activeIndex = 'interviewRoom';
      } else if (to.name === 'customer') {
        this.activeIndex = 'customer';
      } else if (to.name === 'promoterProject' || to.name === 'promoterProjectDetail') {
        this.activeIndex = 'promoterProject';
      } else if (to.name === 'promoterPromotion') {
        this.activeIndex = 'promoterPromotion';
      } else {
        this.activeIndex = '';
      }
    },
    '$store.state.unreadCount'() {
      this.unreadCount = this.$store.state.unreadCount;
    }
  },
  mounted() {
    this.$store.commit('setMenuList', this.menuList);
    this.$bus.$on('closeChat', () => {
      this.dialogVisible = false;
    });
  },
  methods: {
    // 关闭新增企业弹框
    closeDrawer() {
      this.companyDialog = false;
    },
    checkPingAnRepeat() {
      this.submitLoading = true;
      const { email, idNum, mobile, name } = this.repeatForm;
      const params = { email, idNum, mobile, name };
      checkPingAnRepeat(params)
        .then((res) => {
          this.submitLoading = false;
          const { code, data, message } = res;
          if (code === '000000') {
            this.result = data && data.isRepeat;
            this.message = data && data.message;
          } else {
            this.$message({
              message,
              type: 'warning'
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 关闭弹框
    cancelRepeat(formName) {
      this.result = null;
      this.repeatDialogVisible = false;
      this.resetRepeat(formName);
    },
    // 重置
    resetRepeat(formName) {
      this.$refs[formName].resetFields();
    },
    // 快速查重
    saveRepeat(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkPingAnRepeat();
        } else {
          return false;
        }
      });
    },
    // 推荐查重
    checkRepeat() {
      this.repeatDialogVisible = true;
    },
    close() {
      this.drawer = false;
      this.$refs.uploadDrawer.destroyedInterval();
    },
    uploadResume() {
      if (this.$route.name === 'resume') {
        //  只有在非简历页才跳转简历页
        this.$router.push({ name: 'resume', query: {} });
      }
      this.drawer = true;
    },
    // 聊天
    toChat() {
      this.dialogVisible = !this.dialogVisible;
    },
    handleSelect(key, keyPath) {
      if (key === 'uploadResume') {
        this.uploadResume();
      } else {
        if (key === 'releasePosition') {
          this.$router.push({ name: key, query: { flag: 'pushRouter' } });
        } else {
          console.log(key)
          this.$router.push({ name: key });
        }
      }
    },
    // 跳转至个人中心
    toMyCenter(name) {
      this.$router.push({ name });
    },
    handleCommand(command) {
      if (command === 'b') {
        console.log('');
      } else if (command === 'c') {
        const arr = JSON.parse(JSON.stringify(this.menuList));
        arr.filter((item) => {
          if (item.name === 'baseInfo') {
            item.className = 'active';
          } else {
            item.className = '';
          }
        });
        this.$store.commit('setMenuList', arr);
        this.toMyCenter('baseInfo');
      } else if (command === 'd') {
        const arr = JSON.parse(JSON.stringify(this.menuList));
        arr.filter((item) => {
          if (item.name === 'editPassword') {
            item.className = 'active';
          } else {
            item.className = '';
          }
        });
        this.$store.commit('setMenuList', arr);
        this.$router.push({ name: 'editPassword' });
      } else if (command === 'e') {
        this.toContact();
      } else if (command === 'f') {
        this.$router.push('/certification');
      } else if (command === 'g') {
        window.open('https://www.dalieyingcai.com');
      } else if (command === 'h') {
        this.logout();
      }
    },
    logout() {
      logout().then((res) => {
        const { code } = res;
        if (code === '000000') {
          // 判断缓存中是否有登录信息，如果有的话重新缓存一下
          const loginInfo = this.$storage.getLocation('loginInfo');
          if (loginInfo && loginInfo !== 'null') {
            this.$storage.setLocation('loginInfo', loginInfo);
          }
          this.$storage.clearSessionAll();
          this.$store.dispatch('dispatchUpdateUserInfo', {});
          this.$router.push('/login');
        }
      });
    },
    toContact() {
      if (this.userID) {
        this.$bus.$emit('closeChat');
      }
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userID}`)
        .then(() => {
          this.dialogVisible = true;
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          });
        });
    }
  }
};
</script>
<style scoped lang="scss">
.el-icon-success-a {
  width: 13px;
  height: 13px;
  display: inline-block;
  background: url("~@/assets/images/common/check.png") no-repeat;
  background-size: 13px;
  vertical-align: -1px;
}
.repeat-form {
  .el-select {
    width: 100%;
  }
  .result {
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    display: flex;
    p {
      flex: 1;
      position: relative;
      padding-left: 20px;
      i {
        position: absolute;
        left: 0;
        top: 3px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
    width: 100%;
    display: block;
    margin: 30px auto 20px auto;
  }
}
.check-repeat {
  position: absolute !important;
  right: 25px;
  top: 0;
  z-index: 10;
  font-size: 12px !important;
  color: #ea2b3fff !important;
  border-bottom-color: transparent !important;
  font-weight: normal !important;
  &:hover {
    color: #ea2b3fff !important;
  }
  &:after {
    display: none !important;
  }
}
.header-menu ::v-deep .el-dropdown-menu__item {
  text-align: left;
  position: relative;
  padding-bottom: 15px;
  font-size: 13px;
  height: initial;
  line-height: initial;
  color: #626466;
  width: 182px;
  &.el-dropdown-menu__item--divided {
    border: none;
    &::after {
      content: "";
      width: 182px;
      background: #ebeef5;
      height: 1px;
      display: inline-block;
      position: absolute;
      top: 0px;
      left: 20px;
    }
  }
  .qrcode {
    background: white;
    padding: 5px;
    border: 1px solid #eee;
    position: absolute;
    left: -152px;
    padding-right: 5px;
    opacity: 0;
    top: -125px;
    transform: translateX(5%);
    img {
      width: 140px;
      height: 140px;
    }
    p {
      margin-top: 10px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
  .blue {
    color: #1678f9;
    font-size: 11px;
    position: absolute;
    right: 20px;
    top: 3px;
  }
  &.el-dropdown-menu__item--divided {
    padding-top: 15px;
    margin: 0;
  }
  &::before {
    content: "";
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: -4px;
    margin: 0 8px 0 -2px;
  }
  &.user-info {
    display: flex;
    align-items: center;
    padding-top: 10px;
    &::before {
      display: none;
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 100%;
      object-fit: cover;
    }
    .right {
      text-align: left;
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .user-name {
        color: #3f3f3f;
        font-size: 14px;
        .certify {
          font-size: 11px;
          margin-left: 4px;
          border: 1px solid #ff7b1b;
          color: #ff7b1b;
          border-radius: 2px;
          height: 18px;
          line-height: 18px;
          display: inline-block;
          padding: 0 6px;
          vertical-align: middle;
        }
      }
      .company-name {
        color: #b3b3b3;
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      }
    }
  }
  &.user-version {
    &::before {
      margin: 0 4px 0 -2px;
      background: url("~@/assets/images/myCenter/icon_version.png") no-repeat;
      background-size: 20px;
    }
  }
  &.user-user {
    &::before {
      background: url("~@/assets/images/myCenter/icon_user.png") no-repeat;
      background-size: 20px;
    }
  }
  &.user-password {
    &::before {
      background: url("~@/assets/images/myCenter/icon_password.png") no-repeat;
      background-size: 20px;
    }
  }
  &.user-contact {
    &::before {
      background: url("~@/assets/images/myCenter/icon_contact.png") no-repeat;
      background-size: 20px;
    }
  }
  &.user-wechat {
    &::before {
      margin: 0 4px 0 -2px;
      background: url("~@/assets/images/myCenter/icon_wechat.png") no-repeat;
      background-size: 20px;
    }
    &:hover {
      .qrcode {
        transform: translateX(0);
        transition: all linear 0.3s;
        opacity: 1;
      }
    }
  }
  &.user-web {
    &::before {
      background: url("~@/assets/images/myCenter/icon_web.png") no-repeat;
      background-size: 20px;
    }
  }
  &.user-quit {
    &::before {
      background: url("~@/assets/images/myCenter/icon_quit.png") no-repeat;
      background-size: 20px;
    }
  }
}
.sub-menu {
  ::v-deep .el-icon-arrow-down:before {
    content: "\e790";
    color: #fff;
  }
}
.resume-menu {
  position: absolute;
  right: -20px;
  top: 0px;
  border-radius: 2px;
  transition: all 0.2s linear;
  ::v-deep .el-submenu__title {
    border-bottom: none !important;
    &::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url("~@/assets/images/myCenter/icon_add.png") no-repeat;
      background-size: 20px;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      right: 19px;
    }
  }
  ::v-deep .el-submenu__icon-arrow {
    display: none;
  }
  &:hover {
    opacity: 0.75;
  }
}
.el-menu--horizontal .el-menu .el-menu-item {
  color: #909399 !important;
}
.resume-menu ::v-deep .el-submenu__title {
  height: 44px !important;
  line-height: 44px !important;
  background-color: #fff;
  border-bottom: none;
}
.header-common {
  .el-submenu.is-active ::v-deep .el-submenu__title {
    color: #fff !important;
  }
  .el-submenu {
    height: 44px;
    line-height: 44px;
  }
  .header-menu {
    width: 156px;
    padding: 10px 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;

    .el-dropdown-menu__item {
      text-align: left;
      color: #64707f;
      font-size: 14px;
      padding: 0;
    }
    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
      background: transparent;
      color: #1678f9;
    }
    .el-dropdown-menu__item--divided {
      border-color: #e7e7e7;
    }
  }
  .user-mess {
    display: inline-block;
    margin-left: 8px;
    text-align: right;
    height: 42px;
    .span-skeleton {
      width: 40px;
      height: 13px;
      margin-top: 2px;
      display: inline-block;
      border-radius: 2px;
      background-color: #efeded;
    }
    span {
      display: block;
      &.user-name {
        color: #fff;
        font-size: 14px;
        line-height: 20px;
        margin: -3px 0 3px 0;
      }
      &.certify {
        color: #fff;
        font-size: 14px;
        border: 1px solid #fff;
        cursor: pointer;
        border-radius: 2px;
        padding: 0 3px;
        min-width: 40px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        font-size: 12px;
        display: inline-block;
      }
    }
  }
  .notice {
    display: inline-block;
    margin: 0 24px 0 16px;
    width: 20px;
    height: 20px;
    color: #fff;
    position: relative;
    cursor: pointer;
    &::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url("~@/assets/images/myCenter/icon_notice.png") no-repeat;
      background-size: 20px;
      position: absolute;
      top: 50%;
      margin-top: -10px;
    }
    .num {
      padding: 0 5px;
      line-height: 16px;
      border-radius: 8px;
      background: #ea2b3f;
      color: white;
      font-size: 11px;
      text-align: center;
      position: absolute;
      left: 11px;
      top: -7px;
      max-width: 27px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

