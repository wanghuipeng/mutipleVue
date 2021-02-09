import http from '@/utils/http'

// 企业列表
export function getCompanyList(params) {
    return http.requestPost(`/company/getCompanyList`, params)
}

// 删除企业
export function editCompanyOfOperation(params) {
    return http.requestPut(`/company/editCompanyOfOperation`, params)
}

// 企业详情
export function getCompanyDetail(params) {
    return http.requestGet(`/company/getCompanyDetail`, params)
}

// 编辑企业
export function editCompany(params) {
    return http.requestPut(`/company/editCompany`, params)
}

// 新增企业
export function addCompany(params) {
    return http.requestPost(`/company/addCompany`, params)
}

// 搜索客户公司分页列表
export function searchCompanyPage(params) {
    return http.requestPost(`/company/searchCompanyPage`, params)
}

// -------------------客户用户
// 新增&编辑保存
export function saveCustomerUser(params) {
    return http.requestPost(`/company/customer_user/saveCustomerUser`, params)
}

// 分页搜索
export function customerSearchPage(params) {
    return http.requestPost(`/company/customer_user/searchPage`, params)
}

// 根据客户用户ID删除用户
export function deleteByCustomerUserId(params) {
    return http.requestGet(`/company/customer_user/deleteByCustomerUserId`, params)
}