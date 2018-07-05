import fetch from 'fetch'
export default {
  // 获取报名自定义字段
  matchSignFileds (params) {
    return fetch({
      url: '/match/list/matchSignFileds',
      params: params
    })
  },
  sign (data, options) {
    return fetch({
      url: '/match/user/addMatchSign',
      method: 'POST',
      options,
      data: JSON.stringify(data)
    })
  },
  sendMsg (params) {
    return fetch({
      url: '/match/_guest/matchSignSmsCode',
      params
    })
  },
  checkPhoneMsg (params) {
    return fetch({
      url: '/account/validate/checkValidateCode',
      params
    })
  },
  saveMember (data) { // 团体报名保存报名成员
    return fetch({
      url: '/match/user/teamSignUp/member',
      method: 'POST',
      data
    })
  },
  validateHasSignUp (data, options) {
    return fetch({ // 验证是否已报名
      url: '/match/user/validateHasSignUp',
      method: 'POST',
      options,
      data
    })
  },
  applyApi (params) { // 查询俱乐部列表
    return fetch({
      url: '/match/user/club',
      params
    })
  },
  createClub (data, options) {
    return fetch({ // 创建俱乐部
      url: '/match/user/teamSignUp/group',
      method: 'POST',
      options,
      data
    })
  },
  selectClub (data, options) {
    return fetch({ // 选择俱乐部
      url: '/match/user/teamSignUp/choosedGroup',
      method: 'POST',
      options,
      data
    })
  }
}
