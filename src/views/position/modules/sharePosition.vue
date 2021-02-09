<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="290px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div v-loading="loading" class="main">
      <canvas v-if="positionInfo.entrySourceType === 'positionDetail'" :id="'mycanvas-positionDetail-' + positionInfo.id" class="mycanvas" width="750" height="1334"></canvas>
      <canvas v-else :id="'mycanvas-' + positionInfo.id" class="mycanvas" width="750" height="1334"></canvas>
    </div>
    <span slot="footer">
      <p>右键复制图片或保存到本地</p>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { getPositionDetailById } from '@/api/position'
import filters from '@/utils/filters'
export default {
  data() {
    return {
      title: '邀请猎头做单',
      visible: false,
      loading: false,
      positionInfo: {},
      // 二维码请求地址
      webUrl: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      }
    }),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的海报信息
    renderPosterInfo() {
      const data = {}
      // 头像
      data.avatar = this.userInfo.avatarUrl || 'https://oss.dalieyingcai.com/static/dalie-wechat-mini-app/img/poster/avatar.png'
      // 描述
      data.description = this.userInfo.nickName + '邀请您帮助一起寻找优秀人才'
      // 职位名称
      data.title = this.positionInfo.title
      // 薪资
      if (this.positionInfo.salaryType === 1) {
        if (this.positionInfo.salaryStart !== this.positionInfo.salaryEnd) {
          data.salary = `${this.positionInfo.salaryStart / 10000}-${this.positionInfo.salaryEnd / 10000}万/年`
        } else {
          data.salary = `${this.positionInfo.salaryStart / 10000}万/年`
        }
      } else if (this.positionInfo.salaryType === 2 && this.positionInfo.monthlySalaryRegime) {
        if (this.positionInfo.salaryStart !== this.positionInfo.salaryEnd) {
          data.salary = `${this.positionInfo.salaryStart / 1000}-${this.positionInfo.salaryEnd / 1000}K*${this.positionInfo.monthlySalaryRegime}薪`
        } else {
          data.salary = `${this.positionInfo.salaryStart / 1000}K*${this.positionInfo.monthlySalaryRegime}薪`
        }
      } else if (this.positionInfo.salaryType === 2 && !this.positionInfo.monthlySalaryRegime) {
        if (this.positionInfo.salaryStart !== this.positionInfo.salaryEnd) {
          data.salary = `${this.positionInfo.salaryStart / 1000}-${this.positionInfo.salaryEnd / 1000}K/月`
        } else {
          data.salary = `${this.positionInfo.salaryStart / 1000}K/月`
        }
      } else if (this.positionInfo.salaryType === 3) {
        if (this.positionInfo.salaryStart !== this.positionInfo.salaryEnd) {
          data.salary = `${this.positionInfo.salaryStart}-${this.positionInfo.salaryEnd}元/天`
        } else {
          data.salary = `${this.positionInfo.salaryStart}元/天`
        }
      } else if (this.positionInfo.salaryType === 4) {
        if (this.positionInfo.salaryStart !== this.positionInfo.salaryEnd) {
          data.salary = `${this.positionInfo.salaryStart}-${this.positionInfo.salaryEnd}元/小时`
        } else {
          data.salary = `${this.positionInfo.salaryStart}元/小时`
        }
      } else {
        data.salary = '面议'
      }
      // 工作城市
      const workCityId = this.positionInfo.workCityId
      if (workCityId) {
        data.workCityName = filters.filterLevel2(
          workCityId,
          this.dictData.areas
        )
      } else {
        data.workCityName = '工作地区不限'
      }
      // 学历要求
      const degreeRequired = this.positionInfo.degreeRequired
      if (degreeRequired) {
        data.degreeName = filters.filterCommonDict(
          degreeRequired,
          this.dictData.dicts.degreeRequired
        )
      } else {
        data.degreeName = '学历不限'
      }
      // 工作年限
      const workYearRequiredStart = this.positionInfo.workYearRequiredStart
      const workYearRequiredEnd = this.positionInfo.workYearRequiredEnd
      if (workYearRequiredStart && workYearRequiredEnd) {
        data.workYearRequiredName =
          workYearRequiredStart + '~' + workYearRequiredEnd + '年'
      } else if (workYearRequiredStart) {
        data.workYearRequiredName = workYearRequiredStart + '年以上'
      } else if (workYearRequiredEnd) {
        data.workYearRequiredName = workYearRequiredEnd + '年以下'
      } else {
        data.workYearRequiredName = '工作年限不限'
      }
      // 二维码
      data.code = this.webUrl
      return data
    }
  },
  mounted() {},
  methods: {
    // 单行文本溢出省略号
    singleTextEllipsis(ctx, text, x, y, maxWidth) {
      var chr = text.split('')
      var temp = ''
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < maxWidth) {
          temp += chr[a]
        } else {
          temp += '...'
          break
        }
      }
      if (typeof x === 'string') {
        // 居中
        if (x.indexOf('center') !== -1) {
          if (x === 'center') {
            ctx.fillText(
              temp,
              (750 - ctx.measureText(temp).width) / 2,
              y
            )
          } else {
            const offsetLeft = parseInt(x.split('-')[1])
            ctx.fillText(
              temp,
              (750 - ctx.measureText(temp).width) / 2 + offsetLeft,
              y
            )
          }
        }
        // 居右
        if (x.indexOf('right') !== -1) {
          const offsetRight = parseInt(x.split('-')[1])
          ctx.fillText(
            temp,
            750 - ctx.measureText(temp).width - offsetRight,
            y
          )
        }
      } else {
        // 居左
        ctx.fillText(temp, x, y)
      }
    },
    // 圆形头像
    circleImg(ctx, img, x, y, r) {
      ctx.save()
      var d = 2 * r
      var cx = x + r
      var cy = y + r
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(img, x, y, d, d)
      ctx.restore()
    },
    // 表单赋值
    edit(row) {
      const that = this
      this.visible = true
      this.loading = true
      // 获取二维码地址
      const positionId = row.id
      const token = Vue.ls.get('x-client-token')
      this.webUrl = window.location.protocol + '//' + window.location.host + '/api/owner/code/getPositionCordByPositonId?positionId=' + positionId + '&x-client-token=' + token;
      // 获取职位信息
      const para = {}
      para.id = row.id
      getPositionDetailById(para).then(res => {
        this.positionInfo = Object.assign({ entrySourceType: row.entrySourceType }, res.data);
        this.$nextTick(() => {
          let canvas = null;
          if (that.positionInfo.entrySourceType === 'positionDetail') {
            canvas = document.getElementById('mycanvas-positionDetail-' + that.positionInfo.id);
          } else {
            canvas = document.getElementById('mycanvas-' + that.positionInfo.id);
          }
          const context = canvas.getContext('2d');
          // 背景
          const bg = new Image();
          bg.src = 'https://oss.dalieyingcai.com/static/dalie-pc/position/invite_bg.jpg'
          bg.onload = function() {
            if (bg.complete) {
              context.drawImage(bg, 0, 0, 375 * 2, 667 * 2);
              // 头像
              const avatar = new Image();
              avatar.src = that.renderPosterInfo.avatar
              avatar.onload = function() {
                if (avatar.complete) {
                  that.circleImg(context, avatar, 168 * 2, 172 * 2, 20 * 2)
                  // 描述
                  context.font = '24px Microsoft Yahei'
                  context.fillStyle = '#ffffff'
                  that.singleTextEllipsis(
                    context,
                    that.renderPosterInfo.description,
                    'center',
                    230 * 2,
                    300 * 2
                  )
                  // 职位名称
                  context.font = 'bold 28px Microsoft Yahei'
                  context.fillStyle = '#585858'
                  that.singleTextEllipsis(
                    context,
                    that.renderPosterInfo.title,
                    40 * 2,
                    543 * 2,
                    180 * 2
                  )
                  // 薪资
                  context.font = 'bold 28px Microsoft Yahei'
                  context.fillStyle = '#585858'
                  that.singleTextEllipsis(
                    context,
                    that.renderPosterInfo.salary,
                    40 * 2,
                    567 * 2,
                    180 * 2
                  )
                  // 工作城市&学历要求&工作年限
                  context.font = '24px Microsoft Yahei'
                  context.fillStyle = '#333333'
                  that.singleTextEllipsis(
                    context,
                    `${that.renderPosterInfo.workCityName} · ${that.renderPosterInfo.degreeName} · ${that.renderPosterInfo.workYearRequiredName}`,
                    40 * 2,
                    600 * 2,
                    180 * 2
                  )
                  // 提示文字
                  context.font = '24px Microsoft Yahei'
                  context.fillStyle = '#999999'
                  that.singleTextEllipsis(
                    context,
                    '长按识别小程序码手机一键接单',
                    40 * 2,
                    620 * 2,
                    180 * 2
                  )
                  // 二维码
                  const code = new Image();
                  code.src = that.renderPosterInfo.code
                  code.onload = function() {
                    if (code.complete) {
                      that.circleImg(context, code, 250 * 2, 530 * 2, 44 * 2)
                      that.loading = false
                    }
                  }
                }
              }
            }
          }
        })
      })
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
      let canvas = null;
      if (this.positionInfo.entrySourceType === 'positionDetail') {
        canvas = document.getElementById('mycanvas-positionDetail-' + this.positionInfo.id);
      } else {
        canvas = document.getElementById('mycanvas-' + this.positionInfo.id);
      }
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
::v-deep .el-dialog__header {
  padding: 20px;
  .el-dialog__title{
    font-size: 14px;
    color: #15181B;
  }
}
::v-deep .el-dialog__body {
  padding: 0 20px;
  .main {
    .mycanvas{
      width: 250px;
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 20px;
  text-align: center;
  p{
    font-size: 12px;
    color: #15181B;
  }
}
</style>
