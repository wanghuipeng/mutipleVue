import http from '@/utils/http'

// 获取数据字典
export function getDict() {
    return http.requestGet(`/code/dict.js?refresh=true`)
}

// 上传Base64文件
export function uploadBase64(params) {
    return http.requestPost(`/common/uploadBase64`, params)
}

// 获取文件夹目录
export function getFolderList(params) {
    return http.requestPost(`/folder/folder/getFolderList`, params)
}

// 删除文件夹
export function deleteById(params) {
    return http.requestDelete(`/folder/folder/deleteById`, params)
}

// 添加文件夹
export function addFolder(params) {
    return http.requestPost(`/folder/folder/addFolder`, params)
}

// 编辑文件夹
export function editFolder(params) {
    return http.requestPost(`/folder/folder/editFolder`, params)
}

// 设置常用文件夹
export function editFolderUsed(params) {
    return http.requestGet(`/folder/folder/editFolderUsed`, params)
}

// 文件夹--批量添加
export function addFolderFileBatch(params) {
    return http.requestPost(`/folder/folder/addFolderFileBatch`, params)
}

// 文件夹--批量移除
export function deleteFolderFileBatch(params) {
    return http.requestPost(`/folder/folder/deleteFolderFileBatch`, params)
}

// 通过ID获取已加入的文件夹
export function getFolderByFileId(params) {
    return http.requestGet(`/folder/folder/getFolderByFileId`, params)
}

// 验证平安是否重复
export function checkPingAnRepeat(params) {
    return http.requestPost(`/rest/candidate/checkPingAnRepeat`, params)
}