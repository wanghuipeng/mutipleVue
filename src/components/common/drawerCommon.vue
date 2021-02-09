<template>
  <el-drawer
    custom-class="fix-drawer"
    :visible.sync="visible"
    :direction="direction"
    :modal-append-to-body="true"
    append-to-body
    :modal="modal"
    :show-close="false"
    :before-close="handleClose"
    :close-on-click-modal="true"
    :size="size"
  >
    <template v-if="drawerNew">
      <i class="icon-close-x" @click="handleClose" />
      <span v-if="drawerNew" class="icon-bar">
        <i v-if="!$props.noNewWindow" class="icon-newWindow" @click="()=>windowOpen(url)" />
      </span>
    </template>
    <span v-else class="icon-bar">
      <i class="icon-close" @click="handleClose" />
      <i v-if="!$props.noNewWindow" class="icon-newWindow" @click="()=>windowOpen(url)" />
    </span>
    <div class="drawer-detail-inner">
      <slot name="inner-body" />
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      required: true
    },
    router: {
      type: String,
      default: '',
      required: false
    },
    noNewWindow: {
      type: Boolean,
      default: false,
      required: false
    },
    size: {
      type: String,
      default: '900',
      required: false
    },
    direction: {
      type: String,
      default: 'rtl',
      required: false
    },
    modal: {
      type: Boolean,
      default: false,
      required: false
    },
    drawerNew: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {}
  },
  computed: {
    visible() {
      return this.$props.drawer
    },
    url() {
      return this.$props.router
    }
  },
  methods: {
    // 打开新窗口
    windowOpen(componentName) {
      window.open(`/${componentName}`)
    },
    // 抽屉关闭
    handleClose() {
      this.$emit('update:drawer', false)
      this.$emit('close')
    }
  }
}
</script>
<style  lang="scss">
@import '@/assets/sass/common/drawerCommon.scss';
</style>
