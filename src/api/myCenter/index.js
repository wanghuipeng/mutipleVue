import http from '@/utils/http'
import Vue from 'vue'

// 获取用户个人资料信息
export function getUserProfile(params) {
    return http.requestGet(`/ucenter/profile/getUserProfile`, params)
}

// 获取用户信息
export function getCurrentUserInfo(params) {
    return http.requestGet(`/ucenter/auth/getCurrentUserInfo`, params)
}

// 修改当前用户基本资料
export function updateHhProfile(params) {
    return http.requestPost(`/ucenter/profile/updateHhProfile`, params)
}

// 获取我关注的企业雇主列表
export function getUserFollowCompany(params) {
    return http.requestGet(`/ucenter/follow/getUserFollowCompany`, params)
}


// 获取我关注的分析师列表
export function getUserFollowCW(params) {
    return http.requestGet(`/ucenter/follow/getUserFollowCW`, params)
}

// 修改用户密码
export function updatePasswordByOldPassword(params) {
    return http.requestGet(`/ucenter/profile/updatePasswordByOldPassword`, params)
}

// 取消企业关注
export function deleteUserFollowCompany(params) {
    return http.requestGet(`/ucenter/follow/deleteUserFollowCompany`, params)
}

// 取消cw关注
export function deleteUserFollowCW(params) {
    return http.requestGet(`/ucenter/follow/deleteUserFollowCW`, params)
}

// 保存猎头擅长技能
export function saveHhAbilityByHh(params) {
    return http.requestPost(`/ucenter/profile/saveHhAbilityByHh`, params)
}

// 获取猎头擅长技能
export function getHhAbility(params) {
    return http.requestGet(`/ucenter/profile/getHhAbility`, params)
}

// 提交用户实名验证信息
export function submitHhCertification(params) {
    return http.requestPost(`/ucenter/profile/submitHhCertification`, params)
}

// 登出
export function logout(params) {
    return http.requestGet(`/ucenter/auth/logout?accessToken=${Vue.ls.get('x-client-token')}`, params)
}

// 获取邀请注册记录信息
export function queryInviteRecordPage(params) {
    return http.requestGet(`/ucenter/profile/queryInviteRecordPage`, params)
}