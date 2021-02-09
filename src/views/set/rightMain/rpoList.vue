<template>
  <div class="rpo-list">
    <el-card class="main" shadow="never">
      <!-- <p class="title">部门管理</p> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>招聘渠道</el-breadcrumb-item>
        <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>RPO业务配置</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="tip">
        <h4 class="mt-20">
          RPO推荐名单
          <span class="label">全局</span>
        </h4>
        <p class="mt-10">被推荐人（姓名、手机）、推荐人（姓名、邮箱）为系统必填字段，其余字段您可以自由设置</p>
      </div>

      <div class="lists">
        <div class="header">
          <span>推荐名单字段</span>
          <span>必填</span>
        </div>
        <ul v-loading="listLoading">
          <li v-for="(item,index) in listData" :key="index">
            <span>{{ item.fieldName }}</span>
            <span>
              <el-checkbox
                v-model="item.fieldRequired"
                :disabled="item.systemRequired"
                @change="checkIt(item)"
              ></el-checkbox>
            </span>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getCompanyRpoFieldList,
  updateRpoFieldRequired
} from '@/api/set/rpoList'

export default {
  data() {
    return {
      listData: [],
      listLoading: false,
      fieldCode: null,
      fieldRequired: false
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.getCompanyRpoFieldList()
  },
  methods: {
    // 列表
    getCompanyRpoFieldList() {
      this.listLoading = true
      getCompanyRpoFieldList().then(res => {
        this.listLoading = false
        const { success, message, data } = res
        if (success) {
          this.listData = data
        } else {
          this.$message.fail(message)
        }
      })
    },
    // 选择
    checkIt(item) {
      this.fieldCode = item.fieldCode
      this.fieldRequired = item.fieldRequired
      this.updateRpoFieldRequired()
    },
    // 字段设置
    updateRpoFieldRequired() {
      const { fieldCode, fieldRequired } = this
      const params = {
        fieldCode,
        fieldRequired
      }
      updateRpoFieldRequired(params).then(res => {
        const { success, message } = res
        if (success) {
          this.getCompanyRpoFieldList()
        } else {
          this.$message.fail(message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rpo-list {
  padding-left: 16px;
  .label {
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    border: 1px solid #f8a53a;
    border-radius: 2px;
    padding: 0 4px;
    display: inline-block;
    margin-left: 8px;
    vertical-align: 2px;
    font-weight: normal;
    color: #f8a53a;
    vertical-align: 1px;
  }
  .tip {
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 30px;
    color: #666;
  }
  .lists {
    width: 300px;
    border: 1px solid #ebeef5;
    .header {
      display: flex;
      span {
        display: inline-block;
        padding: 12px 10px;
        box-sizing: border-box;
        flex: 1;
        border-right: 1px solid #ebeef5;
        font-size: 12px;
        color: #909399;
        font-weight: bold;
        flex: 2;
        &:last-child {
          border-right: none;
          flex: 1;
          text-align: center;
        }
      }
    }
    ul {
      li {
        display: flex;
        &:hover {
          background-color: #f5f7fa;
          transition: background-color 0.25s ease;
        }
        span {
          border-top: 1px solid #ebeef5;
          display: inline-block;
          padding: 12px 10px;
          box-sizing: border-box;
          flex: 1;
          border-right: 1px solid #ebeef5;
          font-size: 12px;
          flex: 2;
          &:last-child {
            border-right: none;
            flex: 1;
            text-align: center;
          }
        }
      }
    }
  }
  .main {
    min-height: 100%;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #ebeef5;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .btn {
      margin: 20px 0;
    }
    .table {
      ::v-deep .el-table__header {
        font-size: 12px;
      }
      ::v-deep .el-table__body {
        font-size: 12px;
      }
      ::v-deep .el-table__footer {
        font-size: 12px;
      }
    }
  }
}
</style>
