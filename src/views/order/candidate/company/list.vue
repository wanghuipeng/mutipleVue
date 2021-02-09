<template>
  <div class="candidateList">
    <!-- 操作 -->
    <div class="search">
      <el-input v-model="search" size="mini" placeholder="搜索候选人名称" @keyup.enter.native="getList">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getList"></i>
      </el-input>
      <el-dropdown class="dropdown">
        <span class="el-dropdown-link">
          <i class="el-icon-plus"></i>
          添加简历
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="talentPoolVisible = true">从人才库添加</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button class="btn" size="mini" plain>分享职位</el-button> -->
    </div>

    <!-- 流程 -->
    <ul class="step">
      <li
        v-for="(item, index) in stage"
        :key="index"
        :class="{active: item.value === selectStage.value}"
        @click="handleStage(item)"
      >
        <span class="before"></span>
        <span class="after"></span>
        {{ item.label }}({{ item.count }})
      </li>
    </ul>

    <!-- 批量操作 -->
    <div v-if="multipleSelection.length > 0" class="batch">
      <p v-if="selectStage.value !== 10">已选择{{ multipleSelection.length }}条简历</p>
      <!-- 简历收集 -->
      <p v-if="selectStage.value === 11">
        <el-button size="mini" @click="batchHandle(52, 'otherVisible', '筛选通过')">筛选通过</el-button>
        <el-button size="mini" @click="batchHandle(14, 'interviewVisible', '安排面试')">安排面试</el-button>
        <el-button size="mini" @click="batchHandle(53, 'weedOutVisible', '候选人淘汰')">淘汰</el-button>
      </p>
      <!-- 筛选通过 -->
      <p v-if="selectStage.value === 14">
        <el-button size="mini" @click="batchHandle(14, 'interviewVisible', '安排面试')">安排面试</el-button>
        <el-button size="mini" @click="batchHandle(66, 'offerVisible', '发Offer')">发Offer</el-button>
        <el-button size="mini" @click="batchHandle(53, 'weedOutVisible', '候选人淘汰')">淘汰</el-button>
      </p>
      <!-- 面试 -->
      <p v-if="selectStage.value === 20">
        <el-button size="mini" @click="batchHandle(64, 'interviewVisible', '下一轮面试')">下一轮面试</el-button>
        <el-button size="mini" @click="batchHandle(66, 'offerVisible', '发Offer')">发Offer</el-button>
        <el-button size="mini" @click="batchHandle(59, 'hireVisible')">录用</el-button>
        <el-button size="mini" @click="batchHandle(71, 'weedOutVisible', '候选人淘汰')">淘汰</el-button>
      </p>
      <!-- offer -->
      <p v-if="selectStage.value === 30">
        <el-button size="mini" @click="batchHandle(59, 'hireVisible')">录用</el-button>
        <el-button size="mini" @click="batchHandle(72, 'weedOutVisible', '候选人淘汰')">淘汰</el-button>
      </p>
      <!-- 录用 -->
      <p v-if="selectStage.value === 40">
        <!-- <el-button size="mini" @click="batchHandle(61, 'otherVisible', '过保')">过保</el-button> -->
        <el-button size="mini" @click="batchHandle(60, 'weedOutVisible', '候选人淘汰')">淘汰</el-button>
      </p>

      <!-- 淘汰 -->
      <p v-if="selectStage.value === 50">
        <el-button size="mini" @click="batchHandle(70, 'otherVisible', '激活到初筛', 21)">激活到初筛</el-button>
        <el-button size="mini" @click="batchHandle(70, 'otherVisible', '激活到筛选通过', 22)">激活到筛选通过</el-button>
        <el-button size="mini" @click="batchHandle(74, 'interviewVisible', '安排面试')">激活到面试</el-button>
        <el-button size="mini" @click="batchHandle(73, 'offerVisible', '发Offer')">激活到Offer</el-button>
        <el-button size="mini" @click="batchHandle(75, 'hireVisible')">激活到录用</el-button>
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
      <el-table-column type="selection" width="45" align="center" :selectable="selectInit" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- 简历收集 -->
          <p v-if="scope.row.statusNo === 21">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="handleBtn(52, scope.row, 'otherVisible', '筛选通过')"
                >筛选通过</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(14, scope.row, 'interviewVisible', '安排面试')"
                >安排面试</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(53, scope.row, 'weedOutVisible', '候选人淘汰')"
                >淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 筛选通过 -->
          <p v-else-if="scope.row.statusNo === 22">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="handleBtn(14, scope.row, 'interviewVisible', '安排面试')"
                >安排面试</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(66, scope.row, 'offerVisible', '发Offer')"
                >发Offer</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(53, scope.row, 'weedOutVisible', '候选人淘汰')"
                >淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 面试（待面试） -->
          <p v-else-if="scope.row.statusNo === 32">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="!scope.row.isOver"
                  @click.native="handleBtn(64, scope.row, 'interviewVisible', '下一轮面试')"
                >下一轮面试</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(66, scope.row, 'offerVisible', '发Offer')"
                >发Offer</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(59, scope.row, 'hireVisible')">录用</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(71, scope.row, 'weedOutVisible', '候选人淘汰')"
                >淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 面试（面试通过） -->
          <p v-else-if="scope.row.statusNo === 36">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="!scope.row.isOver"
                  @click.native="handleBtn(64, scope.row, 'interviewVisible', '下一轮面试')"
                >下一轮面试</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(66, scope.row, 'offerVisible', '发Offer')"
                >发Offer</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(59, scope.row, 'hireVisible')">录用</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(71, scope.row, 'weedOutVisible', '候选人淘汰')"
                >淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- offer（已发offer） -->
          <p v-else-if="scope.row.statusNo === 42">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(59, scope.row, 'hireVisible')">录用</el-dropdown-item>
                <!-- <el-dropdown-item
                  v-if="!scope.row.guaranteePeriod"
                  @click.native="handleBtn(61, scope.row, 'otherVisible', '过保')"
                >过保</el-dropdown-item> -->
                <el-dropdown-item @click.native="handleBtn(72, scope.row, 'weedOutVisible', '候选人淘汰')">淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <!-- 录用 -->
          <p v-else-if="scope.row.statusNo === 51 && !scope.row.guaranteePeriod">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link">
                处理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleBtn(61, scope.row, 'otherVisible', '过保')">过保</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(60, scope.row, 'weedOutVisible', '候选人淘汰')"
                >淘汰</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>

          <!-- 淘汰 -->
          <p v-else-if="scope.row.processNode === 10">
            <el-dropdown placement="bottom" @command="handleCommand(scope.row)">
              <span class="el-dropdown-link link-initial">
                重新激活
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="handleBtn(70, scope.row, 'otherVisible', '激活到初筛', 21)"
                >激活到初筛</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(70, scope.row, 'otherVisible', '激活到筛选通过', 22)"
                >激活到筛选通过</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(74, scope.row, 'interviewVisible', '安排面试')"
                >激活到面试</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleBtn(73, scope.row, 'offerVisible', '发Offer')"
                >激活到Offer</el-dropdown-item>
                <el-dropdown-item @click.native="handleBtn(75, scope.row, 'hireVisible')">激活到录用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobhunterName" label="候选人姓名" align="center">
        <template slot-scope="scope">
          <p
            class="jobhunterName"
            @click="toDetail(scope.row.resumeId,scope.row.id)"
          >{{ scope.row.jobhunterName }}</p>
        </template>
      </el-table-column>
      <el-table-column v-if="formHome" prop="positionName" label="投递职位" width="240" show-overflow-tooltip align="center" />
      <el-table-column v-if="formHome" prop="positionSupplierType" label="部门/企业" width="240" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.positionSupplierType === 1">{{ scope.row.positionDepartmentName }}</span>
          <span v-if="scope.row.positionSupplierType === 2">{{ scope.row.companyName }}</span>
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
      <el-table-column prop="candidateSource" label="来源渠道" align="center">
        <template slot-scope="scope">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="scope.row.candidateSource && scope.row.candidateSource.channelName"
          >
            <el-tag type="info" size="mini">{{ scope.row.candidateSource && scope.row.candidateSource.categoryName }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="processNode" label="流程阶段" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.processNode ===1" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===2" type="warning" size="mini">面试 ({{ scope.row.isOver ? '终面' : '第'+ scope.row.round + '轮' }})</el-tag>
          <el-tag v-else-if="scope.row.processNode ===3" type="success" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===4" type="success" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
          <el-tag v-else-if="scope.row.processNode ===10" type="danger" size="mini">{{ scope.row.processNode | filterArr(dictData.dicts.candidateProcessNode) }}</el-tag>
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

    <!-- 从人才库导入 -->
    <add-from-talent-pool
      v-if="talentPoolVisible"
      :dialog.sync="talentPoolVisible"
      :position-id="positionInfo.id"
      @updateList="updateList"
    />

    <!-- 面试操作 -->
    <operations
      v-if="interviewVisible"
      :dialog.sync="interviewVisible"
      :title="operationTitle"
      :type="1"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      :position-info="positionInfo"
      @updateList="updateList"
    />

    <!-- offer操作 -->
    <operations
      v-if="offerVisible"
      :dialog.sync="offerVisible"
      :title="operationTitle"
      :type="2"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      @updateList="updateList"
    />

    <!-- 录用操作 -->
    <operations
      v-if="hireVisible"
      :dialog.sync="hireVisible"
      title="录用"
      :type="3"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
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
      :width="500"
      @updateList="updateList"
    />

    <!-- 其他操作 -->
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
      <resume-detail-supplier
        v-if="orderVisible"
        slot="inner-body"
        :company-account-type="userInfo.companyAccountType"
        :candidate-id="candidateId"
      />
    </drawer-common>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import addFromTalentPool from '../addTalent/addFromTalentPool'
import operations from '../operations'
import drawerCommon from '@/components/common/drawerCommon'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'
import { orderList } from '@/api/order'
import { countPositionCandidateStage } from '@/api/home'
export default {
  components: {
    Pagination,
    addFromTalentPool,
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
        { label: '所有简历', value: 10, count: 0 },
        { label: '简历筛选', value: 11, count: 0 },
        { label: '筛选通过', value: 14, count: 0 },
        { label: '面试', value: 20, count: 0 },
        { label: 'offer', value: 30, count: 0 },
        { label: '录用', value: 40, count: 0 },
        { label: '淘汰', value: 50, count: 0 }
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
      talentPoolVisible: false,
      interviewVisible: false,
      offerVisible: false,
      hireVisible: false,
      weedOutVisible: false,
      otherVisible: false,
      orderVisible: false,
      candidateId: null, // 订单Id
      formHome: false,
      dataType: null
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
    }
  },
  destroyed() {
    sessionStorage.removeItem('candidateCreateTime')
  },
  mounted() {
    // 兼容首页跳转列表
    const state = this.$route.query.state
    this.positionId = this.$route.query.positionId || ''
    this.dataType = this.$route.query.dataType || ''
    if (state) {
      this.selectStage = this.stage[state]
      this.formHome = true
    } else if (this.tab) {
      this.selectStage = this.stage[this.tab]
      this.formHome = false
    } else {
      this.selectStage = this.stage[0]
      this.formHome = false
    }
    this.getCount()
    this.getList()
  },
  methods: {
    // 所有简历隐藏多选框
    checkbox() {
      if (this.selectStage.value === 10) {
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
        dataType: this.dataType,
        positionId: this.formHome ? this.positionId : this.positionInfo.id
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
    // 获取列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit,
        positionId: this.formHome ? this.positionId : this.positionInfo.id,
        stage: this.selectStage.value,
        searchName: this.search
      }
      this.listLoading = true
      orderList(params).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    // 是否可选
    selectInit(row) {
      // 1、如订单来自企业，则录用情况下的订单不可复选 2、如订单状态=已过保，则录用情况下的订单不可复选
      if (row.processNode === 4 && row.statusNo === 61) {
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
      console.log(33333, candidater)
      if (operateCode === 14 || operateCode === 64 || operateCode === 74) {
        candidater && sessionStorage.setItem('candidateCreateTime', JSON.stringify(candidater.recommendTimeFormat))
      }
      this.operateCode = operateCode
      this.activateCode = activateCode
      this.operateType = 1
      this[dialogType] = true
      this.operationTitle = title
    },
    // 单选
    handleCommand(val) {
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 更新列表
    updateList() {
      this.$refs.multipleTable.clearSelection()
      this.getCount()
      this.getList()
    },
    // 订单详情
    toDetail(id, candidateId) {
      this.orderVisible = true
      this.candidateId = candidateId
      sessionStorage.setItem('resumeId', id)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.orderVisible = false
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
</style>

<style lang="scss" scoped>
@import '@/assets/sass/order/candidateList';
.link-initial{
  color: initial !important;
}
</style>
