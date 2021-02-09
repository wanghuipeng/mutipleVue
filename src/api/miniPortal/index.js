import http from '@/utils/http'

// 修改企业故事开关
export function updateWzCompanyStorySwitch(params) {
  return http.requestGet(`/company/updateWzCompanyStorySwitch`, params)
}

// 获取企业故事开关状态
export function getCompanyDetailByUserId(params) {
  return http.requestGet(`/company/getCompanyDetailByUserId`, params)
}

// 获取企业故事列表
export function getCompanyStoryList(params) {
  return http.requestGet(`/wz/company-story/getCompanyStoryList`, params)
}

// 删除故事
export function deleteStory(params) {
  return http.requestGet(`/wz/company-story/deleteStory`, params)
}

// 企业故事列表排序
export function updateCompanyStorySort(params) {
  return http.requestGet(`/wz/company-story/updateCompanyStorySort`, params)
}

// 新增或修改保存故事信息
export function saveCompanyStoryDTO(params) {
  return http.requestPost(`/wz/company-story/saveCompanyStoryDTO`, params)
}

// 招聘专区列表
export function getWzSpecialAreaList(params) {
  return http.requestGet(`/portal/wz-special-area/getWzSpecialAreaList`, params)
}

// 招聘专区新增
export function addWzSpecialArea(params) {
  return http.requestPost(`/portal/wz-special-area/addWzSpecialArea`, params)
}

// 招聘专区删除
export function deleteById(params) {
  return http.requestDelete(`/portal/wz-special-area/deleteById`, params)
}

// 招聘专区编辑
export function editWzSpecialArea(params) {
  return http.requestPost(`/portal/wz-special-area/editWzSpecialArea`, params)
}

// 招聘专区详情
export function getWzSpecialAreaById(params) {
  return http.requestGet(`/portal/wz-special-area/getWzSpecialAreaById`, params)
}

// 下拉选择部门
export function getSelectDeptList(params) {
  return http.requestPost(`company/department/getSelectDeptList`, params)
}
