<template>
  <div class="import-component">
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step v-if="$props.fromFlag === 'promoter'" title="导入促销员 (准备及上传文件)"></el-step>
      <el-step v-if="$props.fromFlag === 'task'" title="导入任务 (准备及上传文件)"></el-step>
      <el-step v-if="$props.fromFlag === 'sku'" title="导入SKU (准备及上传文件)"></el-step>
      <el-step title="导入结果确认"></el-step>
    </el-steps>
    <div v-if="!nextVisible" v-loading="upLoading" element-loading-spinner="el-icon-loading" element-loading-text="正在上传中..." class="upload-card">
      <!-- <p class="title">
        <span v-if="$props.fromFlag === 'promoter'">导入促销员</span>
        <span v-if="$props.fromFlag === 'task'">导入任务</span>
        <span v-if="$props.fromFlag === 'sku'">导入SKU</span>
        （准备及上传文件）</p> -->
      <div v-if="$props.fromFlag === 'task'" class="radios">
        <el-radio v-model="radioFlag" label="new">批量新增</el-radio>
        <el-radio v-model="radioFlag" label="update">批量更新</el-radio>
      </div>
      <div class="text">
        <p class="title-1">① 准备文件</p>
        <div v-if="$props.fromFlag === 'task'" class="content">
          <p>每次导入的任务数最多不超过3000条，所有允许导入的任务字段请参考模版；任务字段不符合规则，则整条任务不予以导入。</p>
          <p>字段导入规则：</p>
          <div v-if="toggleVisible" class="more-text">
            1）「编号」字段为必填项，如有客户编号建议直接填客户编号，如无客户编号则自行编号即可。
            <br />
            2）「任务名称」未必填，请填写客户提供的商超/网点名称。
            <br />
            3）「省」「市」「区」请按国家最新省市区标准数据表填写，如填写有误会导致该地址定位错误。
            <br />
            4）「执行频率」请填写：仅一次、每周一次、每月一次。
            <br />
            5）「开始日期」「结束日期」格式为：YYYY/MM/DD，注意结束日期必须大于开始日期。
            <br />
            6）「促销员姓名」「促销员手机号」为必填项。
          </div>
          <el-link class="mt-10" type="primary" @click="downloadTemplate"><i class="el-icon-download"></i> 下载导入模板</el-link>
        </div>
        <div v-if="$props.fromFlag === 'promoter'" class="content">
          <p>每次导入的任务数最多不超过3000条，所有允许导入的任务字段请参考模版；任务字段不符合规则，则整条任务不予以导入。</p>
          <p>字段导入规则：</p>
          <div v-if="toggleVisible" class="more-text">
            1）「促销员姓名」为必填项，请填写促销员真实姓名。
            <br />
            2）「促销员手机号」为必填项，请填写促销员的有效手机号码，如号码或是格式错误会导致促销员无法正常登录。
            <br />
            3）其它字段均为选填内容。
          </div>
          <el-link class="mt-10" type="primary" @click="downloadTemplate"><i class="el-icon-download"></i> 下载导入模板</el-link>
        </div>
        <div v-if="$props.fromFlag === 'sku'" class="content">
          <p>每次导入的任务数最多不超过3000条，所有允许导入的任务字段请参考模版；任务字段不符合规则，则整条任务不予以导入。</p>
          <p>字段导入规则：</p>
          <div v-if="toggleVisible" class="more-text">
            1）「SKU编号」为必填项，如客户提供产品编号建议直接填编号，如无编号则自行编号即可。
            <br />
            2）「SKU名称」为必填项，请填写客户提供的产品SKU名称。
            <br />
            3）「品类」为选填项，根据实际业务情况填写文字内容即可。
            <br />
            4）「条形码」为选填项。
            <br />
            5）「零售价」为选填项：请填写客户提供的零售参考价格。
          </div>
          <el-link class="mt-10" type="primary" @click="downloadTemplate"><i class="el-icon-download"></i> 下载导入模板</el-link>
        </div>
        <p class="title-1">② 上传数据文件</p>
        <div class="content">
          <el-upload
            drag
            :data="paramsData"
            :action="uploadResumeUrl"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleProgress"
            :on-exceed="handleExceed"
            :headers="headersMsg"
            :limit="1"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖至区域处或<em>点击上传</em></div>
            <div class="text">目前支持的文件类型为“.xls，.xlsx”</div>
          </el-upload>
        </div>
      </div>
      <el-button :loading="nextLoading" size="small" type="primary" @click="nextStep">下一步</el-button>
    </div>

    <!-- 下一步 -->
    <div v-else class="next-step">
      <!-- 正确数据表格 -->
      <div class="table-block">
        <p class="title">
          <span v-if="$props.fromFlag === 'promoter'">导入促销员</span>
          <span v-if="$props.fromFlag === 'task'">导入任务</span>
          <span v-if="$props.fromFlag === 'sku'">导入SKU</span>
          （导入结果确认）</p>
        <p class="sub-title">本次上传文件共包含 {{ totalCount || 0 }} 条数据</p>
        <p class="table-title">以下 {{ successCount || 0 }} 条数据可导入，点击「确认导入」按钮将导入并发布数据</p>
        <div class="inner-table">
          <el-table
            ref="dataTable"
            v-loading="loading1"
            class="mt-10"
            :data="listData1"
            border
            highlight-current-row
          >
            <el-table-column
              v-for="(item,index) in titleArr"
              :key="index"
              :prop="item.value"
              :label="item.label"
              :width="item.width"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[item.value] }}</span>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            small
            class="mt-10"
            background
            :total="total1"
            :current-page="pageNumber1"
            :page-size="pageSize1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
      </div>
      <!-- 错误数据表格 -->
      <div class="table-block">
        <p class="table-title">以下 {{ abnormalCount }} 条数据无法导入，将不会被导入</p>
        <!-- <p class="table-title">以下 {{ abnormalCount }} 条数据无法导入（<el-link type="primary" @click="downloadIt">点击下载文件</el-link>），将不会被导入</p> -->
        <div class="inner-table">
          <el-table
            ref="dataTable"
            v-loading="loading2"
            class="mt-10"
            :data="listData2"
            border
            highlight-current-row
          >
            <el-table-column
              v-for="(item,index) in titleArr"
              :key="index"
              :prop="item.value"
              :label="item.label"
              :width="item.width"
              align="center"
            >
              <template slot-scope="scope">
                <template v-if="scope.row[item.value]">
                  <span v-if="scope.row[item.value].error" class="red">{{ scope.row[item.value].initialText }}
                    <el-tooltip effect="dark" placement="top-start">
                      <div slot="content" class="red">{{ scope.row[item.value].errorText }}</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <!-- <span v-if="scope.row[item.value].error" class="red">{{ scope.row[item.value].initialText }}---{{ scope.row[item.value].errorText }}</span> -->
                  <span v-else>{{ scope.row[item.value] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            small
            class="mt-10"
            background
            :total="total2"
            :current-page="pageNumber2"
            :page-size="pageSize2"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </div>
      </div>

      <div class="oprerate-btns">
        <el-button :loading="sureLoading" size="small" type="primary" @click="sureIt">确认导入</el-button>
        <el-button size="small" @click="goBack">上一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex';
import { getImportFileDetail, searchImportDataPage, excuteSaveImportFile } from '@/api/promoter/projectApi';

export default {
  props: {
    fromFlag: {
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
        activeStep: 0,
        upLoading: false,
        sureLoading: false,
        fileList: [],
        importFileId: null,
        nextVisible: false,
        nextLoading: false,
        totalCount: null, // 总个数
        successCount: null, // 成功个数
        abnormalCount: null, // 失败个数
        titleJson: [], // 表头
        titleArr: [], // 表头重构
        abnormalMessageArr: [], // 重构错误校验结果
        loading1: false,
        listData1: [],
        pageNumber1: 1,
        pageSize1: 10,
        total1: 0,
        loading2: false,
        listData2: [],
        pageNumber2: 1,
        pageSize2: 10,
        total2: 0,
        checkResult1: false, // 获取正确的数据表单
        checkResult2: false, // 获取错误的数据表单
        radioFlag: 'new',
        toggleVisible: true,
        headersMsg: {
            'x-client-token': ''
        },
        paramsData: {},
        uploadResumeUrl: '/api/promoter/import_file/uploadExcelFile',
        limit: 1,
        importSceneType: ''
      }
  },
  computed: {
      ...mapState({
        dictData: (state) => state.common.dictData,
        userInfo: state => {
          return state.userInfo
        },
        projectId: state => state.promoter.projectId
      })
  },
  watch: {

  },
  created() {
    this.headersMsg['x-client-token'] = Vue.ls.get('x-client-token')
  },
  mounted() {},
  methods: {
    downloadIt() {
      this.$message.warning('待研发...')
    },
    toggle() {
      this.toggleVisible = !this.toggleVisible
    },
    handleSizeChange1(val) {
    console.log(`每页 ${val} 条`)
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`)
      this.pageNumber1 = val
      this.searchImportDataPage(true)
      this.searchImportDataPage(false)
    },
    handleSizeChange2(val) {
    console.log(`每页 ${val} 条`)
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`)
      this.pageNumber2 = val
      this.searchImportDataPage(false)
      this.searchImportDataPage(true)
    },
    sureIt() {
      if (!this.successCount) {
        this.$message.error('无法导入, 请保证数据填写正确!')
      } else {
        this.sureLoading = true
        this.excuteSaveImportFile()
      }
    },
    goBack() {
        this.upLoading = false
        this.nextVisible = false
        this.listData1 = []
        this.listData2 = []
        this.abnormalMessageArr = []
        this.titleArr = []
    },
    cancelIt() {},
    excuteSaveImportFile() {
      const { importFileId } = this
      const params = {
        importFileId
      }
      excuteSaveImportFile(params).then((res) => {
        this.sureLoading = false
        const { code, message } = res
        if (code === '000000') {
          this.$message.success('导入成功')
          this.activeStep = 2
          setTimeout(() => {
            this.$emit('reload')
          }, 1500);
        } else {
          this.$message.error(message)
        }
      });
    },
      // 获取文件列表
    searchImportDataPage(checkResult) {
      this.listData1 = []
      this.listData2 = []
      const { importFileId } = this
      const params = {}
      params.importFileId = importFileId
      params.checkResult = checkResult
      console.log(111111111, checkResult)
      if (checkResult) {
        params.pageNumber = this.pageNumber1
        params.pageSize = this.pageSize1
      } else {
        params.pageNumber = this.pageNumber2
        params.pageSize = this.pageSize2
      }
      searchImportDataPage(params).then((res) => {
        this.nextVisible = true
        this.nextLoading = false;
        const { code, data } = res
        if (code === '000000') {
            if (checkResult) { // 正确表格
                this.total1 = data.total
                const { records } = data
                records && records.filter(item => {
                    this.listData1.push(item.sourceDataJson)
                })
            } else { // 错误表格
                this.total2 = data.total
                const { records } = data
                records && records.filter(item => {
                    const obj1 = item.sourceDataJson
                    const obj2 = item.abnormalMessageJson
                    for (const i in obj2) {
                      obj2[i] = {
                        error: true,
                        errorText: obj2[i],
                        initialText: obj1[i]
                      }
                    }
                    console.log(222222222, obj2)
                    const obj3 = Object.assign(obj1, obj2)
                    this.listData2.push(obj3)
                })
                console.log('错误校验------', this.abnormalMessageArr)
            }

          console.log('正确表格', this.listData1)
          console.log('错误表格', this.listData2)
        }
      });
    },
    //* ************************ JSON对象属性排序*********************************//
   objectOrder(obj) { // 排序的函数
      var newkey = Object.keys(obj).sort(); // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newObj = {};// 创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) { // 遍历newkey数组
          newObj[newkey[i]] = obj[newkey[i]];// 向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj;// 返回排好序的新对象
    },
    // 获取文件详情
    getImportFileDetail() {
      const params = {
        importFileId: this.importFileId
      }
      getImportFileDetail(params).then((res) => {
        this.nextVisible = true
        this.nextLoading = false;
        const { code, data } = res
        if (code === '000000') {
          this.totalCount = data.totalCount
          this.successCount = data.successCount
          if (this.successCount) {
            this.checkResult1 = true
          }
          this.abnormalCount = data.abnormalCount
          if (this.abnormalCount) {
            this.checkResult2 = true
          }
          // this.titleJson = this.objectOrder(data.titleJson)
          // console.log('表头1', data.titleJson)
          // for (const item in this.titleJson) {
          //     console.log(item, this.titleJson[item])
          //     this.titleArr.push({
          //         value: item,
          //         label: this.titleJson[item]
          //     })
          // }
          this.titleJson = data.titleJson
          this.titleJson.filter(item => {
            if (item.code === 'taskName') {
              this.titleArr.push({
                  width: 140,
                  value: item.code,
                  label: item.text
              })
            } else if (item.code === 'address') {
              this.titleArr.push({
                  width: 280,
                  value: item.code,
                  label: item.text
              })
            } else {
              this.titleArr.push({
                  value: item.code,
                  label: item.text
              })
            }
          })
          console.log('表头2', this.titleArr)
          console.log('正确表格', this.checkResult1)
          console.log('错误表格', this.checkResult2)
          if (this.checkResult1) {
            this.searchImportDataPage(true)
          }
          if (this.checkResult2) {
            this.searchImportDataPage(false)
          }
        }
      });
    },
    downloadTemplate() {
      let host = window.location.host
      console.log('host', host)
      let url = ''
      let staticUrl = ''
      if (this.$props.fromFlag === 'promoter') { // 促销员
        staticUrl = '/static/template/hh/batch_import/%E5%A4%A7%E7%8C%8E%E4%BC%97%E5%8C%85-%E4%BF%83%E9%94%80%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
      } else if (this.$props.fromFlag === 'task') { // 任务
        staticUrl = '/static/template/hh/batch_import/%E5%A4%A7%E7%8C%8E%E4%BC%97%E5%8C%85-%E4%BB%BB%E5%8A%A1%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
      } else if (this.$props.fromFlag === 'sku') { // SKU
        staticUrl = '/static/template/hh/batch_import/%E5%A4%A7%E7%8C%8E%E4%BC%97%E5%8C%85-SKU%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
      }
      if (host.indexOf('localhost') !== -1 || host.indexOf('hh.dalie.zpstar.com') !== -1) {
        host = 'https://img.dalie.zpstar.com'
        url = host + staticUrl
      } else if (host.indexOf('h.dalieyingcai.com') !== -1) {
        host = 'https://oss.dalieyingcai.com'
        url = host + staticUrl
      }
      console.log('url', url)
      const link = document.createElement('a')
      link.href = url
      link.click()
    },
    nextStep() {
      this.fileList = []
      if (this.importFileId) {
        this.nextLoading = true
        this.getImportFileDetail()
        this.activeStep = 1
      } else {
        this.$message.error('请先上传数据文件')
      }
    },
     // 上传excel文件
    beforeAvatarUpload(file) {
      console.log(this.$props.fromFlag)
      this.upLoading = true
      if (this.$props.fromFlag === 'promoter') { // 促销员
        this.paramsData.importSceneType = 'IMPORT_PROMOTER_USER'
        this.paramsData.importFromId = this.userInfo.companyId
      } else if (this.$props.fromFlag === 'task') { // 任务
        if (this.radioFlag === 'new') {
          this.paramsData.importSceneType = 'IMPORT_PROMOTER_TASK_NEW'
        } else if (this.radioFlag === 'update') {
          this.paramsData.importSceneType = 'IMPORT_PROMOTER_TASK_UPDATE'
        }
        this.paramsData.importFromId = this.$route.query.projectId || this.projectId // 项目id
      } else if (this.$props.fromFlag === 'sku') { // SKU
        this.paramsData.importSceneType = 'IMPORT_PROMOTER_SKU'
        this.paramsData.importFromId = this.$route.query.projectId || this.projectId // 项目id
      }

      let fileType = file && file.name
      const index = fileType.lastIndexOf('.')
      fileType = fileType.substring(index + 1, fileType.length)
      const isLt2M = file.size / 1024 / 1024 < 50
      if (
        fileType !== 'xls' &&
        fileType !== 'xlsx'
      ) {
        this.$message.error(
          '只支持xls、xlsx格式附件!'
        )
        this.upLoading = false
      }
      if (!isLt2M) {
        this.$message.error('上传附件大小不能超过 50MB!')
        this.upLoading = false
      }

      return (
        (fileType === 'xls' ||
          fileType === 'xlsx') &&
        isLt2M
      )
    },
    handleProgress(res, files, fileList) {
      console.log('handleProgress', res, files, fileList)
      this.uploadSuccess = true
      this.fileList = [fileList[fileList.length - 1]]
      console.log('上传时', res, files, this.fileList)
      if (fileList.length > 1) {
        this.$message.warning(`当前限制选择 1 个文件`)
      }
    },
    handleAvatarSuccess(res, file) {
      this.upLoading = false
      console.log('handleAvatarSuccess', res)
      if (res.code === '000000') {
        console.log('详情id', res.data);
        this.importFileId = res.data
        // this.$message({
        //   message: '上传成功',
        //   type: 'success'
        // });
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    handleExceed(file, fileList) {
      console.log('handleExceed', file, fileList)
      if (file.length > this.limit) {
        this.$message({
          message: `最多上传${this.limit}个Excel文件`,
          type: 'error'
        });
      }
    }
  }
};
</script>

<style lang="scss" >
.import-component{
   margin-top: 15px;
   padding-bottom: 40px;
   box-sizing: border-box;
   .el-upload-list{
     height: 20px;
   }
   .el-steps{
     width: 650px;
     margin: -15px auto 5px auto;
   }
   .file-name{
     color: #666;
     vertical-align: middle;
     margin-top: 30px;
   }
  .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
      font-size: 12px;
      padding: 0;
  }
  .el-table td, .el-table th{
    padding: 2px 0;
  }
  .red{
    color: #EA2B3F;
    padding: 0;
    font-size: 12px;
  }
  .more-text{
    line-height: 24px;
    font-size: 14px;
    color: #999;
    margin-top: 0px;
  }
  .btn-more{
    margin: 0 !important;
    padding: 0;
    display: inline-block;
  }
    .inner-table{
        position: relative;
        .el-icon-question{
          font-size: 18px;
          vertical-align: -2px;
        }
        .el-pagination{
            position: absolute;
            right: 0;
            top: -45px;
        }
    }
    .oprerate-btns{
        margin-top: 30px;
        position: fixed;
        bottom: 0;
        width: 98%;
        left: 1%;
        box-sizing: border-box;
        background: #fff;
        text-align: center;
        padding: 10px;
        z-index: 1000;
    }
    .el-table__empty-block{
        height: auto !important;
    }
     .next-step{
         .title{
             margin-bottom: 5px;
         }
         .sub-title{
             font-size: 14px;
             color: #666;
         }
         .table-title{
             margin-top: 30px;
             font-size: 14px;
         }
     }
    .el-upload-dragger{
         width: 500px;
    height: 195px;
    border: none;
    background-color: #fff;
    border-radius: 8px;
        border: 1px dashed #ccc;
    }
  //   .el-icon-upload:before {
  //   display: inline-block;
  //   content: '';
  //   width: 72px;
  //   height: 72px;
  //   background: url('~@/assets/images/resume/add.png') no-repeat;
  //   background-size: 72px;
  // }
  .el-upload__text {
    margin-bottom: 10px;
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
    .title{
        margin-bottom: 20px;
        font-size: 16px;
    }
   .upload-card{
       margin-bottom: 20px;
       background-color: #fff;
       padding:0 16px 5px 16px;
       border-radius: 4px;
       border: 1px dashed #eee;
       .radios{
           margin: 15px 0 30px 0;
       }
       .text{
           padding-left: 5px !important;
           margin-bottom: 15px;
       }
       .title-1{
           color: #666;
           margin: 20px 0 5px 0;
           font-size: 14px;
       }
       .content{
           font-size: 14px;
           color: #666;
           p{
             line-height: 22px;
           }
       }
       button{
           margin: 0px 0 10px 5px;
       }
   }
}
</style>
