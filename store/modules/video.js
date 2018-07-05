import videoApi from 'api/video'
let state = {
  hot: {},
  index: {},
  videoDetail: {},
  billboard: {}
}
const getters = {
  hot: state => state.hot,
  index: state => state.index
}
const actions = {
  HOT ({commit, state}, params) {
    videoApi.hot(params).then((json) => {
      commit('HOT', {
        params: params,
        data: json.data
      })
    })
  },
  INDEX ({commit, state}, params) {
    videoApi.index(params).then((json) => {
      commit('INDEX', {
        params: params,
        data: json.data
      })
    })
  },
  BILLBOARD ({commit, state}, params) {
    videoApi.billboard(params).then((json) => {
      commit('BILLBOARD', {
        params: params,
        data: json.data
      })
    })
  },
  VIDEODETAIL ({commit, state}, params) {
    videoApi.videoDetail(params).then((json) => {
      commit('VIDEODETAIL', {
        params: params,
        data: json.data
      })
    })
  }
}
const mutations = {
  HOT (state, data) {
    state.hot = data.data
  },
  INDEX (state, data) {
    state.index = data.data
  },
  VIDEODETAIL (state, data) {
    state.videoDetail = data.data
  },
  BILLBOARD (store, data) {
    state.billboard = data.data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
