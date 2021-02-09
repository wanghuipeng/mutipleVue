<template>
  <div class="wrap">
    <!-- 沟通记录 -->
    <div v-if="renderInfo.recordFileUrl.length || renderInfo.recordPictureUrl.length" class="panel">
      <p class="panel-title">沟通记录</p>
      <div class="panel-body">
        <div class="communication-record">
          <div class="record-audio">
            <div v-for="(item, index) in renderInfo.recordFileUrl" :key="index" class="audio">
              <custom-audio :url="item" />
            </div>
          </div>
          <div class="record-people">
            <el-image
              v-for="(item, index) in renderInfo.recordPictureUrl"
              :key="index"
              class="avatar"
              :src="item"
              :preview-src-list="[item]"
            ></el-image>
          </div>
        </div>
      </div>
    </div>
    <!-- 职位福利 -->
    <div v-if="renderInfo.positionWelfare.length" class="panel">
      <p class="panel-title">职位福利</p>
      <div class="panel-body">
        <div class="welfare">
          <el-tag
            v-for="(item, index) in renderInfo.positionWelfare"
            :key="index"
            effect="dark"
          >{{ item | filterCommonDict(dictData.dicts.lightLabel) }}</el-tag>
        </div>
      </div>
    </div>
    <!-- 职位亮点 -->
    <div v-if="renderInfo.positionAdvantage" class="panel">
      <p class="panel-title">职位亮点</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.positionAdvantage }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 人选要求 -->
    <div class="panel">
      <p class="panel-title">人选要求</p>
      <div class="panel-body">
        <div class="table">
          <el-table
            class="data-table"
            :data="renderInfo.publicPositionRequirements"
            :span-method="mergeOtherSpan"
            size="medium"
            border
          >
            <el-table-column
              prop="name"
              label="人选画像"
              align="center"
              width="138"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="level1"
              label="必须"
              align="center"
              width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.level1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="level2"
              label="优先"
              align="center"
              width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.level2 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="level3"
              label="不考虑"
              align="center"
              width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.level3 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 岗位职责 -->
    <div v-if="renderInfo.positionDescription" class="panel">
      <p class="panel-title">岗位职责</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.positionDescription }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 任职要求 -->
    <div v-if="renderInfo.positionRequirement" class="panel">
      <p class="panel-title">任职要求</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li>
              <p class="content">{{ renderInfo.positionRequirement }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 招聘原因 -->
    <div v-if="renderInfo.developmentReason || renderInfo.explanationReasonsOpen || renderInfo.earliestAvailableDays" class="panel">
      <p class="panel-title">招聘原因</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li v-if="renderInfo.developmentReasonName">
              <span class="title">开放原因：</span>
              <p
                class="content"
              >{{ renderInfo.developmentReason | filterCommonDict(dictData.dicts.positionOpenReason) }}</p>
            </li>
            <li v-if="renderInfo.explanationReasonsOpen">
              <span class="title">开放说明：</span>
              <p class="content">{{ renderInfo.explanationReasonsOpen }}</p>
            </li>
            <li v-if="renderInfo.earliestAvailableDays">
              <span class="title">最快到岗：</span>
              <p class="content">{{ renderInfo.earliestAvailableDays }}天内</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 团队架构 -->
    <div v-if="renderInfo.responsibleAreaProduct || renderInfo.department || renderInfo.departmentsIntroduce || renderInfo.reportPeople" class="panel">
      <p class="panel-title">团队架构</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li v-if="renderInfo.responsibleAreaProduct">
              <span class="title">负责产品/项目/区域：</span>
              <p class="content">{{ renderInfo.responsibleAreaProduct }}</p>
            </li>
            <li v-if="renderInfo.department">
              <span class="title">所属部门：</span>
              <p class="content">{{ renderInfo.department }}</p>
            </li>
            <li v-if="renderInfo.departmentsIntroduce">
              <span class="title">部门介绍：</span>
              <p class="content">{{ renderInfo.departmentsIntroduce }}</p>
            </li>
            <li v-if="renderInfo.reportPeople">
              <span class="title">上级岗位&背景：</span>
              <p class="content">
                {{ renderInfo.reportPeople }}
                <span
                  v-if="renderInfo.reportPeopleDescription"
                >（{{ renderInfo.reportPeopleDescription }}）</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 薪资福利 -->
    <div v-if="renderInfo.monthlySalaryRegime || renderInfo.salaryStructure || renderInfo.otherSalaryStructure || renderInfo.socials || renderInfo.otherSocials || renderInfo.house || renderInfo.otherHouse || renderInfo.holiday || renderInfo.otherHoliday || renderInfo.communicationTraffic || renderInfo.otherCommunicationTraffic" class="panel">
      <p class="panel-title">薪资福利</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li v-if="renderInfo.monthlySalaryRegime">
              <span class="title">月薪制度：</span>
              <p class="content">{{ renderInfo.monthlySalaryRegime }}薪</p>
            </li>
            <li v-if="renderInfo.salaryStructure || renderInfo.otherSalaryStructure">
              <span class="title">薪资构成：</span>
              <p class="content">
                {{ renderInfo.salaryStructure | filterCommonDict(dictData.dicts.salaryStructure) }}
                <span
                  v-if="renderInfo.otherSalaryStructure"
                >
                  <span v-if="renderInfo.salaryStructure">（</span>
                  {{ renderInfo.otherSalaryStructure }}
                  <span v-if="renderInfo.salaryStructure">）</span>
                </span>
              </p>
            </li>
            <li v-if="renderInfo.socials || renderInfo.otherSocials">
              <span class="title">社保福利：</span>
              <p class="content">
                {{ renderInfo.socials | filterCommonDict(dictData.dicts.socialBenefits) }}
                <span
                  v-if="renderInfo.otherSocials"
                >
                  <span v-if="renderInfo.socials">（</span>
                  {{ renderInfo.otherSocials }}
                  <span v-if="renderInfo.socials">）</span>
                </span>
              </p>
            </li>
            <li v-if="renderInfo.house || renderInfo.otherHouse">
              <span class="title">住房福利：</span>
              <p class="content">
                {{ renderInfo.house | filterCommonDict(dictData.dicts.houseBenefits) }}
                <span
                  v-if="renderInfo.otherHouse"
                >
                  <span v-if="renderInfo.house">（</span>
                  {{ renderInfo.otherHouse }}
                  <span v-if="renderInfo.house">）</span>
                </span>
              </p>
            </li>
            <li v-if="renderInfo.holiday || renderInfo.otherHoliday">
              <span class="title">假期福利：</span>
              <p class="content">
                {{ renderInfo.holiday | filterCommonDict(dictData.dicts.holidayBenefits) }}
                <span
                  v-if="renderInfo.otherHoliday"
                >
                  <span v-if="renderInfo.holiday">（</span>
                  {{ renderInfo.otherHoliday }}
                  <span v-if="renderInfo.holiday">）</span>
                </span>
              </p>
            </li>
            <li v-if="renderInfo.communicationTraffic || renderInfo.otherCommunicationTraffic">
              <span class="title">通讯交通：</span>
              <p class="content">
                {{ renderInfo.communicationTraffic | filterCommonDict(dictData.dicts.communicationTraffic) }}
                <span
                  v-if="renderInfo.otherCommunicationTraffic"
                >
                  <span v-if="renderInfo.communicationTraffic">（</span>
                  {{ renderInfo.otherCommunicationTraffic }}
                  <span v-if="renderInfo.communicationTraffic">）</span>
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 面试流程 -->
    <div v-if="renderInfo.interviewInstructions.length || renderInfo.interviewProvinceId || renderInfo.interviewCityId || renderInfo.interviewAreaId || renderInfo.interviewDetailedAddress || renderInfo.interviewAnotherPlace" class="panel">
      <p class="panel-title">面试流程</p>
      <div class="panel-body">
        <div class="list">
          <ul>
            <li v-if="renderInfo.interviewInstructions.length">
              <span class="title">面试轮次：</span>
              <p class="content">{{ renderInfo.interviewInstructions.length }}次</p>
            </li>
            <li v-if="renderInfo.interviewInstructions.length">
              <span class="title">面试流程：</span>
              <p class="content">
                <span
                  v-for="(item, index) in renderInfo.interviewInstructions"
                  :key="index"
                  style="display:block;"
                >
                  {{ item.num }}
                  &gt;
                  {{ item.name }}
                  &gt;
                  {{ item.type | filterCommonDict(dictData.dicts.interviewType) }}
                </span>
              </p>
            </li>
            <li v-if="renderInfo.interviewProvinceId || renderInfo.interviewCityId || renderInfo.interviewAreaId || renderInfo.interviewDetailedAddress">
              <span class="title">面试地点：</span>
              <p
                class="content"
              >{{ renderInfo.interviewProvinceId | filterCommonDict(dictData.areas) }} {{ renderInfo.interviewCityId | filterLevel2(dictData.areas) }} {{ renderInfo.interviewAreaId | filterLevel3(dictData.areas) }} {{ renderInfo.interviewDetailedAddress }}</p>
            </li>
            <li v-if="renderInfo.interviewAnotherPlace">
              <span class="title">异地面试：</span>
              <p
                class="content"
              >{{ renderInfo.interviewAnotherPlace | filterCommonDict(dictData.dicts.interviewAnotherPlace) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filter from '@/utils/filters'
import customAudio from '@/components/common/customAudio'
export default {
  components: {
    customAudio
  },
  props: {
    // 职位信息
    positionInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的职位信息
    renderInfo() {
      const data = Object.assign({}, this.positionInfo)
      data.recordFileUrl = this.positionInfo.recordFileUrl || []
      data.recordPictureUrl = this.positionInfo.recordPictureUrl || []
      data.positionWelfare = this.positionInfo.positionWelfare ? this.positionInfo.positionWelfare.split(',') : []
      data.interviewInstructions = this.positionInfo.interviewInstructions
        ? JSON.parse(this.positionInfo.interviewInstructions)
        : []
      data.positionRequirements = [
        {
          key: 'ageRequired',
          name: '年龄'
        },
        {
          key: 'genderRequired',
          dictCode: 'gender',
          name: '性别'
        },
        {
          key: 'degreeRequired',
          dictCode: 'degreeRequired',
          name: '学历'
        },
        {
          key: 'universityRequired',
          dictCode: 'universityRequirements',
          name: '毕业院校'
        },
        {
          key: 'professionRequired',
          dictCode: 'professionRequired',
          name: '毕业专业'
        },
        {
          key: 'workYearRequired',
          name: '工作年限'
        },
        {
          key: 'industryRequired',
          dictCode: 'industry',
          name: '工作行业'
        },
        {
          key: 'targetCompanyRequired',
          dictCode: 'targetCompanyRequired',
          name: '目标公司'
        },
        {
          key: 'stabilityRequired',
          dictCode: 'stabilityType',
          name: '稳定性'
        },
        {
          key: 'languageRequired',
          dictCode: 'languageRequired',
          name: '语言能力'
        },
        {
          key: 'maritalStatusRequired',
          dictCode: 'maritalStatus',
          name: '婚姻状况'
        },
        {
          key: 'fertilityStatusRequired',
          dictCode: 'fertilityStatus',
          name: '生育状况'
        }
      ]
      if (
        this.positionInfo.positionRequirements &&
        this.positionInfo.positionRequirements.length
      ) {
        this.positionInfo.positionRequirements.forEach(resultItem => {
          if (resultItem.propertyWeight !== 0) {
            data.positionRequirements.forEach(requireItem => {
              if (resultItem.propertyKey === requireItem.key) {
                let value = ''
                if (
                  resultItem.propertyKey !== 'workYearRequired' &&
                  resultItem.propertyKey !== 'ageRequired'
                ) {
                  const str = resultItem.propertyValue
                  if (str) {
                    if (requireItem.dictCode === 'industry') {
                      value = filter.filterLevels2(
                        str,
                        this.dictData[requireItem.dictCode]
                      )
                    } else {
                      value = filter.filterCommonDict(
                        str,
                        this.dictData.dicts[requireItem.dictCode]
                      )
                    }
                  }
                } else {
                  if (resultItem.propertyKey === 'workYearRequired') {
                    if (
                      resultItem.propertyValueMin &&
                      resultItem.propertyValueMax
                    ) {
                      value =
                        resultItem.propertyValueMin +
                        '~' +
                        resultItem.propertyValueMax +
                        '年'
                    } else if (resultItem.propertyValueMin) {
                      value = resultItem.propertyValueMin + '年以上'
                    } else if (resultItem.propertyValueMax) {
                      value = resultItem.propertyValueMax + '年以下'
                    }
                  }
                  if (resultItem.propertyKey === 'ageRequired') {
                    if (
                      resultItem.propertyValueMin &&
                      resultItem.propertyValueMax
                    ) {
                      value =
                        resultItem.propertyValueMin +
                        '~' +
                        resultItem.propertyValueMax +
                        '周岁'
                    } else if (resultItem.propertyValueMin) {
                      value = resultItem.propertyValueMin + '岁以上'
                    } else if (resultItem.propertyValueMax) {
                      value = resultItem.propertyValueMax + '岁以下'
                    }
                  }
                }
                if (resultItem.propertyWeight === 1) {
                  requireItem.level1 = value
                }
                if (resultItem.propertyWeight === 2) {
                  requireItem.level2 = value
                }
                if (resultItem.propertyWeight === 3) {
                  requireItem.level3 = value
                }
              }
            })
          }
        })
      }
      data.publicPositionRequirements = data.positionRequirements.splice(0, 10)
      data.privatePositionRequirements = data.positionRequirements
      data.publicPositionRequirements.push({
        name: '其他',
        level1: data.otherInstructions
      })
      // 对3个等级都没有值的行不展示处理
      data.publicPositionRequirements = data.publicPositionRequirements.filter(
        item => {
          if (item.level1 || item.level2 || item.level3) {
            return item
          }
        }
      )
      return data
    }
  },
  mounted() {},
  methods: {
    // 合并表格其他行的列
    mergeOtherSpan({ row, column, rowIndex, columnIndex }) {
      if (row.name === '其他') {
        if (columnIndex === 1) {
          return [1, 3]
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .panel {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .panel-title {
      font-size: 15px;
      color: #191919ff;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .panel-body {
      .communication-record {
        .record-audio {
          margin-bottom: 20px;
          .audio {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .record-people {
          display: flex;
          flex-wrap: wrap;
          .avatar {
            display: block;
            width: 80px;
            height: 80px;
            margin: 0 20px 20px 0;
            border-radius: 5px;
            img {
              object-fit: cover;
            }
          }
        }
      }
      .list {
        line-height: 20px;
        font-size: 14px;
        color: #4d4d4dff;
        li {
          display: flex;
          .title {
            flex: none;
          }
          .content {
            white-space: pre-wrap;
            flex: auto;
          }
        }
      }
      .table {
        .data-table {
          width: 800px;
          border: 1px solid #ccc;
          ::v-deep .el-table__header-wrapper,
          ::v-deep .el-table__fixed-right {
            .el-table__header {
              th {
                padding: 8px 0;
                font-size: 14px;
                color: #191919ff;
                background-color: #f3f3f3ff;
                &:nth-child(2),
                &:nth-child(3) {
                  color: $red-color;
                }
                &.is-leaf {
                  border-color: #ccc;
                }
              }
            }
          }
          ::v-deep .el-table__body-wrapper {
            overflow: hidden;
            .el-table__body {
              td {
                padding: 8px 0;
                font-size: 14px;
                color: #4d4d4dff;
                border-color: #ccc;
                &:nth-child(1) {
                  color: #191919ff;
                  font-weight: bold;
                }
              }
            }
            .el-table__empty-block {
              height: auto !important;
            }
          }
        }
      }
      .welfare{
        .el-tag {
          border: none;
          height: 28px;
          line-height: 26px;
          margin-right: 20px;
          border-radius: 14px;
          background: transparent;
          border: 1px solid #666666;
          color: #666666;
        }
      }
    }
  }
}
</style>

