<template>
  <div class="wrap">
    <div class="main">
      <div class="panel" style="width: 1200px;">
        <div class="panel-body">
          <div class="body-main">
            <div class="main-title">
              <p class="title-name">企业认证</p>
              <p class="title-sub">根据国家相关规定的要求，您需要进行企业信息认证，认证完成后即可正常发布职位</p>
            </div>
            <div class="main-content">
              <div class="content-step">
                <div class="step-item active">
                  <span class="item-num">①</span> 填写认证资料
                </div>
                <div class="step-item">
                  <span class="item-num">②</span> 认证审核
                </div>
                <div class="step-item">
                  <span class="item-num">③</span> 完成认证
                </div>
              </div>
              <el-form
                ref="submitForm"
                class="submit-form white-form"
                :model="submitForm"
                :rules="submitFormRules"
                label-width="150"
              >
                <el-form-item prop="companyName" label="企业全称：" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.companyName"
                    placeholder="请输入与营业执照一直的企业名称"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="socialCreditCode" label="统一社会信用代码：" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.socialCreditCode"
                    placeholder="请输入与您的企业统一社会信用代码"
                    autocomplete="off"
                    clearable
                    :maxlength="18"
                  />
                </el-form-item>
                <!-- <el-form-item prop="legalPersonName" label="法人姓名：" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.legalPersonName"
                    placeholder="请输入法人姓名"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="legalPersonIdCardNo" label="法人身份证：" style="margin-bottom: 25px;">
                  <el-input
                    v-model="submitForm.legalPersonIdCardNo"
                    placeholder="请输入法人身份证号"
                    autocomplete="off"
                    clearable
                  />
                </el-form-item> -->
                <el-form-item prop="businessLicenseImage" label="营业执照：" style="margin-bottom: 25px;">
                  <el-upload
                    class="pic-uploader"
                    action="/api/common/upload"
                    :data="{ossFileType: 'certification'}"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                  >
                    <p class="uploader-control">
                      <img
                        v-if="submitForm.businessLicenseImageUrl"
                        :src="submitForm.businessLicenseImageUrl"
                        style="display: block;width: 100%;height: 100%;"
                      >
                      <i
                        v-else
                        class="icon iconfont icon-jiahao"
                        style="font-size: 48px;color: #d9d9d9;"
                      />
                    </p>
                    <div class="uploader-eg">
                      <img src="@/assets/images/login/certification-eg.png" class="eg-img" />
                      <div class="eg-content">
                        <p class="content-title">上传示例</p>
                        <p class="content-text">1. 国徽、二维码、公章需完整，不能有缺失部分</p>
                        <p class="content-text">2. 营业执照无水印</p>
                        <p class="content-text">3. 清晰原件数码照，拒绝扫描件、悬挂件</p>
                        <p class="content-text">4. 复印件需加盖公司红章</p>
                        <p class="content-text">5. 营业执照四周边框需完整，不折叠、不反光、文字清晰可见</p>
                        <p class="content-text">6. 请提供含同意社会信用代码的新版执照</p>
                        <p class="content-text">7. 请核对匹配信息是否准确</p>
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="$store.state.nextLoading"
                    @click="certification"
                  >提交认证</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyApplyCertification } from '@/api/login'
export default {
  data() {
    return {
      // 提交表单
      submitForm: {
        companyName: '',
        socialCreditCode: '',
        legalPersonName: '',
        legalPersonIdCardNo: '',
        businessLicenseImage: '',
        businessLicenseImageUrl: ''
      },
      // 提交表单校验规则
      submitFormRules: {
        companyName: [
          { required: true, message: '请输入与营业执照一直的企业名称', trigger: 'blur' }
        ],
        socialCreditCode: [
          { required: true, message: '请输入与您的企业统一社会信用代码', trigger: 'blur' }
        ],
        legalPersonName: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' }
        ],
        legalPersonIdCardNo: [
          { required: true, message: '请输入法人身份证号', trigger: 'blur' },
          { validator: this.$verify.idNumFormat, trigger: 'blur' }
        ],
        businessLicenseImage: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ]
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
    document.title = '企业认证-大猎英才'
  },
  methods: {
    // 上传前处理
    beforeUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message({
          message: '只能上传jpg/png格式',
          type: 'error',
          showClose: true,
          center: true
        });
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message({
          message: '图片大小不能超过2M',
          type: 'error',
          showClose: true,
          center: true
        });
        return false;
      }
      return true;
    },
    // 上传成功处理
    uploadSuccess(res, file) {
      if (res.code === '000000') {
        this.submitForm.businessLicenseImage = res.data.dbPath
        this.submitForm.businessLicenseImageUrl = res.data.webPath
        this.submitForm = Object.assign({}, this.submitForm);
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
          showClose: true,
          center: true
        })
      }
    },
    // 上传失败处理
    uploadError(res, file) {
      this.$message({
        message: res.data.message,
        type: 'error',
        showClose: true,
        center: true
      });
    },
    // 提交认证
    certification() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('dispatchUpdateNextLoading', true)
          const para = Object.assign({}, this.submitForm)
          companyApplyCertification(para).then(res => {
            const userInfo = this.$store.state.userInfo
            userInfo.companyCertificationStatus = 2
            this.$store.dispatch('dispatchUpdateUserInfo', userInfo)
            this.$router.push('/')
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/login/common.scss';
.body-main{
  width: 100%;
  .main-title{
    padding: 20px 20px 12px;
    border: 1px solid #CDCDCD;
    .title-name{
      font-size: 18px;
      color: #14171A;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .title-sub{
      font-size: 12px;
      color: #999999;
    }
  }
  .main-content{
    padding: 40px 250px;
    .content-step{
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 40px;
      &:after{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #999999;
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1;
      }
      .step-item{
        padding: 0 10px;
        font-size: 14px;
        color: #999999;
        background-color: #fff;
        position: relative;
        z-index: 9;
        &.active{
          color: $main-color;
        }
        .item-num{
          font-size: 16px;
        }
      }
    }
    .pic-uploader{
      ::v-deep .el-upload{
        display: flex;
      }
      .uploader-control{
        width: 96px;
        height: 137px;
        line-height: 137px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        margin-right: 15px;
        &:hover {
          border-color: #409eff;
        }
      }
      .uploader-eg{
        display: flex;
        .eg-img{
          display: block;
          width: 96px;
          height: 137px;
          margin-right: 15px;
        }
        .eg-content{
          text-align: left;
          line-height: 18px;
          .content-title{
            font-size: 12px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 8px;
          }
          .content-text{
            font-size: 12px;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>

