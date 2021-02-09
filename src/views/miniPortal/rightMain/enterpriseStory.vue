<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>企业故事</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="tip">我们为您提供了一套默认的雇主品牌页面，您可以向求职者全方位展示公司的品牌形象和故事。如果您有自己的雇主品牌站，也可以直接使用自己的品牌站作为雇主品牌主页</p>
      <p class="switch">
        <span>企业故事</span>
        <el-switch v-model="switchVal" active-color="#1678F9" @change="editSwitch" />
      </p>
      <el-divider></el-divider>

      <!-- 新增 -->
      <el-row class="btn" type="flex">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          :disabled="!switchVal"
          @click="addStory"
        >新增企业故事</el-button>
      </el-row>

      <!-- 表格 -->
      <el-table
        ref="dragTable"
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        class="table"
      >
        <el-table-column label="企业故事名称" prop="name" align="center" />
        <el-table-column label="故事排序" prop="sortOrder" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              :disabled="!switchVal"
              @click="editStory(scope.row)"
            >修改</el-button>
            <el-button type="text" size="mini" :disabled="!switchVal" @click="del(scope.row.id)">删除</el-button>
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
        :title="type === 'add' ? '新增企业故事' : '编辑企业故事'"
        :visible.sync="dialogVisible"
        width="1000px"
      >
        <el-form
          ref="storyForm"
          :model="storyForm"
          :rules="storyRules"
          size="mini"
          label-width="100px"
        >
          <el-form-item label="故事名称" prop="name">
            <el-input v-model="storyForm.name" placeholder="请输入故事名称" />
          </el-form-item>
          <el-form-item label="故事排序" prop="sort">
            <el-select v-model="storyForm.sort" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in 10" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="故事内容" prop="desc">
            <quill-editor ref="myQuillEditor" v-model="storyForm.desc" :options="editorOption" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveStory('storyForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogDel" width="30%">
        <span>删除后，求职者将无法查看该条企业故事</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delStory">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import Pagination from '@/components/adminStyle/pagination' // secondary package based on el-pagination
import {
  getCompanyDetailByUserId,
  updateWzCompanyStorySwitch,
  getCompanyStoryList,
  saveCompanyStoryDTO,
  deleteStory,
  updateCompanyStorySort
} from '@/api/miniPortal'
export default {
  components: { Pagination },
  data() {
    return {
      switchVal: true,
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      type: '',
      dialogDel: false,
      dialogVisible: false,
      storyForm: {
        name: '',
        sort: '',
        desc: ''
      },
      storyRules: {
        name: [{ required: true, message: '请输入故事名称', trigger: 'blur' }],
        sort: [
          { required: true, message: '请选择故事排序', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请输入故事描述', trigger: 'blur' }]
      },
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // 加粗，斜体，下划线
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ align: [] }], // 对齐方式
            ['image'] // 上传图片
          ]
        }
      },
      storyId: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.getStatus()
    this.getList()
  },
  methods: {
    // 开关状态
    getStatus() {
      getCompanyDetailByUserId().then(res => {
        this.switchVal = res.data.wzCompanyStorySwitch
      })
    },
    // 修改开关状态
    editSwitch(val) {
      console.log(val)
      updateWzCompanyStorySwitch({ wzCompanyStorySwitch: val }).then(res => {
        console.log(res)
      })
    },
    // 列表
    getList() {
      const params = {
        pageNumber: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true
      getCompanyStoryList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        // this.total = res.data.total
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    // 新增故事
    addStory() {
      this.type = 'add'
      this.storyId = ''
      this.storyForm.name = ''
      this.storyForm.sort = ''
      this.storyForm.desc = ''
      this.dialogVisible = true
    },
    // 编辑故事
    editStory(info) {
      this.type = 'edit'
      this.storyId = info.id
      this.storyForm.name = info.name
      this.storyForm.sort = info.sortOrder
      this.storyForm.desc = info.content
      this.$nextTick(() => {
        this.$refs.myQuillEditor.quill.enable(true)
        this.$refs.myQuillEditor.quill.blur()
      })
      this.dialogVisible = true
    },
    // 保存故事
    saveStory(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            id: this.storyId,
            name: this.storyForm.name,
            sortOrder: this.storyForm.sort,
            content: this.storyForm.desc
          }
          saveCompanyStoryDTO(params).then(res => {
            this.$message.success('保存成功')
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 删除
    del(id) {
      this.storyId = id
      this.dialogDel = true
    },
    // 删除故事
    delStory() {
      const params = {
        id: this.storyId
      }
      deleteStory(params).then(res => {
        this.$message.success('删除成功')
        this.dialogDel = false
        this.getList()
      })
    },
    // 拖动排序
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          const ids = []
          this.list.forEach((item, index) => {
            item.sortOrder = index + 1
            ids.push(item.id)
          })
          const params = {
            sortStoryIds: ids.join(',')
          }
          updateCompanyStorySort(params).then(res => {})
        }
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
    .switch {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        margin-right: 20px;
      }
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
      }
      ::v-deep .el-table__footer {
        font-size: 12px;
      }
    }
    ::v-deep .ql-container {
      height: 200px;
    }
  }
}
</style>
