import Vue from 'vue'
import store from '@/store';
import router from '@/router'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui';
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'

let messageBoxAlertLock = false; // 登录超时弹窗锁

// 添加请求拦截器
axios.interceptors.request.use((config) => {
    // 在发送请求之前做
    const token = Vue.ls.get('x-client-token')
        //const token = 'f2729b02bffd444fa319d51ff581d049'
    if (token) {
        config.headers['x-client-token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config['url'].indexOf('hhshop/browse/exportClues') !== -1) { // 下载流文件
        config.responseType = 'blob'
    }
    if (config['url'].indexOf('company-resume-field/getImportResumeExcelTemplate') !== -1) { // 下载流文件
        config.responseType = 'blob'
    }
    if (config['url'].indexOf('rest/candidate/getBatchResumeExcel') !== -1) { // 下载流文件
        config.responseType = 'blob'
    }
    if (config['url'].indexOf('promoter/project/exportPromoterProjectReport') !== -1) { // 下载流文件
        config.responseType = 'blob'
    }
    // if (Object.prototype.toString.call(config.params) === '[object Object]') {
    //     config.params.userId = store.state.userInfo.userId;
    // }
    // if (Object.prototype.toString.call(config.data) === '[object Object]') {
    //     config.data.userId = store.state.userInfo.userId;
    // }
    return config
}, (err) => {
    // 对请求错误做些什么
    return Promise.reject(err)
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
    if (response && response.request['responseType'].indexOf('blob') !== -1) { // 下载流文件
        return Promise.resolve(response);
    } else if (response && response.config.url.indexOf('.js') !== -1) { // 访问js文件
        return Promise.resolve(response);
    } else if (response && response.config.url.indexOf('/common/geetest/register') !== -1) { // 极验
        return Promise.resolve(response);
    } else if (response && response.config.url.indexOf('checkPingAnRepeat') !== -1) { // 访问平安查重接口
        return Promise.resolve(response);
    } else {
        // 登录模块按钮loading统一管理，为了解决后台响应错误码无法进入成功回调的问题
        store.dispatch('dispatchUpdateNextLoading', false);
        if (response.data.code === '000000') {
            if (response.data.data && response.data.data.accessToken) {
                Vue.ls.set('x-client-token', response.data.data.accessToken)
            }
            // 统一解决后台无法返回标准格式情况下，前端正确读取到data这一级别数据的问题
            if (!response.data.data) {
                response.data.data = {};
            }
            return Promise.resolve(response);
        } else {
            if (response.data.code === '000004') {
                // 登录超时
                if (!messageBoxAlertLock) {
                    messageBoxAlertLock = true;
                    MessageBox.alert('登录超时，请重新登录', '提示', {
                        showClose: false
                    }).then(() => {
                        messageBoxAlertLock = false;
                        // 判断缓存中是否有登录信息，如果有的话重新缓存一下
                        const loginInfo = localStorage.getItem('loginInfo');
                        localStorage.clear()
                        if (loginInfo && loginInfo !== 'null') {
                            localStorage.setItem('loginInfo', loginInfo)
                        }
                        sessionStorage.clear()
                        store.dispatch('dispatchUpdateUserInfo', {});
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    });
                }
            } else if (['100017', '200007'].indexOf(response.data.code) !== -1) { // 企业雇主已关闭&职位关闭
                router.push(`/notFound?errorMessage=${response.data.message}`);
            } else if (response.data.code === '100612') {
                return Promise.resolve(response);
            } else {
                Message({
                    message: response.data.message || '哎呀， 网络异常~',
                    type: 'error',
                    showClose: true,
                    center: true
                });

                return Promise.resolve(response);
            }
            return Promise.reject(response);
        }
    }

}, (err) => {
    // 对响应错误做点什么
    switch (err.response.status) {
        case 404:
            Message({
                message: '请求资源不存在：#' + err.response.status,
                type: 'error',
                showClose: true,
                center: true
            });
            break;
        case 400:
            Message({
                message: '请求参数有误：#' + err.response.status,
                type: 'error',
                showClose: true,
                center: true
            });
            break;
        case 500:
            Message({
                message: '服务器异常：#' + err.response.status,
                type: 'error',
                showClose: true,
                center: true
            });
            break;
        case 504:
            Message({
                message: '请求超时：#' + err.response.status,
                type: 'error',
                showClose: true,
                center: true
            });
            break;
        default:
            Message({
                message: '未知故障：#' + err.response.status,
                type: 'error',
                showClose: true,
                center: true
            });
            break;
    }
    return Promise.reject(err.response);
})

export default {
    // 封装axios
    http: axios,
    // 封装get      
    requestGet(url, params = {}) {
        return axios.get(url, { params }).then(res => res.data).catch()
    },
    // 封装post
    requestPost(url, params = {}) {
        return axios.post(url, params).then(res => res.data).catch()
    },
    // 封装put
    requestPut(url, params = {}) {
        return axios.put(url, params).then(res => res.data).catch()
    },
    // 封装delete
    requestDelete(url, params = {}) {
        return axios.delete(url, { params }).then(res => res.data).catch()
    },
    // 下载流文件post
    requestPostBlob(url, params = {}) {
        return axios.post(url, params).then(res => res).catch()
    },
    // 下载流文件get
    requestGetBlob(url, params = {}) {
        return axios.get(url, { params }).then(res => res).catch()
    }
}