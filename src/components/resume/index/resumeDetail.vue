<template >
  <div
    v-if="detailData"
    id="basic-info"
    ref="leftCont"
    v-loading="loading"
    :class="[ $route.name === 'resumeDetail' ? 'resume-detail mtv-25' : 'resume-detail']"
  >
    <!-- 头部 -->
    <div
      v-if="detailData.detail && ($route.name === 'resume' || $route.name === 'resumeDetail') && !$props.newResumeDetail"
      class="header"
    >
      <div class="left-part">
        <span v-if="detailData.detail.updateTime">更新时间 {{ detailData.detail.updateDay }}</span>
        <span
          v-if="detailData.detail.createTime"
        >创建时间 {{ detailData.detail.createTime | filterDate }}</span>
      </div>
      <div class="right-part">
        <el-button type="primary" class="recommend-btn" @click="nowRecommend()">立即推荐</el-button>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">更多</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="detailData.detail.orderCount"
              class="item-dropdown-btn"
              :command="{type:'a',resumeId:detailData.detail.id}"
            >订单（{{ detailData.detail.orderCount }}）</el-dropdown-item>
            <el-popconfirm title="是否需要移除该简历？" @onConfirm="removeResumenById()">
              <el-button slot="reference" class="item-dropdown-btn">移除</el-button>
            </el-popconfirm>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 简历标签 -->
    <!-- <div class="labels">
      <span>
        Java工程师
        <i></i>
      </span>
      <span>
        Java工程师
        <i></i>
      </span>
      <span class="add-labels">+简历标签</span>
    </div>-->
    <!-- 基本信息 -->
    <div
      v-if="detailData.detail"
      class="base-info"
      :style="{marginTop:(this.$route.name === 'resumeUpload' ? '-25px' : '')}"
    >
      <h3 :class="[ !baseInfoVisible && editDisabled ? 'disabled-h3':'']">
        基本信息
        <label
          v-if="noticeLabel1 && (!detailData.detail.name || !detailData.detail.liveCity || !detailData.detail.email || !detailData.detail.age || !detailData.detail.workMonth || !detailData.detail.currentCompanyName
            || !detailData.detail.graduateSchool || !detailData.detail.degreeCode)"
          class="notice-label"
        >不完善</label>
        <span v-if="!baseInfoVisible" class="edit" @click="editIt('baseInfo')">编辑</span>
      </h3>
      <!-- 文本展示 -->
      <div v-if="!baseInfoVisible" :class="[editDisabled ? 'text-form disabled' : 'text-form']">
        <el-form label-width="85px" :inline="true">
          <img v-if="detailData.detail.avatarImg" class="avatar" :src="detailData.detail.avatarImg" />
          <img
            v-else-if="detailData.detail.gender === 1"
            class="avatar"
            src="~@/assets/images/common/man_avatar.png"
          />
          <img
            v-else-if="detailData.detail.gender === 2"
            class="avatar"
            src="~@/assets/images/common/women_avatar.png"
          />
          <img v-else src="~@/assets/images/common/avatar.png" class="avatar" />
          <div class="pl">
            <el-form-item
              label="姓名"
              :class="[noticeLabel1 && !detailData.detail.name ? 'email-hidden mini-orange-dot' : 'email-hidden mini-orange-dot no-text']"
            >{{ detailData.detail.name }}</el-form-item>
            <el-form-item
              label="所在地"
              :class="[noticeLabel1 && !detailData.detail.liveCity ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.liveCity | filterLevel2(dictData.areas) }}</el-form-item>
            <el-form-item v-if="detailData.detail.mobile" label="手机">{{ detailData.detail.mobile }}</el-form-item>
            <el-form-item
              label="邮箱"
              :class="[noticeLabel1 && !detailData.detail.email ? 'mini-orange-dot email-hidden' : 'mini-orange-dot no-text email-hidden']"
              :title="detailData.detail.email"
            >{{ detailData.detail.email }}</el-form-item>
            <el-form-item
              label="年龄"
              :class="[noticeLabel1 && !detailData.detail.age ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.age === 0 ? '' : detailData.detail.age }}</el-form-item>
            <el-form-item
              label="工作年限"
              :class="[noticeLabel1 && !detailData.detail.workMonth ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.workMonth }}</el-form-item>
            <el-form-item
              :class="[noticeLabel1 && !detailData.detail.currentCompanyName ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
              label="目前公司"
              class="email-hidden"
            >{{ detailData.detail.currentCompanyName }}</el-form-item>
            <el-form-item
              v-if="detailData.detail.currentPosition"
              label="目前职位"
              :title="detailData.detail.currentPosition"
              class="email-hidden"
            >{{ detailData.detail.currentPosition }}</el-form-item>
            <el-form-item
              label="毕业学校"
              :class="[noticeLabel1 && !detailData.detail.graduateSchool ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.graduateSchool }}</el-form-item>
            <el-form-item
              label="最高学历"
              :class="[noticeLabel1 && !detailData.detail.degreeCode ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.degreeCode | filterArr(degreeArrTemp) }}</el-form-item>
            <!-- <el-form-item label="国籍">{{ detailData.detail.nationality }}</el-form-item> -->
          </div>
        </el-form>
      </div>
      <!-- 表单编辑 -->
      <div v-else class="edit-form">
        <el-form
          ref="baseInfoForm"
          :rules="baseInfoFormRules"
          :model="baseInfoForm"
          label-width="90px"
          :inline="true"
        >
          <el-form-item label="头像" class="block">
            <span v-loading="avatarLoading">
              <img v-if="avatarImg" class="avatar-img" :src="avatarImg" />
              <template v-else>
                <img
                  v-if="detailData.detail.gender === 1"
                  class="avatar-img"
                  src="~@/assets/images/common/man_avatar.png"
                />
                <img
                  v-else-if="detailData.detail.gender === 2"
                  class="avatar-img"
                  src="~@/assets/images/common/women_avatar.png"
                />
                <img v-else src="~@/assets/images/common/avatar.png" class="avatar-img" />
              </template>
            </span>
            <el-upload
              class="avatar-uploader"
              :data="paramsDataAvatar"
              :action="uploadResumeUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccessAvatar"
              :before-upload="beforeAvatarUploadAvatar"
            >
              <span class="upload-avatar">上传/修改</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="baseInfoForm.name" class="w-100"></el-input>
            <el-radio-group v-model="baseInfoForm.gender" class="ml-8">
              <el-radio :label="1">先生</el-radio>
              <el-radio :label="2">女士</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="mini-orange-dot" label="所在地" prop="liveCity">
            <select-picker
              :class-name="'live-city-picker'"
              :key-name="'liveCity'"
              :first-tab-name="firstTabNameAddress"
              :data-source="addressArr1"
              :max-number="1"
              :level-number="2"
              :default-value="[detailData.detail.liveCity+'']"
              :form-name="'baseInfoForm'"
              :popover-modal="false"
              @deleteRules="deleteRules"
              @afterClose="handleClose"
            />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="baseInfoForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="baseInfoForm.email"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" prop="birthday">
            <el-date-picker
              v-model="baseInfoForm.birthday"
              :clearable="false"
              value-format="yyyy-MM"
              type="month"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="工作年份" prop="startWorkMonth">
            <el-date-picker
              v-model="baseInfoForm.startWorkMonth"
              :clearable="false"
              value-format="yyyy-MM"
              type="month"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="目前公司" prop="currentCompanyName">
            <el-input v-model="baseInfoForm.currentCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="目前职位" prop="currentPosition">
            <el-input v-model="baseInfoForm.currentPosition"></el-input>
          </el-form-item>
          <el-form-item label="毕业院校" prop="graduateSchool">
            <el-input v-model="baseInfoForm.graduateSchool"></el-input>
          </el-form-item>
          <el-form-item label="最高学历" prop="degreeCode">
            <el-select v-model="baseInfoForm.degreeCode" placeholder="请选择">
              <el-option
                v-for="(item,index) in degreeArrTemp"
                :key="index"
                :label="item.label"
                :value="item.value - 0"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button
              type="primary"
              @click="submitForm('baseInfoForm',[{keyName:'liveCity',rules:'请选择所在地'}])"
            >保存</el-button>
            <el-button @click="cancelForm('baseInfoForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 简历 -->
    <div class="resume-mess">
      <!-- 求职意向 -->
      <div v-if="detailData.detail" class="jobIntent">
        <h3 id="apply-intent" :class="[!jobIntentVisible && editDisabled ? 'disabled-h3':'']">
          求职意向
          <label
            v-if="noticeLabel2 && (!detailData.detail.jobStatus || (!detailData.detail.intentionIndustryId1 &&
              !detailData.detail.intentionIndustryId2) || !detailData.detail.intentionCity)"
            class="notice-label"
          >不完善</label>
          <span v-if="!jobIntentVisible" class="edit" @click="editIt('jobIntent')">编辑</span>
        </h3>
        <!-- 文本展示 -->
        <div v-if="!jobIntentVisible" :class="[editDisabled ? 'text-form disabled' : 'text-form']">
          <el-form label-width="90px">
            <el-form-item
              label="求职状态"
              :class="[noticeLabel2 && !detailData.detail.jobStatus ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.jobStatus | filterArr(jobStatusArr) }}</el-form-item>
            <el-form-item v-if="detailData.detail.currentYearSalary" label="目前年薪">
              {{ detailData.detail.currentSalaryTax === 1 ? '税前' : ( detailData.detail.intentionSalaryTax === 2 ?'税后':null) }} {{ (detailData.detail.currentYearSalary && detailData.detail.currentYearSalary/10000) }}
              <span
                v-if="detailData.detail.currentYearSalary"
              >万</span>
              <span
                v-if="detailData.detail.currentSalary"
              >({{ detailData.detail.currentSalary }}元/月 x {{ detailData.detail.currentSalaryMonth || 12 }}个月)</span>
            </el-form-item>
            <el-form-item
              v-if="detailData.detail.currentOtherSalary"
              label="其他收入"
            >{{ detailData.detail.currentOtherSalary }}</el-form-item>
            <el-form-item
              label="期望行业"
              :class="[noticeLabel2 && (!detailData.detail.intentionIndustryId1 && !detailData.detail.intentionIndustryId2) ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >
              {{ detailData.detail.intentionIndustryId1 | filterCommonDict(industryArr1) }}
              <span
                v-if="detailData.detail.intentionIndustryId1 && detailData.detail.intentionIndustryId2"
              >、</span>
              {{ detailData.detail.intentionIndustryId2 | filterLevels2(industryArr1) }}
            </el-form-item>
            <el-form-item
              v-if="detailData.detail.intentionPosition"
              label="期望职位"
            >{{ detailData.detail.intentionPosition }}</el-form-item>
            <el-form-item
              label="期望城市"
              :class="[noticeLabel2 && !detailData.detail.intentionCity ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
            >{{ detailData.detail.intentionCity | filterLevel2(dictData.areas) }}</el-form-item>
            <el-form-item v-if="detailData.detail.isNegotiated" label="期望年薪">面议</el-form-item>
            <el-form-item
              v-if="!detailData.detail.isNegotiated && detailData.detail.intentionSalary"
              label="期望年薪"
            >{{ detailData.detail.intentionSalaryTax === 1 ? '税前' : ( detailData.detail.intentionSalaryTax === 2 ?'税后':null) }} {{ detailData.detail.intentionSalary }}万/年</el-form-item>
          </el-form>
        </div>
        <!-- 表单编辑 -->
        <div v-show="jobIntentVisible" class="edit-form">
          <el-form
            ref="jobIntentForm"
            :rules="jobIntentFormRules"
            :model="jobIntentForm"
            label-width="90px"
            :inline="true"
          >
            <el-form-item label="求职状态" prop="jobStatus">
              <el-select v-model="jobIntentForm.jobStatus" placeholder="请选择">
                <el-option
                  v-for="(item,index) in jobStatusArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value - 0"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="目前年薪" prop="currentSalary">
              <el-select v-model="jobIntentForm.currentSalary" placeholder="请选择">
                <el-option
                  v-for="(item,index) in salaryArrTemp"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="目前年薪" prop="currentSalary" class="salary-group">
              <el-input v-model="jobIntentForm.currentSalary" placeholder="月薪">
                <template slot="append">元/月</template>
              </el-input>
              <span class="cheng">×</span>
              <el-input v-model="jobIntentForm.currentSalaryMonth" placeholder="月份" class="last">
                <template slot="append">个月</template>
              </el-input>
              <span
                class="result-num"
              >= {{ currentYearSalary || detailData.detail.currentYearSalary / 10000 }}万</span>
              <el-radio-group v-model="jobIntentForm.currentSalaryTax" class="ml-8">
                <el-radio :label="1">税前</el-radio>
                <el-radio :label="2">税后</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="其他收入" prop="currentOtherSalary">
              <el-input v-model="jobIntentForm.currentOtherSalary"></el-input>
            </el-form-item>
            <el-form-item label="期望行业" prop="intentionIndustryId" class="mini-orange-dot no-text">
              <select-picker-double
                v-if="detailData.detail.intentionIndustryId1 && !detailData.detail.intentionIndustryId2"
                :key-name="'intentionIndustryId'"
                :first-tab-name="firstTabNameIndustry"
                :class-name="'intention-industry-picker'"
                :data-source="industryArr1"
                :max-number="3"
                :level-number="2"
                :default-value="[detailData.detail.intentionIndustryId1+'']"
                :form-name="'jobIntentForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
              />
              <select-picker-double
                v-else-if="!detailData.detail.intentionIndustryId1 && detailData.detail.intentionIndustryId2"
                :key-name="'intentionIndustryId'"
                :class-name="'intention-industry-picker'"
                :first-tab-name="firstTabNameIndustry"
                :data-source="industryArr1"
                :max-number="3"
                :level-number="2"
                :default-value="detailData.detail.intentionIndustryId2.split(',')"
                :form-name="'jobIntentForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
              />
              <select-picker-double
                v-else-if="detailData.detail.intentionIndustryId1 && detailData.detail.intentionIndustryId2"
                :class-name="'intention-industry-picker'"
                :key-name="'intentionIndustryId'"
                :first-tab-name="firstTabNameIndustry"
                :data-source="industryArr1"
                :max-number="3"
                :level-number="2"
                :default-value="detailData.detail.intentionIndustryId2.split(',')"
                :form-name="'jobIntentForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
              />
              <select-picker-double
                v-else
                :class-name="'intention-industry-picker'"
                :key-name="'intentionIndustryId'"
                :first-tab-name="firstTabNameIndustry"
                :data-source="industryArr1"
                :max-number="3"
                :level-number="2"
                :default-value="defaultValueIndustry"
                :form-name="'jobIntentForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
              />
            </el-form-item>
            <el-form-item label="期望职位" prop="intentionPosition">
              <el-input v-model="jobIntentForm.intentionPosition"></el-input>
            </el-form-item>
            <el-form-item label="期望城市" prop="intentionCity" class="mini-orange-dot no-text">
              <select-picker
                :class-name="'live-city-picker'"
                :key-name="'intentionCity'"
                :first-tab-name="firstTabNameCity"
                :data-source="addressArr2"
                :max-number="1"
                :level-number="2"
                :default-value="[detailData.detail.intentionCity+'']"
                :form-name="'jobIntentForm'"
                :popover-modal="false"
                @deleteRules="deleteRules"
                @afterClose="handleClose"
              />
            </el-form-item>
            <el-form-item label="期望年薪" prop="intentionSalary" class="salary-group">
              <el-input v-model="jobIntentForm.intentionSalary" placeholder="年薪">
                <template slot="append">万/年</template>
              </el-input>
              <el-radio-group v-model="jobIntentForm.intentionSalaryTax" class="ml-8">
                <el-radio :label="1">税前</el-radio>
                <el-radio :label="2">税后</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="btns">
              <el-button
                type="primary"
                @click="submitForm('jobIntentForm',[{keyName:'intentionIndustryId',rules:'请选择期望行业'},{keyName:'intentionCity',rules:'请选择期望城市'}])"
              >保存</el-button>
              <el-button @click="cancelForm('jobIntentForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 教育经历 -->
      <div class="eduExp">
        <h3
          id="edu-exp"
          :class="[(!eduExpVisible && !addEduExpVisible) && editDisabled ? 'disabled-h3':'']"
        >
          教育经历
          <label v-if="noticeLabel3" class="notice-label">不完善</label>
        </h3>
        <!-- 文本展示 -->
        <ul class="text-form">
          <li
            v-for="(item,i) in detailData.educations"
            :key="i"
            :class="[eduExpVisible && eduExpEditFlag === i ? 'item min-h-380' : 'item']"
          >
            <div
              v-if="eduExpEditFlag !== i || eduExpEditFlag === null"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <span class="edit" @click="editIt('eduExp',i)">编辑</span>
              <img class="avatar" src="~@/assets/images/resume/college.png" alt />
              <div class="cont">
                <p class="part-1">
                  <span>
                    {{ item.school }}
                    <i class="dot-i" />
                    {{ item.isUnifiedStrategy ? '统招' : '非统招' }}
                  </span>
                  <span
                    :class="[item.startDate ? 'ml-45 mini-orange-dot' : 'ml-45 mini-orange-dot no-text']"
                  >{{ item.startDate }}-{{ item.endDate }} （{{ item.startToEndDate }}）</span>
                </p>
                <p class="part-2">{{ item.speciality }}</p>
              </div>
            </div>
            <!-- 表单编辑 -->
            <div v-if="eduExpVisible && eduExpEditFlag === i" class="edit-form">
              <el-form
                :ref="'eduExpForm'+i"
                :rules="eduExpFormRules"
                :model="eduExpForm"
                label-width="90px"
                :inline="true"
              >
                <div class="attend-date">
                  <el-form-item label="就读时间" prop="startDate" class="start-date">
                    <el-date-picker
                      v-model="eduExpForm.startDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item prop="endDate" class="end-date">
                    <el-date-picker
                      v-model="eduExpForm.endDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item label="学校名称" prop="school">
                  <el-input v-model="eduExpForm.school"></el-input>
                </el-form-item>
                <el-form-item label="就读专业" prop="speciality">
                  <el-input v-model="eduExpForm.speciality"></el-input>
                </el-form-item>
                <el-form-item label="学历" prop="degreeCode">
                  <el-select v-model="eduExpForm.degreeCode" placeholder="请选择">
                    <el-option
                      v-for="(itemInner,index) in degreeArrTemp"
                      :key="index"
                      :label="itemInner.label"
                      :value="itemInner.value - 0"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否统招" prop="isUnifiedStrategy">
                  <el-radio-group v-model="eduExpForm.isUnifiedStrategy">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="summary">
                  <el-input
                    v-model="eduExpForm.summary"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    show-word-limit
                    placeholder="如：本科不满四年的请写明原因"
                  ></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button type="primary" @click="submitForm('eduExpForm'+i,[],1,item.id)">保存</el-button>
                  <el-button @click="cancelForm('eduExpForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeEducationById(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </li>
        </ul>
        <!-- 添加教育经历 -->
        <div v-if="addEduExpVisible" class="edit-form">
          <el-form
            ref="eduExpForm"
            :rules="eduExpFormRules"
            :model="eduExpForm"
            label-width="90px"
            :inline="true"
          >
            <div class="attend-date">
              <el-form-item label="就读时间" prop="startDate" class="start-date">
                <el-date-picker
                  v-model="eduExpForm.startDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate" class="end-date">
                <el-date-picker
                  v-model="eduExpForm.endDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="学校名称" prop="school">
              <el-input v-model="eduExpForm.school"></el-input>
            </el-form-item>
            <el-form-item label="就读专业" prop="speciality">
              <el-input v-model="eduExpForm.speciality"></el-input>
            </el-form-item>
            <el-form-item label="学历" prop="degreeCode">
              <el-select v-model="eduExpForm.degreeCode" placeholder="请选择">
                <el-option
                  v-for="(itemInner,index) in degreeArrTemp"
                  :key="index"
                  :label="itemInner.label"
                  :value="itemInner.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否统招" prop="isUnifiedStrategy">
              <el-radio-group v-model="eduExpForm.isUnifiedStrategy">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="summary">
              <el-input
                v-model="eduExpForm.summary"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                show-word-limit
                placeholder="如：本科不满四年的请写明原因"
              ></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('eduExpForm')">保存</el-button>
              <el-button @click="cancelForm('addEduExpForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="!addEduExpVisible && !editDisabled" class="add-btn" @click="addIt('addEduExp')">
          <i class="el-icon-plus"></i> 添加教育经历
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加教育经历
        </div>
      </div>
      <!-- 工作经历 -->
      <div class="workExp">
        <h3
          id="work-exp"
          :class="[(!workExpVisible && !addWorkExpVisible) && editDisabled ? 'disabled-h3':'']"
        >
          工作经历
          <label v-if="noticeLabel4" class="notice-label">不完善</label>
        </h3>
        <ul class="text-form">
          <li
            v-for="(item,i) in detailData.experiences"
            :key="i"
            :class="[workExpVisible && workExpEditFlag === i ? 'item min-h-1160' : 'item']"
          >
            <!-- 简历详情布局 -->
            <!-- <div
              v-if="($route.name === 'resume' || $route.name === 'resumeDetail') && (workExpEditFlag !== i || workExpEditFlag === null)"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <span class="edit" @click="editIt('workExp',i)">编辑</span>
              <img class="avatar" src="~@/assets/images/resume/job.png" alt />
              <div class="cont-1">
                <p class="part-1">
                  <span>{{ item.companyName }}</span>
                  <span
                    class="ml-65"
                  >{{ item.startDate }}-{{ item.endDate }}（{{ item.startToEndDate }}）</span>
                </p>
                <p class="part-2">{{ item.title }}</p>
              </div>
              <div class="cont-2">
                <label>工作职责</label>
                <span>{{ item.summary }}</span>
              </div>
            </div>-->
            <!-- 简历解析布局 -->
            <div
              v-if="workExpEditFlag !== i || workExpEditFlag === null"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <el-form label-width="85px" :inline="true">
                <el-form-item
                  :class="[noticeLabel4 && !item.startDate ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="任职时间"
                >
                  {{ item.startDate }}
                  <span v-if="item.startDate">-</span>
                  {{ item.endDate }}
                  <span
                    v-if="item.startToEndDate"
                  >（{{ item.startToEndDate }}）</span>
                  <span class="edit" @click="editIt('workExp',i)">编辑</span>
                </el-form-item>
                <el-form-item
                  label="公司名称"
                  :class="[noticeLabel4 && !item.companyName ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                >{{ item.companyName }}</el-form-item>
                <el-form-item
                  v-if="item.industryId1 && item.industryId2"
                  :class="[(noticeLabel4 && !item.industryId1) ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="所属行业"
                >{{ item.industryId1 | filterCommonDict(industryArr2) }}</el-form-item>
                <el-form-item
                  v-else-if="item.industryId1 && !item.industryId2"
                  :class="[(noticeLabel4 && !item.industryId1) ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="所属行业"
                >{{ item.industryId1 | filterCommonDict(industryArr2) }}</el-form-item>
                <el-form-item
                  v-else-if="!item.industryId1 && item.industryId2"
                  :class="[(noticeLabel4 && !item.industryId2) ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="所属行业"
                >{{ item.industryId2 | filterLevels2(industryArr2) }}</el-form-item>
                <el-form-item v-else class="mini-orange-dot" label="所属行业"></el-form-item>
                <el-form-item
                  v-if="item.companySize"
                  label="公司规模"
                >{{ item.companySize | filterArr(scaleArr) }}</el-form-item>
                <el-form-item
                  v-if="item.companyType"
                  label="公司性质"
                >{{ item.companyType | filterArr(enterprisePropertyArr) }}</el-form-item>
                <el-form-item v-if="item.companyIntroduce" label="公司介绍">{{ item.companyIntroduce }}</el-form-item>
                <el-form-item
                  label="职位名称"
                  :class="[noticeLabel4 && !item.title ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                >{{ item.title }}</el-form-item>
                <el-form-item v-if="item.department" label="所属部门">{{ item.department }}</el-form-item>
                <el-form-item v-if="item.responsibleArea" label="负责区域">{{ item.responsibleArea }}</el-form-item>
                <el-form-item
                  v-if="item.isOverseas !== null"
                  label="是否海外"
                >{{ Number(item.isOverseas) === 1 ? '是' : '否' }}</el-form-item>
                <el-form-item v-if="item.leader" label="汇报对象">{{ item.leader }}</el-form-item>
                <el-form-item v-if="item.underlingNumber" label="下属人数">
                  <span>{{ item.underlingNumber }}人</span>
                </el-form-item>
                <el-form-item v-if="item.summary" label="工作职责">{{ item.summary }}</el-form-item>
                <el-form-item v-if="item.achievement" label="工作业绩">{{ item.achievement }}</el-form-item>
                <el-form-item v-if="item.reasonOfLeaving" label="离职原因">{{ item.reasonOfLeaving }}</el-form-item>
              </el-form>
            </div>
            <!-- 表单编辑 -->
            <div v-if="workExpVisible && workExpEditFlag === i" class="edit-form">
              <el-form
                :ref="'workExpForm'+i"
                :rules="workExpFormRules"
                :model="workExpForm"
                label-width="90px"
                :inline="true"
              >
                <div class="take-date">
                  <el-form-item label="任职时间" prop="startDate" class="start-date">
                    <el-date-picker
                      v-model="workExpForm.startDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item prop="endDate" class="end-date">
                    <el-date-picker
                      v-model="workExpForm.endDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item label="公司名称" prop="companyName">
                  <el-input v-model="workExpForm.companyName"></el-input>
                </el-form-item>
                <el-form-item
                  label="所属行业"
                  prop="vocation"
                  clresume-uploadass="mini-orange-dot no-text"
                >
                  <select-picker-double
                    v-if="item.industryId1 && !item.industryId1"
                    :class-name="'intention-industry-picker'"
                    :key-name="'vocation'"
                    :first-tab-name="firstTabNameBelongIndustry"
                    :data-source="industryArr2"
                    :max-number="3"
                    :level-number="2"
                    :default-value="[item.industryId1]"
                    :form-name="'workExpForm'+i"
                    @deleteRules="deleteRules"
                  />
                  <select-picker-double
                    v-else-if="!item.industryId1 && item.industryId2"
                    :class-name="'intention-industry-picker'"
                    :key-name="'vocation'"
                    :first-tab-name="firstTabNameBelongIndustry"
                    :data-source="industryArr2"
                    :max-number="3"
                    :level-number="2"
                    :default-value="item.industryId2.split(',')"
                    :form-name="'workExpForm'+i"
                    @deleteRules="deleteRules"
                  />
                  <select-picker-double
                    v-else-if="item.industryId1 && item.industryId2"
                    :class-name="'intention-industry-picker'"
                    :key-name="'vocation'"
                    :first-tab-name="firstTabNameBelongIndustry"
                    :data-source="industryArr2"
                    :max-number="3"
                    :level-number="2"
                    :default-value="item.industryId2.split(',')"
                    :form-name="'workExpForm'+i"
                    @deleteRules="deleteRules"
                  />
                  <select-picker-double
                    v-else
                    :class-name="'intention-industry-picker'"
                    :key-name="'vocation'"
                    :first-tab-name="firstTabNameBelongIndustry"
                    :data-source="industryArr2"
                    :max-number="3"
                    :level-number="2"
                    :default-value="defaultValueBelongIndustry"
                    :form-name="'workExpForm'+i"
                    @deleteRules="deleteRules"
                  />
                </el-form-item>
                <el-form-item label="公司规模" prop="companySize">
                  <el-select v-model="workExpForm.companySize" placeholder="请选择">
                    <el-option
                      v-for="(itemInner,index) in scaleArr"
                      :key="index"
                      :label="itemInner.label"
                      :value="itemInner.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公司性质" prop="companyType">
                  <el-select v-model="workExpForm.companyType" placeholder="请选择">
                    <el-option
                      v-for="(itemInner,index) in enterprisePropertyArr"
                      :key="index"
                      :label="itemInner.label"
                      :value="itemInner.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公司介绍" prop="companyIntroduce">
                  <el-input
                    v-model="workExpForm.companyIntroduce"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="职位名称" prop="title">
                  <el-input v-model="workExpForm.title"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="department">
                  <el-input v-model="workExpForm.department"></el-input>
                </el-form-item>
                <el-form-item label="负责区域" prop="responsibleArea">
                  <el-input v-model="workExpForm.responsibleArea"></el-input>
                </el-form-item>
                <el-form-item label="是否海外" prop="isOverseas">
                  <el-radio-group v-model="workExpForm.isOverseas">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="汇报对象" prop="leader">
                  <el-input v-model="workExpForm.leader"></el-input>
                </el-form-item>
                <el-form-item label="下属人数" prop="underlingNumber" class="text-suffix">
                  <el-input v-model="workExpForm.underlingNumber">
                    <template slot="suffix">人</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="工作职责" prop="summary">
                  <el-input
                    v-model="workExpForm.summary"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="工作业绩" prop="achievement">
                  <el-input
                    v-model="workExpForm.achievement"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="离职原因" prop="reasonOfLeaving">
                  <el-input
                    v-model="workExpForm.reasonOfLeaving"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button
                    type="primary"
                    @click="submitForm('workExpForm'+i,[{keyName:'vocation',rules:'请选择所属行业'}],1,item.id)"
                  >保存</el-button>
                  <el-button @click="cancelForm('workExpForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeExperience(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </li>
        </ul>
        <!-- 添加工作经历 -->
        <div v-if="addWorkExpVisible" class="edit-form">
          <el-form
            ref="workExpForm"
            :rules="workExpFormRules"
            :model="workExpForm"
            label-width="90px"
            :inline="true"
          >
            <div class="take-date">
              <el-form-item label="任职时间" prop="startDate" class="start-date">
                <el-date-picker
                  v-model="workExpForm.startDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate" class="end-date">
                <el-date-picker
                  v-model="workExpForm.endDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="workExpForm.companyName"></el-input>
            </el-form-item>
            <el-form-item label="所属行业" prop="vocation">
              <select-picker-double
                :key-name="'vocation'"
                :first-tab-name="firstTabNameBelongIndustry"
                :data-source="industryArr3"
                :max-number="3"
                :level-number="2"
                :default-value="defaultValueBelongIndustry"
                :form-name="'workExpForm'"
                @deleteRules="deleteRules"
              />
            </el-form-item>
            <el-form-item label="公司规模" prop="companySize">
              <el-select v-model="workExpForm.companySize" placeholder="请选择">
                <el-option
                  v-for="(itemInner,index) in scaleArr"
                  :key="index"
                  :label="itemInner.label"
                  :value="itemInner.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司性质" prop="companyType">
              <el-select v-model="workExpForm.companyType" placeholder="请选择">
                <el-option
                  v-for="(itemInner,index) in enterprisePropertyArr"
                  :key="index"
                  :label="itemInner.label"
                  :value="itemInner.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司介绍" prop="companyIntroduce">
              <el-input
                v-model="workExpForm.companyIntroduce"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="职位名称" prop="title">
              <el-input v-model="workExpForm.title"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input v-model="workExpForm.department"></el-input>
            </el-form-item>
            <el-form-item label="负责区域" prop="responsibleArea">
              <el-input v-model="workExpForm.responsibleArea"></el-input>
            </el-form-item>
            <el-form-item label="是否海外" prop="isOverseas">
              <el-radio-group v-model="workExpForm.isOverseas">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="汇报对象" prop="leader">
              <el-input v-model="workExpForm.leader"></el-input>
            </el-form-item>
            <el-form-item label="下属人数" prop="underlingNumber" class="text-suffix">
              <el-input v-model="workExpForm.underlingNumber">
                <template slot="suffix">人</template>
              </el-input>
            </el-form-item>
            <el-form-item label="工作职责" prop="summary">
              <el-input
                v-model="workExpForm.summary"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="工作业绩" prop="achievement">
              <el-input
                v-model="workExpForm.achievement"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="离职原因" prop="reasonOfLeaving">
              <el-input
                v-model="workExpForm.reasonOfLeaving"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('workExpForm')">保存</el-button>
              <el-button @click="cancelForm('addWorkExpForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addWorkExpVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addWorkExp')"
        >
          <i class="el-icon-plus"></i> 添加工作经历
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加工作经历
        </div>
      </div>
      <!-- 项目经验 -->
      <div class="projectExp">
        <h3
          id="project-exp"
          :class="[(!projectExpVisible && !addProjectExpVisible) && editDisabled ? 'disabled-h3':'']"
        >
          项目经验
          <label v-if="noticeLabel5" class="notice-label">不完善</label>
        </h3>
        <div class="text-form">
          <div
            v-for="(item,i) in detailData.projects"
            :key="i"
            :class="[projectExpVisible && projectExpEditFlag === i ? 'item min-h-690' : 'item']"
          >
            <!-- 简历详情布局 -->
            <!-- <div
              v-if="($route.name === 'resume' || $route.name === 'resumeDetail') && (projectExpEditFlag !== i || projectExpEditFlag === null)"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <div class="cont-1">
                <span class="name">{{ item.projectName }}</span>
                <span
                  class="time"
                >{{ item.startDate }}-{{ item.endDate }}（{{ item.startToEndDate }}）</span>
                <span class="edit" @click="editIt('projectExp',i)">编辑</span>
              </div>
              <ul class="cont-2 mt-0">
                <li>
                  <label>职务</label>
                  <span>{{ item.title }}</span>
                </li>
                <li>
                  <label>项目描述</label>
                  <span>{{ item.projectDescription }}</span>
                </li>
                <li>
                  <label>项目职责</label>
                  <span>{{ item.responsibilities }}</span>
                </li>
              </ul>
            </div>-->
            <!-- 简历解析布局 -->
            <div
              v-if="projectExpEditFlag !== i || projectExpEditFlag === null"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <el-form label-width="85px" :inline="true">
                <el-form-item
                  :class="[noticeLabel5 && (!item.startDate && !item.endDate) ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="项目时间"
                >
                  {{ item.startDate }}
                  <span v-if="item.startDate">-</span>
                  {{ item.endDate }}
                  <span
                    v-if="item.startToEndDate"
                  >（{{ item.startToEndDate }}）</span>
                  <span class="edit" @click="editIt('projectExp',i)">编辑</span>
                </el-form-item>
                <el-form-item
                  label="项目名称"
                  :class="[noticeLabel5 && !item.projectName ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                >{{ item.projectName }}</el-form-item>
                <el-form-item v-if="item.companyName" label="所在公司">{{ item.companyName }}</el-form-item>
                <el-form-item v-if="item.title" label="项目职务">{{ item.title }}</el-form-item>
                <el-form-item
                  label="项目描述"
                  :class="[noticeLabel5 && !item.projectDescription ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                >{{ item.projectDescription }}</el-form-item>
                <el-form-item v-if="item.responsibilities" label="项目职责">{{ item.responsibilities }}</el-form-item>
                <el-form-item
                  v-if="item.projectAchievement"
                  label="项目业绩"
                >{{ item.projectAchievement }}</el-form-item>
              </el-form>
            </div>
            <!-- 表单编辑 -->
            <div v-if="projectExpVisible && projectExpEditFlag === i" class="edit-form">
              <el-form
                :ref="'projectExpForm'+i"
                :rules="projectExpFormRules"
                :model="projectExpForm"
                label-width="90px"
                :inline="true"
              >
                <div class="take-date">
                  <el-form-item label="项目时间" prop="startDate" class="start-date">
                    <el-date-picker
                      v-model="projectExpForm.startDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item prop="endDate" class="end-date">
                    <el-date-picker
                      v-model="projectExpForm.endDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item label="项目名称" prop="projectName">
                  <el-input v-model="projectExpForm.projectName"></el-input>
                </el-form-item>
                <el-form-item label="所在公司" prop="companyName">
                  <el-input v-model="projectExpForm.companyName"></el-input>
                </el-form-item>
                <el-form-item label="项目职务" prop="title">
                  <el-input v-model="projectExpForm.title"></el-input>
                </el-form-item>
                <el-form-item label="项目描述" prop="projectDescription">
                  <el-input
                    v-model="projectExpForm.projectDescription"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="项目职责" prop="responsibilities">
                  <el-input
                    v-model="projectExpForm.responsibilities"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="项目业绩" prop="projectAchievement">
                  <el-input
                    v-model="projectExpForm.projectAchievement"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 20}"
                    maxlength="5000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button type="primary" @click="submitForm('projectExpForm'+i,[],1,item.id)">保存</el-button>
                  <el-button @click="cancelForm('projectExpForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeProject(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 添加工作经历 -->
        <div v-if="addProjectExpVisible" class="edit-form">
          <el-form
            ref="projectExpForm"
            :rules="projectExpFormRules"
            :model="projectExpForm"
            label-width="90px"
            :inline="true"
          >
            <div class="take-date">
              <el-form-item label="项目时间" prop="startDate" class="start-date">
                <el-date-picker
                  v-model="projectExpForm.startDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate" class="end-date">
                <el-date-picker
                  v-model="projectExpForm.endDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="projectExpForm.projectName"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="companyName">
              <el-input v-model="projectExpForm.companyName"></el-input>
            </el-form-item>
            <el-form-item label="项目职务" prop="title">
              <el-input v-model="projectExpForm.title"></el-input>
            </el-form-item>
            <el-form-item label="项目描述" prop="projectDescription">
              <el-input
                v-model="projectExpForm.projectDescription"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="项目职责" prop="responsibilities">
              <el-input
                v-model="projectExpForm.responsibilities"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="项目业绩" prop="projectAchievement">
              <el-input
                v-model="projectExpForm.projectAchievement"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20}"
                maxlength="5000"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('projectExpForm')">保存</el-button>
              <el-button @click="cancelForm('addProjectExpForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addProjectExpVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addProjectExp')"
        >
          <i class="el-icon-plus"></i> 添加项目经验
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加项目经验
        </div>
      </div>
      <!-- 培训经历 -->
      <div class="trainExp">
        <h3
          id="train-exp"
          :class="[(!trainExpVisible && !addTrainExpVisible) && editDisabled ? 'disabled-h3':'']"
        >
          培训经历
          <label v-if="noticeLabel6" class="notice-label">不完善</label>
        </h3>
        <div class="text-form">
          <div
            v-for="(item,i) in detailData.training"
            :key="i"
            :class="[trainExpVisible && trainExpEditFlag === i ? 'item' : 'item']"
          >
            <div
              v-if="trainExpEditFlag !== i || trainExpEditFlag === null"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <div class="cont-1">
                <span class="name">{{ item.trainingCourse }}</span>
                <span class="train-comp">· {{ item.trainingInstitution }}</span>
                <span
                  class="time"
                >{{ item.startDate }}-{{ item.endDate }}（{{ item.startToEndDate }}）</span>
                <span class="edit" @click="editIt('trainExp',i)">编辑</span>
              </div>
            </div>
            <!-- 表单编辑 -->
            <div v-if="trainExpVisible && trainExpEditFlag === i" class="edit-form">
              <el-form
                :ref="'trainExpForm'+i"
                :rules="trainExpFormRules"
                :model="trainExpForm"
                label-width="90px"
                :inline="true"
              >
                <div class="take-date">
                  <el-form-item label="培训时间" prop="startDate" class="start-date">
                    <el-date-picker
                      v-model="trainExpForm.startDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item prop="endDate" class="end-date">
                    <el-date-picker
                      v-model="trainExpForm.endDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item label="培训课程" prop="trainingCourse">
                  <el-input v-model="trainExpForm.trainingCourse"></el-input>
                </el-form-item>
                <el-form-item label="培训机构" prop="trainingInstitution">
                  <el-input v-model="trainExpForm.trainingInstitution"></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button type="primary" @click="submitForm('trainExpForm'+i,[],1,item.id)">保存</el-button>
                  <el-button @click="cancelForm('trainExpForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeTraining(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 添加培训经历 -->
        <div v-if="addTrainExpVisible" class="edit-form">
          <el-form
            ref="trainExpForm"
            :rules="trainExpFormRules"
            :model="trainExpForm"
            label-width="90px"
            :inline="true"
          >
            <div class="take-date">
              <el-form-item label="培训时间" prop="startDate" class="start-date">
                <el-date-picker
                  v-model="trainExpForm.startDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate" class="end-date">
                <el-date-picker
                  v-model="trainExpForm.endDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="培训课程" prop="trainingCourse">
              <el-input v-model="trainExpForm.trainingCourse"></el-input>
            </el-form-item>
            <el-form-item label="培训机构" prop="trainingInstitution">
              <el-input v-model="trainExpForm.trainingInstitution"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('trainExpForm')">保存</el-button>

              <el-button @click="cancelForm('addTrainExpForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addTrainExpVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addTrainExp')"
        >
          <i class="el-icon-plus"></i> 添加培训经历
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加培训经历
        </div>
      </div>
      <!-- 语言能力 -->
      <div class="langPower">
        <h3
          id="lang-power"
          :class="[(!langPowerVisible && !addLangPowerVisible) && editDisabled ? 'disabled-h3':'']"
        >
          语言能力
          <label v-if="noticeLabel7" class="notice-label">不完善</label>
        </h3>
        <div class="text-form">
          <div v-for="(item,i) in detailData.languages" :key="i" class="item-inner">
            <div
              v-if="langPowerEditFlag !== i || langPowerEditFlag === null"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <div class="cont-1">
                <span class="text">
                  {{ item.languages }}：
                  <label
                    v-if="item.listeningSpeakingSkills && Number(item.listeningSpeakingSkills) > 0"
                  >口语{{ item.listeningSpeakingSkills | filterArr(readListenSkillsArr) }},</label>
                  <label v-else>口语{{ item.listeningSpeakingSkills }},</label>
                  <label
                    v-if="item.readingWritingSkills && Number(item.readingWritingSkills) > 0"
                  >书面能力{{ item.readingWritingSkills | filterArr(readListenSkillsArr) }}</label>
                  <label v-else>口语{{ item.readingWritingSkills }}</label>
                </span>
                <span class="text">{{ item.level }}</span>
                <span class="edit" @click="editIt('langPower',i)">编辑</span>
              </div>
            </div>
            <!-- 表单编辑 -->
            <div v-if="langPowerVisible && langPowerEditFlag === i" class="edit-form">
              <el-form
                :ref="'langPowerForm'+i"
                :rules="langPowerFormRules"
                :model="langPowerForm"
                label-width="90px"
                :inline="true"
              >
                <el-form-item label="语种" prop="languages">
                  <el-input v-model="langPowerForm.languages"></el-input>
                </el-form-item>
                <el-form-item label="口语能力" prop="listeningSpeakingSkills">
                  <el-select v-model="langPowerForm.listeningSpeakingSkills" placeholder="请选择">
                    <el-option
                      v-for="(itemInner,index) in readListenSkillsArr"
                      :key="index"
                      :label="itemInner.label"
                      :value="itemInner.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="书写能力" prop="readingWritingSkills">
                  <el-select v-model="langPowerForm.readingWritingSkills" placeholder="请选择">
                    <el-option
                      v-for="(itemInner,index) in readListenSkillsArr"
                      :key="index"
                      :label="itemInner.label"
                      :value="itemInner.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="等级" prop="level">
                  <el-input v-model="langPowerForm.level"></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button type="primary" @click="submitForm('langPowerForm'+i,[],1,item.id)">保存</el-button>
                  <el-button @click="cancelForm('langPowerForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeLanguages(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 添加语言能力 -->
        <div v-if="addLangPowerVisible" class="edit-form">
          <el-form
            ref="langPowerForm"
            :rules="langPowerFormRules"
            :model="langPowerForm"
            label-width="90px"
            :inline="true"
          >
            <el-form-item label="语种" prop="languages">
              <el-input v-model="langPowerForm.languages"></el-input>
            </el-form-item>
            <el-form-item label="口语能力" prop="listeningSpeakingSkills">
              <el-select v-model="langPowerForm.listeningSpeakingSkills" placeholder="请选择">
                <el-option
                  v-for="(itemInner,index) in readListenSkillsArr"
                  :key="index"
                  :label="itemInner.label"
                  :value="itemInner.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="书写能力" prop="readingWritingSkills">
              <el-select v-model="langPowerForm.readingWritingSkills" placeholder="请选择">
                <el-option
                  v-for="(itemInner,index) in readListenSkillsArr"
                  :key="index"
                  :label="itemInner.label"
                  :value="itemInner.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="等级" prop="level">
              <el-input v-model="langPowerForm.level"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('langPowerForm')">保存</el-button>

              <el-button @click="cancelForm('addLangPowerForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addLangPowerVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addLangPower')"
        >
          <i class="el-icon-plus"></i> 添加语言能力
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加语言能力
        </div>
      </div>
      <!-- 证书信息 -->
      <div class="certInfo">
        <h3
          id="certify-info"
          :class="[(!certInfoVisible && !addCertInfoVisible) && editDisabled ? 'disabled-h3':'']"
        >
          证书信息
          <label v-if="noticeLabel8" class="notice-label">不完善</label>
        </h3>
        <div class="text-form">
          <div v-for="(item,i) in detailData.cerInfos" :key="i" class="item-inner">
            <!-- 简历详情布局 -->
            <div
              v-if="($route.name === 'resume' || $route.name === 'resumeDetail') && (certInfoEditFlag !== i || certInfoEditFlag === null)"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <div class="cont-1">
                <span class="text">{{ item.nameOfCertificate }}</span>
                <span class="edit" @click="editIt('certInfo',i)">编辑</span>
              </div>
              <ul class="cont-2">
                <li>
                  <label>获取时间</label>
                  <span>{{ item.receivingDate }}</span>
                </li>
                <li v-if="item.score">
                  <label>描述</label>
                  <span>{{ item.score }}</span>
                </li>
              </ul>
            </div>
            <!-- 简历解析布局 -->
            <div
              v-if="$route.name === 'resumeUpload' && (certInfoEditFlag !== i || certInfoEditFlag === null)"
              :class="[editDisabled ? 'disabled' : '']"
            >
              <el-form label-width="85px" :inline="true">
                <el-form-item
                  :class="[noticeLabel8 && !item.receivingDate ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                  label="获取时间"
                >
                  {{ item.receivingDate }}
                  <span class="edit" @click="editIt('certInfo',i)">编辑</span>
                </el-form-item>
                <el-form-item
                  label="证书名称"
                  :class="[noticeLabel8 && !item.nameOfCertificate ? 'mini-orange-dot' : 'mini-orange-dot no-text']"
                >{{ item.nameOfCertificate }}</el-form-item>
                <el-form-item label="描述">{{ item.score }}</el-form-item>
              </el-form>
            </div>
            <!-- 表单编辑 -->
            <div v-if="certInfoVisible && certInfoEditFlag === i" class="edit-form">
              <el-form
                :ref="'certInfoForm'+i"
                :rules="certInfoFormRules"
                :model="certInfoForm"
                label-width="90px"
                :inline="true"
              >
                <div class="take-date">
                  <el-form-item label="获取时间" prop="receivingDate" class="start-date">
                    <el-date-picker
                      v-model="certInfoForm.receivingDate"
                      :clearable="false"
                      value-format="yyyy-MM"
                      type="month"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item label="证书名称" prop="nameOfCertificate">
                  <el-input v-model="certInfoForm.nameOfCertificate"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="score">
                  <el-input v-model="certInfoForm.score"></el-input>
                </el-form-item>
                <el-form-item class="btns btns-thin">
                  <el-button type="primary" @click="submitForm('certInfoForm'+i,[],1,item.id)">保存</el-button>
                  <el-button @click="cancelForm('certInfoForm')">取消</el-button>
                  <el-button type="text" @click="deleteResumeSkills(item.id)">删除本条</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 添加证书信息 -->
        <div v-if="addCertInfoVisible" class="edit-form">
          <el-form
            ref="certInfoForm"
            :rules="certInfoFormRules"
            :model="certInfoForm"
            label-width="90px"
            :inline="true"
          >
            <div class="take-date">
              <el-form-item label="获取时间" prop="receivingDate" class="start-date">
                <el-date-picker
                  v-model="certInfoForm.receivingDate"
                  :clearable="false"
                  value-format="yyyy-MM"
                  type="month"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="证书名称" prop="nameOfCertificate">
              <el-input v-model="certInfoForm.nameOfCertificate"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="score">
              <el-input v-model="certInfoForm.score"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('certInfoForm')">保存</el-button>

              <el-button @click="cancelForm('addCertInfoForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addCertInfoVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addCertInfo')"
        >
          <i class="el-icon-plus"></i> 添加证书信息
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加证书信息
        </div>
      </div>
      <!-- 自我评价 -->
      <div v-if="detailData.detail" class="selfEval">
        <h3 id="self-eval" :class="[!selfEvalVisible && editDisabled ? 'disabled-h3':'']">
          自我评价
          <span
            v-if="!selfEvalVisible && !editDisabled"
            class="edit"
            @click="editIt('selfEval')"
          >编辑</span>
          <span v-if="editDisabled" class="edit edit-disabled">编辑</span>
        </h3>
        <div class="text-form">
          <div v-if="!selfEvalVisible" :class="[editDisabled ? 'disabled' : '']">
            <div class="cont-1">
              <span class="text">{{ detailData.detail.personal }}</span>
            </div>
          </div>
          <!-- 表单编辑 -->
          <div v-else class="edit-form">
            <el-form ref="selfEvalForm" :model="selfEvalForm" label-width="90px" :inline="true">
              <el-form-item label="自我评价" prop="selfEvalForm">
                <el-input
                  v-model="selfEvalForm.personal"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 20}"
                  maxlength="2000"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="submitForm('selfEvalForm')">保存</el-button>

                <el-button @click="cancelForm('selfEvalForm')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 附加信息 -->
      <div v-if="detailData.detail" class="surplusInfo">
        <h3 id="append-info" :class="[!surplusInfoVisible && editDisabled ? 'disabled-h3':'']">
          附加信息
          <span
            v-if="!surplusInfoVisible && !editDisabled"
            class="edit"
            @click="editIt('surplusInfo')"
          >编辑</span>
          <span v-if="editDisabled" class="edit edit-disabled">编辑</span>
        </h3>
        <div class="text-form">
          <div v-if="!surplusInfoVisible" :class="[editDisabled ? 'disabled' : '']">
            <div class="cont-1">
              <span class="text">{{ detailData.detail.attachmentInformation }}</span>
            </div>
          </div>
          <!-- 表单编辑 -->
          <div v-else class="edit-form">
            <el-form
              ref="surplusInfoForm"
              :model="surplusInfoForm"
              label-width="90px"
              :inline="true"
            >
              <el-form-item label="附加信息" prop="attachmentInformation">
                <el-input
                  v-model="surplusInfoForm.attachmentInformation"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 20}"
                  maxlength="1000"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="submitForm('surplusInfoForm')">保存</el-button>

                <el-button @click="cancelForm('surplusInfoForm')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 我的作品 -->
      <div class="myProduct">
        <h3 id="my-prod" :class="[!addMyProductVisible && editDisabled ? 'disabled-h3':'']">我的作品</h3>
        <div :class="[editDisabled ? 'text-form disabled' : 'text-form']">
          <ul v-for="(item,i) in detailData.opus" :key="i" class="cont-2">
            <li v-if="item.opusName">
              <label>作品附件</label>
              <span>{{ item.opusName }}</span>
              <div class="btns">
                <a class="download" :href="item.fileUrl">下载</a>
                <span class="delete" @click="deleteResumeOpus(item.id)">删除</span>
              </div>
            </li>
            <li v-if="item.opuslink">
              <label>作品地址</label>
              <a :href="item.opuslink">{{ item.opuslink }}</a>
              <div class="btns">
                <span class="delete" @click="deleteResumeOpus(item.id)">删除</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 添加我的作品 -->
        <div v-if="addMyProductVisible" class="edit-form">
          <el-form
            ref="myProductForm"
            :rules="myProductFormRules"
            :model="myProductForm"
            label-width="90px"
            :inline="true"
          >
            <el-form-item label="上传作品" prop="uploadFile" class="upload-file">
              <el-upload
                :data="paramsData"
                :show-file-list="false"
                :action="uploadResumeUrl"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :limit="1"
              >
                <el-button type="primary">上传附件</el-button>
              </el-upload>
              <p class="tip">上传文件支持格式：txt,html,htm,doc,docx,pdf,jpg,jpeg,gif,png,bmp, 上传文件大小不能超过10M</p>
            </el-form-item>
            <el-form-item label="作品链接" prop="opuslink" class="product-url">
              <el-input v-model="myProductForm.opuslink" placeholder="http://"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm('myProductForm')">保存</el-button>

              <el-button @click="cancelForm('addMyProductForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="!addMyProductVisible && !editDisabled"
          class="add-btn"
          @click="addIt('addMyProduct')"
        >
          <i class="el-icon-plus"></i> 添加我的作品
        </div>
        <div v-if="editDisabled" class="add-btn add-btn-disabled">
          <i class="el-icon-plus"></i> 添加我的作品
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SelectPicker from '@/components/common/selectPicker'
import SelectPickerDouble from '@/components/common/selectPickerDouble'
import { isRealNum } from '@/utils/common'
import {
  removeResumenById,
  getResumeInfoById,
  editResumeDetail,
  editResumeEducation,
  editResumeExperience,
  editResumeProject,
  addResumeTraining,
  addResumeSkills,
  editResumeTraining,
  editResumeLanguages,
  editResumeSkills,
  addResumeEducation,
  addResumeExperience,
  addResumeProject,
  addResumeLanguages,
  addResumeOpus,
  deleteResumeEducationById,
  deleteResumeExperience,
  deleteResumeProject,
  deleteResumeTraining,
  deleteResumeLanguages,
  deleteResumeSkills,
  deleteResumeOpus
} from '@/api/resume'
import { getDict } from '@/api/common'
import resumeDict from '@/assets/js/resume'

export default {
  components: {
    SelectPicker,
    SelectPickerDouble
  },
  inject: ['reload'],
  props: {
    newResumeDetail: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      noticeLabel1: true,
      noticeLabel2: true,
      noticeLabel3: true,
      noticeLabel4: true,
      noticeLabel5: true,
      noticeLabel6: true,
      noticeLabel7: true,
      noticeLabel8: true,
      editDisabled: false,
      readListenSkillsArr: [],
      enterprisePropertyArr: [],
      scaleArr: [],
      jobStatusArr: [],
      degreeArrTemp: resumeDict.degree,
      ageArrTemp: resumeDict.age,
      eduArrTemp: resumeDict.degree,
      workExpArrTemp: resumeDict.workExp,
      intentionCityArrTemp: resumeDict.attentCity,
      salaryArrTemp: resumeDict.yearSalary,
      loading: true,
      value: '1', // 后续删掉
      value1: [], // 后续删掉
      options: [
        {
          value: '1',
          label: '更新简历'
        },
        {
          value: '2',
          label: '在线编辑'
        },
        {
          value: '3',
          label: '上传附件'
        }
      ],
      baseInfoForm: {
        name: null,
        gender: null,
        liveCity: null,
        mobile: null,
        email: null,
        age: null,
        startWorkMonth: null,
        currentCompanyName: null,
        title: null,
        graduateSchool: null,
        degreeCode: null
      },
      baseInfoFormRules: {
        name: [
          {
            required: true,
            validator: this.$verify.trueNameFormat,
            trigger: 'blur'
          }
        ],
        liveCity: [
          { required: true, message: '请选择所在地', trigger: 'blur' }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     validator: this.$verify.phoneFormat,
        //     trigger: 'blur'
        //   }
        // ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        birthday: [
          { required: true, message: '请选择出生年月', trigger: 'blur' }
        ],
        startWorkMonth: [
          { required: true, message: '请选择工作年限', trigger: 'blur' }
        ],
        currentCompanyName: [
          { required: true, message: '请填写目前公司', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请填写目前职位', trigger: 'blur' }],
        graduateSchool: [
          { required: true, message: '请填写毕业学校', trigger: 'blur' }
        ],
        degreeCode: [
          { required: true, message: '请选择最高学历', trigger: 'blur' }
        ]
      },
      jobIntentForm: {
        jobStatus: null,
        currentSalary: null,
        currentSalaryMonth: null,
        currentSalaryTax: '1',
        currentOtherSalary: null,
        intentionIndustryId: null,
        intentionPosition: null,
        intentionCity: null,
        intentionSalary: null,
        intentionSalaryTax: '1'
      },
      jobIntentFormRules: {
        jobStatus: [
          { required: true, message: '请选择求职状态', trigger: 'change' }
        ],
        currentSalary: [
          { validator: this.$verify.salaryMonthFormat, trigger: 'change' }
        ],
        intentionIndustryId: [
          { required: true, message: '请选择期望行业', trigger: 'blur' }
        ],
        intentionCity: [
          { required: true, message: '请选择期望城市', trigger: 'blur' }
        ]
      },
      eduExpForm: {
        startDate: null,
        endDate: null,
        school: null,
        speciality: null,
        degreeCode: null,
        isUnifiedStrategy: '1',
        summary: null
      },
      eduExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        school: [
          { required: true, message: '请填写学校名称', trigger: 'blur' }
        ],
        speciality: [
          { required: true, message: '请填写就读专业', trigger: 'blur' }
        ],
        degreeCode: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        isUnifiedStrategy: [
          { required: true, message: '请选择是否统招', trigger: 'change' }
        ]
      },
      workExpForm: {
        startDate: null,
        endDate: null,
        companyName: null,
        vocation: null,
        companySize: null,
        companyType: null,
        companyIntroduce: null,
        title: null,
        department: null,
        responsibleArea: null,
        isOverseas: '1',
        leader: null,
        underlingNumber: null,
        summary: null,
        achievement: null,
        reasonOfLeaving: null
      },
      workExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请填写职位名称', trigger: 'blur' }],
        vocation: [
          { required: true, message: '请选择所属行业', trigger: 'blur' }
        ]
      },
      projectExpForm: {
        startDate: null,
        endDate: null,
        projectName: null,
        companyName: null,
        title: null,
        projectDescription: null,
        responsibilities: null,
        projectAchievement: null
      },
      projectExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        projectDescription: [
          { required: true, message: '请填写项目描述', trigger: 'blur' }
        ]
      },
      trainExpForm: {
        startDate: null,
        endDate: null,
        trainingCourse: null,
        trainingInstitution: null
      },
      trainExpFormRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        trainingCourse: [
          { required: true, message: '请填写培训课程', trigger: 'blur' }
        ],
        trainingInstitution: [
          { required: true, message: '请填写培训机构', trigger: 'blur' }
        ]
      },
      langPowerForm: {
        languages: null,
        listeningSpeakingSkills: null,
        readingWritingSkills: null,
        level: null
      },
      langPowerFormRules: {
        languages: [{ required: true, message: '请填写语种', trigger: 'blur' }],
        listeningSpeakingSkills: [
          { required: true, message: '请选择口语能力', trigger: 'change' }
        ],
        readingWritingSkills: [
          { required: true, message: '请选择书写能力', trigger: 'change' }
        ]
      },
      certInfoForm: {
        receivingDate: null,
        nameOfCertificate: null,
        score: null
      },
      certInfoFormRules: {
        receivingDate: [
          { required: true, message: '请选择获取时间', trigger: 'change' }
        ],
        nameOfCertificate: [
          { required: true, message: '请填写证书名称', trigger: 'change' }
        ]
      },
      selfEvalForm: {
        personal: null
      },
      surplusInfoForm: {
        attachmentInformation: null
      },
      myProductForm: {
        uploadFile: null,
        productUrl: null
      },
      myProductFormRules: {
        productUrl: [
          { required: true, message: '请填写链接作品', trigger: 'blur' }
        ]
      },
      eduExpArr: [0, 1], // 教育经历数据list
      workExpArr: [0, 1], // 工作经历数据list
      eduExpEditFlag: null, // 教育经历编辑标识
      workExpEditFlag: null, // 工作经历编辑标识
      projectExpEditFlag: null, // 项目经验编辑标识
      trainExpEditFlag: null, // 培训经历编辑标识
      langPowerEditFlag: null, // 培训经历编辑标识
      certInfoEditFlag: null, // 证书信息编辑标识
      addressArr1: [], // 省市区数据字典
      addressArr2: [], // 省市区数据字典
      industryArr1: [], // 行业数据字典
      industryArr2: [], // 行业数据字典
      industryArr3: [], // 行业数据字典
      firstTabNameAddress: '', // selectPicker选中项tab
      firstTabNameCity: '', // selectPicker选中项tab
      firstTabNameIndustry: '', // selectPicker选中项tab
      firstTabNameBelongIndustry: '', // selectPicker选中项tab
      defaultValueIndustry: [], // 期望行业初始值
      defaultValueBelongIndustry: [], // 所属行业初始值
      baseInfoVisible: false, // 编辑基本信息
      jobIntentVisible: false, // 编辑求职意向
      eduExpVisible: false, //  编辑教育经历
      workExpVisible: false, // 编辑工作经历
      projectExpVisible: false, // 编辑项目经验
      trainExpVisible: false, // 编辑培训经历
      langPowerVisible: false, // 编辑语言能力
      certInfoVisible: false, // 编辑证书信息能力
      selfEvalVisible: false, // 编辑自我评价能力
      surplusInfoVisible: false, // 编辑附加信息
      addEduExpVisible: false, // 添加教育经历
      addWorkExpVisible: false, // 添加工作经历
      addProjectExpVisible: false, // 添加项目经验
      addTrainExpVisible: false, // 添加培训经历
      addLangPowerVisible: false, // 添加语言能力
      addCertInfoVisible: false, // 添加证书信息
      addMyProductVisible: false, // 添加我的作品
      detailData: {},
      paramsData: {},
      paramsDataAvatar: {},
      uploadResumeUrl: '/api/common/upload',
      opusUrl: '', // 文件dbPath
      opusName: '', // 文件名称
      avatarImg: null,
      avatarLoading: false
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData,
      dictData: state => state.common.dictData
    }),
    currentYearSalary() {
      return (
        (this.jobIntentForm.currentSalary *
          this.jobIntentForm.currentSalaryMonth) /
        10000
      )
    }
  },
  destroyed() {
    // sessionStorage.removeItem('resumeId')
  },
  mounted() {
    if (
      this.$route.name === 'resumeDetail' ||
      this.$route.name === 'resumeUpload'
    ) {
      let dictDataRes = {}
      getDict().then(res => {
        dictDataRes = res
        const dictData = dictDataRes
        const selectedData = dictDataRes.selectedData
        console.log(dictDataRes, dictData, selectedData)
        // 所在地
        this.addressArr1 =
          dictData && JSON.parse(JSON.stringify(dictData.areas))
        this.addressArr1 &&
          this.addressArr1.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 期望城市
        this.addressArr2 =
          dictData && JSON.parse(JSON.stringify(dictData.areas))
        this.addressArr2 &&
          this.addressArr2.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 期望行业
        this.industryArr1 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr1 &&
          this.industryArr1.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 所属行业
        this.industryArr2 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr2 &&
          this.industryArr2.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        this.industryArr3 =
          dictData && JSON.parse(JSON.stringify(dictData.industry))
        this.industryArr3 &&
          this.industryArr3.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        // 求职状态
        this.jobStatusArr =
          dictData && dictData.dicts && dictData.dicts.jobStatus
        // 企业规模
        this.scaleArr =
          dictData && dictData.dicts && dictData.dicts.enterpriseScale
        // 公司性质
        this.enterprisePropertyArr =
          dictData && dictData.dicts && dictData.dicts.enterpriseProperty
        // 口语听力能力
        this.readListenSkillsArr =
          dictData && dictData.dicts && dictData.dicts.readListenSkills
        this.$nextTick(() => {
          // 初始化数据
          this.baseInfoForm.intentionCity =
            selectedData && selectedData.intentionCity
          this.baseInfoForm.intentionIndustryId =
            selectedData && selectedData.intentionIndustryId
          this.workExpForm.vocation = selectedData && selectedData.vocation
        })
        // 简历详情
        this.loading = true
        this.getResumeInfoById()
        this.loading = false
      })
    } else {
      // 所在地
      this.addressArr1 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.areas))
      this.addressArr1 &&
        this.addressArr1.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(x => {
              delete x.children
            })
          } else {
            delete item.children
          }
        })
      // 期望城市
      this.addressArr2 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.areas))
      this.addressArr2 &&
        this.addressArr2.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(x => {
              delete x.children
            })
          } else {
            delete item.children
          }
        })
      // 期望行业
      this.industryArr1 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
      this.industryArr1 &&
        this.industryArr1.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(x => {
              delete x.children
            })
          } else {
            delete item.children
          }
        })
      // 所属行业
      this.industryArr2 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
      this.industryArr2 &&
        this.industryArr2.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(x => {
              delete x.children
            })
          } else {
            delete item.children
          }
        })
      this.industryArr3 =
        this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
      this.industryArr3 &&
        this.industryArr3.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(x => {
              delete x.children
            })
          } else {
            delete item.children
          }
        })
      // 求职状态
      this.jobStatusArr =
        this.dictData && this.dictData.dicts && this.dictData.dicts.jobStatus
      // 企业规模
      this.scaleArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.enterpriseScale
      // 公司性质
      this.enterprisePropertyArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.enterpriseProperty
      // 口语听力能力
      this.readListenSkillsArr =
        this.dictData &&
        this.dictData.dicts &&
        this.dictData.dicts.readListenSkills
      this.$nextTick(() => {
        // 初始化数据
        this.baseInfoForm.intentionCity =
          this.selectedData && this.selectedData.intentionCity
        this.baseInfoForm.intentionIndustryId =
          this.selectedData && this.selectedData.intentionIndustryId
        this.workExpForm.vocation =
          this.selectedData && this.selectedData.vocation
      })
      // 简历详情
      this.loading = true
      this.getResumeInfoById()
      this.loading = false
    }
  },
  methods: {
    handleCommand(e) {
      if (e.type === 'a') {
        this.$router.push({ path: `order/allOrder?resumeId=${e.resumeId}` })
      }
    },
    handleAvatarSuccessAvatar(res, file) {
      this.avatarLoading = false
      if (res.code === '000000') {
        this.baseInfoForm.avatar = res.data && res.data.dbPath
        this.avatarImg = res.data && res.data.webPath
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    beforeAvatarUploadAvatar(file) {
      this.avatarLoading = true
      this.paramsDataAvatar.ossFileType = 'resumeInformation'
    },
    nowRecommend() {
      this.$router.push({
        name: 'recommendPosition',
        query: {
          resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
        }
      })
    },
    getResumeInfoById() {
      this.loading = true
      const params = {
        id: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      getResumeInfoById(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.loading = false
          this.detailData = data
          this.avatarImg = data.detail.avatarImg
          document.title = data.detail.name + '的简历-大猎英才'
          this.baseInfoForm = JSON.parse(JSON.stringify(data.detail)) // 基本信息
          this.selfEvalForm = JSON.parse(JSON.stringify(data.detail)) // 自我评价
          this.jobIntentForm = JSON.parse(JSON.stringify(data.detail)) // 求职意向
          // 期望年薪除以10000
          this.detailData.detail.intentionSalary =
            data.detail &&
            data.detail.intentionSalary &&
            data.detail.intentionSalary / 10000
          // 税前税后默认值
          if (!this.jobIntentForm.currentSalaryTax) {
            this.jobIntentForm.currentSalaryTax = '1'
          }
          if (!this.jobIntentForm.intentionSalaryTax) {
            this.jobIntentForm.intentionSalaryTax = '1'
          }
          // 所在地
          this.addressArr1.filter(item => {
            item.children &&
              item.children.filter(i => {
                if (i.value === data.detail.liveCity + '') {
                  this.firstTabNameAddress = item.value
                  return i.value
                }
              })
          })
          // 期望城市
          this.addressArr2.filter(item => {
            item.children &&
              item.children.filter(i => {
                if (i.value === data.detail.intentionCity + '') {
                  this.firstTabNameCity = item.value
                  return i.value
                }
              })
          })
          // 期望行业
          this.industryArr1.filter(item => {
            if (data.detail.intentionIndustryId1) {
              this.firstTabNameIndustry = item.value
              return item.value
            } else if (data.detail.intentionIndustryId2) {
              item.children &&
                item.children.filter(i => {
                  if (
                    i.value === data.detail.intentionIndustryId2.split(',')[0]
                  ) {
                    this.firstTabNameIndustry = item.value
                    return i.value
                  }
                })
            }
          })
          if (data.detail.intentionIndustryId1) {
            this.defaultValueIndustry = [data.detail.intentionIndustryId1 + ''] // 期望行业(一级)
          } else if (data.detail.intentionIndustryId2) {
            this.defaultValueIndustry = data.detail.intentionIndustryId2.split(
              ','
            ) // 期望行业(一级)
          }
          this.baseInfoForm.gender = data.detail.gender + ''
          // 基本信息
          if (
            data.detail.name &&
            data.detail.liveCity &&
            data.detail.mobile &&
            data.detail.email &&
            data.detail.age &&
            data.detail.workMonth &&
            data.detail.currentCompanyName &&
            data.detail.graduateSchool &&
            data.detail.degreeCode
          ) {
            this.noticeLabel1 = false
          }
          // 求职意向
          if (
            data.detail.jobStatus &&
            (data.detail.intentionIndustryId1 ||
              data.detail.intentionIndustryId2) &&
            data.detail.intentionCity
          ) {
            this.noticeLabel2 = false
          }
          // 教育经历
          const tempArr1 = []
          data.educations &&
            data.educations.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.school &&
                item.speciality &&
                item.degreeCode &&
                (item.isUnifiedStrategy === 1 || item.isUnifiedStrategy === 0)
              ) {
                tempArr1.push(0)
              } else {
                tempArr1.push(1)
              }
            })
          if (tempArr1.indexOf(1) !== -1) {
            this.noticeLabel3 = true
          } else {
            this.noticeLabel3 = false
          }
          // 工作经历
          const tempArr2 = []
          data.experiences &&
            data.experiences.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.companyName &&
                (item.industryId1 || item.industryId2) &&
                item.title
              ) {
                tempArr2.push(0)
              } else {
                tempArr2.push(1)
              }
            })
          if (tempArr2.indexOf(1) !== -1) {
            this.noticeLabel4 = true
          } else {
            this.noticeLabel4 = false
          }
          // 项目经验
          const tempArr3 = []
          data.projects &&
            data.projects.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.projectName &&
                item.projectDescription
              ) {
                tempArr3.push(0)
              } else {
                tempArr3.push(1)
              }
            })
          if (tempArr3.indexOf(1) !== -1) {
            this.noticeLabel5 = true
          } else {
            this.noticeLabel5 = false
          }
          // 培训经历
          const tempArr4 = []
          data.training &&
            data.training.filter(item => {
              if (
                item.startDate &&
                item.endDate &&
                item.trainingCourse &&
                item.trainingInstitution
              ) {
                tempArr4.push(0)
              } else {
                tempArr4.push(1)
              }
            })
          if (tempArr4.indexOf(1) !== -1) {
            this.noticeLabel6 = true
          } else {
            this.noticeLabel6 = false
          }
          // 语言能力
          const tempArr5 = []
          data.languages &&
            data.languages.filter(item => {
              if (
                item.languages &&
                item.listeningSpeakingSkills &&
                item.readingWritingSkills
              ) {
                tempArr5.push(0)
              } else {
                tempArr5.push(1)
              }
            })
          if (tempArr5.indexOf(1) !== -1) {
            this.noticeLabel7 = true
          } else {
            this.noticeLabel7 = false
          }
          // 证书信息
          const tempArr6 = []
          data.cerInfos &&
            data.cerInfos.filter(item => {
              if (item.receivingDate && item.nameOfCertificate) {
                tempArr6.push(0)
              } else {
                tempArr6.push(1)
              }
            })
          if (tempArr6.indexOf(1) !== -1) {
            this.noticeLabel8 = true
          } else {
            this.noticeLabel8 = false
          }
        }
      })
    },
    handleClose() {
      console.log('清空', this['baseInfoForm']['liveCity'])
      // if (this['baseInfoForm']['liveCity']) {
      //   console.log(666, this['baseInfoFormRules'])
      //   this['baseInfoFormRules']['liveCity'][0].required = true
      //   this['baseInfoFormRules']['address'][0].required = true
      //   console.log(666, this['baseInfoFormRules'])
      // }
    },
    // 编辑
    editIt(name, index) {
      this.editDisabled = true
      if (name === 'workExp') {
        // 所属行业
        this.industryArr2 =
          this.dictData && JSON.parse(JSON.stringify(this.dictData.industry))
        this.industryArr2 &&
          this.industryArr2.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                delete x.children
              })
            } else {
              delete item.children
            }
          })
        this.selectedData &&
          this.selectedData.vocation &&
          this.industryArr2.filter(item => {
            if (
              this.selectedData.vocation[0] &&
              this.selectedData.vocation[0].length === 3 &&
              this.selectedData.vocation[0] === item.value
            ) {
              this.firstTabNameBelongIndustry = item.value
              return item.value
            } else if (this.selectedData.vocation[0]) {
              item.children &&
                item.children.filter(i => {
                  if (i.value === this.selectedData.vocation[0]) {
                    this.firstTabNameBelongIndustry = item.value
                    return i.value
                  }
                })
            }
          })
      }
      console.log(
        name,
        this.selectedData,
        this.firstTabNameBelongIndustry,
        index
      )
      this[name + 'EditFlag'] = index
      this[name + 'Visible'] = true
      if (name === 'baseInfo') {
        this[name + 'Form'] = JSON.parse(JSON.stringify(this.detailData.detail))
        console.log('基本信息', this[name + 'Form'])
      } else if (name === 'jobIntent') {
        this[name + 'Form'] = JSON.parse(JSON.stringify(this.detailData.detail))
      } else if (name === 'eduExp') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.educations[index])
        )
      } else if (name === 'workExp') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.experiences[index])
        )
      } else if (name === 'projectExp') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.projects[index])
        )
      } else if (name === 'trainExp') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.training[index])
        )
      } else if (name === 'langPower') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.languages[index])
        )
      } else if (name === 'certInfo') {
        this[name + 'Form'] = JSON.parse(
          JSON.stringify(this.detailData.cerInfos[index])
        )
      } else if (name === 'selfEval') {
        this[name + 'Form'] = JSON.parse(JSON.stringify(this.detailData.detail))
        console.log('自我评价', this[name + 'Form'])
      } else if (name === 'surplusInfo') {
        this[name + 'Form'] = JSON.parse(JSON.stringify(this.detailData.detail))
        console.log('附加信息', this[name + 'Form'])
      }
    },
    // 添加
    addIt(name) {
      this.editDisabled = true
      const tempName = name.slice(3)
      this[tempName.slice(0, 1).toLowerCase() + tempName.slice(1) + 'Form'] = {}
      this[name + 'Visible'] = true
    },
    // 取消编辑
    cancelForm(name) {
      this.editDisabled = false
      console.log('关闭保存看编辑', name)
      this[name.slice(0, -4) + 'EditFlag'] = null
      this[name.slice(0, -4) + 'Visible'] = false
      this[
        'add' + name.slice(0, 1).toUpperCase() + name.slice(1, -4) + 'Visible'
      ] = false
    },
    // 保存
    submitForm(formName, keyNameArr, isRefArr, id) {
      console.log(111, formName, keyNameArr)
      // 初始化表单校验
      keyNameArr &&
        keyNameArr.filter(item => {
          if (
            Array.isArray(this.selectedData[item.keyName]) &&
            this.selectedData[item.keyName].length > 0 &&
            this.selectedData[item.keyName][0] !== 'null'
          ) {
            console.log(8888, item.keyName)
            this.deleteRules({ formName, keyName: item.keyName })
          } else {
            console.log(222, item.keyName)
            if (isRealNum(formName.charAt(formName.length - 1))) {
              // 循环的form需要去除最后一位索引数字
              this[formName.slice(0, -1) + 'Rules'][item.keyName] = [
                { required: true, message: item.rules, trigger: 'change' }
              ]
            } else {
              this[formName + 'Rules'][item.keyName] = [
                { required: true, message: item.rules, trigger: 'change' }
              ]
              console.log(
                333,
                item.keyName,
                this[formName + 'Rules'][item.keyName],
                this[formName + 'Rules']
              )
            }
          }
        })
      if (isRefArr) {
        // 循环ref表单校验（循环的表单类型是数组）
        this.$refs[formName][0].validate(valid => {
          if (valid) {
            if (formName.indexOf('eduExpForm') !== -1) {
              this.editResumeEducation(this.eduExpForm, id)
            } else if (formName.indexOf('workExpForm') !== -1) {
              this.editResumeExperience(this.workExpForm, id)
            } else if (formName.indexOf('projectExpForm') !== -1) {
              this.editResumeProject(this.projectExpForm, id)
            } else if (formName.indexOf('trainExpForm') !== -1) {
              this.editResumeTraining(this.trainExpForm, id)
            } else if (formName.indexOf('langPowerForm') !== -1) {
              this.editResumeLanguages(this.langPowerForm, id)
            } else if (formName.indexOf('certInfoForm') !== -1) {
              this.editResumeSkills(this.certInfoForm, id)
            }
            setTimeout(() => {
              this.editDisabled = false
              this.getResumeInfoById()
            }, 1000)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        // 一般默认表单校验
        this.$refs[formName].validate((valid, object) => {
          console.log(444, formName, object)
          if (valid) {
            if (formName === 'baseInfoForm') {
              this.editResumeDetail1(this[formName])
            } else if (formName === 'jobIntentForm') {
              this.editResumeDetail2(this[formName])
            } else if (formName === 'selfEvalForm') {
              this.editResumeDetail3(this[formName])
            } else if (formName === 'surplusInfoForm') {
              this.editResumeDetail4(this[formName])
            } else if (formName === 'trainExpForm') {
              this.addResumeTraining(this[formName])
            } else if (formName === 'certInfoForm') {
              this.addResumeSkills(this[formName])
            } else if (formName === 'eduExpForm') {
              this.addResumeEducation(this[formName])
            } else if (formName === 'workExpForm') {
              this.addResumeExperience(this[formName])
            } else if (formName === 'projectExpForm') {
              this.addResumeProject(this[formName])
            } else if (formName === 'langPowerForm') {
              this.addResumeLanguages(this[formName])
            } else if (formName === 'myProductForm') {
              this.addResumeOpus(this[formName])
            }
            setTimeout(() => {
              this.editDisabled = false
              this.getResumeInfoById()
            }, 1000)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // 删除指定校验
    deleteRules(val) {
      const num = val.formName[val.formName.length - 1] - 0
      if (isRealNum(num)) {
        // 循环ref表单校验删除（循环的表单类型是数组）
        delete this[val.formName.slice(0, -1) + 'Rules'][val.keyName]
        this.$refs[val.formName][0].clearValidate(val.keyName)
      } else {
        // 循环ref表单校验删除
        console.log(
          555,
          val.keyName,
          this[val.formName + 'Rules'][val.keyName][0].required
        )
        this[val.formName + 'Rules'][val.keyName][0].required = false
        // delete this[val.formName + 'Rules'][val.keyName]
        this.$refs[val.formName].clearValidate(val.keyName)
      }
    },
    // 移除简历
    removeResumenById() {
      const params = {
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      removeResumenById(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '移除成功',
            type: 'success'
          })
        }
      })
    },
    // //////////////////// 编辑
    // 基本信息（编辑）
    editResumeDetail1(values) {
      const params = values
      params.id = this.$route.query.id || sessionStorage.getItem('resumeId')
      params.name = values.name
      params.gender = values.gender - 0
      params.liveCity =
        this.selectedData.liveCity && this.selectedData.liveCity[0] - 0
      params.mobile = values.mobile
      params.birthday = values.birthday
      params.startWorkMonth = values.startWorkMonth
      params.currentCompanyName = values.currentCompanyName
      params.currentPosition = values.currentPosition
      params.graduateSchool = values.graduateSchool
      params.degreeCode = values.degreeCode - 0
      params.avatar = values.avatar
      params.avatarImg = this.avatarImg
      delete params.workMonth
      console.log('基本信息params', params)
      editResumeDetail(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('baseInfoForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.noticeLabel1 = false
        }
      })
    },
    // 求职意向（编辑）
    editResumeDetail2(values) {
      const { currentYearSalary } = this
      const params = values
      params.id = this.$route.query.id || sessionStorage.getItem('resumeId')
      params.jobStatus = values.jobStatus && values.jobStatus - 0
      params.currentSalary = values.currentSalary && values.currentSalary - 0
      params.currentSalaryMonth =
        values.currentSalaryMonth && values.currentSalaryMonth - 0
      params.currentSalaryTax =
        values.currentSalaryTax && values.currentSalaryTax - 0
      params.currentYearSalary =
        (currentYearSalary && currentYearSalary - 0) * 10000
      params.currentOtherSalary = values.currentOtherSalary
      params.intentionSalary =
        (values.intentionSalary && values.intentionSalary - 0) * 10000
      params.intentionSalaryTax =
        values.intentionSalaryTax && values.intentionSalaryTax - 0
      params.intentionIndustryId1 =
        this.selectedData.intentionIndustryId &&
        this.selectedData.intentionIndustryId[0] &&
        this.selectedData.intentionIndustryId[0].length === 3
          ? this.selectedData.intentionIndustryId &&
            this.selectedData.intentionIndustryId.join(',')
          : null
      params.intentionIndustryId2 =
        this.selectedData.intentionIndustryId &&
        this.selectedData.intentionIndustryId[0] &&
        this.selectedData.intentionIndustryId[0].length === 6
          ? this.selectedData.intentionIndustryId &&
            this.selectedData.intentionIndustryId.join(',')
          : null
      params.intentionPosition = values.intentionPosition
      params.intentionCity =
        this.selectedData.intentionCity &&
        this.selectedData.intentionCity.join(',')
      delete params.workMonth
      console.log('求职意向', params)
      editResumeDetail(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('jobIntentForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.noticeLabel2 = false
        }
      })
    },
    // 自我评价（编辑）
    editResumeDetail3(values) {
      const params = values
      params.id = this.$route.query.id || sessionStorage.getItem('resumeId')
      params.personal = values.personal
      delete params.workMonth
      console.log('自我评价', params)
      editResumeDetail(params).then(res => {
        this.cancelForm('selfEvalForm')
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 附加信息（编辑）
    editResumeDetail4(values) {
      const params = values
      params.id = this.$route.query.id || sessionStorage.getItem('resumeId')
      params.attachmentInformation = values.attachmentInformation
      delete params.workMonth
      console.log('附加信息', params)
      editResumeDetail(params).then(res => {
        this.cancelForm('surplusInfoForm')
        const { code } = res
        if (code === '000000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 教育经历（编辑）
    editResumeEducation(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.school = values.school
      params.speciality = values.speciality
      params.degreeCode = values.degreeCode - 0
      params.isUnifiedStrategy = values.isUnifiedStrategy - 0
      params.summary = values.summary
      console.log('教育经历', params)
      editResumeEducation(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('eduExpForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 工作经历（编辑）
    editResumeExperience(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.companyName = values.companyName
      // params.vocation = values.vocation
      params.industryId1 =
        this.selectedData.vocation &&
        this.selectedData.vocation[0] &&
        this.selectedData.vocation[0].length === 3
          ? this.selectedData.vocation.join(',')
          : null
      params.industryId2 =
        this.selectedData.vocation &&
        this.selectedData.vocation[0] &&
        this.selectedData.vocation[0].length === 6
          ? this.selectedData.vocation.join(',')
          : null
      params.companySize = values.companySize - 0
      params.companyType = values.companyType - 0
      params.companyIntroduce = values.companyIntroduce
      params.title = values.title
      params.department = values.department
      params.responsibleArea = values.responsibleArea
      params.isOverseas = values.isOverseas - 0
      params.leader = values.leader
      params.underlingNumber = values.underlingNumber - 0
      params.summary = values.summary
      params.achievement = values.achievement
      params.reasonOfLeaving = values.reasonOfLeaving
      console.log('工作经历', params)
      editResumeExperience(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('workExpForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 项目经验（编辑）
    editResumeProject(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.projectName = values.projectName
      params.companyName = values.companyName
      params.title = values.title
      params.projectDescription = values.projectDescription
      params.responsibilities = values.responsibilities
      params.projectAchievement = values.projectAchievement
      console.log('项目经验', params)
      editResumeProject(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('projectExpForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 培训经历（编辑）
    editResumeTraining(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.trainingCourse = values.trainingCourse
      params.trainingInstitution = values.trainingInstitution
      console.log('培训经历', params)
      editResumeTraining(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('trainExpForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 语言能力（编辑）
    editResumeLanguages(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.languages = values.languages
      params.listeningSpeakingSkills = values.listeningSpeakingSkills
      params.readingWritingSkills = values.readingWritingSkills
      params.level = values.level
      console.log('语言能力', params)
      editResumeLanguages(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('langPowerForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 证书信息（编辑）
    editResumeSkills(values, id) {
      const params = {}
      params.id = id
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.receivingDate = values.receivingDate
      params.nameOfCertificate = values.nameOfCertificate
      params.score = values.score
      console.log('证书信息', params)
      editResumeSkills(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('certInfoForm')
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // /////////////////////////////////////添加
    // 教育经历（添加）
    addResumeEducation(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.school = values.school
      params.speciality = values.speciality
      params.degreeCode = values.degreeCode
      params.isUnifiedStrategy = values.isUnifiedStrategy
      params.summary = values.summary
      console.log('教育经历', params)
      addResumeEducation(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('eduExpForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 工作经历（添加）
    addResumeExperience(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.companyName = values.companyName
      params.industryId1 =
        this.selectedData.vocation &&
        this.selectedData.vocation[0] &&
        this.selectedData.vocation[0].length === 3
          ? this.selectedData.vocation.join(',')
          : null
      params.industryId2 =
        this.selectedData.vocation &&
        this.selectedData.vocation[0] &&
        this.selectedData.vocation[0].length === 6
          ? this.selectedData.vocation.join(',')
          : null
      params.companySize = values.companySize - 0
      params.companyType = values.companyType - 0
      params.companyIntroduce = values.companyIntroduce
      params.title = values.title
      params.department = values.department
      params.responsibleArea = values.responsibleArea
      params.isOverseas = values.isOverseas - 0
      params.leader = values.leader
      params.underlingNumber = values.underlingNumber - 0
      params.summary = values.summary
      params.achievement = values.achievement
      params.reasonOfLeaving = values.reasonOfLeaving
      console.log('工作经历', params)
      addResumeExperience(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('workExpForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 项目经验（添加）
    addResumeProject(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.projectName = values.projectName
      params.companyName = values.companyName
      params.title = values.title
      params.projectDescription = values.projectDescription
      params.responsibilities = values.responsibilities
      params.projectAchievement = values.projectAchievement
      console.log('项目经验', params)
      addResumeProject(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('projectExpForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 培训经历（添加）
    addResumeTraining(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.startDate = values.startDate
      params.endDate = values.endDate
      params.trainingCourse = values.trainingCourse
      params.trainingInstitution = values.trainingInstitution
      console.log('培训经历', params)
      addResumeTraining(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('trainExpForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 语言能力（添加）
    addResumeLanguages(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.languages = values.languages
      params.listeningSpeakingSkills = values.listeningSpeakingSkills
      params.readingWritingSkills = values.readingWritingSkills
      params.level = values.level
      console.log('语言能力', params)
      addResumeLanguages(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('langPowerForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 证书信息（添加）
    addResumeSkills(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.receivingDate = values.receivingDate
      params.nameOfCertificate = values.nameOfCertificate
      params.score = values.score
      console.log('证书信息', params)
      addResumeSkills(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('certInfoForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 我的作品（添加）
    addResumeOpus(values) {
      const params = {}
      params.resumeId =
        this.$route.query.id || sessionStorage.getItem('resumeId')
      params.opusName = this.opusName
      params.opusUrl = this.opusUrl
      params.opuslink = values && values.opuslink
      console.log('我的作品', params)
      addResumeOpus(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.cancelForm('myProductForm')
          this.getResumeInfoById()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.opusName = null
          this.opusUrl = null
        }
      })
    },
    // ///////////////////////////删除
    // 教育经历（删除）
    deleteResumeEducationById(id) {
      const params = {
        resumeEducationId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeEducationById(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 工作经历（删除）
    deleteResumeExperience(id) {
      const params = {
        resumeExperienceId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeExperience(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 项目经验（删除）
    deleteResumeProject(id) {
      const params = {
        resumeProjectId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeProject(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 培训经历（删除）
    deleteResumeTraining(id) {
      const params = {
        resumeTrainingId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeTraining(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 语言能力（删除）
    deleteResumeLanguages(id) {
      const params = {
        resumeLanguagesId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeLanguages(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 证书信息（删除）
    deleteResumeSkills(id) {
      const params = {
        resumeCerInfoId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeSkills(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 我的作品（删除）
    deleteResumeOpus(id) {
      const params = {
        resumeOpusId: id,
        resumeId: this.$route.query.id || sessionStorage.getItem('resumeId')
      }
      deleteResumeOpus(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.editDisabled = false
          this.getResumeInfoById()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    beforeAvatarUpload(file) {
      this.paramsData.ossFileType = 'resumeInformation'
      return true
    },
    handleAvatarSuccess(res, file) {
      if (res.code === '000000') {
        this.opusName = res.data.fileName
        this.opusUrl = res.data.dbPath
        this.addResumeOpus()
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/resume/resumeDetail.scss';
</style>
