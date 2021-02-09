<template>
  <div class="order">
    <div class="header">
      <p class="title">订单</p>
      <img class="close" src="../../../../assets/images/notice/close.png" @click="close" />
      <el-input
        v-model="search"
        placeholder="搜索订单"
        @input="searchOrder"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <ul class="list">
      <li v-for="item in orderData" :key="item.id" class="list-item" @click="openNewPage(item)">
        <div class="list-item-top">
          <p class="name">{{ item.jobhunterName }}</p>
          <p class="desc">{{ item.companyName }}<span v-if="item.positionName" />{{ item.positionName }}</p>
        </div>
        <div class="list-item-bottom">
          <p class="id">{{ item.id }}</p>
          <p class="btn" @click.stop="sendOrder(item)">发 送</p>
        </div>
      </li>
    </ul>

    <!-- 分页 -->
    <div v-if="total > 0" class="page">
      <el-pagination
        small
        background
        :pager-count="5"
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
import { mapGetters } from 'vuex'
import { orderList, reportName } from '@/api/TIM/index'
export default {
  data() {
    return {
      search: '', // 搜索条件
      total: 0, // 总条数
      pageNumber: 1, // 页码
      pageSize: 8, // 每页条数
      orderData: [] // 订单列表
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType'])
  },
  created() {
    this.getOrderList()
  },
  methods: {
    close() {
      this.$store.commit('updateShowOrder', false)
    },
    searchOrder() {
      this.pageNumber = 1
      this.getOrderList()
    },
    getOrderList() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchName: this.search
      }
      orderList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.orderData = data.records
          this.total = data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getOrderList()
    },
    openNewPage(order) {
      window.open(`/orderDetail?orderId=${order.id}`)
    },
    async sendOrder(order) {
      let title = ''
      await reportName({ id: order.id }).then(res => {
        const { code, data } = res
        if (code === '000000') {
          title = data.reportTitle ? data.reportTitle : ''
        }
      })
      const data = {
        type: 'order',
        orderId: order.id,
        positionName: order.positionName,
        company: order.companyName,
        candidateName: order.jobhunterName,
        candidateAvatar: order.jobhunterAvatarUrl,
        reportName: title,
        desc: ''
      }
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: JSON.stringify(data),
          description: '',
          extension: ''
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .header {
    height: 105px;
    background: #F2F2F2;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    .title {
      font-size: 20px;
      line-height: 33px;
      color: #4d4d4d;
      padding-top: 15px;
    }
    .close {
      width: 16px;
      height: 16px;
      cursor: pointer;
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .el-input {
      width: 100%;
      border-radius: 50%;
      padding: 12px 0;
      ::v-deep .el-input__inner {
        height: 32px;
        border: 0;
        border-radius: 16px;
      }
      ::v-deep input::placeholder {
        color: #DADADA;
      }
      .el-icon-search:before {
        color: #DADADA;
      }
    }
  }
  .list {
    flex: 1;
    overflow-y: auto;
    .list-item {
      height: 73px;
      padding: 12px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #E5E5E5;
      &:last-child {
        border: none;
      }
      .list-item-top, .list-item-bottom {
        display: flex;
        flex-direction: row;
        p {
          font-size: 14px;
          color: #4d4d4d;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name {
          margin-right: 16px;
        }
        .desc {
          max-width: 118px;
          color: #999999;
          span {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #B2B2B2;
            margin: 0 4px;
          }
        }
        .id {
          color: #4B4B4B;
        }
        .btn {
          width: 60px;
          height: 22px;
          text-align: center;
          line-height: 20px;
          color: #1678F9;
          border: 1px solid #1678F9;
          border-radius: 12px;
          box-sizing: border-box;
          cursor: pointer;
        }
      }
      .list-item-top {
        margin-bottom: 6px;
      }
      .list-item-bottom {
        justify-content: space-between;
      }
    }
  }
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 59px;
    border-top: 1px solid #E5E5E5;
    .el-pagination {
      max-width: 240px;
      box-sizing: border-box;
      ::v-deep .el-pager li, ::v-deep .btn-prev, ::v-deep .btn-next {
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
      }
      ::v-deep li.more::before {
        line-height: 16px;
      }
    }
  }
}
</style>
