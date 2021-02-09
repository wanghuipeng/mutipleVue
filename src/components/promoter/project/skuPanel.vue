<template>
  <div class="sku-panel">
    <div class="oprerate-div">
      <el-button size="small" @click="importIt"><i class="el-icon-plus"></i> 导入SKU</el-button>
    </div>
    <el-table
      ref="dataTable"
      v-loading="loading"
      class="mt-10"
      :data="listData"
      border
      highlight-current-row
    >
      <el-table-column label="SKU序号" prop="skuCode" align="center" width="110">
        <template slot-scope="scope">
          <span style="font-size:12px;color:#909399;">{{ scope.row.skuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SKU名称" prop="skuName" align="center" min-width="200">
        <template slot-scope="scope">
          <span style="font-size:12px;color:#909399;">{{ scope.row.skuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类" prop="categoryName" align="center" >
        <template slot-scope="scope">
          <span style="font-size:12px;color:#909399;">{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条码" prop="barCode" align="center" min-width="180">
        <template slot-scope="scope">
          <span style="font-size:12px;color:#909399;">{{ scope.row.barCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        prop="retailPrice"
        label="零售价（元）"
        align="center"
      >
        <template slot-scope="scope">
          <span style="font-size:12px;color:#909399;">{{ scope.row.retailPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="toEdit(row)">修改</el-button>
          <el-popconfirm title="是否删除该SKU？" @onConfirm="toDel(row.id)">
            <el-button slot="reference" type="text" size="mini" class="ml-10" >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      size="mini"
      class="mt-10"
      background
      :current-page="pageNumber"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 导入SKU -->
    <drawer-common
      :drawer.sync="importVisible"
      class="edit resume-detail-supplier-drawer"
      direction="btt"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      @close="closeDrawer"
    >
      <div v-if="importVisible" slot="inner-body" style="padding:16px">
        <import-component from-flag="sku" @reload="closeDrawer" />
      </div>
    </drawer-common>

    <!-- 修改SKU -->
    <el-dialog
      title="修改SKU"
      :visible.sync="skuVisible"
      append-to-body
      class="quetion-modal"
      width="600px"
      :before-close="closeForm"
    >
      <el-form
        ref="skuForm"
        :model="skuForm"
        :rules="storyRules"
        size="small"
        label-width="140px"
      >
        <el-form-item label="SKU编号" prop="skuCode" class="name-input">
          <el-input v-model="skuForm.skuCode" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName" class="name-input">
          <el-input v-model="skuForm.skuName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="品类" prop="categoryName" class="name-input">
          <el-input v-model="skuForm.categoryName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="条码" prop="barCode" class="name-input">
          <el-input v-model="skuForm.barCode" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="零售价（元）" prop="retailPrice" class="name-input">
          <el-input v-model="skuForm.retailPrice" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeForm('skuForm')">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveForm('skuForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { skuSearchPage, savePromoterSku, deleteBySkuId } from '@/api/promoter/projectApi'
import importComponent from '@/components/promoter/promotion/importComponent';
import DrawerCommon from '@/components/common/drawerCommon'

export default {
  components: {
    DrawerCommon,
    importComponent
  },
  props: {
    operatorType: {
      type: String,
      default: ''
    },
    companyId: {
      type: Number,
      default: null
    },
    backTo: {
      type: String,
      default: ''
    },
    slotPage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      skuVisible: false,
      importVisible: false,
      loading: false,
      listData: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
      skuForm: {},
      storyRules: {
        skuCode: [{ required: true, message: '请输入SKU编号', trigger: 'blur' }],
        skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
        categoryName: [{ required: false, message: '请输入品类', trigger: 'blur' }],
        barCode: [{ required: false, message: '请输入条码', trigger: 'blur' }],
        retailPrice: [{ required: false, message: '请输入零售价（元）', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      projectId: state => state.promoter.projectId
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas
      this.areas.map(item => {
        item.children &&
          item.children.map(x => {
            x.children &&
              x.children.map(y => {
                delete y.children
              })
          })
      })
    }
  },
  mounted() {
    this.skuSearchPage()
  },
  methods: {
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.savePromoterSku()
        }
      })
    },
    // 删除
    deleteBySkuId(skuId) {
      const params = {
        skuId
      }
      console.log('参数', params)
      deleteBySkuId(params).then(res => {
        if (res.code === '000000') {
          this.$message.success('删除成功')
          this.closeForm()
        } else {
          this.$message.success(res.message)
        }
      })
    },
    // 编辑
    savePromoterSku() {
      const params = this.skuForm
      params.projectId = this.$route.query.projectId || this.projectId
      console.log('参数1', params)
      savePromoterSku(params).then(res => {
        console.log(res)
        if (res.code === '000000') {
          this.$message.success('保存成功11')
          this.closeForm()
          this.$nextTick(() => {
            this.$refs['skuForm'].resetFields()
          })
        } else {
          this.$message.success(res.message)
        }
      })
    },
    closeForm() {
      console.log('关闭')
      this.skuForm = {}
      this.skuVisible = false
      this.skuSearchPage()
    },
    toEdit(row) {
      console.log(row)
      this.listByQuestionId(row)
      this.skuVisible = true
    },
    toDel(id) {
      this.deleteBySkuId(id)
    },
    handleSizeChange(val) {
    console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
    console.log(`当前页: ${val}`)
    },
    closeDrawer() {
      console.log('关闭')
      this.importVisible = false
      this.skuSearchPage()
    },
    importIt() {
      console.log('打开')
      this.importVisible = true
    },
    // 查询sku列表
    skuSearchPage() {
      const {
        pageNumber,
        pageSize } = this
      const para = {
        projectId: this.$route.query.projectId || this.projectId,
        pageNumber,
        pageSize
      }
      const api = skuSearchPage
      api(para).then(res => {
        if (res.success) {
          this.listData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 查询sku详情
    listByQuestionId(row) {
      this.$set(this.skuForm, 'skuCode', row.skuCode)
      this.$set(this.skuForm, 'skuName', row.skuName)
      this.$set(this.skuForm, 'categoryName', row.categoryName)
      this.$set(this.skuForm, 'barCode', row.barCode)
      this.$set(this.skuForm, 'retailPrice', row.retailPrice)
      this.$set(this.skuForm, 'id', row.id)
    }
  }
}
</script>

<style lang="scss" >
.sku-panel{
    .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 12px;
    }
    .oprerate-div{
        display: flex;
        justify-content: space-between;
    }
}
</style>
