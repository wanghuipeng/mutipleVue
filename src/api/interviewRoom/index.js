import http from '@/utils/http'

// 获取用户直播中的记录
export function getLiveRecordByUserId(params) {
  return http.requestGet(`/video/room-live/getLiveRecordByUserId`, params)
}

// 修改视频面试房间开关
export function updateVideoInterviewRoomSwitch(params) {
  return http.requestGet(`/video/room-live/updateVideoInterviewRoomSwitch`, params)
}

// 获取面试者信息分页
export function getInterviewPage(params) {
  return http.requestGet(`/video/room-interview/getInterviewPage`, params)
}

// 开始面试
export function startInterview(params) {
  return http.requestGet(`/video/room-interview/startInterview`, params)
}

// 取消面试
export function cancenInterview(params) {
  return http.requestGet(`/video/room-interview/cancenInterview`, params)
}

// 完成面试
export function finishInterview(params) {
  return http.requestGet(`/video/room-interview/finishInterview`, params)
}

// 面试视频接听
export function interviewVideoAnswer(params) {
  return http.requestGet(`/video/room-interview/interviewVideoAnswer`, params)
}
