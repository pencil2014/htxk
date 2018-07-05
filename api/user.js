import fetch from 'fetch'
import md5 from 'js-md5'
export default {
  // 登录
  login (data, options) {
    data = Object.assign({}, data)
    data.password = md5(data.password)
    return fetch({
      url: '/account/login/login',
      method: 'POST',
      options,
      data
    })
  },
  // 退出登录
  logout (params) {
    return fetch({
      url: '/account/login/logout',
      params
    })
  },
  // 第三方登录
  authLogin (params) {
    return fetch({
      url: '/account/login/thirdPartyLogin',
      params
    })
  },
  // 第三方登录
  getAuthInfo (params) {
    let type = params.type
    let url = ''
    if (type === 'qq') {
      url = '/account/login/qqLoginCallback'
    } else if (type === 'wechat') {
      url = '/account/login/wechatLoginCallback'
    } else if (type === 'sina') {
      url = '/account/login/weiboLoginCallback'
    }
    return fetch({
      url: url,
      params
    })
  },
  // ----注册接口
  // 检查账号是否存在
  checkAccount (params) {
    return fetch({
      url: '/account/validate/checkAccount',
      params
    })
  },
  // 生成图片验证码
  generateValidateCode (params) {
    return fetch({
      url: '/account/validate/generatePictureValidateCode',
      params
    })
  },
  // 注册
  checkRegister (data, options) {
    return fetch({
      url: '/account/register/register',
      method: 'POST',
      options,
      data
    })
  },
  // 获取手机邮箱验证码
  sendValidateCode (params) {
    return fetch({
      url: '/account/validate/sendValidateCode',
      params
    })
  },
  // 校验图片验证码
  checkImgCode (params) {
    return fetch({
      url: '/account/validate/checkPictureValidateCode',
      params
    })
  },
  // 校验手机验证码
  checkValidateCode (params) {
    return fetch({
      url: '/account/validate/checkValidateCode',
      params
    })
  },
  // 忘记密码校验手机验证码
  checkAccountNumber (data, options) {
    return fetch({
      url: '/account/forgetPassword/checkAccount',
      method: 'POST',
      options,
      data
    })
  },
  // 校验昵称是否存在
  checkNickname (data, options) {
    return fetch({
      url: '/account/validate/checkNickname',
      method: 'POST',
      options: {options, successMsg: 'none'},
      data
    })
  },
  // 设置昵称和密码
  setPasswordAndNickname (data, options) {
    data = Object.assign({}, data)
    data.password = md5(data.password)
    return fetch({
      url: '/account/register/setPasswordAndNickname',
      method: 'POST',
      options,
      data
    })
  },
  // 邮箱注册绑定手机
  bindPhone (data, options) {
    return fetch({
      url: '/account/register/bindPhone',
      method: 'POST',
      options,
      data
    })
  },
  // 账号激活验证
  verification (params) {
    return fetch({
      url: '/guest/activate/verification',
      params
    })
  },
  // 账号激活用户信息
  activate (data, options) {
    data = Object.assign({}, data)
    data.loginPwd = md5(data.loginPwd)
    return fetch({
      url: '/guest/activate',
      method: 'POST',
      options,
      data
    })
  },
  // 用户登出
  userExit () {
    return fetch({
      url: '/user/exit'
    })
  },
  // 忘记密码
  forgrtPassword (data) {
    return fetch({
      url: '/account/forgetPassword/forgetPassword',
      method: 'POST',
      data
    })
  },
  // 重置密码
  resetPassword (data) {
    data = Object.assign({}, data)
    data.password = md5(data.password)
    return fetch({
      url: '/account/forgetPassword/resetPassword',
      method: 'POST',
      data
    })
  },
  // 修改密码
  alterPassword (data, options) {
    data = Object.assign({}, data)
    data.oldPwd = md5(data.oldPwd)
    data.newPwd = md5(data.newPwd)
    return fetch({
      url: '/manage/personal/updatePassword',
      method: 'POST',
      data,
      options
    })
  },
  // 获取登录信息
  getUserInfor () {
    return fetch({
      url: '/manage/personal/getUserInfo',
      method: 'GET'
    })
  },
  // 收货地址
  receiveAddress (params) {
    return fetch({
      url: '/manage/user/queryUserAddress',
      params: params
    })
  },
  // 编辑收货地址
  editReceiveAddress (data, options) {
    return fetch({
      url: data.id ? '/manage/user/updateUserAddress' : '/manage/user/addUserAddress',
      method: 'POST',
      data: data,
      options
    })
  },
  // 删除收货地址
  deleteReceiveAddress (data, options) {
    return fetch({
      url: '/manage/user/deleteUserAddress',
      method: 'POST',
      data: data,
      options
    })
  },
  // 获取很全的用户信息
  getUserAllInfo () {
    return fetch({
      url: '/manage/personal/getPersonalInfo'
    })
  },
  getEditUserInfo (params) {
    return fetch({
      url: '/manage/personal/edit/info',
      params
    })
  },
  // 获取我的关注
  myFollow (params) {
    return fetch({
      url: '/manage/personal/focus/page',
      params
    })
  },
  // 获取我的粉丝
  myFollower (params) {
    return fetch({
      url: '/manage/personal/fans/page',
      params
    })
  },
  // 修改用户信息
  updateUserInfo (data, options) {
    return fetch({
      url: '/manage/personal/update/user/info',
      method: 'POST',
      data,
      options
    })
  },
  // 修改用户头像
  updateUserIcon (data) {
    return fetch({
      url: '/manage/personal/update/icon',
      method: 'POST',
      data
    })
  },
  // 用户提交意见（意见反馈）
  submitFeedback (data, options) {
    return fetch({
      url: '/manage/feedback/_feedback',
      method: 'POST',
      data,
      options
    })
  },
  // 粉丝和关注 的关注和取消关注 /collect/follow/{operation}/{followerId}
  collectFollow (params) {
    return fetch({
      url: `/collect/follow/${params.operation}/${params.followerId}`
    })
  }
}
