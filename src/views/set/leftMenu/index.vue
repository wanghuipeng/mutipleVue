<template>
  <el-tabs v-model="activeName" class="tabs">
    <div id="fixedHeaderRoot" :class="[headerFixed && 'isFixed']" style="width: 240px;">
      <el-tab-pane label="设置" name="first">
        <el-tree
          ref="tree"
          node-key="id"
          :highlight-current="true"
          default-expand-all
          :data="data"
          :props="defaultProps"
          :default-expanded-keys="[1]"
          :default-checked-keys="[2]"
          @node-click="change"
        />
      </el-tab-pane>
    </div>
  </el-tabs>
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
          label: '基础设置',
          disabled: true,
          children: [
            {
              id: '1-1',
              label: '企业信息',
              route: 'companyInfo'
            },
            {
              id: '1-2',
              label: '部门管理',
              route: 'department'
            },
            {
              id: '1-3',
              label: '成员管理',
              route: 'member'
            }
          ]
        },
        {
          id: '2',
          label: '招聘渠道',
          children: [
            {
              id: '2-1',
              label: '供应商渠道',
              children: [
                {
                  id: '2-1-1',
                  label: '供应商费率管理',
                  route: 'supplierRate'
                },
                {
                  id: '2-1-2',
                  label: 'RPO业务配置',
                  route: 'rpoList'
                }
              ]
            }
          ]
        },
        {
          id: '4',
          label: '人才库设置',
          children: [
            {
              id: '4-1',
              label: '人才库管理',
              route: 'talentPoolManagement'
            },
            {
              id: '4-2',
              label: '人才自定义标签',
              route: 'talentPoolLabel'
            }
          ]
        },
        {
          id: '5',
          label: '微门户设置',
          children: [
            {
              id: '5-1',
              label: '用户协议',
              route: 'protocol'
            },
            {
              id: '5-2',
              label: '接口配置',
              route: 'interfaceConfig'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      companyRole: state => state.userInfo.companyRole
    })
  },
  created() {
    // 默认第一个二级菜单选中
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.index || '1-1')
    })

    if (!this.userInfo.packageItems.resumePoolSwitch) {
      this.data.forEach((item, index) => {
        if (item.id === '4') {
          this.data.splice(index, 1)
        }
      })
    }
    if (!this.userInfo.packageItems.companyWeiZhanSwitch) {
      this.data.forEach((item, index) => {
        if (item.id === '5') {
          this.data.splice(index, 1)
        }
      })
    }
    // 角色为供应商则不显示招聘渠道相关菜单
    if (this.userInfo.companyAccountType === 2) {
      this.data.forEach((item, index) => {
        if (item.id === '2') {
          this.data.splice(index, 1)
        }
      })
    }
  },
  methods: {
    change(item) {
      this.$router.push({ name: item.route })
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
