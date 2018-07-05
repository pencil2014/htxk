import indexApi from '../../api/index'
let state = {
  column: {},
  recommend_user: {list: []},
  recommend: {list: []},
  menu: null,
  banner: null
}

const actions = {
  getRecommendGoods ({commit, state}, params) {
    indexApi.column(params).then((json) => {
      commit('COLUMN', {
        params: params,
        data: json.data
      })
    })
  },
  getRecommendUser ({commit, state}, params) {
    indexApi.recommendUser(params).then((json) => {
      commit('RECOMMEND_USER', json.data)
    })
  }
}
const mutations = {
  BANNER (state, { data }) {
    // console.log('BANNER-data', data)
    state.banner = data.data ? data.data.list : null
  },
  COLUMN (state, data) {
    state.column = data
  },
  MENU (state, { data }) {
    state.menu = data.data
  },
  RECOMMEND (state, data) {
    state.recommend = data
  },
  RECOMMEND_USER (state, data) {
    // console.log(data)
    state.recommend_user = data
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
