const customer = {
    state: {
        reportDetail: {} // 推荐报告
    },
    mutations: {
        setReportDetail(state, data) {
            state.reportDetail = data
        }
    }
}

export default customer