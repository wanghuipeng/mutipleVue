<template>
  <div class="recruitment-page template-h5">
    <el-card shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/miniPortal/recruitmentZone' }">返回</el-breadcrumb-item>
        <el-breadcrumb-item>{{ type === 'edit' ? '修改招聘专区' : '新增招聘专区' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <!-- 内容设置部分 -->
        <div class="right-part">
          <el-form
            ref="zoneForm"
            :model="zoneForm"
            :rules="zoneRules"
            label-width="120px"
            size="small"
          >
            <h3>基础设置</h3>
            <el-form-item label="专区名称" prop="specialAreaName">
              <el-input v-model="zoneForm.specialAreaName"></el-input>
            </el-form-item>
            <el-form-item label="专区封面" prop="specialAreaLogoUrl">
              <el-upload
                class="avatar-uploader"
                :data="paramsData"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleBannerSuccess"
                :before-upload="beforeBannerUpload"
              >
                <img
                  v-if="zoneForm.specialAreaLogoUrl"
                  :src="zoneForm.specialAreaLogoUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <h3>专区职位<p class="desc">设置专区内展示职位的自动过滤条件后，符合条件的职位将自动添加到专区</p></h3>
            <el-form-item label="招聘性质">
              <el-select
                v-model="zoneForm.recruitType"
                multiple
                clearable
                placeholder="请选择招聘性质"
              >
                <el-option
                  v-for="item in dictData.dicts.recruitProperties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="职位性质">
              <el-select v-model="zoneForm.positionProperties" multiple clearable placeholder="请选择职位性质">
                <el-option
                  v-for="item in dictData.dicts.recruitType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="招聘地区">
              <el-cascader
                v-model="zoneForm.area"
                :options="areas"
                :props="props"
                collapse-tags
                clearable
              />
              <!-- <el-input v-model="zoneForm.area"></el-input> -->
            </el-form-item>
            <el-form-item label="招聘职能">
              <el-cascader
                v-model="zoneForm.function"
                :options="functions"
                :props="props"
                collapse-tags
                clearable
              />
              <!-- <el-input v-model="zoneForm.function"></el-input> -->
            </el-form-item>
            <el-form-item label="招聘部门">
              <el-select v-model="zoneForm.department" multiple clearable placeholder="请选择招聘部门/机构">
                <el-option
                  v-for="item in departmentList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <h3>分享设置</h3>
            <el-form-item label="分享标题" prop="shareTitle">
              <el-input v-model="zoneForm.shareTitle"></el-input>
            </el-form-item>
            <el-form-item label="分享说明" prop="shareExplain">
              <el-input v-model="zoneForm.shareExplain"></el-input>
            </el-form-item>
            <!-- <el-form-item label="分享图标">
              <el-upload
                class="avatar-uploader"
                :data="paramsData"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleShareSuccess"
                :before-upload="beforeShareUpload"
              >
                <img v-if="zoneForm.shareLogoUrl" :src="zoneForm.shareLogoUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="save('zoneForm')">保存并发布</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 预览部分 -->
        <div class="left-part">
          <!-- <header>{{ zoneForm.specialAreaName || '招聘专区预览' }}</header> -->
          <section class="content">
            <div class="content-top" @click.stop></div>
            <div class="content-bottom" @click.stop></div>
            <iframe
              v-if="url"
              id="show-iframe"
              frameborder="0"
              scrolling="no"
              style="background-color:transparent; position：absolute;width: 100%;
          height:100%; top: 0;left:0;bottom:0;"
              :src="url"
            ></iframe>
            <div v-else class="tips">保存专区后，即可预览招聘专区展示效果</div>
          </section>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  getWzSpecialAreaById,
  getSelectDeptList,
  editWzSpecialArea,
  addWzSpecialArea
} from '@/api/miniPortal'
export default {
  data() {
    return {
      url: '',
      loading: false,
      type: '',
      paramsData: {},
      uploadAction: '/api/common/upload',
      uploadHeader: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      props: { multiple: true },
      zoneForm: {
        specialAreaName: '',
        specialAreaLogo: '',
        specialAreaLogoUrl: '',
        recruitType: [],
        positionProperties: [],
        area: [],
        function: [],
        department: '',
        shareTitle: '',
        shareExplain: '',
        shareLogo: '',
        shareLogoUrl: ''
      },
      zoneRules: {
        specialAreaName: [
          { required: true, message: '请输入招聘专区名称', trigger: 'blur' }
        ],
        specialAreaLogoUrl: [
          { required: true, message: '请上传专区封面图', trigger: 'change' }
        ],
        shareTitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        shareExplain: [
          { required: true, message: '请输入分享说明', trigger: 'blur' }
        ]
      },
      zoneId: '',
      departmentList: []
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      areas: state => {
        const arr = state.common.dictData.areas
        arr.forEach(item => {
          item.children.forEach(items => {
            delete items.children
          })
        })
        return arr
      },
      functions: state => {
        const arr = state.common.dictData.functions
        arr.forEach(item => {
          item.children.forEach(items => {
            delete items.children
          })
        })
        return arr
      },
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.zoneId = this.$route.query.id
    this.type = this.$route.query.type
    this.getSelectDeptList()
    if (this.zoneId) {
      this.getDetail()
      this.webUrl(this.zoneId)
    }
  },
  methods: {
    // 获取详情
    getDetail() {
      const params = {
        id: this.zoneId
      }
      getWzSpecialAreaById(params).then(res => {
        res.data.recruitType = res.data.recruitType
          ? res.data.recruitType.split(',')
          : ''
        res.data.positionProperties = res.data.positionProperties
          ? res.data.positionProperties.split(',')
          : ''
        res.data.area = res.data.area ? res.data.area.split(',') : ''
        res.data.function = res.data.function
          ? res.data.function.split(',')
          : ''
        res.data.department = res.data.department
          ? res.data.department.split(',')
          : ''
        const area = []
        res.data.area &&
          res.data.area.forEach(item => {
            area.push([item.slice(0, 2) + '0000', item])
          })
        const functions = []
        res.data.function &&
          res.data.function.forEach(item => {
            functions.push([item.slice(0, 3), item])
          })
        res.data.area = area
        res.data.function = functions
        this.zoneForm = res.data
        console.log(this.zoneForm)
      })
    },
    // 获取部门
    getSelectDeptList() {
      getSelectDeptList().then(res => {
        this.departmentList = res.data
      })
    },
    // 保存并发布
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.zoneForm)
          delete params.shareLogoUrl
          delete params.specialAreaLogoUrl
          delete params.createTime
          delete params.createBy
          delete params.updateBy
          delete params.updateTime
          // delete params.isDefault
          // delete params.effectiveStatus
          const area = []
          const functions = []
          params.area &&
            params.area.forEach(item => {
              area.push(item[1])
            })
          params.area = area.join(',')
          params.function &&
            params.function.forEach(item => {
              functions.push(item[1])
            })
          params.function = functions.join(',')
          params.recruitType = params.recruitType
            ? params.recruitType.join(',')
            : ''
          params.positionProperties = params.positionProperties
            ? params.positionProperties.join(',')
            : ''
          params.department = params.department
            ? params.department.join(',')
            : ''
          console.log(params)
          this.loading = true
          if (this.type === 'edit') {
            this.edit(params)
          } else {
            delete params.id
            params.companyId = this.userInfo.companyId
            this.add(params)
          }
        }
      })
    },
    // 编辑
    edit(params) {
      editWzSpecialArea(params).then(res => {
        this.loading = false
        this.$message.success('保存成功')
        this.webUrl(this.zoneId)
      })
    },
    // 新增
    add(params) {
      addWzSpecialArea(params).then(res => {
        const { success } = res
        if (success) {
          this.loading = false
          this.$message.success('保存成功')
          this.webUrl(res.data)
        }
      })
    },
    // 预览
    webUrl(id) {
      const str = new Date().getTime()
      this.url = `https://${this.userInfo.companyWxAppId}.wx.daliehr.com/recruitment?id=${id}&str=${str}`
      // if (process.env.NODE_ENV === 'production') {
      //   this.url = window.location.host === 'h.dalieyingcai.com'
      //   ? `https://${this.userInfo.companyWxAppId}.wx.daliehr.com/recruitment?id=${id}&str=${str}`
      //   : `https://${this.userInfo.companyWxAppId}.wx.daliehr.com/recruitment?id=${id}&str=${str}`
      // } else {
      //   this.url = `http://localhost:8091/recruitment?id=${id}&str=${str}`
      // }
    },
    // 上传封面
    beforeBannerUpload(file) {
      this.paramsData.ossFileType = 'specialAreaFm'
    },
    handleBannerSuccess(res, file) {
      if (res.code === '000000') {
        this.zoneForm.specialAreaLogo = res.data && res.data.dbPath
        this.zoneForm.specialAreaLogoUrl = res.data && res.data.webPath
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
    beforeShareUpload(file) {
      this.paramsData.ossFileType = 'specialAreaFx'
    },
    handleShareSuccess(res, file) {
      if (res.code === '000000') {
        this.zoneForm.shareLogo = res.data && res.data.dbPath
        this.zoneForm.shareLogoUrl = res.data && res.data.webPath
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
.recruitment-page {
  padding-left: 16px;
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
  ::v-deep .el-carousel {
    // .el-carousel__indicators--outside {
    //   width: 300px;
    // }
    .el-carousel__container {
      width: 375px;
      height: 180px !important;
      overflow: hidden;
    }
    .el-carousel__item--card {
      width: 100px;
      &.is-active {
        transform: translateX(100px) scale(0.83) !important;
      }
    }
    .el-carousel__item {
      background-color: #99a9bf;
    }
  }
}
.template-h5 {
  ::v-deep .el-card__body {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 60px;
  }
  .left-part {
    margin-top: -50px;
    header {
      width: 375px;
      height: 74px;
      line-height: 100px;
      background: url('~@/assets/images/miniPortal/phone_header.jpg') no-repeat;
      background-size: 100%;
      padding-left: 34px;
      font-size: 14px;
      line-height: 103px;
      color: #333;
      font-weight: 600;
      box-sizing: border-box;
    }
    section {
      width: 373px;
      height: 624px;
      border-top: none;
      padding: 55px 28px;
      background-size: 100% 100%;
    }
  }
  .content {
    position: relative;
    .content-top {
      width: 375px;
      height: 50px;
      position: absolute;
      left: 24px;
      top: 47px;
    }
    .content-bottom {
      width: 375px;
      height: 275px;
      position: absolute;
      left: 24px;
      bottom: 32px;
      // background: red;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .tips {
      width: 100%;
      font-size: 14px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .right-part {
    margin-top: 20px;
    h3 {
      line-height: 32px;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .desc {
      font-size: 13px;
      line-height: 16px;
      font-weight: 300;
      // text-indent: 16px;
      color: #606266;
    }
    .el-input {
      width: 400px;
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
      // object-fit: contain;
    }
  }
}
</style>
