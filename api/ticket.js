import fetch from 'fetch'
export default {
  // 提交票务人信息
  sendTicket (data, options) {
    return fetch({
      url: '/v1/ticket/insertTicketHolderInfo',
      method: 'post',
      data,
      options
    })
  },
  orderGoodsOrder (params) {
    return fetch({
      url: '/manage/order/getGoodsOrder',
      params
    })
  }
}
