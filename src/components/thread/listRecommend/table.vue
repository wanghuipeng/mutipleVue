<template>
  <div class="thread-table">
    <el-table
      v-loading="$props.listLoading"
      :data="$props.recommendData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="推荐时间" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.applyTime|| '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="{row}">
          <span>{{ row.name|| '-' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="地区">
        <template slot-scope="{row}">
          <span>{{ row.city|| '-' }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="手机号">
        <template slot-scope="{row}">
          <span>{{ row.mobile|| '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="{row}">
          <span>{{ row.email || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="目前公司" width="150px">
        <template slot-scope="{row}">{{ row.companyName || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="目前TITLE">
        <template slot-scope="{row}">
          <span>{{ row.positionTitle || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐理由">
        <template slot-scope="{row}">{{ row.introduction || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="推荐人">
        <template slot-scope="{row}">
          <span class="link-type" @click="visitorDetail(row.appUserId)">{{ row.appUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="相关成员">
        <template slot-scope="{row}">
          <span>{{ row.hhUserName || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 访客详情 -->
    <el-dialog
      :visible.sync="visitorDetailVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
      :show-close="false"
      class="visitor-detail-modal"
      @close="closeIt"
    >
      <keep-alive v-if="isRouterAlive">
        <visitor-detail
          ref="change"
          :visitor-detail-data="visitorDetailData"
          :resume-info="resumeInfo"
          :resume-detail="resumeDetail"
          :visitor-detail-visible="visitorDetailVisible"
          :app-user-id="appUserId"
          :educations="educations"
          :experiences="experiences"
          :share-chain-user-avatars="shareChainUserAvatars"
          @hideFooter="hideFooter"
        />
      </keep-alive>
      <span v-if="footerVisible" slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeIt">取 消</el-button>
        <el-button size="small" type="primary" @click="checkLabels(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VisitorDetail from '@/components/thread/visitorDetail'
import {
  getShareUserBrowse,
  editUserLabelPoolOfAll,
  deleteUserLabelPoolOfUser,
  addUserLabelPoolOfUser
} from '@/api/thread'
import { filterDates } from '@/utils/common'

export default {
  components: {
    VisitorDetail
  },
  props: {
    recommendData: {
      required: true,
      type: Array
    },
    listLoading: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      footerVisible: false,
      isRouterAlive: true,
      appUserId: null,
      visitorDetailVisible: false,
      visitorDetailData: {}, // 访客详情
      resumeInfo: {}, // 简历详情
      resumeDetail: {}, // 简历基本信息
      educations: [], // 教育经历
      experiences: [], // 工作经历
      shareChainUserAvatars: [] // 共同人脉
    }
  },
  mounted() {},
  methods: {
    hideFooter() {
      this.footerVisible = true
    },
    checkLabels(flag) {
      if (flag === 1) {
        const labelOptions1 = JSON.parse(localStorage.getItem('labelOptions1'))

        const labelOptions2 = JSON.parse(localStorage.getItem('labelOptions2'))
        console.log(1111111, labelOptions2)
        //
        labelOptions1 &&
          labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active && this.labelIds.push(itemInner.id)
            })
          })
        labelOptions2 &&
          labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active && this.labelIds.push(itemInner.id)
            })
          })
        //
        this.editUserLabelPoolOfAll()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
      } else if (flag === 2) {
        //
        this.labelOptions1 &&
          this.labelOptions1.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active && this.labelIds.push(itemInner.id)
            })
          })
        this.labelOptions2 &&
          this.labelOptions2.filter(item => {
            item.userLabelPools.filter(itemInner => {
              itemInner.active && this.labelIds.push(itemInner.id)
            })
          })
        //
        console.log(this.labelIds)
        this.editUserLabelPoolOfAll()
        this.closeItLabel()
        this.closeIt()
        this.$emit('searchTable1', this.query)
      }
    },
    editUserLabelPoolOfAll() {
      const { labelIds, appUserId } = this
      const params = {
        labelIds,
        appUserId
      }
      editUserLabelPoolOfAll(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          localStorage.removeItem('ids1')
          localStorage.removeItem('ids2')
          this.ids1 = []
          this.ids2 = []
          this.labelIds = []
        }
      })
    },
    deleteUserLabelPoolOfUser() {
      const { userLabelId } = this
      const params = {
        userLabelId
      }
      deleteUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.getUserAppLabelList()
        }
      })
    },
    addUserLabelPoolOfUser() {
      const { labelInput: labelName } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2
      }
      addUserLabelPoolOfUser(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.inputVisible = false
          this.userLabelId = false
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.getUserAppLabelList()
        }
      })
    },
    closeItLabel() {
      this.setLabelVisible = false
      this.labelInput = null
      this.inputVisible = false
    },
    setLabels(row) {
      this.labelText = row.labels
      console.log(row.labels)
      this.appUserId = row.appUserId
      this.labelOptions1 = []
      this.labelOptions2 = []
      this.setLabelVisible = true
    },
    closeIt() {
      this.visitorDetailVisible = false
      this.footerVisible = false
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 访客详情
    visitorDetail(appUserId) {
      this.appUserId = appUserId
      this.visitorDetailVisible = true
      this.reload()
      this.getShareUserBrowse(appUserId)
    },
    getShareUserBrowse(appUserId) {
      const params = {
        appUserId
      }
      getShareUserBrowse(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.visitorDetailData = data
          this.visitorDetailData.lastBrowseTime &&
            this.$set(
              this.visitorDetailData,
              'lastBrowseTime',
              filterDates(this.visitorDetailData.lastBrowseTime)
            )
          this.resumeInfo =
            this.visitorDetailData && this.visitorDetailData.resumeInfo
          this.resumeDetail = this.resumeInfo && this.resumeInfo.detail
          this.educations =
            (this.resumeInfo && this.resumeInfo.educations) || []
          this.experiences =
            (this.resumeInfo && this.resumeInfo.experiences) || []
          this.shareChainUserAvatars =
            (this.visitorDetailData &&
              this.visitorDetailData.shareChainUserAvatars) ||
            []
          console.log('访客详情', data)
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/table.scss';
</style>
