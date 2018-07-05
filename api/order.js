import fetch from 'utils/fetch'

export default {
  // 请求确认订单中的地址列表
  orderAddr (params) {
    return fetch({
      url: '/manage/user/queryUserAddress',
      params
    })
  },
  // 提交订单 - post
  orderCreate (data, options) {
    return fetch({
      url: '/manage/order/goodsOrder/create',
      method: 'post',
      data,
      options
    })
  },
  // 获取订单 - get
  orderGoodsOrder (params) {
    return fetch({
      url: '/manage/order/getGoodsOrder',
      params
    })
  },
  // 请求支付接口 -get
  orderToPay (params) {
    return fetch({
      url: '/manage/user/toPay',
      params
    })
  },
  // 成功后不显示-successMsg = 'none'
  orderPay (data, options) {
    return fetch({
      url: '/manage/user/goodsOrder/pay',
      method: 'post',
      data,
      options: {options, successMsg: 'none'}
    })
  },
  // 下个页面初始化参数
  goodsTemplateInfo (params) {
    return fetch({
      url: '/v1/user/goods/goodsTemplateInfo',
      params
    })
  },
  // 请求支付状态
  getPayResult (params) {
    return fetch({
      url: '/manage/user/getPayResult',
      params
    })
  },
  // 可用优惠券接口 -get
  couponList (params) {
    return fetch({
      url: '/manage/goods/coupon/availableList',
      params
    })
  },
  // 兑换优惠券
  exchangeCoupon (params) {
    return fetch({
      url: '/manage/goods/coupon/exchangeCoupon',
      params
    })
  }
}
