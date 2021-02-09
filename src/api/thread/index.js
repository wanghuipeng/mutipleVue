import http from '@/utils/http'

// 获取线索信息--直接访问
export function getCluesByUserId(params) {
    return http.requestPost(`/hhshop/browse/getCluesByUserId`, params)
}

// 获取分享应用用户浏览信息
export function getShareUserBrowse(params) {
    return http.requestGet(`/hhshop/browse/getShareUserBrowse`, params)
}

// 输入联想猎头
export function selectPosition(params) {
    return http.requestPost(`/position/selectPosition`, params)
}

// 输入联想职位
export function selectHhUser(params) {
    return http.requestPost(`/ucenter/profile/selectHhUser`, params)
}

// 分页查询访问数据
export function getSharePositionBrowseVOPage(params) {
    return http.requestPost(`/hhshop/browse/getSharePositionBrowseVOPage`, params)
}

// 获取分享投递分页列表
export function findShareApplyPage(params) {
    return http.requestPost(`/share/apply/findShareApplyPage`, params)
}

// 获取分享投递分页列表
export function getExportTemplate(params) {
    return http.requestGet(`/code/exportTemplate/getExportTemplate`, params)
}

// 直接访问--访客基本信息导出
export function exportClues(params) {
    return http.requestPostBlob(`/hhshop/browse/exportClues`, params)
}

// 获取线索信息--转介绍
export function getCluesByUserId1(params) {
    return http.requestPost(`/share/apply/getCluesByUserId`, params)
}

// 获取线人线索列表
export function getInformantClueList(params) {
    return http.requestPost(`/hhshop/browse/getInformantClueList`, params)
}

// 获取线索信息列表
export function getCluesDTOPage(params) {
    return http.requestPost(`/share/apply/getCluesDTOPage`, params)
}

// 线索动态新增
export function insertShareApplyLogBO(params) {
    return http.requestPost(`/share/apply/insertShareApplyLogBO`, params)
}

// 线索动态集合
export function selectShareApplyLogList(params) {
    return http.requestPost(`/share/apply/selectShareApplyLogList`, params)
}

// 同步候选人简历给被推荐猎头
export function synShareResume(params) {
    return http.requestPost(`/share/apply/synShareResume`, params)
}

// 分享链路
export function getShareUserLinkList(params) {
    return http.requestGet(`/share/apply/getShareUserLinkList`, params)
}

// 访客列表页--获取访客标签
export function getUserAppLabelList(params) {
    return http.requestGet(`/ucenter/user-label-pool/getUserAppLabelList`, params)
}

// 访客设置标签--个人标签基础新增(添加个人标签)
export function addUserLabelPoolOfUser(params) {
    return http.requestPost(`/ucenter/user-label-pool/addUserLabelPoolOfUser`, params)
}

// 访客设置标签--个人标签基础删除(删除个人标签)
export function deleteUserLabelPoolOfUser(params) {
    return http.requestDelete(`/ucenter/user-label-pool/deleteUserLabelPoolOfUser`, params)
}

// 访客设置标签--标签编辑
export function editUserLabelPoolOfAll(params) {
    return http.requestPost(`/ucenter/user-label-pool/editUserLabelPoolOfAll`, params)
}

// 访客设置标签--个人标签基础编辑(编辑个人标签)
export function editUserLabelPoolOfUser(params) {
    return http.requestPut(`/ucenter/user-label-pool/editUserLabelPoolOfUser`, params)
}