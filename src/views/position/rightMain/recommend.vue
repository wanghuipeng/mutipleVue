<template>
  <div class="wrap">
    <!-- 职位列表 -->
    <div v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-title">
          <img v-if="item.assignType === 2" src="@/assets/images/login/ai-icon.png" class="avatar" />
          <img v-else-if="item.avatarUrlImg" :src="item.avatarUrlImg" class="avatar" />
          <img v-else src="~@/assets/images/common/avatar.png" class="avatar" />
          <span v-if="item.assignType === 2" class="name">大猎小AI</span>
          <span v-else class="name">{{ item.nickName }}</span>
          <span class="des">根据您的擅长方向向您推荐</span>
          <span class="date">{{ item.assignDate }}</span>
        </div>
        <div class="item-body">
          <el-popover placement="bottom-end" trigger="click">
            <div
              v-for="(refuseExplainItem, refuseExplainIndex) in dictData.dicts.refuseExplain"
              :key="refuseExplainIndex"
              class="item"
              @click="handleChangeStatus(item.assignId, refuseExplainItem.label)"
            >
              <el-button type="text">{{ refuseExplainItem.label }}</el-button>
            </div>
            <span slot="reference" class="close-icon">
              <i class="icon iconfont icon-zhiwei-zhinengtuijian" />
            </span>
          </el-popover>
          <position-item :position-info="item" @lookDetail="lookDetail" />
        </div>
      </div>
    </div>
    <!-- 列表为空 -->
    <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
      <img src="@/assets/images/position/psition_empty.png" />
      <p>
        暂时没有找到适合您的职位
        <br />您可以联系PM进行派单
      </p>
      <el-button class="confirm-btn" @click="sendMsg">联系TA</el-button>
    </div>
    <!-- 列表分页 -->
    <div
      v-if="dataTableObj.total && dataTableObj.total > dataTableObj.list.length"
      class="page-area"
    >
      <el-pagination
        ref="listPage"
        class="list-page"
        layout="prev, pager, next"
        :current-page="dataTableObj.currPage"
        :page-size="dataTableObj.pageSize"
        :total="dataTableObj.total"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 职位详情 -->
    <drawer-common
      :drawer.sync="positionDetailVisible"
      :router="'positionDetail?positionId=' + positionId"
    >
      <position-detail slot="inner-body" :is-new-window="false" :position-id="positionId" />
    </drawer-common>
    <!-- 聊天 -->
    <dialog-chat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TableMixin } from '@/mixins/position'
import positionItem from '../common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
import dialogChat from '@/components/common/dialogChat.vue'
import {
  getPositionAssignRecordList,
  refusePositionAssignRecord
} from '@/api/position'
export default {
  components: {
    positionItem,
    drawerCommon,
    positionDetail,
    dialogChat
  },
  mixins: [TableMixin],
  data() {
    return {
      // 聊天对话框是否显示
      dialogVisible: false,
      // 查询条件
      queryForm: {}
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    document.title = '智能派单-大猎英才'
  },
  methods: {
    // 不合适
    handleChangeStatus(id, code) {
      const para = {}
      para.assignId = id
      para.refuseExplain = code
      refusePositionAssignRecord(para).then(res => {
        this.searchList()
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      getPositionAssignRecordList(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
      })
    },
    // 联系TA
    sendMsg() {
      this.$store
        .dispatch(
          'checkoutConversation',
          `C2C${this.$store.state.userInfo.cwUserId}`
        )
        .then(() => {
          this.dialogVisible = true
          const textMsg = this.tim.createTextMessage({
            to: this.toAccount,
            conversationType: this.currentConversationType,
            payload: {
              text:
                '您好，平台智能派单没有适合我的职位，您可以给我推荐一些职位吗？'
            }
          })
          setTimeout(() => {
            this.$store.commit('pushCurrentMessageList', textMsg)
            this.tim.sendMessage(textMsg).catch(error => {
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          }, 0)
        })
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .list-area {
    .list-item {
      .item-title {
        width: 100%;
        height: 32px;
        line-height: 32px;
        margin-bottom: 12px;
        .avatar {
          display: block;
          width: 32px;
          height: 32px;
          margin-right: 12px;
          float: left;
        }
        .name {
          font-size: 18px;
          color: #4d4d4dff;
          margin-right: 12px;
        }
        .des {
          font-size: 14px;
          color: #808080ff;
          margin-right: 12px;
        }
        .date {
          font-size: 14px;
          color: #808080ff;
        }
      }
      .item-body {
        .close-icon {
          color: #4d4d4dff;
          cursor: pointer;
          position: absolute;
          right: 20px;
          top: 20px;
          z-index: 10;
        }
      }
    }
  }
}
</style>

