import http from '@/utils/http'

// 按状态阶段分组查询订单数量
export function countCandidateByStage(params) {
    return http.requestGet(`/rest/candidate/countCandidateByStage`, params)
}

// 获取订单列表
export function orderList(params) {
    return http.requestPost(`/rest/candidate/selectPage`, params)
}

// 订单详情
export function detail(params) {
    return http.requestGet(`/rest/candidate/getCandidateInfoById`, params)
}

// 订单操作
export function operation(params) {
    return http.requestPost(`/rest/candidateOperateLog/insert`, params)
}

// 订单动态
export function dynamicList(params) {
    return http.requestPost(`/rest/candidateOperateLog/selectList`, params)
}

// 草稿箱列表
export function draftList(params) {
    return http.requestPost(`/rest/candidateRecommendReportDraft/selectPage`, params)
}

// 删除推荐报告草稿
export function deleteDraft(params) {
    return http.requestDelete(`/rest/candidateRecommendReportDraft/deleteById`, params)
}

// 获取可推荐的简历列表
export function getResumePoolListByPositionId(params) {
    return http.requestPost(`/candidate/resumeBase/getResumePoolListByPositionId`, params)
}

// 人才库导入批量生成订单
export function batchGenerateCandidate(params) {
    return http.requestPost(`/rest/candidate/batchGenerateCandidate`, params)
}

// 获取简历导入模板
export function getImportResumeExcelTemplate(params) {
    return http.requestGetBlob(`/company-resume-field/getImportResumeExcelTemplate`, params)
}

// 获取批量推荐失败Excel
export function getBatchResumeExcel(params) {
    return http.requestGetBlob(`/rest/candidate/getBatchResumeExcel`, params)
}

// 批量订单操作
export function batchOperateCandidate(params) {
    return http.requestPost(`/rest/candidate/batchOperateCandidate`, params)
}

// 批量安排面试
export function batchArrangeInterview(params) {
    return http.requestPost(`/candidate/interview/batchArrangeInterview`, params)
}

// 批量面试反馈
export function batchInterviewFeedback(params) {
    return http.requestPost(`/candidate/interview/batchInterviewFeedback`, params)
}

// 批量订单操作Offer
export function batchOperateOffer(params) {
    return http.requestPost(`/candidate/offer/batchOperateOffer`, params)
}

// 批量办理入职
export function batchOperateEntry(params) {
    return http.requestPost(`/candidate/offer/batchOperateEntry`, params)
}

// 根据订单IDS获取最后一条面试信息
export function getLastInterviewByBatch(params) {
    return http.requestGet(`/candidate/interview/getLastInterviewByBatch`, params)
}

// 根据订单IDS获取最后一条Offer信息
export function getLastOfferByBatch(params) {
    return http.requestGet(`/candidate/offer/getLastOfferByBatch`, params)
}

// 获取供应商职位简历配置
export function getSupplierPositionResumeConfig(params) {
    return http.requestGet(`/position/resume-supplier/getSupplierPositionResumeConfig`, params)
}

// 生成链接二维码
export function generateUrlQrCode(params) {
    return http.requestGet(`/common/generateUrlQrCode`, params)
}

// 保存供应商职位简历信息
export function savePositionResumeSupplier(params) {
    return http.requestPost(`/position/resume-supplier/savePositionResumeSupplier`, params)
}

// 获取个人下拉部门列表
export function getUserSelectDeptList(params) {
    return http.requestPost(`/company/department/getUserSelectDeptList`, params)
}