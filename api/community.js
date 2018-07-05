import fetch from 'utils/fetch'

export default {
  // 加入圈子
  joinCircle (data, options) {
    return fetch({
      url: '/community/circle/joinCircle',
      method: 'post',
      data,
      options
    })
  },
  // 加入推荐的圈子
  joinCircleBatch (data, options) {
    return fetch({
      url: '/community/circle/joinCircle/batch',
      method: 'post',
      data,
      options
    })
  },
  // 退出圈子
  quitCircle (data, options) {
    return fetch({
      url: '/community/circle/quitCircle',
      method: 'post',
      data,
      options
    })
  },
  // 查询圈子头部信息
  circleDetail (params, options) {
    return fetch({
      url: '/community/guest/circle/circleDetail',
      params
    })
  },
  // 查询圈子所有类目
  circleType (data, options) {
    return fetch({
      url: '/community/guest/circle/circleType',
      data
    })
  },
  // 圈子layout里面的菜单栏
  allFeedCircle (data, options) {
    return fetch({
      url: '/community/guest/circle/AllFeedCircle',
      data
    })
  },
  // 我的圈子， 我的圈子 + 我的关注
  myCircle (params, options) {
    return fetch({
      url: '/community/circle/myCircle',
      params
    })
  },
  // 推荐圈子- 我的圈子没有数据的时候用（）
  feedCircle (params, options) {
    return fetch({
      url: '/community/guest/circle/feedCircle',
      params
    })
  },
  // 帖子相关
  // 删除圈子里的帖子
  deleteFeed (params, options) {
    return fetch({
      url: '/community/circle/delFeed',
      method: 'delete',
      params
    })
  },
  // 删除帖子回复
  deleteComment (params, options) {
    return fetch({
      url: '/feed/user/_feed/comment',
      method: 'delete',
      params,
      options
    })
  },
  // 帖子取消点赞
  delFeedDigg (params, options) {
    return fetch({
      url: '/feed/user/feed/digg',
      method: 'delete',
      params,
      options
    })
  },
  // 帖子点赞
  feedDigg (data, options) {
    return fetch({
      url: '/feed/user/feed/digg',
      method: 'post',
      data,
      options
    })
  },
  // 评论点赞
  commentDigg (data, options) {
    return fetch({
      url: '/feed/user/comment/digg',
      method: 'post',
      data,
      options
    })
  },
  // 评论取消点赞
  delCommentDigg (params, options) {
    return fetch({
      url: '/feed/user/comment/digg',
      method: 'delete',
      params
    })
  },
  // 点赞接口 isComment是否评论，true帖子，false评论
  diggAction (data, options) {
    let url = ''
    if (data.isComment) {
      url = '/feed/user/comment/digg'
    } else {
      url = '/feed/user/feed/digg'
    }
    delete data.isComment
    return fetch({
      url: url,
      method: 'post',
      data,
      options
    })
  },
  // 取消点赞
  delDiggAction (params, options) {
    let url = ''
    if (params.isComment) {
      url = '/feed/user/comment/digg'
    } else {
      url = '/feed/user/feed/digg'
    }
    delete params.isComment
    return fetch({
      url: url,
      method: 'delete',
      params,
      options
    })
  },
  // 评论
  comment (data, options) {
    return fetch({
      url: '/feed/user/_feed/comment',
      method: 'post',
      data,
      options
    })
  },
  // 渲染帖子详情
  feedDetail (params, options) {
    return fetch({
      url: '/feed/feed',
      params,
      options
    })
  },
  // 渲染评论
  loadComment (params, options) {
    return fetch({
      url: '/feed/feed/comment',
      params,
      options: Object.assign({}, options, {triggerLoading: false})
    })
  },
  // 圈子首页的精选帖 /community/guest/circle/typeMarrowFeed
  marrowFeed (params, options) {
    return fetch({
      url: '/community/guest/circle/marrowFeed',
      params
    })
  },
  // 圈子首页的各type下的帖子
  typeMarrowFeed (params, options) {
    return fetch({
      url: '/community/guest/circle/typeMarrowFeed',
      params
    })
  }
}
