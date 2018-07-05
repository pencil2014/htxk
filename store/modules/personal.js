let state = {
  feed: [],
  news: [],
  article: [],
  photo: [],
  video: [],
  fans: [],
  follow: [],
  service: [],
  match: []
}
const getters = {
  feed: state => state.feed,
  news: state => state.news,
  article: state => state.article,
  photo: state => state.photo,
  video: state => state.video,
  fans: state => state.fans,
  follow: state => state.follow,
  service: state => state.service,
  match: state => state.match
}
const mutations = {
  FEED (state, data) {
    state.feed = data.data
  },
  NEWS (state, data) {
    state.news = data
  },
  ARTICLE (state, data) {
    state.article = data.data
  },
  PHOTO (state, data) {
    state.photo = data
  },
  VIDEO (state, data) {
    state.video = data.data
  },
  FANS (state, data) {
    state.fans = data.data
  },
  FOLLOW (state, data) {
    state.follow = data.data
  },
  SERVICE (state, data) {
    state.service = data.data
  },
  MATCH (state, data) {
    state.match = data.data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations
}
