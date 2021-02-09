/**
* 城市选择器，支持单选和多选（参数maxNumber控制，为1则单选，否则多选）,
* keyName是存储的键值对key，firstTabName是初始化的tab页选中值，dataSource是数据源，
* levelNumber是层级（一级，二级）
* defaultValue为默认值，类型为数组
*/
<template>
  <div>
    <div v-if="popoverModal && popoverVisible" class="popover-modal"></div>
    <el-popover
      v-model="popoverVisible"
      :popper-class="`select-picker ${className}`"
      placement="bottom-start"
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
            <!-- 二级多选 -->
            <template v-if="$props.levelNumber === 2">
              <ul class="select-items">
                <li v-for="(i,key) in childData" :key="key" :class="[i.current ? 'active' : '']">
                  <span v-if="i.current" :title="i.label" @click="delItem(i)">{{ i.label }}</span>
                  <span
                    v-else
                    :class="[selectedArr.length === $props.maxNumber? 'disabled' :'']"
                    :title="i.label"
                    @click="selectItem(i,$props.maxNumber)"
                  >{{ i.label }}</span>
                </li>
              </ul>
            </template>
            <!-- 三级多选 -->
            <template v-if="$props.levelNumber === 3">
              <div v-for="(x,xKey) in childData" :key="xKey">
                <div class="title">{{ x.label }}</div>
                <ul class="select-items">
                  <li
                    v-for="(y,yKey) in x.children"
                    :key="yKey"
                    :class="[y.current ? 'active' : '']"
                  >
                    <span v-if="y.current" :title="i.label" @click="delItem(y)">{{ y.label }}</span>
                    <span
                      v-else
                      :class="[selectedArr.length === $props.maxNumber? 'disabled' :'']"
                      :title="i.label"
                      @click="selectItem(y,$props.maxNumber)"
                    >{{ y.label }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <!-- 底部 -->
        <div v-if="passMax !== '1' && passMax != 1" class="footer">
          <span class="tip">
            <label>最多可选</label>
            <label class="num">{{ passMax }}</label>
            <label>项</label>
          </span>
          <!-- 显示的选项 -->
          <ul v-show="false" class="selected-arr">
            <li v-for="(item,index) in selectedArr" :key="index">
              <span>{{ item.label }}</span>
              <i class="el-icon-close" @click="delItem(item)" />
            </li>
          </ul>
          <div class="btn-group">
            <el-button size="small" @click="cancelBtn">取消</el-button>
            <el-button type="primary" size="small" @click="sureBtn">确认</el-button>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { uniqueArr, removeArray } from '@/utils/common'

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
      default: '',
      required: false
    },
    // 数据源
    dataSource: {
      type: Array,
      default: null,
      required: false
    },
    // 最多选择多少个
    maxNumber: {
      type: Number,
      required: true
    },
    // select默认值
    defaultValue: {
      type: Array,
      required: true
    },
    // 二级或者三级
    levelNumber: {
      type: Number,
      required: true
    },
    // 存储在vuex中的key
    keyName: {
      type: String,
      required: true
    },
    // 是否显示遮罩层
    popoverModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      activeName: '', // 默认tab页
      selectValue: null, // 展示的数据
      options: null, // 数据源
      childData: [], // tabPane数据
      selectedArr: [], // 显示选中的数据
      popoverVisible: false, // 是否显示popover弹框
      passMax: null, // 最多选择多少个
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
      console.log('数据', this.childData)
      this.activeName = this.$props.firstTabName
      this.options =
        this.$props.dataSource &&
        JSON.parse(JSON.stringify(this.$props.dataSource))
      this.dataArr = this.$props.defaultValue
      this.passMax = this.$props.maxNumber
      const obj = {}
      obj[this.$props.keyName] = this.$props.defaultValue
      this.$store.commit('setSelectedData', obj)

      const arr1 = []
      if (this.$props.levelNumber === 3) {
        this.dataArr &&
          this.dataArr.filter(i => {
            this.options &&
              this.options.filter(item1 => {
                item1.children.filter(item2 => {
                  item2.children &&
                    item2.children.filter(item3 => {
                      if (i === item3.value) {
                        arr1.push(item3)
                      }
                    })
                })
              })
          })
      } else if (this.$props.levelNumber === 2) {
        this.dataArr &&
          this.dataArr.filter(i => {
            this.options &&
              this.options.filter(item1 => {
                item1.children.filter(item2 => {
                  if (i === item2.value) {
                    arr1.push(item2)
                  }
                })
              })
          })
      }
      const arr2 = []
      arr1.filter(item => {
        arr2.push(item.label)
      })
      // 显示数据
      this.selectValue = arr2.join('、')
      // 重构options数据源，添加current属性为true
      if (this.$props.levelNumber === 3) {
        this.options &&
          this.options.filter(item1 => {
            item1.children.filter(item2 => {
              arr1.filter(item3 => {
                item2.children &&
                  item2.children.filter(item4 => {
                    if (item4.value === item3.value) {
                      item4.current = true
                    }
                  })
              })
            })
          })
      } else if (this.$props.levelNumber === 2) {
        this.options &&
          this.options.filter(item1 => {
            item1.children.filter(item2 => {
              arr1.filter(item3 => {
                if (item2.value === item3.value) {
                  item2.current = true
                }
              })
            })
          })
      }
      this.selectedArr = arr1
    })
  },
  methods: {
    ...mapMutations(['setSelectedData']),
    // tab切换
    handleClick(tab) {
      if (this.$props.maxNumber === 1) {
        // 初始化数据
        this.selectedArr = []
        this.childData = []
      }
      this.options.filter(item => {
        if (item.value === tab.name) {
          this.childData = item.children
        }
      })
    },
    // 选择item
    selectItem(item, max) {
      if (this.selectedArr.length === max) {
        return false
      } else {
        // push到数组
        this.selectedArr.push(item)
        // 数组去重
        this.selectedArr = uniqueArr(this.selectedArr)
        // 单选时需要清除原有的current选中状态并更新现有的current选中状态
        if (this.$props.maxNumber === 1) {
          this.options &&
            this.options.filter(item1 => {
              item1 &&
                item1.children.filter(item2 => {
                  if (item2.current) {
                    delete item2.current
                  }
                })
            })
          this.sureBtn()
        }
        // 添加current属性
        const temp = this.selectedArr.map(i => {
          const obj = {}
          obj.children = i.children
          obj.label = i.label
          obj.value = i.value
          obj.current = true
          return obj
        })
        // 重构options数据源，添加current属性为true
        if (this.$props.levelNumber === 3) {
          this.options &&
            this.options.filter(item1 => {
              item1.children.filter(item2 => {
                temp.filter(item3 => {
                  if (item2.value === item3.value) {
                    item2.current = item3.current
                  }
                })
                item2.children &&
                  item2.children.filter(item4 => {
                    temp.filter(item3 => {
                      if (item4.value === item3.value) {
                        item4.current = item3.current
                      }
                    })
                  })
              })
            })
        } else if (this.$props.levelNumber === 2) {
          this.options &&
            this.options.filter(item1 => {
              item1.children.filter(item2 => {
                temp.filter(item3 => {
                  if (item2.value === item3.value) {
                    item2.current = item3.current
                  }
                })
              })
            })
        }
      }
    },
    // 删除item
    delItem(item) {
      if (this.$props.levelNumber === 3) {
        this.selectedArr.filter(i => {
          if (i.value === item.value) {
            removeArray(this.selectedArr, item)
            // 重构options数据源，添加current属性为false
            this.options &&
              this.options.filter(item1 => {
                item1.children.filter(item2 => {
                  item2.children.filter(item3 => {
                    if (item3.value === item.value) {
                      item3.current = false
                    }
                  })
                })
              })
          }
        })
      } else if (this.$props.levelNumber === 2) {
        this.selectedArr.filter(i => {
          if (i.value === item.value) {
            removeArray(this.selectedArr, item)
            // 重构options数据源，添加current属性为false
            this.options &&
              this.options.filter(item1 => {
                item1.children.filter(item2 => {
                  if (item2.value === item.value) {
                    console.log(111, item2)
                    item2.current = false
                  }
                })
              })
          }
        })
      }
    },
    // 清除item
    clearItem() {
      // 初始化数据
      this.selectedArr = []
      this.childData = []
      this.selectValue = ''
      if (this.$props.levelNumber === 3) {
        this.options &&
          this.options.filter(item1 => {
            item1 &&
              item1.children.filter(item2 => {
                item2.children &&
                  item2.children.filter(item3 => {
                    if (item3.current) {
                      delete item3.current
                    }
                  })
              })
          })
      } else if (this.$props.levelNumber === 2) {
        this.options &&
          this.options.filter(item1 => {
            item1 &&
              item1.children.filter(item2 => {
                if (item2.current) {
                  delete item2.current
                }
              })
          })
      }
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
    // 确认提交item
    sureBtn() {
      // 需要提交的code
      const valueArr = []
      this.selectedArr.filter(item => {
        valueArr.push(item.value)
      })
      // 需要显示的值
      const labelArr = []
      this.selectedArr.filter(item => {
        labelArr.push(item.label)
      })
      // 展示数据
      this.selectValue = labelArr.join('、')
      this.closePopover()

      console.table('提交数据1', valueArr)
      console.log('显示数据', this.selectValue)
      const obj = {}
      obj[this.$props.keyName] = valueArr
      this.$store.commit('setSelectedData', obj)
      console.log('所有数据', this.selectedData)
      if (this.selectedData[this.$props.keyName].length > 0) {
        this.$emit('deleteRules', {
          formName: this.$props.formName,
          keyName: this.$props.keyName
        })
      }
      this.callback()
    },
    // 取消
    cancelBtn() {
      this.closePopover()
    },
    // 关闭popover
    closePopover() {
      this.activeName = this.$props.firstTabName
      this.popoverVisible = false
      // this.callback()
    },
    blurIt() {
      console.log(this.selectedData[this.$props.keyName])
      if (
        this.selectedData[this.$props.keyName] &&
        this.selectedData[this.$props.keyName].length > 0 &&
        this.selectedData[this.$props.keyName][0] !== 'null'
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
</style>
