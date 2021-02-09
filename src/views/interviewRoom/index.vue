<template>
  <div class="interviewRoom">
    <div class="interview">
      <p class="time">
        面试间剩余时长：<span>{{ interviewTime }}</span>分钟
      </p>
      <p class="switch">
        开启视频面试
        <el-switch
          v-model="openInterview"
          active-color="#1678F9"
          inactive-color="#DCDFE6"
          @change="changeSwitchStatus"
        />
      </p>
      <p class="tab">
        <span :class="{active: interviewStatus === 1}" @click="changeTab(1)">面试中</span>
        <span :class="{active: interviewStatus === 2}" @click="changeTab(2)">面试完成</span>
      </p>
      <div v-if="list.length > 0" class="list">
        <div v-for="(item, index) in list" :key="index" class="list-item" :class="{activeInterview: index === interviewIdx}" @click="checkInterviewer(item, index)">
          <img v-if="item.avator" class="avatar" :src="item.avator" />
          <img v-else class="avatar" src="@/assets/images/notice/avatar_unknown.png" />
          <div class="info">
            <p class="name">
              {{ item.nickName }}
              <span v-if="item.imIsOnline">在线</span>
              <span v-else>离线</span>
            </p>
            <p v-if="item.statusNo === 1" class="status">等待面试：排号{{ item.interviewNo }}</p>
            <p v-if="item.statusNo === 2" class="status">正在面试</p>
            <p v-if="item.statusNo === 3" class="status">
              <span>{{ item.interviewStartTime }}</span>
              <span v-if="item.communicationTimeStr === '00:00'"> 未接通</span>
              <span v-else>通时 {{ item.communicationTimeStr }}</span>
            </p>
            <p v-if="item.statusNo === 4" class="status">面试取消</p>
          </div>
        </div>
      </div>
      <div v-else class="empty">还没有面试人员哦~</div>
    </div>
    <div class="room">
      <div class="videoChat">
        <div v-if="interviewStatus === 1 && !isCalling">
          <p v-if="isInterview" class="btns center" style="height: 100%;">
            <span v-if="toAccount*1 !== userID*1" @click="videoCall">开始面试</span>
            <span @click="cancel">下一个</span>
          </p>
          <p v-else class="tips center">请在左侧选择招聘会及需要面试的人选，即可开始视频面试。</p>
        </div>
        <div class="video">
          <call-layer
            ref="callLayer"
            class="chat-wrapper"
            @playMusic="playMusic"
            @closeMusic="closeMusic"
            @startVedio="startVedio"
            @endVedio="endVedio"
          />
        </div>
      </div>
      <div v-if="drawer" class="resume">
        <resume-detail slot="inner-body" />
      </div>
    </div>

    <audio id="audio" loop="loop">
      <source
        src="@/assets/audio/call.mp3"
        type="audio/mpeg"
      />
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  getLiveRecordByUserId,
  updateVideoInterviewRoomSwitch,
  getInterviewPage,
  startInterview,
  cancenInterview
} from '@/api/interviewRoom'
// import DrawerCommon from '@/components/common/drawerCommon'
import ResumeDetail from '@/components/resume/index/resumeDetail'
import CallLayer from '@/TIM/src/components/message/call-layer'
let temper = null
export default {
  components: {
    // DrawerCommon,
    ResumeDetail,
    CallLayer
  },
  data() {
    return {
      drawer: false,
      interviewTime: '',
      openInterview: false,
      interviewStatus: 1,
      pageNumber: 1,
      pageSize: 20,
      list: [],
      isInterview: false, // 通话按钮显隐
      resumeId: '',
      interviewerInfo: '', // 面试者信息
      interviewIdx: '',
      audio: '',
      isCalling: false
    }
  },
  computed: {
    ...mapGetters(['toAccount']),
    ...mapState({
      userID: state => state.userInfo.userId
    })
  },
  mounted() {
    this.getStatus()
    this.getListFirst()
    this.$bus.$on('openResume', this.toResumeDetail)
    this.$bus.$on('updateInterviewTime', this.getStatus)
  },
  beforeDestroy() {
    clearInterval(temper)
    this.$store.dispatch(
      'updateToAccountInfo',
      ''
    )
    this.$bus.$emit('leaveInterviewRoom')
  },
  methods: {
    // 获取面试间状态
    getStatus() {
      this.isInterview = false
      getLiveRecordByUserId().then(res => {
        this.interviewTime = res.data.videoInterviewTimeBalance
        // 面试间剩余时间大于0是才开启
        this.openInterview = res.data.videoInterviewTimeBalance > 0
        ? res.data.interviewRoomSwitch
        : false
      })
    },
    // 第一次获取
    getListFirst() {
      const arr = this.interviewStatus === 1 ? [1, 2] : [3, 4]
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        statusList: arr + ''
      }
      getInterviewPage(params).then(res => {
        this.list = res.data && res.data.records || []
        this.getList()
      })
    },
    // 获取面试者列表
    getList() {
      temper = setInterval(() => {
        const arr = this.interviewStatus === 1 ? [1, 2] : [3, 4]
        const params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          statusList: arr + ''
        }
        getInterviewPage(params).then(res => {
          this.list = res.data && res.data.records || []
          if (this.list.length === 0) {
            this.isInterview = false
          }
        })
      }, 3000)
    },
    // 修改开关状态
    changeSwitchStatus() {
      const params = {
        liveSwitch: this.openInterview
      }
      updateVideoInterviewRoomSwitch(params).then(res => {
      }).catch((err) => {
        if (err.data.code === '213501') {
          this.openInterview = !this.openInterview
        }
      })
    },
    // TAB切换
    changeTab(val) {
      this.interviewStatus = val
      this.interviewIdx = ''
      this.isInterview = false
      clearInterval(temper)
      this.getListFirst()
    },
    // 选择面试者
    checkInterviewer(data, idx) {
      this.interviewIdx = idx
      this.interviewerInfo = data
      this.resumeId = data.resumeId
      this.isInterview = true
      this.$store.dispatch(
        'checkoutConversation',
        'C2C' + data.imUserId
      )
      this.$store.dispatch(
        'updateToAccountInfo',
        data
      )
    },
    // 视频通话
    videoCall() {
      console.log(12344)
      if (this.interviewerInfo.imIsOnline) {
        const params = {
          interviewId: this.interviewerInfo.interviewId
        }
        startInterview(params).then(res => {
          console.log(res)
        })
        this.$bus.$emit('video-call')
      } else {
        this.$message.error('面试者离线状态')
      }
    },
    // 取消面试
    cancel() {
      const params = {
        interviewId: this.interviewerInfo.interviewId
      }
      cancenInterview(params).then(res => {
        this.$message.success('取消面试')
        // 自动下一个
        this.checkInterviewer(this.list[0], 0)
      })
    },
    toResumeDetail(val) {
      this.drawer = !this.drawer
      const resumeId = val === null ? this.resumeId : val
      sessionStorage.setItem('resumeId', resumeId)
    },
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.drawer = false
    },
    // 播放铃声
    playMusic() {
      const audio = document.getElementById('audio')
      audio.play()
    },
    // 播放铃声
    closeMusic() {
      const audio = document.getElementById('audio')
      audio.pause()
    },
    // 开始通话
    startVedio() {
      this.isCalling = true
    },
    // 通话结束
    endVedio() {
      this.drawer = false
      this.isCalling = false
    }
  }
}
</script>

<style lang="scss" scoped>
.interviewRoom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // width: 660px;
  height: 80%;
  border-radius: 4px;
  // margin-left: 270px;
  overflow: hidden;
  .interview {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    background: #ffffff;
    position: relative;
    .time {
      font-size: 14px;
      color:#333333;
      line-height: 20px;
      border-bottom: 1px solid #DCDFE6;
      margin: 0 20px;
      padding: 20px 0;
      span {
        display: inline-block;
        font-size: 28px;
        font-weight: 600;
        color: #1678F9;
        line-height: 40px;
        margin: 0 4px;
      }
    }
    .switch {
      font-size: 14px;
      color:#333333;
      line-height: 20px;
      border-bottom: 1px solid #DCDFE6;
      padding: 20px;
      .el-switch {
        float: right;
      }
    }
    .tab {
      display: flex;
      flex-direction: row;
      justify-content: center;
      font-size: 14px;
      color:#666666;
      line-height: 20px;
      padding-top: 20px;
      padding-bottom: 12px;
      span {
        cursor: pointer;
        &:first-child {
          margin-right: 28px;
        }
      }
      .active {
        font-weight: 600;
        color: #1678F9;
        position: relative;
        &::before {
          content: '';
          width: 32px;
          height: 2px;
          background: #1678F9;
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .list {
      flex: 1;
      overflow-y: scroll;
      .list-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 20px;
        &.activeInterview {
          background: #f8f8f8;
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 16px;
        }
        .info {
          flex: 1;
          .name {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 600;
            color: #4D4D4D;
            line-height: 16px;
            span {
              display: inline-block;
              height: 18px;
              line-height: 18px;
              font-size: 12px;
              font-weight: 400;
              color: #1678F9;
              line-height: 18px;
              /* background: #1678F9; */
              border-radius: 2px;
              padding: 0 4px;
              border: 1px solid #1678F9;
            }
          }
          .status {
            font-size: 14px;
            color: #808080;
            line-height: 20px;
            overflow: hidden;
            span:last-child {
              float: right;
            }
          }
        }
      }
    }
    .empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .room {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
    background: #ffffff;
    position: relative;
    border-left: 1px solid #DCDFE6;
    background: url('~@/assets/images/interviewRoom/bg.png') no-repeat;
    background-size: cover;
    .videoChat {
      width: 375px;
      .center {
        font-size: 16px;
        color: #666666;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .video {
        // position: relative;
        height: 100%;
      }
      .btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          display: inline-block;
          width: 60px;
          height: 60px;
          line-height: 60px;
          font-size: 12px;
          color: #FFFFFF;
          text-align: center;
          background: #1678F9;
          border-radius: 50%;
          margin-right: 80px;
          cursor: pointer;
          &:last-child {
            margin: 0;
          }
        }
      }
    }
    .chat-wrapper {
      width: 340px;
      height: 550px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .resume {
      flex: 1;
      overflow: auto;
      .resume-detail {
        padding: 0;
        background-color: none;
      }
    }
  }
}
</style>
