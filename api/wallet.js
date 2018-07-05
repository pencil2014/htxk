import fetch from 'fetch'
export default {
  // 钱包列表
  getWalletList (params) {
    return fetch({
      url: '/manage/wallet/walletDetail',
      params: params
    })
  },
  getWalletInfo (params) {
    return fetch({
      url: '/manage/wallet/walletInfo',
      params: params
    })
  },
  // ************ 校验图片验证码 - 支付密码 ***************
  checkImgCode (params) {
    return fetch({
      url: '/account/validate/checkPictureValidateCode',
      params
    })
  },
  // 获取手机验证码 - 支付密码
  getTelCode (params) {
    return fetch({
      url: '/manage/wallet/sendSmsCodeToBindedPhone',
      params
    })
  },
  // 手机验证码校验 - 支付密码
  validateCode (params) {
    return fetch({
      url: '/manage/wallet/validateSmsCodeForBindedPhone',
      params
    })
  },
  // 密码验证提交 -支付密码
  submitKeyForm (params) {
    return fetch({
      url: '/manage/wallet/transPwd/set',
      method: 'PUT',
      params
    })
  },
  // *********** 获取银行信息 -默认银行卡 *******************
  getCardInfo (params) {
    return fetch({
      url: '/manage/wallet/bindPlatform/list',
      params
    })
  },
  // *********** 获取银行信息 - 绑定银行卡 *******************
  checkBankInfo (params) {
    return fetch({
      url: '/manage/wallet/bankInfo',
      params
    })
  },
  // 获取手机验证码 - 银行
  getPhoneCodeCard (params) {
    return fetch({
      url: '/manage/sms/guest/smsCode',
      params
    })
  },
  // 手机验证码校准 - 银行
  validateCodeCard (params) {
    return fetch({
      url: '/manage/sms/_guest/validateSmsCode',
      params
    })
  },
  // 预绑定银行卡卡号，提交卡信息 - 银行
  preBindCard (params, options) {
    return fetch({
      url: '/manage/wallet/withdrawBankCard/preBind',
      method: 'POST',
      params,
      options
    })
  },
  // 绑定银行卡卡号，提交卡信息 - 银行
  addBindCard (params) {
    return fetch({
      url: '/manage/wallet/withdrawBankCard/bindAndVeriry',
      method: 'POST',
      params
    })
  },
  // 获取银行卡信息 - 提现
  getBandInfo (params) {
    return fetch({
      url: '/manage/wallet/toWithdraw',
      params
    })
  },
  // 密码开启, 提现窗口
  payPwd (params) {
    return fetch({
      url: '/manage/wallet/walletInfo',
      params
    })
  },
  // 支付密码提交 - 提现
  cashSubmit (params) {
    return fetch({
      url: '/manage/wallet/withdraw',
      method: 'POST',
      params
    })
  },
  // 支付密码提交 - 提现
  unbindSubmit (params) {
    return fetch({
      url: '/manage/wallet/bindPlatform/unbind',
      method: 'DELETE',
      params
    })
  }
}
