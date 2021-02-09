import http from '@/utils/http'

// 生成小程序扫码登录Token
export function generateQrCodeAuthToken(params) {
    return http.requestGet(`/ucenter/auth/generateQrCodeAuthToken`, params)
}

// 根据扫码登录授权Token获取授权结果
export function getQrCodeAuthResult(params) {
    return http.requestPost(`/ucenter/auth/getQrCodeAuthResult?qrCodeAuthToken=${params}`)
}