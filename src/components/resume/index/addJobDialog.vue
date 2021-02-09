<template>
  <div class="add-job-modal">
    <header slot="title">
      <p class="sub-title">
        加入职位
        <span class="desc">您可以从人才库中筛选储备的优质人才，将人才加入到目前对应职位的招聘流程中</span>
      </p>
      <el-form ref="form" :model="addJobForm" label-width="78px">
        <el-form-item label="加入阶段">
          <el-radio-group v-model="addJobForm.defaultStatus">
            <el-radio label="21">简历收集</el-radio>
            <el-radio label="22">筛选通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </header>
    <section>
      <el-input v-model="searchJobValue" size="mini" placeholder="搜索职位">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getCPositionByUserId"></i>>
      </el-input>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        class="table"
        border
        :data="jobTableData"
        highlight-current-row
        style="width: 100%; max-height: 360px; overflow: hidden;"
      >
        <el-table-column align="center" prop="title" label="职位名称">
          <template slot-scope="scope">{{ scope.row.title || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="recruitNature" label="招聘性质">
          <template slot-scope="scope">
            <span
              v-if="scope.row.recruitNature"
            >{{ scope.row.recruitNature | filterCommonDict(dictData.dicts.recruitProperties) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="positionDepartmentName" label="部门">
          <template slot-scope="scope">{{ scope.row.positionDepartmentName || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="statusNo" label="职位状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.statusNo === 3" size="small" type="success">进行中</el-tag>
            <el-tag v-if="scope.row.statusNo === 4" size="small" type="info">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inviteTime" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="text" @click="joinIt(scope.row)">加入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="clear"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 20, 30, 50]"
        :current-page="currentPage"
        :page-size="10"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSure">确 定</el-button>
    </span>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { recommendResume } from '@/api/resume'
import { getCPositionByUserId } from '@/api/position'

export default {
  props: {
    resumeId: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      currentPage: 1,
      pageNumber: 1,
      pageSize: 10,
      searchName: null,
      total: 0,
      jobTableData: [],
      addJobForm: {
        defaultStatus: null
      },
      searchJobValue: null,
      loading: false
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    this.getCPositionByUserId()
  },
  methods: {
    handleCancel() {},
    handleSure() {},
    // 加入职位
    joinIt(row) {
      this.recommendResume(row)
    },
    recommendResume(row) {
      const { defaultStatus } = this.addJobForm
      const { positionId } = row
      const params = {
        defaultStatus,
        positionId,
        resumeId: this.$props.resumeId
      }
      console.log(row, params)
      recommendResume(params).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.success('加入成功')
        } else {
          this.$message.fail(message)
        }
      })
    },
    getCPositionByUserId() {
      this.loading = true
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchName: this.searchJobValue
      }
      getCPositionByUserId(params).then(res => {
        this.loading = false
        const { code, data } = res
        if (code === '000000') {
          this.jobTableData = data.records
          console.log(this.jobTableData)
          this.total = data.total
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCPositionByUserId()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getCPositionByUserId()
    }
  }
}
</script>
<style  lang="scss">
.add-job-modal {
  margin-top: -20px;
  header {
    margin-top: -40px;
  }
  .sub-title {
    font-size: 14px;
    font-weight: bold;
  }
  .desc {
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
  }
  .el-form {
    border-bottom: 1px solid #dfe2e6;
    margin-top: 10px;
    margin-bottom: 20px;
    .el-form-item__content,
    .el-form-item__label {
      height: 15px;
      line-height: 15px;
    }
    .el-form-item {
      margin-bottom: 5px;
      padding: 8px 0;
    }
  }
  .el-input {
    width: 200px;
    margin-bottom: 15px;
  }
  .el-pagination {
    margin: 20px auto 0 auto;
    text-align: center;
  }

  .el-radio-group,
  .el-radio {
    height: 15px;
    line-height: 15px;
    font-size: 12px;
  }
  .el-radio__input {
    vertical-align: -2px;
  }
  .dialog-footer {
    width: 100%;
    display: inline-block;
    text-align: right;
  }

  .table {
    .cell {
      font-size: 12px;
    }
  }
}
</style>
