import fetch from 'utils/fetch'
export default {
  // 获取退款原因
  getReasonList (params) {
    return fetch({
      url: '/refund/refundReasonList',
      params,
      options: {errorMsg: 'none'}
    })
  },
  // 读取申请退款信息
  getRefundsInfo (params) {
    return fetch({
      url: '/refund/toApply',
      params,
      options: {errorMsg: 'none'}
    })
  },
  // 提交退款信息
  saveRefundsInfo (params) {
    return fetch({
      url: '/refund/create',
      params,
      options: {successMsg: 'none'},
      method: 'POST'
    })
  },
  // 退款列表
  refundsList (params) {
    return fetch({
      url: '/refund/list',
      params,
      options: {errorMsg: 'none'}
    })
  },
  // 退款详情
  refundsDetail (params) {
    return fetch({
      url: '/refund/detail',
      params,
      options: {errorMsg: 'none'}
    })
  }
}
