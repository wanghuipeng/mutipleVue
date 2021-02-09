/**
* 城市选择器，支持多选（参数maxNumber控制）,
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
      placement="top-start"
      :visible-arrow="false"
      width="600"
      trigger.pevent="click"
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
            <ul class="select-items">
              <!-- 一级（不限） -->
              <div>
                <div v-if="item.current" class="title active">
                  <span v-if="item.disabled" class="disabled">{{ item.label }}</span>
                  <span v-else @click="delItem(item)">{{ item.label }}</span>
                </div>
                <div v-else class="title">
                  <span v-if="item.disabled" class="disabled">{{ item.label }}</span>
                  <span v-else @click="selectItem(item)">{{ item.label }}</span>
                </div>
              </div>
              <!-- 二级 -->
              <div>
                <template v-if="item.current">
                  <li v-for="(i,key) in childData" :key="key" :class="[i.current ? 'active' : '']">
                    <span :class="[i.disabled ? 'disabled' :'']" :title="i.label">{{ i.label }}</span>
                  </li>
                </template>
                <template v-else>
                  <li v-for="(i,key) in childData" :key="key" :class="[i.current ? 'active' : '']">
                    <span
                      v-if="i.current"
                      :title="i.label"
                      @click="delItem(i,$props.maxNumber)"
                    >{{ i.label }}</span>
                    <span
                      v-else-if="i.disabled"
                      :class="[i.disabled ? 'disabled' :'']"
                      :title="i.label"
                    >{{ i.label }}</span>
                    <span
                      v-else
                      :title="i.label"
                      @click="selectItem(i,$props.maxNumber)"
                    >{{ i.label }}</span>
                  </li>
                </template>
              </div>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <!-- 底部 -->
        <div class="footer">
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
import { removeArray } from '@/utils/common'

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
      this.activeName = this.$props.firstTabName
      this.options = JSON.parse(JSON.stringify(this.$props.dataSource))
      this.dataArr = this.$props.defaultValue
      this.passMax = this.$props.maxNumber
      const obj = {}
      obj[this.$props.keyName] = this.$props.defaultValue
      this.$store.commit('setSelectedData', obj)

      const arr1 = []
      this.dataArr &&
        this.dataArr.filter(i => {
          this.options.filter(item1 => {
            if (i === item1.value) {
              arr1.push(item1)
            } else {
              item1.children &&
                item1.children.filter(item2 => {
                  if (i === item2.value) {
                    arr1.push(item2)
                  }
                })
            }
          })
        })
      const arr2 = []
      arr1.filter(item => {
        arr2.push(item.label)
      })
      // 显示数据
      this.selectValue = arr2.join('、')
      console.log(arr1)
      this.options.filter(item1 => {
        // 一级
        arr1.filter(item3 => {
          if (item1.value === item3.value) {
            item1.current = true
            item1.disabled = false
            item1.children &&
              item1.children.filter(item2 => {
                item2.disabled = true
              })
          } else {
            // 二级
            if (arr1.length === this.passMax) {
              let temp = null
              // 如果达到最大个数
              item1.children &&
                item1.children.filter(item2 => {
                  arr1.filter(item3 => {
                    if (item2.value === item3.value) {
                      temp = item1
                      item2.current = true
                      item2.disabled = true
                      item1.disabled = false
                    } else {
                      if (temp && temp.value === item1.value) {
                        item2.disabled = true
                        item1.disabled = false
                      } else {
                        item1.disabled = true
                        item2.disabled = true
                      }
                    }
                  })
                })
            } else {
              let temp = null
              // 如果小于最大个数
              item1.children &&
                item1.children.filter(item2 => {
                  arr1.filter(item3 => {
                    if (item2.value === item3.value) {
                      temp = item1
                      item2.current = true
                      item1.disabled = false
                      item2.disabled = false
                    } else {
                      if (temp && temp.value === item1.value) {
                        item1.disabled = false
                        item1.children.filter(item3 => {
                          item3.disabled = false
                        })
                      } else {
                        item1.disabled = true
                        item1.children.filter(item3 => {
                          item3.disabled = true
                        })
                      }
                    }
                  })
                })
            }
          }
        })
      })
      this.selectedArr = arr1
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
    // 选择item
    selectItem(item, max) {
      if (max) {
        // 选择二级
        if (this.selectedArr.length === max) {
          return false
        } else {
          this.selectedArr.push(item)
          let temp = null
          if (this.selectedArr.length === max) {
            this.options.filter(item1 => {
              item1.children &&
                item1.children.filter(item2 => {
                  if (item.value === item2.value) {
                    temp = item1
                    item2.current = true
                    item1.disabled = false
                  } else {
                    item2.disabled = true
                  }
                })
            })
          } else {
            this.options.filter(item1 => {
              item1.children &&
                item1.children.filter(item2 => {
                  if (item.value === item2.value) {
                    temp = item1
                    item2.current = true
                    item1.disabled = false
                  }
                })
            })
          }

          // 一级互斥
          this.options.filter(item1 => {
            if (item1.value !== temp.value) {
              item1.children &&
                item1.children.filter(item2 => {
                  item2.disabled = true
                  item1.disabled = true
                })
            }
          })
        }
      } else {
        // 选择一级（不限）
        this.selectedArr = []
        this.selectedArr.push(item)
        this.options.filter(item1 => {
          if (item.value === item1.value) {
            item1.current = true
            item1.children &&
              item1.children &&
              item1.children.filter(item2 => {
                item2.disabled = true
                item2.current = false
              })
          } else {
            item1.disabled = true
            item1.children &&
              item1.children &&
              item1.children.filter(item2 => {
                item2.disabled = true
              })
          }
        })
      }
    },
    // 删除item
    delItem(item, max) {
      if (max) {
        let temp = null
        // 重构options数据源，添加disabled属性为false
        this.options.filter(item1 => {
          item1.children &&
            item1.children.filter(item2 => {
              if (item2.value === item.value) {
                temp = item1.value
              }
            })
        })
        this.options.filter(item1 => {
          item1.children &&
            item1.children.filter(item2 => {
              if (item.value === item2.value) {
                removeArray(this.selectedArr, item)
                item2.current = false
                item2.disabled = false
              } else {
                if (item1.value !== temp) {
                  item1.children &&
                    item1.children.filter(item2 => {
                      item1.disabled = true
                      item2.disabled = true
                    })
                } else {
                  item2.disabled = false
                }
              }
            })
        })
        // 如果一个都没有选，则初始化数据和属性状态
        if (!this.selectedArr.length) {
          this.options.filter(item1 => {
            if (item1.current) {
              delete item1.current
            }
            if (item1.disabled) {
              delete item1.disabled
            }
            item1 &&
              item1.children &&
              item1.children.filter(item2 => {
                if (item2.current) {
                  delete item2.current
                }
                if (item2.disabled) {
                  delete item2.disabled
                }
              })
          })
        }
      } else {
        // 删除一级（不限）
        this.selectedArr.filter(i => {
          if (i.value === item.value) {
            removeArray(this.selectedArr, item)
            // 重构options数据源，添加disabled属性为false
            this.options.filter(item1 => {
              item1.children &&
                item1.children.filter(item2 => {
                  item2.disabled = false
                })
              item1.disabled = false
              item1.current = false
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
      this.options.filter(item1 => {
        if (item1.current) {
          delete item1.current
        }
        if (item1.disabled) {
          delete item1.disabled
        }
        item1 &&
          item1.children &&
          item1.children.filter(item2 => {
            if (item2.current) {
              delete item2.current
            }
            if (item2.disabled) {
              delete item2.disabled
            }
          })
      })
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
      console.table('提交数据', valueArr)
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
</style>
