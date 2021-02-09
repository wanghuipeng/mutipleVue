<template>
  <el-popover
    v-model="popoverVisible"
    :popper-class="`select-picker select-picker-three ${className}`"
    placement="top-start"
    :visible-arrow="false"
    width="600"
    trigger="click"
    @show="handleClick({name:activeName})"
  >
    <div slot="reference" class="diy-select">
      <el-input
        v-model="selectValue"
        :title="selectValue"
        class="diy-input"
        :placeholder="placeholder"
        readonly
        @blur="blurIt"
      />

      <i v-if="selectValue" class="el-icon-circle-close" @click="clearItem" />
      <i :class="[ selectValue ? 'el-icon-caret-bottom active' : 'el-icon-caret-bottom']" />
    </div>

    <div class="select-picker-inner">
      <!-- 内容 -->
      <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in options"
          :key="index"
          :label="item.label"
          :name="item.value"
        >
          <ul v-if="item.children" class="select-items">
            <div v-for="(itemInner,itemIndex) in item.children" :key="itemIndex">
              <!-- 二级 -->
              <div :class="selectValue === itemInner.label ? 'title active' : 'title'">
                <span @click="selectItem(itemInner)">{{ itemInner.label }}</span>
              </div>
              <!-- 三级 -->
              <li
                v-for="(i,key) in itemInner.children"
                :key="key"
                :class="selectValue === i.label ? 'active' : ''"
              >
                <span @click="selectItem(i)">{{ i.label }}</span>
              </li>
            </div>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-popover>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    // placeholder
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    },
    // 自定义class名称
    className: {
      type: String,
      default: '',
      required: false
    },
    // 宿主表单名称
    formName: {
      type: String,
      default: '',
      required: false
    },
    // 默认tab页
    firstTabName: {
      type: String,
      required: true
    },
    // 数据源
    dataSource: {
      type: Array,
      required: true
    },
    // select默认值
    defaultValue: {
      type: Array,
      required: true
    },
    // 存储在vuex中的key
    keyName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeName: '', // 默认tab页
      selectValue: null, // 展示的数据
      options: null, // 数据源
      childData: [], // tabPane数据
      popoverVisible: false, // 是否显示popover弹框
      dataArr: null // select默认值
    }
  },
  computed: {
    ...mapState({
      selectedData: state => state.common.selectedData
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.activeName = this.$props.firstTabName
      this.options = JSON.parse(JSON.stringify(this.$props.dataSource))
      this.selectValue = this.$props.defaultValue[0]
      const obj = {}
      obj[this.$props.keyName] = this.$props.defaultValue
      this.$store.commit('setSelectedData', obj)
      // 显示数据
      this.options.filter(item => {
        item.children &&
          item.children.filter(item1 => {
            if (this.$props.defaultValue[0] === item1.value) {
              this.selectValue = item1.label
            } else {
              item1.children &&
                item1.children.filter(item2 => {
                  if (this.$props.defaultValue[0] === item2.value) {
                    this.selectValue = item2.label
                  }
                })
            }
          })
      })
    })
  },
  methods: {
    ...mapMutations(['setSelectedData']),
    // tab切换
    handleClick(tab) {
      this.options.filter(item => {
        if (item.value === tab.name) {
          this.childData = item.children
        }
      })
    },
    selectItem(item) {
      this.closePopover()
      // 显示数据
      this.selectValue = item.label
      console.table('提交数据1', [item.value])
      console.log('显示数据', item.label)
      const obj = {}
      obj[this.$props.keyName] = [item.value]
      this.$store.commit('setSelectedData', obj)
      console.log('所有数据', this.selectedData)
      this.callback()
    },
    // 关闭popover
    closePopover() {
      this.popoverVisible = false
    },
    // 清除item
    clearItem() {
      // 初始化数据
      this.childData = []
      this.selectValue = ''
      // 清空输入框数据
      if (this.$props.keyName) {
        Object.keys(this.selectedData).filter(item => {
          if (item === this.$props.keyName) {
            delete this.selectedData[item]
          }
        })
      }
      this.callback()
    },
    blurIt() {
      if (
        this.selectedData[this.$props.keyName] &&
        this.selectedData[this.$props.keyName].length > 0
      ) {
        this.$emit('deleteRules', {
          formName: this.$props.formName,
          keyName: this.$props.keyName
        })
      }
    },
    // 回调
    callback() {
      this.$emit('afterClose')
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/common/selectPicker.scss';
.select-picker-three {
  .select-picker-inner .select-items .title:active span {
    background: transparent;
  }
}
</style>
