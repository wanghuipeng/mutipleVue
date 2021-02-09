import Vue from 'vue'
import Avatar from '@/TIM/src/components/avatar.vue'
import store from '@/store'
import tim from '@/TIM/src/tim'
import TIM from 'tim-js-sdk'
import { translateGroupSystemNotice } from '@/TIM/src/utils/common'
import '@/TIM/src/assets/icon/iconfont.css'
import '@/TIM/src/assets/icon/tim.css'
import { ACTION } from '@/TIM/src/utils/trtcCustomMessageMap'
import router from '@/router'
import { startInterview } from '@/api/interviewRoom'

window.tim = tim
window.TIM = TIM
window.store = store
const $bus = new Vue()
Vue.prototype.$bus = $bus // event Bus 用于无关系组件间的通信。
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.$store = store
Vue.component('avatar', Avatar)

// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this)
// SDK NOT READT
tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate, this)
// 被踢出
tim.on(TIM.EVENT.KICKED_OUT, () => {
  store.commit('showMessage', {
    message: '被踢出，请重新登录。',
    type: 'error'
  })
  store.commit('toggleIsLogin', false)
  store.commit('reset')
})
// SDK内部出错
tim.on(TIM.EVENT.ERROR, onError)
// 收到新消息
tim.on(TIM.EVENT.MESSAGE_RECEIVED, onReceiveMessage)
// 会话列表更新
tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
  store.commit('updateConversationList', event.data)
})
// 群组列表更新
tim.on(TIM.EVENT.GROUP_LIST_UPDATED, event => {
  store.commit('updateGroupList', event.data)
})
// 收到新的群系统通知
tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, event => {
  const isKickedout = event.data.type === 4
  const isCurrentConversation =
    `GROUP${event.data.message.payload.groupProfile.groupID}` ===
    this.currentConversation.conversationID
  // 在当前会话被踢，需reset当前会话
  if (isKickedout && isCurrentConversation) {
    store.commit('resetCurrentConversation')
  }
  Notification({
    title: '新系统通知',
    message: translateGroupSystemNotice(event.data.message),
    duration: 3000,
    onClick: () => {
      const SystemConversationID = '@TIM#SYSTEM'
      store.dispatch('checkoutConversation', SystemConversationID)
    }
  })
})
// 网络监测
tim.on(TIM.EVENT.NET_STATE_CHANGE, onNetStateChange)

function onReceiveMessage({ data: messageList }) {
	// store.commit('pushCurrentMessageList', messageList)
	if (store.state.user.isSDKReady && tim.getConversationList) {
		tim.getConversationList().then(res => {
			const list = res.data.conversationList
			let num = 0
			list.map(item => {
				num += item.unreadCount
			})
			store.commit('setUnreadCount', num)
		})
	}
	handleVideoMessage(messageList)
}
function onError({ data }) {
  if (data.message !== 'Network Error') {
    store.commit('showMessage', {
			message: data.message,
			type: 'error'
    })
	}
}
function onReadyStateUpdate({ name }) {
	const isSDKReady = name === TIM.EVENT.SDK_READY
	store.commit('toggleIsSDKReady', isSDKReady)
	if (isSDKReady) {
		tim
			.getMyProfile()
			.then(({ data }) => {
				store.commit('updateCurrentUserProfile', data)
			})
			.catch(error => {
				store.commit('showMessage', {
					type: 'error',
					message: error.message
				})
			})
		store.dispatch('getBlacklist')
	}
}

function onNetStateChange(event) {
	store.commit('showMessage', checkoutNetState(event.data.state))
}
function checkoutNetState(state) {
	switch (state) {
		case TIM.TYPES.NET_STATE_CONNECTED:
			return { message: '已接入网络', type: 'success' }
		case TIM.TYPES.NET_STATE_CONNECTING:
			return { message: '当前网络不稳定', type: 'warning' }
		case TIM.TYPES.NET_STATE_DISCONNECTED:
			return { message: '当前网络不可用', type: 'error' }
		default:
			return ''
	}
}

function selectConversation(conversationID) {
	if (conversationID !== store.state.conversation.currentConversation.conversationID) {
		store.dispatch('checkoutConversation', conversationID)
	}
}

function handleVideoMessage(messageList) {
	router.push('/interviewRoom')
	setTimeout(() => {
		const videoMessageList = messageList.filter(
			message => message.type === TIM.TYPES.MSG_CUSTOM && isJsonStr(message.payload.data)
		)
		if (videoMessageList.length === 0) return
		const videoPayload = JSON.parse(videoMessageList[0].payload.data)
		console.log('asd', videoPayload)
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
			console.log('正在呼叫')
			if (store.state.video.isBusy) {
				$bus.$emit('busy', videoPayload, videoMessageList[0])
				return
			}
			store.commit('GENERATE_VIDEO_ROOM', videoPayload.room_id)
			selectConversation(videoMessageList[0].conversationID) // 切换当前会话页
			if (videoMessageList[0].from !== store.state.userInfo.userId) {
				console.log('电话进来啦')
				const params = {
					jhUserId: videoMessageList[0].from
				}
				startInterview(params).then(res => {
					console.log('信息：', res.data)
					store.dispatch(
						'updateToAccountInfo',
						res.data
					)
				})
				$bus.$emit('isCalled')
			}
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
			$bus.$emit('missCall')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
			$bus.$emit('isRefused')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
			$bus.$emit('missCall')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
			$bus.$emit('isAccept')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
			console.log('挂断了')
			$bus.$emit('isHungUp')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
			$bus.$emit('isRefused')
		}
		if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
			$bus.$emit('isRefused')
		}
	}, 0)
}
function isJsonStr(str) {
	try {
		JSON.parse(str)
		return true
	} catch {
		return false
	}
}
