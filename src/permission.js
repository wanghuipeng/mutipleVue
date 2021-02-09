import router from '@/router'
import store from '@/store';
import http from '@/utils/http'
import tim from '@/TIM/src/tim'
/**
 * 路由白名单(进入路由前不进行页面权限校验的路由)
 */
const routerWhiteList = [
    '/notFound', // 错误页
    '/login', // 登录页
    '/forgetPassword', // 找回密码页
    '/register', // 注册页
    '/protocol1', // 用户协议
    '/protocol2', // 用户协议
    '/scan', // 小程序扫码登录页
    '/srp', // 小程序扫码登录页
    '/upgrade', // 企业注册页
    '/signup', // 供应商注册页
    '/reserve', // 招聘会封面页
    '/middlePage' // 免密登录中转页
];

/**
 * 路由控制名单(进入路由前进行页面逻辑控制的路由)
 */
const routerControlList = [
    '/completeInfo', // 完善资料
    '/guide1', // 新手引导1
    '/guide2', // 新手引导2
    '/material', // 填写企业资料
    '/capital', // 填写供应商资料
    '/certification', // 企业认证
    '/certificationWait', // 企业认证中
    '/certificationFail' // 企业认证失败
];

/**
 * 特殊路由控制名单(进入特殊路由前进行页面逻辑控制的路由)(开放猎场)
 */
const specialRouterControlList = [
    '/position/all',
    '/position/recommend',
    '/position/follow',
    '/position/monad',
    '/position/record',
    '/position/browse'
];

/**
 * 路由权限拦截
 */
router.beforeEach(function(to, from, next) {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = '大猎英才'
    }
    // 存储字典数据
    const data = window.DICTDATA
    data.areas && data.areas.forEach(firstItem => {
        if (firstItem.children.length) {
            firstItem.children.forEach(secondItem => {
                if (secondItem.children && secondItem.children.length) {
                    secondItem.children.forEach(thirdItem => {
                        delete thirdItem.children;
                    });
                } else {
                    delete secondItem.children;
                }
            });
        } else {
            delete firstItem.children;
        }
    });
    store.dispatch('dispatchUpdateDictData', data);
    // 查询当前登录用户信息
    const userInfo = store.state.userInfo;
    if (userInfo.userId) {
        const para = {};
        para.userId = userInfo.userId;
        http.requestGet(`/ucenter/auth/getCurrentUserInfo`, para).then(res => {
            store.dispatch('dispatchUpdateUserInfo', res.data);
            // if (!store.state.user.isSDKReady) {
            tim.login({
                    userID: store.state.userInfo.userId + '',
                    userSig: store.state.userInfo.imUserSig
                })
                .then((res) => {
                    setTimeout(() => {
                        if (store.state.user.isSDKReady && tim.getConversationList) {
                            tim.getConversationList().then(res => {
                                const list = res.data.conversationList
                                let num = 0
                                list.map(item => {
                                    num += item.unreadCount
                                })
                                store.commit('setUnreadCount', num)
                            })
                        }
                    }, 1000)
                    store.commit('toggleIsLogin', true)
                    store.commit('startComputeCurrent')
                })
                .catch(error => {
                    store.commit('showMessage', {
                        message: '登录失败：' + error.message,
                        type: 'error'
                    })
                })
                // }
        });
        http.requestGet(`/ucenter/profile/getUserProfile`).then(res => {
            store.dispatch('dispatchUpdateUserProfile', res.data)
        })
    }
    // 路由拦截逻辑
    const isLogin = store.state.isLogin;
    const registerProcess = userInfo.registerProcess;
    if (isLogin) {
        if (routerWhiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            if (routerControlList.indexOf(to.path) !== -1) {
                if (to.path === '/certification') {
                    if (userInfo.companyId && userInfo.companyCertificationStatus === 0 || userInfo.companyCertificationStatus === 3) {
                        next();
                    } else {
                        next('/');
                    }
                } else if (to.path === '/certificationWait') {
                    if (userInfo.companyId && userInfo.companyCertificationStatus === 2) {
                        next();
                    } else {
                        next('/');
                    }
                } else if (to.path === '/certificationFail') {
                    if (userInfo.companyId && userInfo.companyCertificationStatus === 3) {
                        next();
                    } else {
                        next('/');
                    }
                } else {
                    next();
                }
            } else {
                if (registerProcess === 1) { // 完善资料
                    next('/completeInfo');
                } else {
                    // 暂时关闭企业强制认证，因为企业一般不愿意接受
                    // if (userInfo.companyId && userInfo.companyCertificationStatus === 2) { // 认证中
                    //     next('/certificationWait');
                    // }
                    // if (userInfo.companyId && userInfo.companyCertificationStatus === 3) { // 认证失败
                    //     next('/certificationFail');
                    // }
                    if (specialRouterControlList.indexOf(to.path) !== -1) {
                        // 暂时关闭开放猎场访问引导
                        // if (registerProcess === 2) { // 新手引导1
                        //     next('/guide1');
                        // }
                        // if (registerProcess === 3) { // 新手引导2
                        //     next('/guide2');
                        // }
                        next();
                    }
                    if (to.path === '/') {
                        console.log('角色', userInfo.companyAccountType)
                            // 普通租户和供应商判断
                        if (userInfo.companyAccountType === 1) { // 企业
                            next('/home');
                        } else if (userInfo.companyAccountType === 2) { // 供应商
                            next('/position/all');
                        } else if (userInfo.companyAccountType === 3) { // 客户 (只显示项目菜单)
                            next('/promoterProject');
                        } else {
                            next('/home');
                        }
                    } else {
                        next();
                    }
                }
            }
        }
    } else {
        if (routerWhiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
        }
    }
}); /* eslint-disable */