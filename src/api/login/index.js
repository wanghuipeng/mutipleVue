import http from '@/utils/http'

// 微信授权登录
export function loginByWechatCode(params) {
    return http.requestPost(`/ucenter/auth/loginByWechatCode`, params)
}

// 登录
export function accountLogin(params) {
    return http.requestPost(`/ucenter/auth/accountLogin`, params)
}

// 注册页面获取验证码
export function getRegisterCaptchaCode(params) {
    return http.requestGet(`/ucenter/auth/sms/sendRegisterSms`, params)
}

// 注册
export function registerByMobile(params) {
    return http.requestPost(`/ucenter/auth/registerByMobile`, params)
}

// 忘记密码页面获取验证码
export function getForgetCaptchaCode(params) {
    return http.requestGet(`/message/sms/sendSmsVerificationMessage`, params)
}

// 验证忘记密码的验证码，并生成修改密码凭证
export function checkForgotPasswordSmsCaptcha(params) {
    return http.requestGet(`/ucenter/auth/checkForgotPasswordSmsCaptcha`, params)
}

// 根据忘记密码Token凭证重置新密码
export function updatePasswordByForgotToken(params) {
    return http.requestGet(`/ucenter/auth/updatePasswordByForgotToken`, params)
}

// 完善信息
export function completeRegisterHhUserProfile(params) {
    return http.requestPost(`/ucenter/profile/completeRegisterHhUserProfile`, params)
}

// 保存猎头擅长技能
export function saveHhAbilityByHh(params) {
    return http.requestPost(`/ucenter/profile/saveHhAbilityByHh`, params)
}

// 获取推荐的企业列表
export function getHhRecommendCompanyList(params) {
    return http.requestGet(`/company/getHhRecommendCompanyList`, params)
}

// 关注推荐的企业
export function registerFollowCompany(params) {
    return http.requestPost(`/ucenter/follow/registerFollowCompany`, params)
}

// 极验
export function geetest(params) {
    return http.requestGet(`/common/geetest/register`, params)
}

// 获取公共验证码
export function getCommonCaptchaCode(params) {
    return http.requestGet(`/ucenter/auth/sms/sendCompanyRegisterSms`, params)
}

// 短信验证码登录
export function loginBySms(params) {
    return http.requestPost(`/ucenter/auth/loginByMobileSms`, params)
}

// 注册企业租户
export function registerCompanyAccount(params) {
    return http.requestPost(`/company/registerCompanyAccount`, params)
}

// 企业申请认证
export function companyApplyCertification(params) {
    return http.requestPost(`/company/certification/companyApplyCertification`, params)
}

// 获取企业认证信息
export function getCompanyCertificationByUserId(params) {
    return http.requestPost(`/company/certification/getCompanyCertificationByUserId`, params)
}

// 发送登录验证码短信
export function sendMobileLoginSms(params) {
    return http.requestGet(`/ucenter/auth/sms/sendMobileLoginSms`, params)
}

