import api from 'api/sharing'

let state = {
  detail: [],
  menuList: [],
  matchList: {},
  videoList: {},
  pictureList: {},
  banner: {},
  headLine: {},
  latest: [],
  news_hot: []
}

const getters = {
  detail: state => state.detail,
  menuList: state => state.menuList,
  matchList: state => state.matchList,
  pictureList: state => state.pictureList,
  banner: state => state.banner,
  headLine: state => state.headLine,
  latest: state => state.latest,
  news_hot: state => state.news_hot
}

const actions = {
  news_hot ({ commit, state }, params) {
    return api.newsHot(params)
      .then((json) => {
        commit('NEWS_HOT', json)
      })
      .catch(() => {})
  }
}

const mutations = {
  DETAIL (state, { data }) {
    state.detail = data.data
  },
  MENULIST (state, data) {
    state.menuList = data && data.data && data.data.list
  },
  MATCHLIST (state, data) {
    state.matchList = data
  },
  VIDEOLIST (state, data) {
    state.videoList = data
  },
  PICTURELIST (state, data) {
    state.pictureList = data
  },
  BANNER (state, data) {
    state.banner = data.data
  },
  HEADLINE (state, data) {
    state.headLine = data
  },
  LATEST (state, data) {
    state.latest = data && data.data && data.data.list
  },
  NEWS_HOT (state, data) {
    state.news_hot = data && data.data && data.data.list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
