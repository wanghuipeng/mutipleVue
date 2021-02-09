<template>
  <div class="thread-operation">
    <el-form :inline="true">
      <div>
        <el-form-item>
          <el-date-picker
            v-model="visitDate"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            style="width: 300px"
            start-placeholder="访问开始时间"
            end-placeholder="访问结束时间"
            value-format="yyyy-MM-dd"
            @change="handleVisitDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="jobName"
            filterable
            size="small"
            placeholder="相关职位"
            style="width: 165px"
            :remote-method="jobRemoteMethod"
            :loading="jobLoading"
            clearable
            @change="handleJob"
          >
            <el-option
              v-for="item in jobOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="actionType"
            clearable
            size="small"
            placeholder="相关行为"
            style="width: 165px"
            @change="handleAction"
          >
            <el-option
              v-for="item in actionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="memberName"
            clearable
            multiple
            filterable
            allow-create
            default-first-option
            collapse-tags
            size="small"
            placeholder="相关成员"
            style="width: 165px"
            :remote-method="memberRemoteMethod"
            :loading="memberLoading"
            @change="handleMember"
          >
            <el-option
              v-for="item in memberOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="hasMobile"
            size="small"
            clearable
            placeholder="是否有手机"
            style="width: 165px"
            @change="handleMoble"
          >
            <el-option label="有手机" value="1"></el-option>
            <el-option label="无手机" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-cascader
            placeholder="请选择标签"
            size="small"
            :options="labelOptions"
            clearable
            filterable
            @change="changeLabel"
          ></el-cascader>
        </el-form-item>
      </div>
      <div v-if="userInfo && userInfo.companyRole === 4">
        <el-button type="primary" size="small" @click="exportData">
          <i class="el-icon-download"></i>
          数据导出
        </el-button>
      </div>
    </el-form>
    <!-- 导出设置 -->
    <export-set
      :set-list="setList"
      :check-list="checkList"
      :export-visible="exportVisible"
      :export-query="exportQuery"
      :flag="'ZJFW'"
      @closeIt="closeIt"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  selectPosition,
  selectHhUser,
  getExportTemplate,
  getUserAppLabelList
} from '@/api/thread'
import ExportSet from '@/components/thread/exportSet'

export default {
  components: {
    ExportSet
  },
  data() {
    return {
      labelOptions: [],
      visitDate: '', // 访问时间
      jobName: this.$route.query.positionId && this.$route.query.positionId - 0, // 相关职位
      actionType: this.$route.query.type && this.$route.query.type + '', // 相关行为
      memberName: this.$route.query.userId && [this.$route.query.userId - 0], // 相关成员
      hasMobile: '', // 是否有手机
      jobOptions: [], // 相关职位
      actionOptions: [], // 相关行为
      memberOptions: [], // 相关成员
      jobLoading: false,
      memberLoading: false,
      query: {
        type: this.$route.query.type && this.$route.query.type + '',
        positionId:
          this.$route.query.positionId && this.$route.query.positionId - 0,
        hhUserIds: this.$route.query.userId && [this.$route.query.userId]
      },
      jobKeyword: null,
      memberKeyword: null,
      exportVisible: false,
      setList: [], // 导出设置
      checkList: [] // 初始值
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dictData: state => state.common.dictData
    }),
    exportQuery() {
      console.log(this.query)
      return this.query
    }
  },
  mounted() {
    // 相关行为
    this.actionOptions = this.dictData.dicts.actionType
    // 相关职位
    this.selectPosition()
    // 相关成员
    this.selectHhUser()
    this.getUserAppLabelList()
  },
  methods: {
    changeLabel(e) {
      console.log([e[1]])
      if (e[1]) {
        this.$set(this.query, 'labelIds', [e[1]])
      } else {
        this.$set(this.query, 'labelIds', [])
      }
      this.$emit('searchTable1', this.query)
    },
    getUserAppLabelList() {
      const params = {}
      getUserAppLabelList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.filter(item => {
              const obj = {}
              obj.value = item.userLabelPoolGroup
              obj.label = item.userLabelPoolGroup
              item.userLabelPools.filter(itemInner => {
                itemInner.value = itemInner.id
                itemInner.label = itemInner.labelName
              })
              obj.children = item.userLabelPools
              this.labelOptions.push(obj)
            })
          console.log('标签', this.labelOptions)
        }
      })
    },
    getExportTemplate() {
      this.checkList = []
      this.setList = []
      const params = {
        typeCode: 'ZJFW'
      }
      getExportTemplate(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data &&
            data.length > 0 &&
            data.filter(item => {
              const obj = {}
              if (item.defaultSelect) {
                obj.value = item.value
                obj.text = item.text
                this.checkList.push(item.text)
              }
              this.setList.push(obj)
            })
        }
      })
    },
    closeIt() {
      this.exportVisible = false
    },
    // 导出
    exportData() {
      this.exportVisible = true
      this.getExportTemplate()
    },
    // 相关职位输入联想
    jobRemoteMethod(query) {
      if (query !== '') {
        this.selectPosition()
      } else {
        this.jobOptions = []
      }
    },
    selectPosition() {
      this.jobLoading = true
      const { jobKeyword: keyword } = this
      const params = {
        keyword,
        maxCount: 999
      }
      selectPosition(params).then(res => {
        this.jobLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.jobOptions = data
        }
      })
    },
    handleJob(e) {
      this.$set(this.query, 'positionId', e)
      this.$emit('searchTable1', this.query)
    },
    // 相关成员输入联想
    memberRemoteMethod(query) {
      if (query !== '') {
        this.selectHhUser()
      } else {
        this.memberOptions = []
      }
    },
    selectHhUser() {
      this.memberLoading = true
      const { memberKeyword: keyword } = this
      const params = {
        keyword,
        maxCount: 999
      }
      selectHhUser(params).then(res => {
        this.memberLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.memberOptions = data
        }
      })
    },
    handleMember(e) {
      this.$set(this.query, 'hhUserIds', e)
      this.$emit('searchTable1', this.query)
    },
    // 访问时间筛选
    handleVisitDate(e) {
      this.$set(this.query, 'startDate', e && e[0])
      this.$set(this.query, 'endDate', e && e[1])
      this.$emit('searchTable1', this.query)
    },
    // 相关行为
    handleAction(e) {
      this.$set(this.query, 'type', e)
      this.$emit('searchTable1', this.query)
    },
    // 是否有手机
    handleMoble(e) {
      this.$set(this.query, 'haveMobile', e)
      this.$emit('searchTable1', this.query)
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/operation.scss';
</style>
