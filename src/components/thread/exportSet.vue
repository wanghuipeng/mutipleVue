<template>
  <el-dialog
    class="export-set"
    title="导出设置"
    :visible="exportVisible"
    width="700px"
    @close="closeIt"
  >
    <div>
      <ul v-loading="!(checkList && checkList.length > 0)" style="min-height:70px">
        <el-checkbox-group v-model="checkList" @change="handle">
          <el-checkbox v-for="item in setList" :key="item.value" :label="item.text"></el-checkbox>
        </el-checkbox-group>
      </ul>
    </div>
    <el-divider class="mb-0"></el-divider>
    <span slot="footer" class="dialog-footer">
      <el-form label-width="68px" size="small">
        <el-form-item label="文件名:">
          <el-input
            v-model="fileName"
            placeholder="请输入文件名（默认excel-list）"
            prefix-icon="el-icon-document"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        :loading="exportLoading"
        :disabled="exportLoading"
        type="primary"
        size="small"
        @click="sureIt"
      >导出</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { exportClues } from '@/api/thread'

export default {
  props: {
    exportQuery: {
      required: true,
      type: Object
    },
    setList: {
      required: true,
      type: Array
    },
    checkList: {
      required: true,
      type: Array
    },
    exportVisible: {
      required: true,
      type: Boolean
    },
    flag: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      fileName: '',
      checkListTemp: [],
      exportLoading: false
    }
  },
  mounted() {
    this.fileName = ''
  },
  methods: {
    exportClues(arr) {
      this.exportLoading = true
      let params = {
        templates: arr,
        exportType: this.$props.flag,
        fileName: this.fileName
      }
      params = Object.assign(params, this.$props.exportQuery)
      console.log('筛选', params)
      exportClues(params)
        .then(res => {
          this.exportLoading = false
          console.log('res', res, res.data)
          if (res.data.type === 'application/octet-stream') {
            this.$message({
              message: '导出成功',
              type: 'success'
            })
            const url = window.URL.createObjectURL(
              new Blob([res.data], {
                type: 'application/vnd.ms-excel'
              })
            )
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link &&
              link.setAttribute(
                'download',
                decodeURI(
                  res.headers['content-disposition']
                    .split('filename=')[1]
                    .replace(/"/g, '')
                )
              )
            document.body.appendChild(link)
            link.click()
          } else if (res.data.type === 'application/json') {
            this.$message({
              message: '暂无数据导出',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handle() {
      console.log(this.$props.checkList)
    },
    closeIt() {
      this.$emit('closeIt')
    },
    sureIt() {
      const arr = []
      this.$props.setList.filter(item => {
        this.$props.checkList.filter(item1 => {
          if (item.text === item1) {
            arr.push({
              value: item.value,
              text: item.text
            })
          }
        })
      })
      // this.closeIt()
      this.exportClues(arr)
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/thread/exportSet.scss';
</style>
