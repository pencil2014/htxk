import fetch from 'fetch'
export default {
  sponsorList (params) {
    return fetch({
      url: '/sponsored/base/hot', // 赞助热门接口
      params: params
    })
  },
  bannerList (params) {
    return fetch({
      url: '/sponsored/base/spSysBanner/list', // 首页的banner图接口
      params: params
    })
  },
  noticeList (data, options) {
    return fetch({
      url: '/sponsored/base/notice/list', // 公告列表接口
      method: 'POST',
      options,
      data
    })
  },
  noticeDetails (data, options) {
    return fetch({
      url: '/sponsored/base/notice/id', // 公告详情接口
      method: 'POST',
      options,
      data
    })
  }
}
