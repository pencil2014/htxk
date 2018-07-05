import fetch from 'fetch'
export default {
  reported (params) {
    return fetch({
      url: '/sponsored/base/commitReport',
      method: 'POST',
      params: params
    })
  },
  resources (params) {
    return fetch({
      url: '/sponsored/base/enterSource',
      params: params
    })
  }
}
