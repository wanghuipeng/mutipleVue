import http from '@/utils/http'

// 获取企业RPO字段 List
export function getCompanyRpoFieldList(params) {
    return http.requestGet(`/company-resume-field/getCompanyRpoFieldList`, params)
}

// 修改企业RPO字段必填设置
export function updateRpoFieldRequired(params) {
    return http.requestPost(`/company-resume-field/updateRpoFieldRequired`, params)
}