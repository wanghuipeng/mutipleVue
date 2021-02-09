<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <!-- <p class="title">部门管理</p> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">基础设置</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 新增 -->
      <el-row class="btn" type="flex">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addDepartment">新增部门</el-button>
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
        <el-table-column label="部门名称" prop="deptName" align="center" />
        <el-table-column label="部门备注" prop="remark" align="center" />
        <el-table-column label="部门负责人" prop="headUserName" align="center" />
        <el-table-column label="修改时间" prop="updateTime" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="mini" @click="del(scope.row.id)">删除</el-button>
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

      <!-- 新增 | 修改部门 -->
      <el-dialog
        v-if="dialogVisible"
        :title="type === 'add' ? '新增部门' : '编辑部门'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="cancelDialog"
      >
        <el-form
          ref="departmentForm"
          :model="departmentForm"
          :rules="departmentRules"
          size="mini"
          label-width="100px"
        >
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="departmentForm.name" placeholder="请输入部门名称" />
          </el-form-item>
          <el-form-item label="部门说明">
            <el-input v-model="departmentForm.desc" placeholder="请输入部门说明" />
          </el-form-item>
          <el-form-item label="负责人">
            <!-- <el-select v-model="departmentForm.headUserId" class="user-select" placeholder="请选择" clearable>
              <el-option
                v-for="item in userIdsArr"
                :key="item.value"
                :label="item.trueName"
                :value="item.value"
              >
                <span style="float: left">{{ item.trueName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;padding-left:10px;box-sizing: border-box;">{{ item.label }}</span>
              </el-option>
            </el-select> -->
            <el-select
              v-model="userIdSearchName"
              class="user-select"
              placeholder="请选择负责人"
              clearable
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethodUserId"
              @change="handleChangeUserId"
            >
              <el-option
                v-for="item in userIdsArr"
                :key="item.value"
                :label="item.trueName"
                :value="item.value"
              >
                <span style="float: left">{{ item.trueName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;padding-left:10px;box-sizing: border-box;">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveDepartment('departmentForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogDel" width="30%">
        <span>确认删除该部门？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delDepartment">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import { searchPage, saveCompanyDepartmentDTO, deleteDepart } from '@/api/set'
import {
  findMemberVOList
} from '@/api/releasePosition'
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
        limit: 10
      },
      type: '',
      dialogVisible: false,
      departmentForm: {
        name: '',
        desc: '',
        headUserId: ''
      },
      departmentRules: {
        name: [{ required: true, message: '请输入部门姓名', trigger: 'blur' }]
      },
      dialogDel: false,
      departmentId: '',
      userIdsArr: [],
      userIdSearchName: ''
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.getList()
    this.findMemberVOList()
  },
  methods: {
    cancelDialog() {
     this.departmentForm = {}
     this.userIdSearchName = ''
     this.dialogVisible = false
     console.log(111111)
    },
    // 招聘负责人输入联想
    remoteMethodUserId(e) {
      this.userIdSearchName = e
      this.findMemberVOList()
    },
    handleChangeUserId(e) {
      this.departmentForm.headUserId = e
    },
    findMemberVOList() {
      const params = {
        searchName: this.userIdSearchName
      }
      findMemberVOList(params).then((res) => {
        const { code, data } = res
        if (code === '000000') {
          const arr = []
          data &&
            data.filter((item) => {
              item.memberDTOs &&
                item.memberDTOs.filter((itemInner) => {
                  arr.push({
                    value: itemInner.id,
                    gender: itemInner.gender,
                    visitAvatarUrl: itemInner.visitAvatarUrl,
                    label: itemInner.nickName,
                    trueName: itemInner.trueName
                  })
                })
            })
          this.userIdsArr = arr
        }
      })
    },
    // 列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true
      searchPage(params).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    // 新增部门
    addDepartment() {
      this.type = 'add'
      this.departmentId = ''
      this.departmentForm.name = ''
      this.departmentForm.desc = ''
      this.dialogVisible = true
    },
    // 编辑
    edit(info) {
      this.type = 'edit'
      this.departmentId = info.id
      this.departmentForm.name = info.deptName
      this.departmentForm.desc = info.remark
      this.departmentForm.headUserId = info.headUserId
      this.userIdSearchName = info.headUserId
      this.dialogVisible = true
    },
    // 保存
    saveDepartment(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            id: this.departmentId,
            deptName: this.departmentForm.name,
            remark: this.departmentForm.desc,
            headUserId: this.departmentForm.headUserId
          }
          saveCompanyDepartmentDTO(params).then(res => {
            this.$message.success('保存成功')
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 删除
    del(id) {
      this.departmentId = id
      this.dialogDel = true
    },
    // 删除部门
    delDepartment() {
      const params = {
        id: this.departmentId,
        operator: this.userInfo.userId
      }
      deleteDepart(params).then(res => {
        const { success } = res
        if (success) {
          this.$message.success('删除成功')
          this.getList()
        }
        this.dialogDel = false
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
  .user-select{
      width: 100%;
  }
}
</style>
