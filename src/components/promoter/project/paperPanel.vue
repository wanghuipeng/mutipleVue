<template>
  <div class="look-panel">
    <leftMenu class="left-menu" @refreshList="dtoListByQuestionnaireId" />
    <div class="right-table">
      <div class="oprerate-div">
        <el-button size="small" class="left-btn" @click="newQuest"><i class="el-icon-plus"></i> 新增问题项</el-button>
        <!-- <el-button size="small" type="primary" class="right-btn" @click="scanPreview">扫码预览</el-button> -->
      </div>
      <p class="tip">提示：长按下方问卷表格内的行数据，可以对问题项进行拖动排序</p>
      <el-table
        ref="dragTable"
        :key="tableKey"
        v-loading="loading"
        fit
        row-key="questionId"
        class="mt-10"
        :data="listData"
        border
        highlight-current-row
      >
        <el-table-column label="序号" prop="questionId" align="center" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <p style="font-size:14px;color:#909399;">{{ scope.row.questionId }}</p>
          </template>
        </el-table-column>
        <el-table-column label="问题项名称" prop="questionName" align="center" show-overflow-tooltip min-width="210">
          <template slot-scope="scope">
            <div class="position-info">
              <p style="font-size:14px;color:#909399;" >{{ scope.row.questionName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="问题类型" prop="companyName" align="center" width="100" show-overflow-tooltip >
          <template slot-scope="scope">
            <p style="font-size:14px;color:#909399;">{{ scope.row.formType | filterCommonDict(typeArr) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="needRequired"
          label="是否必填"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.needRequired" style="font-size:14px;color:#909399;" size="small">是</span>
            <span v-else size="small" style="font-size:14px;color:#909399;">否</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" :disabled="scope.row.questionType === 2" @click="editIt(scope.row)">修改</el-button>
            <el-popconfirm title="是否删除该问题项？" @onConfirm="deleteIt(scope.row.questionId)">
              <el-button slot="reference" type="text" size="mini" class="ml-10" :disabled="scope.row.questionType === 2">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增问题项 -->
    <el-dialog
      :close-on-click-modal="false"
      title="新增问题项"
      :visible.sync="questionVisible"
      append-to-body
      class="quetion-modal"
      width="600px"
      :before-close="closeForm"
    >
      <el-form
        ref="questionForm"
        :model="questionForm"
        :rules="storyRules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="名称" prop="questionName" class="name-input">
          <el-input v-model="questionForm.questionName" placeholder="请输入名称" /><el-checkbox v-model="questionForm.needRequired">设为必填</el-checkbox>
        </el-form-item>
        <el-form-item label="说明" prop="instructions">
          <el-input
            v-model="questionForm.instructions"
            type="textarea"
            :rows="4"
            placeholder="请输入"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="formType">
          <el-select v-model="questionForm.formType" style="width:100%" @change="checkIt">
            <el-option v-for="(item,index) in typeArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-checkbox v-if="type === 'NUMBER'" v-model="limitNum" class="mt-10">仅限输入整数</el-checkbox>
          <el-checkbox v-if="type === 'ONE_IMAGE' || type === 'MULTIPLE_IMAGE'" v-model="limitPhoto" class="mt-10">仅限即时拍照</el-checkbox>
          <p v-if="type === '' || type === 'TEXT' || type === 'TEXTAREA'" class="tip">根据需要可选择不同字段类型，选择的字段类型会对是否配置字段选项产生影响</p>
          <div v-if="type === 'ONE_SELECT' || type === 'RADIO' || type === 'MULTIPLE_SELECT'" class="add-items">
            <p>字段值选项：<el-link type="primary" @click="addLabel"><i class="el-icon-plus"></i>增加选项</el-link></p>
            <div v-for="(item,index) in labelsArr" :key="index" class="label-input">
              <el-input v-model="item.label" size="small" placeholder="请输入字段值" ></el-input>
              <span class="del" @click="delLabel(index)"><i class="el-icon-close"></i></span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="questionnaireType == 2" label="针对SKU" prop="aimAdSkuIds" class="sku-item">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">如果您希望现在所设置的问题项只针对某些特定SK才出现，可以在此设置。<br />设置成功后促销员在选择到对应SKU时，才会显示此问题。</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-select v-model="questionForm.aimAdSkuIds" prop="aimAdSkuIds" multiple style="width:100%">
            <el-option v-for="(item,index) in skuArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeForm('questionForm')">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveForm('questionForm')">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="imgVisible"
      width="450px"
      class="scan-preview"
      lock-scroll
      :show-close="false"
      :append-to-body="true"
      @close="handleCloseImg"
    >
      <div class="main">
        <img :src="webUrl" />
      </div>
      <span slot="footer">
        <p>请用微信扫描上方小程序码</p>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import leftMenu from './leftMenu'
import { dtoListByQuestionnaireId, saveQuestionForm, deleteByQuestionId, querySelectList, updateSortOrder } from '@/api/promoter/projectApi'

export default {
  components: {
      leftMenu
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
      tableKey: 0,
      questionnaireId: null,
      labelsArr: [],
      needRequired: false,
      limitNum: false,
      limitPhoto: false,
      loading: false,
      listData: [],
      skuArr: [],
      questionVisible: false,
      questionForm: {},
      type: '',
      labelInput: '',
      typeArr: [{
           value: 'TEXT',
          label: '单行文本'
        }, {
           value: 'TEXTAREA',
          label: '多行文本'
        }, {
           value: 'NUMBER',
          label: '数字'
        },
        //  {
        //    value: 'ONE_SELECT',
        //   label: '单选下拉'
        // },
        {
           value: 'RADIO',
          label: '单选框'
        }, {
           value: 'MULTIPLE_SELECT',
          label: '多选'
        }, {
           value: 'ONE_IMAGE',
          label: '单张图片'
        }, {
           value: 'MULTIPLE_IMAGE',
          label: '多张图片'
        }, {
           value: 'DATE',
          label: '日期控件'
        }
      ],
      storyRules: {
        questionName: [{ required: true, message: '请输入问题名称', trigger: 'blur' }],
        instructions: [
          { required: false, message: '请输入问题说明', trigger: 'blur' }
        ],
        formType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        aimAdSkuIds: [
          { required: false, message: '请选择针对SKU', trigger: 'blur' }
        ]
      },
      imgVisible: false,
      webUrl: '',
      sortable: [],
      questionnaireType: null
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
  created() {
  },
  mounted() {

  },
  methods: {
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
          const targetRow = this.listData.splice(evt.oldIndex, 1)[0]
          this.listData.splice(evt.newIndex, 0, targetRow)
          const ids = []
          this.listData.forEach((item, index) => {
            item.sortOrder = index + 1
            ids.push(item.questionId)
          })
          const params = ids
          updateSortOrder(params).then(res => {})
        }
      })
    },
    handleCloseImg() {
      this.imgVisible = false
    },
    scanPreview() {
      this.$message.warning('待研发...')
      // this.imgVisible = true
      // this.webUrl = 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=316413923,1093846806&fm=190&app=60&f=PNG?w=121&h=75&s=9D550BCA8BF0A6591661B00F0300F0C1'
    },
    querySelectList() {
      const params = {
        pageNumber: 1,
        pageSize: 999,
        projectId: this.projectId || this.$route.query.projectId
      }
      querySelectList(params).then(res => {
        const { success, data, message } = res
        if (success && data) {
          this.skuArr = data || []
          if (this.skuArr && this.skuArr.length > 0) {
            this.skuArr && this.skuArr.filter(item => {
              item.label = item.text
            })
          }
        } else {
          this.$message.error(message)
        }
      })
    },
    closeForm() {
      console.log('关闭')
      // this.$refs['questionForm'].resetFields()
      this.questionForm = {
          aimAdSku: false,
          aimAdSkuIds: '',
          aimAdSkuNames: null,
          formOptionJson: '',
          formType: '',
          instructions: '',
          needRequired: false,
          otherRequire: '',
          questionName: '',
          sortOrder: null
      }
      this.questionVisible = false
      this.labelsArr = []
      this.needRequired = false
      this.limitNum = false
      this.limitPhoto = false
      this.type = ''
    },
    editIt(item) {
      this.questionVisible = true
      this.questionForm = item
      console.log('item', item.aimAdSkuIds)
      this.type = item.formType
      if (this.questionnaireType - 0 === 2) {
        this.questionForm.aimAdSku = true
        this.querySelectList(item.aimAdSkuIds)
      } else {
        this.questionForm.aimAdSku = false
      }
       if (item.aimAdSkuIds && (typeof item.aimAdSkuIds === 'string')) {
        console.log(333333333333, item.aimAdSkuIds)
        const arr = item.aimAdSkuIds && item.aimAdSkuIds.split(',')
        const arr1 = []
        arr && arr.filter(item => {
          arr1.push(item - 0)
        })
        this.questionForm.aimAdSkuIds = arr1
        console.log('arr', this.questionForm.aimAdSkuIds, item.aimAdSkuIds)
      }
      if (item.formOptionJson) {
        this.labelsArr = item.formOptionJson && JSON.parse(item.formOptionJson)
      } else {
        this.labelsArr = []
      }
      if (item.otherRequire === 'limitPhoto') {
        this.limitPhoto = true
      } else if (item.otherRequire === 'limitNum') {
        this.limitNum = true
      }
      console.log(item)
    },
    deleteIt(questionId) {
      this.deleteByQuestionId(questionId)
    },
    deleteByQuestionId(questionId) {
      const params = {
        questionId
      }
      deleteByQuestionId(params).then(res => {
        const { success, data, message } = res
        if (success && data) {
          this.closeForm('questionForm')
          this.$message.success('删除成功')
          this.dtoListByQuestionnaireId(this.questionnaireId, this.questionnaireType)
        } else {
          this.$message.error(message)
        }
      })
    },
    saveQuestionForm() {
      this.labelsArr && this.labelsArr.map(item => {
         item.value = item.label
      })
      console.log('labelsArr', this.labelsArr)
      const params = this.questionForm
      params.questionnaireId = this.questionnaireId
      if (this.labelsArr && this.labelsArr.length > 0) {
         params.formOptionJson = this.labelsArr && JSON.stringify(this.labelsArr)
      } else {
         params.formOptionJson = ''
      }
      if (this.limitPhoto) {
          params.otherRequire = 'limitPhoto'
      } else if (this.limitNum) {
          params.otherRequire = 'limitNum'
      } else {
          params.otherRequire = ''
      }
      console.log(22222222, params)
      let aimAdSkuIds = []
      if (params.aimAdSkuIds) {
        aimAdSkuIds = JSON.parse(JSON.stringify(params.aimAdSkuIds))
      } else {
        aimAdSkuIds = []
      }
      const aimAdSkuNames = []
      if (aimAdSkuIds && aimAdSkuIds.length > 0) {
        params.aimAdSkuIds = aimAdSkuIds && aimAdSkuIds.join(',')
        aimAdSkuIds.filter(item => {
          this.skuArr && this.skuArr.filter(a => {
            if (item - 0 === a.value - 0) {
                aimAdSkuNames.push(a.label)
            }
          })
        })
        params.aimAdSkuNames = aimAdSkuNames && aimAdSkuNames.join(',')
      } else {
        params.aimAdSkuIds = ''
      }
      console.log('参数1', aimAdSkuIds, params.aimAdSkuIds)
      console.log('参数2', aimAdSkuNames, params.aimAdSkuNames)
      saveQuestionForm(params).then(res => {
        const { success, data, message } = res
        if (success && data) {
          this.$message.success('保存成功')
          this.closeForm('questionForm')
          this.dtoListByQuestionnaireId(this.questionnaireId, this.questionnaireType)
        } else {
          this.$message.error(message)
        }
      })
    },
    dtoListByQuestionnaireId(questionnaireId, questionnaireType) {
      this.questionnaireId = questionnaireId
      this.questionnaireType = questionnaireType
      console.log('questionnaireType', questionnaireType)
      if (questionnaireType - 0 === 2) { // 理货汇报
        this.querySelectList()
      }
      const params = {
        questionnaireId
      }
      dtoListByQuestionnaireId(params).then(res => {
        const { success, data, message } = res
        if (success && data) {
          this.listData = data
          this.$nextTick(() => {
            this.setSort()
          })
        } else {
          this.$message.error(message)
        }
      })
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.saveQuestionForm()
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delLabel(index) {
      this.labelsArr.splice(index, 1);
    },
    addLabel() {
        const cope = {
            label: ''
        }
        console.log(cope)
        this.labelsArr.push(cope);
    },
    newQuest() {
      this.questionForm = {
          aimAdSku: false,
          aimAdSkuIds: '',
          aimAdSkuNames: null,
          formOptionJson: '',
          formType: '',
          instructions: '',
          needRequired: false,
          otherRequire: '',
          questionName: '',
          sortOrder: null
      }
      this.questionVisible = true
    },
    checkIt(e) {
      this.type = e
      if (e === 'ONE_IMAGE' || e === 'MULTIPLE_IMAGE') {
        this.questionForm.aimAdSku = true
      } else {
        this.questionForm.aimAdSku = false
      }
      console.log(e)
    }
  }
}
</script>

<style lang="scss" >
.scan-preview  {
  img{
      display: block;
      width: 100%;
      height: 150px;
      width: 150px;
      margin: 0 auto;
  }
  p{
    text-align: center;
    font-size: 12px;
    color: #15181B;
  }
}
.quetion-modal{
    .sku-item{
      .el-form-item__content{
        position: relative;
      }
      .el-icon-question{
        position: absolute;
        left: -19px;
        z-index: 10;
        top: 7px;
        font-size: 16px;
      }
    }
}
.look-panel{
    display: flex;
    .el-table .cell{
      white-space: initial !important;
    }
    .tip{
      color: red;
      font-size: 14px;
      margin-top: 10px;
    }
    .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 14px;
    }
    .left-menu{
        width: 160px;
    }
    .right-table {
        margin-left: 10px;
        flex: 1;
        width: 520px;
       .oprerate-div{
           display: flex;
           justify-content: space-between;
       }
    }
}
.quetion-modal {
  .add-items{
    p{
      margin-top: 10px;
      .el-link {
        margin-top: -2px;
      }
    }
    .label-input {
      margin-top: 10px;
      .el-input {
        width: 200px;
        margin-right: 15px;
      }
      span {
        margin-right: 10px;
        cursor: pointer;
      }
      .del {
        cursor: pointer;
      }
      .add {
        color: #409eff;
      }
    }
  }
  .name-input{
      .el-input{
          width: 360px;
          margin-right: 10px;
      }
  }
  .tip{
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-top: 10px;
  }
}
</style>
