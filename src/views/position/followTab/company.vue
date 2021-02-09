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
                  <img v-if="item.logoImg" :src="item.logoImg" class="avatar" />
                  <img v-else src="~@/assets/images/common/company_avatar.png" class="avatar" />
                  <div class="info">
                    <p class="name">
                      <span class="ellipsis">{{ item.companyName }}</span>
                      <el-button class="confirm-btn" @click="handleFollow(item.companyId)">已关注</el-button>
                    </p>
                    <span
                      class="des"
                    >{{ item.companyIndustrys1 | filterCommonDict(dictData.industry) }}</span>
                  </div>
                </div>
                <p class="detail">{{ item.introduce }}</p>
              </div>
              <div class="panel-footer">
                <el-button
                  class="cancel-btn"
                  @click="toCompanyDetail(`/companyDetail?tab=companyDescription&companyId=${item.companyId}`)"
                >详细资料</el-button>
                <el-button
                  class="cancel-btn"
                  @click="toCompanyDetail(`/companyDetail?tab=onMovePosition&companyId=${item.companyId}`)"
                >职位（{{ item.positionCount }}）</el-button>
              </div>
            </div>
            <div slot="reference" class="main-area">
              <img v-if="item.logoImg" :src="item.logoImg" class="avatar" />
              <img v-else src="~@/assets/images/common/company_avatar.png" class="avatar" />
              <div class="info">
                <p class="main">
                  <span class="name">{{ item.companyName }}</span>
                  <span class="tag">雇主</span>
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
      <p>暂⽆关注职位/关注企业动态</p>
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
  </div>
</template>

<script>
import { TableMixin } from '@/mixins/position'
import positionItem from '../common/positionItem'
import drawerCommon from '@/components/common/drawerCommon'
import positionDetail from '../positionDetail'
import {
  getPositionFollowCompanyList,
  deleteUserFollowCompany
} from '@/api/position'
export default {
  components: {
    positionItem,
    drawerCommon,
    positionDetail
  },
  mixins: [TableMixin],
  data() {
    return {
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
    // 跳转公司详情页
    toCompanyDetail(url) {
      window.open(url)
    },
    // 取消关注
    handleFollow(id) {
      const para = {}
      para.dataId = id
      deleteUserFollowCompany(para).then(res => {
        this.searchList()
      })
    },
    // 查询职位列表
    searchList() {
      this.loading = true
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = this.dataTableObj.currPage
      para.pageSize = this.dataTableObj.pageSize
      getPositionFollowCompanyList(para).then(res => {
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

