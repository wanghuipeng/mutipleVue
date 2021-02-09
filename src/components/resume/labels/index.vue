<template>
  <div class="folder">
    <div class="folder-item">
      <div class="item-title">
        <i class="title-icon icon iconfont icon-biaoqian"/>
        <p class="title-text">标签</p>
        <i class="title-btn icon iconfont icon-jiahao" @click="addNode(null, null)"/>
      </div>
      <el-tree
        v-if="isRouterShow"
        ref="intellectTree"
        :key="intellectTreeKey"
        class="item-tree"
        :props="treeProps"
        lazy
        node-key="labelId"
        :load="intellectLoadNode"
        :expand-on-click-node="false"
        highlight-current
        :default-expand-all="false"
      >
        <span slot-scope="{ node, data }" class="data-tree-tool-bar">
          <p class="tool-bar-left" @click="handleNodeClick(data)">
            <span class="left-name" :title="node.label">{{ node.label }}</span>
            <span class="left-num">{{ data.counts || 0 }}</span>
          </p>
          <p class="tool-bar-right">
            <el-popover width="80" placement="bottom-end" trigger="click">
              <div class="item">
                <el-link
                  :underline="false"
                  style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                  @click="modifyNode(node, data)"
                >修改</el-link>
              </div>
              <div class="item">
                <el-link
                  :underline="false"
                  style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                  @click="delNode(node, data)"
                >删除</el-link>
              </div>
              <i slot="reference" class="icon iconfont icon-zhiwei-quanbuzhiwei15" />
            </el-popover>
          </p>
        </span>
      </el-tree>
    </div>

    <!-- 编辑标签 -->
    <el-dialog
      v-if="tagsDialogVisible"
      :title="labelTitle"
      :visible.sync="tagsDialogVisible"
      width="30%"
      lock-scroll
      append-to-body
    >
      <el-form ref="tagsForm" :model="tagsForm" :rules="tagsRules" size="small" label-width="100px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="tagsForm.tagName" placeholder="请输入标签名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="tagsDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveTags('tagsForm')">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 删除标签 -->
    <el-dialog
      title="提示"
      :visible.sync="tagsDialogDel"
      width="30%"
    >
      <span>确认移除该标签</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="tagsDialogDel = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delTag">删 除</el-button>
      </span>
    </el-dialog>

    <!-- 打标签 -->
    <el-dialog
      append-to-body
      :visible.sync="setLabelVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
      class="visitor-detail-modal"
      @close="closeItLabel"
    >
      <div v-loading="loadingForm" class="visitor-detail">
        <div class="resume-link">
          <p class="left">
            <span class="label-title">添加简历标签</span>
          </p>
        </div>
        <div class="label-panel">
          <template v-if="labelOptions1 && labelOptions1.length > 0">
            <p class="title">自定义标签</p>
            <div v-for="(item,index) in labelOptions1" :key="'info2-'+index" class="item">
              <div v-if="loading2" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem2(itemInner)"
                >
                  {{ itemInner.labelName }}
                  <i
                    title="编辑自定义标签"
                    class="el-icon-edit-outline"
                    @click.stop="editLabel(itemInner)"
                  ></i>
                </span>
                <span class="add-icon" @click="addLabels">
                  <i class="el-icon-plus"></i>添加
                </span>
              </div>
              <div v-if="inputVisible" class="label-input">
                <el-input v-model="labelInput" size="small" placeholder="请输入标签名称"></el-input>
                <span v-if="labelInput" class="del" @click="closeInput1">删除</span>
                <span v-else class="del" @click="()=>{inputVisible = false}">删除</span>
                <span class="add" @click="checkInput1">保存</span>
              </div>
            </div>
          </template>
          <template v-if="labelOptions2 && labelOptions2.length > 0">
            <div v-for="(item,index) in labelOptions2" :key="'info1-'+index" class="item item-comp">
              <p class="title">{{ item.userLabelPoolGroup }}</p>
              <div v-if="loading1" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem1(itemInner.id)"
                >{{ itemInner.labelName }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeItLabel">取 消</el-button>
        <el-button size="small" type="primary" @click="checkLabels(2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addFolder, editFolder, editFolderUsed } from '@/api/common'
import { getResumeLabelBatch, addResumeLabelBatch } from '@/api/resume'
import { mapState } from 'vuex';
import { editTalentLabelPool, deleteTalentLabelPool } from '@/api/set/talentPool'
import { editUserLabelPoolOfUser, deleteUserLabelPoolOfUser, getUserAppLabelList, addUserLabelPoolOfUser } from '@/api/thread'

export default {
  props: {
    // 标签类型
    resumeLabelsType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      commonTreeKey: new Date().getTime(), // 常用树重新渲染key值
      intellectTreeKey: new Date().getTime(), // 智能树重新渲染key值
      currentNode: null, // 树编辑时记录当前被选中的节点
      // 树字段映射关系
      treeProps: {
        label: 'labelName'
      },
      dataTreeEditTitle: '', // 树编辑模态框标题
      tagsDialogVisible: false, // 树编辑模态框显示隐藏控制属性
      // 编辑表单
      dataTreeEditForm: {
        id: '',
        parentId: '',
        isLeaf: '',
        name: '',
        remark: '',
        type: ''
      },
      // 编辑表单校验规则
      dataTreeEditFormRules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择标签类型', trigger: 'change' }]
      },
      tagsForm: {
        tagName: ''
      },
      tagsRules: {
        tagName: [
          { required: true, message: '请输入标签组名称', trigger: 'blur' }
        ]
      },
      tagsDialogDel: false,
      labelTitle: '',
      labelType: null, // 标签类型（1是企业标签，2是个人标签）
      setLabelVisible: false,
      labelOptions1: [],
      inputVisible: false,
      labelInput: null,
      labelOptions2: [],
      loading1: true,
      loading2: true,
      labelText: [],
      resumeLabels: [],
      ids1: [],
      ids2: [],
      labelIds: [],
      userLabelId: null,
      id: null,
      isRouterShow: true,
      checkIconVisible: false,
      loadingForm: false
    };
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo,
      companyId: state => state.userInfo.companyId
    })
  },
  mounted() {
    const folderDataJob = JSON.parse(sessionStorage.getItem('folderDataJob'))
    if (folderDataJob && folderDataJob.id && this.$route.name === 'job') {
      this.handleNodeClick(folderDataJob)
    }
    const folderDataResume = JSON.parse(sessionStorage.getItem('folderDataResume'))
    if (folderDataResume && folderDataResume.id && this.$route.name === 'resume') {
      this.handleNodeClick(folderDataResume)
    }
  },
  destroyed() {
    if (sessionStorage.getItem('clearSession') - 0 === 1) {
      sessionStorage.removeItem('folderDataJob')
      sessionStorage.removeItem('folderDataResume')
      sessionStorage.setItem('clearSession', 0)
    } else {
      sessionStorage.setItem('clearSession', 1)
    }
    // sessionStorage.clear()
  },
  methods: {
    async reloadComponent() {
      this.isRouterShow = false
      await this.$nextTick()
      this.isRouterShow = true
    },
    addUserLabelPoolOfUser1() {
      const { labelInput: labelName } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2
      }
      addUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    checkLabels(flag) {
      if (flag === 1) {
        const labelOptions1 = JSON.parse(localStorage.getItem('labelOptions1'))

        const labelOptions2 = JSON.parse(localStorage.getItem('labelOptions2'))
        //
        labelOptions1 &&
          labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 2 })
            })
          })
        labelOptions2 &&
          labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 1 })
            })
          })
        this.addResumeLabelBatch()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
        this.$emit('refreshListInner')
        // this.$refs.intellectTree.intellectLoadNode()
      } else if (flag === 2) {
        //
        this.labelOptions1 &&
          this.labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 2 })
            })
          })
        this.labelOptions2 &&
          this.labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active &&
                this.labelIds.push({ id: itemInner.id, labelType: 1 })
            })
          })
        //

        this.addResumeLabelBatch()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
        this.$emit('refreshListInner')
        // this.$refs.intellectTree.intellectLoadNode()
      }
    },
     addResumeLabelBatch() {
      this.labelIds.filter(item => {
        item.labelId = item.id
        delete item.id
      })
      const params = {
        labels: this.labelIds,
        resumeIds: [sessionStorage.getItem('resumeId')]
      }
      addResumeLabelBatch(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.reloadComponent()
          localStorage.removeItem('ids1')
          localStorage.removeItem('ids2')
          this.ids1 = []
          this.ids2 = []
          this.labelIds = []
        }
      })
    },
    checkItem1(id) {
      this.loading1 = false
      //
      this.labelOptions2 &&
        this.labelOptions2.filter((item, index) => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === id) {
              item.userLabelPools.filter(itemItem => {
                if (itemItem.id === id && !itemItem.active) {
                  itemItem.active = true
                } else {
                  itemItem.active = false
                }
              })
            }
          })
        })
      //
      this.loading1 = true
    },
    checkInput1() {
      let or = false
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.labelName === this.labelInput) {
              or = true
            }
          })
        })
      if (this.labelInput && this.labelInput.length > 10) {
        this.$message({
          message: '标签名最大长度为10',
          type: 'warning'
        })
      } else if (!this.labelInput) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
      } else {
        if (this.userLabelId) {
          this.loading2 = false
          this.editUserLabelPoolOfUser1()
          this.loading2 = true
        } else {
          if (or) {
            this.$message({
              message: '标签名已存在，不能重复添加',
              type: 'warning'
            })
          } else {
            this.loading2 = false
            this.addUserLabelPoolOfUser1()
            this.loading2 = true
          }
        }
      }
    },
    addLabels() {
      this.labelInput = null
      this.inputVisible = true
      this.checkIconVisible = true
    },
    closeInput1() {
      this.inputVisible = false
      this.deleteUserLabelPoolOfUser()
    },
    editLabel(itemData) {
      console.log(itemData)
      this.id = itemData.id
      this.userLabelId = itemData.id
      this.labelInput = itemData.labelName
      this.inputVisible = true
      this.checkIconVisible = false
    },
    checkItem2(itemData) {
      this.loading2 = false
      //
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === itemData.id) {
              itemInner.active = !itemInner.active
            }
          })
        })
      this.ids2.push(itemData.id)
      //

      this.loading2 = true
    },
    closeIt() {
      this.visitorDetailVisible = false
      this.footerVisible = false
    },
    closeItLabel() {
      this.setLabelVisible = false
      this.labelInput = null
      this.inputVisible = false
      this.footerVisible = false
    },
    delTag() {},
    // 树加载节点
    loadNode(node, resolve, isUsed) {
      const para = {};
      getResumeLabelBatch(para).then(data => {
        const temp = data.data
        temp.filter(item => {
          item.labelType = item.type
        })
        this.resumeLabels = temp
        console.log('已存在标签', this.resumeLabels)
        return resolve && resolve(data.data);
      });
    },
    // 智能树加载节点
    intellectLoadNode(node, resolve) {
      this.loadNode(node, resolve, false);
    },
    // 树点击节点
    handleNodeClick(data) {
      console.log(data)
      this.$emit('select', data);
    },
    // 设为常用
    setUsed(node, data) {
      const para = {};
      para.folderId = data.id;
      para.isUsed = true;
      editFolderUsed(para).then(data => {
        this.$message({
          message: '操作成功',
          type: 'success',
          showClose: true,
          center: true
        });
        this.commonTreeKey = new Date().getTime();
      });
    },
    // 取消常用
    cancelUsed(node, data) {
      const para = {};
      para.folderId = data.id;
      para.isUsed = false;
      editFolderUsed(para).then(data => {
        this.$message({
          message: '操作成功',
          type: 'success',
          showClose: true,
          center: true
        });
        this.commonTreeKey = new Date().getTime();
      });
    },
    getUserAppLabelList() {
      this.loadingForm = true
      const params = {}
      getUserAppLabelList(params).then(res => {
        this.loadingForm = false
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.filter(item => {
              if (item.userLabelPoolGroup === '个人标签') {
                this.labelOptions1.push(item)
              } else {
                this.labelOptions2.push(item)
              }
            })
          this.labelOptions1 &&
            this.labelOptions1.filter(item => {
              item.userLabelPools && item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a.labelName) {
                    b.active = true
                  }
                })
              })
            })

          this.labelOptions2 &&
            this.labelOptions2.filter(item => {
              item.userLabelPools && item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a.labelName) {
                    b.active = true
                  }
                })
              })
            })

            console.log(this.labelOptions1, this.labelOptions2)
        }
      })
    },
    // 树新增节点
    addNode() {
      this.labelText = this.resumeLabels
      this.labelOptions1 = []
      this.labelOptions2 = []
      this.getUserAppLabelList()
      this.setLabelVisible = true;
    },
    // 编辑标签
    modifyNode(node, data) {
      this.tagsForm = data
      console.log('编辑标签', data)
      this.$set(this.tagsForm, 'tagName', data.labelName)
      this.$set(this.tagsForm, 'id', data.labelId)
      this.labelType = data.type
      if (data.type === 1) {
        this.labelTitle = '编辑企业标签'
      } else if (data.type === 2) {
        this.labelTitle = '编辑个人标签'
      }
      this.tagsDialogVisible = true
    },
    // 保存标签
    saveTags(formName) {
      console.log('标签类型', this.labelType)
      const params = {}
      if (this.labelType === 1) { // 编辑企业标签
        this.$refs[formName].validate((valid) => {
          if (valid) {
              params.labelName = this.tagsForm.tagName
              params.id = this.tagsForm.id
              console.log(params)
              editTalentLabelPool(params).then(data => {
                this.tagsDialogVisible = false
                if (data.success) {
                  const obj = {
                    labelId: this.tagsForm.id,
                    labelName: this.tagsForm.tagName
                  }
                  delete this.tagsForm.id
                  this.$set(this.tagsForm, 'labelName', this.tagsForm.tagName)
                  delete this.tagsForm.tagName
                  console.log('企业标签', this.tagsForm)
                  // 刷新简历列表
                  this.$emit('select', obj)
                  this.currentNode.data = Object.assign({}, this.tagsForm);
                  this.$message.success({
                    message: '保存成功',
                    duration: 1500
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else if (this.labelType === 2) { // 编辑个人标签
        this.editUserLabelPoolOfUser()
      }
    },
    editUserLabelPoolOfUser1() {
      const { labelInput: labelName, id } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2,
        id
      }
      editUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.userLabelId = null
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    addUserLabelPoolOfUser() {
      const { labelInput: labelName } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2
      }
      addUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    // 编辑个人标签
    editUserLabelPoolOfUser() {
      this.loadingForm = true
      const params = {
        labelName: this.tagsForm.tagName,
        id: this.tagsForm.id
      }
      editUserLabelPoolOfUser(params).then(data => {
        this.loadingForm = false
        this.tagsDialogVisible = false
        if (data.success) {
          const obj = {
            labelId: this.tagsForm.id,
            labelName: this.tagsForm.tagName
          }
          delete this.tagsForm.id
          this.$set(this.tagsForm, 'labelName', this.tagsForm.tagName)
          delete this.tagsForm.tagName
          console.log('个人标签', this.tagsForm, obj)
          // 刷新简历列表
          this.$emit('select', obj)
          this.currentNode.data = Object.assign({}, this.tagsForm);
          this.$message.success({
            message: '保存成功',
            duration: 1500
          })
        }
      })
    },
    // 树删除节点
    delNode(node, data) {
      this.tagsForm.id = data.labelId
      this.labelType = data.type
      this.$confirm('确认移除该标签？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {};
          if (this.labelType === 1) { // 删除企业标签
            para.labelId = this.tagsForm.id;
            deleteTalentLabelPool(para).then(res => {
              if (res.success) {
               this.$message({
                message: '操作成功',
                type: 'success',
                showClose: true,
                center: true
              })
              this.$refs.intellectTree.remove(node);
              // 刷新简历列表
              this.$emit('select')
              this.commonTreeKey = new Date().getTime();
              }
            });
          } else if (this.labelType === 2) { // 删除个人标签
            para.userLabelId = this.tagsForm.id;
            deleteUserLabelPoolOfUser(para).then(res => {
              if (res.success) {
               this.$message({
                message: '操作成功',
                type: 'success',
                showClose: true,
                center: true
              })
              this.$refs.intellectTree.remove(node);
              // 刷新简历列表
              this.$emit('select')
              this.commonTreeKey = new Date().getTime();
              }
            });
          }
        })
        .catch(() => {});
    },
    deleteUserLabelPoolOfUser() {
      this.loadingForm = true
      const { userLabelId } = this
      const params = {
        userLabelId
      }
      userLabelId &&
        deleteUserLabelPoolOfUser(params).then(res => {
          this.loadingForm = false
          const { code } = res
          if (code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.labelOptions1 = []
            this.labelOptions2 = []
            this.labelInput = null
            this.inputVisible = false
            this.userLabelId = null
            this.getUserAppLabelList()
          }
        })
    },
    // 点击提交按钮
    submitDataTreeEditForm() {
      this.$refs.dataTreeEditForm.validate(valid => {
        if (valid) {
          if (!this.dataTreeEditForm.id) { // 新增
            const para = Object.assign({}, this.dataTreeEditForm);
            para.companyFolderType = this.companyFolderType;
            addFolder(para).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                showClose: true,
                center: true
              });
              this.tagsDialogVisible = false;
              if (!data.data.parentId) {
                this.intellectTreeKey = new Date().getTime();
              } else {
                this.$refs.intellectTree.append(data.data, this.currentNode);
              }
              this.commonTreeKey = new Date().getTime();
            });
          } else { // 修改
            const para = Object.assign({}, this.dataTreeEditForm);
            para.companyFolderType = this.companyFolderType;
            editFolder(para).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                showClose: true,
                center: true
              });
              this.tagsDialogVisible = false;
              this.currentNode.data = Object.assign({}, this.dataTreeEditForm);
              this.commonTreeKey = new Date().getTime();
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.folder{
  padding: 10px 0;
  background-color: #fff;
  .icon-biaoqian:before {
    content: "";
    background: url('~@/assets/images/resume/label.png') no-repeat;
    background-size: 18px;
    width: 16px;
    height: 19px;
    display: inline-block;
  }
  .folder-item{
    margin-bottom: 5px;
    padding: 0;
    .item-title{
      display: flex;
      height: 36px;
      padding-right: 22px;
      padding-left: 10px;
      justify-content: space-between;
      align-items: center;
      .title-icon{
        flex: none;
        font-size: 20px;
        color: #0D121A;
      }
      .title-text{
        flex: auto;
        padding: 0 12px;
        font-size: 14px;
        font-weight: bold;
        color: #0D121A;
      }
      .title-btn{
        flex: none;
        font-size: 22px;
        color: #0D121A;
        cursor: pointer;
      }
    }
    .item-tree{
      color: #595F66;
      ::v-deep .el-tree-node__content{
        height: 36px;
      }
      ::v-deep .el-tree-node__expand-icon {
        visibility: hidden;
        font-size: 20px;
        color: #999;
        &.is-leaf{
          color: transparent;
        }
      }
      ::v-deep .el-tree__empty-block{
        padding: 0 10px;
        box-sizing: border-box;
        height: auto;
        min-height: 0;
        text-align: left;
        text-indent: 10px;
        .el-tree__empty-text{
          position: static;
          font-style: italic;
          font-size: 12px;
        }
      }
      ::v-deep .el-tree-node>.el-tree-node__children{
        overflow: auto;
      }
      ::v-deep .el-tree-node.is-current>.el-tree-node__content{
         background-color: transparent;
      }
      .data-tree-tool-bar {
        width: calc(100% - 32px);
        padding-left: 10px;
        height: 100%;
        line-height: 36px;
        &:hover{
          .tool-bar-right{
            visibility: visible;
          }
        }
        .tool-bar-left{
          width: calc(100% - 30px);
          float: left;
          .left-name{
            font-size: 14px;
            float: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 30px);
          }
          .left-num{
            font-size: 12px;
            float: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 30px;
          }
        }
        .tool-bar-right{
          width: 30px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          visibility: hidden;
          float: right;
          .icon{
            display: block;
            width: 30px;
            height: 36px;
          }
        }
      }
    }
  }
}
</style>
