import Vue from 'vue'
import demo from './demo.vue'
// 引入路由
import routerDemo from '@/router/demoIndex'
// 引入设置的store
import store from '@/store'
// 引入路由权限控制
// import '../permission';
// 引入plugins
// import '@/plugins'
// 引入公共样式
import '../assets/iconfont/iconfont.css';
import '@/assets/sass/main.scss'
// 引入苹方字体库
// import '@/assets/font/PingFangRegular.css'
// import '@/assets/font/PingFangMedium.css'
// import '@/assets/font/PingFangBold.css'

// video视频播放组件
// import Video from 'video.js'
// import 'video.js/dist/video-js.css'
// Vue.prototype.$video = Video

Vue.config.productionTip = false

new Vue({
    router: routerDemo,
    store,
    render: h => h(demo)
}).$mount('#demoApp')