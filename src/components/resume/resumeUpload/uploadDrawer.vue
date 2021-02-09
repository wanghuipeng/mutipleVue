<template>
  <div class="upload-resume-drawer">
    <el-upload
      drag
      :data="paramsData"
      :action="uploadResumeUrl"
      :file-list="fileList"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-progress="handleProgress"
      :on-exceed="handleExceed"
      :headers="headersMsg"
      :limit="10"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖至区域处或
        <em>点击上传</em>
      </div>
      <div class="text">支持doc、docx、pdf、jpg、png、wps、txt、html格式附件，文件大小不能超过10M</div>
      <p class="tip">上传简历解析成功后，可马上查看AI职位匹配</p>
      <div slot="tip" class="el-upload__tip">
        简历上传记录
        <span>保留最近{{ listData && listData.length || 0 }}条记录</span>
      </div>
    </el-upload>
    <!-- 上传列表 -->
    <ul v-if="uploadVisible" v-loading="uploadVisible" class="upload-list">
      <li v-for="(item,index) in fileList" :key="index">
        <p class="file-name" :title="item.name">{{ item.name }}</p>
        <p v-if="item.status==='success'" class="percent">
          上传成功
          <span class="num">100%</span>
        </p>
        <p v-else-if="item.status==='fail'" class="percent">
          上传失败
          <span class="num">(重新上传)</span>
        </p>
        <p v-else class="percent">
          上传中
          <span class="num">{{ item.percentage }}%</span>
        </p>
        <el-progress :percentage="uploadSuccess ? item.percentage : 0"></el-progress>
      </li>
    </ul>
    <!-- 解析列表 -->
    <ul class="upload-list">
      <li v-for="(item,index) in listData" :key="index">
        <p class="file-name" :title="item.fileName" @click="toDetail(item.resumeId)">{{ item.fileName }}</p>
        <p v-if="item.statusNo===1" class="percent">
          上传成功
          <span class="num">100%</span>
        </p>
        <p v-else-if="item.statusNo===2" class="percent">解析中...</p>
        <p v-else-if="item.statusNo===3" class="percent">
          解析失败
          <span class="num">(重新上传)</span>
        </p>
        <p v-else-if="item.statusNo===4" class="percent">
          解析成功
          <span class="num" @click="toResumeUpload(item)">(查看)</span>
        </p>
        <!-- <el-progress :percentage="100"></el-progress> -->
      </li>
    </ul>
    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="false"
      @close="close"
    >
      <resume-detail v-if="drawer" slot="inner-body" />
    </drawer-common>
  </div>
</template>

<script>
import Vue from 'vue'
import { getResumeFile, getResumeInfoById } from '@/api/resume'
import DrawerCommon from '@/components/common/drawerCommon'
import ResumeDetail from '@/components/resume/index/resumeDetail'
let interval = null

export default {
  components: {
    DrawerCommon,
    ResumeDetail
  },
  props: {
    // 人才库对象
    talentData: {
      type: Object,
      default() {
        return {}
      },
      required: false
    }
  },
  data() {
    return {
      drawer: false,
      uploadSuccess: false,
      textFileWebUrl: null,
      uploadVisible: true,
      headersMsg: {
        'x-client-token': ''
      },
      paramsData: {},
      uploadResumeUrl: '/api/candidate/resumeBase/upload',
      fileList: [],
      listData: [],
      statusNo: null // 上传成功1，解析成功2，解析失败3
    }
  },
  mounted() {
    this.headersMsg['x-client-token'] = Vue.ls.get('x-client-token')
    this.getResumeFile()
    // 打印当前选中人才库
    console.log(this.talentData)
  },
  destroyed() {
    this.destroyedInterval()
    sessionStorage.removeItem('folderResumeSet')
  },
  methods: {
    // 打开简历详情
    toDetail(resumeId) {
      document.body.style['overflow'] = 'hidden'
      this.drawer = true
      sessionStorage.setItem('resumeId', resumeId)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.drawer = false
      this.$emit('refreshList', 1)
    },
    getResumeInfoById(item) {
      this.loading = true
      const params = {
        id: item.resumeId
      }
      getResumeInfoById(params).then(res => {
        this.loading = false
        const { code, data } = res
        if (code === '000000') {
          this.textFileWebUrl = data.detail.textFileUrl
          localStorage.setItem('textFileWebUrl', this.textFileWebUrl)
          console.log(222222222, item.dbPathUrl)
          localStorage.setItem('dbPathUrl', item.dbPathUrl)
          this.$emit('fatherMethod')
          window.open(
            `/resumeUpload?id=${item.resumeId}&extension=${item.extension}`
          )
        }
      })
    },
    toResumeUpload(item) {
      this.getResumeInfoById(item)
    },
    destroyedInterval() {
      console.log('关闭右侧弹框')
      if (this.$route.name === 'resume') {
        //  只有在非简历页才跳转简历页
        this.$router.push({ name: 'resume', query: { refresh: true } })
      }
      window.clearInterval(interval)
    },
    getResumeFile() {
      getResumeFile().then(res => {
        this.uploadSuccess = false
        window.clearInterval(interval)
        const { code, data } = res
        if (code === '000000') {
          this.uploadVisible = false
          this.listData = data
          const flag = data.filter((item, index) => {
            return data[index].statusNo === 1 || data[index].statusNo === 2
          })

          // let time = 10
          // const intervalFunc = window.setInterval(() => {
          //   time = time - 1
          //   console.log(time)
          //   if (time < 1) {
          //     window.clearInterval(intervalFunc)
          //   }
          // }, 1000)
          interval = setInterval(() => {
            console.log(11111111, Array.isArray(flag) && flag.length === 0)
            if (Array.isArray(flag) && flag.length === 0) {
              window.clearInterval(interval)
            } else {
              getResumeFile().then(res => {
                const { code, data } = res
                if (code === '000000') {
                  this.uploadVisible = false
                  this.listData = data
                }
              })
            }
          }, 3000)
        }
      })
    },
    handleProgress(res, files, fileList) {
      this.uploadSuccess = true
      this.fileList = [fileList[fileList.length - 1]]
      console.log('上传时', res, files, this.fileList)
      if (fileList.length > 10) {
        this.$message.warning(`当前限制选择 10 个文件`)
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code === '000000') {
        // const folderDataResume = JSON.parse(sessionStorage.getItem('folderDataResume'))
        // if (folderDataResume && folderDataResume.id) {
        //   this.$emit('finishUpload')
        // }
        this.$emit('finishUpload')
        // this.$message({
        //   message: '上传成功',
        //   type: 'success'
        // })
        // this.uploadVisible = false
        this.getResumeFile()
        // interval = setInterval(() => {
        //   this.getResumeFile()
        //   clearInterval(interval)
        //   this.uploadVisible = false
        // }, 3000)
      } else {
        this.uploadVisible = false
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    beforeAvatarUpload(file) {
      let fileType = file && file.name
      const index = fileType.lastIndexOf('.')
      fileType = fileType.substring(index + 1, fileType.length)
      const isLt2M = file.size / 1024 / 1024 < 10
      this.uploadVisible = true
      this.paramsData.ossFileType = 'resumeInformation'

      // 加入文件夹
      const folderDataResume = JSON.parse(sessionStorage.getItem('folderDataResume'))
      if (folderDataResume && folderDataResume.id) {
         this.paramsData.folderId = folderDataResume.id
      }

     // this.paramsData.talentPoolId = ''
      if (
        fileType !== 'doc' &&
        fileType !== 'docx' &&
        fileType !== 'pdf' &&
        fileType !== 'jpg' &&
        fileType !== 'png' &&
        fileType !== 'wps' &&
        fileType !== 'txt' &&
        fileType !== 'html'
      ) {
        this.$message.error(
          '只支持doc、docx、pdf、jpg、png、wps、txt、html格式附件!'
        )
        this.uploadVisible = false
      }
      if (!isLt2M) {
        this.$message.error('上传附件大小不能超过 10MB!')
        this.uploadVisible = false
      }
      return (
        (fileType === 'doc' ||
          fileType === 'docx' ||
          fileType === 'pdf' ||
          fileType === 'jpg' ||
          fileType === 'png' ||
          fileType === 'wps' ||
          fileType === 'txt' ||
          fileType === 'html') &&
        isLt2M
      )
    },
    handleExceed(files, fileList) {
      console.log(111111111, fileList)
      this.$message.warning(`当前限制选择 10 个文件`)
    }
  }
}
</script>
<style  lang="scss">
.upload-resume-drawer {
  padding: 20px;
  .upload-list {
    .el-loading-spinner {
      margin-top: 50px;
    }
    .el-progress__text {
      display: none;
    }
    li {
      background-color: #fff;
      position: relative;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      .el-progress {
        position: absolute;
        bottom: 0px;
        width: 100%;
        .el-progress-bar__outer {
          height: 4px !important;
          background-color: #e5e5e5;
        }
        .el-progress-bar__inner {
          height: 4px;
          background-color: #1678f9;
        }
      }
      .file-name {
        font-size: 14px;
        color: #333333;
        display: inline-block;
        cursor: pointer;
        width: 620px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &:hover {
          color: #1678f9;
        }
      }
      .percent {
        display: inline-block;
        float: right;
        font-size: 14px;
        .num {
          color: #1678f9;
          cursor: pointer;
        }
      }
    }
  }
  .el-upload-dragger {
    width: 800px;
    height: 290px;
    border: none;
    background-color: #fff;
    border-radius: 8px;
  }
  .el-icon-upload {
    margin: 40px 0 !important;
  }
  .el-icon-upload:before {
    display: inline-block;
    content: '';
    width: 72px;
    height: 72px;
    background: url('~@/assets/images/resume/add.png') no-repeat;
    background-size: 72px;
  }
  .el-upload__text {
    margin-bottom: 30px;
    font-size: 14px;
    color: #7f7f7f;
    em {
      color: #1678f9;
    }
  }
  .text {
    font-size: 12px;
    color: #b3b3b3;
    margin-bottom: 4px;
  }
  .tip {
    font-size: 12px;
    color: #ff5d1e;
  }
  .el-upload__tip {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 40px auto 20px auto;
    span {
      font-weight: normal;
      float: right;
      font-size: 14px;
      color: #999;
    }
  }
  .el-upload-list__item {
    margin-bottom: 20px;
    height: 60px;
    background-color: #fff;
    border-radius: 8px;
    .el-icon-document {
      display: none;
    }
    .el-upload-list__item-name {
      padding: 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: #333333;
    }
  }
}
</style>
