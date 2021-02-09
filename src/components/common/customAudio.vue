<template>
  <div class="custom-audio">
    <div class="audio-play">
      <el-popover placement="top-start" trigger="hover">
        <div class="play-control">
          <p style="position:absolute;left:63px;top:45px;">音量</p>
          <el-progress color="#1678f9" type="circle" :percentage="music.volume" />
          <el-button icon="el-icon-minus" circle @click="changeVolume(-10)" />
          <el-button icon="el-icon-plus" circle @click="changeVolume(10)" />
        </div>
        <el-button
          id="play"
          slot="reference"
          class="play-btn"
          :icon="music.isPlay ? 'el-icon-refresh' : 'el-icon-caret-right'"
          circle
          @click="play"
        />
      </el-popover>
    </div>
    <div class="audio-progress">
      <el-slider
        v-model="music.currentTime"
        :format-tooltip="formatTime"
        :max="music.maxTime"
        @change="changeTime"
      />
    </div>
    <div class="audio-time">{{ formatTime(music.currentTime) }}/{{ formatTime(music.maxTime) }}</div>
    <audio ref="music">
      <source
        :src="url"
        type="audio/mpeg"
      />
    </audio>
  </div>
</template>

<script>
export default {
  props: {
    // 访问路径
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      music: {
        isPlay: false,
        currentTime: 0,
        maxTime: 0,
        volume: 100
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.listenMusic, 1000)
    })
  },
  methods: {
    listenMusic() {
      if (!this.$refs.music) {
        return
      }
      if (this.$refs.music.readyState) {
        this.music.maxTime = this.$refs.music.duration
      }
      this.music.isPlay = !this.$refs.music.paused
      this.music.currentTime = this.$refs.music.currentTime
    },
    play() {
      if (this.$refs.music.paused) {
        this.$refs.music.play()
      } else {
        this.$refs.music.pause()
      }
      this.music.isPlay = !this.$refs.music.paused
      this.$nextTick(() => {
        document.getElementById('play').blur()
      })
    },
    changeTime(time) {
      this.$refs.music.currentTime = time
    },
    changeVolume(v) {
      this.music.volume += v
      if (this.music.volume > 100) {
        this.music.volume = 100
      }
      if (this.music.volume < 0) {
        this.music.volume = 0
      }
      this.$refs.music.volume = this.music.volume / 100
    },
    formatTime(time) {
      const it = parseInt(time)
      const m = parseInt(it / 60)
      const s = parseInt(it % 60)
      return (
        (m < 10 ? '0' : '') +
        parseInt(it / 60) +
        ':' +
        (s < 10 ? '0' : '') +
        parseInt(it % 60)
      )
    }
  }
}
</script>
<style scoped lang="scss">
.custom-audio {
  display: flex;
  height: 52px;
  line-height: 52px;
  padding: 0 20px;
  background-color: #f8f8f8ff;
  border-radius: 8px;
  overflow: hidden;
  .audio-play {
    width: 30px;
    margin-right: 20px;
    .play-btn {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin: 11px 0;
      padding: 0;
    }
  }
  .audio-progress {
    flex: auto;
    ::v-deep .el-slider__runway {
      margin: 23px 0;
      background-color: #cdcdcdff;
      .el-slider__bar {
        background-color: #1678f9;
      }
      .el-slider__button {
        width: 12px;
        height: 12px;
        border-color: #1678f9;
      }
    }
  }
  .audio-time {
    margin-left: 20px;
    font-size: 15px;
    color: #4c4c4cff;
  }
}
</style>

