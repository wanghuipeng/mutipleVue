import http from '@/utils/http'

// 统计数据
export function getDayHhShareBrowseDateStatistical(params) {
    return http.requestPost(`/hhshop/browse/getDayHhShareBrowseDateStatistical`, params)
}

// 按人获取统计数据
export function getPersonHhShareBrowseDateStatistical(params) {
    return http.requestPost(`/hhshop/browse/getPersonHhShareBrowseDateStatistical`, params)
}

// 业绩趋势分布统计
export function getStageProcessDayDistribution(params) {
    return http.requestPost(`/candidate/statistical/getStageProcessDayDistribution`, params)
}

// 推荐转化分析统计
export function getStageRecommendDayDistribution(params) {
    return http.requestPost(`/candidate/statistical/getStageRecommendDayDistribution`, params)
}

// 成员KPI统计
export function getUserProcessDayDistribution(params) {
    return http.requestPost(`/candidate/statistical/getUserProcessDayDistribution`, params)
}