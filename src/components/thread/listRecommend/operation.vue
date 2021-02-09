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
            start-placeholder="推荐开始时间"
            end-placeholder="推荐结束时间"
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
      :flag="'ZJS'"
      @closeIt="closeIt"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectPosition, selectHhUser, getExportTemplate } from '@/api/thread'
import ExportSet from '@/components/thread/exportSet'

export default {
  components: {
    ExportSet
  },
  data() {
    return {
      visitDate: '', // 推荐时间
      jobName: '', // 相关职位
      memberName: '', // 相关成员
      jobOptions: [], // 相关职位
      memberOptions: [], // 相关成员
      jobLoading: false,
      memberLoading: false,
      query: {},
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
    // 相关职位
    this.selectPosition()
    // 相关成员
    this.selectHhUser()
  },
  methods: {
    getExportTemplate() {
      this.checkList = []
      this.setList = []
      const params = {
        typeCode: 'ZJS'
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
      this.$emit('searchTable2', this.query)
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
      this.$emit('searchTable2', this.query)
    },
    // 推荐时间筛选
    handleVisitDate(e) {
      console.log(e)
      this.$set(this.query, 'startDate', e && e[0])
      this.$set(this.query, 'endDate', e && e[1])
      this.$emit('searchTable2', this.query)
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/operation.scss';
</style>
