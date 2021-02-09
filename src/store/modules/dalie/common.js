const common = {
    state: {
        menuList: [], // 个人中心菜单
        certificationStatus: null, // 认证状态
        selectedData: {}, // 选择的数据
        dictData: {} // 数据字典集合
    },
    mutations: {
        setMenuList(state, data) {
            state.menuList = data
        },
        setCertificationStatus(state, data) {
            state.certificationStatus = data
        },
        setSelectedData(state, data) {
            state.selectedData = Object.assign(state.selectedData, data)
        },
        // 更新字典数据
        updateDictData(state, dictData) {
            state.dictData = dictData;
        },
        updateUserProfile(state, userProfile = {}) {
            state.userProfile = userProfile;
        }
    },
    actions: {
        // 触发更新字典数据方法
        dispatchUpdateDictData(context, dictData) {
            context.commit('updateDictData', dictData);
        },
        // 触发更新用户信息方法
        dispatchUpdateUserProfile(context, userProfile) {
            context.commit('updateUserProfile', userProfile);
        }
    }
}

export default common