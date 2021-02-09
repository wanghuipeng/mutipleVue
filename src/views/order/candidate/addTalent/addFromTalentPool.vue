<template>
  <el-dialog
    :visible.sync="dialog"
    top="8vh"
    lock-scroll
    width="80%"
    :before-close="handleClose"
  >
    <div v-show="!showResult" slot="title" class="header">
      <p class="title">
        添加简历（从人才库导入）
        <span class="desc">您可以从人才库中筛选储备的优质人才，将人才加入到目前对应职位的招聘流程中</span>
      </p>
      <p v-if="userInfo.companyAccountType === 1" class="step">
        加入阶段
        <el-radio-group v-model="radio" class="group">
          <el-radio :label="21">简历筛选
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="如简历需要进一步筛选，可选择将简历添加到此阶段"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </el-radio>
          <el-radio :label="22">筛选通过
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="如简历已提前筛选完毕，可选择将简历添加到此阶段"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </el-radio>
        </el-radio-group>
      </p>
      <p v-if="userInfo.companyAccountType === 2" class="step">
        加入阶段
        <el-radio-group v-model="radio" class="group">
          <el-radio :label="11">
            简历筛选
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="如推荐简历还需要进一步联系，可选择将简历添加到此阶段"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </el-radio>
          <el-radio :label="21">
            客户筛选
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="如推荐简历已确认推荐给客户，可选择将简历添加到此阶段"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </el-radio>
        </el-radio-group>
      </p>
    </div>

    <div v-show="!showResult">
      <!-- 筛选 -->
      <div class="search">
        <el-input v-model="search" size="mini" placeholder="搜索候选人">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getList"></i>
        </el-input>
        <el-button type="text" size="mini" @click="drawer = true">新增简历</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        highlight-current-row
        border
        class="table"
        style="width: 100%; max-height: 360px; overflow: auto;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectInit" />
        <el-table-column label="姓名" width="160" align="center">
          <template slot-scope="scope">
            <span class="jobhunterName" @click="toDetail(scope.row.detail.id)">{{ scope.row.detail.name }}</span>
            <el-tag v-if="scope.row.hasRecommend" size="small" class="ml-8">已加入</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.detail.gender | filterArr(dictData.dicts.gender) }}</template>
        </el-table-column>
        <el-table-column label="求职状态" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.detail.jobStatus | filterArr(dictData.dicts.jobStatus) }}</template>
        </el-table-column>
        <el-table-column label="最近公司" align="center">
          <template slot-scope="scope">{{ scope.row.detail.currentCompanyName }}</template>
        </el-table-column>
        <el-table-column label="所在城市" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.detail.liveCity | filterLevel2(dictData.areas) }}</template>
        </el-table-column>
        <el-table-column label="学校" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.detail.graduateSchool }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.detail.updateTime }}</template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        class="pagination"
        @pagination="getList"
      />

      <div slot="footer" class="footer">
        <div v-if="multipleSelection.length > 0" class="names">
          已选择候选人：
          <p v-if="multipleSelection.length > 1">{{ selectNames }}共{{ multipleSelection.length }}人</p>
          <p v-else>{{ selectNames }}</p>
        </div>
        <div class="btns">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="mini" :loading="addLoading" @click="batchCreatedOrder">确 定</el-button>
        </div>
      </div>
    </div>

    <!-- 推荐结果 -->
    <add-result
      :dialog.sync="showResult"
      :list="addList"
      @continues="continues"
      @close="handleClose"
    />
    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer v-if="drawer" slot="inner-body" ref="uploadDrawer" @fatherMethod="close" />
    </drawer-common>

    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="resumeVisible"
      :direction="direction"
      :router="'resumeDetail'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="closeResume"
    >
      <resume-detail-supplier v-if="resumeVisible" slot="inner-body" :resume-id="resumeId" :query-type="queryType" />
    </drawer-common>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import DrawerCommon from '@/components/common/drawerCommon'
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer'
import addResult from './addResult'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'
import {
  getResumePoolListByPositionId,
  batchGenerateCandidate
} from '@/api/order'
export default {
  components: {
    Pagination,
    DrawerCommon,
    UploadDrawer,
    addResult,
    ResumeDetailSupplier
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    positionId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      queryType: null,
      direction: 'btt',
      resumeVisible: false,
      resumeId: null,
      candidateId: null, // 订单Id
      search: '',
      drawer: false,
      radio: 21,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      addLoading: false,
      multipleSelection: [],
      selectNames: '',
      resumeIds: [],
      showResult: false,
      addList: {}
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    this.radio = this.userInfo.companyAccountType === 1 ? 21 : 11
    this.getList()
  },
  methods: {
    closeResume() {
      document.body.style['overflow'] = 'auto'
      this.resumeVisible = false
    },
    // 简历详情
    toDetail(id) {
      this.resumeVisible = true
      this.resumeId = id
      sessionStorage.setItem('resumeId', id)
    },
    // 获取列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit,
        positionId: this.positionId,
        searchName: this.search
      }
      this.multipleSelection = []
      this.selectNames = ''
      this.resumeIds = []
      this.listLoading = true
      getResumePoolListByPositionId(params).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    // 是否可选
    selectInit(row) {
      if (row.hasRecommend === true) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const arr = []
      this.resumeIds = []
      val.forEach(item => {
        arr.push(item.detail.name)
        this.resumeIds.push(item.detail.id)
      })
      this.selectNames = arr.join('、')
    },
    // 批量生成订单
    batchCreatedOrder() {
      if (this.resumeIds.length <= 0) {
        this.$message.error({
          message: '请选择候选人',
          duration: 1000
        })
        return
      }
      const params = {
        positionIds: [this.positionId],
        resumeIds: this.resumeIds,
        defaultStatus: this.radio
      }
      this.addLoading = true
      batchGenerateCandidate(params).then(res => {
        this.addLoading = false
        this.showResult = true
        this.addList = res.data
        // this.$message.success({
        //   message: '加入成功',
        //   duration: 1000
        // })
      })
    },
    // 关闭人才库弹窗
    handleClose() {
      this.$emit('update:dialog', false)
      this.$emit('updateList')
    },
    // 关闭简历弹窗
    close() {
      this.drawer = false
      this.$refs.uploadDrawer.destroyedInterval()
      this.getList()
    },
    // 继续
    continues() {
      this.showResult = false
      this.addList = {}
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.el-popover {
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.header {
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .desc {
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
    .el-link {
      font-size: 12px;
    }
  }
  .step {
    display: flex;
    flex-direction: row;
    font-size: 13px;
    margin-top: 16px;
    .group {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 30px;
      ::v-deep .el-radio__label {
        font-size: 12px;
        line-height: 15px;
      }
      .el-icon-question {
        color: #999999;
      }
    }
  }
}
::v-deep .el-dialog__body {
  border-top: 1px solid #e5e5e5;
  padding: 20px;
}
.search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .el-input {
    width: 200px;
    .el-icon-search {
      cursor: pointer;
    }
  }
}
.table {
  .jobhunterName {
    font-weight: bold;
  }
  .jobhunterName:hover {
    color: #1678f9;
    cursor: pointer;
    text-decoration: underline;
  }
  ::v-deep .el-table__header {
    font-size: 12px;
    color: #282C32;
    font-weight: bold;
  }
  ::v-deep .el-table__body {
    font-size: 12px;
    .banner {
      width: 60px;
      height: 60px;
      object-fit: cover;
    }
  }
  ::v-deep .el-table__footer {
    font-size: 12px;
  }
}
.el-table::before {
  width: 0;
}
.pagination {
  padding: 0;
  margin-top: 16px;
}
.footer {
  margin-top: 16px;
  overflow: hidden;
  .names {
    float: left;
    display: flex;
    flex-direction: row;
    width: 80%;
    font-size: 13px;
    p {
      flex: 1;
      text-align: left;
    }
  }
  .btns {
    float: right;
    font-size: 13px;
  }
}
</style>
