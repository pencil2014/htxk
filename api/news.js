import feach from 'fetch'
export default {
  SCHOOL (params) {
    return feach({
      url: '/sport/ip/page/school',
      params: params
    })
  },
  // 关注和取消关注
  followUser (params) {
    console.log('params', params)
    return feach({
      url: `/collect/follow/${params.option}/${params.userId}`
    })
  },
  // 意见反馈，是咨询和视频共有的功能
  tipBack (params) {
    return feach({
      url: '/collect/tipBack',
      method: 'POST',
      params: params
    })
  },
  // 验证码是否正确的验证
  validateCode (params) {
    return feach({
      url: '/collect/validate/code',
      params,
      method: 'POST',
      options: {successMsg: 'none'}
    })
  }
}
