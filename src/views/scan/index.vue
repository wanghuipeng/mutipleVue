<template>
  <div class="panel">
    <div class="panel-body">
      <div id="qrcode" class="qr-code">
        <div v-if="lose" class="lose">
          <p>请重新刷新二维码</p>
          <el-button type="primary" @click="refresh">点击刷新</el-button>
        </div>
        <div v-if="loading" class="lose losed">
          <p>扫描成功,即将跳转</p>
        </div>
      </div>
      <div class="tip">
        <p class="title">扫描二维码</p>
        <p class="text">登录大猎英才进行后续操作</p>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { generateQrCodeAuthToken, getQrCodeAuthResult } from '@/api/scan'
let interval = null

export default {
  inject: ['reload'],
  data() {
    return {
      link: 'dalieyingcai://login?token=',
      qrCodeAuthToken: null,
      lose: false,
      loading: false
    }
  },
  mounted() {
    this.generateQrCodeAuthToken()
    interval = setInterval(() => {
      this.getQrCodeAuthResult()
    }, 3000)
  },
  destroyed() {
    window.clearInterval(interval)
  },
  methods: {
    getNum() {
      var chars = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
      ]
      let nums = ''
      for (let i = 0; i < 32; i++) {
        const id = parseInt(Math.random() * 61)
        nums += chars[id]
      }
      return nums
    },
    generateQrCodeAuthToken() {
      const params = {
        qrCodeAuthToken: this.getNum()
      }
      generateQrCodeAuthToken(params).then(res => {
        const { code } = res
        if (code === '000000') {
          this.lose = false
          this.qrCodeAuthToken = res.data
          this.$nextTick(function() {
            this.qrcode()
          })
        }
      })
    },
    refresh() {
      window.location.reload()
      this.generateQrCodeAuthToken()
    },
    getQrCodeAuthResult() {
      getQrCodeAuthResult(this.qrCodeAuthToken).then(res => {
        const { code } = res
        if (code === '000000') {
          if (Object.keys(res.data).length === 0) {
            console.log('轮询')
          } else {
            window.clearInterval(interval)
            this.$store.dispatch('dispatchUpdateUserInfo', res.data)
            this.loading = true
            // this.$message({
            //   message: '扫码成功',
            //   type: 'success',
            //   duration: 1500
            // })
            const attachParam = res.data.attachParam
            setTimeout(() => {
              this.$router.push({ path: attachParam })
            }, 1500)
          }
        } else if (code === '100612') {
          this.lose = true
        }
      })
    },
    //  生成二维码
    qrcode() {
      const qrcode = new QRCode('qrcode', {
        width: 200,
        height: 200, // 高度
        text: this.link + this.qrCodeAuthToken, // 二维码内容
        render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',   // 背景色
        // foreground: '#ff0'    // 前景色
      })
      console.log(qrcode)
    }
  }
}
</script>
<style scoped lang="scss">
.panel {
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 3px rgba(0, 0, 0, 0.08);
}
.panel-body {
  padding: 40px;
  flex-direction: column;
  text-align: center;
  padding-bottom: 80px !important;
  .qr-code {
    width: 200px;
    height: 200px;
    margin: 60px auto 0 auto;
    position: relative;
    img {
      position: absolute;
      top: -30px;
      left: -30px;
    }
    .lose {
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.9);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      p {
        font-size: 16px;
        color: #333;
        margin: 50px 0 20px 0;
      }
      button {
        border-radius: 0;
        font-size: 16px;
      }
    }
    .losed {
      p {
        margin: 80px 0 20px 0;
        font-weight: bold;
      }
    }
  }
  .tip {
    font-size: 16px;
    color: #666;
    margin-top: 25px;
    .title {
      margin-bottom: 5px;
    }
  }
}
</style>
