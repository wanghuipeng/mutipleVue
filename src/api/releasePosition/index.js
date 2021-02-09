import http from '@/utils/http'

// 用户成员列表(字母分组)
export function findMemberVOList(params) {
    return http.requestPost(`/member/findMemberVOList`, params)
}

// 发布职位
export function addPosition(params) {
    return http.requestPost(`/position/addPosition`, params)
}

// 编辑职位
export function editPosition(params) {
    return http.requestPut(`/position/editPosition`, params)
}

// 查询招聘会集合
export function selectJobFairList(params) {
    return http.requestGet(`/jobfair/job-fair-base/selectJobFairList`, params)
}

// 查看企业信息是否完善
export function checkCompanyInfo(params) {
    return http.requestGet(`/company/checkCompanyInfo`, params)
}

// 获取租户的套餐中企业数量
export function getCompanyAccountLinkCount(params) {
    return http.requestGet(`/company/getCompanyAccountLinkCount`, params)
}

// 获取下属雇主列表
export function getCompanySubordinatesList(params) {
    return http.requestPost(`/company/getCompanySubordinatesList`, params)
}