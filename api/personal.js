import fetch from 'utils/fetch'

export default {
  // 获取我的资讯列表
  newsList (params) {
    return fetch({
      url: '/manage/personal/news/page',
      params
    })
  },
  // 撤回某条资讯
  revokeNews (data, options) {
    return fetch({
      url: '/manage/news/rebackarticle',
      method: 'POST',
      data,
      options
    })
  },
  // 删除某条资讯
  deleteNews (data, options) {
    return fetch({
      url: '/manage/news/articleDelete',
      method: 'POST',
      data,
      options
    })
  },
  // 获取我的视频
  videoList (params) {
    return fetch({
      url: '/manage/personal/videos/page',
      params
    })
  },
  // 删除某条视频
  deleteVideo (data, options) {
    return fetch({
      url: '/manage/news/videoDelete',
      method: 'POST',
      data,
      options
    })
  },
  // 获取帖子列表
  feedList (params) {
    return fetch({
      url: '/manage/personal/feed/page',
      params
    })
  },
  // 获取相册列表
  photoList (params) {
    return fetch({
      url: '/manage/personal/photo/page',
      params
    })
  }
}
