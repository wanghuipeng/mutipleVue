<template>
  <div class="avatar" :class="shape === 'circle' ? 'shape-circle' : ''">
    <img :src="avatarSrc" >
  </div>
</template>

<script>
import systemAvatar from '@/TIM/src/assets/image/system.png'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    src: String,
    type: {
      type: String,
      default: 'C2C'
    },
    shape: {
      type: String,
      default: 'circle'
    },
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    avatarSrc: function() {
      const src = this.src
      if (/^(https:|http:|\/\/)/.test(src)) {
        return src
      } else {
        return this.defaultSrc
      }
    },
    defaultSrc: function() {
      switch (this.type) {
        case 'C2C':
          // 个人头像
          if (this.user) {
            if (this.user.gender === 'Gender_Type_Female') {
              return require('@/assets/images/notice/avatar_woman.png')
            } else if (this.user.gender === 'Gender_Type_Male') {
              return require('@/assets/images/notice/avatar_man.png')
            }
          }
          return require('@/assets/images/notice/avatar_unknown.png')
        case 'GROUP':
          // 群默认头像
          return 'https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-3.png'
        case this.TIM.TYPES.CONV_SYSTEM:
          return systemAvatar
        default:
          // 默认头像
          if (this.user) {
            if (this.user.gender === 'Gender_Type_Female') {
              return require('@/assets/images/notice/avatar_woman.png')
            } else if (this.user.gender === 'Gender_Type_Male') {
              return require('@/assets/images/notice/avatar_man.png')
            }
          }
          return require('@/assets/images/notice/avatar_unknown.png')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar {
  // background-color: $first;
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.shape-circle {
  border-radius: 50%;
}
</style>
