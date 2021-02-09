/**
* 新的线索
*/
<template>
  <div class="resume-page">
    <!-- 左侧 -->
    <left-menu
      id="fixedHeaderRoot"
      :total1="total1"
      :total2="total2"
      :total3="total3"
      :class="headerFixed && 'isFixed'"
    />
    <div class="right-content">
      <div class="resume-list">
        <!-- 筛选 -->
        <div class="filter-part">
          <span class="total">最近30天共有{{ total || 0 }}人浏览我的微名片</span>
          <div class="right">
            <el-radio-group v-model="radio" @change="changeRadio">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="2">访问名片</el-radio>
              <el-radio :label="1">查看职位</el-radio>
              <el-radio :label="3">推荐好友</el-radio>
              <el-radio :label="4">主动咨询</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!--table -->
        <table-part
          v-loading="loading"
          :table-data="listData"
          :show-this-table1="showThisTable1"
          :show-this-table2="showThisTable2"
          :page-size="20"
          :total="total"
          @refreshList="getNewClues"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LeftMenu from '@/components/resume/index/leftMenu'
import TablePart from '@/components/resume/resumeList/tablePart'
import {
  getNewClues,
  getResumeCountByType,
  findShareApplyPage
} from '@/api/resume'
import { filterDates } from '@/utils/common'

export default {
  components: {
    LeftMenu,
    TablePart
  },
  data() {
    return {
      radio: 0,
      dataType: null,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      listData: [],
      loading: false,
      total1: 0,
      total2: 0,
      total3: 0,
      showThisTable1: true,
      showThisTable2: false
    }
  },
  mounted() {
    this.getNewClues()
    document.body.style['overflow'] = 'auto'
    this.getResumeCountByType()
  },
  methods: {
    getResumeCountByType() {
      const params = {
        userId: this.$store.state.userInfo.userId
      }
      getResumeCountByType(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          data.filter(item => {
            if (item.typeName === '全部简历') {
              this.total1 = item.count
            }
            if (item.typeName === '推荐过的') {
              this.total2 = item.count
            }
            if (item.typeName === '新的线索') {
              this.total3 = item.count
            }
          })
        }
      })
    },
    changeRadio(e) {
      this.dataType = e
      if (e === 3) {
        this.showThisTable1 = false
        this.showThisTable2 = true
        this.findShareApplyPage()
      } else {
        this.showThisTable1 = true
        this.showThisTable2 = false
        this.getNewClues()
      }
    },
    // 推荐好友分页列表
    findShareApplyPage(pageNumberProp) {
      this.pageNumber = 1
      this.loading = true
      const { pageNumber, pageSize } = this
      const params = {
        pageNumber: pageNumber,
        pageSize
      }
      findShareApplyPage(params).then(res => {
        const { code, data } = res
        this.loading = false
        if (code === '000000') {
          this.total = data.total
          this.listData = data.records

          this.listData &&
            this.listData.filter(item => {
              item.applyTime = filterDates(item.applyTime)
              console.log(
                item.city,
                typeof item.city,
                item.city + '' === 'null'
              )
            })
          console.log(this.listData)
        }
      })
    },
    // 线索列表
    getNewClues(pageNumberProp) {
      this.pageNumber = 1
      this.loading = true
      const { pageNumber, pageSize, dataType } = this
      const params = {
        dataType: dataType === 0 ? null : dataType,
        pageNumber: pageNumberProp || pageNumber,
        pageSize
      }
      getNewClues(params).then(res => {
        const { code, data } = res
        this.loading = false
        if (code === '000000') {
          this.total = data.total
          this.listData = data.records

          this.listData &&
            this.listData.filter(item => {
              item.lastbrowsetime = filterDates(item.lastbrowsetime)
            })
          console.log(this.listData)
        }
      })
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/resume/index.scss';
.resume-page {
  .resume-list {
    .filter-part {
      display: flex;
      justify-content: space-between;
      height: 32px;
      padding-bottom: 6px;
      align-items: center;
      .total {
        color: #343434;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
      }
      .right {
        float: none;
        display: inline-block;
        margin-bottom: -8px;
        margin-right: 2px;
        .el-radio-group {
          .el-radio {
            margin-right: 28px;
            .el-radio__input {
              vertical-align: -3px;
            }
            &:last-child {
              margin-right: 0;
            }
            .el-radio__label {
              color: #b1b1b1;
              padding-left: 6px;
            }
            .el-radio__inner {
              margin-top: -2px;
              width: 18px;
              height: 18px;
              border-color: #b3b3b3;
            }
            .is-checked .el-radio__inner {
              background: url('../../assets/images/resume/check_little.png')
                no-repeat;
              background-size: 18px;
              border: none;
              &::after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>

