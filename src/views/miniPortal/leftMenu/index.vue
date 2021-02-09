<template>
  <el-tabs v-model="activeName" class="tabs">
    <el-tree
      ref="tree"
      node-key="id"
      :highlight-current="true"
      default-expand-all
      :data="data"
      :props="defaultProps"
      :default-expanded-keys="[2,3]"
      :default-checked-keys="[5]"
      @node-click="change"
    >
      <p slot-scope="{ node }" class="custom-tree-node">
        <img v-if="node.label === '内容管理'" src="@/assets/images/miniPortal/icon1.png" />
        <img v-else-if="node.label === '门户设置'" src="@/assets/images/miniPortal/icon2.png" />
        <span v-else style="padding-left: 10px;"></span>
        <span :class="{parent: node.label === '内容管理' || node.label === '门户设置'}">{{ node.label }}</span>
      </p>
    </el-tree>
  </el-tabs>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    const data = [
        // {
        //   id: 1,
        //   label: '首页',
        //   children: [
        //     {
        //       id: 4,
        //       label: '概览',
        //       route: ''
        //     }
        //   ]
        // },
        {
          id: 2,
          label: '内容管理',
          children: [
            {
              id: 5,
              label: '企业故事',
              route: 'enterpriseStory'
            },
            {
              id: 6,
              label: '招聘专区',
              route: 'recruitmentZone'
            }
          ]
        },
        {
          id: 3,
          label: '门户设置',
          children: [
            {
              id: 7,
              label: '个性化首页',
              route: 'personality'
            },
            {
              id: 8,
              label: '嵌入公众号',
              route: 'officialAccounts'
            }
          ]
        }
      ]
    return {
      activeName: 'first',
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState({
      companyRole: state => state.userInfo.companyRole
    })
  },
  mounted() {
    this.change({ route: 'enterpriseStory' })
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(5)
    })
  },
  methods: {
    change(item) {
      console.log(item)
      this.route = item.route
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
  ::v-deep .el-tabs__nav-wrap {
    padding: 0 16px;
  }
  .custom-tree-node {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    font-size: 13px;
    color:rgba(13,18,26,1)#595F66;
    line-height: 18px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .parent {
      font-size: 14px;
      font-weight: bold;
      color:#0D121A;
      line-height: 20px;
    }
  }
}
</style>
