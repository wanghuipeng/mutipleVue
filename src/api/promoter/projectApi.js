import http from '@/utils/http'

// 分页搜索接口
export function searchPage(params) {
    return http.requestPost(`/promoter/project/searchPage`, params)
}

// 保存项目表单
export function savePromoterProjectForm(params) {
    return http.requestPost(`/promoter/project/savePromoterProjectForm`, params)
}

// 根据项目ID获取
export function getByProjectId(params) {
    return http.requestGet(`/promoter/project/getByProjectId`, params)
}

// 新增编辑保存问卷信息
export function saveQuestionnaire(params) {
    return http.requestPost(`/promoter/questionnaire/saveQuestionnaire`, params)
}

// 根据项目ID获取问卷
export function getQuestionTemplate(params) {
    return http.requestGet(`/promoter/questionnaire/getByProjectId`, params)
}

// 根据问卷ID获取问题列表
export function dtoListByQuestionnaireId(params) {
    return http.requestGet(`/promoter/question/dtoListByQuestionnaireId`, params)
}

// 保存问题表单
export function saveQuestionForm(params) {
    return http.requestPost(`/promoter/question/saveQuestionForm`, params)
}

// 根据问题ID删除
export function deleteByQuestionId(params) {
    return http.requestGet(`/promoter/question/deleteByQuestionId`, params)
}

// 获取下拉筛选列表
export function querySelectList(params) {
    return http.requestPost(`/promoter/sku/querySelectList`, params)
}

// 促销员分页搜索列表
export function userSearchPage(params) {
    return http.requestPost(`/promoter/user/searchPage`, params)
}

// 新增&编辑保存促销员信息
export function savePromoterUser(params) {
    return http.requestPost(`/promoter/user/savePromoterUser`, params)
}

// SKU分页搜索接口
export function skuSearchPage(params) {
    return http.requestPost(`/promoter/sku/searchPage`, params)
}

// 修改问题排序
export function updateSortOrder(params) {
    return http.requestPost(`/promoter/question/updateSortOrder`, params)
}

// 获取任务分页接口
export function searchTaskPage(params) {
    return http.requestPost(`/promoter/task/searchTaskPage`, params)
}

// 获取导入文件详情
export function getImportFileDetail(params) {
    return http.requestGet(`/promoter/import_file/getImportFileDetail`, params)
}

// 文件数据分页查询接口
export function searchImportDataPage(params) {
    return http.requestPost(`/promoter/import_file/searchImportDataPage`, params)
}

// 执行文件保存入库操作
export function excuteSaveImportFile(params) {
    return http.requestGet(`/promoter/import_file/excuteSaveImportFile`, params)
}

// 任务动态分页搜索接口
export function searchTaskDynamicPage(params) {
    return http.requestPost(`/promoter/task/searchTaskDynamicPage`, params)
}

// 获取任务信息接口
export function getPromoterTaskDetail(params) {
    return http.requestGet(`/promoter/task/getPromoterTaskDetail`, params)
}

// 保存任务信息接口
export function savePromoterTaskForm(params) {
    return http.requestPost(`/promoter/task/savePromoterTaskForm`, params)
}

// 根据SKU ID删除
export function deleteBySkuId(params) {
    return http.requestGet(`/promoter/sku/deleteBySkuId`, params)
}

// 保存SKU表单
export function savePromoterSku(params) {
    return http.requestPost(`/promoter/sku/savePromoterSku`, params)
}

// 根据促销员ID获取DTO信息
export function getByPromoterUserId(params) {
    return http.requestGet(`/promoter/user/getByPromoterUserId`, params)
}

// 促销员下拉列表搜索接口
export function searchSelectList(params) {
    return http.requestPost(`/promoter/user/searchSelectList`, params)
}

// 关闭项目
export function closePromoterProject(params) {
    return http.requestGet(`/promoter/project/closePromoterProject`, params)
}

// 开启项目
export function openPromoterProject(params) {
    return http.requestGet(`/promoter/project/openPromoterProject`, params)
}

// 执行计划分页
export function planSearchPage(params) {
    return http.requestPost(`/promoter/plan/searchPage`, params)
}

// 操作任务计划-重做
export function operatePlanRedo(params) {
    return http.requestPost(`/promoter/plan/operatePlanRedo`, params)
}

// 根据项目方案ID获取问卷详情List
export function getPlanQuestionnaireList(params) {
    return http.requestGet(`/promoter/plan_questionnaire/getPlanQuestionnaireList`, params)
}

// 获取任务计划详情
export function getPlanDetail(params) {
    return http.requestGet(`/promoter/plan/getPlanDetail`, params)
}

// 导出促销-项目数据报告
export function exportPromoterProjectReport(params) {
    return http.requestPostBlob(`/promoter/project/exportPromoterProjectReport`, params)
}