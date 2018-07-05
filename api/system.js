import fetch from 'utils/fetch'
export default {
  // @我的
  getAtListData (params) {
    return fetch({
      url: '/message/at',
      params
    })
  },
  // 系统消息
  getSystemListData (params) {
    return fetch({
      url: '/message/system',
      params
    })
  },
  // 申请消息
  getApplyListData (params) {
    return fetch({
      url: '/message/apply',
      params
    })
  },
  // 点赞消息
  getPraiseListData (params) {
    return fetch({
      url: '/message/praise',
      params
    })
  },
  // 评论消息
  getCommentListData (params) {
    return fetch({
      url: '/message/comment',
      params
    })
  },
  // 统计
  getCountData (params) {
    return fetch({
      url: '/message/message/count',
      params
    })
  },
  // 渲染已读
  getOperateData (params) {
    return fetch({
      url: '/message/messageOperate',
      params
    })
  }
}
