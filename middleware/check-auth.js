import { getUserFromLocalStorage } from '~/utils/auth'
import axios from 'axios'

export default function ({ isServer, store, req }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  if (isServer) {
    if (!req.headers.cookie) return
    // const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('SESSION='))
    // if (!jwtCookie) return
    // const sessionId = jwtCookie.split('=')[1]
    let Cookie = req.headers.cookie
    axios.get('/manage/personal/getUserInfo', {headers: {'Cookie': Cookie}}).then(function (res) {
      store.commit('SET_USER', res.data.data)
      // return res.data
    })
  } else {
    const loggedUser = getUserFromLocalStorage()
    store.commit('SET_USER', loggedUser)
  }
}
