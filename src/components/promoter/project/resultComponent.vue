<template>
  <div class="look-panel-modal">
    <div class="header">
      <div class="left">
        <el-tag size="mini">{{ detailData1.planStatus | filterCommonDict(dictData.dicts.promoterPlanStatus) }}</el-tag>
        <span>{{ detailData1.taskName }}</span>
      </div>
      <div class="right">
        <el-button v-if="userInfo.companyAccountType !== 3" type="default" size="mini" @click="toRepeat">重做</el-button>
      </div>
    </div>
    <div class="out">
      <div class="contents">
        <div v-for="(a,b) in detailData2" :key="b" class="cont-item">
          <p class="title">{{ b+1 }}. {{ a.questionnaireName }}</p>
          <el-form ref="form" size="mini" label-width="180px">
            <!-- 陈列核查 -->
            <template v-if="a.questionnaireType === 1 && a.questionnaireList && a.questionnaireList[0]">
              <el-form-item v-for="(c,d) in a.questionnaireList[0].questionList" :key="d" :label="c.questionName+'：'">
                <!-- 单选框 -->
                <template v-if="c.formType === 'RADIO' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 多选 -->
                <template v-else-if="c.formType === 'MULTIPLE_SELECT' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 单张图片 -->
                <template v-else-if="c.formType === 'ONE_IMAGE' && c.result">
                  <el-image
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[0]"
                    :preview-src-list="c.result"
                    @click="previewIt(c.result[0])"
                  >
                  </el-image>
                </template>
                <!-- 多张图片 -->
                <template v-else-if="c.formType === 'MULTIPLE_IMAGE' && c.result">
                  <el-image
                    v-for="(item,index) in c.result"
                    :key="index"
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[index]"
                    :preview-src-list="c.result"
                    @click="previewSomes"
                  >
                  </el-image>
                </template>
                <span v-else class="blue">{{ c.result || '-' }}</span>
              </el-form-item>
            </template>
            <!-- 理货汇报 -->
            <template v-if="a.questionnaireType === 2 && a.questionnaireList">
              <div v-for="(c,d) in a.questionnaireList" :key="d" class="inner-item">
                <p class="sub-title">————【{{ c.groupName }}】</p>
                <el-form-item v-for="(e,f) in c.questionList" :key="f" :label="e.questionName+'：'">
                  <!-- 单选框 -->
                  <template v-if="e.formType === 'RADIO' && c.result">
                    <span v-for="(g,h) in e.result" :key="h" class="blue">
                      <template v-if="g.checked">{{ g.label }}</template>
                    </span>
                  </template>
                  <!-- 多选 -->
                  <template v-else-if="e.formType === 'MULTIPLE_SELECT' && c.result">
                    <span v-for="(g,h) in e.result" :key="h" class="blue">
                      <template v-if="g.checked">{{ g.label }}</template>
                    </span>
                  </template>
                  <!-- 单张图片 -->
                  <template v-else-if="e.formType === 'ONE_IMAGE' && c.result">
                    <el-image
                      fit="cover"
                      style="width: 100px; height: 100px"
                      :src="c.result[0]"
                      :preview-src-list="c.result"
                      @click="previewIt(c.result[0])"
                    >
                    </el-image>
                  </template>
                  <!-- 多张图片 -->
                  <template v-else-if="e.formType === 'MULTIPLE_IMAGE' && c.result">
                    <el-image
                      v-for="(item,index) in c.result"
                      :key="index"
                      fit="cover"
                      style="width: 100px; height: 100px"
                      :src="c.result[index]"
                      :preview-src-list="c.result"
                      @click="previewSomes"
                    >
                    </el-image>
                  </template>
                  <span v-else class="blue">{{ e.result || '-' }}</span>
                </el-form-item>
              </div>
            </template>
            <!-- 异常报告 -->
            <template v-if="a.questionnaireType === 3 && a.questionnaireList && a.questionnaireList[0]">
              <el-form-item v-for="(c,d) in a.questionnaireList[0].questionList" :key="d" :label="c.questionName+'：'">
                <!-- 单选框 -->
                <template v-if="c.formType === 'RADIO' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 多选 -->
                <template v-else-if="c.formType === 'MULTIPLE_SELECT' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 单张图片 -->
                <template v-else-if="c.formType === 'ONE_IMAGE' && c.result">
                  <el-image
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[0]"
                    :preview-src-list="c.result"
                    @click="previewIt(c.result[0])"
                  >
                  </el-image>
                </template>
                <!-- 多张图片 -->
                <template v-else-if="c.formType === 'MULTIPLE_IMAGE' && c.result">
                  <el-image
                    v-for="(item,index) in c.result"
                    :key="index"
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[index]"
                    :preview-src-list="c.result"
                    @click="previewSomes"
                  >
                  </el-image>
                </template>
                <span v-else class="blue">{{ c.result || '-' }}</span>
              </el-form-item>
            </template>
            <!-- 自定义 -->
            <template v-if="(a.questionnaireType === 4 || a.questionnaireType === null) && a.questionnaireList && a.questionnaireList[0]">
              <el-form-item v-for="(c,d) in a.questionnaireList[0].questionList" :key="d" :label="c.questionName+'：'">
                <!-- 单选框 -->
                <template v-if="c.formType === 'RADIO' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 多选 -->
                <template v-else-if="c.formType === 'MULTIPLE_SELECT' && c.result">
                  <span v-for="(g,h) in c.result" :key="h" class="blue">
                    <template v-if="g.checked" >{{ g.label }}</template>
                  </span>
                </template>
                <!-- 单张图片 -->
                <template v-else-if="c.formType === 'ONE_IMAGE' && c.result">
                  <el-image
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[0]"
                    :preview-src-list="c.result"
                    @click="previewIt(c.result[0])"
                  >
                  </el-image>
                </template>
                <!-- 多张图片 -->
                <template v-else-if="c.formType === 'MULTIPLE_IMAGE' && c.result">
                  <el-image
                    v-for="(item,index) in c.result"
                    :key="index"
                    fit="cover"
                    style="width: 100px; height: 100px"
                    :src="c.result[index]"
                    :preview-src-list="c.result"
                    @click="previewSomes"
                  >
                  </el-image>
                </template>
                <span v-else class="blue">{{ c.result || '-' }}</span>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 重做弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="400"
      :show-close="false"
      :append-to-body="true"
      @close="handleClose('repeatForm')"
    >
      <el-form ref="repeatForm" :model="repeatForm" :rules="repeatRules" label-width="90px">
        <el-form-item label="重做原因" prop="redoReason">
          <el-input v-model="repeatForm.redoReason" type="textarea" placeholder="请输入任务重做原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose('repeatForm')">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSure('repeatForm')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="550px"
      class="scan-preview-question"
      lock-scroll
      :show-close="false"
      :append-to-body="true"
      @close="handleCloseImg"
    >
      <div class="main">
        <img :src="webUrl" />
      </div>
      <!-- <span slot="footer">
        <p>请用微信扫描上方小程序码</p>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getPlanQuestionnaireList, getPlanDetail, operatePlanRedo } from '@/api/promoter/projectApi'

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
    },
    taskPlanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detailData1: {},
      detailData2: [],
      loading: false,
      dialogVisible: false,
      repeatForm: {
        redoReason: ''
      },
      repeatRules: {
        redoReason: [{ required: true, message: '请输入任务重做原因', trigger: 'blur' }]
      },
      imgVisible: false,
      webUrl: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      },
      dictData: state => state.common.dictData
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
  },
  mounted() {
    console.log('this.$props.taskPlanId', this.$props.taskPlanId)
    this.getPlanDetail(this.$props.taskPlanId)
    this.getPlanQuestionnaireList(this.$props.taskPlanId)
  },
  methods: {
    arrIndexOf(arr, v) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === v) {
                return i;
            }
        }
        return -1;
    },
    previewSomes() {
      var child = document.getElementById('download-file-icon')
      var body = document.getElementById('body');
      child && body.removeChild(child)

      var a = document.createElement('a')
      var txt1 = document.createTextNode('')
      a.setAttribute('id', 'download-file-icon')
      a.setAttribute('class', 'download-file-icon')
      a.appendChild(txt1)
      a.click()
      document.getElementsByTagName('body')[0].appendChild(a)

      const downloadBtn = document.getElementById('download-file-icon');
      const that = this
      setTimeout(() => {
        const img = document.getElementsByTagName('body')[0].getElementsByClassName('el-image-viewer__img')[0]
        console.log('所有图片', img, typeof img)
        const src = img.getAttribute('src')
        downloadBtn.onclick = function() {
          that.downloadImage(src)
        }
      }, 100);
    },
    previewIt(imgsrc) {
      var child = document.getElementById('download-file-icon')
      var body = document.getElementById('body');
      child && body.removeChild(child)

      var a = document.createElement('a')
      var txt1 = document.createTextNode('')
      a.setAttribute('id', 'download-file-icon')
      a.setAttribute('class', 'download-file-icon')
      a.appendChild(txt1)
      a.click()
      document.getElementsByTagName('body')[0].appendChild(a)

      const downloadBtn = document.getElementById('download-file-icon');
      const that = this
      downloadBtn.onclick = function() {
        that.downloadImage(imgsrc)
      }
    },
    downloadImage(imgsrc, name) { // 下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据

        var a = document.createElement('a'); // 生成一个a元素
        var event = new MouseEvent('click'); // 创建一个单击事件
        a.download = name || 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    operatePlanRedo() {
      const { redoReason } = this.repeatForm
      const { taskPlanId } = this
      const params = {
        redoReason,
        taskPlanId
      }
      console.log(params)
      operatePlanRedo(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.$message.success('保存成功')
        }
      })
    },
    handleCloseImg() {
      this.imgVisible = false
    },
    // 图片预览
    preview(url) {
      console.log('预览')
      // this.imgVisible = true
      // this.webUrl = url
    },
    getPlanDetail(taskPlanId) {
      const params = {
        taskPlanId
      }
      console.log('传参', params)
      getPlanDetail(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.detailData1 = data
        }
      })
    },
    getPlanQuestionnaireList(taskPlanId) {
      const params = {
        taskPlanId
      }
      console.log('传参', params)
      getPlanQuestionnaireList(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data && data.filter(item => {
                item.questionnaireList && item.questionnaireList.filter(a => {
                  a.questionList && a.questionList.filter(b => {
                    if (b.result) {
                      if (b.formType === 'ONE_IMAGE' || b.formType === 'MULTIPLE_IMAGE') {
                        console.log(11111111111111, b.result === 'null')
                        if (b.result === 'null') {
                          b.result = null
                        } else {
                          b.result = JSON.parse(b.result)
                          const arr = []
                          const arr1 = []
                          if (b.formType === 'ONE_IMAGE') {
                            b.result && b.result.filter(c => {
                              arr.push(c.url)
                            })
                            b.result = arr
                            console.log('单张图片', b.result)
                          } else if (b.formType === 'MULTIPLE_IMAGE') {
                            console.log(111111111, b.result)
                            b.result && b.result.filter(c => {
                              arr1.push(c.url)
                            })
                            b.result = arr1
                            console.log('多张图片', b.result)
                          }
                        }
                      }
                      // if (b.formType === 'RADIO') {
                      //       if (b.result) {
                      //           const tempJson = JSON.parse(b.formOptionJson)
                      //           tempJson && tempJson.filter(c => {
                      //               if (c.value === b.result) {
                      //                   c.checked = true
                      //               }
                      //           })
                      //           b.result = tempJson
                      //       } else {
                      //           b.result = JSON.parse(b.formOptionJson)
                      //       }
                      // }
                      // if (b.formType === 'MULTIPLE_SELECT') {
                      //       if (b.result) {
                      //           const tempJson = JSON.parse(b.formOptionJson)
                      //           const tempArr = b.result && b.result.split(',')
                      //           tempJson && tempJson.filter(c => {
                      //               tempArr && tempArr.filter(d => {
                      //                   if (c.value === d) {
                      //                       c.checked = true
                      //                   }
                      //               })
                      //           })
                      //           b.result = tempJson
                      //           console.log('多选字典', b.result)
                      //       } else {
                      //           b.result = JSON.parse(b.formOptionJson)
                      //       }
                      // }
                    }
                  })
                })
          })
          this.detailData2 = data
          console.log('重构数据', this.detailData2)
        }
      })
    },
    // 重做
    toRepeat() {
      this.dialogVisible = true
      this.taskPlanId = this.$props.taskPlanId
    },
    handleSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.operatePlanRedo()
          this.handleClose(formName)
        } else {
          return false;
        }
      });
    },
    handleClose(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" >
.download-file-icon{
  display: none;
  position: fixed;
  color: #fff;
  z-index: 10000;
  bottom: 40px;
  left: 50%;
  margin-left: 100px;
  font-size: 14px;
  cursor: pointer;
  &::before{
    content: "";
    width: 23px;
    height: 23px;
    display: inline-block;
    background: url('~@/assets/images/promoter/download.png') no-repeat;
    background-size: 19px;
  }
}
.scan-preview-question  {
  img{
      display: block;
      width: 100%;
      height: auto;
      width: 400px;
      margin: 0 auto;
  }
  p{
    text-align: center;
    font-size: 12px;
    color: #15181B;
  }
}
.look-panel-modal{
    background-color: #f9f9f9;
    height: 100vh;
    .el-image-viewer__img{
      max-height: 81% !important;
    }
    // .el-image-viewer__actions{
    //   padding-right: 50px;
    // }
    .el-image{
      margin-right: 15px;
    }
    .blue{
      color: #409eff;
      white-space: pre-line;
    }
    .out{
      padding: 16px;
    }
    .contents{
      background-color: #fff;
      padding: 16px;
      border-radius: 4px;
      min-height: 90vh;
      border: 1px dashed #eee;
    }
    .cont-item{
      .preview-img{
        width: 148px;
        height: 148px;
        margin-right: 15px;
        object-fit: cover;
        cursor: pointer;
      }
      .title{
        margin-bottom: 20px;
      }
      .inner-item{
        margin-bottom: 40px;

      }
      .sub-title{
        font-size: 14px;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .el-form{
        padding-left: 25px;
        .el-form-item{
          margin-bottom: 10px;
        }
      }
    }
    .el-drawer__body{
        overflow-x: hidden;
    }
    .header{
      background-color: #fff;
       width: 100%;
       padding:0 15px 0 10px;
       box-sizing: border-box;
       display: flex;
       justify-content: space-between;
       font-size: 14px;
       border-bottom: 1px solid #ccc;
       .left{
           line-height: 49px;
           span{
             margin-left: 10px;
           }
       }
       .right{
           display: flex;
           align-items: center;
           p{
              padding: 5px 10px;
              font-size: 12px;
              border: 1px solid #ccc;
              cursor: pointer;
              &:first-child{
                  margin-right: 10px;
              }
           }
       }
       button{
             height: 28px;
             border-radius: 2px;
             vertical-align: middle;
       }
    }
    .title{
        padding: 10px 30px 0 20px;
        font-size: 16px;
        font-weight: 600;
    }
    .el-tabs{
        width: 740px;
        box-sizing: border-box;
        padding:0 20px;
        .el-tabs__header{
            margin-bottom: 0;
        }
        .title{
            font-size: 14px;
            padding: 0;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .el-tabs__content{
            padding: 20px;
            background-color: #f9f9f9;
        }
        .el-form-item{
            margin-bottom: 0;
            img{
                width: 100px;
                height: 100px;
                object-fit: cover;
                margin-left: 15px;
                margin-top: 10px;
                &:first-child{
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
