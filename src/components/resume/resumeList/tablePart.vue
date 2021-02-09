<template>
  <div class="table-part">
    <template v-if="$props.showThisTable1">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="头像" width="120">
          <template slot-scope="scope">
            <img v-if="scope.row.avatarImg" class="avatar" :src="scope.row.avatarImg" />
            <img
              v-else-if="scope.row.gender === 1"
              class="avatar"
              src="~@/assets/images/common/man_avatar.png"
            />
            <img
              v-else-if="scope.row.gender === 2"
              class="avatar"
              src="~@/assets/images/common/women_avatar.png"
            />
            <img v-else src="~@/assets/images/common/avatar.png" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="130" />
        <el-table-column label="性别" width="72">
          <template slot-scope="scope">{{ scope.row.gender ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column label="地区" width="110">
          <template slot-scope="scope">{{ scope.row.city }}</template>
        </el-table-column>
        <el-table-column label="访问时间" width="125">
          <template slot-scope="scope">
            <p>{{ scope.row.lastbrowsetime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="访问记录" width="322">
          <template slot-scope="scope">
            <p v-if="scope.row.dataType === 1">浏览了「{{ scope.row.title }} 」</p>
            <p v-if="scope.row.dataType === 2">浏览了「{{ scope.row.title }} 」，并且表示感兴趣</p>
            <p v-if="scope.row.dataType === 4">浏览了「{{ scope.row.title }} 」，并且主动对话询问</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.imUserId"
              size="small"
              @click="sendMessage(scope.row.imUserId)"
            >发消息</el-button>
            <span v-else class="blue-dot-line">-</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="$props.showThisTable2">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="头像" width="120">
          <template slot-scope="scope">
            <img v-if="scope.row.appUserAvatarUrl" class="avatar" :src="scope.row.appUserAvatarUrl" />
            <img
              v-else-if="scope.row.appUserGender === 1"
              class="avatar"
              src="~@/assets/images/common/man_avatar.png"
            />
            <img
              v-else-if="scope.row.appUserGender === 2"
              class="avatar"
              src="~@/assets/images/common/women_avatar.png"
            />
            <img v-else src="~@/assets/images/common/avatar.png" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="appUserName" label="昵称" width="130" />
        <el-table-column label="性别" width="72">
          <template slot-scope="scope">{{ scope.row.appUserGender ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column label="地区" width="110">
          <template slot-scope="scope">{{ scope.row.city }}</template>
        </el-table-column>
        <el-table-column label="推荐时间" width="125">
          <template slot-scope="scope">
            <p>{{ scope.row.applyTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="推荐记录" width="322">
          <template slot-scope="scope">
            推荐了朋友
            <el-popover placement="top-start" width="220" trigger="click">
              <div class="table-part-panel">
                <div class="panel-body">
                  <p v-if="scope.row.positionName">
                    <label>推荐职位：</label>
                    <span>{{ scope.row.positionName }}</span>
                  </p>
                  <p v-if="scope.row.name">
                    <label>姓名：</label>
                    <span>{{ scope.row.name }}</span>
                  </p>
                  <p v-if="scope.row.mobile">
                    <label>电话：</label>
                    <span>{{ scope.row.mobile }}</span>
                  </p>
                  <p v-if="scope.row.email">
                    <label>邮箱：</label>
                    <span>{{ scope.row.email }}</span>
                  </p>
                  <p v-if="scope.row.positionCompanyName">
                    <label>公司：</label>
                    <span>{{ scope.row.positionCompanyName }}</span>
                  </p>
                  <p v-if="scope.row.positionTitle">
                    <label>TITLE：</label>
                    <span>{{ scope.row.positionTitle }}</span>
                  </p>
                </div>
              </div>
              <span slot="reference" class="table-part-link">「{{ scope.row.name }}」</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.imUserId"
              size="small"
              @click="sendMessage(scope.row.imUserId)"
            >发消息</el-button>
            <span v-else class="blue-dot-line">-</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 聊天 -->
    <dialogChat :visible.sync="dialogVisible" />

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="$props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dialogChat from '@/components/common/dialogChat.vue'
export default {
  components: {
    dialogChat
  },
  props: {
    showThisTable1: {
      type: Boolean,
      required: true
    },
    showThisTable2: {
      type: Boolean,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  methods: {
    sendMessage(imUserId) {
      this.dialogVisible = true
      this.$store
        .dispatch('checkoutConversation', `C2C${imUserId}`)
        .then(() => {})
        .catch(() => {
          this.$store.commit('showMessage', {
            message: '没有找到该用户',
            type: 'warning'
          })
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.$emit('refreshList', val)
    }
  }
}
</script>
<style  lang="scss">
.table-part-panel {
  .panel-body {
    p {
      margin-bottom: 5px;
    }
  }
}
.resume-page {
  .table-part-link {
    color: #1678f9;
    cursor: pointer;
  }
  .table-part {
    margin-right: 0.5px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 100%;
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
    .el-table {
      background-color: #fff;
      margin-bottom: 40px;
    }
    .el-table td,
    .el-table th {
      text-align: center;
      padding: 16px 0;
    }
    .el-table td {
      font-size: 14px;
      color: #4d4d4d;
    }
    .el-table th,
    .el-table tr {
      background-color: transparent;
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
}
</style>
