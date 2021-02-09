import http from '@/utils/http'

// 查询全部职位列表
export function getPositionList(params) {
    return http.requestPost(`/position/getPositionList`, params)
}

// 查询智能推荐职位列表
export function getPositionAssignRecordList(params) {
    return http.requestGet(`/position-assign-record/getPositionAssignRecordList`, params)
}

// 修改派单状态-拒绝
export function refusePositionAssignRecord(params) {
    return http.requestGet(`/position-assign-record/refusePositionAssignRecord`, params)
}

// 查询关注职位列表-企业
export function getPositionFollowCompanyList(params) {
    return http.requestPost(`/position/position-follow/getPositionOfFollowCompany`, params)
}

// 关注-企业
export function followComapny(params) {
    return http.requestGet(`/ucenter/follow/followComapny`, params)
}

// 取消关注-企业
export function deleteUserFollowCompany(params) {
    return http.requestGet(`/ucenter/follow/deleteUserFollowCompany`, params)
}

// 查询关注职位列表-分析师
export function getPositionFollowCwList(params) {
    return http.requestPost(`/position/position-follow/getPositionOfFollowCW`, params)
}

// 关注-分析师
export function followCw(params) {
    return http.requestGet(`/ucenter/follow/followCw`, params)
}

// 取消关注-分析师
export function deleteUserFollowCW(params) {
    return http.requestGet(`/ucenter/follow/deleteUserFollowCW`, params)
}

// 查询职位浏览记录
export function getPositionBrowseRecord(params) {
    return http.requestPost(`/position-browse-record/getPositionBrowseRecordApp`, params)
}

// 查询今日已浏览职位数量
export function getPositionTodayBrowseNum(params) {
    return http.requestGet(`/position-browse-record/getPositionBrowseCount`, params)
}

// 获取职位动态
export function getPositionOpeationLogList(params) {
    return http.requestPost(`/position/getPositionOpeationLogList`, params)
}

// 获取我的接单
export function getPositionOrderRecordByUserId(params) {
    return http.requestPost(`/position-order-record/getPositionOrderRecordByUserId`, params)
}

// 取消接单
export function cancelOrderById(params) {
    return http.requestDelete(`/position-order-record/cancelOrderById`, params)
}

// 获取我的职位订阅记录
export function getPositionSubscribeRecordList(params) {
    return http.requestGet(`/position-subscribe-record/getPositionSubscribeRecordList`, params)
}

// 删除职位订阅记录
export function deleteById(params) {
    return http.requestDelete(`/position-subscribe-record/deleteById`, params)
}

// 添加职位订阅记录
export function addPositionSubscribeRecord(params) {
    return http.requestPost(`/position-subscribe-record/addPositionSubscribeRecord`, params)
}

// 编辑职位订阅记录
export function editPositionSubscribeRecord(params) {
    return http.requestPut(`/position-subscribe-record/editPositionSubscribeRecord`, params)
}

// 输入联想查询企业
export function getCompanyList(params) {
    return http.requestPost(`/company/selectCompany`, params)
}

// 获取企业雇主详细信息
export function getCompanyDetail(params) {
    return http.requestGet(`/company/getCompanyDetailById`, params)
}

// 企业详细-获取企业职位地点
export function getCompanyPositionAddress(params) {
    return http.requestGet(`/position/getPositionAreaByCompanyId`, params)
}

// 企业详细-获取企业职位职能
export function getCompanyPositionFunctionType(params) {
    return http.requestGet(`/position/getPositionFunctionByCompanyId`, params)
}

// 获取分析师详细信息
export function getUserDetail(params) {
    return http.requestGet(`/position/getCWOfPositionByCWId`, params)
}

// 分析师详细-获取分析师职位地点
export function getTeacherPositionAddress(params) {
    return http.requestGet(`/position/getPositionAreaByCWId`, params)
}

// 分析师详细-获取分析师职位职能
export function getTeacherPositionFunctionType(params) {
    return http.requestGet(`/position/getPositionFunctionByCWId`, params)
}

// 接单
export function addPositionOrderRecord(params) {
    return http.requestPost(`/position-order-record/addPositionOrderRecord`, params)
}

// 获取职位详情
export function getPositionDetailById(params) {
    return http.requestGet(`/position/getPositionDetailById`, params)
}

// 推荐查重
export function recommendCheck(params) {
    return http.requestPost(`/rest/candidateRecommendReport/validation`, params)
}

// 获取企业推荐须知信息
export function getCompanyRecommendDetail(params) {
    return http.requestGet(`/company/getCompanyDetail`, params)
}

// 获取我的简历列表
export function getResumeInfoListByUserId(params) {
    return http.requestPost(`/candidate/resumeBase/getResumeInfoListByUserId`, params)
}

// 推荐报告初始化
export function recommendReportInit(params) {
    return http.requestPost(`/rest/candidateRecommendReport/init`, params)
}

// 获取简历详情
export function getResumeInfoById(params) {
    return http.requestGet(`/candidate/resumeBase/getResumeInfoById`, params)
}

// 企业简历模板
export function getCompanyResumeFieldList(params) {
    return http.requestGet(`/company-resume-field/getCompanyResumeFieldList`, params)
}

// 通过ID获取推荐报告
export function getRecommendReportDetailById(params) {
    return http.requestGet(`/rest/candidateRecommendReport/getById`, params)
}

// 通过ID获取推荐报告详情信息
export function getCandidateRecommendReportInfoVOById(params) {
    return http.requestGet(`/rest/candidateRecommendReport/getCandidateRecommendReportInfoVOById`, params)
}

// 推荐报告编辑
export function updateRecommendReport(params) {
    return http.requestPut(`/rest/candidateRecommendReport/update`, params)
}

// 推荐报告生成订单
export function addRecommendReportOrder(params) {
    return http.requestPost(`/rest/candidate/insertByReportId`, params)
}

// 推荐报告草稿新增
export function addRecommendReportDraft(params) {
    return http.requestPost(`/rest/candidateRecommendReportDraft/insert`, params)
}

// 推荐报告草稿编辑
export function updateRecommendReportDraft(params) {
    return http.requestPut(`/rest/candidateRecommendReportDraft/update`, params)
}

// 通过ID获取推荐报告草稿详情信息
export function getCandidateRecommendReportDraftInfoVOById(params) {
    return http.requestGet(`/rest/candidateRecommendReportDraft/getCandidateRecommendReportDraftInfoVOById`, params)
}

// 我的职位，发布的，全部职位--列表查询
export function getPositionListByUserId(params) {
    return http.requestPost(`/position/getPositionByUserId`, params)
}

// 我发布的职位-上架-下架
export function editPositionStatus(params) {
    return http.requestPut(`/position/editPositionStatus`, params)
}

// 招聘企业列表查询
export function getCompanyByUserIdAndPosition(params) {
    return http.requestPost(`/position/getCompanyByUserIdAndPosition`, params)
}

// 企业版--职位管理--列表查询
export function getCPositionByUserId(params) {
    return http.requestPost(`/position/getCPositionByUserId`, params)
}

// 企业版--职位管理--列表--已结束查询
export function getCPositionByUserIdOfGB(params) {
    return http.requestPost(`/position/getCPositionByUserIdOfGB`, params)
}

// 获取下拉选择的部门列表
export function getSelectDeptList(params) {
    return http.requestPost(`/company/department/getSelectDeptList`, params)
}

// 获取企业佣金规则下拉
export function getCommissionList(params) {
    return http.requestPost(`/company/commission/getCommissionList`, params)
}

// 企业版--职位详情--（招聘渠道）
export function editCPositionOfRecruitmentChannels(params) {
    return http.requestPost(`/position/editCPositionOfRecruitmentChannels`, params)
}

// 供应商--职位管理--列表查询
export function getSPositionByUserId(params) {
    return http.requestPost(`/position/getSPositionByUserId`, params)
}

// 供应商--职位管理--列表--已结束查询
export function getSPositionByUserIdOfGB(params) {
    return http.requestPost(`/position/getSPositionByUserIdOfGB`, params)
}

// 供应商--下拉招聘企业
export function selectSulipperCompany(params) {
    return http.requestPost(`/company/selectSulipperCompany`, params)
}

// 供应商--退出职位
export function signOutPosition(params) {
    return http.requestGet(`/position/signOutPosition`, params)
}

// 供应商--加入项目
export function addProjectPosition(params) {
    return http.requestGet(`/position/addProjectPosition`, params)
}

// 开放猎场职位数量
export function getPositionCount(params) {
    return http.requestPost(`/position/getPositionCount`, params)
}

// 获取用户列表集合
export function listUserTableFields(params) {
    return http.requestGet(`/user/user-table-fields/listUserTableFields`, params)
}

// 添加个人筛选字段
export function updateUserTableFields(params) {
    return http.requestPost(`/user/user-table-fields/updateUserTableFields`, params)
}