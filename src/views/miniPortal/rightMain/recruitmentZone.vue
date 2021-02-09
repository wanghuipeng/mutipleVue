<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>招聘专区</el-breadcrumb-item>
      </el-breadcrumb>

      <p class="tip">您可以根据您的招聘需求和招聘活动，通过后台快速搭建定制化的招聘专区</p>

      <!-- 新增 -->
      <el-row class="btn" type="flex">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增专区</el-button>
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
        <el-table-column label="专区封面图" prop="specialAreaLogoUrl" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.specialAreaLogoUrl" class="banner" />
          </template>
        </el-table-column>
        <el-table-column label="招聘专区名称" prop="specialAreaName" align="center" />
        <el-table-column label="包含职位数量" prop="positionCount" align="center" />
        <el-table-column label="修改时间" prop="updateTime" align="center">
          <template slot-scope="scope">
            <div v-if="!scope.row.isDefault">{{ scope.row.updateTime }}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="editZone(scope.row.id)">修改</el-button>
              <el-button v-if="!scope.row.isDefault" type="text" size="mini" @click="del(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />

      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogDel" width="30%">
        <span>确认删除该专区？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delZone">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import { getWzSpecialAreaList, deleteById } from '@/api/miniPortal'
export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 99
      },
      dialogDel: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true
      getWzSpecialAreaList(params).then(res => {
        console.log(res)
        this.listLoading = false
        this.list = res.data
        // this.total = res.data.total
      })
    },
    // 新增
    add() {
      this.$router.push('/miniPortal/recruitmentDetail')
    },
    // 编辑
    editZone(id) {
      this.$router.push({
        path: '/miniPortal/recruitmentDetail',
        name: 'recruitmentDetail',
        query: {
          id: id,
          type: 'edit'
        }
      })
    },
    // 删除
    del(id) {
      this.zoneId = id
      this.dialogDel = true
    },
    // 删除专区
    delZone(id) {
      const params = {
        id: this.zoneId
      }
      deleteById(params).then(res => {
        this.$message.success('删除成功')
        this.dialogDel = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .main {
    min-height: 100%;
    .tip {
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 35px;
      color: #666;
    }
    .btn {
      margin-bottom: 20px;
    }
    .table {
      ::v-deep .el-table__header {
        font-size: 12px;
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
  }
}
</style>
