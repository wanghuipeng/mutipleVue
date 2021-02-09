<template>
  <div v-loading="loading" class="identification-page child-view" style="min-height: 381px;">
    <div>
      <!-- 已认证 -->
      <div
        v-if="certificationStatus === null || certificationStatus === 1 || certificationStatus === 2"
        class="no-identificate"
      >
        <p class="tip">完成平台实名认证后，实名信息不可再度修改，如有问题请与客服人员联系</p>
        <div class="inner">
          <h3>
            认证信息
            <span v-if="certificationStatus === 1">已实名</span>
            <span v-if="certificationStatus === 2">认证中</span>
          </h3>
          <ul class="form">
            <li>
              <label>姓名：</label>
              {{ detail.trueName }}
            </li>
            <li>
              <label>身份证号：</label>
              {{ detail.idcard }}
            </li>
            <li>
              <label>身份证：</label>
              <img class="face-img" :src="detail.idcardFrontUrlView" />
            </li>
            <li>
              <label>职业照：</label>
              <img class="work-img" :src="detail.careerPhotoUrlView" />
            </li>
          </ul>
        </div>
      </div>
      <!-- 未认证 -->
      <el-form
        v-if="certificationStatus === 0 || certificationStatus === 3"
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <p class="tip">根据人社部办公厅印发的《关于进一步加强招聘信息管理的通知》及《移动互联网应用程序信息服务管理规定》，每一位在职猎头需完成实名认证才能在本平台行使更多权益</p>
        <div class="step1">
          <div class="left">
            <h3>第一步：上传身份证正面照</h3>
            <el-form-item label="姓名" prop="trueName">
              <el-input v-model="ruleForm.trueName" />
            </el-form-item>
            <el-form-item label="身份证号码" prop="idcard">
              <el-input v-model="ruleForm.idcard" />
            </el-form-item>
            <el-form-item label="上传身份证" prop="idcardFrontUrl">
              <el-upload
                v-model="ruleForm.idcardFrontUrl"
                v-loading="imgLoading1"
                class="face-img"
                :data="paramsData"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload1"
              >
                <img
                  v-if="ruleForm.idcardFrontUrl"
                  :src="ruleForm.idcardFrontUrl"
                  class="no-border"
                />
                <img v-else src="~@/assets/images/myCenter/face_img.png" />
                <p
                  v-if="!ruleForm.idcardFrontUrl"
                  :class="[ ruleForm.idcardFrontUrl ? 'img-text transparent' : 'img-text']"
                >点击上传身份证正面照</p>
              </el-upload>
            </el-form-item>
          </div>
          <div class="right">
            <h3>身份证拍摄示例</h3>
            <ul class="imgs">
              <li>
                <img src="~@/assets/images/myCenter/face_img_1.png" alt="标准" />
                <p class="ok">标准</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/face_img_2.png" alt="边框缺失" />
                <p>边框缺失</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/face_img_1.png" alt="闪光强烈" />
                <i class="icon-light"></i>
                <p>闪光强烈</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/face_img_4.png" alt="照片模糊" />
                <p>照片模糊</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="step2 clear">
          <div class="left">
            <h3>
              第二步：上传个人职业照
              <span class="title">（职业照与身份证须为同一个人）</span>
            </h3>
            <el-form-item label="上传职业照" prop="careerPhotoUrl">
              <el-upload
                v-model="ruleForm.careerPhotoUrl"
                v-loading="imgLoading2"
                class="work-img"
                :data="paramsData"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload2"
              >
                <img
                  v-if="ruleForm.careerPhotoUrl"
                  :src="ruleForm.careerPhotoUrl"
                  class="no-border"
                />
                <img v-else src="~@/assets/images/myCenter/work_img.png" />
                <p
                  v-if="!ruleForm.careerPhotoUrl"
                  :class="[ ruleForm.careerPhotoUrl ? 'img-text transparent' : 'img-text']"
                >点击上传职业照</p>
              </el-upload>
            </el-form-item>
          </div>
          <div class="right">
            <h3>职业照拍摄示例</h3>
            <ul class="imgs">
              <li>
                <img src="~@/assets/images/myCenter/work_img_1.png" alt="标准" />
                <p class="ok">标准</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/work_img_2.png" alt="光线不足" />
                <p>光线不足</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/work_img_1.png" alt="没有入镜" />
                <p>没有入镜</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/work_img_4.png" alt="遮挡脸部" />
                <p>遮挡脸部</p>
              </li>
              <li>
                <img src="~@/assets/images/myCenter/work_img_5.png" alt="照片模糊" />
                <p>照片模糊</p>
              </li>
            </ul>
          </div>
        </div>
        <el-form-item class="clear">
          <el-button type="primary" class="submit-btn" @click="submitForm('ruleForm')">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 图片裁剪上传 -->
    <el-dialog
      :title="imgTitle"
      :visible.sync="dialogVisible"
      width="660"
      :before-close="handleClose"
      append-to-body
      class="ident-dialog"
    >
      <div style="width:100%;height:500px">
        <vue-cropper
          ref="cropper"
          auto-crop
          :img="imgUrl"
          center-box
          fixed
          :fixed-number="fixedNumber"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cropper-cancel-btn" size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" class="cropper-cancel-btn" size="mini" @click="rotate">旋转</el-button>
        <el-button
          ref="cropper"
          v-loading="btnLoading"
          size="mini"
          type="primary"
          class="cropper-cancel-btn cropper-btn"
          @click="getCropData()"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, submitHhCertification } from '@/api/myCenter'
import { uploadBase64 } from '@/api/common'
import { mapState } from 'vuex'
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      btnLoading: false,
      imgTitle: '',
      imgUrl: '',
      fixedNumber: [],
      dialogVisible: false,
      detail: {},
      paramsData: {},
      uploadAction: '/api/common/upload',
      loading: false,
      imgLoading1: false,
      imgLoading2: false,
      idcardDbPath: '',
      careerDbPath: '',
      ruleForm: {
        trueName: '',
        idcard: '',
        idcardFrontUrl: '',
        careerPhotoUrl: ''
      },
      rules: {
        trueName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: this.$verify.trueNameFormat, trigger: 'change' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { validator: this.$verify.idNumFormat, trigger: 'blur' }
        ],
        idcardFrontUrl: [
          { required: true, message: '请上传身份证正面照', trigger: 'blur' }
        ],
        careerPhotoUrl: [
          { required: true, message: '请上传职业照', trigger: 'blur' }
        ]
      },
      certificationStatus: null // 认证状态（1：已认证 0：未认证 2：认证中 3：未通过）
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  mounted() {
    this.getUserProfile()
  },
  methods: {
    uploadBase64(data) {
      this.btnLoading = true
      const params = {
        img: data,
        ossFileType: 'userIdCard'
      }
      uploadBase64(params).then(res => {
        this.btnLoading = false
        if (res.code === '000000') {
          if (this.imgTitle === '身份证正面照裁剪') {
            this.ruleForm.idcardFrontUrl = res.data.webPath
            this.idcardDbPath = res.data.dbPath
          } else if (this.imgTitle === '职业照裁剪') {
            this.ruleForm.careerPhotoUrl = res.data.webPath
            this.careerDbPath = res.data.dbPath
          }
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        }
      })
    },
    // 旋转
    rotate() {
      this.$refs.cropper.rotateRight()
    },
    // 裁剪
    getCropData() {
      this.$refs.cropper.getCropData(data => {
        this.handleClose()
        this.uploadBase64(data)
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 获取用户详情
    getUserProfile() {
      this.loading = true
      getUserProfile().then(res => {
        const { certificationStatus, trueName } = res.data
        this.loading = false
        if (res.code === '000000') {
          this.certificationStatus = certificationStatus
          console.log(
            '认证状态',
            certificationStatus,
            typeof certificationStatus
          )
          // this.certificationStatus = 0
          this.ruleForm.trueName = trueName
          if (certificationStatus) {
            this.detail = res.data
          }
        }
      })
    },
    handleAvatarSuccess1(res, file) {
      this.imgLoading1 = false
      if (res.code === '000000') {
        // this.ruleForm.idcardFrontUrl = res.data.webPath
        // this.idcardDbPath = res.data.dbPath
        this.imgTitle = '身份证正面照裁剪'
        this.imgUrl = res.data.webPath
        this.fixedNumber = [465, 285]
        this.dialogVisible = true
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    handleAvatarSuccess2(res, file) {
      this.imgLoading2 = false
      if (res.code === '000000') {
        // this.ruleForm.careerPhotoUrl = res.data.webPath
        // this.careerDbPath = res.data.dbPath
        this.imgTitle = '职业照裁剪'
        this.imgUrl = res.data.webPath
        this.fixedNumber = [270, 270]
        this.dialogVisible = true
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    beforeAvatarUpload1(file) {
      this.imgLoading1 = true
      this.paramsData.ossFileType = 'userIdCard'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading1 = false
      }
      return isLt2M
    },
    beforeAvatarUpload2(file) {
      this.imgLoading2 = true
      this.paramsData.ossFileType = 'userIdCard'
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
        this.imgLoading2 = false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading2 = false
      }
      return (isJPG || isPNG) && isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitHhCertification()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 实名认证
    submitHhCertification() {
      const { trueName, idcard } = this.ruleForm
      const {
        idcardDbPath: idcardFrontUrl,
        careerDbPath: careerPhotoUrl
      } = this
      const params = {
        trueName,
        idcard,
        idcardFrontUrl,
        id: this.userInfo.userId,
        careerPhotoUrl
      }
      submitHhCertification(params).then(res => {
        if (res.code === '000000') {
          this.getUserProfile()
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.certificationStatus = 2
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/myCenter/identification.scss';
</style>
