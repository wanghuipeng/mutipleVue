import http from '@/utils/http'

// 获取我的简历列表
export function getResumeInfoListByUserId(params) {
    return http.requestPost(`/candidate/resumeBase/getResumeInfoListByUserId`, params)
}

// 获取人才库--文件夹--简历列表
export function getResumeListByFolderIdAndTalentId(params) {
    return http.requestPost(`/candidate/resumeBase/getResumeListByFolderIdAndTalentId`, params)
}

// 获取全部人才
export function getAllResumeList(params) {
    return http.requestPost(`/candidate/resumeBase/getAllResumeList`, params)
}

// 获取回收站人才
export function getBackResumeList(params) {
    return http.requestPost(`/candidate/resumeBase/getBackResumeList`, params)
}

// 移除简历
export function removeResumenById(params) {
    return http.requestDelete(`/candidate/resumeBase/removeResumenById`, params)
}

// 获取简历-通过id
export function getResumeInfoById(params) {
    return http.requestGet(`/candidate/resumeBase/getResumeInfoById`, params)
}

// 编辑简历-基本信息与求职意向
export function editResumeDetail(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeDetail`, params)
}

// 编辑简历-教育经验(学历)
export function editResumeEducation(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeEducation`, params)
}

// 编辑简历-工作经历
export function editResumeExperience(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeExperience`, params)
}

// 编辑简历-项目经历
export function editResumeProject(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeProject`, params)
}
// 编辑简历-培训经历
export function editResumeTraining(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeTraining`, params)
}

// 编辑简历-语言能力
export function editResumeLanguages(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeLanguages`, params)
}

// 编辑简历-证书信息
export function editResumeSkills(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeCerInfo`, params)
}

// 编辑简历-作品信息
export function editResumeOpus(params) {
    return http.requestPost(`/candidate/resumeBase/editResumeOpus`, params)
}

// 添加简历-教育经验(学历)
export function addResumeEducation(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeEducation`, params)
}

// 添加简历-工作经历
export function addResumeExperience(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeExperience`, params)
}

// 添加简历-项目经验
export function addResumeProject(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeProject`, params)
}

// 添加简历-培训经历
export function addResumeTraining(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeTraining`, params)
}

// 添加简历-语言能力
export function addResumeLanguages(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeLanguages`, params)
}

// 添加简历-证书信息
export function addResumeSkills(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeCerInfo`, params)
}

// 添加简历-作品信息
export function addResumeOpus(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeOpus`, params)
}

// 删除简历-教育经验(学历)
export function deleteResumeEducationById(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeEducationById`, params)
}

// 删除简历-工作经历
export function deleteResumeExperience(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeExperience`, params)
}

// 删除简历-项目经历
export function deleteResumeProject(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeProject`, params)
}

// 删除简历-培训经历
export function deleteResumeTraining(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeTraining`, params)
}

// 删除简历-语言能力
export function deleteResumeLanguages(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeLanguages`, params)
}

// 删除简历-证书信息
export function deleteResumeSkills(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeCerInfo`, params)
}

// 删除简历-作品信息
export function deleteResumeOpus(params) {
    return http.requestDelete(`/candidate/resumeBase/deleteResumeOpus`, params)
}

// 获取我的-上传文件列表
export function getResumeFile(params) {
    return http.requestGet(`/resume/resume-oss-file/getResumeFile`, params)
}

// 获取新的线索
export function getNewClues(params) {
    // params = Object.keys(params).map(function(key) {
    //     return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    // }).join("&");
    return http.requestPost(`/candidate/resumeBase/getNewClues`, params)
}

// 获取新的线索--推荐好友分页列表
export function findShareApplyPage(params) {
    return http.requestPost(`/candidate/resumeBase/findShareApplyPage`, params)
}

// 完善简历-通过id
export function updateResumeInfoById(params) {
    return http.requestGet(`/candidate/resumeBase/updateResumeInfoById`, params)
}

// 获取简历数量-通过userid
export function getResumeCountByType(params) {
    return http.requestGet(`/candidate/resumeBase/getResumeCountByType`, params)
}

// 获取简历对应的订单列表
export function getApplyListByResumeId(params) {
    return http.requestGet(`/share/apply/getApplyListByResumeId`, params)
}

// 获取分享订单信息
export function getShareApplyInfo(params) {
    return http.requestGet(`/share/apply/getShareApplyInfo`, params)
}

// 获取联系记录列表
export function pageContactRecord(params) {
    return http.requestPost(`/resume/contact-record/pageContactRecord`, params)
}

// 保存联系记录
export function saveContactRecord(params) {
    return http.requestPost(`/resume/contact-record/saveContactRecord`, params)
}

// 获取人才库--下拉列表
export function getTalentPoolSelect(params) {
    return http.requestPost(`/talent/talent-pool/getTalentPoolSelect`, params)
}

// 人才库--批量添加人才（简历）
export function addTalentFileBatch(params) {
    return http.requestPost(`/talent/talent-pool/addTalentFileBatch`, params)
}

// 人才库--批量移除人才（简历）
export function deleteTalentFileBatch(params) {
    return http.requestPost(`/talent/talent-pool/deleteTalentFileBatch`, params)
}

// 人才盘点--获取用户设置的维度
export function getUserDimensionList(params) {
    return http.requestGet(`/talent/dimension-user/getUserDimensionList`, params)
}

// 人才盘点--保存用户设置的维度
export function saveTalentDimensionUserSaveDTO(params) {
    return http.requestPost(`/talent/dimension-user/saveTalentDimensionUserSaveDTO`, params)
}

// 人才盘点--获取人才盘点维度数据
export function getTalentDimensionReportData(params) {
    return http.requestGet(`/talent/dimension-user/getTalentDimensionReportData`, params)
}

// 回收站添加简历
export function editResumeToTalent(params) {
    return http.requestDelete(`/talent/talent-pool/editResumeToTalent`, params)
}

// 通过简历ID获取已加入的人才库
export function getTalentByBesumeId(params) {
    return http.requestGet(`/talent/talent-pool/getTalentByBesumeId`, params)
}
// 简历--添加标签复制
export function addResumeLabelBatch(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeLabelBatch`, params)
}

// 推荐简历生成订单
export function recommendResume(params) {
    return http.requestPost(`/rest/candidate/recommendResume`, params)
}

// 批量--回收站添加简历
export function editResumeToTalentBantch(params) {
    return http.requestPost(`/talent/talent-pool/editResumeToTalentBantch`, params)
}

// 通过ID获取订单详情
export function getCandidateInfoById(params) {
    return http.requestGet(`/rest/candidate/getCandidateInfoById`, params)
}

// 订单操作日志-分页
export function getOperateLogPage(params) {
    return http.requestPost(`/rest/candidateOperateLog/getOperateLogPage`, params)
}

// 下载附件简历
export function downloadAttachResume(params) {
    return http.requestGet(`/candidate/resumeBase/downloadAttachResume`, params)
}

// 创建简历-基本信息与求职意向
export function addResumeDetail(params) {
    return http.requestPost(`/candidate/resumeBase/addResumeDetail`, params)
}

// 更新联系记录
export function updateContactRecord(params) {
    return http.requestPost(`/resume/contact-record/updateContactRecord`, params)
}

// 简历--获取标签
export function getResumeLabelBatch(params) {
    return http.requestGet(`/candidate/resumeBase/getResumeLabelBatch`, params)
}