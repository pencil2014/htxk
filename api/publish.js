import fetch from 'utils/fetch'

export default {
  // 获取编辑资讯内容
  articleData (params) {
    return fetch({
      url: '/manage/news/publish/article',
      params
    })
  },
  // 获取资讯分类
  articleCategory (params) {
    return fetch({
      url: '/manage/news/getCategoryArticleList',
      params
    })
  },
  // 获取资讯标签
  articleLabels (params) {
    return fetch({
      url: '/manage/news/publish/article',
      params
    })
  },
  // 保存资讯
  articleSave (data, options) {
    return fetch({
      url: '/manage/news/articleSave',
      method: 'POST',
      data,
      options
    })
  },
  // 获取编辑组图内容
  photoData (params) {
    return fetch({
      url: '/manage/news/publish/image',
      params
    })
  },
  // 保存组图
  photoSave (data, options) {
    return fetch({
      url: '/manage/news/imagesSave',
      method: 'POST',
      data,
      options
    })
  },
  // 获取视频一级分类
  videoCategoryF (params) {
    return fetch({
      url: '/manage/news/publish/video',
      params
    })
  },
  // 获取视频二级分类
  videoCategoryS (params) {
    return fetch({
      url: '/manage/news/getCategoryVideoList',
      params
    })
  },
  // 保存视频
  videoSave (data, options) {
    return fetch({
      url: '/manage/news/videoSave',
      method: 'POST',
      data,
      options
    })
  }
}
