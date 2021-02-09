<template>
  <div class="search-part">
    <div class="search-input">
      <el-input
        v-model="inputValue"
        prefix-icon="el-icon-search"
        placeholder="请输入姓名/电话/公司搜索"
        clearable
        @keyup.enter.native="searchIt(inputValue)"
      ></el-input>
      <span class="icon-search" @click="searchIt(inputValue)"></span>
    </div>
    <span class="toggle" @click="handleChange(['1'])">更多搜索条件</span>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title name="1">
        <ul v-loading="loading" class="panel">
          <li v-show="queryType === 1 || queryType === 2">
            <label>人才库</label>
            <el-popover placement="bottom-start" trigger="hover">
              <el-tree
                ref="dataTree"
                class="data-tree"
                :data="treeData"
                :props="{ label: 'name' }"
                node-key="id"
                :expand-on-click-node="false"
                highlight-current
                default-expand-all
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node }" class="data-tree-tool-bar">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
              <span
                slot="reference"
                class="el-dropdown-link"
                style="cursor: pointer;font-size: 14px;padding: 0 10px;"
              >
                {{ currData.name }}
                <i class="el-icon-caret-bottom"></i>
              </span>
            </el-popover>
          </li>
          <li>
            <label>年龄</label>
            <span
              v-for="(item,index) in ageArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('ageArr',ageArr,item.value)"
            >{{ item.label }}</span>
          </li>
          <li>
            <label>学历</label>
            <span
              v-for="(item,index) in eduArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('eduArr',eduArr,item.value)"
            >{{ item.label }}</span>
          </li>
          <li>
            <label>工作经验</label>
            <span
              v-for="(item,index) in workExpArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('workExpArr',workExpArr,item.value)"
            >{{ item.label }}</span>
          </li>
          <li>
            <label>期望城市</label>
            <span
              v-for="(item,index) in hopeCityArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('hopeCityArr',hopeCityArr,item.value)"
            >{{ item.label }}</span>
            <span class="more" @click="moreCity">
              更多
              <i />
              <select-picker
                :class-name="'resume-page-picker'"
                :key-name="'attentCity'"
                :first-tab-name="firstTabNameOne"
                :data-source="address"
                :max-number="5"
                :level-number="2"
                :default-value="[]"
                :popover-modal="true"
                @afterClose="handleClose"
              />
            </span>
          </li>
          <li>
            <label>目前年薪</label>
            <span
              v-for="(item,index) in salaryArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('salaryArr',salaryArr,item.value)"
            >{{ item.label }}</span>
          </li>
          <!-- <li>
            <label>标签筛选</label>
            <span
              v-for="(item,index) in tagArr"
              :key="index"
              :class="[item.active ? 'span active' : 'span']"
              @click="checkIt('tagArr',tagArr,item.value)"
            >{{ item.label }}</span>
          </li>-->
        </ul>
        <div v-if="checkedArr.length > 0" class="panel-footer">
          <label>已选</label>
          <el-tag
            v-for="(item,index) in checkedArr"
            :key="index"
            closable
            @close="deleteIt(item.value,item.label,item.name)"
          >{{ item.label }}</el-tag>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import SelectPicker from '@/components/common/selectPicker'
import resumeDict from '@/assets/js/resume'
import { mapState } from 'vuex'
import { uniqueArr } from '@/utils/common'
import { getTalentPoolSelect } from '@/api/resume'

export default {
  components: {
    SelectPicker
  },
  props: {
    // 查询类型
    queryType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      popVisible: false,
      firstTabNameOne: '',
      address: [],
      loading: false,
      inputValue: this.$route.params.searchName || '',
      activeNames: [],
      ageArr: resumeDict.age,
      eduArr: resumeDict.degree,
      workExpArr: resumeDict.workExp,
      hopeCityArr: resumeDict.attentCity,
      salaryArr: resumeDict.yearSalary,
      checkedArr: [],
      treeData: [], // 人才库数据源
      currData: {} // 当前选中节点
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      selectedData: (state) => state.common.selectedData,
      dictData: (state) => state.common.dictData
    })
  },
  watch: {
    queryType() {
      this.currData = {
        id: '',
        name: '所有人才库'
      }
    }
  },
  mounted() {
    this.address =
      this.dictData &&
      this.dictData.areas &&
      JSON.parse(JSON.stringify(this.dictData.areas))
    this.firstTabNameOne =
      this.address && this.address[0] && this.address[0].value
    // 查询人才库
    this.queryTalentPool()
  },
  destroyed() {
    this.checkedArr.filter((item) => {
      item.active = false
    })
    sessionStorage.removeItem('obj')
  },
  methods: {
    // 查询人才库
    queryTalentPool() {
      const para = {}
      getTalentPoolSelect(para).then((data) => {
        this.treeData = data.data || []
        this.treeData.forEach((item, index) => {
          if (item.type === 3) {
            this.treeData.splice(index, 1)
          }
        })
        this.treeData.unshift({
          id: '',
          name: '所有人才库'
        })
        this.currData = this.treeData[0] // 默认选中第一个
      })
    },
    // 切换人才库
    handleNodeClick(data) {
      this.currData = data
      sessionStorage.setItem(
        'talent',
        JSON.stringify({
          talentPoolId: this.currData.id
        })
      )
      this.$emit('searchList')
    },
    // 展开/隐藏
    handleChange(val) {
      if (this.activeNames.length > 0) {
        this.activeNames = []
      } else {
        this.activeNames = val
      }
    },
    // 选择
    checkIt(name, arr, value) {
      this.loading = true
      arr &&
        arr.map((item) => {
          if (item.active) {
            item.active = false
          } else {
            if (item.value === value) {
              item.active = true
            }
          }
          item.name = name
        })
      const label = arr.filter((item) => {
        if (item.value === value) {
          return item.label
        }
      })
      if (label[0].active) {
        this.checkedArr.push(label[0])
      }
      this.checkedArr.map((item) => {
        if (!item.active) {
          this.checkedArr.splice(this.checkedArr.indexOf(item), 1)
        }
      })
      this[name] = arr
      // 已选
      const value1 = this.checkedArr.filter((item) => {
        if (item.name === 'ageArr') {
          return item.value
        }
      })
      const value2 = this.checkedArr.filter((item) => {
        if (item.name === 'eduArr') {
          return item.value
        }
      })
      const value3 = this.checkedArr.filter((item) => {
        if (item.name === 'workExpArr') {
          return item.value
        }
      })
      const value4 = this.checkedArr.filter((item) => {
        if (item.name === 'hopeCityArr') {
          return item.value
        }
      })
      const value5 = this.checkedArr.filter((item) => {
        if (item.name === 'salaryArr') {
          return item.value
        }
      })
      let value4Copy = null
      if (Array.isArray(value4)) {
        value4Copy = value4
        value4Copy = this.deteleObject(value4Copy)
      } else {
        value4Copy = value4 && value4[0] && value4[0].value
        value4Copy = this.deteleObject(value4Copy)
      }
      this.checkedArr = this.deteleObject(this.checkedArr)
      console.log('选择后的1', value4Copy, this.checkedArr)

      this.searchIt(
        this.inputValue,
        value1 && value1[0] && value1[0].value,
        value2 && value2[0] && value2[0].value,
        value3 && value3[0] && value3[0].value,
        value4Copy,
        value5 && value5[0] && value5[0].value
      )
      this.loading = false
    },
    // 删除
    deleteIt(value, label, name) {
      console.log(value, label, name)
      this.loading = true
      const arr = this.checkedArr
      arr &&
        arr.map((item, index) => {
          if (item.label === label) {
            arr.splice(index, 1)
          }
        })
      this.checkedArr = arr
      this[name] &&
        this[name].filter((item) => {
          if (item.label === label) {
            item.active = false
          }
        })
      // 已选

      const value1 = this.checkedArr.filter((item) => {
        if (item.name === 'ageArr') {
          return item.value
        }
      })
      const value2 = this.checkedArr.filter((item) => {
        if (item.name === 'eduArr') {
          return item.value
        }
      })
      const value3 = this.checkedArr.filter((item) => {
        if (item.name === 'workExpArr') {
          return item.value
        }
      })
      const value4 = this.checkedArr.filter((item) => {
        if (item.name === 'hopeCityArr') {
          return item.value
        }
      })
      const value5 = this.checkedArr.filter((item) => {
        if (item.name === 'salaryArr') {
          return item.value
        }
      })
      let value4Copy = null
      if (Array.isArray(value4)) {
        value4Copy = value4
      } else {
        value4Copy = value4 && value4[0] && value4[0].value
      }
      console.log('删除后的', value4, value4Copy)
      this.searchIt(
        this.inputValue,
        value1 && value1[0] && value1[0].value,
        value2 && value2[0] && value2[0].value,
        value3 && value3[0] && value3[0].value,
        value4Copy,
        value5 && value5[0] && value5[0].value
      )
      //
      this.loading = false
    },
    // 更多城市
    moreCity() {
      this.popVisible = true
    },
    handleClose() {
      const arr = uniqueArr(
        JSON.parse(JSON.stringify(this.selectedData.attentCity))
      )
      const checkedArr = JSON.parse(JSON.stringify(this.checkedArr))
      arr &&
        arr.filter((item, index) => {
          this.address.filter((item1) => {
            item1 &&
              item1.children.filter((item2) => {
                if (item2.value === item) {
                  checkedArr.push({
                    value: item,
                    label: item2.label,
                    active: true,
                    name: 'hopeCityArr'
                  })
                }
              })
          })
        })
      this.checkedArr = this.deteleObject(checkedArr)
      // 已选
      const value1 = this.checkedArr.filter((item) => {
        if (item.name === 'ageArr') {
          return item.value
        }
      })
      const value2 = this.checkedArr.filter((item) => {
        if (item.name === 'eduArr') {
          return item.value
        }
      })
      const value3 = this.checkedArr.filter((item) => {
        if (item.name === 'workExpArr') {
          return item.value
        }
      })
      const value5 = this.checkedArr.filter((item) => {
        if (item.name === 'salaryArr') {
          return item.value
        }
      })

      let value4 = []
      this.checkedArr &&
        this.checkedArr.filter((item) => {
          if (item.name === 'hopeCityArr') {
            value4.push(item.value)
            value4 = this.deteleObject(value4)
          }
        })
      this.checkedArr = this.deteleObject(this.checkedArr)
      console.log('选择后的2', value4, this.checkedArr)
      this.searchIt(
        this.inputValue,
        value1 && value1[0] && value1[0].value,
        value2 && value2[0] && value2[0].value,
        value3 && value3[0] && value3[0].value,
        value4,
        value5 && value5[0] && value5[0].value
      )
      this.popVisible = false
    },
    // 数组去重（深拷贝）
    deteleObject(obj) {
      var uniques = []
      var stringify = {}
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i])
        keys.sort((a, b) => {
          return Number(a) - Number(b)
        })
        var str = ''
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j])
          str += JSON.stringify(obj[i][keys[j]])
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i])
          stringify[str] = true
        }
      }
      return uniques
    },
    // 搜索
    searchIt(
      inputValue,
      age,
      degreeCode,
      workMonth,
      intentionCity,
      currentSalarySpecific
    ) {
      if (Array.isArray(intentionCity)) {
        intentionCity.filter((item) => {
          intentionCity.push(item.value)
        })
      }
      console.log(444444, intentionCity)
      sessionStorage.setItem(
        'obj',
        JSON.stringify({
          inputValue,
          age,
          degreeCode,
          workMonth,
          intentionCity,
          currentSalarySpecific
        })
      )
      this.$emit('searchList')
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/resume/searchPart.scss';
</style>
