<template>
  <div class="mini-portal-page">
    <div class="el-card left">
      <el-tabs v-model="activeName" class="tabs">
        <div style="width: 160px;">
          <el-tab-pane v-loading="loadingTree" label="设置" name="first">
            <el-tree
              ref="tree"
              node-key="id"
              :highlight-current="true"
              default-expand-all
              :data="menuList"
              :props="defaultProps"
              :default-expanded-keys="[1]"
              :default-checked-keys="[1]"
              @node-click="changeTree"
            />
          </el-tab-pane>
        </div>
      </el-tabs>
    </div>

    <!-- 新增问题项 -->
    <el-dialog
      title="创建自定义问卷"
      :visible.sync="templateVisible"
      append-to-body
      width="400px"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        :rules="templateFormRules"
        size="small"
      >
        <el-form-item label="" prop="questionnaireName">
          <el-input v-model="templateForm.questionnaireName" maxlength="16" placeholder="请输入问卷名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="templateVisible = false">取 消</el-button>
        <el-button v-loading="loading" type="primary" size="mini" @click="saveForm('templateForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { saveQuestionnaire, getQuestionTemplate } from '@/api/promoter/projectApi'

export default {
  data() {
    return {
      loadingTree: true,
      loading: false,
      activeName: 'first',
      menuList: [
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      templateForm: {},
      templateFormRules: {
         questionnaireName: [
           { required: true, message: '请输入问卷名称', trigger: 'blur' },
           { validator: this.$verify.questionFormat, trigger: 'change' }
         ]
      },
      templateVisible: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyRole: state => state.userInfo.companyRole,
      projectId: state => state.promoter.projectId
    })
  },
  created() {
     this.getQuestionTemplate()
  },
  mounted() {

  },
  methods: {
    saveForm(formName) {
        this.$refs[formName].validate(valid => {
          console.log(valid)
          if (valid) {
            this.loading = true
            this.saveQuestionnaire()
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },

    getQuestionTemplate() {
      this.loadingTree = true
      this.menuList = []
      const params = {
        projectId: this.$route.query.projectId || this.projectId
      }
      console.log('传参', params)
      getQuestionTemplate(params).then(res => {
        this.loadingTree = false
        const { success, data, message } = res
        const arrDefault = []
        const arrDiy = []
        console.log('11111111111', res)
        if (success && data) {
          data && data.filter(item => {
            item.id = item.questionnaireId
            item.label = item.questionnaireName
            if (item.questionnaireType === 4 || item.questionnaireType === null) {
                arrDiy.push(item)
            } else {
                arrDefault.push(item)
            }
          })
          this.defaultTemplate = arrDefault
          this.menuList.push({
            id: '1',
            label: '默认模板',
            children: this.defaultTemplate
          })
          this.menuList.push({
            id: '2',
            label: '自定义模板',
            children: [
              {
                id: 'diy',
                label: '+ 新增'
              }
            ]
          })
          this.menuList[1] && this.menuList[1].children && this.menuList[1].children.unshift(...arrDiy)
          console.log('第一个', this.menuList[0] && this.menuList[0].children && this.menuList[0].children[0])
          if (this.menuList[0] && this.menuList[0].children && this.menuList[0].children[0]) {
             this.changeTree(this.menuList[0].children[0])
          }
        } else {
          this.$message.error(message)
        }
      })
    },
    saveQuestionnaire() {
      const params = {
        projectId: this.$route.query.projectId || this.projectId,
        questionnaireName: this.templateForm.questionnaireName
      }
      console.log('参数', params)
      saveQuestionnaire(params).then(res => {
        this.loading = false
        const { success, data, message } = res
        if (success && data) {
          this.templateVisible = false
          this.getQuestionTemplate()
        } else {
          this.$message.error(message)
        }
      })
    },
    changeTree(item) {
      console.log('选中', item, JSON.stringify(item))
      this.$nextTick(() => {
        this.defaultTemplate && this.defaultTemplate.filter((a, index) => {
          console.log(a)
          if (a.id === item.id) {
            document.getElementsByClassName('el-tree-node__children')[0].getElementsByClassName('el-tree-node')[index].setAttribute('class', 'el-tree-node is-expanded is-current is-focusable')
            if (index !== 0) {
              document.getElementsByClassName('el-tree-node__children')[0].getElementsByClassName('el-tree-node')[0].setAttribute('class', 'el-tree-node is-expanded is-focusable')
            }
          }
        })
      })
      if (item.id === 'diy') {
        this.templateVisible = true
      } else {
        this.$emit('refreshList', item.id, item.questionnaireType)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.tabs {
  //   ::v-deep .el-tabs__header {
  //     border-bottom: 1px solid #dfdada;
  //   }
  ::v-deep .el-tabs__nav-wrap {
    padding: 0 16px;
  }
}
</style>
