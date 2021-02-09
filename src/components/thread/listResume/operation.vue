<template>
  <div class="thread-operation">
    <el-form :inline="true">
      <div>
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
          <el-date-picker
            v-model="visitDate"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            style="width: 300px"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            @change="handleVisitDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="status"
            placeholder="处理状态"
            clearable
            style="width: 165px"
            size="small"
            @change="handleStatus"
          >
            <el-option
              v-for="item in dictData.dicts.deliveryStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="type"
            placeholder="简历渠道"
            clearable
            style="width: 165px"
            size="small"
            @change="handleType"
          >
            <el-option
              v-for="item in dictData.dicts.deliveryType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="false">
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
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectPosition, selectHhUser } from '@/api/thread'

export default {
  data() {
    return {
      status: '', // 状态
      type: '', // 类型
      visitDate: '', // 推荐时间
      jobName: '', // 相关职位
      memberName: '', // 相关成员
      jobOptions: [], // 相关职位
      memberOptions: [], // 相关成员
      jobLoading: false,
      memberLoading: false,
      query: {},
      jobKeyword: null,
      memberKeyword: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    console.log(this.dictData)
    // 相关职位
    this.selectPosition()
    // 相关成员
    this.selectHhUser()
  },
  methods: {
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
      this.$emit('searchTable3', this.query)
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
      this.$emit('searchTable3', this.query)
    },
    // 推荐时间筛选
    handleVisitDate(e) {
      console.log(e)
      this.$set(this.query, 'applyStartTime', e && e[0] + ' 00:00:00')
      this.$set(this.query, 'applyEndTime', e && e[1] + ' 23:59:59')
      this.$emit('searchTable3', this.query)
    },
    // 全部状态
    handleStatus(e) {
      const val = e === '0' ? null : e
      console.log(e, val)
      this.$set(this.query, 'statusNo', val)
      this.$emit('searchTable3', this.query)
    },
    handleType(e) {
      const val = e === '0' ? null : e
      console.log(e)
      this.$set(this.query, 'applyUserType', val)
      this.$emit('searchTable3', this.query)
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/thread/operation.scss';
</style>
