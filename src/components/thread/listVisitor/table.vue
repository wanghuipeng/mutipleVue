<template>
  <div class="thread-table">
    <el-table
      v-loading="$props.listLoading"
      :data="$props.visitorData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="头像" width="150px">
        <template slot-scope="{row}">
          <div class="avatar-mess">
            <img
              v-if="row.avatarImg"
              class="img-avatar"
              :src="row.avatarImg"
              @click="visitorDetail(row.appUserId)"
            />
            <img
              v-else
              class="img-avatar"
              src="~@/assets/images/common/avatar.png"
              @click="visitorDetail(row.appUserId)"
            />
            <div class="right">
              <span
                class="link-type"
                @click="visitorDetail(row.appUserId)"
              >{{ row.nickName || '-' }}</span>
              <span>{{ row.city|| '-' }}</span> |
              <span v-if="row.gender === 1">男</span>
              <span v-else-if="row.gender === 2">女</span>
              <span v-else>-</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="100px">
        <template slot-scope="{row}">
          <span v-if="row.mobile" :title="row.mobile">{{ row.mobile | filterTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问记录" min-width="230px">
        <template slot-scope="{row}">
          <div style="text-align: left;">
            <p>{{ row.lastBrowseTime || '-' }}</p>
            <p v-if="row.positionTitle">
              {{ row.positionTitle }} — {{ row.companyName }}
              <el-tag class="ml-10" size="small">浏览</el-tag>
              <el-tag v-if="row.haveInterested" type="success" class="ml-10" size="small">投递</el-tag>
              <el-tag v-if="row.haveContacted" type="info" class="ml-10" size="small">问一问</el-tag>
              <el-tag v-if="row.haveShare" type="warning" class="ml-10" size="small">转发</el-tag>
            </p>
            <p v-else>-</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="访客标签" min-width="200px">
        <template slot-scope="{row}">
          <div style="text-align: left;">
            <span v-for="(item,index) in row.labels" :key="index">
              <el-tag class="ml-10 mb-5" size="small" type="warning">{{ item }}</el-tag>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="相关成员" min-width="90px">
        <template slot-scope="{row}">
          <span>{{ row.hhUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简历完整度" min-width="90px">
        <template slot-scope="{row}">
          <el-tag v-if="row.integrity" type="success" size="small" light>{{ row.integrity }}%</el-tag>
          <el-tag v-else type="info" size="small">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        min-width="160px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.resumeId"
            type="primary"
            size="mini"
            @click="toResumeDetail(row.resumeId)"
          >查看简历</el-button>
          <el-button v-else type="text" disabled size="mini">无简历</el-button>
          <el-button size="mini" @click="setLabels(row)">打标签</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 访客详情 -->
    <el-dialog
      :visible.sync="visitorDetailVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
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
    <!-- 打标签 -->
    <el-dialog
      :visible.sync="setLabelVisible"
      width="700px"
      :lock-scroll="true"
      :modal-append-to-body="true"
      class="visitor-detail-modal"
      @close="closeItLabel"
    >
      <div class="visitor-detail">
        <div class="resume-link">
          <p class="left">
            <span class="label-title">添加访客标签</span>
          </p>
        </div>
        <div class="label-panel">
          <template v-if="labelOptions2 && labelOptions2.length > 0">
            <div v-for="(item,index) in labelOptions2" :key="'info1-'+index" class="item item-comp">
              <p class="title">{{ item.userLabelPoolGroup }}</p>
              <div v-if="loading1" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem1(itemInner.id)"
                >{{ itemInner.labelName }}</span>
              </div>
            </div>
          </template>

          <template v-if="labelOptions1 && labelOptions1.length > 0">
            <p class="title">自定义标签</p>
            <div v-for="(item,index) in labelOptions1" :key="'info2-'+index" class="item">
              <div v-if="loading2" class="labels">
                <span
                  v-for="(itemInner,indexInner) in item.userLabelPools"
                  :key="indexInner"
                  :class="[itemInner.active && 'active']"
                  @click="checkItem2(itemInner)"
                >
                  {{ itemInner.labelName }}
                  <i
                    title="编辑自定义标签"
                    class="el-icon-edit-outline"
                    @click.stop="editLabel(itemInner)"
                  ></i>
                </span>
                <span class="add-icon" @click="addLabels">
                  <i class="el-icon-plus"></i>添加
                </span>
              </div>
              <div v-if="inputVisible" class="label-input">
                <el-input v-model="labelInput" size="small" placeholder="请输入标签名称"></el-input>
                <span v-if="labelInput" class="del" @click="closeInput1">删除</span>
                <span v-else class="del" @click="()=>{inputVisible = false}">删除</span>
                <span class="add" @click="checkInput1">保存</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeItLabel">取 消</el-button>
        <el-button size="small" type="primary" @click="checkLabels(2)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="orderVisible"
      :router="'resumeDetail'"
      :direction="'btt'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier
        v-if="orderVisible"
        slot="inner-body"
        :company-account-type="userInfo && userInfo.companyAccountType"
      />
    </drawer-common>
  </div>
</template>

<script>
import DrawerCommon from '@/components/common/drawerCommon'
import VisitorDetail from '@/components/thread/visitorDetail'
import {
  getShareUserBrowse,
  getUserAppLabelList,
  addUserLabelPoolOfUser,
  deleteUserLabelPoolOfUser,
  editUserLabelPoolOfAll,
  editUserLabelPoolOfUser
} from '@/api/thread'
import { filterDates } from '@/utils/common'
import { mapState } from 'vuex'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'

export default {
  components: {
    DrawerCommon,
    ResumeDetailSupplier,
    VisitorDetail
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  props: {
    visitorData: {
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
      orderVisible: false,
      footerVisible: false,
      showMoreLabel: false,
      checkIconVisible: true,
      inputVisible: false,
      labelInput: null,
      isRouterAlive: true,
      appUserId: null,
      drawer: false,
      visitorDetailVisible: false,
      visitorDetailData: {}, // 访客详情
      resumeInfo: {}, // 简历详情
      resumeDetail: {}, // 简历基本信息
      educations: [], // 教育经历
      experiences: [], // 工作经历
      shareChainUserAvatars: [], // 共同人脉
      setLabelVisible: false,
      labelOptions1: [],
      labelOptions2: [],
      userLabelId: null,
      loading1: true,
      loading2: true,
      ids1: [],
      ids2: [],
      labelIds: [],
      labelText: [],
      id: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyId: state => state.userInfo.companyId
    })
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
    checkItem1(id) {
      console.log(id)
      this.loading1 = false
      //
      this.labelOptions2 &&
        this.labelOptions2.filter((item, index) => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === id) {
              item.userLabelPools.filter(itemItem => {
                if (itemItem.id === id && !itemItem.active) {
                  itemItem.active = true
                } else {
                  itemItem.active = false
                }
              })
            }
          })
        })
      //
      this.loading1 = true
    },
    checkItem2(itemData) {
      this.loading2 = false
      //
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.id === itemData.id) {
              itemInner.active = !itemInner.active
            }
          })
        })
      this.ids2.push(itemData.id)
      //

      this.loading2 = true
    },
    editLabel(itemData) {
      this.id = itemData.id
      this.userLabelId = itemData.id
      this.labelInput = itemData.labelName
      this.inputVisible = true
      this.checkIconVisible = false
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
      userLabelId &&
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
            this.inputVisible = false
            this.userLabelId = null
            this.getUserAppLabelList()
          }
        })
    },
    editUserLabelPoolOfUser() {
      const { labelInput: labelName, id } = this
      const params = {
        companyId: this.companyId,
        labelName,
        labelLevel: 1,
        type: 2,
        id
      }
      console.log('params', params)
      editUserLabelPoolOfUser(params).then(res => {
        const { code, data } = res
        console.log(data)
        if (code === '000000') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.userLabelId = null
          this.labelOptions1 = []
          this.labelOptions2 = []
          this.labelInput = null
          this.inputVisible = false
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
          this.inputVisible = false
          this.getUserAppLabelList()
        }
      })
    },
    addLabels() {
      this.labelInput = null
      this.inputVisible = true
      this.checkIconVisible = true
    },
    closeInput1() {
      this.inputVisible = false
      this.deleteUserLabelPoolOfUser()
    },
    checkInput1() {
      let or = false
      this.labelOptions1 &&
        this.labelOptions1.filter(item => {
          item.userLabelPools.filter(itemInner => {
            if (itemInner.labelName === this.labelInput) {
              or = true
            }
          })
        })
      if (this.labelInput && this.labelInput.length > 10) {
        this.$message({
          message: '标签名最大长度为10',
          type: 'warning'
        })
      } else if (!this.labelInput) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
      } else {
        if (this.userLabelId) {
          this.loading2 = false
          this.editUserLabelPoolOfUser()
          this.loading2 = true
        } else {
          if (or) {
            this.$message({
              message: '标签名已存在，不能重复添加',
              type: 'warning'
            })
          } else {
            this.loading2 = false
            this.addUserLabelPoolOfUser()
            this.loading2 = true
          }
        }
      }
    },
    closeItLabel() {
      this.setLabelVisible = false
      this.labelInput = null
      this.inputVisible = false
      this.footerVisible = false
    },
    setLabels(row) {
      this.labelText = row.labels
      console.log(row.labels)
      this.appUserId = row.appUserId
      this.labelOptions1 = []
      this.labelOptions2 = []
      this.getUserAppLabelList()
      this.setLabelVisible = true
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    closeIt() {
      this.visitorDetailVisible = false
      this.footerVisible = false
    },
    getUserAppLabelList() {
      const params = {}
      getUserAppLabelList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.filter(item => {
              if (item.userLabelPoolGroup === '个人标签') {
                this.labelOptions1.push(item)
              } else {
                this.labelOptions2.push(item)
              }
            })
          this.labelOptions1 &&
            this.labelOptions1.filter(item => {
              item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a) {
                    b.active = true
                  }
                })
              })
            })
          this.labelOptions2 &&
            this.labelOptions2.filter(item => {
              item.userLabelPools.filter(b => {
                this.labelText.filter(a => {
                  if (b.labelName === a) {
                    b.active = true
                  }
                })
              })
            })
        }
      })
    },
    // 跳转简历详情
    toResumeDetail(resumeId) {
      this.orderVisible = true
      sessionStorage.setItem('resumeId', resumeId)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.drawer = false
      this.$emit('refreshList', 1)
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
            (this.visitorDetailData && this.visitorDetailData.resumeInfo) || {}
          this.resumeDetail = (this.resumeInfo && this.resumeInfo.detail) || {}
          this.educations =
            (this.resumeInfo && this.resumeInfo.educations) || []
          this.experiences =
            (this.resumeInfo && this.resumeInfo.experiences) || []
          this.shareChainUserAvatars =
            (this.visitorDetailData &&
              this.visitorDetailData.shareChainUserAvatars) ||
            []
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/table.scss';
@import '@/assets/sass/thread/visitorDetail.scss';
</style>
