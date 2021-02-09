import http from '@/utils/http'

// 按状态阶段分组查询订单数量
export function countRangeCandidateByStage(params) {
    return http.requestPost(`/rest/candidate/countRangeCandidateByStage`, params)
}

// 按状态阶段分组查询企业订单数量
export function countCompanyRangeCandidateByStage(params) {
    return http.requestPost(`/rest/candidate/countCompanyRangeCandidateByStage`, params)
}

// 访客
export function getSharePositionBrowseCountVOList(params) {
    return http.requestGet(`/hhshop/browse/getSharePositionBrowseCountVOList`, params)
}

// 我的职位
export function getPositionListByUserId(params) {
    return http.requestPost(`/position/getPositionListByUserId`, params)
}

// 获取当前猎头分享统计相关数据
export function getHhShareBrowseDateStatistical(params) {
    return http.requestGet(`/hhshop/browse/getHhShareBrowseDateStatistical`, params)
}

// 获取当前猎头所在公司分享统计相关数据
export function getCompanyShareBrowseDateStatistical(params) {
    return http.requestGet(`/hhshop/browse/getCompanyShareBrowseDateStatistical`, params)
}

// 管理员相关数据
export function getUserAdminInfoDTO(params) {
    return http.requestGet(`/ucenter/profile/getUserAdminInfoDTO`, params)
}

// 排行榜
export function getRankList(params) {
    return http.requestPost(`/hhshop/browse/getRankList`, params)
}

// 工作台改变，调用以下接口

// 职位列表查询
export function selectPosition(params) {
    return http.requestPost(`/position/selectPosition`, params)
}

// 获取名下各阶段订单数量
export function countPositionCandidateStage(params) {
    return http.requestGet(`/candidate/statistical/countPositionCandidateStage`, params)
}

// 获取HR门户首页订单日分布
export function getHrPortalCandidateDayDistribution(params) {
    return http.requestGet(`/candidate/statistical/getHrPortalCandidateDayDistribution`, params)
}

// 获取用户工作台基本信息
export function getWorkbenchInfo(params) {
    return http.requestGet(`/candidate/statistical/getWorkbenchInfo`, params)
}

// 获取订单日程列表
export function getCandidateScheduleList(params) {
    return http.requestPost(`/candidate/statistical/getCandidateScheduleList`, params)
}