<template>
  <div class="left-menu">
    <div class="part-1">
      <div
        :class="[$route.query.isRecommend == 0 || typeof($route.query.isRecommend) === 'undefined' ? 'item item-all active' : 'item item-all']"
        @click="jumpLink('resume',0)"
      >
        全部简历
        <span v-if="$props.total1" class="nums">{{ $props.total1 }}</span>
      </div>
      <div
        :class="[$route.query.isRecommend == 1 ? 'item item-recommend active' : 'item item-recommend']"
        @click="jumpLink('resume',1)"
      >
        推荐过的
        <span v-if="$props.total2" class="nums">{{ $props.total2 }}</span>
      </div>
      <!-- <div
        :class="[$route.query.isRecommend == 2 ? 'title active' : 'title']"
        @click="jumpLink('resumeList',2)"
      >
        新的线索
        <span v-if="$props.total3" class="num">{{ $props.total3 }}</span>
      </div>-->
    </div>
    <div class="part-2">
      <div class="title" @click="uploadResume">
        <i class="el-icon-plus"></i> 上传简历
      </div>
    </div>

    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer v-if="drawer" slot="inner-body" ref="uploadDrawer" @fatherMethod="close" />
    </drawer-common>
  </div>
</template>

<script>
import DrawerCommon from '@/components/common/drawerCommon'
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer'

export default {
  components: {
    DrawerCommon,
    UploadDrawer
  },
  props: {
    total1: {
      type: Number,
      required: true,
      default: 0
    },
    total2: {
      type: Number,
      required: true,
      default: 0
    },
    total3: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    uploadResume() {
      this.drawer = true
    },
    close() {
      this.drawer = false
      this.$refs.uploadDrawer.destroyedInterval()
    },
    jumpLink(name, isRecommend) {
      this.$router.push({ name, query: { isRecommend } })
      if (isRecommend !== 2) {
        if (isRecommend === 0) {
          document.title = '人才库-大猎英才'
        } else if (isRecommend === 1) {
          document.title = '我推荐过的简历-大猎英才'
        }
        this.$emit('searchList', isRecommend)
      }
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/resume/leftMenu.scss';
</style>
