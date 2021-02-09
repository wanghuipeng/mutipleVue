<template>
  <div class="wrap">
    <!-- 职位动态 -->
    <div class="panel">
      <div class="panel-body">
        <div class="timeline">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in record"
              :key="index"
              :timestamp="item.createTime"
              placement="top"
            >
              <div class="info">
                <p
                  class="title"
                >{{ item.operateType | filterCommonDict(dictData.dicts.recordType) }}</p>
                <p class="content">{{ item.operateDescribe }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPositionOpeationLogList } from '@/api/position'
export default {
  components: {},
  props: {
    // 职位ID
    positionId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 查询条件
      queryForm: {
        positionId: this.positionId
      },
      // 职位动态
      record: []
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  watch: {
    positionId(val) {
      this.queryForm.positionId = val
      // 查询职位动态
      this.queryPositionRecord()
    }
  },
  mounted() {
    // 查询职位动态
    this.queryPositionRecord()
  },
  methods: {
    // 查询职位动态
    queryPositionRecord() {
      const para = Object.assign({}, this.queryForm)
      para.pageNumber = 1
      para.pageSize = this.$store.state.maxPageSize
      getPositionOpeationLogList(para).then(res => {
        this.record = res.data.records
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .panel {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .panel-title {
      font-size: 15px;
      color: #191919ff;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .panel-body {
      .timeline {
        padding: 0 5px;
        ::v-deep .el-timeline-item__tail {
          border-left: 2px dashed #ccc;
        }
        ::v-deep .el-timeline-item__node {
          width: 14px;
          height: 14px;
          border: 2px solid #ccc;
          background-color: #fff;
          left: -4px;
        }
        ::v-deep .el-timeline-item__timestamp.is-top {
          font-size: 15px;
          color: #4d4d4dff;
          margin-bottom: 12px;
        }
        .title {
          font-size: 15px;
          color: #323232ff;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .content {
          font-size: 14px;
          color: #808080ff;
        }
      }
    }
  }
}
</style>

