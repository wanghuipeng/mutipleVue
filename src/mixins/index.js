const mixin = {
    data () {
        return {
            headerFixed: false // 是否吸顶
        }
    },
    mounted () {
        // handlePageScroll为页面滚动的监听回调
        window.addEventListener('scroll', this.handlePageScroll)
    },
    destroyed () {
        // 销毁页面滚动的监听回调
        window.removeEventListener('scroll', this.handlePageScroll)
    },
    methods: {
        // 监听页面滚动实现吸顶
        handlePageScroll () {
            // 得到页面滚动的距离
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            // 监听dom渲染完成
            this.$nextTick(() => {
                // 这里fixedHeaderRoot是吸顶元素的ID
                const header = document.getElementById('fixedHeaderRoot')
                // 这里要得到top的距离和元素自身的高度
                const offsetTop = header && header.offsetTop
                this.headerFixed = scrollTop > offsetTop
            })
        },
        // 跳转简历详情页面
        toResumePage (resumeId) {
            sessionStorage.setItem('resumeId', resumeId)
            window.open('/resumeDetail')
        }
    }
}
export default mixin