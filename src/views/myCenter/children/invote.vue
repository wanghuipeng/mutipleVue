<template>
  <div class="invote-page child-view">
    <div class="banner">
      <p>邀请好友</p>
      <!-- <div class="img"></div> -->
    </div>
    <div class="invote-table">
      <div class="tip">
        <p class="first">
          <span class="title">邀请链接</span>
          <span
            v-if="env === 'test'"
            class="link"
          >https://hh.dalie.zpstar.com/register?serialCode={{ $store.state.userInfo.serialCode }}</span>
          <span
            v-if="env === 'test'"
            class="copy"
            @click="copyCode(`https://hh.dalie.zpstar.com/register?serialCode=${$store.state.userInfo.serialCode}`)"
          >复制</span>
          <span
            v-if="env === 'prod'"
            class="link"
          >https://h.dalieyingcai.com/register?serialCode={{ $store.state.userInfo.serialCode }}</span>
          <span
            v-if="env === 'prod'"
            class="copy"
            @click="copyCode(`https://h.dalieyingcai.com/register?serialCode=${$store.state.userInfo.serialCode}`)"
          >复制</span>
        </p>
        <p class="text">这是您的专属邀请链接，您的好友通过此链接注册大猎英才后，您可以获得相应的奖励</p>
        <p class="text">
          您也可以直接把您的邀请码发送给好友直接注册
          <span class="code">{{ $store.state.userInfo.serialCode }}</span>
          <span class="copy" @click="copyCode($store.state.userInfo.serialCode)">（复制）</span>
        </p>
        <!-- 表格 -->
        <el-table v-loading="loading" border :data="tableData" style="width: 100%">
          <el-table-column prop="inviteeUserName" label="邀请记录" width="180"></el-table-column>
          <el-table-column prop="inviteeUserMobile" label="注册手机号" width="280"></el-table-column>
          <el-table-column prop="inviteTime" label="邀请注册时间"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          class="clear"
          background
          layout="prev, pager, next"
          :page-size="5"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { queryInviteRecordPage } from '@/api/myCenter'

export default {
  data() {
    return {
      pageNumber: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      env: null,
      loading: false
    }
  },
  mounted() {
    if (window.location.href.indexOf('h.dalieyingcai.com') !== -1) {
      this.env = 'prod'
    } else {
      this.env = 'test'
    }
    this.queryInviteRecordPage()
  },
  methods: {
    copyCode(data) {
      const url = data
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    queryInviteRecordPage() {
      this.loading = true
      const { pageNumber, pageSize } = this
      const params = {
        pageNumber,
        pageSize
      }
      queryInviteRecordPage(params).then(res => {
        this.loading = false
        if (res.code === '000000') {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.queryInviteRecordPage()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style  lang="scss">
.invote-page {
  background-color: #fff;
  width: 960px;
  float: right;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  .banner {
    p {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .img {
      margin-bottom: 40px;
      background: #f3f3f3;
      width: 100%;
      height: 120px;
      display: inline-block;
    }
  }
  .invote-table {
    .el-table__header-wrapper {
      border-bottom: 1px solid #eee;
    }
    .tip {
      .first {
        margin-bottom: 20px;
        .title {
          color: #333333;
          font-size: 16px;
          margin-right: 20px;
        }
        .link {
          color: #4d4d4d;
          font-size: 14px;
          margin-right: 20px;
        }
        .copy {
          color: #1678f9;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .text {
        margin-left: 84px;
        font-size: 14px;
        color: #4d4d4d;
        line-height: 24px;
        .code {
          color: #ea2b3f;
          font-size: 14px;
          margin: 0 5px 0 10px;
        }
        .copy {
          cursor: pointer;
        }
      }
    }
    .el-table {
      margin-top: 40px;
      margin-bottom: 92px;
      th,
      tr,
      td {
        background: #f9f9f9;
        text-align: center;
        font-size: 14px;
        color: #4d4d4d;
      }
    }
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-color: #eee;
  }
  .el-table th > .cell {
    color: #313131;
    font-weight: bold;
  }
  .el-pagination {
    text-align: center;
    margin-bottom: 40px;
    .btn-prev,
    .btn-next {
      width: 32px;
      height: 32px;
      line-height: 32px;
      background-color: #ededed;
      border-radius: 0;
      .el-icon {
        color: #cccccc;
        font-size: 20px;
        font-weight: normal;
      }
    }
    .btn-prev {
      background-color: #eeeeee;
    }
    .el-pager li {
      margin: 0 10px;
      width: 32px;
      font-weight: normal;
      height: 32px;
      line-height: 32px;
      color: #808080;
      font-size: 19px;
      background-color: #ededed;
      border-radius: 0;
      &.active {
        background-color: #1678f9 !important;
        color: #fff;
      }
    }
    .is-background .el-pager li.disabled {
      color: #ccc;
    }
  }
}
</style>
