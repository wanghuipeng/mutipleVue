<template>
  <div v-loading="rightLoading" class="resume-order-supplier">
    <!-- 头部 -->
    <div class="order-cont">
      <template v-if="statusNo">
        <!-- 选择推荐报告 -->
        <div class="select-input" @click="selectShow=false">
          <div class="value" @click.stop="selectShow=!selectShow">
            <span class="id">#{{ selectValue.applyId }}</span>
            <span class="job-name">{{ selectValue.positionName }}&nbsp;-&nbsp;</span>
            <span class="comp-name">{{ selectValue.companyName }}</span>
          </div>
          <ul v-if="selectShow" class="list">
            <li v-for="item in arr" :key="item.applyId" @click="checkIt(item)">
              <span class="id">#{{ item.applyId }}</span>
              <span class="job-name">{{ item.positionName }}</span>
              <span class="comp-name">{{ item.companyName }}</span>
            </li>
          </ul>
        </div>
        <!-- 步骤条 -->
        <el-steps :active="active" class="steps" align-center>
          <el-step v-if="active === 1" title="简历收集" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="简历收集" icon="el-icon"></el-step>
          <el-step v-if="active === 2" title="初筛" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="初筛" icon="el-icon"></el-step>
          <el-step title="面试" icon="el-icon"></el-step>
          <el-step title="Offer/采用" icon="el-icon"></el-step>
          <el-step title="过保" icon="el-icon"></el-step>
        </el-steps>
        <!-- 操作按钮 -->
        <div v-if="selectValue.statusNo === 11" class="btns">
          <el-button
            v-loading="getLoading"
            size="mini"
            type="primary"
            @click="adoptDialog(selectValue.applyId, false)"
          >采用</el-button>
          <el-button
            v-loading="noGetLoading"
            class="btn-orange"
            size="mini"
            @click="noAdoptDialog(selectValue.applyId)"
          >不采用</el-button>
        </div>
        <div v-if="selectValue.statusNo === 13 || selectValue.statusNo === 23" class="btns">
          <el-button
            size="mini"
            type="primary"
            class="block"
            @click="adoptDialog(selectValue.applyId, true)"
          >重新采用</el-button>
        </div>
        <div v-if="selectValue.statusNo === 10" class="btns">
          <el-button
            v-if="row.applyUserType === 2"
            class="block"
            size="mini"
            type="primary"
            @click="introduceDialog"
          >查看</el-button>
        </div>
        <!-- 状态 -->
        <div v-if="operateLogList && operateLogList.length > 0" class="remarks">
          <ul v-for="(item,index) in operateLogList" :key="index">
            <li>
              <p class="title">{{ item.operatorUserName }}</p>
              <p class="result">
                <span class="label">状态：</span>
                {{ item.description || '-' }}
              </p>
              <p class="remark">
                <span class="label">备注：</span>
                {{ item.remarks || '-' }}
              </p>
            </li>
          </ul>
        </div>
      </template>
      <div v-else-if="statusNo === 0" class="empty">
        <img src="~@/assets/images/order/blank.png" />
        <p>该候选人暂无相关投递记录</p>
      </div>
    </div>
    <!-- 采用简历弹窗 -->
    <el-dialog
      title="请确认是否采用该简历"
      append-to-body
      :visible.sync="adoptDialogVisible"
      width="500px"
      center
    >
      <div class="main">
        <el-form ref="adoptForm" :model="adoptForm" label-width="80px">
          <el-form-item label="备注" prop="desc" size="small">
            <el-input v-model="adoptForm.desc" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="adoptDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm1('adoptForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 不采用简历弹窗 -->
    <el-dialog
      title="请确认是否采用该简历"
      append-to-body
      :visible.sync="noAdoptDialogVisible"
      width="500px"
      center
    >
      <div class="main">
        <el-form ref="noAdoptForm" :model="noAdoptForm" :rules="noAdoptRules" label-width="110px">
          <el-form-item label="不合适原因" prop="reason" size="small">
            <el-select v-model="noAdoptForm.reason" placeholder="请选择不适合原因" style="width: 100%;">
              <el-option
                v-for="item in dictData.dicts.noUserReason"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="desc" size="small">
            <el-input v-model="noAdoptForm.desc" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="noAdoptDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm2('noAdoptForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 转介绍信息 -->
    <el-dialog title="转介绍信息" append-to-body :visible.sync="introduceDialogVisible" width="500px">
      <div class="introduceInfo">
        <p v-if="introduceInfo.name">姓名：{{ introduceInfo.name }}</p>
        <p v-if="introduceInfo.mobile">手机：{{ introduceInfo.mobile }}</p>
        <p v-if="introduceInfo.email">邮箱：{{ introduceInfo.email }}</p>
        <p v-if="introduceInfo.companyName">所在公司：{{ introduceInfo.companyName }}</p>
        <p v-if="introduceInfo.positionTitle">TITLE：{{ introduceInfo.positionTitle }}</p>
        <p v-if="introduceInfo.introduction">推荐理由：{{ introduceInfo.introduction }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getApplyListByResumeId, getShareApplyInfo } from '@/api/resume'
import { mapState } from 'vuex'
import { insertShareApplyLogBO } from '@/api/thread'

export default {
  props: {
    resumeId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      getLoading: false,
      noGetLoading: false,
      rightLoading: true,
      operateLogList: [],
      selectShow: false,
      arr: [],
      active: 1,
      activeName: '1',
      selectValue: '',
      statusNo: null,
      applyUserType: null,
      adoptDialogVisible: false,
      noAdoptDialogVisible: false,
      adoptForm: {
        desc: ''
      },
      noAdoptForm: {
        reason: '',
        desc: ''
      },
      noAdoptRules: {
        reason: [
          { required: true, message: '请选择不合适原因', trigger: 'change' }
        ]
      },
      introduceDialogVisible: false,
      introduceInfo: ''
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    this.getApplyListByResumeId()
  },
  methods: {
    adoptDialog(id, val) {
      this.id = id
      this.againAdopt = val
      this.adoptForm.desc = ''
      this.adoptDialogVisible = true
    },
    // 不采用弹窗
    noAdoptDialog(id) {
      this.id = id
      this.noAdoptForm.reason = ''
      this.noAdoptForm.desc = ''
      this.noAdoptDialogVisible = true
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            applyId: this.selectValue.applyId,
            operateMethod: this.againAdopt ? 4 : 2,
            remarks: this.adoptForm.desc
          }
          this.operate(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            applyId: this.selectValue.applyId,
            operateMethod: 3,
            description: this.noAdoptForm.reason,
            remarks: this.noAdoptForm.desc
          }
          this.operate(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 操作
    operate(params) {
      insertShareApplyLogBO(params)
        .then(res => {
          console.log(res)
          if (res.code === '000000') {
            this.adoptDialogVisible = false
            this.noAdoptDialogVisible = false
            this.$emit('reload')
            if (params.operateMethod === 2) {
              this.$message.success('简历已采用')
            } else if (params.operateMethod === 3) {
              this.$message.success('简历未采用')
            } else if (params.operateMethod === 4) {
              this.$message.success('简历重新采用')
            }
            this.getShareApplyInfo(this.selectValue.applyId)
          }
        })
        .catch(err => {
          this.adoptDialogVisible = false
          this.noAdoptDialogVisible = false
          console.log(err)
        })
    },
    // 介绍信息
    introduceDialog() {
      // this.introduceInfo = info
      // this.introduceDialogVisible = true
      const params = {
        applyId: this.selectValue.applyId,
        operateMethod: 1
      }
      this.operate(params)
    },
    checkIt(item) {
      console.log(item)
      this.selectValue = item
      this.getShareApplyInfo(item.applyId)
    },
    // 获取简历对应的订单列表
    getApplyListByResumeId() {
      this.rightLoading = true
      const params = {
        resumeId: this.$props.resumeId
      }
      getApplyListByResumeId(params).then(res => {
        this.rightLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.selectValue = data && data[0]
          data &&
            data[0] &&
            data[0].applyId &&
            this.getShareApplyInfo(data && data[0] && data[0].applyId)
          this.arr = data
          if ((data && data.length === 0) || !data) {
            this.statusNo = 0
          }
        }
      })
    },
    // 获取分享订单信息
    getShareApplyInfo(applyId) {
      const params = {
        applyId
      }
      getShareApplyInfo(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.statusNo = data && data.statusNo
          this.applyUserType = data && data.applyUserType
          this.operateLogList = data && data.operateLogList
          if (this.statusNo === 11) {
            // 待反馈（简历收集）
            this.active = 1
          } else if (this.statusNo === 12 || this.statusNo === 13) {
            // 已采用、未采用（筛选）
            this.active = 2
          }
          console.log(2222222, this.statusNo, this.operateLogList)
        }
      })
    }
  }
}
</script>
<style  lang="scss">
.resume-order-supplier {
  min-height: 50px;
  padding: 24px;
  .empty {
    padding: 50px;
    img {
      display: block;
      width: 220px;
      height: 168px;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      color: #b3b3b3;
      text-align: center;
      margin-top: 30px;
    }
  }
  .order-cont {
    .btns {
      display: flex;
      justify-content: space-between;
      button {
        height: 28px;
        border-radius: 2px;
        &:first-child {
          width: 369px;
          margin-right: 16px;
        }
        &.btn-orange {
          color: #f64f4f;
          border-color: #f64f4f;
        }
        &.block {
          width: 100%;
        }
      }
    }
  }
  .steps {
    margin: 24px 0;
    .el-step__title {
      color: #8d9299;
      font-size: 11px;
      &.is-finish {
        color: #1678f9;
      }
    }
    .el-icon {
      width: 12px;
      height: 12px;
      display: inline-block;
      background: url('~@/assets/images/resume/resumeDetailSupplier/gray_circle.png')
        no-repeat;
      background-size: 12px;
    }
    .is-finish {
      .el-icon {
        width: 12px;
        height: 12px;
        background: url('~@/assets/images/resume/resumeDetailSupplier/blue_circle.png')
          no-repeat;
        background-size: 12px;
        &.el-icon-active {
          width: 20px;
          height: 20px;
          background: url('~@/assets/images/resume/resumeDetailSupplier/active_circle.png')
            no-repeat !important;
          background-size: 20px !important;
        }
      }
    }
  }
  .select-input {
    width: 100%;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    color: #282c32;
    font-size: 13px;
    padding: 0 16px;
    border: 1px solid #e9edf1;
    border-radius: 2px;
    box-sizing: border-box;
    position: relative;
    .list {
      position: absolute;
      left: 0;
      top: 28px;
      width: 100%;
      z-index: 10;
      list-style: none;
      padding: 6px 0;
      margin: 0;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      margin: 5px 0;
      li {
        padding: 6px 16px;
        cursor: pointer;
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
    .value {
      span {
        &.id {
          margin-right: 8px;
        }
        &.comp-name {
          color: #8d9299;
        }
      }
    }
  }
  .remarks {
    background: #f9fafb;
    border-radius: 2px;
    padding: 16px;
    margin-top: 24px;
    ul {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      li {
        .name {
          color: #0d121a;
          font-size: 14px;
        }
        .title {
          color: #0d121a;
          position: relative;
          font-size: 14px;
          padding-left: 12px;
          font-weight: 600;
          &::before {
            content: '';
            width: 4px;
            height: 16px;
            display: inline-block;
            position: absolute;
            background: #1678f9;
            left: 0;
            top: 2px;
          }
        }
        .label {
          color: #8d9299;
        }
        p {
          font-size: 13px;
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .result,
        .remark {
          color: #0d121a;
        }
      }
    }
  }
}
</style>
