<template>
  <div v-show="reportTplInfo.recommendReport.isHave" class="wrap-box">
    <!-- 顶部信息 -->
    <top-bar :position-info="positionInfo" :company-info="companyInfo" />
    <!-- 主体区域 -->
    <div class="wrap-main">
      <!-- 页头提示 -->
      <div class="main-notice">发送推荐报告前，请先预览确认推荐报告填写无误</div>
      <!-- 标题 -->
      <div class="main-title">{{ reportInfo.form.reportTitle }}</div>
      <!-- 推荐信息 -->
      <div v-if="reportTplInfo.recommendReport.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">推荐信息</span>
        </p>
        <div class="panel-body">
          <el-form
            ref="reportInfo"
            class="edit-form"
            :model="reportInfo.form"
            :rules="reportInfo.rules"
            label-width="100px"
          >
            <el-col :span="24">
              <el-form-item label="推荐时间：">
                <span>{{ reportInfo.form.createTime }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.rcommendation_reason.isHave" :span="24">
              <el-form-item label="推荐理由：">
                <span>{{ reportInfo.form.reason }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.job_motive.isHave" :span="24">
              <el-form-item label="求职动机：">
                <span>{{ reportInfo.form.motivation | filterCommonDict(dictData.dicts.jobMotivation) }}</span>
              </el-form-item>
            </el-col>
            <el-col
              v-if="reportTplInfo.recommendReport.expected_separation_period.isHave"
              :span="24"
            >
              <el-form-item label="离职期：">
                <span>{{ reportInfo.form.dimissionDate | filterCommonDict(dictData.dicts.dimissionDate) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.current_annual_salary.isHave" :span="24">
              <el-form-item label="目前年薪：">
                <span>{{ reportInfo.form.currentSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ reportInfo.form.currentSalary * reportInfo.form.currentSalaryMonth / 10000 }}万 ({{ reportInfo.form.currentSalary }} × {{ reportInfo.form.currentSalaryMonth }}个月)</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
              <el-form-item label="其他收入：">
                <span>{{ reportInfo.form.currentOtherSalary }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave" :span="24">
              <el-form-item label="期望年薪：">
                <span
                  v-if="reportInfo.form.isNegotiated !== 1"
                >{{ reportInfo.form.intentionSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ reportInfo.form.intentionAnnualSalary }}万/年</span>
                <span v-else>面议</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.expected_interview_time.isHave" :span="24">
              <el-form-item label="面试时间：">
                <span>{{ reportInfo.form.expectInterviewTime | filterCommonDict(dictData.dicts.expectInterviewTime) }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 基本信息 -->
      <div v-if="reportTplInfo.baseInfo.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">基本信息</span>
        </p>
        <div class="panel-body">
          <el-form
            ref="base"
            class="edit-form"
            :model="resumeInfo.base.form"
            :rules="resumeInfo.base.rules"
            label-width="100px"
          >
            <el-col v-if="reportTplInfo.baseInfo.head_portrait.isHave" :span="12">
              <el-form-item label="头像：">
                <span>
                  <img
                    v-if="resumeInfo.base.form.avatarImg"
                    :src="resumeInfo.base.form.avatarImg"
                    class="avatar-img"
                  />
                  <template v-else>
                    <img
                      v-if="resumeInfo.base.form.gender === 1"
                      class="avatar-img"
                      src="~@/assets/images/common/man_avatar.png"
                    />
                    <img
                      v-else-if="resumeInfo.base.form.gender === 2"
                      class="avatar-img"
                      src="~@/assets/images/common/women_avatar.png"
                    />
                    <img v-else src="~@/assets/images/common/avatar.png" class="avatar-img" />
                  </template>
                </span>
              </el-form-item>
            </el-col>
            <el-col
              v-if="reportTplInfo.baseInfo.name.isHave || reportTplInfo.baseInfo.gender.isHave"
              :span="12"
            >
              <el-form-item label="姓名：">
                <span>{{ resumeInfo.base.form.name }}{{ resumeInfo.base.form.gender === 1 ? '先生' : '女士' }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.city.isHave" :span="12">
              <el-form-item label="所在地：">
                <span>{{ resumeInfo.base.form.liveCity | filterLevel2(dictData.areas) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.native_place.isHave" :span="12">
              <el-form-item label="籍贯：">
                <span>{{ resumeInfo.base.form.nativeCity | filterLevel2(dictData.areas) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.household_register.isHave" :span="12">
              <el-form-item label="户籍：">
                <span>{{ resumeInfo.base.form.registerCity | filterLevel2(dictData.areas) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.nation.isHave" :span="12">
              <el-form-item label="民族：">
                <span>{{ resumeInfo.base.form.national }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.political_outlook.isHave" :span="12">
              <el-form-item label="政治面貌：">
                <span>{{ resumeInfo.base.form.political }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.marital_status.isHave" :span="12">
              <el-form-item label="婚姻状况：">
                <span>{{ resumeInfo.base.form.maritalStatus | filterCommonDict(dictData.dicts.maritalStatus) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.fertility_status.isHave" :span="12">
              <el-form-item label="生育状况：">
                <span>{{ resumeInfo.base.form.fertilityStatus | filterCommonDict(dictData.dicts.fertilityStatus) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.phone.isHave" :span="12">
              <el-form-item label="手机：">
                <span>{{ resumeInfo.base.form.mobile }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.email.isHave" :span="12">
              <el-form-item label="邮箱：">
                <span>{{ resumeInfo.base.form.email }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.date_of_birth.isHave" :span="12">
              <el-form-item label="年龄：">
                <span>{{ resumeInfo.base.form.birthday | filterBirthday }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.working_life.isHave" :span="12">
              <el-form-item label="工作年限：">
                <span>{{ resumeInfo.base.form.startWorkMonth | filterYearMonth }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.current_company.isHave" :span="12">
              <el-form-item label="目前公司：">
                <span>{{ resumeInfo.base.form.currentCompanyName }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.current_position.isHave" :span="12">
              <el-form-item label="目前职位：">
                <span>{{ resumeInfo.base.form.currentPosition }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.university_graduated.isHave" :span="12">
              <el-form-item label="毕业院校：">
                <span>{{ resumeInfo.base.form.graduateSchool }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.baseInfo.highest_academic_qualifications.isHave" :span="12">
              <el-form-item label="最高学历：">
                <span>{{ resumeInfo.base.form.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 求职意向 -->
      <div v-if="reportTplInfo.jobExpectation.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">求职意向</span>
        </p>
        <div class="panel-body">
          <el-form
            ref="intention"
            class="edit-form"
            :model="resumeInfo.intention.form"
            :rules="resumeInfo.intention.rules"
            label-width="100px"
          >
            <el-col v-if="reportTplInfo.jobExpectation.job_status.isHave" :span="24">
              <el-form-item label="求职状态：">
                <span>{{ resumeInfo.intention.form.jobStatus | filterCommonDict(dictData.dicts.jobStatus) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.current_annual_salary.isHave" :span="24">
              <el-form-item label="目前年薪：">
                <span>{{ resumeInfo.intention.form.currentSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ resumeInfo.intention.form.currentSalary * resumeInfo.intention.form.currentSalaryMonth / 10000 }}万 ({{ resumeInfo.intention.form.currentSalary }} × {{ resumeInfo.intention.form.currentSalaryMonth }}个月)</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
              <el-form-item label="其他收入：">
                <span>{{ resumeInfo.intention.form.currentOtherSalary }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.jobExpectation.expected_industry.isHave" :span="24">
              <el-form-item label="期望行业：">
                <span
                  v-if="resumeInfo.intention.form.intentionIndustryId && resumeInfo.intention.form.intentionIndustryId.split(',')[0].length === 3"
                >{{ resumeInfo.intention.form.intentionIndustryId | filterCommonDict(dictData.industry) }}</span>
                <span
                  v-else
                >{{ resumeInfo.intention.form.intentionIndustryId | filterLevels2(dictData.industry) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.jobExpectation.desired_position.isHave" :span="24">
              <el-form-item label="期望职位：">
                <span>{{ resumeInfo.intention.form.intentionPosition }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.jobExpectation.expected_city.isHave" :span="24">
              <el-form-item label="期望城市：">
                <span>{{ resumeInfo.intention.form.intentionCity | filterLevel2(dictData.areas) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave" :span="24">
              <el-form-item label="期望年薪：">
                <span
                  v-if="resumeInfo.intention.form.isNegotiated !== 1"
                >{{ resumeInfo.intention.form.intentionSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ resumeInfo.intention.form.intentionAnnualSalary }}万/年</span>
                <span v-else>面议</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 教育经历 -->
      <div v-if="reportTplInfo.eduExp.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">教育经历</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.education.data" :key="index" class="panel-body">
          <span class="form-icon">
            <i class="icon iconfont icon-dingdanxiangqingye-choutidanchuang-tuijianbaogao1"></i>
          </span>
          <el-form
            ref="education"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.education.rules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label>
                  <span v-if="reportTplInfo.eduExp.name_school.isHave">{{ itemObj.form.school }}</span>
                  <span
                    v-if="reportTplInfo.eduExp.education_type.isHave"
                  >· {{ itemObj.form.isUnifiedStrategy | filterCommonDict(dictData.dicts.isUnifiedStrategy) }}{{ itemObj.form.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="reportTplInfo.eduExp.edu_start_time.isHave" :span="12">
                <el-form-item label style="text-align: right;">
                  <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="reportTplInfo.eduExp.specialty.isHave" :gutter="20">
              <el-col :span="24">
                <el-form-item label>
                  <span>{{ itemObj.form.speciality }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col v-if="reportTplInfo.eduExp.ramark.isHave" :span="24">
              <el-form-item label="备注：">
                <span>{{ itemObj.form.summary }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 工作经历 -->
      <div v-if="reportTplInfo.workExp.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">工作经历</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.job.data" :key="index" class="panel-body">
          <span class="form-icon">
            <i class="icon iconfont icon-dingdanxiangqingye-choutidanchuang-tuijianbaogao"></i>
          </span>
          <el-form
            ref="job"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.job.rules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label>
                  <span
                    v-if="reportTplInfo.workExp.corporate_name.isHave"
                  >{{ itemObj.form.companyName }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="reportTplInfo.workExp.start_time.isHave" :span="12">
                <el-form-item label style="text-align: right;">
                  <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="reportTplInfo.workExp.job_title.isHave" :gutter="20">
              <el-col :span="24">
                <el-form-item label>
                  <span>{{ itemObj.form.title }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col v-if="reportTplInfo.workExp.company_industry.isHave" :span="24">
              <el-form-item label="所属行业：">
                <span
                  v-if="itemObj.form.industryId1"
                >{{ itemObj.form.industryId1 | filterCommonDict(dictData.industry) }}</span>
                <span v-else>{{ itemObj.form.industryId2 | filterLevel2(dictData.industry) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.company_size.isHave" :span="24">
              <el-form-item label="公司规模：">
                <span>{{ itemObj.form.companySize | filterCommonDict(dictData.dicts.enterpriseScale) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.company_nature.isHave" :span="24">
              <el-form-item label="公司性质：">
                <span>{{ itemObj.form.companyType | filterCommonDict(dictData.dicts.enterpriseProperty) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.company_introduction.isHave" :span="24">
              <el-form-item label="公司介绍：">
                <span>{{ itemObj.form.companyIntroduce }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.subordinate_departments.isHave" :span="24">
              <el-form-item label="所属部门：">
                <span>{{ itemObj.form.department }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.responsible_area.isHave" :span="24">
              <el-form-item label="负责区域：">
                <span>{{ itemObj.form.responsibleArea }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.overseas.isHave" :span="24">
              <el-form-item label="是否海外：">
                <span>{{ itemObj.form.isOverseas | filterCommonDict(dictData.dicts.isOverseas) }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.reporting_object.isHave" :span="24">
              <el-form-item label="汇报对象：">
                <span>{{ itemObj.form.leader }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.number_subordinates.isHave" :span="24">
              <el-form-item label="下属人数：">
                <span>{{ itemObj.form.underlingNumber }}人</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.operating_duty.isHave" :span="24">
              <el-form-item label="工作职责：">
                <span>{{ itemObj.form.summary }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.job_performance.isHave" :span="24">
              <el-form-item label="工作业绩：">
                <span>{{ itemObj.form.achievement }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.workExp.reasons_leaving.isHave" :span="24">
              <el-form-item label="离职原因：">
                <span>{{ itemObj.form.reasonOfLeaving }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 项目经验 -->
      <div v-if="reportTplInfo.projectExp.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">项目经验</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.project.data" :key="index" class="panel-body">
          <el-form
            ref="project"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.project.rules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <span
                  v-if="reportTplInfo.projectExp.project_name.isHave"
                >{{ itemObj.form.projectName }}</span>
              </el-col>
              <el-col v-if="reportTplInfo.projectExp.project_start_time.isHave" :span="12">
                <el-form-item label style="text-align: right;">
                  <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col v-if="reportTplInfo.projectExp.project_company.isHave" :span="24">
              <el-form-item label="所在公司：">
                <span>{{ itemObj.form.companyName }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.projectExp.project_duties.isHave" :span="24">
              <el-form-item label="项目职务：">
                <span>{{ itemObj.form.title }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.projectExp.project_description.isHave" :span="24">
              <el-form-item label="项目描述：">
                <span>{{ itemObj.form.projectDescription }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.projectExp.project_responsibilities.isHave" :span="24">
              <el-form-item label="项目职责：">
                <span>{{ itemObj.form.responsibilities }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.projectExp.project_performance.isHave" :span="24">
              <el-form-item label="项目业绩：">
                <span>{{ itemObj.form.projectAchievement }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 培训经历 -->
      <div v-if="reportTplInfo.trainRecord.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">培训经历</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.train.data" :key="index" class="panel-body">
          <el-form
            ref="train"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.train.rules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <span
                  v-if="reportTplInfo.trainRecord.train_institutions.isHave"
                >{{ itemObj.form.trainingInstitution }}</span>
              </el-col>
              <el-col v-if="reportTplInfo.trainRecord.train_start_time.isHave" :span="12">
                <el-form-item label style="text-align: right;">
                  <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col v-if="reportTplInfo.trainRecord.train_course.isHave" :span="24">
              <el-form-item label="培训课程：">
                <span>{{ itemObj.form.trainingCourse }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 语言能力 -->
      <div v-if="reportTplInfo.langPower.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">语言能力</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.language.data" :key="index" class="panel-body">
          <el-form
            ref="language"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.language.rules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <span v-if="reportTplInfo.langPower.languages.isHave">{{ itemObj.form.Languages }}</span>
                <span
                  v-if="reportTplInfo.langPower.speaking_ability.isHave"
                >· 口语能力{{ itemObj.form.ListeningSpeakingSkills | filterCommonDict(dictData.dicts.readListenSkills) }}</span>
                <span
                  v-if="reportTplInfo.langPower.writing_ability.isHave"
                >· 书写能力{{ itemObj.form.ReadingWritingSkills | filterCommonDict(dictData.dicts.readListenSkills) }}</span>
                <span v-if="reportTplInfo.langPower.grade.isHave">
                  <span style="margin-left: 40px;">{{ itemObj.form.level }}</span>
                </span>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <!-- 证书信息 -->
      <div v-if="reportTplInfo.cerInfo.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">证书信息</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.certificate.data" :key="index" class="panel-body">
          <el-form
            ref="certificate"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.certificate.rules"
            label-width="100px"
          >
            <el-col v-if="reportTplInfo.cerInfo.certificate_name.isHave" :span="24">
              <el-form-item label="证书名称：">
                <span>{{ itemObj.form.nameOfCertificate }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.cerInfo.acquisition_time.isHave" :span="24">
              <el-form-item label="获取时间：">
                <span>{{ itemObj.form.receivingDate }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.cerInfo.describe.isHave" :span="24">
              <el-form-item label="描述：">
                <span>{{ itemObj.form.score }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 自我评价 -->
      <div v-if="reportTplInfo.selfEvaluation.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">自我评价</span>
        </p>
        <div class="panel-body">
          <el-form
            ref="evaluation"
            class="edit-form"
            :model="resumeInfo.evaluation.form"
            :rules="resumeInfo.evaluation.rules"
            label-width="100px"
          >
            <el-col v-if="reportTplInfo.selfEvaluation.self_evaluation.isHave" :span="24">
              <el-form-item label="自我评价：">
                <span>{{ resumeInfo.evaluation.form.personal }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 附加信息 -->
      <div v-if="reportTplInfo.additionalInformation.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">附加信息</span>
        </p>
        <div class="panel-body">
          <el-form
            ref="attach"
            class="edit-form"
            :model="resumeInfo.attach.form"
            :rules="resumeInfo.attach.rules"
            label-width="100px"
          >
            <el-col
              v-if="reportTplInfo.additionalInformation.additional_information.isHave"
              :span="24"
            >
              <el-form-item label="附加信息：">
                <span>{{ resumeInfo.attach.form.attachmentInformation }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <!-- 我的作品 -->
      <div v-if="reportTplInfo.opusInformation.isHave" class="panel">
        <p class="panel-title">
          <span class="title-name">我的作品</span>
        </p>
        <div v-for="(itemObj,index) in resumeInfo.works.data" :key="index" class="panel-body">
          <el-form
            ref="works"
            class="edit-form"
            :model="itemObj.form"
            :rules="resumeInfo.works.rules"
            label-width="100px"
          >
            <el-col v-if="reportTplInfo.opusInformation.opus_enclosure.isHave" :span="24">
              <el-form-item label="作品附件：">
                <span class="work-file">{{ itemObj.form.opusName }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.opusInformation.works_link.isHave" :span="24">
              <el-form-item label="作品地址：">
                <a
                  :href="itemObj.form.opuslink"
                  target="_blank"
                  class="work-link"
                >{{ itemObj.form.opuslink }}</a>
              </el-form-item>
            </el-col>
            <el-col v-if="reportTplInfo.opusInformation.works_link.isHave" :span="24">
              <el-form-item label="作品说明：">
                <span>{{ itemObj.form.opusExplain }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 底部栏 -->
    <div :class="['footer-bar',fixedFooter && 'isFixedFooter']">
      <div class="wrap-bar">
        <div class="bar-main">
          <div class="main-btn">
            <el-button class="confirm-btn" :loading="nextLoading" @click="next">确认发送推荐报告</el-button>
          </div>
          <div class="main-link">
            <a href="javascript:void(0);" @click="handleBack">返回修改</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from './recommendCandidateCommon/topBar'
import {
  getPositionDetailById,
  getCompanyDetail,
  getCompanyResumeFieldList,
  getCandidateRecommendReportInfoVOById,
  addRecommendReportOrder
} from '@/api/position'
export default {
  components: {
    topBar
  },
  data() {
    return {
      // 下一步按钮是否loading状态
      nextLoading: false,
      // 是否固定底部
      fixedFooter: false,
      // 职位信息
      positionInfo: {
        id: this.$route.query.positionId
      },
      // 企业信息
      companyInfo: {
        id: this.$route.query.companyId
      },
      // 推荐报告模板信息
      reportTplInfo: {
        companyId: this.$route.query.companyId,
        additionalInformation: {
          additional_information: {}
        },
        baseInfo: {
          date_of_birth: {},
          email: {},
          fertility_status: {},
          gender: {},
          head_portrait: {},
          highest_academic_qualifications: {},
          household_register: {},
          marital_status: {},
          name: {},
          nation: {},
          nationality: {},
          native_place: {},
          phone: {},
          political_outlook: {},
          university_graduated: {}
        },
        cerInfo: {
          acquisition_time: {},
          certificate_name: {},
          describe: {}
        },
        eduExp: {
          edu_start_time: {},
          education_type: {},
          name_school: {},
          ramark: {},
          specialty: {}
        },
        jobExpectation: {
          desired_position: {},
          expected_annual_salary: {},
          expected_city: {},
          expected_industry: {},
          job_status: {}
        },
        langPower: {
          grade: {},
          languages: {},
          speaking_ability: {},
          writing_ability: {}
        },
        opusInformation: {
          opus_enclosure: {},
          work_notes: {},
          works_link: {}
        },
        projectExp: {
          project_company: {},
          project_description: {},
          project_duties: {},
          project_end_time: {},
          project_name: {},
          project_performance: {},
          project_responsibilities: {},
          project_start_time: {}
        },
        recommendReport: {
          city: {},
          current_annual_salary: {},
          current_company: {},
          current_position: {},
          expected_interview_time: {},
          expected_separation_period: {},
          job_motive: {},
          other_income: {},
          rcommendation_reason: {},
          working_life: {}
        },
        selfEvaluation: {
          self_evaluation: {}
        },
        trainRecord: {
          train_course: {},
          train_institutions: {},
          train_start_time: {}
        },
        workExp: {
          company_industry: {},
          company_introduction: {},
          company_nature: {},
          company_size: {},
          corporate_name: {},
          job_performance: {},
          job_title: {},
          number_subordinates: {},
          operating_duty: {},
          overseas: {},
          reasons_leaving: {},
          reporting_object: {},
          responsible_area: {},
          start_time: {},
          subordinate_departments: {}
        }
      },
      // 推荐报告信息
      reportInfo: {
        form: {
          id: this.$route.query.reportId
        }
      },
      // 简历信息
      resumeInfo: {
        detail: {},
        base: {
          form: {}
        },
        intention: {
          form: {}
        },
        education: {
          data: []
        },
        job: {
          data: []
        },
        project: {
          data: []
        },
        train: {
          data: []
        },
        language: {
          data: []
        },
        certificate: {
          data: []
        },
        evaluation: {
          form: {}
        },
        attach: {
          form: {}
        },
        works: {
          data: []
        }
      }
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    document.title = '编辑推荐报告-大猎英才'
    window.scrollTo(0, 0)
    this.handleScroll()
    // handleScroll为页面滚动的监听回调
    window.addEventListener('scroll', this.handleScroll)
    // 查询职位信息
    this.queryPositionInfo()
    // 查询企业信息
    this.queryCompanyInfo()
    // 查询推荐报告模板信息
    this.queryReportTplInfo()
  },
  destroyed() {
    // 销毁页面滚动的监听回调
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 监听页面滚动实现吸顶
    handleScroll() {
      // 得到页面滚动的距离
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      // 得到页面可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 得到页面文档高度
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 监听dom渲染完成
      this.$nextTick(() => {
        // 这里要得到top的距离和元素自身的高度
        this.fixedFooter = scrollTop + clientHeight < scrollHeight - 110
      })
    },
    // 查询职位信息
    queryPositionInfo() {
      const para = Object.assign({}, this.positionInfo)
      getPositionDetailById(para).then(res => {
        this.positionInfo = res.data
      })
    },
    // 查询企业信息
    queryCompanyInfo() {
      const para = Object.assign({}, this.companyInfo)
      getCompanyDetail(para).then(res => {
        this.companyInfo = res.data
      })
    },
    // 查询推荐报告模板信息
    queryReportTplInfo() {
      const para = Object.assign({}, this.reportTplInfo)
      getCompanyResumeFieldList(para).then(res => {
        const companyResumeFields = res.data.companyResumeFields
        companyResumeFields.forEach(item => {
          const keyArr = Object.keys(item)
          const key = keyArr[0] === 'showGroupType' ? keyArr[1] : keyArr[0]
          this.reportTplInfo[key] = {
            isHave: item.showGroupType === 1
          }
          const childArr = item[key]
          childArr.forEach(childItem => {
            this.reportTplInfo[key][childItem.fieldCode] = {
              isHave: childItem.showType === 1,
              isRequired: childItem.mustFill === 1
            }
          })
        })
        this.reportTplInfo = Object.assign({}, this.reportTplInfo)
        // 查询推荐报告详细信息
        this.queryReportDetailInfo()
      })
    },
    // 查询推荐报告详细信息
    queryReportDetailInfo() {
      const para = Object.assign({}, this.reportInfo.form)
      getCandidateRecommendReportInfoVOById(para).then(res => {
        // 处理期望年薪前后端单位不匹配的问题
        res.data.candidateRecommendReport.intentionAnnualSalary =
          res.data.candidateRecommendReport.intentionAnnualSalary / 10000
        // 给简历detail对象赋ID值为了保证调用查详情接口下简历ID缺失的问题
        this.resumeInfo.detail.id = res.data.resumeInfo.detail.id
        // 推荐报告信息
        this.reportInfo.form = res.data.candidateRecommendReport
        // 基本信息
        this.resumeInfo.base.form = res.data.resumeInfo.detail
        // 求职意向
        this.resumeInfo.intention.form = res.data.candidateRecommendReport
        // 教育经历
        res.data.resumeInfo.educations &&
          res.data.resumeInfo.educations.forEach((item, index) => {
            this.resumeInfo.education.data.push({
              form: item
            })
          })
        // 工作经历
        res.data.resumeInfo.experiences &&
          res.data.resumeInfo.experiences.forEach((item, index) => {
            this.resumeInfo.job.data.push({
              form: item
            })
          })
        // 项目经验
        res.data.resumeInfo.projects &&
          res.data.resumeInfo.projects.forEach((item, index) => {
            this.resumeInfo.project.data.push({
              form: item
            })
          })
        // 培训经历
        res.data.resumeInfo.training &&
          res.data.resumeInfo.training.forEach((item, index) => {
            this.resumeInfo.train.data.push({
              form: item
            })
          })
        // 语言能力
        res.data.resumeInfo.languages &&
          res.data.resumeInfo.languages.forEach((item, index) => {
            this.resumeInfo.language.data.push({
              form: item
            })
          })
        // 证书信息
        res.data.resumeInfo.cerInfos &&
          res.data.resumeInfo.cerInfos.forEach((item, index) => {
            this.resumeInfo.certificate.data.push({
              form: item
            })
          })
        // 自我评价
        this.resumeInfo.evaluation.form = res.data.resumeInfo.detail
        // 附加信息
        this.resumeInfo.attach.form = res.data.resumeInfo.detail
        // 我的作品
        res.data.resumeInfo.opus &&
          res.data.resumeInfo.opus.forEach((item, index) => {
            this.resumeInfo.works.data.push({
              form: item
            })
          })
      })
    },
    // 返回上一步
    handleBack() {
      this.$router.push({
        path: '/recommendReport',
        query: {
          positionId: this.$route.query.positionId,
          companyId: this.$route.query.companyId,
          reportId: this.$route.query.reportId
        }
      })
    },
    // 下一步
    next() {
      this.nextLoading = true
      const para = {}
      para.reportId = this.reportInfo.form.id
      addRecommendReportOrder(para).then(res => {
        this.nextLoading = false
        if (res.data) {
          this.$router.push({
            path: '/sendSuccess',
            query: {
              positionId: this.positionInfo.id,
              orderId: res.data,
              resumeId: this.resumeInfo.detail.id
            }
          })
        } else {
          this.$message({
            message: '该订单已存在，请勿重复提交!',
            type: 'error',
            showClose: true,
            center: true
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: fixed;
    left: 0;
    top: 0;
  }
  .wrap-main {
    // width: 900px;
    width: 1200px;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 auto 20px;
    position: relative;
    z-index: 10;
    .main-notice {
      font-size: 14px;
      color: #7f7f7f;
      border-bottom: 1px dashed #e4e7ed;
      margin: 0 20px 20px;
      padding: 20px 0;
    }
    .main-title {
      font-size: 16px;
      color: #333333ff;
      font-weight: bold;
      margin: 0 20px;
      padding: 20px 0;
      text-align: center;
    }
    .panel {
      border-bottom: 1px solid #e4e7ed;
      margin: 0 20px;
      padding: 20px 0;
      &:last-child {
        border-bottom: none;
      }
      .panel-title {
        margin-bottom: 16px;
        .title-name {
          font-size: 15px;
          color: #333333ff;
          font-weight: bold;
        }
      }
      .panel-body {
        border-bottom: 1px dashed #e4e7ed;
        margin-bottom: 20px;
        padding-bottom: 20px;
        position: relative;
        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .form-icon {
          display: block;
          width: 48px;
          height: 48px;
          text-align: center;
          line-height: 48px;
          border: 1px solid $main-color;
          border-radius: 50%;
          position: absolute;
          left: 3px;
          top: 8px;
          .icon {
            font-size: 48px;
            color: $main-color;
          }
        }
        .edit-form {
          padding-right: 50px;
          margin: 0;
          position: relative;
          &:after {
            content: '';
            height: 0;
            line-height: 0;
            display: block;
            visibility: hidden;
            clear: both;
          }
          .el-col {
            padding: 0 10px;
            margin-bottom: 10px !important;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .el-form-item {
            margin-bottom: 0;
            ::v-deep .el-form-item__label {
              text-align: left;
              line-height: 28px;
              color: #666;
              position: relative;
              &:before {
                position: absolute;
                left: -10px;
              }
            }
            ::v-deep .el-form-item__content {
              line-height: 28px;
              color: #333;
              white-space: pre-wrap;
            }
          }
          .work-link {
            color: $main-color;
            cursor: pointer;
          }
          .avatar-img {
            display: block;
            width: 25px;
            height: 25px;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .footer-bar {
    position: relative;
    z-index: 10;
    .wrap-bar {
      // width: 900px;
      width: 1200px;
      margin: 0 auto;
      .bar-main {
        display: flex;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        .main-btn {
          display: flex;
          padding: 3px 0;
          line-height: 44px;
          margin-right: 40px;
          .el-button {
            box-sizing: border-box;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
            &.confirm-btn {
              width: 200px;
            }
            &.cancel-btn {
              width: 120px;
              margin-left: 40px;
            }
          }
        }
        .main-link {
          line-height: 50px;
          a {
            font-size: 16px;
            color: $main-color;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>

