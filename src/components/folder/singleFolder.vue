<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    lock-scroll
    append-to-body
    @close="handleClose"
  >
    <div style="padding: 0 20px 20px;">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        prefix-icon="el-icon-search"
        size="small"
        clearable
      >
      </el-input>
    </div>
    <el-tree
      ref="dataTree"
      class="data-tree"
      :props="{ label: 'name' }"
      node-key="id"
      :load="loadNode"
      lazy
      show-checkbox
      check-strictly
      :expand-on-click-node="false"
      check-on-click-node
      highlight-current
      default-expand-all
      :filter-node-method="filterNode"
    />
    <span slot="footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" style="margin-left: 15px;" size="small" @click="handleSubmit">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFolderList, getFolderByFileId, addFolderFileBatch } from '@/api/common'
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
      title: '操作',
      visible: false,
      rowData: {},
      filterText: ''
    };
  },
  watch: {
    filterText(val) {
      this.$refs.dataTree.filter(val);
    }
  },
  created() {},
  methods: {
    // 树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 树加载节点
    loadNode(node, resolve) {
      const para = {};
      para.companyFolderType = this.companyFolderType;
      para.parentId = node.data ? node.data.id : '';
      para.type = 1;
      para.isUsed = false;
      getFolderList(para).then(data => {
        return resolve(data.data);
      });
    },
    // 树组件赋值
    edit(row) {
      const para = Object.assign({}, row);
      para.companyFolderType = this.companyFolderType;
      getFolderByFileId(para).then(data => {
        this.visible = true;
        this.rowData = row;
        this.$nextTick(() => {
          this.$refs.dataTree.setCheckedKeys(data.data);
        });
      });
    },
    // 点击提交按钮
    handleSubmit() {
      const para = {};
      para.fileIds = [this.rowData.fileId];
      para.folderIds = this.$refs.dataTree.getCheckedKeys();
      addFolderFileBatch(para).then(data => {
        this.$message({
          message: '操作成功',
          type: 'success',
          showClose: true,
          center: true
        });
        this.handleClose();
      });
    },
    // 关闭模态框
    handleClose() {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .el-tree__empty-block{
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
</style>
