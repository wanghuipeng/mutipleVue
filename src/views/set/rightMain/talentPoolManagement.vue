<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">人才库设置</el-breadcrumb-item>
        <el-breadcrumb-item>人才库管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 新建人才库 -->
      <el-row class="btn" type="flex">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addTalentPool('')">新建人才库</el-button>
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
        <el-table-column label="人才库基本信息" prop="name" align="left">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <p v-if="!scope.row.isDefault">
              自定义 · {{ scope.row.isOpen ? '公开' : '私密' }}
            </p>
            <p v-else>系统 · 公开</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <p v-if="!scope.row.isDefault">
              {{ scope.row.createTime }}
            </p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column label="上级人才库" prop="parentName" align="center">
          <template slot-scope="scope">
            <p>
              {{ scope.row.parentName ? scope.row.parentName : '无' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <p v-if="!scope.row.isDefault">
              <el-button type="text" size="mini" @click="addTalentPool(scope.row.id)">新建下级人才库</el-button>
              <el-button type="text" size="mini" @click="editTalentPool(scope.row)">修改</el-button>
              <el-button type="text" size="mini" @click="delTalentPool(scope.row)">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <!-- 新增 | 修改人才库 -->
      <el-dialog
        v-if="dialogVisible"
        :title="type === 'add' ? '新建人才库' : '编辑人才库'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="talentPoolForm" :model="talentPoolForm" :rules="talentPoolRules" size="small" label-width="100px">
          <el-form-item label="人才库名称" prop="name">
            <el-input v-model="talentPoolForm.name" placeholder="请输入人才库名称" />
          </el-form-item>
          <el-form-item label="上级人才库">
            <el-select v-model="talentPoolForm.parentId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in parentTalentPool"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="人才库描述" prop="introduce">
            <el-input
              v-model="talentPoolForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="是否公开">
            <span slot="label">
              是否公开
              <el-popover
                placement="top-start"
                title=""
                width="200"
                trigger="hover"
                content="公开人才库，所有用户均可访问；设定为私密的人才库，只允许授权用户访问。"
              >
                <i slot="reference" class="el-icon-question" style="color: #999999;"></i>
              </el-popover>
            </span>
            <el-radio-group v-model="isOpen">
              <el-radio label="true" border>公开</el-radio>
              <el-radio label="false" border>保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isOpen === 'false'" label="选择成员">
            <el-select v-model="talentPoolForm.userId" multiple placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in member"
                :key="item.id"
                :label="item.trueName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveTalentPool('talentPoolForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 删除 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogDel"
        width="30%"
      >
        <p>确认后将该人才库及下级人才库全部移除</p>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="del">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import { getTalentPoolList, addTalentPool, editTalentPool, deleteById } from '@/api/set/talentPool'
import { findMemberDetailVOList } from '@/api/set'
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
      dialogVisible: false,
      parentTalentPool: [], // 上级人才库
      member: [], // 成员列表
      isOpen: 'true',
      talentPoolForm: {
        name: '',
        parentId: null,
        remark: '',
        isOpen: 'true',
        isDefault: false,
        userId: []
      },
      talentPoolRules: {
        name: [
          { required: true, message: '请输入人才库名称', trigger: 'blur' }
        ]
      },
      dialogDel: false,
      talentPoolInfo: {},
      talentPoolId: '',
      type: ''
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
    this.getMember()
  },
  methods: {
    // 成员
    getMember() {
      findMemberDetailVOList().then(res => {
        console.log(res)
        this.member = res.data
      })
    },
    // 列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true
      getTalentPoolList(params).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        this.parentTalentPool = [{
          name: '无',
          id: ''
        }]
        this.parentTalentPool = this.parentTalentPool.concat(res.data.records.slice(3))
      })
    },
    // 新增人才库
    addTalentPool(id) {
      this.isOpen = 'true'
      this.talentPoolForm = {
        name: '',
        parentId: id,
        remark: '',
        isOpen: 'true',
        isDefault: false,
        userId: []
      }
      this.type = 'add'
      this.talentPoolId = ''
      this.dialogVisible = true
    },
    // 编辑人才库
    editTalentPool(info) {
      this.talentPoolId = info.id
      this.talentPoolForm.name = info.name
      this.talentPoolForm.parentId = info.parentId === null ? '' : info.parentId
      this.talentPoolForm.remark = info.remark
      this.talentPoolForm.isOpen = info.isOpen
      this.isOpen = info.isOpen === true ? 'true' : 'false'
      const arr = info.userId && info.userId.split(',')
      const userIds = []
      arr && arr.forEach(item => {
        userIds.push(Number(item))
      })
      this.talentPoolForm.userId = userIds
      this.type = 'edit'
      this.dialogVisible = true
    },
    // 新增保存 | 编辑保存
    saveTalentPool(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.talentPoolForm
          params.isOpen = this.isOpen === 'true'
          params.userId = params.userId.join(',')
          console.log(params)
          if (this.talentPoolId) {
            params.id = this.talentPoolId
            editTalentPool(params).then(res => {
              this.$message.success({
                message: '保存成功',
                duration: 1000
              })
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addTalentPool(params).then(res => {
              this.$message.success({
                message: '保存成功',
                duration: 1000
              })
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 选择删除文件夹
    delTalentPool(data) {
      this.talentPoolInfo = data
      this.talentPoolId = data.id
      this.dialogDel = true
    },
    // 删除文件夹
    del(id) {
      const params = {
        poolId: this.talentPoolId
      }
      deleteById(params).then(res => {
        this.$message.success({
          message: '删除成功',
          duration: 1000
        })
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
    min-height: 600px;
    .btn {
      margin: 20px 0;
    }
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
</style>
