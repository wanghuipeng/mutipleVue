<template>
  <div class="supplier-rate">
    <el-card class="main" shadow="never">
      <!-- <p class="title">部门管理</p> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>招聘渠道</el-breadcrumb-item>
        <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商费率管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 新增 -->
      <el-row class="btn" type="flex">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="editRate('add',rateDetail)"
        >添加费率标准</el-button>
      </el-row>

      <!-- 表格 -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        class="table"
      >
        <el-table-column label="费率标准" prop="title" />
        <el-table-column label="费率说明" prop="remark">
          <template slot-scope="scope">{{ scope.row.remark || '-' }}</template>
        </el-table-column>
        <el-table-column label="费率类型" prop="recruitType" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.recruitType">{{ scope.row.recruitType | filterArr(positionType) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editRate('edit',scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getCommissionPage"
      />

      <!-- 新增/修改费率标准 -->
      <el-dialog
        top="8vh"
        append-to-body
        width="500px"
        :lock-scroll="true"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :title="type === 'add' ? '添加费率标准' : '编辑费率标准'"
      >
        <Rate-standard-dialog
          v-if="dialogVisible"
          :rate-detail="rateDetail"
          @closeDialog="closeDialog"
          @reloadDialog="reloadDialog"
        />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination'
import RateStandardDialog from './components/rateStandardDialog'
import { getCommissionPage } from '@/api/set/supplierRate'
import { getDict } from '@/api/common'

export default {
  components: { Pagination, RateStandardDialog },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      type: '',
      dialogVisible: false,
      positionType: [], // 费率类型
      rateDetail: null
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    if (JSON.stringify(this.dictData) === '{}') {
      this.getDict().finally(() => {
        this.positionType =
          this.dictData &&
          this.dictData.dicts &&
          this.dictData.dicts.positionType

        this.getCommissionPage()
      })
    } else {
      this.positionType =
        this.dictData && this.dictData.dicts && this.dictData.dicts.positionType
      this.getCommissionPage()
    }
  },
  methods: {
    getDict() {
      return getDict().then(res => {
        console.log(res)
        res.areas &&
          res.areas.forEach(firstItem => {
            if (firstItem.children.length) {
              firstItem.children.forEach(secondItem => {
                if (secondItem.children.length) {
                  secondItem.children.forEach(thirdItem => {
                    delete thirdItem.children
                  })
                } else {
                  delete secondItem.children
                }
              })
            } else {
              delete firstItem.children
            }
          })
        this.$store.dispatch('dispatchUpdateDictData', res)
      })
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 关闭弹框
    reloadDialog() {
      this.getCommissionPage()
    },
    // 添加/编辑费率
    editRate(type, row) {
      this.type = type
      if (type === 'edit') {
        this.rateDetail = row
      } else {
        this.rateDetail = null
      }
      this.dialogVisible = true
    },
    // 列表
    getCommissionPage() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true
      getCommissionPage(params)
        .then(res => {
          this.listLoading = false
          this.list = res.data.records
          this.total = res.data.total
        })
        .finally(() => {
          console.log(
            'finally',
            this.dictData &&
              this.dictData.dicts &&
              this.dictData.dicts.positionType
          )
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-rate {
  padding-left: 16px;
  .main {
    min-height: 100%;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #14171a;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .btn {
      margin: 20px 0;
    }
    .table {
      ::v-deep .el-table__header {
        font-size: 12px;
      }
      ::v-deep .el-table__body {
        font-size: 12px;
      }
      ::v-deep .el-table__footer {
        font-size: 12px;
      }
    }
  }
}
</style>
