<template>
  <div class="list-part">
    <!-- 批量操作 -->
    <div
      v-show="checkedResume.length"
      id="fixedBatchOperate"
      :class="['batch-operate',fixedBatchOperate && 'isFixed']"
    >
      <p class="operate-text">已选择{{ checkedResume.length }}条简历</p>
      <div class="operate-btn">
        <el-button v-if="queryType === 1 || queryType === 2" @click="batchAddFolder">加入文件夹</el-button>
        <el-button @click="batchAddTalent">{{ queryType === 3 ? '移出回收站' : '加入人才库' }}</el-button>
        <el-button v-if="queryType === 1 || queryType === 2" @click="batchAddBackTalent">删除</el-button>
        <el-button v-if="queryType === 2" @click="batchRemoveFolder">移出文件夹</el-button>
        <!-- <el-button @click="batchRemoveTalent">移出人才库</el-button> -->
      </div>
    </div>
    <!-- 表头 -->
    <div class="table-header">
      <el-checkbox v-model="checkAll" class="check-all" @change="handleCheckAllChange"></el-checkbox>
      <div class="header-main">
        <p class="main-item">基本资料</p>
        <p class="main-item">操作</p>
      </div>
    </div>
    <!-- 简历列表 -->
    <el-checkbox-group v-model="checkedResume" @change="handleCheckedResumeChange">
      <el-checkbox v-for="item in $props.listData" :key="item.detail.id" :label="item.detail.id">
        <div class="item">
          <!-- <span :class="[ index == 2 ? 'check active' : 'check']"></span> -->
          <div v-if="item.detail" class="item-img">
            <img v-if="item.detail.avatarImg" :src="item.detail.avatarImg" />
            <img v-else-if="item.detail.gender === 1" src="~@/assets/images/common/man_avatar.png" />
            <img
              v-else-if="item.detail.gender === 2"
              src="~@/assets/images/common/women_avatar.png"
            />
            <img v-else src="~@/assets/images/common/avatar.png" />
          </div>
          <div v-if="item.detail" class="item-cont">
            <p class="part-1">
              <el-button
                type="text"
                size="small"
                class="name"
                @click="toDetail(item.detail.id)"
              >{{ item.detail.name || 'null' }}</el-button>
              <!-- <span
                v-if="item.detail.universityLabel && item.detail.universityLabel === 2"
                class="label"
              >985</span>
              <span
                v-if="item.detail.universityLabel && item.detail.universityLabel === 1"
                class="label green"
              >211</span>
              <template v-if="item.detail.universityLabel && item.detail.universityLabel === 3">
                <span class="label">985</span>
                <span class="label green">211</span>
              </template>
              <span v-if="item.detail.famousCompany" class="label red">知名互联网公司</span>
              <span v-if="item.detail.top500" class="label red">世界500强</span>-->
              <span
                v-if="item.detail.jobStatus"
                class="job-state label"
              >{{ item.detail.jobStatus | filterArr(dictData.dicts.jobStatus) }}</span>
            </p>
            <p class="part-2">
              <span
                v-if="item.detail.intentionCity"
                class="label"
              >{{ item.detail.intentionCity | filterLevel2(dictData.areas) }}</span>
              <span
                v-if="item.detail.gender"
                class="label"
              >{{ item.detail.gender === 1 ? '男' : (item.detail.gender === 2 ? '女' : null) }}</span>
              <span v-if="item.detail.age" class="label">{{ item.detail.age }}岁</span>
              <span v-if="item.detail.workMonth" class="label">{{ item.detail.workMonth }}</span>
              <span
                v-if="item.detail.degreeCode"
                class="label"
              >{{ item.detail.degreeCode | filterArr(resumeDict.degree) }}</span>
            </p>
            <div class="part-3">
              <div v-for="(item1,index1) in item.experiences" :key="index1">
                <p
                  v-if="index1 < 2"
                  :class="[ item1 && item1.startDate ? 'line work-exp' : 'work-exp']"
                >
                  <span v-if="item1.companyName">{{ item1.companyName }}</span>
                  <span v-if="item1.title" class="name">{{ item1.title }}</span>
                  <label v-if="item1.startDate">
                    {{ item1.startDate }}-{{ item1.endDate || (item1.isNow ? '至今' : '') }}
                    {{ item1.startToEndDate && '（' + item1.startToEndDate + '）' }}
                  </label>
                </p>
              </div>
              <p
                v-if="item.educations && item.educations.length > 0"
                :class="[ item.educations[0] && item.educations[0].startDate ? 'line edu-exp' : 'edu-exp']"
              >
                <span
                  v-if="item.educations[0] && item.educations[0].school"
                >{{ item.educations[0] && item.educations[0].school }}</span>
                <span
                  v-if="item.educations[0] && item.educations[0].speciality"
                  class="name"
                >{{ item.educations[0] && item.educations[0].speciality }}</span>
                <label v-if="item.educations[0] && item.educations[0].startDate">
                  {{ item.educations[0] && item.educations[0].startDate }}-{{ item.educations[0] && item.educations[0].endDate }}
                  {{ (item.educations[0] && item.educations[0].startToEndDate) && '（' + item.educations[0].startToEndDate + '）' }}
                </label>
              </p>
              <p v-else-if="item.detail && item.detail.graduateSchool" class="edu-exp no-dot">
                <span
                  v-if="item.detail && item.detail.graduateSchool"
                >{{ item.detail.graduateSchool }}</span>
              </p>
            </div>
            <div v-if="item.labels && item.labels.length > 0" class="part-4">
              <span
                v-for="(itemInner,index) in item.labels"
                :key="index"
              >{{ itemInner && itemInner.labelName }}</span>
            </div>
          </div>
          <div class="item-btns">
            <div>
              <el-button v-if="queryType === 1 || queryType === 2" size="small" @click="addRemark(item.detail.id)">备注</el-button>
              <el-dropdown v-if="queryType === 1 || queryType === 2" trigger="click" @command="handleCommand">
                <el-button size="small" class="mt-10">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="item.detail.orderCount"
                    class="item-dropdown-btn"
                    :command="{type:'a',resumeId:item.detail.id}"
                  >订单（{{ item.detail.orderCount }}）</el-dropdown-item>
                  <el-dropdown-item
                    class="item-dropdown-btn"
                    :command="{type:'b',resumeId:item.detail.id}"
                  >加入文件夹</el-dropdown-item>
                  <el-dropdown-item
                    class="item-dropdown-btn"
                    :command="{type:'c',resumeId:item.detail.id}"
                  >加入人才库</el-dropdown-item>
                  <el-popconfirm title="是否放入回收站？" @onConfirm="editResumeToTalent(item.detail.id)">
                    <el-button slot="reference" size="small" class="item-dropdown-btn">放入回收站</el-button>
                  </el-popconfirm>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-if="queryType === 3" size="small" @click="handleCommand({type:'c',resumeId:item.detail.id})">移出回收站</el-button>
            </div>
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group>

    <!-- 分页 -->
    <el-pagination
      v-if="$props.total && $props.total > 20"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="pageNumber"
      :page-size="pageSize"
      :total="$props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 简历详情（抽屉） -->
    <!-- <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="false"
      @close="close"
    >
      <resume-detail v-if="drawer" slot="inner-body" />
    </drawer-common>-->

    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :direction="direction"
      :router="'resumeDetail'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier v-if="drawer" slot="inner-body" :resume-id="resumeId" :query-type="queryType" @toParent="toParent" @refreshListInner="refreshListInner" />
    </drawer-common>

    <!-- 批量文件夹 -->
    <batch-folder
      ref="modalBatchFolder"
      :company-folder-type="3"
      :checked-list="checkedResume"
      @ok="okFolder"
    ></batch-folder>

    <!-- 批量人才库 -->
    <batch-talent ref="modalBatchTalent" :checked-list="checkedResume" @ok="okTalent"></batch-talent>

    <!-- 单个文件夹 -->
    <single-folder ref="modalSingleFolder" :company-folder-type="3"></single-folder>

    <!-- 单个人才库 -->
    <single-talent ref="modalSingleTalent"></single-talent>

    <!-- 添加备注弹窗 -->
    <el-dialog title="添加备注" append-to-body :visible.sync="remarkDialogVisible" width="500px">
      <div class="main">
        <el-form ref="remarkForm" :model="remarkForm" :rules="remarkFormRules" label-width="0px">
          <el-form-item prop="desc" size="small">
            <el-input v-model="remarkForm.desc" type="textarea" :rows="4" placeholder="输入简历备注信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitRemark('remarkForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DrawerCommon from '@/components/common/drawerCommon'
// import ResumeDetail from './resumeDetail'
import ResumeDetailSupplier from './resumeDetailSupplier'
import batchFolder from '@/components/folder/batchFolder'
import batchTalent from './batchTalent'
import singleFolder from '@/components/folder/singleFolder'
import singleTalent from './singleTalent'
import { editResumeToTalent, saveContactRecord, editResumeToTalentBantch } from '@/api/resume'
import resumeDict from '@/assets/js/resume'

export default {
  components: {
    DrawerCommon,
    // ResumeDetail,
    ResumeDetailSupplier,
    batchFolder,
    batchTalent,
    singleFolder,
    singleTalent
  },
  props: {
    listData: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      required: true,
      default: 0
    },
    pageNumber: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    // 查询类型
    queryType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      fixedBatchOperate: false, // 是否吸顶
      remarkForm: {
        desc: ''
      },
      remarkFormRules: {
        desc: [{ required: true, message: '请添加备注', trigger: 'blur' }]
      },
      remarkDialogVisible: false,
      direction: 'btt',
      drawer: false,
      resumeDict: [],
      resumeId: null,
      checkAll: false, // 全选
      checkedResume: [] // 已选中简历数组
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  watch: {
    listData() {
      this.checkAll = false
      this.checkedResume = []
    }
  },
  mounted() {
    // handlePageScroll为页面滚动的监听回调
    window.addEventListener('scroll', this.handlePageScroll)
    this.resumeDict = resumeDict
  },
  destroyed() {
    // 销毁页面滚动的监听回调
    window.removeEventListener('scroll', this.handlePageScroll)
  },
  methods: {
    toParent() {
      console.log('向上')
      this.$emit('toParentAgain')
    },
    // 监听页面滚动实现吸顶
    handlePageScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.$nextTick(() => {
        const header = document.getElementById('fixedBatchOperate')
        const offsetTop = header && header.offsetTop
        this.fixedBatchOperate = scrollTop > offsetTop
      })
    },
    // 添加备注
    addRemark(resumeId) {
      this.resumeId = resumeId
      this.remarkDialogVisible = true
    },
    submitRemark(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveContactRecord()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveContactRecord() {
      const params = {
        resumeId: this.resumeId,
        contactContent: this.remarkForm.desc
      }
      saveContactRecord(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.remarkDialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 全选/取消全选
    handleCheckAllChange(val) {
      if (val) {
        this.checkedResume = this.listData.map(item => {
          return item.detail.id
        })
      } else {
        this.checkedResume = []
      }
    },
    // 选择/取消选择简历
    handleCheckedResumeChange(value) {
      this.checkAll = value.length === this.listData.length
    },
    // 批量加入文件夹
    batchAddFolder() {
      this.$refs.modalBatchFolder.edit(1)
      this.$refs.modalBatchFolder.title = '加入文件夹'
    },
    // 批量移出文件夹
    batchRemoveFolder() {
      this.$refs.modalBatchFolder.edit(2)
      this.$refs.modalBatchFolder.title = '移出文件夹'
    },
    // 批量加入人才库
    batchAddTalent() {
      this.$refs.modalBatchTalent.edit(1)
      this.$refs.modalBatchTalent.title = '加入人才库'
    },
    // 删除
    batchAddBackTalent() {
      this.$confirm('确认删除', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {};
          para.resumeIds = this.checkedResume;
          editResumeToTalentBantch(para).then(data => {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true,
              center: true
            });
            this.okTalent();
            this.$emit('refreshList', 1)
          });
        })
        .catch(() => {});
    },
    // 批量移出人才库
    batchRemoveTalent() {
      this.$refs.modalBatchTalent.edit(2)
      this.$refs.modalBatchTalent.title = '移出人才库'
    },
    // 批量处理完成
    okFolder() {
      this.$emit('onBatch')
      this.okBatch()
    },
    okTalent() {
      this.okBatch()
    },
    okBatch() {
      this.checkAll = false
      this.checkedResume = []
    },
    handleCommand(e) {
      if (e.type === 'a') {
        this.$router.push({ path: `order/allOrder?resumeId=${e.resumeId}` })
      }
      if (e.type === 'b') {
        this.$refs.modalSingleFolder.edit({ fileId: e.resumeId })
        this.$refs.modalSingleFolder.title = '加入文件夹'
      }
      if (e.type === 'c') {
        this.$refs.modalSingleTalent.edit({ resumeId: e.resumeId })
        this.$refs.modalSingleTalent.title = '加入人才库'
      }
    },
    // 立即推荐
    nowRecommend(id) {
      this.$router.push({ name: 'recommendPosition', query: { resumeId: id } })
    },
    // 放入回收站
    editResumeToTalent(resumeId) {
      const params = {
        resumeId
      }
      editResumeToTalent(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '移除成功',
            type: 'success'
          })
          this.$emit('refreshList', 1)
        }
      })
    },
    // 打开简历详情
    toDetail(resumeId) {
      this.resumeId = resumeId
      document.body.style['overflow'] = 'hidden'
      this.drawer = true
      sessionStorage.setItem('resumeId', resumeId)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.drawer = false
      // this.$emit('refreshList', 1)
    },
    refreshListInner() {
      this.$emit('refreshList', 1)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.$emit('changePageSize', val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.$emit('refreshList', val)
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/resume/listPart.scss';
</style>
