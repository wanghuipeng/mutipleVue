/**
* 上传简历
*/
<template>
  <div class="resume-upload">
    <template v-if="!analyseVisible">
      <el-upload
        class="upload-demo"
        drag
        :data="paramsData"
        :action="uploadResumeUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          <p>可将单个文件拖拽上传区域</p>
          <p>或点击该区域上传</p>
          <p>支持doc、docx、pdf、jpg、png、wps、txt、html格式附件，文件大小不能超过10M</p>
        </div>
      </el-upload>
    </template>
    <!-- 解析简历 -->
    <analyse-resume v-if="analyseVisible" />
  </div>
</template>

<script>
import AnalyseResume from '@/components/resume/resumeUpload/analyseResume'

export default {
  components: {
    AnalyseResume
  },
  data() {
    return {
      paramsData: {},
      uploadResumeUrl: '/api/candidate/resumeBase/upload',
      analyseVisible: true
    }
  },
  mounted() {},
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code === '000000') {
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
    beforeAvatarUpload(file) {
      this.paramsData.ossFileType = 'resumeInformation'
      return true
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/resume/resumeUpload.scss';
</style>

