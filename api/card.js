import fetch from 'fetch'
export default {
  cardList (params) {
    let option = Object.assign({}, params)
    option.statu = option.statu === 'all' ? '' : option.statu
    option.type = option.type === 'all' ? '' : option.type
    return fetch({
      url: '/manage/scard/list',
      params: option
    })
  },
  cardDetail (params) {
    return fetch({
      url: '/manage/scard/detail',
      params: params
    })
  },
  goods (params) {
    return fetch({
      url: '/manage/scard/goods',
      params: params
    })
  }
}
