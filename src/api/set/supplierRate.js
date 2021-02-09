import http from '@/utils/http'

// 新增或编辑保存
export function saveCommission(params) {
    return http.requestPost(`/company/commission/saveCommission`, params)
}

// 获取佣金规则分页
export function getCommissionPage(params) {
    return http.requestPost(`/company/commission/getCommissionPage`, params)
}