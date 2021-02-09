<template>
  <div class="report">
    <!-- 推荐信息 -->
    <div class="report-item">
      <p class="report-item-title">推荐报告</p>
      <div v-if="reportInfo.createTime" class="report-item-desc">
        <p class="report-item-desc-title">推荐时间</p>
        <div class="report-item-desc-info">{{ reportInfo.createTime }}</div>
      </div>
      <div v-if="reportInfo.name" class="report-item-desc">
        <p class="report-item-desc-title">候选人</p>
        <div class="report-item-desc-info">{{ reportInfo.name }}</div>
      </div>
      <!-- <div v-if="reportInfo.communicationTime" class="report-item-desc">
        <p class="report-item-desc-title">沟通时间</p>
        <div class="report-item-desc-info">{{ reportInfo.communicationTime }}</div>
      </div> -->
      <div v-if="reportInfo.currentSalary" class="report-item-desc">
        <p class="report-item-desc-title">目前年薪</p>
        <div class="report-item-desc-info">
          <span v-if="reportInfo.currentSalaryTax === 1">税前</span>
          <span v-else-if="reportInfo.currentSalaryTax === 2">税后</span>
          {{ parseInt(reportInfo.currentSalary) }}元*{{ reportInfo.currentSalaryMonth }}个月
        </div>
      </div>
      <div v-if="reportInfo.currentOtherSalary" class="report-item-desc">
        <p class="report-item-desc-title">其他收入</p>
        <div class="report-item-desc-info">{{ reportInfo.currentOtherSalary }}</div>
      </div>
      <div v-if="reportInfo.motivation" class="report-item-desc">
        <p class="report-item-desc-title">求职动机</p>
        <div
          class="report-item-desc-info"
        >{{ reportInfo.motivation | filterArr( dictData.dicts.jobMotivation) }}</div>
      </div>
      <div v-if="reportInfo.dimissionDate" class="report-item-desc">
        <p class="report-item-desc-title">预计离职期</p>
        <div
          class="report-item-desc-info"
        >{{ reportInfo.dimissionDate | filterArr( dictData.dicts.dimissionDate) }}</div>
      </div>
      <div v-if="reportInfo.expectInterviewTime" class="report-item-desc">
        <p class="report-item-desc-title">面试时间</p>
        <div class="report-item-desc-info">{{ reportInfo.expectInterviewTime }}</div>
      </div>
      <div v-if="reportInfo.reason" class="report-item-desc">
        <p class="report-item-desc-title">推荐理由</p>
        <div class="report-item-desc-info">{{ reportInfo.reason }}</div>
      </div>
    </div>
    <!-- 求职意向 -->
    <div class="report-item">
      <p class="report-item-title">求职期望</p>
      <div v-if="reportInfo.jobStatus" class="report-item-desc">
        <p class="report-item-desc-title">求职状态</p>
        <div
          class="report-item-desc-info"
        >{{ reportInfo.jobStatus | filterArr(dictData.dicts.jobStatus) }}</div>
      </div>
      <div v-if="reportInfo.intentionAnnualSalary || reportInfo.isNegotiated === 1" class="report-item-desc">
        <p class="report-item-desc-title">期望年薪</p>
        <div v-if="reportInfo.isNegotiated === 1" class="report-item-desc-info">
          面议
        </div>
        <div v-else class="report-item-desc-info">
          <span v-if="reportInfo.intentionSalaryTax === 1">税前</span>
          <span v-else-if="reportInfo.intentionSalaryTax === 2">税后</span>
          {{ reportInfo.intentionAnnualSalary / 10000 }}万
        </div>
      </div>
      <div v-if="reportInfo.intentionProvince || reportInfo.intentionCity" class="report-item-desc">
        <p class="report-item-desc-title">期望城市</p>
        <div
          class="report-item-desc-info"
        >{{ reportInfo.intentionProvince | filterCommonDict(dictData.areas) }}{{ reportInfo.intentionCity | filterLevel2(dictData.areas) }}</div>
      </div>
      <div v-if="reportInfo.intentionIndustryId" class="report-item-desc">
        <p class="report-item-desc-title">期望行业</p>
        <div class="report-item-desc-info">
          <span
            v-if="reportInfo.intentionIndustryId && reportInfo.intentionIndustryId.split(',')[0].length === 3"
          >{{ reportInfo.intentionIndustryId | filterCommonDict(dictData.industry) }}</span>
          <span v-else>{{ reportInfo.intentionIndustryId | filterLevels2(dictData.industry) }}</span>
        </div>
      </div>
      <div v-if="reportInfo.intentionPosition" class="report-item-desc">
        <p class="report-item-desc-title">期望职位</p>
        <div class="report-item-desc-info">{{ reportInfo.intentionPosition }}</div>
      </div>
    </div>
    <div v-if="resume">
      <!-- 基本信息 -->
      <div class="report-item">
        <p class="report-item-title">基本信息</p>
        <div class="report-item-desc base-info">
          <div class="base-info-left base-info-item">
            <p class="report-item-desc-title">头像</p>
            <p class="report-item-desc-info">
              <img
                v-if="resume.detail.avatarImg"
                :src="resume.detail.avatarImg"
                style="width:50px; height: 50px; border-radius: 50%;"
              />
              <img
                v-else
                src="../../../assets/images/notice/avatar_unknown.png"
                style="width:50px; height: 50px; border-radius: 50%;"
              />
            </p>
          </div>
          <div v-if="resume.detail.liveCity" class="base-info-right base-info-item">
            <p class="report-item-desc-title">候选人</p>
            <p class="report-item-desc-info">{{ resume.detail.name }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.birthday" class="base-info-left base-info-item">
            <p class="report-item-desc-title">出生年月</p>
            <p class="report-item-desc-info">{{ resume.detail.birthday }}</p>
          </div>
          <div v-if="resume.detail.liveCity" class="base-info-right base-info-item">
            <p class="report-item-desc-title">性别</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.gender | filterArr(dictData.dicts.gender) }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.mobile" class="base-info-left base-info-item">
            <p class="report-item-desc-title">手机号码</p>
            <p class="report-item-desc-info">{{ resume.detail.mobile }}</p>
          </div>
          <div v-if="resume.detail.email" class="base-info-right base-info-item">
            <p class="report-item-desc-title">联系邮箱</p>
            <p class="report-item-desc-info">{{ resume.detail.email }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.graduateSchool" class="base-info-left base-info-item">
            <p class="report-item-desc-title">毕业学校</p>
            <p class="report-item-desc-info">{{ resume.detail.graduateSchool }}</p>
          </div>
          <div class="base-info-right base-info-item">
            <p v-if="resume.detail.degreeCode" class="report-item-desc-title">最高学历</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.degreeCode | filterArr(resumeDict.degree) }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.currentCompanyName" class="base-info-left base-info-item">
            <p class="report-item-desc-title">目前公司</p>
            <p class="report-item-desc-info ellipsis">{{ resume.detail.currentCompanyName }}</p>
          </div>
          <div v-if="resume.detail.currentPosition" class="base-info-right base-info-item">
            <p class="report-item-desc-title">目前职位</p>
            <p class="report-item-desc-info">{{ resume.detail.currentPosition }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.startWorkMonth" class="base-info-left base-info-item">
            <p class="report-item-desc-title">工作年限</p>
            <p class="report-item-desc-info">{{ resume.detail.startWorkMonth }}</p>
          </div>
          <div v-if="resume.detail.liveCity" class="base-info-right base-info-item">
            <p class="report-item-desc-title">所在城市</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.liveCity | filterLevel2(dictData.areas) }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.national" class="base-info-left base-info-item">
            <p class="report-item-desc-title">民族</p>
            <p class="report-item-desc-info">{{ resume.detail.national }}</p>
          </div>
          <div v-if="resume.detail.political" class="base-info-right base-info-item">
            <p class="report-item-desc-title">政治面貌</p>
            <p class="report-item-desc-info">{{ resume.detail.political }}</p>
          </div>
        </div>
        <div v-if="resume.detail.registerCity || resume.detail.nativeCit" class="report-item-desc base-info">
          <div v-if="resume.detail.registerCity" class="base-info-left base-info-item">
            <p class="report-item-desc-title">户籍</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.registerCity | filterLevel2(dictData.areas) }}</p>
          </div>
          <div v-if="resume.detail.nativeCity" class="base-info-right base-info-item">
            <p class="report-item-desc-title">籍贯</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.nativeCity | filterLevel2(dictData.areas) }}</p>
          </div>
        </div>
        <div class="report-item-desc base-info">
          <div v-if="resume.detail.maritalStatus" class="base-info-left base-info-item">
            <p class="report-item-desc-title">婚姻状况</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.maritalStatus | filterArr(dictData.dicts.maritalStatus) }}</p>
          </div>
          <div v-if="resume.detail.fertilityStatus" class="base-info-right base-info-item">
            <p class="report-item-desc-title">生育状况</p>
            <p
              class="report-item-desc-info"
            >{{ resume.detail.fertilityStatus | filterArr(dictData.dicts.fertilityStatus) }}</p>
          </div>
        </div>
      </div>
      <!-- 教育经历 -->
      <div v-if="resume.educations.length > 0" class="report-item">
        <p class="report-item-title">教育经历</p>
        <div v-for="item in resume.educations" :key="item.id" class="education">
          <div class="education-left">
            <img class="education-left-icon" src="../../../assets/images/order/education.png" />
            <div class="education-left-desc">
              <p>{{ item.school }} · {{ item.isUnifiedStrategy === 1 ? '统招' : '非统招' }}{{ item.degreeCode | filterArr(resumeDict.degree) }}</p>
              <p>{{ item.speciality }}</p>
              <p v-if="item.summary">备注说明：{{ item.summary }}</p>
            </div>
          </div>
          <div class="education-right">{{ item.startDate }} - {{ item.endDate }}</div>
        </div>
      </div>
      <!-- 工作经历 -->
      <div v-if="resume.experiences.length > 0" class="report-item">
        <p class="report-item-title">工作经历</p>
        <div v-for="item in resume.experiences" :key="item.id" class="box">
          <div class="education">
            <div class="education-left">
              <img class="education-left-icon" src="../../../assets/images/order/work.png" />
              <div class="education-left-desc">
                <p style="color: #333333;">{{ item.companyName }}</p>
                <p>{{ item.title }}</p>
              </div>
            </div>
            <div class="education-right">{{ item.startDate }} - {{ item.endDate }}</div>
          </div>
          <div v-if="item.industryId2" class="report-item-desc">
            <p class="report-item-desc-title">所属行业</p>
            <div
              class="report-item-desc-info"
            >{{ item.industryId2 | filterLevel2(dictData.industry) }}</div>
          </div>
          <div v-if="item.companySize" class="report-item-desc">
            <p class="report-item-desc-title">公司规模</p>
            <div
              class="report-item-desc-info"
            >{{ item.companySize | filterArr(dictData.dicts.enterpriseScale) }}</div>
          </div>
          <div v-if="item.companyType" class="report-item-desc">
            <p class="report-item-desc-title">公司性质</p>
            <div
              class="report-item-desc-info"
            >{{ item.companyType | filterArr(dictData.dicts.enterpriseProperty) }}</div>
          </div>
          <div v-if="item.companyIntroduce" class="report-item-desc">
            <p class="report-item-desc-title">公司介绍</p>
            <div class="report-item-desc-info">{{ item.companyIntroduce }}</div>
          </div>
          <div v-if="item.department" class="report-item-desc">
            <p class="report-item-desc-title">所属部门</p>
            <div class="report-item-desc-info">{{ item.department }}</div>
          </div>
          <div v-if="item.responsibleArea" class="report-item-desc">
            <p class="report-item-desc-title">负责区域</p>
            <div class="report-item-desc-info">{{ item.responsibleArea }}</div>
          </div>
          <div v-if="item.isOverseas" class="report-item-desc">
            <p class="report-item-desc-title">是否海外</p>
            <div class="report-item-desc-info">{{ Number(item.isOverseas) === 1 ? '是' : '否' }}</div>
          </div>
          <div v-if="item.leader" class="report-item-desc">
            <p class="report-item-desc-title">汇报对象</p>
            <div class="report-item-desc-info">{{ item.leader }}</div>
          </div>
          <div v-if="item.underlingNumber" class="report-item-desc">
            <p class="report-item-desc-title">下属人数</p>
            <div class="report-item-desc-info">{{ item.underlingNumber }}人</div>
          </div>
          <div v-if="item.summary" class="report-item-desc">
            <p class="report-item-desc-title">工作职责</p>
            <div class="report-item-desc-info">{{ item.summary }}</div>
          </div>
          <div v-if="item.achievement" class="report-item-desc">
            <p class="report-item-desc-title">工作业绩</p>
            <div class="report-item-desc-info">{{ item.achievement }}</div>
          </div>
          <div v-if="item.reasonOfLeaving" class="report-item-desc">
            <p class="report-item-desc-title">离职原因</p>
            <div class="report-item-desc-info">{{ item.reasonOfLeaving }}</div>
          </div>
        </div>
      </div>
      <!-- 项目经历 -->
      <div v-if="resume.projects.length > 0" class="report-item">
        <p class="report-item-title">项目经历</p>
        <div v-for="item in resume.projects" :key="item.id" class="box">
          <div class="education">
            <div class="education-left">
              <div class="education-left-desc">
                <p>{{ item.projectName }}</p>
              </div>
            </div>
            <div class="education-right">{{ item.startDate }} - {{ item.endDate }}</div>
          </div>
          <div v-if="item.title" class="report-item-desc">
            <p class="report-item-desc-title">职务</p>
            <div class="report-item-desc-info">{{ item.title }}</div>
          </div>
          <div v-if="item.companyName" class="report-item-desc">
            <p class="report-item-desc-title">所在公司</p>
            <div class="report-item-desc-info">{{ item.companyName }}</div>
          </div>
          <div v-if="item.projectDescription" class="report-item-desc">
            <p class="report-item-desc-title">项目描述</p>
            <div class="report-item-desc-info">{{ item.projectDescription }}</div>
          </div>
          <div v-if="item.responsibilities" class="report-item-desc">
            <p class="report-item-desc-title">项目职责</p>
            <div class="report-item-desc-info">{{ item.responsibilities }}</div>
          </div>
          <div v-if="item.projectAchievement" class="report-item-desc">
            <p class="report-item-desc-title">项目业绩</p>
            <div class="report-item-desc-info">{{ item.projectAchievement }}</div>
          </div>
        </div>
      </div>
      <!-- 培训经历 -->
      <div v-if="resume.training.length > 0" class="report-item">
        <p class="report-item-title">培训经历</p>
        <div v-for="item in resume.training" :key="item.id" class="box">
          <div class="education">
            <div class="education-left">
              <div class="education-left-desc">
                <p>{{ item.trainingInstitution }}</p>
              </div>
            </div>
            <div class="education-right">{{ item.startDate }} - {{ item.endDate }}</div>
          </div>
          <div class="report-item-desc">
            <p class="report-item-desc-title">培训课程</p>
            <div class="report-item-desc-info">{{ item.trainingCourse }}</div>
          </div>
        </div>
      </div>
      <!-- 语言能力 -->
      <div v-if="resume.languages.length > 0" class="report-item">
        <p class="report-item-title">语言能力</p>
        <div v-for="item in resume.languages" :key="item.id" class="language">
          <p class="report-item-desc-title">
            <span>语种：{{ item.languages }}</span>
          </p>
          <div v-if="item.listeningSpeakingSkills" class="report-item-desc-title">
            <span
              v-if="/^[0-9]+.?[0-9]*$/.test(item.listeningSpeakingSkills)"
            >口语能力：{{ item.listeningSpeakingSkills | filterArr(dictData.dicts.readListenSkills) }}</span>
            <span v-else>口语能力：{{ item.listeningSpeakingSkills }}</span>
          </div>
          <div v-if="item.readingWritingSkills" class="report-item-desc-title">
            <span
              v-if="/^[0-9]+.?[0-9]*$/.test(item.readingWritingSkills)"
            >书面能力：{{ item.readingWritingSkills | filterArr(dictData.dicts.readListenSkills) }}</span>
            <span v-else>书面能力：{{ item.readingWritingSkills }}</span>
          </div>
          <div v-if="item.level" class="report-item-desc-info">等级：{{ item.level }}</div>
        </div>
      </div>
      <!-- 证书信息 -->
      <div v-if="resume.cerInfo && resume.cerInfo.length > 0" class="report-item">
        <p class="report-item-title">证书信息</p>
        <div v-for="item in resume.cerInfo" :key="item.id">
          <div class="report-item-desc">
            <p>{{ item.nameOfCertificate }}</p>
          </div>
          <div v-if="item.receivingDate" class="report-item-desc">
            <p class="report-item-desc-title">获取时间</p>
            <div class="report-item-desc-info">{{ item.receivingDate }}</div>
          </div>
          <div v-if="item.score" class="report-item-desc">
            <p class="report-item-desc-title">描述</p>
            <div class="report-item-desc-info">{{ item.score }}</div>
          </div>
        </div>
      </div>
      <!-- 自我评价 -->
      <div v-if="resume.detail.personal" class="report-item">
        <p class="report-item-title">自我评价</p>
        <div class="report-item-desc">
          <p>{{ resume.detail.personal }}</p>
        </div>
      </div>
      <!-- 附加信息 -->
      <div v-if="resume.detail.attachmentInformation" class="report-item">
        <p class="report-item-title">附加信息</p>
        <div class="report-item-desc">
          <p>{{ resume.detail.attachmentInformation }}</p>
        </div>
      </div>
      <!-- 我的作品 -->
      <div v-if="resume.opus.length > 0" class="report-item">
        <p class="report-item-title">我的作品</p>
        <div v-for="item in resume.opus" :key="item.id">
          <div v-if="item.opusName" class="report-item-desc">
            <p class="report-item-desc-title">作品附件</p>
            <div class="report-item-desc-info">
              {{ item.opusName }}
              <el-link
                v-if="item.opusUrl"
                type="primary"
                :href="`/api/common/download?dbPath=${item.opusUrl}`"
                :underline="false"
                style="margin-left: 10px;"
              >下载</el-link>
            </div>
          </div>
          <div v-if="item.fileUrl" class="report-item-desc">
            <p class="report-item-desc-title">作品地址</p>
            <div class="report-item-desc-info">
              <el-link type="primary">{{ item.fileUrl }}</el-link>
            </div>
          </div>
          <div v-if="item.opusExplain" class="report-item-desc">
            <p class="report-item-desc-title">作品说明</p>
            <div class="report-item-desc-info">{{ item.opusExplain }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/common'
import resumeDict from '@/assets/js/resume'
export default {
  props: {
    resume: {
      type: Object,
      default: () => {}
    },
    reportInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resumeDict: []
    }
  },
  computed: {
    dictData() {
      return this.$store.state.common.dictData
    },
    birthday() {
      if (this.resume.detail.birthday) {
        return (
          new Date().getFullYear() -
          formatDate(new Date(this.resume.detail.birthday), 'yyyy')
        )
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.resumeDict = resumeDict
  }
}
</script>

<style lang="scss" scoped>
.report {
  padding: 0 20px;
  .report-item {
    padding: 20px 0;
    border-bottom: 1px solid #b3b3b3;
    &:last-child {
      border: 0;
    }
    .report-item-title {
      font-size: 16px;
      line-height: 22px;
      color: #333333;
      font-weight: 600;
    }
    .report-item-desc {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      columns: #4d4d4d;
      line-height: 20px;
      margin-top: 12px;
      white-space: pre-wrap;
      .report-item-desc-title {
        min-width: 85px;
        margin-right: 20px;
        color: #666666;
      }
      .report-item-desc-info {
        flex: 1;
        white-space: pre-wrap;
        color: #333333;
        .el-link {
          color: #1678f9;
        }
      }
    }
    .base-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      .base-info-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .base-info-left {
        display: flex;
        flex-direction: row;
        width: 50%;
        .report-item-desc-info {
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap !important;
          box-sizing: border-box;
        }
      }
      .base-info-right {
        width: 50%;
      }
    }
    .education {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      padding: 20px 0;
      background: url('~@/assets/images/order/cut-off_rule.png') repeat-x;
      background-position: 0 100%;
      font-size: 14px;
      &:last-child {
        background: 0;
      }
      .education-left {
        display: flex;
        flex-direction: row;
        .education-left-icon {
          width: 48px;
          height: 48px;
          margin-right: 16px;
        }
        .education-left-desc {
          p {
            margin-bottom: 10px;
            &:last-child {
              margin: 0;
              max-width: 600px;
            }
          }
        }
      }
    }
    .box {
      padding: 20px 0;
      background: url('~@/assets/images/order/cut-off_rule.png') repeat-x;
      background-position: 0 100%;
      &:last-child {
        background: 0;
      }
      .education {
        padding: 0;
        background: none;
        font-size: 14px;
        color: #666666;
      }
    }
    .language {
      display: flex;
      flex-direction: row;
      color: #666666;
      padding: 20px 0;
      background: url('~@/assets/images/order/cut-off_rule.png') repeat-x;
      background-position: 0 100%;
      &:last-child {
        background: 0;
      }
      .report-item-desc-title {
        margin-right: 40px;
      }
    }
  }
}
</style>
