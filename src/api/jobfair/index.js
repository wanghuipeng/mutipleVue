import http from '@/utils/http'

// 获取招聘会简介信息
export function getJobFairIntroductionVO(params) {
    return http.requestGet(`/jobfair/job-fair-base/getJobFairIntroductionVO`, params)
}

// 企业加入招聘会
export function addJobFairCompany(params) {
    return http.requestGet(`/jobFair/company/addJobFairCompany`, params)
}