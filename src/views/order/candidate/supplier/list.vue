<template>
  <div class="candidateList">
    <!-- tabs -->
    <div v-if="positionInfo" class="candidate-tabs">
      <el-button size="small" :type="listType === 1 && 'primary'" @click="filterCandidate(1)">我的候选人 <span>({{ positionInfo.oneRecommendCount || 0 }})</span></el-button>
      <el-button size="small" :type="listType === 2 && 'primary'" @click="filterCandidate(2)">团队候选人 <span>({{ positionInfo.deptRecommendCount || 0 }})</span></el-button>
      <el-button size="small" :type="listType === 3 && 'primary'" @click="filterCandidate(3)">全部候选人 <span>({{ positionInfo.recommendCount || 0 }})</span></el-button>
    </div>
    <!-- 操作 -->
    <div class="search">
      <el-input v-model="search" size="mini" placeholder="搜索候选人名称" @keyup.enter.native="getList">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getList"></i>
      </el-input>
      <el-select
        v-if="listType === 2"
        v-model="positionDepartment"
        clearable
        size="mini"
        class="w-315 ml-10"
        placeholder="所有我负责的团队"
        @change="handleDepartment"
      >
        <el-option
          v-for="item in departmentList"
          :key="item.description"
          :label="item.text"
          :value="item.description"
        ></el-option>
      </el-select>
      <template v-if="$route.query.queryType !== 3">
        <el-dropdown class="dropdown">
          <span class="el-dropdown-link">
            <i class="el-icon-plus"></i>
            新增推荐
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <!-- 企业版 -->
          <!-- <el-dropdown-menu v-if="userInfo.companyAccountType === 1" slot="dropdown">
            <el-dropdown-item @click.native="excelVisible = true">批量导入</el-dropdown-item>
            <el-dropdown-item @click.native="talentPoolVisible = true">从人才库添加</el-dropdown-item>
          </el-dropdown-menu> -->
          <!-- 供应商版 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 猎头 -->
            <el-dropdown-item v-if="positionInfo.positionType === 1" @click.native="nowRecommend">立即推荐</el-dropdown-item>
            <!-- RPO -->
            <template v-else-if="positionInfo.positionType === 2">
              <el-dropdown-item @click.native="excelVisible = true">批量导入</el-dropdown-item>
              <el-dropdown-item @click.native="talentPoolVisible = true">从人才库添加</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="btn" size="mini" plain @click="qrcodeVisible = true">名单采集</el-button>
      </template>
    </div>

    <!-- 流程 -->
    <ul class="step">
      <li v-for="(item, index) in stage" :key="index" :class="{active: item.value === selectStage.value}" @click="handleStage(item)">
        <span class="before"></span>
        <span class="after"></span>
        {{ item.label }}({{ item.count }})
      </li>
    </ul>

    <!-- 批量操作 -->
    <div v-if="positionInfo.positionType === 2 && multipleSelection.length > 0" class="batch">
      <p
        v-if="selectStage.value === 12 || selectStage.value === 13 || selectStage.value === 20 || selectStage.value === 51"
      >已选择{{ multipleSelection.length }}条简历</p>
      <!-- 简历收集 -->
      <p v-if="selectStage.value === 12">
        <el-button size="mini" @click="batchHandle(50, 'otherVisible', '筛选通过')">筛选通过</el-button>
        <el-button size="mini" @click="batchHandle(51, 'weedOutVisible', '淘汰')">淘汰</el-button>
      </p>
      <!-- 简历推荐 -->
      <p v-if="selectStage.value === 13">
        <el-button size="mini" @click="batchHandle(68, 'otherVisible', '推荐')">推荐</el-button>
        <el-button size="mini" @click="batchHandle(51, 'weedOutVisible', '淘汰')">淘汰</el-button>
      </p>
      <!-- 客户面试 -->
      <p v-if="selectStage.value === 20">
        <el-button size="mini" @click="batchHandle(63, 'otherVisible', '已约面')">已约面</el-button>
        <el-button size="mini" @click="batchHandle(57, 'weedOutVisible', '取消面试')">取消面试</el-button>
      </p>
      <!-- 淘汰 -->
      <p v-if="selectStage.value === 51">
        <el-button size="mini" @click="batchHandle(70, 'otherVisible', '激活到初筛', 11)">激活到初筛</el-button>
        <el-button size="mini" @click="batchHandle(70, 'otherVisible', '激活到筛选通过', 16)">激活到筛选通过</el-button>
      </p>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      class="table"
      style="width: 100%"
      :cell-class-name="checkbox"
      :header-cell-class-name="checkbox"
      @selection-change="handleSelectionChange"
    >
      <el-table-column class="box" type="selection" :width="positionInfo.positionType === 1 ? 10 : 45" align="center" :selectable="selectInit" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- 简历收集（猎头职位） -->
          <p v-if="scope.row.statusNo === 11 && positionInfo.positionType === 1">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(50, scope.row, 'otherVisible', '筛选通过')">筛选通过</el-dropdown-item>
                <el-dropdown-item @click="handleBtn(68, scope.row, 'otherVisible', '推荐')">推荐</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(51, scope.row, 'weedOutVisible', '淘汰')">淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 简历收集（RPO职位） -->
          <p v-else-if="scope.row.statusNo === 11 && positionInfo.positionType === 2">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(50, scope.row, 'otherVisible', '筛选通过')">筛选通过</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(68, scope.row, 'otherVisible', '推荐')">推荐</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(51, scope.row, 'weedOutVisible', '淘汰')">淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 筛选通过（猎头职位） -->
          <p v-else-if="scope.row.statusNo === 16 && positionInfo.positionType === 1">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(68, scope.row, 'otherVisible', '推荐')">推荐</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(51, scope.row, 'weedOutVisible', '淘汰')">淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 筛选通过（RPO职位） -->
          <p v-else-if="scope.row.statusNo === 16 && positionInfo.positionType === 2">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(68, scope.row, 'otherVisible', '推荐')">推荐</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(51, scope.row, 'weedOutVisible', '淘汰')">淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 面试 -->
          <p v-else-if="scope.row.statusNo === 31">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(63, scope.row, 'otherVisible', '已约面')">已约面</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(57, scope.row, 'weedOutVisible', '取消面试')">取消面试</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="handleBtn(51, scope.row, 'otherVisible', '淘汰')">淘汰</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 淘汰 -->
          <p v-else-if="scope.row.processNode === 10">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link link-initial">
                重新激活<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(70, scope.row, 'otherVisible', '激活到初筛', 11)">激活到初筛</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(70, scope.row, 'otherVisible', '激活到筛选通过', 16)">激活到筛选通过</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterName" label="姓名" align="center">
        <template slot-scope="scope">
          <p class="jobhunterName" @click="toDetail(scope.row.resumeId)">{{ scope.row.jobhunterName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterLiveCity" label="所在城市" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.jobhunterLiveCity">{{ scope.row.jobhunterLiveCity | filterLevel2(dictData.areas) }}</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterWorkYear" label="工作经验" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.jobhunterWorkYear ? scope.row.jobhunterWorkYear : '-' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterAge" label="年龄" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.jobhunterAge ? scope.row.jobhunterAge : '-' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterDegree" label="学历" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.jobhunterDegree">{{ scope.row.jobhunterDegree | filterArr(dictData.dicts.advancedDegree) }}</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="流程阶段" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.processNode ===1" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===2" type="warning" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===3" type="success" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===4" type="success" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===10" type="danger" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="佣金" align="center">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.candidateType === 1"
            placement="top"
            width="300"
            trigger="hover"
          >
            <ul class="commission">
              <li>
                <p>预计佣金金额</p>
                <p v-if="scope.row.commissionAmount">{{ scope.row.commissionAmount }}元</p>
                <p v-else>无</p>
              </li>
              <li>
                <p>佣金计算方式</p>
                <p v-if="scope.row.commissionSettlementType === 1">
                  按年薪比例；{{ scope.row.commissionRatio }}%
                </p>
                <p v-else>固定佣金</p>
              </li>
              <li>
                <p>保证期</p>
                <p>{{ scope.row.guaranteePeriod ? scope.row.guaranteePeriod + (scope.row.guaranteePeriodType === 2 ? '个月' : '天') : '无' }}</p>
              </li>
              <li>
                <p>佣金补充说明</p>
                <p class="ellipsis">{{ scope.row.commissionSupplementDescription || '无' }}</p>
              </li>
            </ul>
            <el-tag slot="reference" type="info" size="mini" effect="plain">佣金</el-tag>
          </el-popover>
          <el-popover
            v-else-if="scope.row.candidateType === 2"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.commissionSupplementDescription || '暂无说明'"
          >
            <el-tag slot="reference" type="info" size="mini" effect="plain">佣金</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="statusUpdateTime" label="最新活动" align="center" />
      <el-table-column prop="recommendTimeFormat" label="推荐时间" align="center" />
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 名单采集 -->
    <el-dialog
      :visible.sync="qrcodeVisible"
      top="8vh"
      lock-scroll
      width="800px"
      class="qrcodeDialog"
    >
      <div class="qrcodeSetting">
        <div class="qrcode">
          <img :src="qrcodeUrl" />
          <p class="name">{{ positionInfo.title }}</p>
          <p class="link">
            <el-input v-model="linkUrl" :disabled="true" size="mini">
              <!-- <el-button slot="append" @click="linkUrl=''">重置</el-button> -->
            </el-input>
            <el-button class="copy" type="primary" size="mini" @click="copy">复制</el-button>
          </p>
          <p class="tips">您可以将上方二维码/链接发送给候选人，由候选人自行填写简历/报名表，节省您的大量时间</p>
        </div>
        <div class="setting">
          <p class="title">名单采集设置</p>
          <p class="tips">候选人填写数据自动进入指定阶段：</p>
          <el-radio-group v-model="radio" @change="saveResumeConfig">
            <el-radio :label="11">
              简历筛选
              <el-popover
                v-if="false"
                placement="top-start"
                width="200"
                trigger="hover"
                content="如推荐简历还需要进一步联系，可选择将简历添加到此阶段"
              >
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-radio>
            <el-radio :label="16">
              筛选通过
              <el-popover
                v-if="false"
                placement="top-start"
                width="200"
                trigger="hover"
                content="如简历已提前筛选完毕，可选择将简历添加到此阶段"
              >
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-radio>
            <el-radio v-if="positionInfo.positionType === 2" :label="21">
              客户筛选
              <el-popover
                v-if="false"
                placement="top-start"
                width="200"
                trigger="hover"
                content="如推荐简历已确认推荐给客户，可选择将简历添加到此阶段"
              >
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-radio>
          </el-radio-group>
          <p class="tips">候选人报名简历填写设置：</p>
          <el-checkbox-group v-model="checkList" @change="saveResumeConfig">
            <el-checkbox label="detail">基本信息</el-checkbox>
            <el-checkbox label="intention">求职意向</el-checkbox>
            <el-checkbox label="experiences">工作经历</el-checkbox>
            <el-checkbox label="educations">教育经历</el-checkbox>
            <el-checkbox label="projects">项目经历</el-checkbox>
            <el-checkbox label="languages">语言能力</el-checkbox>
            <el-checkbox label="skills">技能证书</el-checkbox>
            <el-checkbox label="personal">自我介绍</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-dialog>

    <!-- 从人才库导入 -->
    <add-from-talent-pool
      v-if="talentPoolVisible"
      :dialog.sync="talentPoolVisible"
      :position-id="positionInfo.id"
      @updateList="updateList"
    />

    <!-- 从Excel导入 -->
    <add-from-excel
      v-if="excelVisible"
      :dialog.sync="excelVisible"
      :position-id="positionInfo.id"
      @updateList="updateList"
    />

    <!-- 淘汰操作 -->
    <operations
      v-if="weedOutVisible"
      :dialog.sync="weedOutVisible"
      :title="operationTitle"
      :type="4"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      @updateList="updateList"
    />

    <!-- 操作 -->
    <operations
      v-if="otherVisible"
      :dialog.sync="otherVisible"
      :title="operationTitle"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      :activate-code="activateCode"
      :width="500"
      @updateList="updateList"
    />

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
      <resume-detail-supplier v-if="orderVisible" slot="inner-body" :company-account-type="userInfo.companyAccountType" />
    </drawer-common>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import addFromTalentPool from '../addTalent/addFromTalentPool'
import addFromExcel from '../addTalent/addFromExcel'
import operations from '../operations'
import drawerCommon from '@/components/common/drawerCommon'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'
import {
  orderList,
  getSupplierPositionResumeConfig,
  savePositionResumeSupplier,
  getUserSelectDeptList
} from '@/api/order'
import { countPositionCandidateStage } from '@/api/home'
export default {
  components: {
    Pagination,
    addFromTalentPool,
    addFromExcel,
    operations,
    drawerCommon,
    ResumeDetailSupplier
  },
  props: {
    positionInfo: {
      type: Object,
      default: () => {}
    },
    tab: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      operateType: 1, // 1单项操作，2批量操作
      search: '',
      selectStage: {},
      stage: [
        { label: '所有简历', value: 0, count: 0 },
        { label: '简历筛选', value: 12, count: 0 },
        { label: '筛选通过', value: 13, count: 0 },
        { label: '客户筛选', value: 15, count: 0 },
        { label: '客户面试', value: 20, count: 0 },
        { label: 'offer', value: 30, count: 0 },
        { label: '入职', value: 41, count: 0 },
        { label: '过保', value: 42, count: 0 },
        { label: '淘汰', value: 51, count: 0 }
      ],
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      operationTitle: '',
      excelVisible: false,
      talentPoolVisible: false,
      weedOutVisible: false,
      otherVisible: false,
      orderVisible: false,
      qrcodeVisible: false,
      linkUrl: '',
      radio: '',
      checkList: [],
      supplierPositionId: '',
      qrcodeUrl: '',
      positionDepartment: null,
      departmentList: [],
      listType: 3
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  watch: {
    positionInfo(val) {
      this.positionInfo = val
      console.log(val)
    }
  },
  mounted() {
    if (this.tab) {
      this.selectStage = this.stage[this.tab]
    } else {
      this.selectStage = this.stage[0]
    }
    this.getCount()
    this.getList()
    this.getResumeConfig()
  },
  methods: {
    handleDepartment(e) {
      console.log(e)
      this.positionDepartment = e
      this.getList()
    },
    filterCandidate(flag) {
      const { baseRoleType } = this.$store.state.common.userProfile
      console.log('角色', baseRoleType)
      if (baseRoleType - 0 === 4) { // 超级管理员
        this.positionDepartment = ''
        this.listType = flag
        if (flag === 2) {
          this.getUserSelectDeptList()
        }
        this.getList()
      } else if (baseRoleType - 0 === 3 || baseRoleType - 0 === 2 || baseRoleType - 0 === 1) { // 管理员，招聘者，普通成员
        if (flag === 3) { // 全部候选人
          this.$message.warning('暂无权限查看')
        } else { // 我的候选人，部门候选人
          this.positionDepartment = ''
          this.listType = flag
          if (flag === 2) {
            this.getUserSelectDeptList()
          }
          this.getList()
        }
      }
    },
    // 立即推荐
    nowRecommend() {
      this.$router.push(`/recommendResume?positionId=${this.positionInfo.id}`)
    },
    // 猎头职位隐藏多选框
    checkbox() {
      if (
        this.positionInfo.positionType === 1 ||
        this.selectStage.value === 0 ||
        this.selectStage.value === 15 ||
        this.selectStage.value === 30 ||
        this.selectStage.value === 41 ||
        this.selectStage.value === 42
      ) {
        return 'hideCheckbox'
      }
    },
    // 选择步骤
    handleStage(item) {
      this.$refs.multipleTable.clearSelection()
      this.selectStage = item
      this.getList()
    },
    // 获取阶段数量
    getCount() {
      const params = {
        dataType: 2,
        positionId: this.positionInfo.id
      }
      countPositionCandidateStage(params).then(res => {
        this.stage.forEach(item => {
          for (var key in res.data) {
            if (key * 1 === item.value) {
              item.count = res.data[key]
            }
          }
        })
        console.log(this.stage)
      })
    },
    // 获取所有我负责的团队
    getUserSelectDeptList() {
      const params = null
      getUserSelectDeptList(params).then(res => {
        this.departmentList = res.data
      })
    },
    // 获取列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit,
        positionId: this.positionInfo.id,
        stage: this.selectStage.value,
        searchName: this.search,
        positionDepartment: this.positionDepartment - 0,
        listType: this.listType !== 3 ? this.listType : null
      }
      this.listLoading = true
      orderList(params).then(res => {
        const { data } = res
        this.listLoading = false
        this.list = data && data.records
        this.total = data && data.total
      })
    },
    // 是否可选
    selectInit(row) { // 仅当前面试状态=待约面，列表项可选中，否则复选框不可选中
      if (row.processNode === 2 && row.statusNo !== 31) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    // 批量操作
    batchHandle(operateCode, dialogType, title, activateCode) {
      this.operateType = 2
      this.operateCode = operateCode
      this.activateCode = activateCode
      this[dialogType] = true
      this.operationTitle = title
    },
    // 单个操作
    handleBtn(operateCode, candidater, dialogType, title, activateCode) {
      if (operateCode === 14 || operateCode === 64 || operateCode === 74) {
        candidater && sessionStorage.setItem('candidateCreateTime', JSON.stringify(candidater.recommendTimeFormat))
      }
      this.operateCode = operateCode
      this.activateCode = activateCode
      this[dialogType] = true
      this.operateType = 1
      this.operationTitle = title
    },
    // 单选
    handleCommand(val) {
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 更新列表
    updateList() {
      this.$refs.multipleTable.clearSelection()
      this.getCount()
      this.getList()
    },
    // 订单详情
    toDetail(id) {
      this.orderVisible = true
      sessionStorage.setItem('resumeId', id)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.orderVisible = false
    },
    // 获取名单采集设置
    getResumeConfig() {
      const params = {
        positionId: this.positionInfo.id
      }
      getSupplierPositionResumeConfig(params).then(res => {
        console.log(res)
        if (res.code === '000000') {
          this.supplierPositionId = res.data.supplierPositionId
          this.radio = res.data.candidateDefaultStatus
          this.checkList = res.data.resumeGroupCodes
          this.linkUrl = res.data.url
          const token = Vue.ls.get('x-client-token')
          this.qrcodeUrl = window.location.protocol + '//' + window.location.host + '/api/common/generateUrlQrCode?url=' + encodeURIComponent(res.data.url) + '&x-client-token=' + token;
        }
      })
    },
    // 保存名单采集设置
    saveResumeConfig() {
      const params = {
        supplierPositionId: this.supplierPositionId,
        candidateDefaultStatus: this.radio,
        resumeGroupCodes: this.checkList
      }
      savePositionResumeSupplier(params).then(res => {
        console.log(res)
      })
    },
    // 复制
    copy() {
      var tag = document.createElement('input');
      tag.setAttribute('id', 'cp_hgz_input');
      tag.value = this.linkUrl;
      document.getElementsByTagName('body')[0].appendChild(tag);
      document.getElementById('cp_hgz_input').select();
      document.execCommand('copy');
      document.getElementById('cp_hgz_input').remove();
    }
  }
}
</script>

<style lang="scss">
.el-dropdown-menu__item {
  font-size: 12px;
  text-align: left;
  line-height: 30px;
  padding: 0 28px 0 12px;
  &:focus,
  &:not(.is-disabled):hover {
    background-color: transparent;
    color: #1678f9;
  }
}
.el-dropdown-link{
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
  @import '@/assets/sass/order/candidateList';
  .link-initial{
  color: initial !important;
}
.candidate-tabs{
  margin-bottom: 15px;
}
</style>
