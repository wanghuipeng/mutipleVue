<template>
  <el-dialog
    :visible.sync="dialog"
    top="8vh"
    lock-scroll
    width="81%"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div slot="title" class="title">
      <p>推荐完成</p>
      <p class="desc">
        本次共推荐{{ list.totalCount }}人，
        成功{{ list.successCount }}人，
        失败{{ list.failureCount }}人
        <el-button v-if="list.failureCount > 0" type="text" @click="downloadFailureFile">（下载推荐失败名单）</el-button>
      </p>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list.allList"
      highlight-current-row
      border
      class="table"
      style="width: 100%; max-height: 480px; overflow: auto;"
    >
      <el-table-column prop="resumeName" label="姓名" align="center" />
      <el-table-column prop="resumeMobile" label="手机号" align="center" />
      <el-table-column prop="errorMessage" label="推荐结果" align="center">
        <template slot-scope="scope">
          {{ scope.row.errorMessage ? "推荐失败" : "推荐成功" }}
        </template>
      </el-table-column>
      <el-table-column prop="errorMessage" label="失败原因" align="center" />
    </el-table>

    <div slot="footer" class="footer">
      <el-button size="mini" @click="go">继续推荐</el-button>
      <el-button type="primary" size="mini" @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getBatchResumeExcel } from '@/api/order'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    list: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listLoading: false
    }
  },
  methods: {
    // 导出失败文件
    downloadFailureFile() {
      const params = {
        batchId: this.list.batchId,
        genSuccess: false
      }
      getBatchResumeExcel(params).then(res => {
        const content = res.data; // 文件流
        const blob = new Blob([content]);
        const fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1].replace(/"/g, ''))
        console.log(fileName)
        if ('download' in document.createElement('a')) { // 非IE下载
            const link = document.createElement('a')
            link.download = fileName
            // link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(link.href) // 释放URL 对象
            document.body.removeChild(link)
        } else { // IE10+下载
          navigator.msSaveBlob(blob);
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialog', false)
      this.$emit('close')
    },
    // 继续
    go() {
      this.$emit('continues')
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  .desc {
    font-size: 12px;
    font-weight: 400;
    margin-top: 8px;
    .el-button {
      font-size: 12px;
      color: #F56C6C;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.table {
  ::v-deep .el-table__header {
    font-size: 12px;
    color: #282C32;
    font-weight: bold;
  }
  ::v-deep .el-table__body {
    font-size: 12px;
    .banner {
      width: 60px;
      height: 60px;
      object-fit: cover;
    }
  }
  ::v-deep .el-table__footer {
    font-size: 12px;
  }
}
</style>
