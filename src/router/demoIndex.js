import Vue from 'vue'
import Router from 'vue-router'

// 登录模块
const notFound = r => require.ensure([], () => r(require('@/demo/views/notFound')), 'notFound')

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    scrollBehavior: (to, from, savedPosition) => ({
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(savedPosition.x, savedPosition.y)
            }, 200)
        }
    }),
    mode: 'history',
    linkActiveClass: 'active',
    routes: [{
            path: '/demo/notFound',
            name: 'notFound',
            component: notFound
        },
        {
            path: '*',
            redirect: '/notFound'
        }
    ]
})