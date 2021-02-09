<template>
  <div class="chat-bubble">
    <div class="message-content" :class="bubbleStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    isMine: {
      type: Boolean
    },
    isNew: {
      type: Boolean
    }
  },
  computed: {
    bubbleStyle() {
      let classString = ''
      if (this.isMine) {
        classString += 'message-send'
      } else {
        classString += 'message-received'
      }
      if (this.isNew) {
        classString += 'new'
      }
      return classString
    }
  }
}
</script>

<style lang="stylus" scoped>
.openProfile {
  .chat-bubble {
    .message-content {
      max-width 306px
    }
  }
}
.chat-bubble
  position relative
  padding 0 12px
  .message-content
    font-size 16px
    line-height 22px
    color #808080
    position relative
    max-width 360px
    word-wrap break-word
    word-break break-all
    padding 16px
    box-sizing border-box
    // box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
    span
      white-space pre-wrap
      margin 0
      // text-shadow $regular 0 0 0.05em
    img
      vertical-align bottom
    &::before
      position: absolute
      top: 0
      width: 14px
      height: 14px
      content: ''
      background: url('~@/assets/images/notice/msg.png');
      font-family 'tim' !important
      font-size 24px // 32px 在mac上会模糊 24px正常 , window 24px模糊 28px 32px正常  36px windows mac 基本一致，但是太大
  .message-received
    background-color #F8F8F8
    margin-left 15px
    border-radius 0 4px 4px 4px
    &::before
      left -14px
    &.new
      transform: scale(0);
      transform-origin: top left;
      animation: bounce 500ms linear both;
  .message-send
    background-color #F8F8F8
    margin-right 15px
    border-radius 4px 0 4px 4px
    &::before
      right: -14px
      background: url('~@/assets/images/notice/msg_r.png') no-repeat;
    &.new
      // transform: scale(0);
      // transform-origin: top right;
      // animation: bounce 500ms linear both;

@keyframes bounce {
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
}      
</style>
