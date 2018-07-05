let state = {
  detail: [],
  list: {}
}

const getters = {
  detail: state => state.detail,
  list: state => state.list
}

const actions = {}

const mutations = {
  DETAIL (state, { data }) {
    state.detail = data.data
  },
  LIST (state, data) {
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
