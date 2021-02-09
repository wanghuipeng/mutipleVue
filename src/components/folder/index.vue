<template>
  <div class="folder">
    <div class="folder-item">
      <div class="item-title">
        <i class="title-icon icon iconfont icon-bianzu7beifen"/>
        <p class="title-text">常用</p>
      </div>
      <el-tree
        ref="commonTree"
        :key="commonTreeKey"
        class="item-tree"
        :props="treeProps"
        empty-text="您可以将经常使用的文件夹添加到这里，实现快速访问"
        node-key="id"
        :load="commonLoadNode"
        lazy
        :expand-on-click-node="false"
        highlight-current
        default-expand-all
      >
        <span slot-scope="{ node, data }" class="data-tree-tool-bar">
          <p class="tool-bar-left" @click="handleNodeClick(data)">
            <span class="left-name" :title="node.label">{{ node.label }}</span>
            <span class="left-num">{{ data.number || 0 }}</span>
          </p>
          <p class="tool-bar-right">
            <el-popover v-if="node.level === 1" width="80" placement="bottom-end" trigger="click">
              <div class="item">
                <el-link
                  :underline="false"
                  style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                  @click="cancelUsed(node, data)"
                >取消常用</el-link>
              </div>
              <i slot="reference" class="icon iconfont icon-zhiwei-quanbuzhiwei15" />
            </el-popover>
          </p>
        </span>
      </el-tree>
    </div>
    <div class="folder-item">
      <div class="item-title">
        <i class="title-icon icon iconfont icon-bianzu6beifen"/>
        <p class="title-text">文件夹</p>
        <i class="title-btn icon iconfont icon-jiahao" @click="addNode(null, null)"/>
      </div>
      <el-tree
        ref="intellectTree"
        :key="intellectTreeKey"
        class="item-tree"
        :props="treeProps"
        empty-text="您可以根据自己的习惯创建文件夹，分门别类管理人才数据"
        node-key="id"
        :load="intellectLoadNode"
        lazy
        :expand-on-click-node="false"
        highlight-current
        default-expand-all
      >
        <span slot-scope="{ node, data }" class="data-tree-tool-bar">
          <p class="tool-bar-left" @click="handleNodeClick(data)">
            <span class="left-name" :title="node.label">{{ node.label }}</span>
            <span class="left-num">{{ data.number || 0 }}</span>
          </p>
          <p class="tool-bar-right">
            <el-popover width="80" placement="bottom-end" trigger="click">
              <div class="item">
                <el-link
                  :underline="false"
                  style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                  @click="setUsed(node, data)"
                >设为常用</el-link>
              </div>
              <div v-if="data.type === 1" class="item">
                <el-link
                  :underline="false"
                  style="width: 100%;padding: 10px 0;justify-content: left;font-size: 12px;"
                  @click="addNode(node, data)"
                >添加子文件夹</el-link>
              </div>
              <div style="height: 1px;background-color: #eee;margin: 5px 0;"></div>
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
    <el-dialog
      ref="dataTreeEdit"
      class="data-tree-edit"
      :title="dataTreeEditTitle"
      :visible.sync="dataTreeEditVisible"
      width="600px"
      lock-scroll
      append-to-body
    >
      <el-form
        ref="dataTreeEditForm"
        class="data-tree-edit-form"
        :model="dataTreeEditForm"
        :rules="dataTreeEditFormRules"
        label-position="top"
      >
        <el-form-item label="文件夹名称" prop="name">
          <el-input
            v-model="dataTreeEditForm.name"
            placeholder="请输入文件夹名称"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="文件夹备注" prop="remark">
          <el-input
            v-model="dataTreeEditForm.remark"
            placeholder="请输入文件夹备注"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="文件夹类型" prop="type">
          <el-radio-group v-model="dataTreeEditForm.type" :disabled="!!dataTreeEditForm.id">
            <el-radio :label="1">普通</el-radio>
            <el-radio :label="2" disabled>智能</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="data-tree-edit-footer">
        <el-button @click="dataTreeEditVisible = false">取消</el-button>
        <el-button
          type="primary"
          style="margin-left: 15px;"
          @click="submitDataTreeEditForm"
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFolderList, deleteById, addFolder, editFolder, editFolderUsed } from '@/api/common'
export default {
  props: {
    // 文件夹类型
    companyFolderType: {
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
        label: 'name'
      },
      dataTreeEditTitle: '', // 树编辑模态框标题
      dataTreeEditVisible: false, // 树编辑模态框显示隐藏控制属性
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
        name: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择文件夹类型', trigger: 'change' }]
      }
    };
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
    // 树加载节点
    loadNode(node, resolve, isUsed) {
      const para = {};
      para.companyFolderType = this.companyFolderType;
      para.isUsed = isUsed;
      para.parentId = node.data ? node.data.id : '';
      getFolderList(para).then(data => {
        return resolve(data.data);
      });
    },
    // 常用树加载节点
    commonLoadNode(node, resolve) {
      if (!node.level) {
        this.loadNode(node, resolve, true);
      } else {
        this.loadNode(node, resolve, false);
      }
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
    // 树新增节点
    addNode(node, data) {
      this.dataTreeEditVisible = true;
      this.$nextTick(() => {
        this.dataTreeEditForm = {};
        this.dataTreeEditForm.parentId = data ? data.id : '';
        this.dataTreeEditTitle = '新增文件夹';
        this.currentNode = node;
        this.$refs.dataTreeEditForm.resetFields();
      })
    },
    // 树修改节点
    modifyNode(node, data) {
      this.dataTreeEditVisible = true;
      this.$nextTick(() => {
        this.dataTreeEditForm = Object.assign({}, data);
        this.dataTreeEditTitle = '修改文件夹';
        this.currentNode = node;
      })
    },
    // 树删除节点
    delNode(node, data) {
      this.$confirm('确认删除', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {};
          para.folderId = data.id;
          deleteById(para).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true
            });
            this.$refs.intellectTree.remove(node);
            this.commonTreeKey = new Date().getTime();
          });
        })
        .catch(() => {});
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
              this.dataTreeEditVisible = false;
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
              this.dataTreeEditVisible = false;
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
