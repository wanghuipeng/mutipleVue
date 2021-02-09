<template>
  <div class="dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400"
      :show-close="false"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div class="main">
        <p
          class="titles"
          style="font-size: 18px; color: #333333; text-align: center; line-height: 25px; margin-bottom: 28px;"
        >{{ title }}</p>
        <div v-if="type === 'confirmInterview'" class="content">
          <p class="title">请确认以下面试安排候选人是否方便参加？</p>
          <p v-if="detail.candidateInterviewList[0].interviewMethod" class="desc">
            <span class="desc-title">面试方式：</span>
            <span
              class="desc-content"
            >{{ detail.candidateInterviewList[0].interviewMethod | filterArr(dictData.dicts.interviewType) }}</span>
          </p>
          <p v-if="detail.candidateInterviewList[0].plannedInterviewTime" class="desc">
            <span class="desc-title">面试时间：</span>
            <span class="desc-content">{{ detail.candidateInterviewList[0].plannedInterviewTime }}</span>
          </p>
          <p class="desc">
            <span class="desc-title">面试地点：</span>
            <span class="desc-content">
              {{ detail.candidateInterviewList[0].interviewProvince | filterCommonDict(dictData.areas) }}
              {{ detail.candidateInterviewList[0].interviewCity | filterLevel2(dictData.areas) }}
              {{ detail.candidateInterviewList[0].interviewArea | filterLevel3(dictData.areas) }}
              {{ detail.candidateInterviewList[0].interviewAddress }}
            </span>
          </p>
          <p v-if="detail.candidateInterviewList[0].contactName" class="desc">
            <span class="desc-title">联系人：</span>
            <span class="desc-content">{{ detail.candidateInterviewList[0].contactName }}</span>
          </p>
          <p v-if="detail.candidateInterviewList[0].contactMobile" class="desc">
            <span class="desc-title">联系方式：</span>
            <span class="desc-content">{{ detail.candidateInterviewList[0].contactMobile }}</span>
          </p>
          <p v-if="detail.candidateInterviewList[0].description" class="desc">
            <span class="desc-title">补充说明：</span>
            <span class="desc-content">{{ detail.candidateInterviewList[0].description }}</span>
          </p>
        </div>
        <div v-else-if="type === 'modifyInterview'" class="content">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="参面时间">
              <el-date-picker
                v-model="form.time"
                type="datetime"
                size="medium"
                value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="请选择候选人可参面时间"
                style="width: 100%;"
                prefix-icon="none"
              />
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="form.desc" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="content">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="取消原因">
              <el-select v-model="form.reson" size="medium" placeholder="请选择" style="width: 100%;">
                <el-option label="候选人主动放弃" value="1"></el-option>
                <el-option label="候选人有offer了" value="2"></el-option>
                <el-option label="其他原因" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="form.desc" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { detail, operation } from '@/api/order' //, operation
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    type: {
      // modifyInterview(修改面试) confirmInterview(确认面试)
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {}
    },
    operateMethod: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      form: {
        time: '',
        reson: '1',
        desc: ''
      },
      detail: {}
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    }),
    dialogVisible() {
      return this.dialog
    }
  },
  created() {
    if (this.type === 'confirmInterview' || this.type === 'modifyInterview') {
      detail({ id: this.info.id }).then(res => {
        if (res.code === '000000') {
          this.detail = res.data.data
        }
      })
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialog', false)
    },
    handleSure() {
      let params = {
        candidateId: this.info.id,
        operateMethod: this.operateMethod,
        operatorType: 1,
        operatorUserId: this.$store.state.userInfo.userId
      }
      if (this.type === 'modifyInterview') {
        params = Object.assign(params, {
          candidateInterviewVO: {
            id: this.detail.candidateInterviewList[0].id,
            round: this.detail.candidateInterviewList[0].round,
            plannedInterviewTime: this.form.time,
            interviewProvince: this.detail.candidateInterviewList[0]
              .interviewProvince,
            interviewCity: this.detail.candidateInterviewList[0].interviewCity,
            interviewAddress: this.detail.candidateInterviewList[0]
              .interviewAddress,
            contactName: this.detail.candidateInterviewList[0].contactName,
            contactMobile: this.detail.candidateInterviewList[0].contactMobile,
            interviewerName: this.detail.candidateInterviewList[0]
              .interviewerName,
            interviewMethod: this.detail.candidateInterviewList[0]
              .interviewMethod,
            description: this.form.desc
          }
        })
      } else if (this.type === 'confirmInterview') {
        params = Object.assign(params, {
          candidateInterviewVO: {
            id: this.detail.candidateInterviewList[0].id,
            round: this.detail.candidateInterviewList[0].round,
            plannedInterviewTime: this.detail.candidateInterviewList[0]
              .plannedInterviewTime,
            interviewProvince: this.detail.candidateInterviewList[0]
              .interviewProvince,
            interviewCity: this.detail.candidateInterviewList[0].interviewCity,
            interviewAddress: this.detail.candidateInterviewList[0]
              .interviewAddress,
            contactName: this.detail.candidateInterviewList[0].contactName,
            contactMobile: this.detail.candidateInterviewList[0].contactMobile,
            interviewerName: this.detail.candidateInterviewList[0]
              .interviewerName,
            interviewMethod: this.detail.candidateInterviewList[0]
              .interviewMethod
          }
        })
      } else {
        if (this.form.reson === '1') {
          this.form.reson = '候选人主动放弃'
        } else if (this.form.reson === '2') {
          this.form.reson = '候选人有offer了'
        } else {
          this.form.reson = '其他原因'
        }
        params = Object.assign(params, {
          reason: this.form.reson,
          remarks: this.form.desc
        })
      }
      console.log(params)
      operation(params).then(res => {
        if (res.code === '000000') {
          this.$emit('reload')
          this.$emit('update:dialog', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  ::v-deep .el-dialog {
    padding: 40px;
    .el-dialog__header,
    .el-dialog__body,
    .el-dialog__footer {
      padding: 0;
    }
    .main {
      .titles {
        font-size: 18px;
        color: #333333;
        text-align: center;
        line-height: 25px;
      }
      .content {
        margin: 28px 0;
        .title {
          font-size: 14px;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
          line-height: 20px;
          text-align: left;
          margin-bottom: 16px;
        }
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: rgba(179, 179, 179, 1);
          line-height: 20px;
          margin-top: 8px;
          .desc-title {
            display: inline-block;
            min-width: 70px;
          }
        }
        .el-icon-arrow-up:before {
          content: '';
          width: 10px;
          height: 16px;
          background: url('~@/assets/images/common/arrow.png') no-repeat;
          background-size: 10px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .el-form-item {
          margin-bottom: 16px;
          .el-form-item__label {
            line-height: 36px;
          }
        }
        .el-select .el-input .el-select__caret {
          transform: rotateZ(0deg);
        }
        .el-input--prefix .el-input__inner {
          padding-left: 12px;
        }
        .el-input__suffix {
          width: 30px;
        }
        .el-input__suffix::before {
          content: '';
          width: 10px;
          height: 16px;
          background: url('~@/assets/images/common/arrow.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .el-textarea__inner {
          padding: 5px 12px;
        }
      }
    }
    .dialog-footer {
      .el-button--default {
        color: #0e68f7;
        border-color: #0e68f7;
      }
      .el-button--primary {
        background-color: #0e68f7;
        border-color: #0e68f7;
        margin-left: 40px;
      }
    }
  }
}
</style>
