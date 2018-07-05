import bbsApi from 'api/community'

let state = {
  detail: null,
  comment: {},
  menu: [],
  layout_menu: [],
  my_menu: {},
  feed_circle: {},
  hot_circle: [],
  circle_detail: null,
  circle_feed: [],
  hot_feed: [],
  post_list: [],
  banner: []
}

const getters = {
  menu: state => state.menu,
  layout_menu: state => state.layout_menu,
  my_menu: state => state.my_menu,
  feed_circle: state => state.feed_circle,
  hot_circle: state => state.hot_circle,
  circle_detail: state => state.circle_detail,
  circle_feed: state => state.circle_feed,
  hot_feed: state => state.hot_feed,
  post_list: state => state.post_list,
  banner: state => state.banner
}

const actions = {
  menu ({commit, state}) {
    return bbsApi.circleType()
      .then((json) => {
        commit('MENU', json)
      })
      .catch(() => {})
  },
  layout_menu ({commit, state}) {
    return bbsApi.allFeedCircle()
      .then((json) => {
        commit('LAYOUT_MENU', json)
      })
      .catch(() => {})
  },
  my_menu ({commit, state}, params) {
    return bbsApi.myCircle(params)
      .then((json) => {
        commit('MY_MENU', json)
      })
      .catch(() => {})
  },
  feed_circle ({commit, state}, params) {
    return bbsApi.feedCircle(params)
      .then((json) => {
        commit('FEED_CIRCLE', json)
      })
      .catch(() => {})
  },
  feed_detail ({ commit, state }, params) {
    bbsApi.feedDetail(params).then((res) => {
      commit('DETAIL', {
        data: res.data
      })
    })
  },
  comment_data ({ commit, state }, params) {
    bbsApi.loadComment(params).then((res) => {
      commit('COMMENT', {
        data: res.data
      })
    })
  },
  post_list ({ commit, state }, params) {
    return bbsApi.marrowFeed(params)
      .then((json) => {
        commit('POST_LIST', json)
      })
      .catch(() => {})
  },
  circle_detail ({ commit, state }, params) {
    return bbsApi.circleDetail(params)
      .then((json) => {
        commit('CIRCLE_DETAIL', json)
      })
      .catch(() => {})
  }
}

const mutations = {
  DETAIL (state, { data }) {
    state.detail = data
  },
  COMMENT (state, { data }) {
    state.comment = data
  },
  MENU (state, { data }) {
    state.menu = data
  },
  LAYOUT_MENU (state, { data }) {
    state.layout_menu = data
  },
  MY_MENU (state, { data }) {
    state.my_menu = data
  },
  FEED_CIRCLE (state, { data }) {
    state.feed_circle = data
  },
  HOT_CIRCLE (state, { data }) {
    if (Number(data.result) === 0 && data.data.list instanceof Array) {
      state.hot_circle = data.data.list
    }
  },
  CIRCLE_DETAIL (state, { data }) {
    state.circle_detail = data
  },
  CIRCLE_FEED (state, { data }) {
    state.circle_feed = data
  },
  HOT_FEED (state, { data }) {
    state.hot_feed = data
  },
  POST_LIST (state, { data }) {
    state.post_list = data
  },
  BANNER (state, { data }) {
    state.banner = data.data.list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
