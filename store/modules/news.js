import newsApi from 'api/news'
let state = {
  cates: [],
  list: {},
  school: [],
  videos: []
}
const getters = {
  cates: state => state.cates,
  list: state => state.list,
  school: state => state.school,
  videos: state => state.videos
}
const actions = {
  SCHOOL ({commit, state}, params) {
    newsApi.SCHOOL(params).then((json) => {
      commit('SCHOOL', {
        params: params,
        data: json.data.list
      })
    })
  }
}
const mutations = {
  CATES (state, data) {
    state.cates = data.data
  },
  LIST (state, data) {
    state.list = data.data
  },
  SCHOOL (state, data) {
    state.school = data.data
  },
  VIDEOS (state, data) {
    state.videos = data.data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
