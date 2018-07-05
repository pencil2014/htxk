import fetch from 'utils/fetch'

export default {
  // 获取我的组织列表
  groupList (params) {
    return fetch({
      url: '/manage/personal/news/page',
      params
    })
  }
}
