import fetch from 'fetch'
export default {
  star (params) {
    return fetch({
      url: '/sport/ip/page/star?page=1&rows=0',
      params: params
    })
  },
  hot (params) {
    return fetch({
      url: '/video/page/three/rank?page=1&rows=7',
      params: params
    })
  },
  index (params) {
    return fetch({
      url: '/common/index',
      params: params
    })
  },
  billboard (params) {
    return fetch({
      url: '/video/page/week/rank',
      params: params
    })
  },
  videoDetail (params) {
    return fetch({
      url: '/video/play',
      params: params
    })
  },
  videoCollect (params) {
    return fetch({
      url: '/collect/video',
      params: params
    })
  }
}
