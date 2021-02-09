<template>
  <div class="personality-page template-h5">
    <el-card v-loading="loading" shadow="never">
      <div class="personality-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '' }">招聘门户</el-breadcrumb-item>
          <el-breadcrumb-item>个性化首页</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="tip">通过大猎微聘，您可以快速定制搭建您企业专属的招聘门户，关联到您的招聘公众号，为企业和候选人建立持续沟通桥梁。</p>
      </div>
      <div class="personality-content" v-if="personalForm">
        <!-- 内容设置部分 -->
        <div class="right-part">
          <el-form ref="personalForm" :rules="personalRules" label-width="120px" size="small">
            <h3>首页内容设置</h3>
            <el-form-item label="招聘门户名称" prop="portalName">
              <el-input v-model="personalForm.portalName"></el-input>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in personalForm.wzPortalParams"
              :key="index"
              :label="item.paramName"
              :prop="item.paramValue"
              class="red-mini-icon"
            >
              <!-- 图片类型 -->
              <div v-if="item.paramType === 1" v-loading="imgLoadingCommon" class="img-part">
                <el-upload
                  class="avatar-uploader"
                  :data="paramsData"
                  :action="uploadAction"
                  :show-file-list="false"
                  :on-progress="handleProgressCommon"
                  :on-success="handleAvatarSuccessCommon"
                  :before-upload="beforeAvatarUploadCommon(item)"
                >
                  <img v-if="item.paramLinkUrl" :src="item.paramLinkUrl" class="avatar" />
                  <el-button v-else type="primary" size="small">点击上传</el-button>
                </el-upload>
              </div>
              <!-- 文字类型 -->
              <div v-if="item.paramType === 2">
                <el-select
                  v-model="item.paramLinkType"
                  :class="[ (item.paramLinkType - 0 === 1 || item.paramLinkType - 0 === 2) && 'two-input']"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="itemValue in portalTypeArr"
                    :key="itemValue.value"
                    :label="itemValue.label"
                    :value="itemValue.value - 0"
                  ></el-option>
                </el-select>
                <!-- 雇主品牌&用户中心 -->
                <div
                  v-if="item.paramLinkType - 0 === 1 || item.paramLinkType - 0 === 2"
                  class="input-group w-195"
                >
                  <el-input v-model="item.paramValue" placeholder="请输入入口名称" maxlength="6"></el-input>
                </div>
                <!-- 招聘专区 -->
                <div v-if="item.paramLinkType - 0 === 3" class="input-group">
                  <el-select v-model="item.paramLinkCode" placeholder="请选择招聘专区">
                    <el-option
                      v-for="itemValue in jobFairList"
                      :key="itemValue.id"
                      :label="itemValue.specialAreaName"
                      :value="itemValue.id+''"
                    ></el-option>
                  </el-select>
                  <el-input v-model="item.paramValue" placeholder="请输入入口名称" maxlength="6"></el-input>
                </div>
                <!-- 外部链接 -->
                <div v-if="item.paramLinkType - 0 === 4" class="input-group">
                  <el-input v-model="item.paramLinkValue" placeholder="请输入外部链接地址"></el-input>
                  <el-input v-model="item.paramValue" placeholder="请输入入口名称" maxlength="6"></el-input>
                </div>
                <!-- <el-input v-model="item.paramValue"></el-input> -->
              </div>
            </el-form-item>
            <h3>分享设置</h3>
            <el-form-item label="分享标题" prop="shareTitle">
              <el-input v-model="personalForm.shareTitle"></el-input>
            </el-form-item>
            <el-form-item label="分享说明" prop="shareExplain">
              <el-input v-model="personalForm.shareExplain"></el-input>
            </el-form-item>
            <!-- <el-form-item label="分享图标" prop="shareLogoUrl">
              <el-upload
                v-loading="imgLoading"
                class="avatar-uploader"
                :data="paramsData"
                :action="uploadAction"
                :show-file-list="false"
                :on-progress="handleProgress"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="personalForm.shareLogoUrl"
                  :src="personalForm.shareLogoUrl"
                  class="avatar-icon"
                />
                <el-button v-else size="mini">点击上传</el-button>
              </el-upload>
            </el-form-item>-->
            <el-form-item class="mt-30">
              <el-button type="primary" :loading="btnLoading" @click="saveIt('personalForm')">保存并发布</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 预览部分 -->
        <div class="left-part">
          <!-- <header>
            <span class="title">{{title}}</span>
          </header>-->
          <section v-html="personalForm && personalForm.content"></section>
          <footer>
            <el-carousel :autoplay="false" :arrow="'always'" type="card" height="80px" @change="changeTemplate">
              <el-carousel-item v-for="(item,index) in thumbnailArr" :key="index" >
                <img :src="item.thumbnail" />
              </el-carousel-item>
            </el-carousel>
          </footer>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getWzPortal,
  editWzPortal,
  getWzSpecialAreaList
} from '@/api/miniPortal/personality'
import { mapState } from 'vuex'
import Vue from 'vue'
export default {
  data() {
    return {
      title: '',
      thumbnailArr: [], // 缩略图集合
      imgLoadingCommon: false,
      imgLoading: false,
      btnLoading: false,
      jobFairList: [],
      portalTypeArr: [],
      paramValue: '',
      paramsData: {},
      uploadAction: '/api/common/upload',
      uploadHeader: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      loading: false,
      personalForm: {
        portalName: '',
        shareTitle: '',
        shareExplain: '',
        shareLogoUrl: '',
        wzPortalParams: []
      },
      personalRules: {
        portalName: [
          {
            required: true,
            message: '请输入招聘门户名称'
          }
        ],
        shareTitle: [
          {
            required: true,
            message: '请输入分享标题'
          }
        ],
        shareExplain: [
          {
            required: true,
            message: '请输入分享说明'
          }
        ]
      },
      paramLinkValue1: '/company', // 雇主品牌（paramLinkType == 1）
      paramLinkValue2: '/mine', // 用户中心（paramLinkType == 2）
      portalArr:[], // 所有模板数据
      index:null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dictData: state => state.common.dictData
    })
  },
  mounted() {
    // 推荐入口样式
    this.resetStyle()
    this.portalTypeArr = this.dictData.dicts && this.dictData.dicts.portalType
    this.getWzPortal()
    this.getWzSpecialAreaList()
  },
  methods: {
    changeTemplate(e){
      this.index = e
      this.portalArr && this.portalArr.filter((item,index)=>{
        if(index == e){
          this.personalForm = item
          this.personalForm.portalName = item && item.portalName
          this.title = item && item.portalName
          this.personalForm.shareTitle = item && item.shareTitle
          this.personalForm.shareExplain = item.shareExplain
        }
      })
    },
    // 推荐入口样式
    resetStyle() {
      this.$nextTick(() => {
        setTimeout(() => {
          let item1 = document.querySelector('.menu .item1 a')
          if (item1 && item1.innerHTML.length <= 4) {
            item1.style.width = '2.125rem'
          } else {
            item1.style.width = '3.125rem'
          }
          let item2 = document.querySelector('.menu .item2 a')
          if (item2 && item2.innerHTML.length <= 4) {
            item2.style.width = '2.125rem'
          } else {
            item2.style.width = '3.125rem'
          }
          let item3 = document.querySelector('.menu .item3 a')
          if (item3 && item3.innerHTML.length <= 4) {
            item3.style.width = '2.125rem'
          } else {
            item3.style.width = '3.125rem'
          }
          let item4 = document.querySelector('.menu .item4 a')
          if (item4 && item4.innerHTML.length <= 4) {
            item4.style.width = '2.125rem'
          } else {
            item4.style.width = '3.125rem'
          }
          let item5 = document.querySelector('.menu .item5 a')
          if (item5 && item5.innerHTML.length <= 4) {
            item5.style.width = '2.125rem'
          } else {
            item5.style.width = '3.125rem'
          }
        }, 1000)
      })
    },
    // 获取企业封面图配置信息
    getWzPortal() {
      this.thumbnailArr = []
      this.loading = true
      getWzPortal().then(res => {
        this.loading = false
        const { code, data } = res
        this.portalArr = data // 所有模板数据
        if (code === '000000') {
          data &&
            data.filter((item,index) => {
              this.thumbnailArr.push({
                id: item.id,
                thumbnail: item.thumbnail
              })
              if (item.effectiveStatus && index === 0) {
                this.personalForm = item
                this.personalForm.portalName = item && item.portalName
                this.title = item && item.portalName
                this.personalForm.shareTitle = item && item.shareTitle
                this.personalForm.shareExplain = item.shareExplain
              }
              console.log(11111111,this.thumbnailArr)
            })
        }
      })
    },
    // 公共上传
    handleProgressCommon() {
      this.imgLoadingCommon = true
    },
    beforeAvatarUploadCommon(item) {
      this.paramValue = item.paramValue
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleAvatarSuccessCommon(res, file, item) {
      this.imgLoadingCommon = false
      if (res.code === '000000') {
        this.personalForm &&
          this.personalForm.wzPortalParams &&
          this.personalForm.wzPortalParams.filter((item, index) => {
            if (item.paramValue === this.paramValue) {
              this.personalForm.wzPortalParams[index].paramLinkValue =
                res.data && res.data.dbPath
              this.personalForm.wzPortalParams[index].paramLinkUrl =
                res.data && res.data.webPath
            }
          })
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
    // 上传分享图标
    handleProgress() {
      this.imgLoading = true
    },
    beforeAvatarUpload(file) {
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleAvatarSuccess(res, file) {
      this.imgLoading = false
      if (res.code === '000000') {
        this.personalForm.shareLogo = res.data && res.data.dbPath
        this.personalForm.shareLogoUrl = res.data && res.data.webPath
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
    // 招聘专区列表
    getWzSpecialAreaList() {
      getWzSpecialAreaList().then(res => {
        const { code, message, data } = res
        if (code === '000000') {
          this.jobFairList = data
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      })
    },
    // 提交并发布
    saveIt(formName) {
      const { companyId } = this.userInfo
      let { wzPortalParams } = this.personalForm
      wzPortalParams &&
        wzPortalParams.filter(item => {
          if (item.paramLinkType - 0 === 1) {
            item.paramLinkValue = this.paramLinkValue1
          } else if (item.paramLinkType - 0 === 2) {
            item.paramLinkValue = this.paramLinkValue2
          }
        })
      console.log(111111, wzPortalParams)
      const {
        id,
        templateId,
        portalName,
        shareExplain,
        shareLogo,
        shareTitle
      } = this.personalForm
      const params = {
        id,
        templateId,
        companyId,
        portalName,
        shareExplain,
        shareLogo,
        shareTitle,
        effectiveStatus: 1,
        wzPortalParams
      }
      if (!portalName) {
        this.$message({
          message: '请输入招聘门户名称',
          type: 'error'
        })
      } else if (!shareTitle) {
        this.$message({
          message: '请输入分享标题',
          type: 'error'
        })
      } else if (!shareExplain) {
        this.$message({
          message: '请输入分享说明',
          type: 'error'
        })
      } else {
        this.btnLoading = true
        editWzPortal(params).then(res => {
          this.btnLoading = false
          const { code, message } = res
          if (code === '000000') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
           // this.getWzPortal()
           // 只更新右侧预览部分，左侧不需要更新视图
            getWzPortal().then(res => {
              const { code, data } = res
              if (code === '000000') {
                data &&
                  data.filter(item => {
                    if (item.effectiveStatus && ((this.index + 1) == item.templateId)) {
                      this.personalForm.content = item && item.content
                    }
                  })
              }
            })
          } else {
            this.$message({
              message: message,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" >
.personality-page {
  height: 100%;
  background-color: #fff;
  .template1,.template2{
    margin-top: -2rem;
    border-radius: 40px;
  }
  .template1{
    .bg{
      height: 41rem;
    }
  }
  .template2{
    .bg{
      height: 45rem;
    }
  }
  .two-input {
    width: 195px;
    display: inline-block;
    .el-input {
      width: 195px;
    }
  }
  .input-group.w-195 {
    width: 195px;
    display: inline-block;
    margin-top: 0;
    margin-left: 10px;
  }
  .personality-content {
    display: flex;
    justify-content: space-between;
    padding: 0 60px;
  }
  &.template-h5 {
    .el-card__body {
      display: block;
    }
  }
  .red-mini-icon {
    position: relative;
    &::before {
      content: '*';
      color: #f56c6c;
      position: absolute;
      left: 28px;
      font-size: 13px;
      top: 6px;
    }
  }
  .el-form-item.is-error {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }
  .el-form-item__error {
    display: none;
  }
  .template1 {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      overflow: hidden;
      width: 375px;
      height: 100%;
      background: transparent;
      z-index: 100;
    }
  }
  header {
    position: relative;
    .title {
      position: absolute;
      top: 43px;
      left: 34px;
      font-size: 14px;
      color: #333;
      font-weight: 600;
      max-width: 290px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  footer {
    height: 250px;
  }
  .input-group {
    margin-top: 15px;
    .el-input {
      width: 195px;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .mt-30 {
    margin-top: 30px;
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
  .avatar {
    max-width: 400px;
    max-height: 400px;
    display: block;
    object-fit: cover;
  }
  .avatar-icon {
    width: 100%;
    max-width: 195px;
    height: 148px;
    display: block;
    object-fit: cover;
  }
  .tip {
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 35px;
    color: #666;
  }
  .inputs {
    .el-input {
      width: 400px;
    }
    button {
      margin-left: 15px;
    }
  }
  .el-carousel {
    .el-carousel--horizontal {
      margin-top: 50px;
    }
    .el-carousel__container {
      overflow: hidden;
      height: 200px !important;
      width:auto;
      img {
        width: 120px;
        height: 200px;
      }
    }
    .el-carousel__item--card {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      justify-items: center;
      align-content: center;
      width: auto;
      height: 90px;
      &.is-active {
        transform: translateX(100px) scale(0.83) !important;
      }
    }
    .el-carousel__indicators--outside {
      width: auto;
    }
    .el-carousel__item {
      height: 210px;
    }
    .el-carousel__arrow--left {
      left: 0;
    }
    .el-carousel__arrow--right {
      right: 0;
    }
  }
}
</style>
