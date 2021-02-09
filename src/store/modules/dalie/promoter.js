const promoter = {
    state: {
        projectId: null, // 促销项目id
    },
    mutations: {
        // 更新项目id
        updateProjectId(state, projectId) {
            state.projectId = projectId;
        }
    },
    actions: {
        // 触发更新字项目id方法
        dispatchUpdateProjectId(context, dictData) {
            context.commit('updateProjectId', dictData);
        }
    }
}

export default promoter