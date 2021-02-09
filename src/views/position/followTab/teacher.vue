<template>
  <div class="wrap">
    <!-- 职位列表 -->
    <div v-loading="loading" class="list-area">
      <div v-for="(item, index) in dataTableObj.list" :key="index" class="list-item">
        <div class="item-title">
          <el-popover placement="bottom-start" trigger="hover">
            <div class="panel">
              <div class="panel-body">
                <div class="main">
                  <img :src="item.userLogoImg" class="avatar" />
                  <div class="info">
                    <p class="name" style="margin-top: 10px;">
                      <span class="ellipsis">{{ item.userName }}</span>
                      <el-button class="confirm-btn" @click="handleFollow(item.userId)">已关注</el-button>
                    </p>
                  </div>
                </div>
                <p class="detail">
                  <span class="phone">手机：{{ item.userMobile }}</span>
                  <span class="wechat">微信：{{ item.userWxAccount }}</span>
                </p>
              </div>
              <div class="panel-footer">
                <el-button class="cancel-btn" @click="sendMsg(item.userId)">发消息</el-button>
                <el-button
                  class="cancel-btn"
                  @click="toTeacherDetail(`/deliverDetail?tab=allPosition&userId=${item.userId}`)"
                >职位（{{ item.positionNum }}）</el-button>
              </div>
            </div>
            <div slot="reference" class="main-area">
              <img :src="item.userLogoImg" class="avatar" />
              <div class="info">
                <p class="main">
                  <span class="name">{{ item.userName }}</span>
                  <span class="tag">分析师</span>
                </p>
                <span class="des">{{ item.releaseDate }} 发布了新职位</span>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="item-body">
          <position-item :position-info="item" @lookDetail="lookDetail" />
        </div>
      </div>
    </div>
    <!-- 列表为空 -->
    <div v-show="!loading && !dataTableObj.list.length" class="empty-area">
      <img src="@/assets/images/position/psition_empty.png" />
      <p>暂⽆关注职位/关注分析师动态</p>
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
import { TableMixin } from '@/mixins/position'
import dialogChat from '@/components/common/dialogChat.vue'
import positionItem from '../common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
import { getPositionFollowCwList, deleteUserFollowCW } from '@/api/position'
export default {
  components: {
    dialogChat,
    positionItem,
    drawerCommon,
    positionDetail
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
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {},
  methods: {
    // 发消息
    sendMsg(id) {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${id}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 跳转分析师详情页
    toTeacherDetail(url) {
      window.open(url)
    },
    // 取消关注
    handleFollow(id) {
      const para = {}
      para.dataId = id
      deleteUserFollowCW(para).then(res => {
        this.searchList()
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      getPositionFollowCwList(para).then(res => {
        this.loading = false
        this.dataTableObj.total = res.data.total
        this.dataTableObj.list = res.data.records
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
        height: 46px;
        margin-bottom: 12px;
        overflow: hidden;
        .main-area {
          display: flex;
          float: left;
          .avatar {
            display: block;
            width: 46px;
            height: 46px;
            margin-right: 12px;
            cursor: pointer;
            object-fit: cover;
          }
          .info {
            flex: auto;
            .main {
              margin-bottom: 5px;
              .name {
                font-size: 16px;
                color: #323232ff;
                font-weight: 600;
                margin-right: 12px;
                vertical-align: bottom;
              }
              .tag {
                display: inline-block;
                padding: 0 3px;
                height: 20px;
                line-height: 18px;
                font-size: 12px;
                color: $main-color;
                border: 1px solid $main-color;
                border-radius: 3px;
                box-sizing: border-box;
              }
            }
            .des {
              font-size: 14px;
              color: #333333ff;
            }
          }
        }
      }
    }
  }
}
</style>

