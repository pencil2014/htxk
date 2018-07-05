import fetch from 'utils/fetch'
// 认证接口
export default {
  // 组织实名认证提交
  realAuthOrg (data, options) {
    return fetch({
      url: '/auth/user/org/real/auth',
      method: 'POST',
      data,
      options
    })
  },
  // 获取实名认证信息
  getNameDetail (params) {
    return fetch({
      url: '/auth/real/name/info',
      params
    })
  },
  getUserPersonDetail (params) {
    return fetch({
      url: '/auth/person/user/auth/detail',
      params
    })
  },
  // 获取组织用户认证详情, 用户认证-查看组织的资料
  getUserOrgDetail (params) {
    return fetch({
      url: '/auth/user/getOrgAuthInfo',
      params
    })
  },
  // 获取个人实名认证详情
  getNamePersonDetail (params) {
    return fetch({
      url: '/auth/person/name/detail',
      params
    })
  },
  // 获取组织实名认证详情
  getNameOrgDetail (params) {
    return fetch({
      url: '/auth/user/getOrgRealAuth',
      params
    })
  },
  // 获取组织认证特权
  getOrgRight (params) {
    return fetch({
      url: '/auth/user/org/auth/right ',
      params
    })
  },
  userAttest (data, options) { // 个人用户申请认证
    return fetch({
      url: '/auth/person/user/ipAuth',
      method: 'POST',
      options,
      data
    })
  },
  categories (params) { // 用户认证-组织认证类型
    return fetch({
      url: '/auth/user/categories',
      params
    })
  },
  orgInfo (params) { // 组织信息/企业四要素
    return fetch({
      url: '/auth/user/getOrgRealAuth',
      params
    })
  },
  orgInsert (data, options) { // 用户认证-提交组织认证信息
    return fetch({
      url: '/auth/user/orgAuth',
      method: 'POST',
      options,
      data
    })
  },
  // orgDetail (params) { // 用户认证-查看组织的资料
  //   return fetch({
  //     url: '/auth/user/getOrgAuthInfo',
  //     params
  //   })
  // },
  userDetail (params) { // 用户认证-查看个人的资料
    return fetch({
      url: '/auth/person/user/auth/info',
      params
    })
  },
  editDetail (params) { // 用户认证-查询个人认证信息填充到表单作修改操作
    return fetch({
      url: '/auth/person/user/auth',
      params
    })
  },
  getUserPersonType (params) {
    return fetch({
      url: '/auth/person/user/cate',
      params
    })
  }
}
