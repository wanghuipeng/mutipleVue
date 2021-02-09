<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">基础设置</el-breadcrumb-item>
        <el-breadcrumb-item>成员管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 新增 -->
      <el-row class="btn" type="flex">
        <el-button
          v-if="userInfo.companyRole === 3 || userInfo.companyRole === 4"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addMember"
        >新增成员</el-button>
      </el-row>

      <el-row class="content">
        <el-col :span="4" class="main-left">
          <ul v-for="(item, index) in roles" :key="index">
            <li
              :class="{active: actIdx === index}"
              :style="{display: item.value === '4' ? 'none' : ''}"
              @click="changeRole(index, item)"
            >
              {{ item.label }}
              <span v-if="item.value === '3'">{{ item.count + roles[1].count }}</span>
              <span v-else>{{ item.count }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="20" class="main-right">
          <p class="title">
            <span>{{ title }}</span>
            <el-popover placement="top-start" title="标题" width="360" trigger="hover">
              <ul class="tips" style="line-height: 24px;">
                <li style="border-bottom: 1px solid #DCDFE6; padding: 10px 0;">
                  <p>管理员</p>
                  <p>管理企业信息 | 管理成员 | 管理职位、项目 | 其他所有功能</p>
                </li>
                <li style="border-bottom: 1px solid #DCDFE6; padding: 10px 0;">
                  <p>招聘者</p>
                  <p>管理职位、项目 | 其他所有功能</p>
                </li>
                <li style="padding-top: 10px;">
                  <p>普通成员</p>
                  <p>查看职位 | 推荐人选</p>
                </li>
              </ul>
              <span slot="reference" style="cursor: pointer;">
                了解成员权限
                <i class="el-icon-question" />
              </span>
            </el-popover>
            <el-input v-model="searchName" class="input-search" size="small" placeholder="请输入成员姓名/手机号码进行搜索"></el-input>
          </p>
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
            <el-table-column label="成员" prop="trueName" align="center" />
            <el-table-column label="手机号" prop="mobile" align="center" />
            <el-table-column label="所属部门" prop="departmentIds" align="center">
              <template v-if="scope.row.departmentIds && scope.row.departmentIds.length > 0" slot-scope="scope">{{ scope.row.departmentIds | filterStrJoin(departmentList) }}</template>
            </el-table-column>
            <el-table-column label="权限" prop="companyRole" align="center">
              <template slot-scope="scope">{{ scope.row.companyRole | filterArr(roles) }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <p
                  v-if="scope.row.companyRole !== 4 && (userInfo.companyRole === 3 || userInfo.companyRole === 4)"
                >
                  <el-button type="text" size="mini" @click="changeMember(scope.row)">修改</el-button>
                  <el-button
                    v-if="userInfo.companyRole === 4"
                    type="text"
                    size="mini"
                    @click="changeDelMember(scope.row.id)"
                  >删除</el-button>
                </p>
                <p v-else>-</p>
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
        </el-col>
      </el-row>
      <!-- 新增 | 修改部门 -->
      <el-dialog
        v-if="dialogVisible"
        :title="type === 'add' ? '新增成员' : '编辑成员'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form
          ref="memberForm"
          :model="memberForm"
          :rules="memberRules"
          size="small"
          label-width="100px"
        >
          <el-form-item label="成员姓名" prop="trueName">
            <el-input v-model="memberForm.trueName" :disabled="disabled" placeholder="请输入成员姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="memberForm.mobile" :disabled="disabled" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="权限" prop="companyRole">
            <el-select
              v-model="memberForm.companyRole"
              :disabled="userInfo.companyRole === memberForm.companyRole*1"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in companyMemberIdentity"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentIds">
            <el-select v-model="memberForm.departmentIds" clearable multiple placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="editMember('memberForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogDel" width="30%">
        <span>确认后将该成员从当前租户移除</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delMember">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import {
  getCompanyUserRoleRistribution,
  findMemberDetailVOList,
  updateMember,
  insertMember,
  deletetMember,
  searchPage,
  findMemberDetail
} from '@/api/set'
export default {
  filters: {
    filterStrJoin(value, arr) {
      let str = ''
      value && value.filter((i, y) => {
        arr && arr.filter((item, index) => {
         if (i === item.id) {
            str += item.deptName + '，'
          }
         })
      })
      const temp = str.split('，')
      temp && temp.splice(temp.length - 1, 1)
      str = temp.join('，')
      return str
    }
  },
  components: { Pagination },
  data() {
    return {
      searchName: '',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      actIdx: null,
      companyRole: '',
      title: '全部',
      roles: [
        {
          label: '全部',
          value: '',
          count: 0
        },
        {
          label: '超级管理员',
          value: '4',
          count: 0
        },
        {
          label: '管理员',
          value: '3',
          count: 0
        },
        {
          label: '招聘者',
          value: '2',
          count: 0
        },
        {
          label: '普通成员',
          value: '1',
          count: 0
        }
      ],
      dialogVisible: false,
      memberForm: {
        trueName: '',
        mobile: '',
        companyRole: '',
        departmentIds: []
      },
      memberRules: {
        trueName: [
          { required: true, message: '请输入成员姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.$verify.phoneFormat, trigger: 'blur' }
        ],
        companyRole: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ]
      },
      dialogDel: false,
      memberId: '',
      disabled: false,
      type: '',
      departmentList: []
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo,
      companyMemberIdentity: state => {
        const role = state.userInfo.companyRole
        const arr = state.common.dictData.dicts.companyMemberIdentity
        arr.forEach(item => {
          item.disabled = false
        })
        if (role === 3) {
          arr[2].disabled = true
          arr[3].disabled = true
        } else if (role === 4) {
          arr[3].disabled = true
        }
        return arr
      }
    })
  },
  watch: {
    searchName(value) {
      console.log('监听', value)
      this.searchName = value
      this.getList()
    }
  },
  created() {
    this.getCounts()
    this.getList()
    this.searchPage()
  },
  methods: {
    // 成员详情
    findMemberDetail(id) {
      const params = {
        id
      }
      findMemberDetail(params).then((res) => {
        this.memberForm.departmentIds = res.data.departmentIds
      })
    },
     // 获取部门
    searchPage() {
      const params = {
        pageNumber: 1,
        pageSize: 999
      }
      searchPage(params).then((res) => {
        this.departmentList = res.data.records
        console.log('部门', this.departmentList)
      })
    },
    // 角色数量
    getCounts() {
      getCompanyUserRoleRistribution().then(res => {
        const arr = res.data
        this.roles.forEach(item => {
          item.count = 0
          arr.forEach(items => {
            if (item.value === '') {
              item.count += items.count
            }
            if (item.value * 1 === items.status) {
              item.count = items.count
            }
          })
        })
      })
    },
    // 角色切换
    changeRole(index, role) {
      this.actIdx = index
      this.companyRole = role.value
      this.title = role.label
      this.getList()
    },
    // 列表
    getList() {
      const params = {
        searchName: this.searchName,
        companyRole: this.companyRole
      }
      this.listLoading = true
      findMemberDetailVOList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        // this.total = res.data.total
      })
    },
    // 新增成员
    addMember() {
      this.memberForm = {
        trueName: '',
        mobile: '',
        companyRole: ''
      }
      this.type = 'add'
      this.memberId = ''
      this.disabled = false
      this.dialogVisible = true
    },
    // 选择修改权限
    changeMember(info) {
      this.memberId = info.id
      this.memberForm.trueName = info.trueName
      this.memberForm.mobile = info.mobile
      this.memberForm.companyRole = info.companyRole + ''
      this.findMemberDetail(info.id)
      this.type = 'edit'
      this.disabled = true
      this.dialogVisible = true
    },
    // 新增 | 编辑
    editMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            id: this.memberId,
            trueName: this.memberForm.trueName,
            mobile: this.memberForm.mobile,
            companyRole: this.memberForm.companyRole,
            departmentIds: this.memberForm.departmentIds
          }
          console.log(params)
          if (this.memberId) {
            updateMember(params).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.getCounts()
              this.getList()
            })
          } else {
            insertMember(params).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.getCounts()
              this.getList()
            })
          }
        }
      })
    },
    // 选择删除成员
    changeDelMember(id) {
      this.memberId = id
      this.dialogDel = true
    },
    // 删除成员
    delMember(id) {
      const params = {
        id: this.memberId
      }
      deletetMember(params).then(res => {
        this.$message.success('删除成功')
        this.dialogDel = false
        this.getCounts()
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .input-search{
    width: 240px;
    position: absolute;
    right:15px;
    top:10px;
  }
  .main {
    min-height: 100%;
    .btn {
      margin: 20px 0;
    }
    .content {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .main-left {
        height: 100%;
        border-right: 1px solid #dcdfe6;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          line-height: 40px;
          padding: 0 16px;
          cursor: pointer;
        }
        .active {
          background: #409eff;
          color: #ffffff;
        }
      }
      .main-right {
        padding: 0 16px;
        .title {
          line-height: 40px;
          margin-bottom: 16px;
          span {
            display: inline;
            &:last-child {
              font-size: 12px;
              margin-left: 16px;
              color: #999999;
            }
          }
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
  }
}
</style>
