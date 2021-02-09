import tim from '@/TIM/src/tim'
const blacklistModule = {
    state: {
        blacklist: []
    },
    mutations: {
        updateBlacklist(state, blacklist) {
            state.blacklist = blacklist
        },
        removeFromBlacklist(state, userID) {
            state.blacklist = state.blacklist.filter(item => item.userID !== userID)
        },
        reset(state) {
            Object.assign(state, {
                blacklist: []
            })
        }
    },
    actions: {
        getBlacklist(context) {
            tim
                .getBlacklist()
                .then(({ data }) => tim.getUserProfile({ userIDList: data }))
                .then(({ data }) => {
                    context.commit('updateBlacklist', data)
                })
        }
    }
}

export default blacklistModule //     })
//     .then(() => {
//       context.commit('toggleIsLogin', true)
//       context.commit('startComputeCurrent')
//       window.$message({ type: 'success', message: '登录成功' })
//     })
//     .catch(imError => {
//       if (imError.code === 2000) {
//         window.$message.error(imError.message + ', 请检查是否正确填写了 SDKAPPID')
//       } else {
//         window.$message.error(imError.message)
//       }
//     })
// },
logout(context) {
    // 若有当前会话，在退出登录时已读上报
    if (context.rootState.conversation.currentConversation.conversationID) {
        tim.setMessageRead({ conversationID: context.rootState.conversation.currentConversation.conversationID })
    }
    tim.logout().then(() => {
        context.commit('toggleIsLogin')
        context.commit('stopComputeCurrent')
        context.commit('reset')
    })
}
}
}

export default user