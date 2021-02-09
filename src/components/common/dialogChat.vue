<template>
  <div v-if="config" class="dialog" @click="config = false">
    <div class="chat-container" @click.stop>
      <div class="close" @click="config = false">
        <img src="@/assets/images/notice/close_chat.png" />
      </div>
      <chat />
    </div>
  </div>
</template>

<script>
import chat from './chat'
export default {
  components: {
    chat
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    config: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    // this.stopMove()
  },
  methods: {
    close() {
      this.visible = false
      // this.move()
    },
    // 停止页面滚动
    stopMove() {
      const m = function(e) {
        e.preventDefault()
      }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', m, { passive: false }) // 禁止页面滑动
    },
    // 开启页面滚动
    move() {
      const m = function(e) {
        e.preventDefault()
      }
      document.body.style.overflow = ''
      document.removeEventListener('touchmove', m, { passive: true })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(26, 26, 26, 0.65);
  z-index: 2000;
  .chat-container {
    position: relative;
    width: 960px;
    height: 90%;
    .close {
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: -40px;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
