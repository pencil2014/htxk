import Vuex from 'vuex'

import actions from './actions'
import news from './modules/news'
import user from './modules/user'
import index from './modules/index'
import goods from './modules/goods'
import community from './modules/community'
import attestation from './modules/attestation'
import video from './modules/video'
import personal from './modules/personal'
import train from './modules/train'
import sharing from './modules/sharing'

let state = {
  global: {
  },
  loading: true, // 页面加载状态包含fetch接口
  timestamp: Date.now(),
  isReLoad: 1,
  loginDialog: false,
  ssr: false
}

// getters
const getters = {
  global: state => state.global,
  user: state => state.global.user
}

let timer = null

const mutations = {
  LOADING (state, data) {
    if (state.loading === false && data) {
      document.body.style.minHeight = document.body.clientHeight + 'px'
    }
    state.loading = data
    if (process.browser && window.$nuxt && data === false) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        document.body.style.minHeight = ''
        window.$nuxt.loaded && window.$nuxt.loaded()
      }, 100)
    }
  },
  SSR (state, ua) {
    if (ua && ua.indexOf) {
      state.ssr = ua.indexOf('Baiduspider+') > -1 || ua.indexOf('Googlebot') > -1 || ua.indexOf('Sosospider+') > -1 || ua.indexOf('QQBrowser') > -1
    }
  }
}

const createStore = () => {
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
      goods,
      news,
      personal,
      user,
      index,
      attestation,
      community,
      video,
      train,
      sharing
    }
  })
}

export default createStore
