<template>
  <div class="draftList">
    <!-- 列表 -->
    <p class="title">草稿箱<span v-if="total > 0">（{{ total }}）</span></p>
    <ul v-if="listData.length > 0" class="list">
      <li v-for="(item, index) in listData" :key="index" class="list-item">
        <p class="list-item-title">{{ item.reportTitle }}</p>
        <p class="list-item-date">{{ item.createTime | filterDateTime }}</p>
        <p class="list-item-btn">
          <span @click="edit(item)">继续编辑</span>
          <span class="line"></span>
          <span @click="showDelDialog(item)">删除</span>
        </p>
      </li>
    </ul>

    <!-- 无数据 -->
    <div v-else class="blank">
      <img src="../../../assets/images/order/blank.png" />
      <p>暂无草稿记录</p>
    </div>

    <!-- 确定删除弹窗 -->
    <el-dialog
      v-if="delDialogVisible"
      title="提示"
      :visible.sync="delDialogVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <span>是否删除草稿</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delDraft">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <div v-if="total > 0" class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNumber"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { draftList, deleteDraft } from '@/api/order'
export default {
  data() {
    return {
      delDialogVisible: false,
      listData: [],
      delData: '',
      total: 0, // 总条数
      pageNumber: 1, // 第几页
      pageSize: 20 // 多少条
    }
  },
  created() {
    this.getDraftList()
  },
  methods: {
    getDraftList() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      draftList(params).then(res => {
        if (res.code === '000000') {
          this.listData = res.data.records
          this.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNgetDraftListumber = val
      this.getDraftList()
    },
    edit(data) {
      this.$router.push({
        path: '/recommendReport',
        query: {
          positionId: data.positionId,
          companyId: data.companyId,
          draftId: data.id
        }
      })
    },
    showDelDialog(data) {
      this.delDialogVisible = true
      this.delData = data
    },
    delDraft() {
      const params = {
        id: this.delData.id
      }
      deleteDraft(params).then(res => {
        if (res.code === '000000') {
          this.delDialogVisible = false
          this.getDraftList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.draftList {
  padding: 20px;
  position: relative;
  .title {
    font-size: 14px;
    color: #323232;
    line-height: 20px;
  }
  .list {
    max-height: 540px;
    overflow: auto;
    .list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 60px;
      font-size: 14px;
      color: #4d4d4d;
      line-height: 20px;
      background: #f7f7f7;
      padding: 0 20px;
      margin-top: 20px;
      box-sizing: border-box;
      .list-item-title {
        width: 240px;
        font-weight: 600;
        margin-right: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list-item-date {
        color: #999999;
      }
      .list-item-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        cursor: pointer;
        .line {
          width: 1px;
          height: 16px;
          border-left: 1px solid #4d4d4d;
          margin: 0 12px;
        }
      }
    }
  }
  .blank {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    img {
      width: 220px;
      height: 168px;
      margin-top: 200px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #b3b3b3;
      line-height: 25px;
      margin: 29px 0 20px;
    }
  }
  .page {
    text-align: center;
    margin-top: 10px;
    .el-pagination.is-background .el-pager li {
      background-color: #ededed;
    }
  }
}
</style>
