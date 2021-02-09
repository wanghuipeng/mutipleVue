<template>
  <div class="position">
    <div class="header">
      <p class="title">职位</p>
      <img class="close" src="../../../../assets/images/notice/close.png" @click="close" />
      <el-input
        v-model="search"
        placeholder="搜索职位"
        @input="searchPosition"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <ul class="list">
      <li v-for="item in positionData" :key="item.id" class="list-item" @click="openNewPage(item)">
        <div class="list-item-top">
          <p class="name">{{ item.title }}</p>
          <p v-if="item.salaryType === 1" class="salary">
            <span v-if="item.salaryStart === item.salaryEnd">{{item.salaryStart/10000}}万/年</span>
            <span v-else>{{item.salaryStart/10000}}-{{item.salaryEnd/10000}}万/年</span>
          </p>
          <p v-else-if="item.salaryType === 2" class="salary">
            <span v-if="item.monthlySalaryRegime">{{item.salaryStart/1000}}-{{item.salaryEnd/1000}}K*{{item.monthlySalaryRegime}}薪</span>
            <span v-else>{{item.salaryStart/1000}}-{{item.salaryEnd/1000}}K/月</span>
          </p>
          <p v-else-if="item.salaryType === 3" class="salary">
            <span v-if="item.salaryStart === item.salaryEnd">{{item.salaryStart}}元/天</span>
            <span v-else>{{item.salaryStart}}-{{item.salaryEnd}}元/天</span>
          </p>
          <p v-else-if="item.salaryType === 4" class="salary">
            <span v-if="item.salaryStart === item.salaryEnd">{{item.salaryStart}}元/时</span>
            <span v-else>{{item.salaryStart}}-{{item.salaryEnd}}元/时</span>
          </p>
          <p v-else-if="item.salaryType === 5" class="salary">面议</p>
        </div>
        <div class="list-item-bottom">
          <p class="desc">{{ item.companyName }}</p>
          <p class="btn" @click.stop="sendPosition(item)">发 送</p>
        </div>
      </li>
    </ul>

    <!-- 分页 -->
    <div v-if="total > 0" class="page">
      <el-pagination
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
import { positionList } from '@/api/TIM/index'
export default {
  data() {
    return {
      search: '', // 搜索条件
      total: 0, // 总条数
      pageNumber: 1, // 页码
      pageSize: 8, // 每页条数
      positionData: [] // 职位列表
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType'])
  },
  created() {
    this.getPositionList()
  },
  methods: {
    close() {
      this.$store.commit('updateShowPosition', false)
    },
    searchPosition() {
      this.pageNumber = 1
      this.getPositionList()
    },
    getPositionList() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchName: this.search
      }
      positionList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.positionData = data.records
          this.total = data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getPositionList()
    },
    openNewPage(position) {
      window.open(`/positionDetail?positionId=${position.id}`)
    },
    sendPosition(position) {
      const data = {
        type: 'position',
        positionId: position.id,
        positionName: position.title,
        minSalary: position.salaryStart,
        maxSalary: position.salaryEnd,
        companyLogo: position.logoImg,
        company: position.companyName,
        industry1: position.industrys1,
        industry2: position.industrys2,
        phase: position.financing,
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
.position {
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
        justify-content: space-between;
        p {
          font-size: 14px;
          color: #4d4d4d;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name {
          max-width: 118px;
        }
        .salary {
          color: #EA2B3F;
        }
        .desc {
          max-width: 118px;
          color: #999999;
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
