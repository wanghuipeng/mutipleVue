import http from '@/utils/http'

// 获取招聘门户
export function getWzPortal(params) {
    return http.requestGet(`/portal/wz-portal/getWzPortal`, params)
}

// 获取招聘门户
export function editWzPortal(params) {
    return http.requestPost(`/portal/wz-portal/editWzPortal`, params)
}

// 招聘专区列表
export function getWzSpecialAreaList(params) {
    return http.requestGet(`/portal/wz-special-area/getWzSpecialAreaList`, params)
}