import http from '@/utils/http'

// 获取人才库列表
export function getTalentPoolList(params) {
  return http.requestPost(`/talent/talent-pool/getTalentPoolList`, params)
}

// 添加人才库
export function addTalentPool(params) {
  return http.requestPost(`/talent/talent-pool/addTalentPool`, params)
}

// 编辑人才库
export function editTalentPool(params) {
  return http.requestPost(`/talent/talent-pool/editTalentPool`, params)
}

// 删除人才库
export function deleteById(params) {
  return http.requestDelete(`/talent/talent-pool/deleteById`, params)
}

// 获取标签组列表
export function getUserLabelPoolOfCompany(params) {
  return http.requestGet(`/ucenter/user-label-pool/getUserLabelPoolOfCompany`, params)
}

// 新增企业标签组
export function addTalentLabelPoolOfCompany(params) {
  return http.requestPost(`/ucenter/user-label-pool/addTalentLabelPoolOfCompany`, params)
}

// 编辑企业标签组
export function editTalentLabelPoolOfCompany(params) {
  return http.requestPost(`/ucenter/user-label-pool/editTalentLabelPoolOfCompany`, params)
}

// 删除企业标签组
export function deleteTalentLabelPoolOfCompany(params) {
  return http.requestDelete(`/ucenter/user-label-pool/deleteTalentLabelPoolOfCompany`, params)
}

// 新增企业标签
export function addTalentLabelPool(params) {
  return http.requestPost(`/ucenter/user-label-pool/addTalentLabelPool`, params)
}

// 编辑企业标签
export function editTalentLabelPool(params) {
  return http.requestPost(`/ucenter/user-label-pool/editTalentLabelPool`, params)
}

// 删除企业标签
export function deleteTalentLabelPool(params) {
  return http.requestDelete(`/ucenter/user-label-pool/deleteTalentLabelPool`, params)
}
