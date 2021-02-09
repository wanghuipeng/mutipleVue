<template>
  <el-dialog
    :visible.sync="dialog"
    top="8vh"
    lock-scroll
    width="800px"
    :before-close="handleClose"
  >
    <div v-show="!showResult" slot="title" class="header">
      <p class="title">添加简历（Excel导入）</p>
      <P class="desc">新简历将自动加入到【{{ currData.name }}】
        <el-popover
          width="160"
          placement="bottom-end"
          trigger="hover"
        >
          <el-tree
            ref="dataTree"
            class="data-tree"
            :data="treeData"
            :props="{ label: 'name' }"
            node-key="id"
            :expand-on-click-node="false"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="data-tree-tool-bar">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <span slot="reference" class="el-dropdown-link" style="cursor: pointer;">
            （修改）
          </span>
        </el-popover>
      </P>
    </div>
    <div v-show="!showResult">
      <div class="upload">
        <el-upload
          class="upload1"
          :headers="headers"
          :data="paramsData"
          :action="uploadAction"
          :show-file-list="false"
          :accept="accept"
          :http-request="customUpload"
        >
          <el-button size="small" type="primary">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">
            支持20MB以内的xls、xlsx、csv数据不能超过10000行、200列<br/>
            如导入的字段涉及数据验证，数据不能超100行、200列
            <p>
              <el-button type="text" @click="downloadTemplate">（下载导入模板）</el-button>
            </p>
          </div>
        </el-upload>
        <el-upload
          class="upload2"
          drag
          :headers="headers"
          :data="paramsData"
          :action="uploadAction"
          :show-file-list="false"
          :http-request="customUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">或将文件拖到此处</div>
        </el-upload>
      </div>
      <div v-if="percentage > 0" class="progress">
        <el-progress :text-inside="true" :stroke-width="16" :percentage="percentage"></el-progress>
        <p v-if="percentage !== 100 && !uploadEnd">文件上传中{{ percentage }}%</p>
        <div v-else-if="percentage === 100 && !uploadEnd">
          <p>文件上传成功...</p>
          <p>正在提交推荐名单，请勿关闭窗口...</p>
        </div>
        <div v-else>
          <p v-if="uploadSuccess">推荐完成<el-button type="text" @click="showResult = true">（点击查看本次推荐结果）</el-button></p>
          <p v-else>导入失败</p>
        </div>
      </div>
    </div>

    <!-- 推荐结果 -->
    <add-result
      :dialog.sync="showResult"
      :list="addList"
      @continues="continues"
      @close="handleClose"
    />
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import addResult from './addResult'
import { getTalentPoolSelect } from '@/api/resume'
import { getImportResumeExcelTemplate } from '@/api/order'
export default {
  components: {
    addResult
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    positionId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      treeData: [], // 人才库数据源
      currData: {}, // 当前选中节点
      headers: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      paramsData: {},
      uploadAction: '/candidate/resumeBase/uploadExcel',
      percentage: 0,
      uploadEnd: false,
      uploadSuccess: false,
      addList: {},
      showResult: false
    }
  },
  created() {
    // 查询人才库
    this.queryTalentPool();
  },
  methods: {
    // 查询人才库
    queryTalentPool() {
      const para = {};
      getTalentPoolSelect(para).then(data => {
        this.treeData = data.data || [];
        this.currData = this.treeData[0]; // 默认选中第一个
      });
    },
    // 切换人才库
    handleNodeClick(data) {
      this.currData = data;
    },
    // 批量导入
    customUpload(file) {
      console.log(file.file.name, file.file.name.indexOf('xls') !== -1, file.file.name.indexOf('xlsx') !== -1, file.file.name.indexOf('csv') !== -1)
      if (file.file.name.indexOf('xls') !== -1 || file.file.name.indexOf('xlsx') !== -1 || file.file.name.indexOf('csv') !== -1) {
        this.percentage = 0
        this.uploadEnd = false
        this.uploadSuccess = false
        const FormDatas = new FormData();
        FormDatas.append('file', file.file);
        FormDatas.append('positionId', this.positionId);
        FormDatas.append('resumePoolId', this.currData.id);
        axios({
            url: this.uploadAction,
            method: 'post',
            data: FormDatas,
            onUploadProgress: (progressEvent) => {
              this.percentage = progressEvent.loaded / progressEvent.total * 100 | 0; // 百分比
              console.log(this.percentage)
            }
        }).then(data => {
          setTimeout(() => {
            this.uploadEnd = true
            this.uploadSuccess = true
          }, 300)
          this.addList = data.data.data
        }).catch(err => {
          console.log(err)
          setTimeout(() => {
            this.uploadEnd = true
            this.uploadSuccess = false
          }, 300)
        })
      } else {
        this.$message.error('请上传正确的格式');
      }
    },
    // 下载模板
    downloadTemplate() {
      console.log(this.positionId)
      const params = {
        positionId: this.positionId
      }
      getImportResumeExcelTemplate(params).then(res => {
        const content = res.data; // 文件流
        const blob = new Blob([content]);
        const fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1].replace(/"/g, ''))
        console.log(fileName)
        if ('download' in document.createElement('a')) { // 非IE下载
            const link = document.createElement('a')
            link.download = fileName
            // link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(link.href) // 释放URL 对象
            document.body.removeChild(link)
        } else { // IE10+下载
          navigator.msSaveBlob(blob);
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialog', false)
      this.$emit('updateList')
    },
    // 继续
    continues() {
      this.showResult = false
      this.percentage = 0
      this.uploadEnd = false
      this.addList = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .desc {
    font-size: 12px;
    margin-right: 20px;
  }
}
::v-deep .el-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  background: #F9FAFB;
  padding: 20px;
  margin-bottom: 20px;
  .upload1 {
    text-align: center;
    margin-right: 30px;
    position: relative;
    &::before {
      content: '';
      width: 1px;
      height: 150px;
      background: #d9d9d9;
      position: absolute;
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
    }
    .el-upload__tip {
      p {
        margin-top: 16px;
        .el-button {
          font-size: 12px;
          color: #F56C6C;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  ::v-deep .el-upload-dragger {
    border: 0;
    background: #F9FAFB;
  }
}
.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  .el-progress {
    width: 100%;
  }
  p {
    text-align: center;
    margin-top: 16px;
    .el-button {
      padding: 0;
    }
  }
}
</style>
