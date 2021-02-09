const orderListModule = {
  state: {
    showOrder: false
  },
  mutations: {
    updateShowOrder(state, showOrder) {
      state.showOrder = showOrder
    }
  }
}

export default orderListModule
