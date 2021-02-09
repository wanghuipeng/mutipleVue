<template>
  <div class="wrap">
    <div class="main">
      <div class="panel" style="width: 940px;">
        <div class="panel-body" style="padding: 40px;">
          <div class="left-description">
            <div>
              <div class="description-title">
                <img src="@/assets/images/login/ai-icon.png" />
                <span>小猎AI机器人</span>
              </div>
              <div
                class="description-content"
              >亲爱的{{ $store.state.userInfo.nickName }}，感谢您的支持， 通过您刚才的反馈，我们推荐您关注以下标签，当平台有相关职位上线时，我们会第一时间提醒您。 如果觉得不满意的话，也可以</div>
              <el-button type="text" class="description-btn" @click="changeList">点我换一批</el-button>
            </div>
          </div>
          <el-form
            ref="submitForm"
            class="submit-form white-form"
            :model="submitForm"
            :rules="submitFormRules"
            label-width="0"
          >
            <el-form-item v-for="item in renderList" :key="item.id" style="margin-bottom: 40px;">
              <div
                :class="['card-item',{active: followList.indexOf(item.id) !== -1}]"
                @click="toggleSelect(item.id)"
              >
                <img v-if="item.logo" :src="item.logo" class="item-logo" />
                <img v-else src="~@/assets/images/common/company_avatar.png" class="item-logo" />
                <div class="item-main">
                  <p class="main-name">{{ item.name }}</p>
                  <p
                    class="main-info"
                  >{{ item.cityId | filterLevel2(dictData.areas) }} · {{ item.industrys1 | filterCommonDict(dictData.industry) }} · {{ item.financing | filterCommonDict(dictData.dicts.financing) }}</p>
                </div>
                <i class="item-icon el-icon-success" />
              </div>
            </el-form-item>
            <el-form-item class="all-screen">
              <el-button type="primary" :loading="$store.state.nextLoading" @click="follow">完成</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHhRecommendCompanyList, registerFollowCompany } from '@/api/login'
export default {
  components: {},
  data() {
    return {
      // 提交表单
      submitForm: {},
      // 提交表单校验规则
      submitFormRules: {},
      // 企业列表
      companyList: [],
      // 关注列表
      followList: []
    }
  },
  computed: {
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染列表
    renderList() {
      const that = this
      const index = that.companyList.length >= 3 ? 3 : that.companyList.length
      const arr = this.getRandomArrayElements(that.companyList, index)
      const result = []
      arr.forEach(item => {
        result.push(item.id)
      })
      that.followList = result
      return arr
    }
  },
  mounted() {
    document.title = '新手引导-大猎英才'
    // 查询推荐企业列表
    this.queryCompanyList()
  },
  methods: {
    // 查询推荐企业列表
    queryCompanyList() {
      const para = {}
      para.pageNumber = 1
      para.pageSize = 9
      getHhRecommendCompanyList(para).then(res => {
        this.companyList = res.data
      })
    },
    // 从数组中随机取值
    getRandomArrayElements(arr, count) {
      const shuffled = arr.slice(0)
      let i = arr.length
      const min = i - count
      let temp = ''
      let index = ''
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    // 换一换
    changeList() {
      if (this.companyList.length) {
        // 反序无实际意义，只是为了改变原数组触发计算属性重新渲染数据
        this.companyList.reverse()
      } else {
        this.$message({
          message: '没有更多数据了!',
          type: 'info',
          showClose: true,
          center: true
        })
      }
    },
    // 勾选企业
    toggleSelect(id) {
      const index = this.followList.indexOf(id)
      if (index !== -1) {
        this.followList.splice(index, 1)
      } else {
        this.followList.push(id)
      }
    },
    // 完成
    follow() {
      this.$store.dispatch('dispatchUpdateNextLoading', true)
      const para = {}
      para.companyIds = this.followList
      registerFollowCompany(para).then(res => {
        const userInfo = this.$store.state.userInfo
        userInfo.registerProcess = 4
        this.$store.dispatch('dispatchUpdateUserInfo', userInfo)
        this.$router.push('/position/all')
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/login/common.scss';
.left-description {
  height: 442px;
}
.submit-form {
  position: relative;
  .all-screen {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>

