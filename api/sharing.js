import fetch from 'fetch'

export default {
  getMenu () {
    return fetch({
      url: '/information/revision/espn?page=1&rows=30'
    })
  },
  // 资讯列表PC频道下24小时热门资讯内容
  newsHot (params, options) {
    return fetch({
      url: '/information/revision/espn/news/hot',
      params
    })
  }
}
