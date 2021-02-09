import http from '@/utils/http'

// 角色分布数量
export function getCompanyUserRoleRistribution(params) {
    return http.requestGet(`/member/getCompanyUserRoleRistribution`, params)
}

// 成员列表
export function findMemberDetailVOList(params) {
    return http.requestPost(`/member/findMemberDetailVOList`, params)
}

// 成员详情
export function findMemberDetail(params) {
    return http.requestGet(`/member/findMemberDetail`, params)
}

// 删除成员
export function deletetMember(params) {
    return http.requestPost(`/member/deletetMember`, params)
}

// 添加成员
export function insertMember(params) {
    return http.requestPost(`/member/insertMember`, params)
}

// 编辑成员
export function updateMember(params) {
    return http.requestPost(`/member/updateMember`, params)
}

// 部门列表
export function searchPage(params) {
    return http.requestPost(`/company/department/searchPage`, params)
}

// 新增或修改保存部门信息
export function saveCompanyDepartmentDTO(params) {
    return http.requestPost(`/company/department/saveCompanyDepartmentDTO`, params)
}

// 删除部门
export function deleteDepart(params) {
    return http.requestGet(`/company/department/deleteDepart`, params)
}

// 获取企业的用户协议
export function getCompanyUserProtocol(params) {
    return http.requestGet(`/wz/protocol/getCompanyUserProtocol`, params)
}

// 保存用户协议
export function saveCompanyUserProtocol(params) {
    return http.requestPost(`/wz/protocol/saveCompanyUserProtocol`, params)
}