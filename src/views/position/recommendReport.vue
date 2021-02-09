<template>
  <div v-show="reportTplInfo.recommendReport.isHave" class="wrap-box">
    <!-- 顶部信息 -->
    <top-bar :position-info="positionInfo" :company-info="companyInfo" />
    <!-- 标题栏 -->
    <div class="title-bar">
      <span>{{ companyInfo.shortName }}简历推荐模板</span>
      <span v-if="draftInfo.id">草稿保存于：{{ new Date().getTime() | filterDateTime }}</span>
    </div>
    <!-- 主体区域 -->
    <div class="wrap-main">
      <!-- 主体内容 -->
      <div class="main-content">
        <!-- 推荐报告 -->
        <div class="recommend-report">
          <div v-if="reportTplInfo.recommendReport.isHave" id="nav_1" class="panel">
            <p class="panel-title">
              <span class="title-name">推荐报告</span>
              <span v-show="!status('1', 'reportInfo')" class="title-validate">不完善</span>
            </p>
            <div class="panel-body">
              <el-form
                v-show="reportInfo.edit"
                ref="reportInfo-edit"
                class="edit-form"
                :model="reportInfo.form"
                :rules="reportInfo.rules"
                label-width="100px"
              >
                <el-col :span="24">
                  <el-form-item
                    :rules="{ required: true, message: '该项必填', trigger: 'blur' }"
                    label="推荐报告："
                    prop="reportTitle"
                  >
                    <el-input
                      v-model="reportInfo.form.reportTitle"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="候选人：">
                    <span>{{ reportInfo.form.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.rcommendation_reason.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.rcommendation_reason.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="推荐理由："
                    prop="reason"
                  >
                    <el-input
                      v-model="reportInfo.form.reason"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.job_motive.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.job_motive.isRequired, message: '该项必填', trigger: 'change' }"
                    label="求职动机："
                    prop="motivation"
                  >
                    <el-select v-model="reportInfo.form.motivation" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.jobMotivation"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.expected_separation_period.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.expected_separation_period.isRequired, message: '该项必填', trigger: 'change' }"
                    label="离职期："
                    prop="dimissionDate"
                  >
                    <el-select v-model="reportInfo.form.dimissionDate" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.dimissionDate"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.current_annual_salary.isHave"
                  :span="24"
                >
                  <div class="form-group">
                    <el-form-item
                      :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label="目前年薪："
                      prop="currentSalary"
                      class="form-group-left"
                    >
                      <el-input
                        v-model.number="reportInfo.form.currentSalary"
                        placeholder
                        autocomplete="off"
                        clearable
                        @input="resumeInfo.intention.form.currentSalary = reportInfo.form.currentSalary"
                      >
                        <template slot="append">元/月</template>
                      </el-input>
                    </el-form-item>
                    <span class="concat-line">×</span>
                    <el-form-item
                      :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label
                      prop="currentSalaryMonth"
                      class="form-group-center"
                    >
                      <el-input
                        v-model.number="reportInfo.form.currentSalaryMonth"
                        placeholder
                        autocomplete="off"
                        clearable
                        @input="resumeInfo.intention.form.currentSalaryMonth = reportInfo.form.currentSalaryMonth"
                      >
                        <template slot="append">个月</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      :rules="{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="currentSalaryTax"
                      class="form-group-right"
                    >
                      <el-radio
                        v-for="item in dictData.dicts.taxInclude"
                        :key="item.value"
                        v-model="reportInfo.form.currentSalaryTax"
                        :label="parseInt(item.value)"
                        @change="resumeInfo.intention.form.currentSalaryTax = reportInfo.form.currentSalaryTax"
                      >{{ item.label }}</el-radio>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.other_income.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="其他收入："
                    prop="currentOtherSalary"
                  >
                    <el-input
                      v-model="reportInfo.form.currentOtherSalary"
                      placeholder="奖金，补贴，提成，期权等"
                      autocomplete="off"
                      clearable
                      @input="resumeInfo.intention.form.currentOtherSalary = reportInfo.form.currentOtherSalary"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave"
                  :span="24"
                >
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: !reportInfo.form.isNegotiated && reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'change' }"
                      label="期望年薪："
                      prop="intentionSalaryTax"
                      class="form-group-left"
                    >
                      <el-select
                        v-model="reportInfo.form.intentionSalaryTax"
                        placeholder="请选择"
                        clearable
                        :disabled="reportInfo.form.isNegotiated === 1"
                        @change="resumeInfo.intention.form.intentionSalaryTax = reportInfo.form.intentionSalaryTax"
                      >
                        <el-option
                          v-for="item in dictData.dicts.taxInclude"
                          :key="item.value"
                          :label="item.label"
                          :value="parseInt(item.value)"
                        />
                      </el-select>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="[{ required: !reportInfo.form.isNegotiated && reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label
                      prop="intentionAnnualSalary"
                      class="form-group-center"
                    >
                      <el-input
                        v-model.number="reportInfo.form.intentionAnnualSalary"
                        placeholder
                        autocomplete="off"
                        clearable
                        :disabled="reportInfo.form.isNegotiated === 1"
                        @input="resumeInfo.intention.form.intentionAnnualSalary = reportInfo.form.intentionAnnualSalary"
                      >
                        <template slot="append">万</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label class="form-group-right">
                      <el-checkbox
                        v-model="reportInfo.form.isNegotiated"
                        :true-label="1"
                        :false-label="0"
                        @change="resumeInfo.intention.form.isNegotiated = reportInfo.form.isNegotiated"
                      >面议</el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.expected_interview_time.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.expected_interview_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="面试时间："
                    prop="expectInterviewTime"
                  >
                    <el-select v-model="reportInfo.form.expectInterviewTime" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.expectInterviewTime"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="submitReportInfo">保存</el-button>
                    <el-button class="cancel-btn" @click="resetReportInfo">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!reportInfo.edit"
                ref="reportInfo-show"
                class="edit-form show-form"
                :model="reportInfo.form"
                :rules="reportInfo.rules"
                label-width="100px"
              >
                <a href="javascript:void(0);" class="show-form-edit single" @click="editReportInfo">
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col :span="24">
                  <el-form-item
                    :rules="{ required: true, message: '该项必填', trigger: 'blur' }"
                    label="推荐报告："
                    prop="reportTitle"
                  >
                    <span>{{ reportInfo.form.reportTitle }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="候选人：" prop="name">
                    <span>{{ reportInfo.form.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.rcommendation_reason.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.rcommendation_reason.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="推荐理由："
                    prop="reason"
                  >
                    <span>{{ reportInfo.form.reason }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.job_motive.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.job_motive.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="求职动机："
                    prop="motivation"
                  >
                    <span>{{ reportInfo.form.motivation | filterCommonDict(dictData.dicts.jobMotivation) }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.expected_separation_period.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.expected_separation_period.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="离职期："
                    prop="dimissionDate"
                  >
                    <span>{{ reportInfo.form.dimissionDate | filterCommonDict(dictData.dicts.dimissionDate) }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.current_annual_salary.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                    label="目前年薪："
                    prop="currentSalary"
                  >
                    <span>{{ reportInfo.form.currentSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ reportInfo.form.currentSalary * reportInfo.form.currentSalaryMonth / 10000 }}万 ({{ reportInfo.form.currentSalary }} × {{ reportInfo.form.currentSalaryMonth }}个月)</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.other_income.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="其他收入："
                    prop="currentOtherSalary"
                  >
                    <span>{{ reportInfo.form.currentOtherSalary }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="[{ required: reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                    label="期望年薪："
                    prop="intentionAnnualSalary"
                  >
                    <span
                      v-if="reportInfo.form.isNegotiated !== 1"
                    >{{ reportInfo.form.intentionSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ reportInfo.form.intentionAnnualSalary }}万/年</span>
                    <span v-else>面议</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.expected_interview_time.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.expected_interview_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="面试时间："
                    prop="expectInterviewTime"
                  >
                    <span>{{ reportInfo.form.expectInterviewTime | filterCommonDict(dictData.dicts.expectInterviewTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 主体信息 -->
        <div class="main-info">
          <!-- 基本信息 -->
          <div v-if="reportTplInfo.baseInfo.isHave" id="nav_2" class="panel">
            <p class="panel-title">
              <span class="title-name">基本信息</span>
              <span v-show="!status('2', 'base')" class="title-validate">不完善</span>
            </p>
            <div class="panel-body" :class="{disabled: resumeInfo.base.disabled}">
              <el-form
                v-show="resumeInfo.base.edit"
                ref="base-edit"
                class="edit-form"
                :model="resumeInfo.base.form"
                :rules="resumeInfo.base.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.baseInfo.head_portrait.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.head_portrait.isRequired, message: '该项必填', trigger: 'change' }"
                    label="头像："
                    prop="avatar"
                  >
                    <el-upload
                      action="/api/common/upload"
                      :data="{ossFileType: 'resumeInformation'}"
                      :before-upload="beforePicUpload"
                      :on-success="uploadPicSuccess"
                      :on-error="uploadError"
                      :limit="1"
                      :show-file-list="false"
                    >
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
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.baseInfo.name.isHave || reportTplInfo.baseInfo.gender.isHave"
                  :span="12"
                >
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: reportTplInfo.baseInfo.name.isRequired, message: '该项必填', trigger: 'blur' }"
                      label="姓名："
                      prop="name"
                      class="form-group-left"
                      style="width: 250px;"
                    >
                      <el-input
                        v-model="resumeInfo.base.form.name"
                        placeholder
                        autocomplete="off"
                        clearable
                        @input="reportInfo.form.name = resumeInfo.base.form.name"
                      />
                    </el-form-item>
                    <el-form-item
                      :rules="{ required: reportTplInfo.baseInfo.gender.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="gender"
                      class="form-group-right"
                    >
                      <el-radio
                        v-for="item in dictData.dicts.gender"
                        :key="item.value"
                        v-model="resumeInfo.base.form.gender"
                        :label="parseInt(item.value)"
                      >{{ item.label }}</el-radio>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.city.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.city.isRequired, message: '该项必填', trigger: 'change' }"
                    label="所在地："
                    prop="liveCity"
                  >
                    <select-picker
                      v-if="!resumeInfo.base.form.liveCity"
                      :key="new Date().getTime()"
                      ref="liveCity"
                      key-name="liveCity"
                      :default-value="[resumeInfo.base.form.liveCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseLiveCity"
                    />
                    <select-picker
                      v-if="resumeInfo.base.form.liveCity"
                      :key="new Date().getTime()"
                      ref="liveCity"
                      key-name="liveCity"
                      :default-value="[resumeInfo.base.form.liveCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseLiveCity"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.native_place.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.native_place.isRequired, message: '该项必填', trigger: 'change' }"
                    label="籍贯："
                    prop="nativeCity"
                  >
                    <select-picker
                      v-if="!resumeInfo.base.form.nativeCity"
                      :key="new Date().getTime()"
                      ref="nativeCity"
                      key-name="nativeCity"
                      :default-value="[resumeInfo.base.form.nativeCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseNativeCity"
                    />
                    <select-picker
                      v-if="resumeInfo.base.form.nativeCity"
                      :key="new Date().getTime()"
                      ref="nativeCity"
                      key-name="nativeCity"
                      :default-value="[resumeInfo.base.form.nativeCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseNativeCity"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.household_register.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.household_register.isRequired, message: '该项必填', trigger: 'change' }"
                    label="户籍："
                    prop="registerCity"
                  >
                    <select-picker
                      v-if="!resumeInfo.base.form.registerCity"
                      :key="new Date().getTime()"
                      ref="registerCity"
                      key-name="registerCity"
                      :default-value="[resumeInfo.base.form.registerCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseRegisterCity"
                    />
                    <select-picker
                      v-if="resumeInfo.base.form.registerCity"
                      :key="new Date().getTime()"
                      ref="registerCity"
                      key-name="registerCity"
                      :default-value="[resumeInfo.base.form.registerCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseRegisterCity"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.nation.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.nation.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="民族："
                    prop="national"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.national"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.political_outlook.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.political_outlook.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="政治面貌："
                    prop="political"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.political"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.marital_status.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.marital_status.isRequired, message: '该项必填', trigger: 'change' }"
                    label="婚姻状况："
                    prop="maritalStatus"
                  >
                    <el-select
                      v-model="resumeInfo.base.form.maritalStatus"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.maritalStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.fertility_status.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.fertility_status.isRequired, message: '该项必填', trigger: 'change' }"
                    label="生育状况："
                    prop="fertilityStatus"
                  >
                    <el-select
                      v-model="resumeInfo.base.form.fertilityStatus"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.fertilityStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.phone.isHave" :span="12">
                  <el-form-item
                    :rules="[{ required: reportTplInfo.baseInfo.phone.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.phoneFormat, trigger: 'blur' }]"
                    label="手机："
                    prop="mobile"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.mobile"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.email.isHave" :span="12">
                  <el-form-item
                    :rules="[{ required: reportTplInfo.baseInfo.email.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.emailFormat, trigger: 'blur' }]"
                    label="邮箱："
                    prop="email"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.email"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.date_of_birth.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.date_of_birth.isRequired, message: '该项必填', trigger: 'change' }"
                    label="出生年月："
                    prop="birthday"
                  >
                    <el-date-picker
                      v-model="resumeInfo.base.form.birthday"
                      type="month"
                      value-format="yyyy-MM"
                      placeholder="请选择"
                    ></el-date-picker>
                    <span class="date-icon">
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.working_life.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.working_life.isRequired, message: '该项必填', trigger: 'change' }"
                    label="工作年份："
                    prop="startWorkMonth"
                  >
                    <el-date-picker
                      v-model="resumeInfo.base.form.startWorkMonth"
                      type="month"
                      value-format="yyyy-MM"
                      placeholder="请选择"
                    ></el-date-picker>
                    <span class="date-icon">
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.current_company.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.current_company.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="目前公司："
                    prop="currentCompanyName"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.currentCompanyName"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.current_position.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.current_position.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="目前职位："
                    prop="currentPosition"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.currentPosition"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.university_graduated.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.university_graduated.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="毕业院校："
                    prop="graduateSchool"
                  >
                    <el-input
                      v-model="resumeInfo.base.form.graduateSchool"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.baseInfo.highest_academic_qualifications.isHave"
                  :span="12"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.highest_academic_qualifications.isRequired, message: '该项必填', trigger: 'change' }"
                    label="最高学历："
                    prop="degreeCode"
                  >
                    <el-select
                      v-model="resumeInfo.base.form.degreeCode"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.advancedDegree"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('base')">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('base')">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!resumeInfo.base.edit"
                ref="base-show"
                class="edit-form show-form"
                :model="resumeInfo.base.form"
                :rules="resumeInfo.base.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit single"
                  @click="editItem('base')"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.baseInfo.head_portrait.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.head_portrait.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="头像："
                    prop="avatar"
                  >
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
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="姓名："
                    prop="name"
                  >
                    <span>{{ resumeInfo.base.form.name }}{{ resumeInfo.base.form.gender === 1 ? '先生' : '女士' }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.city.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.city.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所在地："
                    prop="liveCity"
                  >
                    <span>{{ resumeInfo.base.form.liveCity | filterLevel2(dictData.areas) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.native_place.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.native_place.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="籍贯："
                    prop="nativeCity"
                  >
                    <span>{{ resumeInfo.base.form.nativeCity | filterLevel2(dictData.areas) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.household_register.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.household_register.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="户籍："
                    prop="registerCity"
                  >
                    <span>{{ resumeInfo.base.form.registerCity | filterLevel2(dictData.areas) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.nation.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.nation.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="民族："
                    prop="national"
                  >
                    <span>{{ resumeInfo.base.form.national }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.political_outlook.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.political_outlook.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="政治面貌："
                    prop="political"
                  >
                    <span>{{ resumeInfo.base.form.political }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.marital_status.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.marital_status.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="婚姻状况："
                    prop="maritalStatus"
                  >
                    <span>{{ resumeInfo.base.form.maritalStatus | filterCommonDict(dictData.dicts.maritalStatus) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.fertility_status.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.fertility_status.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="生育状况："
                    prop="fertilityStatus"
                  >
                    <span>{{ resumeInfo.base.form.fertilityStatus | filterCommonDict(dictData.dicts.fertilityStatus) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.phone.isHave" :span="12">
                  <el-form-item
                    :rules="[{ required: reportTplInfo.baseInfo.phone.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.phoneFormat, trigger: 'blur' }]"
                    label="手机："
                    prop="mobile"
                  >
                    <span>{{ resumeInfo.base.form.mobile }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.email.isHave" :span="12">
                  <el-form-item
                    :rules="[{ required: reportTplInfo.baseInfo.email.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.emailFormat, trigger: 'blur' }]"
                    label="邮箱："
                    prop="email"
                  >
                    <span>{{ resumeInfo.base.form.email }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.date_of_birth.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.date_of_birth.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="年龄："
                    prop="birthday"
                  >
                    <span>{{ resumeInfo.base.form.birthday | filterBirthday }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.working_life.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.working_life.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="工作年限："
                    prop="startWorkMonth"
                  >
                    <span>{{ resumeInfo.base.form.startWorkMonth | filterYearMonth }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.current_company.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.current_company.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="目前公司："
                    prop="currentCompanyName"
                  >
                    <span>{{ resumeInfo.base.form.currentCompanyName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.current_position.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.current_position.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="目前职位："
                    prop="currentPosition"
                  >
                    <span>{{ resumeInfo.base.form.currentPosition }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.baseInfo.university_graduated.isHave" :span="12">
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.university_graduated.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="毕业院校："
                    prop="graduateSchool"
                  >
                    <span>{{ resumeInfo.base.form.graduateSchool }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.baseInfo.highest_academic_qualifications.isHave"
                  :span="12"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.baseInfo.highest_academic_qualifications.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="最高学历："
                    prop="degreeCode"
                  >
                    <span>{{ resumeInfo.base.form.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </div>
          <!-- 求职意向 -->
          <div v-if="reportTplInfo.jobExpectation.isHave" id="nav_3" class="panel">
            <p class="panel-title">
              <span class="title-name">求职意向</span>
              <span v-show="!status('2', 'intention')" class="title-validate">不完善</span>
            </p>
            <div class="panel-body" :class="{disabled: resumeInfo.intention.disabled}">
              <el-form
                v-show="resumeInfo.intention.edit"
                ref="intention-edit"
                class="edit-form"
                :model="resumeInfo.intention.form"
                :rules="resumeInfo.intention.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.jobExpectation.job_status.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.job_status.isRequired, message: '该项必填', trigger: 'change' }"
                    label="求职状态："
                    prop="jobStatus"
                  >
                    <el-select
                      v-model="resumeInfo.intention.form.jobStatus"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.jobStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.current_annual_salary.isHave"
                  :span="24"
                >
                  <div class="form-group">
                    <el-form-item
                      :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label="目前年薪："
                      prop="currentSalary"
                      class="form-group-left"
                    >
                      <el-input
                        v-model="resumeInfo.intention.form.currentSalary"
                        placeholder
                        autocomplete="off"
                        clearable
                        @input="reportInfo.form.currentSalary = resumeInfo.intention.form.currentSalary"
                      >
                        <template slot="append">元/月</template>
                      </el-input>
                    </el-form-item>
                    <span class="concat-line">×</span>
                    <el-form-item
                      :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label
                      prop="currentSalaryMonth"
                      class="form-group-center"
                    >
                      <el-input
                        v-model.number="resumeInfo.intention.form.currentSalaryMonth"
                        placeholder
                        autocomplete="off"
                        clearable
                        @input="reportInfo.form.currentSalaryMonth = resumeInfo.intention.form.currentSalaryMonth"
                      >
                        <template slot="append">个月</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      :rules="{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="currentSalaryTax"
                      class="form-group-right"
                    >
                      <el-radio
                        v-for="item in dictData.dicts.taxInclude"
                        :key="item.value"
                        v-model="resumeInfo.intention.form.currentSalaryTax"
                        :label="parseInt(item.value)"
                        @change="reportInfo.form.currentSalaryTax = resumeInfo.intention.form.currentSalaryTax"
                      >{{ item.label }}</el-radio>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.other_income.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="其他收入："
                    prop="currentOtherSalary"
                  >
                    <el-input
                      v-model="resumeInfo.intention.form.currentOtherSalary"
                      placeholder
                      autocomplete="off"
                      clearable
                      @input="reportInfo.form.currentOtherSalary = resumeInfo.intention.form.currentOtherSalary"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.expected_industry.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.expected_industry.isRequired, message: '该项必填', trigger: 'change' }"
                    label="期望行业："
                    prop="intentionIndustryId"
                  >
                    <select-picker-double
                      v-if="!resumeInfo.intention.form.intentionIndustryId"
                      :key="new Date().getTime()"
                      ref="intentionIndustryId"
                      key-name="intentionIndustryId"
                      :default-value="resumeInfo.intention.form.intentionIndustryId ? resumeInfo.intention.form.intentionIndustryId.split(',') : []"
                      :data-source="dictData.industry"
                      :first-tab-name="dictData.industry[0].value"
                      :max-number="3"
                      :level-number="2"
                      @afterClose="afterCloseIntentionIndustryId"
                    />
                    <select-picker-double
                      v-if="resumeInfo.intention.form.intentionIndustryId"
                      :key="new Date().getTime()"
                      ref="intentionIndustryId"
                      key-name="intentionIndustryId"
                      :default-value="resumeInfo.intention.form.intentionIndustryId ? resumeInfo.intention.form.intentionIndustryId.split(',') : []"
                      :data-source="dictData.industry"
                      :first-tab-name="dictData.industry[0].value"
                      :max-number="3"
                      :level-number="2"
                      @afterClose="afterCloseIntentionIndustryId"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.desired_position.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.desired_position.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="期望职位："
                  >
                    <el-input
                      v-model="resumeInfo.intention.form.intentionPosition"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.expected_city.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.expected_city.isRequired, message: '该项必填', trigger: 'change' }"
                    label="期望城市："
                    prop="intentionCity"
                  >
                    <select-picker
                      v-if="!resumeInfo.intention.form.intentionCity"
                      :key="new Date().getTime()"
                      ref="intentionCity"
                      key-name="intentionCity"
                      :default-value="[resumeInfo.intention.form.intentionCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseIntentionCity"
                    />
                    <select-picker
                      v-if="resumeInfo.intention.form.intentionCity"
                      :key="new Date().getTime()"
                      ref="intentionCity"
                      key-name="intentionCity"
                      :default-value="[resumeInfo.intention.form.intentionCity + '']"
                      :data-source="dictData.areas"
                      :first-tab-name="dictData.areas[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseIntentionCity"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave"
                  :span="24"
                >
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: !resumeInfo.intention.form.isNegotiated && reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'change' }"
                      label="期望年薪："
                      prop="intentionSalaryTax"
                      class="form-group-left"
                    >
                      <el-select
                        v-model="resumeInfo.intention.form.intentionSalaryTax"
                        placeholder="请选择"
                        clearable
                        :disabled="resumeInfo.intention.form.isNegotiated === 1"
                        @change="reportInfo.form.intentionSalaryTax = resumeInfo.intention.form.intentionSalaryTax"
                      >
                        <el-option
                          v-for="item in dictData.dicts.taxInclude"
                          :key="item.value"
                          :label="item.label"
                          :value="parseInt(item.value)"
                        />
                      </el-select>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="[{ required: !resumeInfo.intention.form.isNegotiated && reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                      label
                      prop="intentionAnnualSalary"
                      class="form-group-center"
                    >
                      <el-input
                        v-model="resumeInfo.intention.form.intentionAnnualSalary"
                        placeholder
                        autocomplete="off"
                        clearable
                        :disabled="resumeInfo.intention.form.isNegotiated === 1"
                        @input="reportInfo.form.intentionAnnualSalary = resumeInfo.intention.form.intentionAnnualSalary"
                      >
                        <template slot="append">万</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label class="form-group-right">
                      <el-checkbox
                        v-model="resumeInfo.intention.form.isNegotiated"
                        :true-label="1"
                        :false-label="0"
                        @change="reportInfo.form.isNegotiated = resumeInfo.intention.form.isNegotiated"
                      >面议</el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('intention')">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('intention')">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!resumeInfo.intention.edit"
                ref="intention-show"
                class="edit-form show-form"
                :model="resumeInfo.intention.form"
                :rules="resumeInfo.intention.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit single"
                  @click="editItem('intention')"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.jobExpectation.job_status.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.job_status.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="求职状态："
                    prop="jobStatus"
                  >
                    <span>{{ resumeInfo.intention.form.jobStatus | filterCommonDict(dictData.dicts.jobStatus) }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.recommendReport.current_annual_salary.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="[{ required: reportTplInfo.recommendReport.current_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                    label="目前年薪："
                    prop="currentSalary"
                  >
                    <span>{{ resumeInfo.intention.form.currentSalaryTax | filterCommonDict(dictData.dicts.taxInclude) }} {{ resumeInfo.intention.form.currentSalary * resumeInfo.intention.form.currentSalaryMonth / 10000 }}万 ({{ resumeInfo.intention.form.currentSalary }} × {{ resumeInfo.intention.form.currentSalaryMonth }}个月)</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.recommendReport.other_income.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.recommendReport.other_income.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="其他收入："
                    prop="currentOtherSalary"
                  >
                    <span>{{ resumeInfo.intention.form.currentOtherSalary }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.expected_industry.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.expected_industry.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="期望行业："
                    prop="intentionIndustryId"
                  >
                    <span
                      v-if="resumeInfo.intention.form.intentionIndustryId && resumeInfo.intention.form.intentionIndustryId.split(',')[0].length === 3"
                    >{{ resumeInfo.intention.form.intentionIndustryId | filterCommonDict(dictData.industry) }}</span>
                    <span
                      v-else
                    >{{ resumeInfo.intention.form.intentionIndustryId | filterLevels2(dictData.industry) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.desired_position.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.desired_position.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="期望职位："
                    prop="intentionPosition"
                  >
                    <span>{{ resumeInfo.intention.form.intentionPosition }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.jobExpectation.expected_city.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.jobExpectation.expected_city.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="期望城市："
                    prop="intentionCity"
                  >
                    <span>{{ resumeInfo.intention.form.intentionCity | filterLevel2(dictData.areas) }}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="reportTplInfo.jobExpectation.expected_annual_salary.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="[{ required: reportTplInfo.jobExpectation.expected_annual_salary.isRequired, message: '该项必填', trigger: 'blur' },{ validator: this.$verify.numberFormat, trigger: 'blur' }]"
                    label="期望年薪："
                    prop="intentionAnnualSalary"
                  >
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
          <div v-if="reportTplInfo.eduExp.isHave" id="nav_4" class="panel">
            <p class="panel-title">
              <span class="title-name">教育经历</span>
              <span v-show="!status('2', 'education')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.education.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'education-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.education.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.eduExp.edu_start_time.isHave" :span="24">
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: reportTplInfo.eduExp.edu_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label="就读时间："
                      prop="startDate"
                      class="form-group-left"
                    >
                      <el-date-picker
                        v-model="itemObj.form.startDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="{ required: reportTplInfo.eduExp.edu_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="endDate"
                      class="form-group-center"
                    >
                      <el-date-picker
                        v-model="itemObj.form.endDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.name_school.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.name_school.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="学校名称："
                    prop="school"
                  >
                    <el-input
                      v-model="itemObj.form.school"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.specialty.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.specialty.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所学专业："
                    prop="speciality"
                  >
                    <el-input
                      v-model="itemObj.form.speciality"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.education_type.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.education_type.isRequired, message: '该项必填', trigger: 'change' }"
                    label="学历："
                    prop="degreeCode"
                  >
                    <el-select v-model="itemObj.form.degreeCode" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.advancedDegree"
                        :key="item.value"
                        :label="item.label"
                        :value="parseInt(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.education_type.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.education_type.isRequired, message: '该项必填', trigger: 'change' }"
                    label="是否统招："
                    prop="isUnifiedStrategy"
                  >
                    <el-radio
                      v-for="item in dictData.dicts.isUnifiedStrategy"
                      :key="item.value"
                      v-model="itemObj.form.isUnifiedStrategy"
                      :label="parseInt(item.value)"
                    >{{ item.label }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.ramark.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.ramark.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="备注："
                  >
                    <el-input
                      v-model="itemObj.form.summary"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('education',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('education',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('education',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'education-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.education.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('education', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.eduExp.edu_start_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.edu_start_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="就读时间："
                    prop="endDate"
                  >
                    <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.name_school.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.name_school.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="学校名称："
                    prop="school"
                  >
                    <span>{{ itemObj.form.school }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.specialty.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.specialty.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="就读专业："
                    prop="speciality"
                  >
                    <span>{{ itemObj.form.speciality }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.education_type.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.education_type.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="学历："
                    prop="degreeCode"
                  >
                    <span>{{ itemObj.form.degreeCode | filterCommonDict(dictData.dicts.advancedDegree) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.education_type.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.education_type.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="是否统招："
                    prop="isUnifiedStrategy"
                  >
                    <span>{{ itemObj.form.isUnifiedStrategy | filterCommonDict(dictData.dicts.isUnifiedStrategy) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.eduExp.ramark.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.eduExp.ramark.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="备注："
                  >
                    <span>{{ itemObj.form.summary }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('education')">
                <i class="el-icon-plus"></i> 添加教育经历
              </a>
            </div>
          </div>
          <!-- 工作经历 -->
          <div v-if="reportTplInfo.workExp.isHave" id="nav_5" class="panel">
            <p class="panel-title">
              <span class="title-name">工作经历</span>
              <span v-show="!status('2', 'job')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.job.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'job-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.job.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.workExp.start_time.isHave" :span="24">
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: reportTplInfo.workExp.start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label="任职时间："
                      prop="startDate"
                      class="form-group-left"
                    >
                      <el-date-picker
                        v-model="itemObj.form.startDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="{ required: reportTplInfo.workExp.start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="endDate"
                      class="form-group-center"
                    >
                      <el-date-picker
                        v-model="itemObj.form.endDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.corporate_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.corporate_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司名称："
                    prop="companyName"
                  >
                    <el-input
                      v-model="itemObj.form.companyName"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_industry.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_industry.isRequired, message: '该项必填', trigger: 'change' }"
                    label="所属行业："
                    prop="industryId"
                  >
                    <select-picker-double
                      v-if="!(itemObj.form.industryId1 || itemObj.form.industryId2)"
                      :key="new Date().getTime()"
                      ref="industryId"
                      key-name="industryId"
                      :default-value="itemObj.form.industryId1 ? [itemObj.form.industryId1] : (itemObj.form.industryId2 ? itemObj.form.industryId2.split(',') : [])"
                      :data-source="dictData.industry"
                      :first-tab-name="dictData.industry[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseIndustryId(itemObj)"
                    />
                    <select-picker-double
                      v-if="itemObj.form.industryId1 || itemObj.form.industryId2"
                      :key="new Date().getTime()"
                      ref="industryId"
                      key-name="industryId"
                      :default-value="itemObj.form.industryId1 ? [itemObj.form.industryId1] : (itemObj.form.industryId2 ? itemObj.form.industryId2.split(',') : [])"
                      :data-source="dictData.industry"
                      :first-tab-name="dictData.industry[0].value"
                      :max-number="1"
                      :level-number="2"
                      @afterClose="afterCloseIndustryId(itemObj)"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_size.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_size.isRequired, message: '该项必填', trigger: 'change' }"
                    label="公司规模："
                    prop="companySize"
                  >
                    <el-select v-model="itemObj.form.companySize" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.enterpriseScale"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_nature.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_nature.isRequired, message: '该项必填', trigger: 'change' }"
                    label="公司性质："
                    prop="companyType"
                  >
                    <el-select v-model="itemObj.form.companyType" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dictData.dicts.enterpriseProperty"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_introduction.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_introduction.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司介绍："
                    prop="companyIntroduce"
                  >
                    <el-input
                      v-model="itemObj.form.companyIntroduce"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.job_title.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.job_title.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="职位名称："
                    prop="title"
                  >
                    <el-input
                      v-model="itemObj.form.title"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.subordinate_departments.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.subordinate_departments.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所属部门："
                    prop="department"
                  >
                    <el-input
                      v-model="itemObj.form.department"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.responsible_area.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.responsible_area.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="负责区域："
                    prop="responsibleArea"
                  >
                    <el-input
                      v-model="itemObj.form.responsibleArea"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.overseas.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.overseas.isRequired, message: '该项必填', trigger: 'change' }"
                    label="是否海外："
                    prop="isOverseas"
                  >
                    <el-radio
                      v-for="item in dictData.dicts.isOverseas"
                      :key="item.value"
                      v-model="itemObj.form.isOverseas"
                      :label="parseInt(item.value)"
                    >{{ item.label }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.reporting_object.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.reporting_object.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="汇报对象："
                    prop="leader"
                  >
                    <el-input
                      v-model="itemObj.form.leader"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.number_subordinates.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.number_subordinates.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="下属人数"
                    prop="underlingNumber"
                  >
                    <el-input
                      v-model="itemObj.form.underlingNumber"
                      placeholder
                      autocomplete="off"
                      clearable
                    >
                      <template slot="append">人</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.operating_duty.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.operating_duty.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="工作职责："
                    prop="summary"
                  >
                    <el-input
                      v-model="itemObj.form.summary"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="2000"
                      show-word-limit
                      placeholder="最多2000字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.job_performance.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.job_performance.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="工作业绩："
                    prop="achievement"
                  >
                    <el-input
                      v-model="itemObj.form.achievement"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.reasons_leaving.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.reasons_leaving.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="离职原因："
                    prop="reasonOfLeaving"
                  >
                    <el-input
                      v-model="itemObj.form.reasonOfLeaving"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('job',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('job',index)">取消</el-button>
                    <a href="javascript:void(0);" class="delete-link" @click="delItem('job',index)">
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'job-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.job.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('job', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.workExp.start_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.start_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="任职时间："
                    prop="endDate"
                  >
                    <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.corporate_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.corporate_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司名称："
                    prop="companyName"
                  >
                    <span>{{ itemObj.form.companyName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_industry.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_industry.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所属行业："
                    prop="industryId"
                  >
                    <span
                      v-if="itemObj.form.industryId1"
                    >{{ itemObj.form.industryId1 | filterCommonDict(dictData.industry) }}</span>
                    <span v-else>{{ itemObj.form.industryId2 | filterLevel2(dictData.industry) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_size.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_size.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司规模："
                    prop="companySize"
                  >
                    <span>{{ itemObj.form.companySize | filterCommonDict(dictData.dicts.enterpriseScale) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_nature.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_nature.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司性质："
                    prop="companyType"
                  >
                    <span>{{ itemObj.form.companyType | filterCommonDict(dictData.dicts.enterpriseProperty) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.company_introduction.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.company_introduction.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="公司介绍："
                    prop="companyIntroduce"
                  >
                    <span>{{ itemObj.form.companyIntroduce }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.job_title.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.job_title.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="职位名称："
                    prop="title"
                  >
                    <span>{{ itemObj.form.title }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.subordinate_departments.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.subordinate_departments.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所属部门："
                    prop="department"
                  >
                    <span>{{ itemObj.form.department }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.responsible_area.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.responsible_area.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="负责区域："
                    prop="responsibleArea"
                  >
                    <span>{{ itemObj.form.responsibleArea }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.overseas.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.overseas.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="是否海外："
                    prop="isOverseas"
                  >
                    <span>{{ itemObj.form.isOverseas | filterCommonDict(dictData.dicts.isOverseas) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.reporting_object.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.reporting_object.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="汇报对象："
                    prop="leader"
                  >
                    <span>{{ itemObj.form.leader }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.number_subordinates.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.number_subordinates.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="下属人数："
                    prop="underlingNumber"
                  >
                    <span>{{ itemObj.form.underlingNumber }}人</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.operating_duty.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.operating_duty.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="工作职责："
                    prop="summary"
                  >
                    <span>{{ itemObj.form.summary }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.job_performance.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.job_performance.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="工作业绩："
                    prop="achievement"
                  >
                    <span>{{ itemObj.form.achievement }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.workExp.reasons_leaving.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.workExp.reasons_leaving.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="离职原因："
                    prop="reasonOfLeaving"
                  >
                    <span>{{ itemObj.form.reasonOfLeaving }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('job')">
                <i class="el-icon-plus"></i> 添加工作经历
              </a>
            </div>
          </div>
          <!-- 项目经验 -->
          <div v-if="reportTplInfo.projectExp.isHave" id="nav_6" class="panel">
            <p class="panel-title">
              <span class="title-name">项目经验</span>
              <span v-show="!status('2', 'project')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.project.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'project-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.project.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.projectExp.project_start_time.isHave" :span="24">
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: reportTplInfo.projectExp.project_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label="项目时间："
                      prop="startDate"
                      class="form-group-left"
                    >
                      <el-date-picker
                        v-model="itemObj.form.startDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="{ required: reportTplInfo.projectExp.project_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="endDate"
                      class="form-group-center"
                    >
                      <el-date-picker
                        v-model="itemObj.form.endDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目名称："
                    prop="projectName"
                  >
                    <el-input
                      v-model="itemObj.form.projectName"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_company.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_company.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所在公司："
                    prop="companyName"
                  >
                    <el-input
                      v-model="itemObj.form.companyName"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_duties.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_duties.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目职务："
                    prop="title"
                  >
                    <el-input
                      v-model="itemObj.form.title"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_description.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_description.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目描述："
                    prop="projectDescription"
                  >
                    <el-input
                      v-model="itemObj.form.projectDescription"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_responsibilities.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_responsibilities.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目职责："
                    prop="responsibilities"
                  >
                    <el-input
                      v-model="itemObj.form.responsibilities"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="2000"
                      show-word-limit
                      placeholder="最多2000字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_performance.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_performance.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目业绩："
                    prop="projectAchievement"
                  >
                    <el-input
                      v-model="itemObj.form.projectAchievement"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      minlength="20"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('project',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('project',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('project',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'project-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.project.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('project', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.projectExp.project_start_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_start_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目时间："
                    prop="endDate"
                  >
                    <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目名称："
                    prop="projectName"
                  >
                    <span>{{ itemObj.form.projectName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_company.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_company.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="所在公司："
                    prop="companyName"
                  >
                    <span>{{ itemObj.form.companyName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_duties.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_duties.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目职务："
                    prop="title"
                  >
                    <span>{{ itemObj.form.title }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_description.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_description.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目描述："
                    prop="projectDescription"
                  >
                    <span>{{ itemObj.form.projectDescription }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_responsibilities.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_responsibilities.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目职责："
                    prop="responsibilities"
                  >
                    <span>{{ itemObj.form.responsibilities }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.projectExp.project_performance.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.projectExp.project_performance.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="项目业绩："
                    prop="projectAchievement"
                  >
                    <span>{{ itemObj.form.projectAchievement }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('project')">
                <i class="el-icon-plus"></i> 添加项目经历
              </a>
            </div>
          </div>
          <!-- 培训经历 -->
          <div v-if="reportTplInfo.trainRecord.isHave" id="nav_7" class="panel">
            <p class="panel-title">
              <span class="title-name">培训经历</span>
              <span v-show="!status('2', 'train')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.train.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'train-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.train.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.trainRecord.train_start_time.isHave" :span="24">
                  <div class="form-group">
                    <el-form-item
                      :rules="{ required: reportTplInfo.trainRecord.train_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label="培训时间："
                      prop="startDate"
                      class="form-group-left"
                    >
                      <el-date-picker
                        v-model="itemObj.form.startDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                    <span class="concat-line">-</span>
                    <el-form-item
                      :rules="{ required: reportTplInfo.trainRecord.train_start_time.isRequired, message: '该项必填', trigger: 'change' }"
                      label
                      prop="endDate"
                      class="form-group-center"
                    >
                      <el-date-picker
                        v-model="itemObj.form.endDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                      />
                      <span class="date-icon">
                        <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                      </span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="reportTplInfo.trainRecord.train_course.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.trainRecord.train_course.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="培训课程："
                    prop="trainingCourse"
                  >
                    <el-input
                      v-model="itemObj.form.trainingCourse"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.trainRecord.train_institutions.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.trainRecord.train_institutions.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="培训机构："
                    prop="trainingInstitution"
                  >
                    <el-input
                      v-model="itemObj.form.trainingInstitution"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('train',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('train',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('train',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'train-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.train.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('train', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.trainRecord.train_start_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.trainRecord.train_start_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="培训时间："
                    prop="endDate"
                  >
                    <span>{{ itemObj.form.startDate }}-{{ itemObj.form.endDate }}（{{ itemObj.form.startDate | filterYearMonth(itemObj.form.endDate) }}）</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.trainRecord.train_course.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.trainRecord.train_course.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="培训课程："
                    prop="trainingCourse"
                  >
                    <span>{{ itemObj.form.trainingCourse }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.trainRecord.train_institutions.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.trainRecord.train_institutions.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="培训机构："
                    prop="trainingInstitution"
                  >
                    <span>{{ itemObj.form.trainingInstitution }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('train')">
                <i class="el-icon-plus"></i> 添加培训经历
              </a>
            </div>
          </div>
          <!-- 语言能力 -->
          <div v-if="reportTplInfo.langPower.isHave" id="nav_8" class="panel">
            <p class="panel-title">
              <span class="title-name">语言能力</span>
              <span v-show="!status('2', 'language')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.language.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'language-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.language.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.langPower.languages.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.languages.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="语种："
                    prop="Languages"
                  >
                    <el-input
                      v-model="itemObj.form.Languages"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.speaking_ability.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.speaking_ability.isRequired, message: '该项必填', trigger: 'change' }"
                    label="口语能力："
                    prop="ListeningSpeakingSkills"
                  >
                    <el-select
                      v-model="itemObj.form.ListeningSpeakingSkills"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.readListenSkills"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.writing_ability.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.writing_ability.isRequired, message: '该项必填', trigger: 'change' }"
                    label="书写能力："
                    prop="ReadingWritingSkills"
                  >
                    <el-select
                      v-model="itemObj.form.ReadingWritingSkills"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in dictData.dicts.readListenSkills"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.grade.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.grade.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="等级："
                    prop="level"
                  >
                    <el-input
                      v-model="itemObj.form.level"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('language',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('language',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('language',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'language-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.language.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('language', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.langPower.languages.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.languages.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="语种："
                    prop="Languages"
                  >
                    <span>{{ itemObj.form.Languages }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.speaking_ability.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.speaking_ability.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="口语能力："
                    prop="ListeningSpeakingSkills"
                  >
                    <span>{{ itemObj.form.ListeningSpeakingSkills | filterCommonDict(dictData.dicts.readListenSkills) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.writing_ability.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.writing_ability.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="书写能力："
                    prop="ReadingWritingSkills"
                  >
                    <span>{{ itemObj.form.ReadingWritingSkills | filterCommonDict(dictData.dicts.readListenSkills) }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.langPower.grade.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.langPower.grade.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="等级："
                    prop="level"
                  >
                    <span>{{ itemObj.form.level }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('language')">
                <i class="el-icon-plus"></i> 添加语言能力
              </a>
            </div>
          </div>
          <!-- 证书信息 -->
          <div v-if="reportTplInfo.cerInfo.isHave" id="nav_9" class="panel">
            <p class="panel-title">
              <span class="title-name">证书信息</span>
              <span v-show="!status('2', 'certificate')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.certificate.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'certificate-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.certificate.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.cerInfo.acquisition_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.acquisition_time.isRequired, message: '该项必填', trigger: 'change' }"
                    label="获取时间："
                    prop="receivingDate"
                  >
                    <el-date-picker
                      v-model="itemObj.form.receivingDate"
                      type="month"
                      value-format="yyyy-MM"
                      placeholder="请选择"
                    />
                    <span class="date-icon">
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping3"></i>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.cerInfo.certificate_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.certificate_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="证书名称："
                    prop="nameOfCertificate"
                  >
                    <el-input
                      v-model="itemObj.form.nameOfCertificate"
                      placeholder
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.cerInfo.describe.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.describe.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="描述："
                    prop="score"
                  >
                    <el-input
                      v-model="itemObj.form.score"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('certificate',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('certificate',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('certificate',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'certificate-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.certificate.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('certificate', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.cerInfo.acquisition_time.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.acquisition_time.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="获取时间："
                    prop="receivingDate"
                  >
                    <span>{{ itemObj.form.receivingDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.cerInfo.certificate_name.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.certificate_name.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="证书名称："
                    prop="nameOfCertificate"
                  >
                    <span>{{ itemObj.form.nameOfCertificate }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.cerInfo.describe.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.cerInfo.describe.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="描述："
                    prop="score"
                  >
                    <span>{{ itemObj.form.score }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('certificate')">
                <i class="el-icon-plus"></i> 添加证书信息
              </a>
            </div>
          </div>
          <!-- 自我评价 -->
          <div v-if="reportTplInfo.selfEvaluation.isHave" id="nav_10" class="panel">
            <p class="panel-title">
              <span class="title-name">自我评价</span>
              <span v-show="!status('2', 'evaluation')" class="title-validate">不完善</span>
            </p>
            <div class="panel-body" :class="{disabled: resumeInfo.evaluation.disabled}">
              <el-form
                v-show="resumeInfo.evaluation.edit"
                ref="evaluation-edit"
                class="edit-form"
                :model="resumeInfo.evaluation.form"
                :rules="resumeInfo.evaluation.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.selfEvaluation.self_evaluation.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.selfEvaluation.self_evaluation.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="自我评价："
                    prop="personal"
                  >
                    <el-input
                      v-model="resumeInfo.evaluation.form.personal"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('evaluation')">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('evaluation')">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!resumeInfo.evaluation.edit"
                ref="evaluation-show"
                class="edit-form show-form"
                :model="resumeInfo.evaluation.form"
                :rules="resumeInfo.evaluation.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit single"
                  @click="editItem('evaluation')"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.selfEvaluation.self_evaluation.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.selfEvaluation.self_evaluation.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="自我评价："
                    prop="personal"
                  >
                    <span>{{ resumeInfo.evaluation.form.personal }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </div>
          <!-- 附加信息 -->
          <div v-if="reportTplInfo.additionalInformation.isHave" id="nav_11" class="panel">
            <p class="panel-title">
              <span class="title-name">附加信息</span>
              <span v-show="!status('2', 'attach')" class="title-validate">不完善</span>
            </p>
            <div class="panel-body" :class="{disabled: resumeInfo.attach.disabled}">
              <el-form
                v-show="resumeInfo.attach.edit"
                ref="attach-edit"
                class="edit-form"
                :model="resumeInfo.attach.form"
                :rules="resumeInfo.attach.rules"
                label-width="100px"
              >
                <el-col
                  v-if="reportTplInfo.additionalInformation.additional_information.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.additionalInformation.additional_information.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="附加信息："
                    prop="attachmentInformation"
                  >
                    <el-input
                      v-model="resumeInfo.attach.form.attachmentInformation"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('attach')">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('attach')">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!resumeInfo.attach.edit"
                ref="attach-show"
                class="edit-form show-form"
                :model="resumeInfo.attach.form"
                :rules="resumeInfo.attach.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit single"
                  @click="editItem('attach')"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col
                  v-if="reportTplInfo.additionalInformation.additional_information.isHave"
                  :span="24"
                >
                  <el-form-item
                    :rules="{ required: reportTplInfo.additionalInformation.additional_information.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="附加信息："
                    prop="attachmentInformation"
                  >
                    <span>{{ resumeInfo.attach.form.attachmentInformation }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </div>
          <!-- 我的作品 -->
          <div v-if="reportTplInfo.opusInformation.isHave" id="nav_12" class="panel">
            <p class="panel-title">
              <span class="title-name">我的作品</span>
              <span v-show="!status('2', 'works')" class="title-validate">不完善</span>
            </p>
            <div
              v-for="(itemObj,index) in resumeInfo.works.data"
              :key="index"
              class="panel-body"
              :class="{disabled: itemObj.disabled}"
            >
              <el-form
                v-show="itemObj.edit"
                :ref="'works-edit' + index"
                class="edit-form"
                :model="itemObj.form"
                :rules="resumeInfo.works.rules"
                label-width="100px"
              >
                <el-col v-if="reportTplInfo.opusInformation.opus_enclosure.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.opus_enclosure.isRequired, message: '该项必填', trigger: 'change' }"
                    label="上传作品："
                  >
                    <el-upload
                      action="/api/common/upload"
                      :data="{ossFileType: 'resumeInformation'}"
                      :before-upload="beforeUpload"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                      :limit="1"
                      :show-file-list="false"
                    >
                      <el-button class="confirm-btn" style="margin: 0;width: 120px;">上传附件</el-button>
                      <div
                        slot="tip"
                        class="el-upload__tip"
                      >为了保护候选人个人作品版权，请勿上传20M以上的作品附件(上传文件支持格式：txt,html,htm,doc,docx,pdf,jpg,jpeg,gif,png,bmp)</div>
                    </el-upload>
                    <span class="work-file">{{ itemObj.form.opusName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.opusInformation.works_link.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.works_link.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="作品链接："
                    prop="opuslink"
                  >
                    <el-input
                      v-model="itemObj.form.opuslink"
                      placeholder="http://"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.opusInformation.work_notes.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.work_notes.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="作品说明："
                    prop="opusExplain"
                  >
                    <el-input
                      v-model="itemObj.form.opusExplain"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      maxlength="500"
                      show-word-limit
                      placeholder="最多500字"
                      autocomplete="off"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item style="text-align: center">
                    <el-button class="confirm-btn" @click="saveItem('works',index)">保存</el-button>
                    <el-button class="cancel-btn" @click="cancelItem('works',index)">取消</el-button>
                    <a
                      href="javascript:void(0);"
                      class="delete-link"
                      @click="delItem('works',index)"
                    >
                      <i class="icon iconfont icon-zhuanxietuijianbaogao-changping1"></i>
                      删除本条
                    </a>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                v-show="!itemObj.edit"
                :ref="'works-show' + index"
                class="edit-form show-form"
                :model="itemObj.form"
                :rules="resumeInfo.works.rules"
                label-width="100px"
              >
                <a
                  href="javascript:void(0);"
                  class="show-form-edit"
                  @click="editItem('works', index)"
                >
                  <i class="icon iconfont icon-zhuanxietuijianbaogao-changping2"></i>
                  编辑
                </a>
                <el-col v-if="reportTplInfo.opusInformation.opus_enclosure.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.opus_enclosure.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="作品附件："
                  >
                    <span class="work-file">{{ itemObj.form.opusName }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.opusInformation.works_link.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.works_link.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="作品地址："
                    prop="opuslink"
                  >
                    <a
                      :href="itemObj.form.opuslink"
                      target="_blank"
                      class="work-link"
                    >{{ itemObj.form.opuslink }}</a>
                  </el-form-item>
                </el-col>
                <el-col v-if="reportTplInfo.opusInformation.works_link.isHave" :span="24">
                  <el-form-item
                    :rules="{ required: reportTplInfo.opusInformation.works_link.isRequired, message: '该项必填', trigger: 'blur' }"
                    label="作品说明："
                    prop="opusExplain"
                  >
                    <span>{{ itemObj.form.opusExplain }}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div class="panel-footer" :class="{disabled: isDisabledFooter}">
              <a href="javascript:void(0);" @click="addItem('works')">
                <i class="el-icon-plus"></i> 添加我的作品
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧导航 -->
      <div class="right-bar">
        <div id="fixedHeaderRoot" :class="['bar-main',headerFixed && 'isFixed']">
          <div class="panel">
            <div class="panel-title" @click="toResumeUpload">附件简历对比</div>
            <div class="panel-body">
              <p
                v-if="reportTplInfo.recommendReport.isHave"
                :class="['item',{active: currentNav === '1'}]"
                @click="currentNav = '1'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_1" class="item-name">推荐信息</a>
                <span class="item-status">
                  <i
                    v-show="status('1', 'reportInfo')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('1', 'reportInfo')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.baseInfo.isHave"
                :class="['item',{active: currentNav === '2'}]"
                @click="currentNav = '2'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_2" class="item-name">基本信息</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'base')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'base')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.jobExpectation.isHave"
                :class="['item',{active: currentNav === '3'}]"
                @click="currentNav = '3'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_3" class="item-name">求职意向</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'intention')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'intention')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.eduExp.isHave"
                :class="['item',{active: currentNav === '4'}]"
                @click="currentNav = '4'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_4" class="item-name">教育经历</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'education')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'education')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.workExp.isHave"
                :class="['item',{active: currentNav === '5'}]"
                @click="currentNav = '5'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_5" class="item-name">工作经历</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'job')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'job')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.projectExp.isHave"
                :class="['item',{active: currentNav === '6'}]"
                @click="currentNav = '6'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_6" class="item-name">项目经验</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'project')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'project')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.trainRecord.isHave"
                :class="['item',{active: currentNav === '7'}]"
                @click="currentNav = '7'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_7" class="item-name">培训经历</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'train')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'train')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.langPower.isHave"
                :class="['item',{active: currentNav === '8'}]"
                @click="currentNav = '8'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_8" class="item-name">语言能力</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'language')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'language')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.cerInfo.isHave"
                :class="['item',{active: currentNav === '9'}]"
                @click="currentNav = '9'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_9" class="item-name">证书信息</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'certificate')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'certificate')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.selfEvaluation.isHave"
                :class="['item',{active: currentNav === '10'}]"
                @click="currentNav = '10'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_10" class="item-name">自我评价</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'evaluation')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'evaluation')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.additionalInformation.isHave"
                :class="['item',{active: currentNav === '11'}]"
                @click="currentNav = '11'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_11" class="item-name">附加信息</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'attach')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'attach')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
              <p
                v-if="reportTplInfo.opusInformation.isHave"
                :class="['item',{active: currentNav === '12'}]"
                @click="currentNav = '12'"
              >
                <span class="item-hover">
                  <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
                </span>
                <a href="#nav_12" class="item-name">我的作品</a>
                <span class="item-status">
                  <i
                    v-show="status('2', 'works')"
                    class="status-success icon iconfont icon-zhuanxietuijianbaogao-biaozhunping"
                  />
                  <i
                    v-show="!status('2', 'works')"
                    class="status-error icon iconfont icon-zhuanxietuijianbaogao-biaozhunping1"
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部栏 -->
    <div :class="['footer-bar',fixedFooter && 'isFixedFooter']">
      <div class="wrap-bar">
        <div class="bar-main">
          <div class="main-btn">
            <el-button class="confirm-btn" :loading="nextLoading" @click="next">预览后发送推荐报告</el-button>
            <el-button class="cancel-btn" :loading="nextLoading" @click="savaDraft">保存草稿</el-button>
          </div>
          <div class="main-link">
            <a href="javascript:void(0);" @click="handleBack">返回上一步</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import selectPicker from '@/components/common/selectPicker'
import selectPickerDouble from '@/components/common/selectPickerDouble'
import topBar from './recommendCandidateCommon/topBar'
import {
  getPositionDetailById,
  getCompanyDetail,
  getCompanyResumeFieldList,
  getRecommendReportDetailById,
  getResumeInfoById,
  getCandidateRecommendReportInfoVOById,
  updateRecommendReport,
  addRecommendReportDraft,
  updateRecommendReportDraft,
  getCandidateRecommendReportDraftInfoVOById
} from '@/api/position'
export default {
  components: {
    selectPicker,
    selectPickerDouble,
    topBar
  },
  data() {
    return {
      // 下一步按钮是否loading状态
      nextLoading: false,
      // 当前导航
      currentNav: '1',
      // 是否固定底部
      fixedFooter: false,
      // 是否禁用添加区域按钮
      isDisabledFooter: false,
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
        status: false,
        edit: true,
        form: {
          id: this.$route.query.reportId
        },
        rules: {}
      },
      // 简历信息
      resumeInfo: {
        detail: {
          id: this.$route.query.resumeId,
          status: true
        },
        base: {
          disabled: false,
          status: false,
          edit: false,
          form: {},
          rules: {}
        },
        intention: {
          disabled: false,
          status: false,
          edit: false,
          form: {},
          rules: {}
        },
        education: {
          data: [],
          rules: {}
        },
        job: {
          data: [],
          rules: {}
        },
        project: {
          data: [],
          rules: {}
        },
        train: {
          data: [],
          rules: {}
        },
        language: {
          data: [],
          rules: {}
        },
        certificate: {
          data: [],
          rules: {}
        },
        evaluation: {
          disabled: false,
          status: false,
          edit: false,
          form: {},
          rules: {}
        },
        attach: {
          disabled: false,
          status: false,
          edit: false,
          form: {},
          rules: {}
        },
        works: {
          data: [],
          rules: {}
        }
      },
      // 草稿信息
      draftInfo: {
        id: this.$route.query.draftId
      }
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 校验段落状态
    status() {
      return function(type, name) {
        let obj = {}
        if (type === '1') {
          obj = this[name]
        } else {
          obj = this.resumeInfo[name]
        }
        if (obj.data) {
          let result = true
          obj.data.forEach(item => {
            if (!item.status) {
              result = false
            }
          })
          return result
        } else {
          return obj.status
        }
      }
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
    // 选择好所在地后
    afterCloseLiveCity() {
      const liveCity = this.selectedData.liveCity
      if (liveCity && liveCity.length) {
        this.resumeInfo.base.form.liveCity = liveCity[0]
      } else {
        this.resumeInfo.base.form.liveCity = ''
      }
    },
    // 选择好籍贯后
    afterCloseNativeCity() {
      const nativeCity = this.selectedData.nativeCity
      if (nativeCity && nativeCity.length) {
        this.resumeInfo.base.form.nativeCity = nativeCity[0]
      } else {
        this.resumeInfo.base.form.nativeCity = ''
      }
    },
    // 选择好户籍后
    afterCloseRegisterCity() {
      const registerCity = this.selectedData.registerCity
      if (registerCity && registerCity.length) {
        this.resumeInfo.base.form.registerCity = registerCity[0]
      } else {
        this.resumeInfo.base.form.registerCity = ''
      }
    },
    // 选择好期望行业后
    afterCloseIntentionIndustryId() {
      const intentionIndustryId = this.selectedData.intentionIndustryId
      if (intentionIndustryId && intentionIndustryId.length) {
        this.resumeInfo.intention.form.intentionIndustryId = intentionIndustryId.join(
          ','
        )
      } else {
        this.resumeInfo.intention.form.intentionIndustryId = ''
      }
    },
    // 选择好期望城市后
    afterCloseIntentionCity() {
      const intentionCity = this.selectedData.intentionCity
      if (intentionCity && intentionCity.length) {
        this.resumeInfo.intention.form.intentionCity = intentionCity[0]
      } else {
        this.resumeInfo.intention.form.intentionCity = ''
      }
    },
    // 选择好所属行业后（数组形式数据源）
    afterCloseIndustryId(itemObj) {
      const industryId = this.selectedData.industryId
      if (industryId && industryId.length) {
        const index = industryId[0].length / 3
        itemObj.form[`industryId${index}`] = industryId.join(',')
        // 解决picker控件校验逻辑
        this.$set(itemObj.form, 'industryId', '000000000')
      } else {
        itemObj.form.industryId1 = ''
        itemObj.form.industryId2 = ''
        // 解决picker控件校验逻辑
        this.$set(itemObj.form, 'industryId', '')
      }
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
        // 判断是新增推荐报告/返回修改（下一步返回修改）推荐报告/编辑草稿推荐报告
        if (this.reportInfo.form.id && this.resumeInfo.detail.id) {
          // 新增
          // 查询推荐报告信息
          this.queryReportInfo()
          // 查询简历信息
          this.queryResumeInfo()
        } else if (this.reportInfo.form.id) {
          // 返回修改
          // 查询推荐报告详细信息
          this.queryReportDetailInfo()
        } else {
          // 编辑草稿推荐报告
          // 查询草稿推荐报告详细信息
          this.queryDraftReportDetailInfo()
        }
      })
    },
    // 查询推荐报告信息
    queryReportInfo(type) {
      const para = Object.assign({}, this.reportInfo.form)
      getRecommendReportDetailById(para).then(res => {
        // 推荐报告中的这些字段和简历中求职意向这些字段做关联逻辑
        delete res.data.reportTitle
        delete res.data.name
        delete res.data.currentSalary
        delete res.data.currentSalaryMonth
        delete res.data.currentSalaryTax
        delete res.data.currentOtherSalary
        delete res.data.intentionSalaryTax
        delete res.data.intentionAnnualSalary
        delete res.data.isNegotiated
        this.reportInfo.form = Object.assign(this.reportInfo.form, res.data)
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['reportInfo-edit'].validate(valid => {
              if (valid) {
                this.reportInfo.status = true
              }
            })
            // 初次进入不显示校验结果
            this.$refs['reportInfo-edit'].clearValidate()
            // 如果触发取消按钮-则校验展示表单
            if (type === 'cancel') {
              this.$refs['reportInfo-show'].validate()
            }
          })
        } else {
          this.reportInfo.status = true
        }
      })
    },
    // 查询简历信息
    queryResumeInfo() {
      const para = Object.assign({}, this.resumeInfo.detail)
      getResumeInfoById(para).then(res => {
        // 处理简历表中求职意向字段和推荐报告中求职意向字段不匹配的问题
        res.data.detail.intentionAnnualSalary =
          res.data.detail.intentionSalary / 10000
        res.data.detail.intentionIndustryId =
          res.data.detail.intentionIndustryId1 ||
          res.data.detail.intentionIndustryId2
        // 推荐报告中的这些字段和简历中求职意向这些字段做关联逻辑
        this.reportInfo.form.reportTitle =
          res.data.detail.name +
          ' - ' +
          this.positionInfo.title +
          ' - ' +
          this.companyInfo.shortName
        this.reportInfo.form.name = res.data.detail.name
        this.reportInfo.form.currentSalary = res.data.detail.currentSalary
        this.reportInfo.form.currentSalaryMonth =
          res.data.detail.currentSalaryMonth
        this.reportInfo.form.currentSalaryTax = res.data.detail.currentSalaryTax
        this.reportInfo.form.currentOtherSalary =
          res.data.detail.currentOtherSalary
        this.reportInfo.form.intentionSalaryTax =
          res.data.detail.intentionSalaryTax
        this.reportInfo.form.intentionAnnualSalary =
          res.data.detail.intentionAnnualSalary
        this.reportInfo.form.isNegotiated =
          res.data.detail.isNegotiated
        this.reportInfo.form = Object.assign({}, this.reportInfo.form)
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['reportInfo-edit'].validate(valid => {
              if (valid) {
                this.reportInfo.status = true
              }
            })
            // 初次进入不显示校验结果
            this.$refs['reportInfo-edit'].clearValidate()
          })
        } else {
          this.reportInfo.status = true
        }
        // 基本信息
        this.resumeInfo.base.form = res.data.detail
        if (this.reportTplInfo.baseInfo.isHave) {
          this.$nextTick(() => {
            this.$refs['base-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.base.status = true
              }
            })
          })
        } else {
          this.resumeInfo.base.status = true
        }
        // 求职意向
        this.resumeInfo.intention.form = res.data.detail
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['intention-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.intention.status = true
              }
            })
          })
        } else {
          this.resumeInfo.intention.status = true
        }
        // 教育经历
        res.data.educations &&
          res.data.educations.forEach((item, index) => {
            this.resumeInfo.education.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.eduExp.isHave) {
              this.$nextTick(() => {
                this.$refs['education-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.education.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.education.data[index].status = true
            }
          })
        // 工作经历
        res.data.experiences &&
          res.data.experiences.forEach((item, index) => {
            this.resumeInfo.job.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            // 解决picker控件校验逻辑
            if (item.industryId1 || item.industryId2) {
              this.$set(item, 'industryId', '000000000')
            } else {
              this.$set(item, 'industryId', '')
            }
            if (this.reportTplInfo.workExp.isHave) {
              this.$nextTick(() => {
                this.$refs['job-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.job.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.job.data[index].status = true
            }
          })
        // 项目经验
        res.data.projects &&
          res.data.projects.forEach((item, index) => {
            this.resumeInfo.project.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.projectExp.isHave) {
              this.$nextTick(() => {
                this.$refs['project-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.project.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.project.data[index].status = true
            }
          })
        // 培训经历
        res.data.training &&
          res.data.training.forEach((item, index) => {
            this.resumeInfo.train.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.trainRecord.isHave) {
              this.$nextTick(() => {
                this.$refs['train-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.train.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.train.data[index].status = true
            }
          })
        // 语言能力
        res.data.languages &&
          res.data.languages.forEach((item, index) => {
            this.resumeInfo.language.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.langPower.isHave) {
              this.$nextTick(() => {
                this.$refs['language-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.language.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.language.data[index].status = true
            }
          })
        // 证书信息
        res.data.cerInfos &&
          res.data.cerInfos.forEach((item, index) => {
            this.resumeInfo.certificate.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.cerInfo.isHave) {
              this.$nextTick(() => {
                this.$refs['certificate-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.certificate.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.certificate.data[index].status = true
            }
          })
        // 自我评价
        this.resumeInfo.evaluation.form = res.data.detail
        if (this.reportTplInfo.selfEvaluation.isHave) {
          this.$nextTick(() => {
            this.$refs['evaluation-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.evaluation.status = true
              }
            })
          })
        } else {
          this.resumeInfo.evaluation.status = true
        }
        // 附加信息
        this.resumeInfo.attach.form = res.data.detail
        if (this.reportTplInfo.additionalInformation.isHave) {
          this.$nextTick(() => {
            this.$refs['attach-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.attach.status = true
              }
            })
          })
        } else {
          this.resumeInfo.attach.status = true
        }
        // 我的作品
        res.data.opus &&
          res.data.opus.forEach((item, index) => {
            this.resumeInfo.works.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.opusInformation.isHave) {
              this.$nextTick(() => {
                this.$refs['works-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.works.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.works.data[index].status = true
            }
          })
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
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['reportInfo-edit'].validate(valid => {
              if (valid) {
                this.reportInfo.status = true
              }
            })
          })
        } else {
          this.reportInfo.status = true
        }
        // 基本信息
        this.resumeInfo.base.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.baseInfo.isHave) {
          this.$nextTick(() => {
            this.$refs['base-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.base.status = true
              }
            })
          })
        } else {
          this.resumeInfo.base.status = true
        }
        // 求职意向
        this.resumeInfo.intention.form = res.data.candidateRecommendReport
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['intention-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.intention.status = true
              }
            })
          })
        } else {
          this.resumeInfo.intention.status = true
        }
        // 教育经历
        res.data.resumeInfo.educations &&
          res.data.resumeInfo.educations.forEach((item, index) => {
            this.resumeInfo.education.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.eduExp.isHave) {
              this.$nextTick(() => {
                this.$refs['education-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.education.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.education.data[index].status = true
            }
          })
        // 工作经历
        res.data.resumeInfo.experiences &&
          res.data.resumeInfo.experiences.forEach((item, index) => {
            this.resumeInfo.job.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            // 解决picker控件校验逻辑
            if (item.industryId1 || item.industryId2) {
              this.$set(item, 'industryId', '000000000')
            } else {
              this.$set(item, 'industryId', '')
            }
            if (this.reportTplInfo.workExp.isHave) {
              this.$nextTick(() => {
                this.$refs['job-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.job.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.job.data[index].status = true
            }
          })
        // 项目经验
        res.data.resumeInfo.projects &&
          res.data.resumeInfo.projects.forEach((item, index) => {
            this.resumeInfo.project.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.projectExp.isHave) {
              this.$nextTick(() => {
                this.$refs['project-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.project.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.project.data[index].status = true
            }
          })
        // 培训经历
        res.data.resumeInfo.training &&
          res.data.resumeInfo.training.forEach((item, index) => {
            this.resumeInfo.train.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.trainRecord.isHave) {
              this.$nextTick(() => {
                this.$refs['train-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.train.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.train.data[index].status = true
            }
          })
        // 语言能力
        res.data.resumeInfo.languages &&
          res.data.resumeInfo.languages.forEach((item, index) => {
            this.resumeInfo.language.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.langPower.isHave) {
              this.$nextTick(() => {
                this.$refs['language-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.language.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.language.data[index].status = true
            }
          })
        // 证书信息
        res.data.resumeInfo.cerInfos &&
          res.data.resumeInfo.cerInfos.forEach((item, index) => {
            this.resumeInfo.certificate.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.cerInfo.isHave) {
              this.$nextTick(() => {
                this.$refs['certificate-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.certificate.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.certificate.data[index].status = true
            }
          })
        // 自我评价
        this.resumeInfo.evaluation.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.selfEvaluation.isHave) {
          this.$nextTick(() => {
            this.$refs['evaluation-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.evaluation.status = true
              }
            })
          })
        } else {
          this.resumeInfo.evaluation.status = true
        }
        // 附加信息
        this.resumeInfo.attach.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.additionalInformation.isHave) {
          this.$nextTick(() => {
            this.$refs['attach-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.attach.status = true
              }
            })
          })
        } else {
          this.resumeInfo.attach.status = true
        }
        // 我的作品
        res.data.resumeInfo.opus &&
          res.data.resumeInfo.opus.forEach((item, index) => {
            this.resumeInfo.works.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.opusInformation.isHave) {
              this.$nextTick(() => {
                this.$refs['works-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.works.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.works.data[index].status = true
            }
          })
      })
    },
    // 查询草稿推荐报告详细信息
    queryDraftReportDetailInfo() {
      const para = Object.assign({}, this.draftInfo)
      getCandidateRecommendReportDraftInfoVOById(para).then(res => {
        // 处理期望年薪前后端单位不匹配的问题
        res.data.candidateRecommendReportDraft.intentionAnnualSalary =
          res.data.candidateRecommendReportDraft.intentionAnnualSalary / 10000
        // 处理通过草稿进入推荐报告导致id为草稿主键ID，推荐报告ID为refReportId的情况
        res.data.candidateRecommendReportDraft.id =
          res.data.candidateRecommendReportDraft.refReportId
        // 给简历detail对象赋ID值为了保证调用查详情接口下简历ID缺失的问题
        this.resumeInfo.detail.id = res.data.resumeInfo.detail.id
        // 推荐报告信息
        this.reportInfo.form = res.data.candidateRecommendReportDraft
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['reportInfo-edit'].validate(valid => {
              if (valid) {
                this.reportInfo.status = true
              }
            })
          })
        } else {
          this.reportInfo.status = true
        }
        // 基本信息
        this.resumeInfo.base.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.baseInfo.isHave) {
          this.$nextTick(() => {
            this.$refs['base-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.base.status = true
              }
            })
          })
        } else {
          this.resumeInfo.base.status = true
        }
        // 求职意向
        this.resumeInfo.intention.form = res.data.candidateRecommendReportDraft
        if (this.reportTplInfo.recommendReport.isHave) {
          this.$nextTick(() => {
            this.$refs['intention-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.intention.status = true
              }
            })
          })
        } else {
          this.resumeInfo.intention.status = true
        }
        // 教育经历
        res.data.resumeInfo.educations &&
          res.data.resumeInfo.educations.forEach((item, index) => {
            this.resumeInfo.education.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.eduExp.isHave) {
              this.$nextTick(() => {
                this.$refs['education-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.education.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.education.data[index].status = true
            }
          })
        // 工作经历
        res.data.resumeInfo.experiences &&
          res.data.resumeInfo.experiences.forEach((item, index) => {
            this.resumeInfo.job.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            // 解决picker控件校验逻辑
            if (item.industryId1 || item.industryId2) {
              this.$set(item, 'industryId', '000000000')
            } else {
              this.$set(item, 'industryId', '')
            }
            if (this.reportTplInfo.workExp.isHave) {
              this.$nextTick(() => {
                this.$refs['job-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.job.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.job.data[index].status = true
            }
          })
        // 项目经验
        res.data.resumeInfo.projects &&
          res.data.resumeInfo.projects.forEach((item, index) => {
            this.resumeInfo.project.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.projectExp.isHave) {
              this.$nextTick(() => {
                this.$refs['project-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.project.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.project.data[index].status = true
            }
          })
        // 培训经历
        res.data.resumeInfo.training &&
          res.data.resumeInfo.training.forEach((item, index) => {
            this.resumeInfo.train.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.trainRecord.isHave) {
              this.$nextTick(() => {
                this.$refs['train-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.train.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.train.data[index].status = true
            }
          })
        // 语言能力
        res.data.resumeInfo.languages &&
          res.data.resumeInfo.languages.forEach((item, index) => {
            this.resumeInfo.language.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.langPower.isHave) {
              this.$nextTick(() => {
                this.$refs['language-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.language.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.language.data[index].status = true
            }
          })
        // 证书信息
        res.data.resumeInfo.cerInfos &&
          res.data.resumeInfo.cerInfos.forEach((item, index) => {
            this.resumeInfo.certificate.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.cerInfo.isHave) {
              this.$nextTick(() => {
                this.$refs['certificate-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.certificate.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.certificate.data[index].status = true
            }
          })
        // 自我评价
        this.resumeInfo.evaluation.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.selfEvaluation.isHave) {
          this.$nextTick(() => {
            this.$refs['evaluation-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.evaluation.status = true
              }
            })
          })
        } else {
          this.resumeInfo.evaluation.status = true
        }
        // 附加信息
        this.resumeInfo.attach.form = res.data.resumeInfo.detail
        if (this.reportTplInfo.additionalInformation.isHave) {
          this.$nextTick(() => {
            this.$refs['attach-show'].validate(valid => {
              if (valid) {
                this.resumeInfo.attach.status = true
              }
            })
          })
        } else {
          this.resumeInfo.attach.status = true
        }
        // 我的作品
        res.data.resumeInfo.opus &&
          res.data.resumeInfo.opus.forEach((item, index) => {
            this.resumeInfo.works.data.push({
              disabled: false,
              status: false,
              edit: false,
              form: item
            })
            if (this.reportTplInfo.opusInformation.isHave) {
              this.$nextTick(() => {
                this.$refs['works-show' + index][0].validate(valid => {
                  if (valid) {
                    this.resumeInfo.works.data[index].status = true
                  }
                })
              })
            } else {
              this.resumeInfo.works.data[index].status = true
            }
          })
      })
    },
    // 编辑推荐报告
    editReportInfo() {
      this.reportInfo.edit = true
    },
    // 取消推荐报告
    resetReportInfo() {
      this.reportInfo.edit = false
      this.queryReportInfo('cancel')
    },
    // 保存推荐报告
    submitReportInfo() {
      this.$refs['reportInfo-edit'].validate(valid => {
        if (valid) {
          const para = {}
          para.editType = 1
          para.candidateRecommendReportBO = Object.assign(
            {},
            this.reportInfo.form
          )
          para.candidateRecommendReportBO.intentionAnnualSalary =
            para.candidateRecommendReportBO.intentionAnnualSalary * 10000
          updateRecommendReport(para).then(res => {
            this.reportInfo.edit = false
            this.reportInfo.status = true
            this.$refs['reportInfo-show'].clearValidate()
            this.$message({
              message: '保存成功',
              type: 'success',
              showClose: true,
              center: true
            })
          })
        }
      })
    },
    // 增加段落项
    addItem(name) {
      for (const key in this.resumeInfo) {
        const obj = this.resumeInfo[key]
        if (obj.data) {
          obj.data.forEach(item => {
            item.disabled = true
          })
        } else {
          obj.disabled = true
        }
      }
      this.isDisabledFooter = true
      this.currEditObj = null
      const obj = this.resumeInfo[name]
      obj.data.push({
        disabled: false,
        status: false,
        edit: true,
        form: {}
      })
      // 记录下当前被编辑的是该集合中的第几个，暂时是为了实现上传作品知道是第几个上传的
      this.currEditIndex = obj.data.length - 1
    },
    // 编辑段落项
    editItem(name, index) {
      for (const key in this.resumeInfo) {
        const obj = this.resumeInfo[key]
        if (obj.data) {
          obj.data.forEach(item => {
            item.disabled = true
          })
        } else {
          obj.disabled = true
        }
      }
      this.isDisabledFooter = true
      const obj = this.resumeInfo[name]
      if (obj.data) {
        obj.data[index].edit = true
        obj.data[index].disabled = false
        this.currEditObj = Object.assign({}, obj.data[index].form)
      } else {
        obj.edit = true
        obj.disabled = false
        this.currEditObj = Object.assign({}, obj.form)
      }
      // 记录下当前被编辑的是该集合中的第几个，暂时是为了实现上传作品知道是第几个上传的
      if (index || index === 0) {
        this.currEditIndex = index
      }
    },
    // 取消段落项
    cancelItem(name, index) {
      for (const key in this.resumeInfo) {
        const obj = this.resumeInfo[key]
        if (obj.data) {
          obj.data.forEach(item => {
            item.disabled = false
          })
        } else {
          obj.disabled = false
        }
      }
      this.isDisabledFooter = false
      const obj = this.resumeInfo[name]
      if (obj.data) {
        obj.data[index].edit = false
        if (this.currEditObj) {
          obj.data[index].form = this.currEditObj
        } else {
          obj.data.splice(index, 1)
        }
      } else {
        obj.edit = false
        obj.form = this.currEditObj
      }
    },
    // 保存段落项
    saveItem(name, index) {
      let editRef = ''
      let showRef = ''
      let editObj = {}
      let showObj = {}
      if (index || index === 0) {
        editRef = name + '-edit' + index
        showRef = name + '-show' + index
        editObj = this.$refs[editRef][0]
        showObj = this.$refs[showRef][0]
      } else {
        editRef = name + '-edit'
        showRef = name + '-show'
        editObj = this.$refs[editRef]
        showObj = this.$refs[showRef]
      }
      editObj.validate(valid => {
        if (valid) {
          for (const key in this.resumeInfo) {
            const obj = this.resumeInfo[key]
            if (obj.data) {
              obj.data.forEach(item => {
                item.disabled = false
              })
            } else {
              obj.disabled = false
            }
          }
          this.isDisabledFooter = false
          const obj = this.resumeInfo[name]
          if (obj.data) {
            obj.data[index].edit = false
            obj.data[index].status = true
          } else {
            obj.edit = false
            obj.status = true
          }
          showObj.clearValidate()
        }
      })
    },
    // 删除段落项
    delItem(name, index) {
      this.$confirm('确认删除', '提示', {
        type: 'warning'
      })
        .then(() => {
          for (const key in this.resumeInfo) {
            const obj = this.resumeInfo[key]
            if (obj.data) {
              obj.data.forEach(item => {
                item.disabled = false
              })
            } else {
              obj.disabled = false
            }
          }
          this.isDisabledFooter = false
          const obj = this.resumeInfo[name]
          obj.data.splice(index, 1)
        })
        .catch(() => {})
    },
    // 文件上传失败处理
    uploadError(res, file) {
      this.$message({
        message: res.data.message,
        type: 'error',
        showClose: true,
        center: true
      })
    },
    // 图片上传前处理
    beforePicUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message({
          message: '只能上传jpg/png格式',
          type: 'error',
          showClose: true,
          center: true
        })
        return false
      }
      if (file.size / 1024 > 500) {
        this.$message({
          message: '图片大小不能超过500kb',
          type: 'error',
          showClose: true,
          center: true
        })
        return false
      }
      return true
    },
    // 图片上传成功处理
    uploadPicSuccess(res, file) {
      if (res.code === '000000') {
        this.resumeInfo.base.form.avatarImg = res.data.webPath
        this.resumeInfo.base.form.avatar = res.data.fileId
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },
    // 文件上传前处理
    beforeUpload(file) {
      if (
        !/.txt|.html|.htm|.doc|.docx|.pdf|.jpg|.jpeg|gif|png|bmp|$/.test(
          file.type
        )
      ) {
        this.$message({
          message: '上传格式不正确',
          type: 'error',
          showClose: true,
          center: true
        })
        return false
      }
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error',
          showClose: true,
          center: true
        })
        return false
      }
      return true
    },
    // 文件上传成功处理
    uploadSuccess(res, file) {
      if (res.code === '000000') {
        this.resumeInfo.works.data[this.currEditIndex].form.opusName =
          res.data.fileName
        this.resumeInfo.works.data = this.resumeInfo.works.data.concat([])
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },
    // 返回上一步
    handleBack() {
      const routeType = this.$route.query.routeType || 'recommendResume'
      const query = {}
      if (routeType === 'recommendResume') {
        query.positionId = this.$route.query.positionId
      } else {
        query.resumeId = this.$route.query.resumeId
      }
      this.$router.push({
        path: '/' + routeType,
        query: query
      })
    },
    // 下一步
    next() {
      // 校验所有段落状态
      let allStatus = true
      if (!this.reportInfo.status) {
        allStatus = false
      } else {
        for (const key in this.resumeInfo) {
          const obj = this.resumeInfo[key]
          if (obj.data) {
            obj.data.forEach(item => {
              if (!item.status) {
                allStatus = false
              }
            })
            if (!allStatus) {
              break
            }
          } else {
            if (!obj.status) {
              allStatus = false
              break
            }
          }
        }
      }
      if (!allStatus) {
        this.$alert('请先完善推荐报告信息', '提示', {
          showClose: false
        }).then(() => {})
        return false
      }
      this.nextLoading = true
      const para = {}
      para.editType = 0
      // 推荐报告
      para.candidateRecommendReportBO = Object.assign({}, this.reportInfo.form)
      // 求职意向
      const obIntensionObj = this.resumeInfo.intention.form
      para.jobIntensionBO = {
        jobStatus: obIntensionObj.jobStatus,
        currentSalary: obIntensionObj.currentSalary,
        currentSalaryMonth: obIntensionObj.currentSalaryMonth,
        currentSalaryTax: obIntensionObj.currentSalaryTax,
        currentOtherSalary: obIntensionObj.currentOtherSalary,
        intentionIndustryId: obIntensionObj.intentionIndustryId,
        intentionPosition: obIntensionObj.intentionPosition,
        intentionCity: obIntensionObj.intentionCity,
        intentionSalaryTax: obIntensionObj.intentionSalaryTax,
        intentionAnnualSalary: obIntensionObj.intentionAnnualSalary * 10000
      }
      // 简历信息
      para.resumeInfo = {}
      para.resumeInfo.detail = Object.assign(
        this.resumeInfo.base.form,
        this.resumeInfo.evaluation.form,
        this.resumeInfo.attach.form
      )
      para.resumeInfo.educations = this.resumeInfo.education.data.map(item => {
        return item.form
      })
      para.resumeInfo.experiences = this.resumeInfo.job.data.map(item => {
        return item.form
      })
      para.resumeInfo.languages = this.resumeInfo.language.data.map(item => {
        return item.form
      })
      para.resumeInfo.opus = this.resumeInfo.works.data.map(item => {
        return item.form
      })
      para.resumeInfo.projects = this.resumeInfo.project.data.map(item => {
        return item.form
      })
      para.resumeInfo.cerInfos = this.resumeInfo.certificate.data.map(item => {
        return item.form
      })
      para.resumeInfo.training = this.resumeInfo.train.data.map(item => {
        return item.form
      })
      updateRecommendReport(para).then(res => {
        this.nextLoading = false
        this.$router.push({
          path: '/reviewReport',
          query: {
            positionId: this.positionInfo.id,
            companyId: this.reportTplInfo.companyId,
            reportId: this.reportInfo.form.id
          }
        })
      })
    },
    // 保存草稿
    savaDraft() {
      this.nextLoading = true
      const para = {}
      para.editType = 0
      // 推荐报告
      para.candidateRecommendReportDraftBO = Object.assign(
        {},
        this.reportInfo.form
      )
      para.candidateRecommendReportDraftBO.id = this.draftInfo.id
      para.candidateRecommendReportDraftBO.refReportId = this.reportInfo.form.id
      // 求职意向
      const obIntensionObj = this.resumeInfo.intention.form
      para.jobIntensionBO = {
        jobStatus: obIntensionObj.jobStatus,
        currentSalary: obIntensionObj.currentSalary,
        currentSalaryMonth: obIntensionObj.currentSalaryMonth,
        currentSalaryTax: obIntensionObj.currentSalaryTax,
        currentOtherSalary: obIntensionObj.currentOtherSalary,
        intentionIndustryId: obIntensionObj.intentionIndustryId,
        intentionPosition: obIntensionObj.intentionPosition,
        intentionCity: obIntensionObj.intentionCity,
        intentionSalaryTax: obIntensionObj.intentionSalaryTax,
        intentionAnnualSalary: obIntensionObj.intentionAnnualSalary * 10000
      }
      // 简历信息
      para.resumeInfo = {}
      para.resumeInfo.detail = Object.assign(
        this.resumeInfo.base.form,
        this.resumeInfo.evaluation.form,
        this.resumeInfo.attach.form
      )
      para.resumeInfo.educations = this.resumeInfo.education.data.map(item => {
        return item.form
      })
      para.resumeInfo.experiences = this.resumeInfo.job.data.map(item => {
        return item.form
      })
      para.resumeInfo.languages = this.resumeInfo.language.data.map(item => {
        return item.form
      })
      para.resumeInfo.opus = this.resumeInfo.works.data.map(item => {
        return item.form
      })
      para.resumeInfo.projects = this.resumeInfo.project.data.map(item => {
        return item.form
      })
      para.resumeInfo.cerInfos = this.resumeInfo.certificate.data.map(item => {
        return item.form
      })
      para.resumeInfo.training = this.resumeInfo.train.data.map(item => {
        return item.form
      })
      const api = this.draftInfo.id
        ? updateRecommendReportDraft
        : addRecommendReportDraft
      api(para).then(res => {
        this.nextLoading = false
        this.draftInfo.id = res.data
        this.$message({
          message: '草稿保存成功!',
          type: 'success',
          showClose: true,
          center: true
        })
      })
    },
    // 附件简历对比
    toResumeUpload() {
      const para = Object.assign({}, this.resumeInfo.detail)
      getResumeInfoById(para).then(res => {
        localStorage.setItem('textFileWebUrl', res.data.detail.textFileUrl)
        localStorage.setItem('dbPathUrl', res.data.detail.dbPathUrl)
        window.open(
          `/resumeUpload?id=${res.data.detail.id}&extension=${res.data.detail.extension}`
        )
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  .title-bar {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: #333333ff;
    margin-bottom: 20px;
  }
  .wrap-main {
    display: flex;
    justify-content: space-between;
    .main-content {
      flex: auto;
      .recommend-report {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #fff;
      }
      .main-info {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #fff;
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
            margin-right: 16px;
          }
          .title-validate {
            padding: 2px 4px;
            font-size: 12px;
            color: #fff;
            background-color: $red-color;
            border-radius: 2px;
          }
        }
        .panel-body {
          border-bottom: 1px dashed #e4e7ed;
          margin-bottom: 20px;
          padding-bottom: 20px;
          position: relative;
          &.disabled:after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 0;
            top: 0;
            z-index: 999;
          }
          &.disabled .show-form-edit {
            display: none;
          }
          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .edit-form {
            padding-right: 50px;
            margin: 0;
            &:after {
              content: '';
              height: 0;
              line-height: 0;
              display: block;
              visibility: hidden;
              clear: both;
            }
            ::v-deep .el-form-item__error {
              white-space: normal;
            }
            &.show-form {
              position: relative;
              .show-form-edit {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 10;
                text-decoration: none;
                font-size: 14px;
                color: #333;
                &.single {
                  top: -35px;
                }
                &:hover {
                  color: $main-color;
                }
                .icon {
                  font-size: 15px;
                }
              }
              .el-col {
                margin-bottom: 10px !important;
              }
              ::v-deep .el-form-item__error {
                line-height: inherit;
                padding-top: 0;
                top: 0;
                right: 0;
                background: #fff;
              }
            }
            .el-col {
              padding: 0 10px;
              margin-bottom: 20px !important;
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
                .el-input__inner {
                  font-size: 14px;
                  height: 28px !important;
                  line-height: 28px;
                  color: #333;
                }
                .el-textarea__inner {
                  color: #333;
                }
                .el-input__icon {
                  line-height: 28px;
                }
              }
              ::v-deep .el-date-editor.el-input,
              ::v-deep .el-date-editor.el-input__inner {
                width: 100%;
                .el-input__prefix {
                  display: none;
                }
                .el-input__inner {
                  padding-left: 15px;
                }
              }
              ::v-deep .el-input-group__append {
                padding: 0;
                width: 60px;
                text-align: center;
                background-color: #f6f6f6ff;
                border-color: #cdcdcdff;
                color: #333;
              }
              .el-radio {
                color: #333;
                margin-right: 10px;
                &:last-child {
                  margin-right: 0;
                }
              }
              .el-select {
                width: 100%;
              }
              ::v-deep .diy-select {
                width: 100%;
                .diy-input input {
                  padding: 0 15px;
                }
                .el-icon-caret-bottom {
                  right: 10px;
                  top: 8px;
                }
                .el-icon-circle-close {
                  right: 6px;
                  top: 6px;
                }
              }
              .date-icon {
                position: absolute;
                right: 10px;
                top: 0;
                .icon {
                  font-size: 14px;
                  color: $main-color;
                }
              }
              .el-button {
                width: 80px;
                box-sizing: border-box;
                height: 30px;
                line-height: 30px;
                border-radius: 4px;
                margin: 20px 25px 0;
              }
              .delete-link {
                font-size: 14px;
                color: $grey-color;
                text-decoration: none;
                &:hover {
                  text-decoration: underline;
                }
                .icon {
                  font-size: 15px;
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
            .form-group {
              display: flex;
              .form-group-left {
                width: 320px;
              }
              .concat-line {
                width: 40px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                font-size: 20px;
                color: #333;
              }
              .form-group-center {
                width: 220px;
                ::v-deep .el-form-item__content {
                  margin-left: 0 !important;
                }
              }
              .form-group-right {
                flex: auto;
                margin-left: 40px;
                ::v-deep .el-form-item__content {
                  margin-top: 6px;
                  margin-left: 0 !important;
                }
              }
            }
          }
        }
        .panel-footer {
          position: relative;
          &.disabled:after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 0;
            top: 0;
            z-index: 999;
          }
          a {
            display: block;
            text-align: center;
            line-height: 42px;
            font-size: 14px;
            color: $main-color;
            border: 1px dashed $main-color;
            text-decoration: none;
            border-radius: 8px;
            &:hover {
              background-color: rgba(22, 120, 249, 0.1);
              text-decoration: underline;
            }
          }
        }
      }
    }
    .right-bar {
      width: 200px;
      margin-left: 20px;
      flex: none;
      overflow: hidden;
      .bar-main {
        width: 200px;
        box-shadow: 2px 4px 30px 0 rgba(0, 0, 0, 0.07);
        border-radius: 8px;
        overflow: hidden;
        .panel {
          .panel-title {
            text-align: center;
            line-height: 44px;
            font-size: 18px;
            color: #fff;
            background-color: $main-color;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          .panel-body {
            padding: 20px 0;
            background-color: #fff;
            .item {
              padding: 0 30px;
              height: 25px;
              line-height: 25px;
              margin-bottom: 12px;
              position: relative;
              &:last-child {
                margin-bottom: 0;
              }
              &.active {
                .item-hover {
                  color: $main-color;
                }
                .item-name {
                  color: $main-color;
                }
              }
              .item-hover {
                width: 11px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                position: absolute;
                left: 6px;
                top: 0;
                color: #fff;
                transform: rotateZ(180deg);
                .icon {
                  font-size: 25px;
                }
              }
              .item-name {
                text-decoration: none;
                font-size: 16px;
                color: #666;
                margin-right: 40px;
              }
              .item-status {
                .icon {
                  font-size: 18px;
                  &.status-success {
                    color: #07bf62ff;
                  }
                  &.status-error {
                    color: $red-color;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .footer-bar {
    .wrap-bar {
      width: 1200px;
      margin: 0 auto;
      .bar-main {
        display: flex;
        width: 980px;
        box-sizing: border-box;
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

