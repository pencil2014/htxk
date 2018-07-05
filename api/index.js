import fetch from 'fetch'
export default {
  column (params) {
    return fetch({
      url: '/index/guest/homepageColumn',
      params: params
    })
  },
  recommendUser (params) {
    return fetch({
      url: '/index/ip/recom',
      params: params
    })
  },
  // 关注
  followUser (params) {
    return fetch({
      url: '/city/common/follow',
      method: 'POST',
      params: params
    })
  },
  // 上传裁剪图片
  uploadCropper (data, options) {
    return fetch({
      url: '/manage/personal/update/iconData',
      method: 'POST',
      data,
      options
    })
  }
}
