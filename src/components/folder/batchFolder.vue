<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    lock-scroll
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
import { getFolderList, addFolderFileBatch, deleteFolderFileBatch } from '@/api/common'
export default {
  props: {
    // 文件夹类型
    companyFolderType: {
      type: Number,
      required: true
    },
    // 需批量处理的数据源
    checkedList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      type: '', // 操作类别
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
    edit(type) {
      this.type = type;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataTree.setCheckedNodes([]);
      });
    },
    // 点击提交按钮
    handleSubmit() {
      let para = {};
      switch (this.type) {
        // 批量加入文件夹
        case 1:
          para = {};
          para.fileIds = this.checkedList;
          para.folderIds = this.$refs.dataTree.getCheckedKeys();
          addFolderFileBatch(para).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true
            });
            this.$emit('ok');
            this.handleClose();
          });
          break;
        // 批量移出文件夹
        case 2:
          para = {};
          para.fileIds = this.checkedList;
          para.folderIds = this.$refs.dataTree.getCheckedKeys();
          deleteFolderFileBatch(para).then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true
            });
            this.$emit('ok');
            this.handleClose();
          });
          break;
      }
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
