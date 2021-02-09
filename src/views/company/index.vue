<template>
  <div class="companys">
    <el-button style="position: absolute; top: -10000px;"></el-button>
    <div class="header">
      <!-- <p class="title">企业信息管理</p> -->
      <p class="title">您可以管理所有代理招聘的雇主信息，目前暂不支持删除已创建企业。</p>
    </div>
    <div class="operate-bar">
      <el-button v-if="userInfo.positionCompanyPublishAuth" size="small" icon="el-icon-plus" @click="addCompany">新增企业</el-button>
      <el-input v-model="searchName" placeholder="搜索企业名称" class="w-215" size="small" @input="searchCompanyName" />
    </div>
    <div v-if="listData && listData.length > 0 && listData[0] !== 1" class="list">
      <!-- <el-card v-if="myCompany" shadow="hover" class="list-item">
        <el-avatar v-if="myCompany.logoImg" shape="square" :size="50" :src="myCompany.logoImg" />
        <img v-else src="../../assets/images/notice/avatar_company.png" >
        <div class="list-item-main">
          <div class="list-item-main-desc">
            <p>{{ myCompany.shortName }}</p>
            <p>{{ myCompany.replaceName }}</p>
          </div>
          <p class="list-item-main-btn">
            <el-button type="primary" size="mini" @click="edit(myCompany.id)">编 辑</el-button>
          </p>
        </div>
      </el-card>
      <p v-if="listData.length > 0" class="list-desc">便于对不同公司招聘进行区分</p> -->
      <el-card v-for="(item, index) in listData" :key="index" shadow="hover" class="list-item">
        <el-avatar v-if="item.logoImg" shape="square" :size="50" :src="item.logoImg" fit="cover" />
        <img v-else src="../../assets/images/notice/avatar_company.png" >
        <div class="list-item-main">
          <div class="list-item-main-desc">
            <p>{{ item.name }}</p>
            <p>{{ item.replaceName }}</p>
          </div>
          <p class="list-item-main-btn">
            <el-button type="primary" size="mini" @click="edit(item.id)">编 辑</el-button>
            <!-- <el-button type="danger" size="mini" @click="delDialog(item.id)">删 除</el-button> -->
          </p>
        </div>
      </el-card>
    </div>
    <div v-else-if="listData && listData[0] !== 1" class="empty-page">
      <img style="height:154px;" src="@/assets/images/resume/resume_empty.png" />
      <p>很抱歉，搜索不到符合条件的企业</p>
    </div>

    <!-- 编辑企业抽屉 -->
    <drawer-common
      v-if="editVisible"
      :drawer.sync="editVisible"
      size="800"
      class="edit"
    >
      <edit-company slot="inner-body" :operator-type="type" :company-id="companyId" @reload="getList"/>
    </drawer-common>

    <!-- 删除企业 -->
    <el-dialog
      title="提示"
      :visible.sync="delVisible"
      :append-to-body="true"
      width="30%"
    >
      <span>您确定要删除当前企业信息吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import drawerCommon from '@/components/common/drawerCommon'
import editCompany from './editCompany'
import { getCompanyList, editCompanyOfOperation } from '@/api/company'
export default {
  components: {
    drawerCommon,
    editCompany
  },
  data() {
    return {
      editVisible: false,
      delVisible: false,
      type: 'add',
      myCompany: '',
      listData: [1],
      companyId: null,
      searchName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    console.log(this.userInfo)
    this.getList()
  },
  methods: {
    searchCompanyName(e) {
      this.searchName = e
      this.getList()
    },
    // 公司列表
    getList() {
      this.editVisible = false
      const params = {
        searchName: this.searchName,
        companyId: this.userInfo.companyId
      }
      getCompanyList(params).then(res => {
        this.myCompany = res.data.shift()
        this.listData = res.data
      })
    },
    // 添加公司
    addCompany() {
      this.type = 'add'
      this.editVisible = true
      this.companyId = null
    },
    // 编辑公司
    edit(id) {
      this.type = 'edit'
      this.editVisible = true
      this.companyId = id
    },
    // 删除公司弹窗
    delDialog(id) {
      this.delVisible = true
      this.companyId = id
    },
    // 删除公司
    delCompany() {
      this.delVisible = false
      const params = {
        id: this.companyId,
        statusNo: 0
      }
      editCompanyOfOperation(params).then(res => {
        this.$message.success('删除成功')
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.companys {
  padding: 16px;
  .operate-bar{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    button{
      border-radius: 0;
      color: #1678F9;
      border-color: #1678F9;
    }
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color:#14171A;
      line-height: 22px;
    }
  }
  .list {
    .list-item {
      margin-bottom: 16px;
      ::v-deep .el-card__body {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        img {
          width: 50px;
          height: 50px;
        }
        .list-item-main {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 16px;
          .list-item-main-desc {
            flex: 1;
          }
        }
      }
    }
    .list-desc {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
  .edit {
    ::v-deep .fix-drawer .drawer-detail-inner {
      background:#ffffff;
      width: 740px;
    }
    ::v-deep .icon-newWindow {
      display: none;
    }
  }
}
</style>
