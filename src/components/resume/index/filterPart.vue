<template>
  <div class="filter-part">
    <span class="total">共{{ $props.total || 0 }}条简历</span>
    <div class="right">
      <el-checkbox-group v-model="universityLabel" @change="change1">
        <el-checkbox :label="2">985</el-checkbox>
        <el-checkbox :label="1">211</el-checkbox>
        <el-checkbox :label="3">知名互联网公司</el-checkbox>
        <el-checkbox :label="4">世界500强</el-checkbox>
      </el-checkbox-group>

      <el-select v-model="value" popper-class="resume-page-select" @change="change2">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { deleteArrItem } from '@/utils/common'

export default {
  props: {
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      universityLabel: [],
      orderBy: null,
      value: '1',
      options: [
        {
          value: '1',
          label: '最近更新'
        },
        {
          value: '2',
          label: '最近上传'
        },
        {
          value: '3',
          label: '最新推荐'
        }
      ]
    }
  },
  methods: {
    change1(e) {
      this.universityLabel = e
      const arrTemp = JSON.parse(JSON.stringify(e))
      console.log(
        e,
        e.indexOf(1) !== -1,
        e.indexOf(2) !== -1,
        e.indexOf(3) !== -1,
        e.indexOf(4) !== -1
      )
      if (
        e.indexOf(1) !== -1 ||
        e.indexOf(2) !== -1 ||
        (e.indexOf(1) !== -1 && e.indexOf(2) !== -1)
      ) {
        if (e.indexOf(3) !== -1) {
          deleteArrItem(arrTemp, 3)
        }
        if (e.indexOf(4) !== -1) {
          deleteArrItem(arrTemp, 4)
        }
        sessionStorage.setItem('universityLabel', arrTemp)
      } else {
        sessionStorage.removeItem('universityLabel')
      }
      if (e.indexOf(3) !== -1) {
        sessionStorage.setItem('famousCompany', 1)
      } else {
        sessionStorage.setItem('famousCompany', null)
      }
      if (e.indexOf(4) !== -1) {
        sessionStorage.setItem('top500', 1)
      } else {
        sessionStorage.setItem('top500', null)
      }
      this.$emit('searchList')
    },
    change2(e) {
      this.orderBy = e
      sessionStorage.setItem('orderBy', this.orderBy)
      this.$emit('searchList')
    }
  }
}
</script>
<style  lang="scss">
.resume-page-select {
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
}
.resume-page {
  .filter-part {
    height: 32px;
    padding-bottom: 6px;
    .total {
      color: #343434;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
    }
    .right {
      .el-select {
        .el-select-dropdown__item {
          color: #4c4c4c;
        }
        .el-input__inner {
          border-radius: 1px;
          height: 30px;
          line-height: 30px;
          width: 106px;
          color: #4d4d4d;
          border: 1px solid #b2b2b2;
        }
        .el-input__icon {
          width: 8px;
          line-height: 15px;
          height: 15px;
        }
        .el-input__suffix {
          right: 13px;
          top: 7px;
          height: 15px;
          .el-input__suffix-inner {
            height: 15px;
          }
          .el-icon-arrow-up::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('~@/assets/images/resume/arrow_d.png') no-repeat;
            background-size: 16px;
            transform: rotateZ(180deg);
            margin-left: -4px;
            margin-top: -1px;
          }
        }
      }
      .el-checkbox-group {
        display: inline-block;
        .el-checkbox {
          margin-right: 20px;
          .el-checkbox__label {
            color: #4d4d4d;
            padding-left: 6px;
          }
          .el-checkbox__inner {
            margin-top: -2px;
            width: 18px;
            height: 18px;
            border-color: #b3b3b3;
            border-radius: 100%;
          }
          .is-checked .el-checkbox__inner {
            background: url('~@/assets/images/resume/check_little.png')
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
</style>
