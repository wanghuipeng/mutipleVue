<template>
  <div class="edit edit-promotion">
    <div class="header">
      <p class="title1">您可以在系统直接添加促销员信息</p>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="105px"
      class="ruleForm"
    >
      <el-form-item label="姓名" prop="userName" size="small">
        <el-input
          v-model="ruleForm.userName"
          :disabled="$props.flag === 'detail'"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="userMobile" size="small">
        <el-input v-model="ruleForm.userMobile" :disabled="$props.flag === 'edit'" placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender" size="small">
        <el-select
          v-model="ruleForm.gender"
          :disabled="$props.flag === 'detail'"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <el-option
            v-for="item in genderArr"
            :key="item.value"
            :label="item.label"
            :value="item.value - 0"
          />
        </el-select>
      </el-form-item>
      <el-row class="two-row">
        <el-col >
          <el-form-item label="地区" prop="areas" size="small">
            <el-cascader
              v-model="ruleForm.areas"
              :disabled="$props.flag === 'detail'"
              placeholder="请选择地区"
              :options="areas"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="学历" prop="degreeCode" size="small">
        <el-select
          v-model="ruleForm.degreeCode"
          :disabled="$props.flag === 'detail'"
          placeholder="请选择学历"
          style="width: 100%"
        >
          <el-option
            v-for="item in dictData.dicts.advancedDegree"
            :key="item.value"
            :label="item.label"
            :value="item.value - 0"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="national" size="small">
        <el-select
          v-model="ruleForm.national"
          :disabled="$props.flag === 'detail'"
          placeholder="请选择民族"
          style="width: 100%"
        >
          <el-option
            v-for="item in dictData.dicts.userNational"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday" size="small">
        <el-date-picker
          v-model="ruleForm.birthday"
          :disabled="$props.flag === 'detail'"
          value-format="yyyy-MM"
          type="month"
          style="width: 100%"
          placeholder="设置出生年月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开始工作年份" prop="startWorkMonth" size="small">
        <el-date-picker
          v-model="ruleForm.startWorkMonth"
          :disabled="$props.flag === 'detail'"
          value-format="yyyy"
          style="width: 100%"
          type="year"
          placeholder="请设置开始工作年份"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="身份" prop="identityTags" size="small">
        <el-select
          v-model="ruleForm.identityTags"
          :disabled="$props.flag === 'detail'"
          placeholder="请设置人员身份"
          style="width: 100%"
        >
          <el-option
            v-for="item in dictData.dicts.promoterUserIdentityTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="$props.flag !== 'detail'">
        <el-button
          class="mt-20"
          type="primary"
          size="small"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-tabs v-model="activeName" size="small" class="mtv-15" @tab-click="handleTab">
      <el-tab-pane name="handCreate">
        <span slot="label">
          手动创建
        </span>
        <template v-if="activeName === 'handCreate'">
          <div class="header">
            <p class="title1">您可以在系统直接添加促销员信息</p>
          </div>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="105px"
            class="ruleForm"
          >
            <el-form-item label="姓名" prop="userName" size="small">
              <el-input
                v-model="ruleForm.userName"
                :disabled="$props.flag === 'detail'"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="userMobile" size="small">
              <el-input v-model="ruleForm.userMobile" :disabled="$props.flag === 'edit'" placeholder="请输入手机号" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender" size="small">
              <el-select
                v-model="ruleForm.gender"
                :disabled="$props.flag === 'detail'"
                placeholder="请选择性别"
                style="width: 100%"
              >
                <el-option
                  v-for="item in genderArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value - 0"
                />
              </el-select>
            </el-form-item>
            <el-row class="two-row">
              <el-col >
                <el-form-item label="地区" prop="areas" size="small">
                  <el-cascader
                    v-model="ruleForm.areas"
                    :disabled="$props.flag === 'detail'"
                    placeholder="请选择地区"
                    :options="areas"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="学历" prop="degreeCode" size="small">
              <el-select
                v-model="ruleForm.degreeCode"
                :disabled="$props.flag === 'detail'"
                placeholder="请选择学历"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictData.dicts.degreeRequired"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value - 0"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="national" size="small">
              <el-select
                v-model="ruleForm.national"
                :disabled="$props.flag === 'detail'"
                placeholder="请选择民族"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictData.dicts.userNational"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出生年月" prop="birthday" size="small">
              <el-date-picker
                v-model="ruleForm.birthday"
                :disabled="$props.flag === 'detail'"
                value-format="yyyy-MM"
                type="month"
                style="width: 100%"
                placeholder="选择月"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开始工作年份" prop="startWorkMonth" size="small">
              <el-date-picker
                v-model="ruleForm.startWorkMonth"
                :disabled="$props.flag === 'detail'"
                value-format="yyyy"
                style="width: 100%"
                type="year"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="身份" prop="identityTags" size="small">
              <el-select
                v-model="ruleForm.identityTags"
                :disabled="$props.flag === 'detail'"
                placeholder="请选择公司规模"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictData.dicts.promoterUserIdentityTags"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="$props.flag !== 'detail'">
              <el-button
                class="mt-20"
                type="primary"
                size="small"
                :loading="loading"
                @click="submitForm('ruleForm')"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </template>

      </el-tab-pane>
      <el-tab-pane v-if="$props.flag !== 'edit' && $props.flag !== 'detail'" name="batchImport">
        <span slot="label">
          手动导入
        </span>
        <template v-if="activeName === 'batchImport'">
          <import-component from-flag="promoter" @reload="closeDrawer" />
        </template>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { savePromoterUser, getByPromoterUserId } from '@/api/promoter/projectApi';
import { searchCompanyPage } from '@/api/company';

export default {
  components: {
  },
  props: {
    flag: {
      type: String,
      default: ''
    },
    promoterUserId: {
      type: String,
      default: ''
    },
    slotPage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      genderArr: [{
        value: '1',
        label: '男'
      },
      {
        value: '2',
        label: '女'
      }],
      activeName: 'handCreate',
      userIdsArr: [],
      loading: false,
      areas: [], // 地区
      ruleForm: {},
      companyImgs: [],
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        userMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      days: [],
      localArr: [
        {
          label: '100M',
          value: '100'
        },
        {
          label: '200M',
          value: '200'
        },
        {
          label: '300M',
          value: '300'
        },
        {
          label: '400M',
          value: '400'
        },
        {
          label: '500M',
          value: '500'
        }
      ],
      startTime: '',
      endTime: '',
      companyArr: []
    };
  },
  computed: {
    ...mapState({
      dictData: (state) => state.common.dictData,
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas;
      this.areas.map((item) => {
        item.children &&
          item.children.map((x) => {
            x.children &&
              x.children.map((y) => {
                delete y.children;
              });
          });
      });
    }
  },
  created() {
    // 修改限制
    this.days = [];
    for (let i = 1; i < 31; i++) {
      this.days.push(i);
    }

    // 客户列表
    this.searchCompanyPage();
    const areas = JSON.parse(JSON.stringify(this.dictData.areas))
      areas.map((item) => {
        item.children &&
          item.children.map((x) => {
            x.children &&
              x.children.map((y) => {
                delete y.children;
              });
          });
      });
      this.areas = areas
    if (this.$props.promoterUserId) {
      this.getByPromoterUserId()
    }
  },
  mounted() {},
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer', {});
      this.$emit('reload');
    },
    handleTab(e) {
      console.log(e)
      this.activeName = e.name
      console.log(e.name)
    },
    // 查询客户列表
    searchCompanyPage() {
      const para = {};
      para.pageNumber = 1;
      para.pageSize = 999;
      let api = null;
      api = searchCompanyPage;
      api(para).then((res) => {
        this.companyArr = res.data.records;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', true); // 发布职位method
          this.loading = true;
          this.savePromoterUser();
        } else {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', false); // 发布职位method
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 新增企业
    savePromoterUser() {
      const params = this.ruleForm;
      const areas = params.areas
      params.provinceCode = areas && areas[0]
      params.cityCode = areas && areas[1]
      params.areaCode = areas && areas[2]
      let birthday = ''
      let startWorkMonth = ''
      if (params.birthday) {
         birthday = params.birthday + '-01'
      }
      params.birthday = birthday
      if (params.startWorkMonth) {
         startWorkMonth = params.startWorkMonth + '-01'
      }
      params.startWorkMonth = startWorkMonth
      delete params.areas
      console.log('参数', params);
      savePromoterUser(params).then((res) => {
        this.loading = false;
        if (res.code === '000000') {
          this.$message.success('保存成功');
          this.$emit('closeDrawer', res.data);
          this.$emit('reload');
        }
      });
    },
    getByPromoterUserId() {
      const params = {
         promoterUserId: this.$props.promoterUserId
      }
      getByPromoterUserId(params).then((res) => {
        this.loading = false;
        if (res.code === '000000') {
          this.ruleForm = res.data
          if (res.data.provinceCode && res.data.cityCode && res.data.areaCode) {
            //  const areas = JSON.parse(JSON.stringify(this.dictData.areas))
            //  console.log(222222222222, areas)
            //  areas.map((item) => {
            //     item.children &&
            //       item.children.map((x) => {
            //         x.children &&
            //           x.children.map((y) => {
            //             delete y.children;
            //           });
            //       });
            //   });
            //   this.areas = areas
             this.ruleForm.areas = [res.data.provinceCode + '', res.data.cityCode + '', res.data.areaCode + '']
          } else if (res.data.provinceCode && res.data.cityCode) {
            const areas = JSON.parse(JSON.stringify(this.dictData.areas))
             areas.map((item) => {
                item.children &&
                  item.children.map((x) => {
                    delete x.children
                  });
              });
              this.areas = areas
             this.ruleForm.areas = [res.data.provinceCode + '', res.data.cityCode + '']
          } else if (res.data.provinceCode) {
            const areas = JSON.parse(JSON.stringify(this.dictData.areas))
            areas.map((item) => {
                delete item.children
              });
              this.areas = areas
             this.ruleForm.areas = [res.data.provinceCode + '']
          }
          if (res.data.degreeCode) {
            this.ruleForm.degreeCode = res.data.degreeCode
          } else {
            this.ruleForm.degreeCode = ''
          }
        console.log('11111111地址', this.ruleForm.areas, this.areas)
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.ruleForm.shortName = null;
      this.ruleForm.replaceName = null;
      this.ruleForm.areas = [];
      this.ruleForm.address = null;
      this.ruleForm.scale = null;
      this.ruleForm.industry = null;
      this.ruleForm.style = null;
      this.ruleForm.logo = null;
      this.ruleForm.logoWeb = null;
      this.ruleForm.introduce = null;
      this.ruleForm.fileList = [];
      this.ruleForm.companyPictures = [];
      this.ruleForm.companyVideo = null;
      this.ruleForm.companyVideoWeb = null;
      this.ruleForm.companyWxMp = null;
      this.ruleForm.website = null;
      this.ruleForm.companyWxQr = null;
      this.ruleForm.companyWxQrUrl = null;
      this.ruleForm.companyWzLogo = null;
      this.ruleForm.companyWzLogoUrl = null;
      this.ruleForm.companyWzFirstLogo = null;
      this.ruleForm.companyWzFirstLogoUrl = null;
    }

  }
};
</script>

<style lang="scss" >
.edit-promotion{
  .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        font-size: 14px;
    }
  .download-text{
    font-size: 14px;
    margin-bottom: 15px;
    .el-link{
      margin-left: 5px;
      vertical-align: 0px;
    }
  }

.rule-form {
  .el-input,
  .el-select {
    margin: 0 5px;
  }
}
&.edit {
  padding: 16px;
  .el-radio-group {
    vertical-align: middle;
    height: 32px;
    line-height: 32px;
    .el-radio {
      height: 32px;
      line-height: 32px;
    }
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #14171a;
      line-height: 22px;
    }
  }
  .ruleForm {
    .title1 {
      font-size: 14px;
      color: #333;
      margin: 15px 0 20px;
    }
    ::v-deep .el-form-item__content {
      position: relative;
      .desc {
        font-size: 13px;
        position: absolute;
        left: 160px;
        bottom: 0;
      }
    }
  }
  .avatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: contain;
  }
}
.release-position-page {
  // 兼容发布职位页样式
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 30px 20px 0 20px;
  box-sizing: border-box;
  width: 695px;
  margin-left: -20px;
  margin-bottom: 30px;
  &.edit {
    .el-textarea {
      input {
        width: 315px !important;
      }
    }
    .el-input,
    .el-select,
    .el-cascader {
      width: 315px !important;
    }
    ::v-deep .el-input,
    .el-textarea {
      input {
        width: 315px !important;
      }
      width: 315px !important;
    }
    ::v-deep .el-form-item__label {
      width: 110px !important;
    }
    .two-row {
      .el-col-10 {
        width: 100%;
        float: inherit;
        ::v-deep el-form-item__content {
          margin-left: 0;
        }
        .el-form-item {
          margin-bottom: 15px;
        }
      }
      .el-col-14 {
        float: inherit;
        width: 315px;
        margin-left: 102px;
      }
    }
    .desc {
      left: 180px !important;
    }
    ::v-deep .el-upload__tip {
      margin-left: 20px;
    }
  }
}
}

</style>
