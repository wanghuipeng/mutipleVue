<template>
  <div id="fixedHeaderRoot" :class="[headerFixed && 'isFixed']" style="width: 240px;">
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="个人统计" name="first">
        <el-tree
          ref="tree"
          node-key="id"
          :highlight-current="true"
          default-expand-all
          :data="data"
          :props="defaultProps"
          :default-expanded-keys="['1']"
          :default-checked-keys="['1-1']"
        />
      </el-tab-pane>
      <el-tab-pane v-if="companyRole === 4" label="企业统计" name="second">
        <el-tree
          ref="tree"
          node-key="id"
          :highlight-current="true"
          default-expand-all
          :data="userInfo.companyAccountType === 2 ? data2 : data1"
          :props="defaultProps"
          :default-expanded-keys="['1']"
          :default-checked-keys="['1-1']"
          @node-click="change"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
      data: [
        {
          id: '1',
          label: '线索报表',
          children: [
            {
              id: '1-1',
              label: '线索趋势统计',
              route: '/statistics/tendency'
            }
          ]
        }
      ],
      data1: [
        {
          id: '1',
          label: '线索报表',
          children: [
            {
              id: '1-1',
              label: '线索趋势统计',
              route: '/statistics/companyTendency'
            },
            {
              id: '1-2',
              label: '线索分布统计',
              route: '/statistics/companyDistribution'
            }
          ]
        }
      ],
      data2: [
        {
          id: '1',
          label: '线索报表',
          children: [
            {
              id: '1-1',
              label: '线索趋势统计',
              route: '/statistics/companyTendency'
            },
            {
              id: '1-2',
              label: '线索分布统计',
              route: '/statistics/companyDistribution'
            }
          ]
        },
        {
          id: '2',
          label: '开放猎场',
          children: [
            {
              id: '2-1',
              label: '业绩趋势统计',
              route: '/statistics/performanceTendency'
            },
            {
              id: '2-2',
              label: '成员KPI统计',
              route: '/statistics/kpiTendency'
            },
            {
              id: '2-3',
              label: '推荐转化分析',
              route: '/statistics/recommendTendency'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      index: '1-1'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyRole: state => state.userInfo.companyRole
    })
  },
  watch: {
    activeName(val) {
      if (val === 'first') {
        this.$router.push('/statistics/tendency')
      } else {
        this.$router.push('/statistics/companyTendency')
      }
    }
  },
  created() {
    this.activeName = this.$route.name === 'tendency' ? 'first' : 'second'
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.index || '1-1')
    })
  },
  methods: {
    change(item) {
     this.index = item.id
     this.$router.push({ path: item.route })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.tabs {
  //   ::v-deep .el-tabs__header {
  //     border-bottom: 1px solid #dfdada;
  //   }
  ::v-deep .el-tabs__nav-wrap {
    padding: 0 16px;
  }
}
</style>
