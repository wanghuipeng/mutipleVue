import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'; // vuex持久化
import * as Cookies from 'js-cookie'
import conversation from './modules/tim/conversation'
import group from './modules/tim/group'
import user from './modules/tim/user'
import friend from './modules/tim/friend'
import blacklist from './modules/tim/blacklist'
import orderList from './modules/tim/orderList'
import positionList from './modules/tim/positionList'
import video from './modules/tim/video'
import common from './modules/dalie/common'
import customer from './modules/dalie/customer'
import promoter from './modules/dalie/promoter'
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        maxPageSize: 999, // 查询分页接口默认传递一个最大值查询所有数据时的默认值
        isLogin: false, // 是否登录
        userInfo: {}, // 用户信息
        nextLoading: false, // 登录模块按钮loading统一管理，为了解决后台响应错误码无法进入成功回调的问题
        subscriptionParams: {}, // 选择的订阅条件
        current: Date.now(), // 当前时间
        intervalID: 0,
        message: undefined,
        unreadCount: 0 // 未读消息
    },
    mutations: {
        updateUserInfo(state, userInfo = {}) {
            // 更新用户信息
            if (Object.keys(userInfo).length) {
                state.isLogin = true;
            } else {
                state.isLogin = false;
            }
            state.userInfo = userInfo;
        },
        updateNextLoading(state, nextLoading) {
            state.nextLoading = nextLoading;
        },
        updateSubscriptionParams(state, subscriptionParams = {}) {
            state.subscriptionParams = subscriptionParams;
        },
        startComputeCurrent(state) {
            state.intervalID = setInterval(() => {
                state.current = Date.now()
            }, 1000)
        },
        stopComputeCurrent(state) {
            clearInterval(state.intervalID)
            state.intervalID = 0
        },
        showMessage(state, options) {
            if (state.message) {
                state.message.close()
            }
            state.message = Message({
                message: options.message,
                type: options.type || 'success',
                duration: options.duration || 2000,
                offset: 40
            })
        },
        setUnreadCount(state, count) {
            state.unreadCount = count
        }
    },
    actions: {
        dispatchUpdateUserInfo(context, userInfo) {
            // 触发更新用户信息方法
            context.commit('updateUserInfo', userInfo);
        },
        dispatchUpdateNextLoading(context, nextLoading) {
            // 触发更新loading方法
            context.commit('updateNextLoading', nextLoading);
        },
        dispatchUpdateSubscriptionParams(context, subscriptionParams) {
            // 触发更新选择的订阅条件
            context.commit('updateSubscriptionParams', subscriptionParams);
        }

    },
    plugins: [
        createPersistedState({
            storage: {
                // 指定持久化方式为cookie
                getItem: key => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000) }),
                removeItem: key => Cookies.remove(key)
            },
            reducer(val) {
                // 指定需要持久化的数据
                return {
                    isLogin: val.isLogin,
                    userInfo: val.userInfo
                };
            }
        })
    ],
    modules: Object.assign({
        conversation,
        group,
        friend,
        blacklist,
        user,
        orderList,
        positionList,
        video
    }, { common, customer, promoter })
})