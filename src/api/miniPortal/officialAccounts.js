import http from '@/utils/http'

// 获取公司的嵌入式链接集合
export function getEmbeddedLinkList(params) {
    return http.requestGet(`/wz/company/getEmbeddedLinkList`, params)
}