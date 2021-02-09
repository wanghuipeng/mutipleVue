<template>
  <div class="base-info-page-other child-view">
    <div class="my-attention">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我关注的企业" name="first">
          <p class="tip">
            <span>提示</span>
            ：您关注企业以后，可以在『职位-我的关注』里看到关注企业的职位上新信息
          </p>
          <div v-if="tableDataFirst && tableDataFirst.length > 0" class="table-part">
            <el-table v-loading="loading" :data="tableDataFirst" border style="width: 100%">
              <el-table-column prop="shortName" label="公司名称" width="225px">
                <template slot-scope="scope">
                  <div
                    class="scope-first"
                    @click="windowOpen(`companyDetail?companyId=${scope.row.id}`)"
                  >
                    <img v-if="scope.row.logoImg" :src="scope.row.logoImg" />
                    <img v-else src="~@/assets/images/common/company_avatar.png" />
                    <p>{{ scope.row.shortName }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="industrys1" label="行业" width="140px">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.industrys1"
                  >{{ scope.row.industrys1 | filterCommonDict(dictData.industry) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="cityId" label="地点">
                <template
                  v-if="scope.row.cityId"
                  slot-scope="scope"
                >{{ scope.row.cityId + '' | filterLevel2(dictData.areas) }}</template>
              </el-table-column>
              <el-table-column prop="scale" label="公司规模">
                <template
                  v-if="scope.row.scale"
                  slot-scope="scope"
                >{{ scope.row.scale | filterArr(dictData.dicts.enterpriseScale) }}</template>
              </el-table-column>
              <el-table-column prop="financing" label="发展阶段">
                <template
                  slot-scope="scope"
                >{{ scope.row.financing | filterArr(dictData.dicts.financing) }}</template>
              </el-table-column>
              <el-table-column prop="recruitPositionCount" label="在招职位">
                <template slot-scope="scope">
                  <span style="color:#07BF62">{{ scope.row.recruitPositionCount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button class="no-focus" @click="noFocusCompany(scope.row.id)">不再关注</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              v-if="total1 && total1 > 20"
              background
              layout="prev, pager, next"
              :page-size="20"
              :total="total1"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
            />
          </div>
          <div v-else class="empty-page">
            <img
              style="width:240px;height:150px;"
              src="@/assets/images/myCenter/attention_empty.png"
            />
            <p>您还没有关注过任何企业</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我关注的分析师" name="second">
          <p class="tip">
            <span>提示</span>
            ：您关注分析师以后，可以在【职位-我的分析师】里看到
          </p>
          <div v-if="tableDataSecond && tableDataSecond.length > 0" class="card-part">
            <ul v-loading="loading">
              <li v-for="(item,index) in tableDataSecond" :key="index" class="item">
                <div class="top">
                  <img
                    v-if="item.avatarImg"
                    :src="item.avatarImg"
                    alt
                    @click="toCW(`/deliverDetail?userId=${item.cwId}`)"
                  />
                  <img v-else src="~@/assets/images/common/avatar.png" />
                  <el-dropdown class="more" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <i class="icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="more-drop">
                      <el-dropdown-item :command="objValue('msg',item)">发消息</el-dropdown-item>
                      <el-dropdown-item :command="objValue('email',item)">
                        <a :href="`mailto:${item.email}`">发邮件</a>
                      </el-dropdown-item>
                      <el-dropdown-item :command="objValue('focus',item)">不再关注</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <p
                    class="name"
                    @click="toCW(`/deliverDetail?tab=allPosition&userId=${item.cwId}`)"
                  >
                    {{ item.nickName }}
                    <span v-if="item.level ===1">金牌</span>
                    <span v-if="item.level ===2" style="border-color:#c0c0c0;color:#c0c0c0;">银牌</span>
                    <span v-if="item.level ===3" style="border-color:#B87333;color:#B87333;">铜牌</span>
                  </p>
                  <p class="other-name">{{ item.englishName }}</p>
                </div>
                <div class="footer">
                  <span>在招职位（{{ item.recruitPositionCount }}）</span>
                  <span>精选职位（{{ item.boutiquePositionCount }}）</span>
                </div>
              </li>
            </ul>
            <!-- 分页 -->
            <el-pagination
              v-if="total2 && total2 > 20"
              class="clear"
              background
              layout="prev, pager, next"
              :page-size="20"
              :total="total2"
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
            />
          </div>
          <div v-else class="empty-page">
            <img
              style="width:240px;height:150px;"
              src="@/assets/images/myCenter/attention_empty.png"
            />
            <p>您还没有关注过任何分析师</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import dialogChat from '@/components/common/dialogChat.vue'
import { mapState } from 'vuex'
import {
  getUserFollowCompany,
  getUserFollowCW,
  deleteUserFollowCompany,
  deleteUserFollowCW
} from '@/api/myCenter'

export default {
  components: {
    dialogChat
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      activeName: this.$route.query.tab || 'first',
      tableDataFirst: [],
      tableDataSecond: [],
      pageNumber1: 1,
      pageSize1: 20,
      total1: null,
      pageNumber2: 1,
      pageSize2: 20,
      total2: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    document.body.style['overflow'] = 'auto'
    console.log('字典', this.dictData)
    this.dictData && this.getUserFollowCompany()
  },
  methods: {
    toCW(url) {
      this.$router.push({ path: url })
    },
    windowOpen(componentName) {
      window.open(`/${componentName}`)
    },
    // 发消息
    sendMsg() {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${this.userInfo.userId}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    // 额外参数
    objValue(name, item) {
      return {
        name,
        item
      }
    },
    handleCommand(command) {
      if (command.name === 'focus') {
        // 取消关注
        this.noFocusCW(command.item.cwId)
      } else if (command.name === 'msg') {
        // 发消息
        this.sendMsg()
      }
    },
    handleClick(e) {
      console.log(e)
      console.log('字典', this.dictData)
      if (e.name === 'first') {
        this.pageNumber1 = 1
        this.getUserFollowCompany()
      } else {
        this.pageNumber2 = 1
        this.getUserFollowCW()
      }
    },
    // 关注的企业
    getUserFollowCompany() {
      this.loading = true
      const { pageSize1: pageSize, pageNumber1: pageNumber } = this
      const params = {
        pageNumber,
        pageSize
      }
      getUserFollowCompany(params).then(res => {
        this.loading = false

        const { code, data } = res
        if (code === '000000') {
          this.total1 = data.total
          this.tableDataFirst = data.records.filter(item => {
            if (item) {
              return item
            }
          })
          console.log('关注的企业', this.tableDataFirst)
        }
      })
    },
    // 关注的分析师
    getUserFollowCW() {
      this.loading = true
      const { pageSize2: pageSize, pageNumber2: pageNumber } = this
      const params = {
        pageNumber,
        pageSize
      }
      getUserFollowCW(params).then(res => {
        this.loading = false

        const { code, data } = res
        if (code === '000000') {
          this.total2 = data.total
          this.tableDataSecond = data.records.filter(item => {
            if (item) {
              return item
            }
          })
          console.log('关注的分析师', this.tableDataSecond)
        }
      })
    },
    // 不再关注企业
    noFocusCompany(dataId) {
      const { userId } = this.userInfo
      const params = {
        dataId,
        userId
      }
      deleteUserFollowCompany(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.pageNumber1 = 1
          this.getUserFollowCompany()
        }
      })
    },
    // 不再关注分析师
    noFocusCW(dataId) {
      const { userId } = this.userInfo
      const params = {
        dataId,
        userId
      }
      deleteUserFollowCW(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.pageNumber2 = 1
          this.getUserFollowCW()
        }
      })
    },
    handleSizeChange1(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange1(val) {
      this.pageNumber1 = val
      this.getUserFollowCompany()
      console.log(`当前页: ${val}`)
    },
    handleSizeChange2(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange2(val) {
      this.pageNumber2 = val
      this.getUserFollowCW()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style  lang="scss">
.more-drop {
  .el-dropdown-menu__item {
    color: #4c4c4c;
    font-size: 14px;
    a {
      text-decoration: none;
      color: inherit;
      font-size: 14px;
    }
  }
}
.base-info-page-other {
  .my-attention {
    background-color: #f7f7f7;
    .el-table__header {
      border-bottom: 1px solid #ebeef5;
    }
    .scope-first {
      text-align: left;
      position: relative;
      min-height: 45px;
      padding: 0 13px;
      box-sizing: border-box;
      .text-logo {
        width: 40px;
        height: 40px;
        display: inline-block;
        text-align: center;
        font-size: 14px;
        color: #fff;
        line-height: 40px;
        background: #2980cc;
        border-radius: 4px;
        margin-top: 3px;
        position: absolute;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        display: inline-block;
        background: #ccc;
        position: absolute;
        margin-top: 3px;
        object-fit: cover;
      }
      p {
        padding-left: 50px;
        color: #000000;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
        line-height: 45px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        &:hover {
          color: #1678f9;
          text-decoration: underline;
        }
      }
    }
    .card-part {
      margin-top: 16px;
      width: 900px;
      ul {
        .item {
          float: left;
          display: inline-block;
          padding: 20px;
          box-sizing: border-box;
          width: 280px;
          height: 151px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 2px 4px 30px 0px rgba(0, 0, 0, 0.07);
          margin-right: 20px;
          margin-bottom: 20px;
          .top {
            position: relative;
            padding-bottom: 20px;
            border-bottom: 1px dashed #eee;
            .more {
              position: absolute;
              right: 0;
              .icon-more {
                width: 28px;
                height: 28px;
                display: inline-block;
                border-radius: 100%;
                position: relative;
                background-color: #f1f1f1;
                &::before {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  margin-left: -9px;
                  margin-top: -9px;
                  content: '';
                  width: 18px;
                  height: 18px;
                  display: inline-block;
                  background: url('~@/assets/images/myCenter/more.png')
                    no-repeat;
                  background-size: 18px;
                }
              }
            }
            .name {
              cursor: pointer;
              color: #343434;
              font-size: 20px;
              font-weight: 600;
              span {
                margin-left: 12px;
                border: 1px solid #fad32b;
                font-size: 14px;
                font-weight: normal;
                border-radius: 4px;
                height: 24px;
                line-height: 24px;
                vertical-align: 1px;
                width: 44px;
                display: inline-block;
                color: #fad32b;
                text-align: center;
              }
            }
            .other-name {
              color: #7f7f7f;
              font-size: 14px;
              height: 20px;
              line-height: 20px;
            }
            img {
              cursor: pointer;
              position: absolute;
              left: 0px;
              top: 0px;
              width: 50px;
              height: 50px;
              border-radius: 100%;
              box-shadow: 0px 5px 15px 0px rgba(22, 120, 249, 0.13);
            }
            p {
              padding-left: 62px;
            }
          }
          .footer {
            line-height: 60px;
            span {
              font-size: 14px;
              color: #333333;
              &:first-child {
                float: left;
              }
              &:last-child {
                float: right;
              }
            }
          }
        }
      }
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
    .el-tabs__item.is-active {
      color: #1678f9;
      font-weight: 600;
    }
    .el-tabs__nav-wrap::after {
      background-color: #b3b3b3;
      height: 1px;
    }
    .el-tabs__active-bar {
      height: 1px;
      background-color: #1678f9;
    }
    .el-tabs__item {
      color: #808080;
      font-size: 16px;
      height: 42px;
      line-height: 42px;
      padding: 0 30px;
    }
    .el-tabs__content {
      .tip {
        font-size: 14px;
        color: #4d4d4d;
        span {
          color: #ea2b3f;
        }
      }
    }
    .table-part {
      margin-top: 16px;
      .el-table tr th:last-child {
        border-right: none;
        display: block !important;
      }

      .el-table {
        background-color: #fff;
        margin-bottom: 40px;
      }
      .el-table td,
      .el-table th {
        text-align: center;
        padding: 16px 0;
        font-size: 14px;
        color: #4d4d4d;
      }
      .el-table th,
      .el-table tr {
        background-color: transparent;
        .cell {
          text-align: center;
        }
      }
      .el-table th > .cell {
        font-size: 16px;
        color: #000000;
      }
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #eee;
      }
      .el-table__body-wrapper {
        border-bottom: 1px solid #eee;
      }
      .el-table thead {
        font-size: 16px;
        color: #000000;
      }
      button {
        width: 76px;
        height: 30px;
        color: #1678f9;
        line-height: 14px;
        border-color: #1678f9;
        font-size: 14px;
        border-radius: 15px;
      }
    }
    .no-focus {
      background-color: #fff;
      padding: 0;
      line-height: 20px !important;
    }
  }
}
</style>
