<template>
  <div
    class="edit"
    :style="{padding: '16px'}"
  >
    <div class="header">
      <p class="title">添加客户信息</p>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="slotPage === 'releasePositionPage' ? '90px' : '145px'"
      class="ruleForm"
    >
      <!-- 企业基本信息 -->
      <p class="title1">企业基本信息</p>
      <el-form-item label="公司名称" prop="name" size="small">
        <el-input v-model="ruleForm.name" :disabled="operatorType === 'edit'"></el-input>
      </el-form-item>
      <el-form-item label="对外名称" prop="replaceName" size="small">
        <el-input v-model="ruleForm.replaceName"></el-input>
      </el-form-item>
      <el-form-item label="公司规模" prop="scale" size="small">
        <el-select v-model="ruleForm.scale" placeholder="请选择公司规模" style="width: 100%;">
          <el-option
            v-for="item in dictData.dicts.enterpriseScale"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司行业" prop="industry" size="small">
        <el-select v-model="ruleForm.industry" placeholder="请选择公司行业" style="width: 100%;">
          <el-option
            v-for="item in dictData.industry"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司性质" prop="style" size="small">
        <el-select v-model="ruleForm.style" placeholder="请选择公司性质" style="width: 100%;">
          <el-option
            v-for="item in dictData.dicts.enterpriseProperty"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-row class="two-row">
        <el-col :span="slotPage === 'releasePositionPage' ? 10 : 12">
          <el-form-item label="公司地址" prop="areas" size="small">
            <el-cascader v-model="ruleForm.areas" :options="areas" clearable style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="slotPage === 'releasePositionPage' ? 14 : 12">
          <el-form-item prop="address" size="small" label-width="10px">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公司介绍" prop="introduce" size="small">
        <el-input
          v-model="ruleForm.introduce"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          maxlength="2000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="公司LOGO" prop="logoWeb" size="small">
        <el-upload
          v-loading="uploadLoading"
          class="avatar-uploader"
          :data="paramsData"
          :action="uploadAction"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="ruleForm.logoWeb" :src="ruleForm.logoWeb" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="desc">请上传长宽1:1比例的图片</p>
      </el-form-item>
      <!-- 联系信息 -->
      <p class="title1">联系信息</p>
      <el-form-item label="联系人" prop="contactUserName" size="small">
        <el-input v-model="ruleForm.contactUserName" :disabled="operatorType === 'edit'"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactUserMobile" size="small">
        <el-input v-model="ruleForm.contactUserMobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="contactUserEmail" size="small">
        <el-input v-model="ruleForm.contactUserEmail"></el-input>
      </el-form-item>
      <!-- 合作信息 -->
      <p class="title1">合作信息</p>
      <el-form-item label="合作状态" prop="customerCooperationStatus" size="small">
        <el-radio-group v-model="ruleForm.customerCooperationStatus">
          <el-radio v-for="(item,index) in dictData.dicts.customerCooperationStatus" :key="index" :label="item.value - 0">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户负责人" prop="customerPmId" size="small">
        <el-select v-model="ruleForm.customerPmId" placeholder="请选择客户负责人" style="width: 100%;">
          <el-option
            v-for="item in userIdsArr"
            :key="item.value"
            :label="item.trueName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" size="small" :loading="loading" class="mt-20" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { getCompanyDetail, editCompany, addCompany } from '@/api/company'
import {
  findMemberVOList
} from '@/api/releasePosition'

export default {
  props: {
    operatorType: {
      type: String,
      default: ''
    },
    backTo: {
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
      uploadLoading: false,
      userIdsArr: [],
      loading: false,
      paramsData: {},
      uploadAction: '/api/common/upload',
      uploadHeader: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      limit: 9,
      companyParamsData: {},
      videoParamsData: {},
      uploadCompanyImgsAction: '/api/company/upload',
      areas: [], // 地区
      ruleForm: {
        customerCooperationStatus: 2,
        name: '',
        shortName: '',
        replaceName: '',
        areas: [],
        address: '',
        scale: '',
        industry: '',
        style: '',
        logo: '',
        logoWeb: '',
        introduce: '',
        fileList: [],
        companyPictures: [],
        companyVideo: '',
        companyVideoWeb: '',
        companyWxMp: '',
        website: '',
        companyWxQr: '',
        companyWxQrUrl: '',
        companyWzLogo: '',
        companyWzLogoUrl: '',
        companyWzFirstLogo: '',
        companyWzFirstLogoUrl: '',
        companyWzMpQr: '',
        companyWzMpQrUrl: '',
        customerPmId: ''
      },
      companyImgs: [],
      rules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        shortName: [
          { required: true, message: '请输入公司简称', trigger: 'blur' }
        ],
        replaceName: [
          { required: true, message: '请输入对外名称', trigger: 'blur' }
        ],
        areas: [
          { required: true, message: '请选择公司地址', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入公司详细地址', trigger: 'blur' }
        ],
        scale: [
          { required: true, message: '请选择公司规模', trigger: 'change' }
        ],
        industry: [
          { required: true, message: '请选择公司行业', trigger: 'change' }
        ],
        style: [
          { required: true, message: '请选择公司性质', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入公司介绍', trigger: 'blur' }
        ],
        logoWeb: [{ required: false, message: '请上传公司LOGO' }],
        contactUserName: [{ required: true, message: '请输入联系人姓名' }],
        contactUserMobile: [{ required: true, message: '请输入联系人电话' }],
        customerCooperationStatus: [{ required: true, message: '请选择合作状态' }]
      },
      companyId: ''
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas
      this.areas.map(item => {
        item.children &&
          item.children.map(x => {
            x.children &&
              x.children.map(y => {
                delete y.children
              })
          })
      })
    }
  },
  created() {
    this.areas = this.dictData.areas
    this.areas.map(item => {
      item.children &&
        item.children.map(x => {
          x.children &&
            x.children.map(y => {
              delete y.children
            })
        })
    })
    this.$set(this.ruleForm, 'customerPmId', this.userInfo.userId)
  },
  mounted() {
    this.findMemberVOList()
  },
  methods: {
    findMemberVOList() {
      const params = {
        searchName: this.userIdSearchName
      }
      findMemberVOList(params).then((res) => {
        const { code, data } = res
        if (code === '000000') {
          const arr = []
          data &&
            data.filter((item) => {
              item.memberDTOs &&
                item.memberDTOs.filter((itemInner) => {
                  arr.push({
                    value: itemInner.id,
                    gender: itemInner.gender,
                    visitAvatarUrl: itemInner.visitAvatarUrl,
                    label: itemInner.nickName,
                    trueName: itemInner.trueName
                  })
                })
            })
          this.userIdsArr = arr
        }
      })
    },
    // 预览视频
    viewVideo() {
      this.$refs.modalView.edit(this.ruleForm.companyVideoWeb)
    },
    // 公司详情
    getDetail() {
      const params = {
        companyId: this.companyId
      }
      this.companyId && getCompanyDetail(params).then(res => {
        this.ruleForm.name = res.data.company.name
        this.ruleForm.shortName = res.data.company.shortName
        this.ruleForm.replaceName = res.data.company.replaceName
        this.ruleForm.areas =
          res.data.company.provinceId &&
          res.data.company.cityId &&
          res.data.company.areaId
            ? [
                res.data.company.provinceId,
                res.data.company.cityId,
                res.data.company.areaId
              ]
            : []
        this.ruleForm.address = res.data.company.address
        this.ruleForm.scale =
          res.data.company.scale && res.data.company.scale + ''
        this.ruleForm.industry =
          res.data.company.industrys1 && res.data.company.industrys1 + ''
        this.ruleForm.style =
          res.data.company.style && res.data.company.style + ''
        this.ruleForm.logo = res.data.company.logo
        this.ruleForm.logoWeb = res.data.logoImg
        this.ruleForm.introduce = res.data.introduce || ''
        res.data.companyPictureImgs &&
          res.data.companyPictureImgs.forEach((item, i) => {
            this.ruleForm.fileList.push({ url: item })
            res.data.companyPictures &&
              res.data.companyPictures.forEach((items, j) => {
                if (i === j) {
                  this.companyImgs.push({
                    url: item,
                    companyPicture: items.companyPicture
                  })
                }
              })
          })
        this.ruleForm.companyVideo = res.data.companyVideo
        this.ruleForm.companyVideoWeb = res.data.companyVideoUrl
        this.ruleForm.companyWxMp = res.data.companyWxMp
        this.ruleForm.website = res.data.company.website
        this.ruleForm.companyWxQr = res.data.companyWxQr
        this.ruleForm.companyWxQrUrl = res.data.companyWxQrUrl
        this.ruleForm.companyWzLogo = res.data.companyWzLogo
        this.ruleForm.companyWzLogoUrl = res.data.companyWzLogoUrl
        this.ruleForm.companyWzFirstLogo = res.data.companyWzFirstLogo
        this.ruleForm.companyWzFirstLogoUrl = res.data.companyWzFirstLogoUrl
        this.ruleForm.companyWzMpQr = res.data.companyWzMpQr
        this.ruleForm.companyWzMpQrUrl = res.data.companyWzMpQrUrl
        console.log(this.ruleForm)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', true) // 发布职位method
          this.loading = true
          this.addCompany()
        } else {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', false) // 发布职位method
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑企业
    editCompany() {
      const companyImgs = this.companyImgs
      this.ruleForm.companyPictures = []
      companyImgs.forEach(item => {
        if (item.response) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.response.data[0].dbPath
          })
        } else if (item.companyPicture) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.companyPicture
          })
        }
      })
      console.log(companyImgs, this.ruleForm.companyPictures)
      const params = {
        id: this.companyId,
        name: this.ruleForm.name,
        shortName: this.ruleForm.shortName,
        replaceName: this.ruleForm.replaceName,
        provinceId: this.ruleForm.areas[0],
        cityId: this.ruleForm.areas[1],
        areaId: this.ruleForm.areas[2],
        address: this.ruleForm.address,
        scale: this.ruleForm.scale,
        industrys1: this.ruleForm.industry,
        style: this.ruleForm.style,
        logo: this.ruleForm.logo,
        introduce: this.ruleForm.introduce,
        companyPictures: this.ruleForm.companyPictures,
        companyVideo: this.ruleForm.companyVideo,
        companyWxMp: this.ruleForm.companyWxMp,
        website: this.ruleForm.website,
        companyWxQr: this.ruleForm.companyWxQr,
        companyWzLogo: this.ruleForm.companyWzLogo,
        companyWzFirstLogo: this.ruleForm.companyWzFirstLogo,
        companyWzMpQr: this.ruleForm.companyWzMpQr
      }
      editCompany(params).then(res => {
        if (res.code === '000000') {
          this.$props.slotPage !== 'releasePositionPage' &&
            this.$message.success('保存成功')
          this.loading = false
          if (this.backTo === 'postionDetail') {
            this.$router.push('/job')
          } else {
            this.$emit('reload')
          }
        }
      })
    },
    // 新增企业
    addCompany() {
      const companyImgs = this.companyImgs
      this.ruleForm.companyPictures = []
      companyImgs.forEach(item => {
        if (item.response) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.response.data[0].dbPath
          })
        } else if (item.companyPicture) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.companyPicture
          })
        }
      })
      console.log(companyImgs, this.ruleForm.companyPictures)
      const params = {
        name: this.ruleForm.name,
        replaceName: this.ruleForm.replaceName,
        provinceId: this.ruleForm.areas[0],
        cityId: this.ruleForm.areas[1],
        areaId: this.ruleForm.areas[2],
        address: this.ruleForm.address,
        scale: this.ruleForm.scale,
        industrys1: this.ruleForm.industry,
        style: this.ruleForm.style,
        logo: this.ruleForm.logo,
        introduce: this.ruleForm.introduce,
        contactUserName: this.ruleForm.contactUserName,
        contactUserMobile: this.ruleForm.contactUserMobile,
        contactUserEmail: this.ruleForm.contactUserEmail,
        customerCooperationStatus: this.ruleForm.customerCooperationStatus,
        customerPmId: this.ruleForm.customerPmId
      }
      console.log('参数', params)
      addCompany(params).then(res => {
        this.loading = false
        if (res.code === '000000') {
          this.$message.success('保存成功')
          this.$emit('closeDrawer', res.data)
          this.$emit('reload')
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.ruleForm.shortName = null
      this.ruleForm.replaceName = null
      this.ruleForm.areas = []
      this.ruleForm.address = null
      this.ruleForm.scale = null
      this.ruleForm.industry = null
      this.ruleForm.style = null
      this.ruleForm.logo = null
      this.ruleForm.logoWeb = null
      this.ruleForm.introduce = null
      this.ruleForm.fileList = []
      this.ruleForm.companyPictures = []
      this.ruleForm.companyVideo = null
      this.ruleForm.companyVideoWeb = null
      this.ruleForm.companyWxMp = null
      this.ruleForm.website = null
      this.ruleForm.companyWxQr = null
      this.ruleForm.companyWxQrUrl = null
      this.ruleForm.companyWzLogo = null
      this.ruleForm.companyWzLogoUrl = null
      this.ruleForm.companyWzFirstLogo = null
      this.ruleForm.companyWzFirstLogoUrl = null
    },
    // 上传企业logo
    beforeAvatarUpload(file) {
      this.uploadLoading = true
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleAvatarSuccess(res, file) {
      this.uploadLoading = false
      if (res.code === '000000') {
        this.ruleForm.logo = res.data && res.data.dbPath
        this.ruleForm.logoWeb = res.data && res.data.webPath
        console.log(this.ruleForm.logoWeb)
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
    // 上传企业图片
    beforeCompanyImgsUpload(file) {
      this.companyParamsData.ossFileType = 'companyPicture'
    },
    handleCompanyImgsSuccess(res, file) {
      if (res.code === '000000') {
        this.companyImgs = this.companyImgs.concat(file)
        console.log('返回', this.companyImgs)
        // this.$message({
        //   message: '上传成功',
        //   type: 'success'
        // })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    handleExceed(file, fileList) {
      if (file.length > this.limit) {
        this.$message({
          message: `最多上传${this.limit}张图片`,
          type: 'error'
        })
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.companyImgs.forEach((item, idx) => {
        if (file.url === item.url) {
          this.companyImgs.splice(idx, 1)
        }
      })
    },
    // 上传企业视频
    beforeVideoUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb'
        ].indexOf(file.type) === -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!')
        return false
      }
      this.videoParamsData.ossFileType = 'companyVideo'
    },
    handleVideoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyVideo = res.data && res.data.dbPath
        this.ruleForm.companyVideoWeb = res.data && res.data.webPath
        console.log(this.ruleForm.companyVideoWeb)
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
    // 上传公众号
    beforeWxQrUpload(file) {
      this.paramsData.ossFileType = 'companyWxQr'
    },
    handleWxQrSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWxQr = res.data && res.data.dbPath
        this.ruleForm.companyWxQrUrl = res.data && res.data.webPath
        console.log(this.ruleForm.logoWeb)
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
    // 上传主页背景
    beforeWzLogoUpload(file) {
      this.paramsData.ossFileType = 'companyWzBack'
    },
    handleWzLogoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzLogo = res.data && res.data.dbPath
        this.ruleForm.companyWzLogoUrl = res.data && res.data.webPath
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
    // 上传大logo
    beforeFirstLogoUpload(file) {
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleFirstLogoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzFirstLogo = res.data && res.data.dbPath
        this.ruleForm.companyWzFirstLogoUrl = res.data && res.data.webPath
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
    // 微站公众号二维码
    beforeWzMpQrUpload(file) {
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleWzMpQrSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzMpQr = res.data && res.data.dbPath
        this.ruleForm.companyWzMpQrUrl = res.data && res.data.webPath
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
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader{
  width: 150px;
}
.edit {
  padding: 16px;
  .el-radio-group{
    vertical-align: middle;
    height: 32px;
    line-height: 32px;
    .el-radio{
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
  &.edit{
    .el-textarea{
        input{
          width: 315px !important;
        }
      }
      .el-input,.el-select,.el-cascader{
        width: 315px !important;
      }
      ::v-deep .el-input,.el-textarea{
        input{
          width: 315px !important;
        }
        width: 315px !important;
      }
      ::v-deep .el-form-item__label{
        width: 110px !important;
      }
      .two-row{
        .el-col-10{
          width: 100%;
          float: inherit;
          ::v-deep el-form-item__content{
            margin-left: 0;
          }
          .el-form-item{
            margin-bottom: 15px;
          }
        }
        .el-col-14{
          float: inherit;
          width: 315px;
          margin-left: 102px;
        }
      }
      .desc{
        left: 180px !important;
      }
      ::v-deep  .el-upload__tip{
        margin-left: 20px;
      }
    }
}
</style>
