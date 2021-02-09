<template>
  <div class="left-nemu">
    <ul v-if="showVisible">
      <li
        v-for="(item,index) in this.$store.state.common.menuList"
        :key="index"
        :class="[item.name,item.className]"
        @click="link(item.name)"
      >
        {{ item.title }}
        <i />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    routeName: {
      type: String,
      required: true
    },
    menuList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showVisible: true
    }
  },
  methods: {
    link(name) {
      this.showVisible = false
      const arr = JSON.parse(JSON.stringify(this.$store.state.common.menuList))
      arr.filter(item => {
        if (item.name === name) {
          item.className = 'active'
        } else {
          item.className = ''
        }
      })
      this.$store.commit('setMenuList', arr)
      this.showVisible = true
      this.$router.push({ name })
    }
  }
}
</script>
<style scoped lang="scss">
.left-nemu {
  padding: 20px 16px;
  border-radius: 1px;
  box-sizing: border-box;
  ul {
    li {
      color: #4d4d4d;
      font-size: 16px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
      &::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('~@/assets/images/myCenter/baseInfo.png') no-repeat;
        background-size: 20px;
        display: inline-block;
        margin-right: 11px;
        vertical-align: -4px;
      }
      &.active {
        color: #1678f9;
        i {
          position: absolute;
          width: 8px;
          height: 24px;
          display: inline-block;
          right: -17px;
          top: -2px;
          background: url('~@/assets/images/order/active.png') no-repeat;
          background-size: 8px;
        }
      }
      &.baseInfo {
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/baseInfo_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.skill {
        &::before {
          background: url('~@/assets/images/myCenter/skill.png') no-repeat;
          background-size: 20px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/skill_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.editPassword {
        &::before {
          background: url('~@/assets/images/myCenter/editPassword.png')
            no-repeat;
          background-size: 20px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/editPassword_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.identification {
        position: relative;
        &::after {
          left: 35px;
          content: '';
          position: absolute;
          width: 116px;
          border-bottom: 1px dashed #eee;
          bottom: -10px;
        }
        &::before {
          background: url('~@/assets/images/myCenter/identification.png')
            no-repeat;
          background-size: 20px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/identification_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.attention {
        &::before {
          background: url('~@/assets/images/myCenter/attention.png') no-repeat;
          background-size: 20px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/attention_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.invote {
        &::before {
          background: url('~@/assets/images/myCenter/invote.png') no-repeat;
          background-size: 20px;
          vertical-align: -4px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/invote_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
      &.earning {
        &::before {
          background: url('~@/assets/images/myCenter/earning.png') no-repeat;
          background-size: 20px;
        }
        &.active {
          &::before {
            background: url('~@/assets/images/myCenter/earning_active.png')
              no-repeat;
            background-size: 20px;
          }
        }
      }
    }
  }
}
</style>
