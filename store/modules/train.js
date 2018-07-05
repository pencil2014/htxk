import api from 'api/train'

let state = {
  temporary_signup_list: [], // 临时存放的提交数据
  query_card_info: {}, // 查询卡信息
  course_info: {},
  card_info: {}, // 培训服务卡信息
  get_item: {} // 获取动态项
}
const getters = {
  temporary_signup_list: state => state.temporary_signup_list,
  query_card_info: state => state.query_card_info,
  course_info: state => state.course_info,
  card_info: state => state.card_info,
  get_item: state => state.get_item
}

const actions = {
  temporary_signup_list ({ commit, state }, data) {
    state.temporary_signup_list = []
    return commit('TEMPORARY_SIGNUP_LIST', data)
  },
  query_card_info ({ commit, state }, params) {
    return api.queryCardInfo(params).then((json) => {
      commit('QUERY_CARD_INFO', json)
    })
  },
  course_info ({ commit, state }, params) {
    api.getCourseInfo(params).then((json) => {
      commit('COURSE_INFO', json)
    })
  },
  card_info ({ commit, state }, data) {
    return commit('CARD_INFO', data)
  },
  get_item ({ commit, state }, params) {
    return api.studentInfo(params).then((json) => {
      commit('GET_ITEM', json.data)
    })
  }
}

const mutations = {
  TEMPORARY_SIGNUP_LIST (state, data) {
    data.forEach(item => {
      item.showVisible = false
      item.isEdit = false
      item.editId = null
      item.id = Math.random().toString(36).substr(2)
    })
    state.temporary_signup_list = data
  },
  QUERY_CARD_INFO (state, data) {
    state.query_card_info = data.data
  },
  COURSE_INFO (state, data) {
    state.course_info = data
  },
  CARD_INFO (state, data) {
    state.card_info = data
  },
  GET_ITEM (state, data) {
    state.get_item = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
