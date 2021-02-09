import http from '@/utils/http'

// 获取职位列表
export function positionList(params) {
  return http.requestPost(`/position/getPositionList`, params)
}

// 获取订单列表
export function orderList(params) {
  return http.requestPost(`/rest/candidate/selectPage`, params)
}

// 获取推荐报告名称
export function reportName(params) {
  return http.requestGet(`/rest/candidateRecommendReport/getById`, params)
}

// 投诉
export function saveUserComplain(params) {
  return http.requestPost(`/message/saveUserComplain`, params)
}
