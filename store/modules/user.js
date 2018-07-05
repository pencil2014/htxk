import userApi from 'api/user'
import { VuecookieSet, VuecookieDelete } from 'utils/cookie'

const createKey = () => {
  return Math.random().toString(36).substr(2)
}

let state = {
  key: createKey(), // 用户状态发生改变时改变
  session: {},
  user_all_info: {},
  check_account: {}
}
const actions = {
  getUserInfo ({commit, state}, params) {
    userApi.getUserInfor(params).then((json) => {
      commit('SESSION', json.data)
    })
  },
  // getUserAllInfo 获取侧边栏用户信息
  user_all_info ({commit, state}) {
    userApi.getUserAllInfo().then((json) => {
      commit('USER_ALL_INFO', json.data)
    })
  },
  check_account ({commit, state}, params) {
    userApi.checkAccount(params).then((res) => {
      commit('CHECK_ACCOUNT', {data: res})
    }).catch((ERR) => {
      return false
    })
  },
  reset_info ({commit, state}) {
    commit('RESET_INFO')
  }
}
const mutations = {
  SESSION (state, data) {
    state.session = data
    state.key = createKey()
  },
  USER_ALL_INFO (state, data) {
    state.user_all_info = data
  },
  CHECK_ACCOUNT (state, {data}) {
    state.check_account = data.data
  },
  SET_TOKEN (state, data) {
    console.log(2)
    VuecookieSet('htxk_token', data.token, 1)
    VuecookieSet('htxk_userId', data.userId, 1)
    state.userId = data.userId
    state.token = data.token
  },
  RESET_INFO (state) {
    console.log(1)
    VuecookieDelete('htxk_token')
    VuecookieDelete('htxk_userId')
    VuecookieDelete('SESSION')
    localStorage.removeItem('menuKey')
    localStorage.removeItem('auth_orgId')
    localStorage.removeItem('role_type')
    state.session = ''
    state.key = createKey()
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
