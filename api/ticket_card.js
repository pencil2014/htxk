import fetch from 'utils/fetch'

export default {
  // 查看商品详情
  goodsDetail (params) {
    return fetch({
      url: '/v1/ticket/getDetail',
      params,
      options: { errorMsg: 'none' }
    })
  },
  // 查看sku详情
  skuDetail (params) {
    return fetch({
      url: '/v1/ticket/getSkuDetail',
      params,
      options: { errorMsg: 'none' }
    })
  },
  // 下单
  createOrder (data, options) {
    return fetch({
      url: '/v1/ticket/createOrder',
      method: 'POST',
      data,
      options: { errorMsg: 'none', successMsg: 'none' }
    })
  },
  // 查看取票人信息
  ticketHolderInfo (data, options) {
    return fetch({
      url: '/v1/ticket/getTicketHolderInfo',
      method: 'POST',
      data,
      options: { errorMsg: 'none', successMsg: 'none' }
    })
  },
  // 获取快递信息
  logisticsInfo (params) {
    return fetch({
      url: '/manage/order/goodsOrder/logisticsInfo',
      params,
      options: { errorMsg: 'none' }
    })
  },
  // 服务卡详情接口
  cardDetail (params) {
    return fetch({
      url: '/v1/ticket/getCardDetail',
      params,
      options: { errorMsg: 'none' }
    })
  },
  // 商品收藏
  goodsCollectConfirm (params) {
    return fetch({
      url: '/manage/user/userFavorite',
      params,
      method: 'POST',
      options: { successMsg: '收藏成功' }
    })
  },
  // 取消收藏
  delGoodsCollect (params) {
    return fetch({
      url: '/manage/user/userFavorite',
      params,
      method: 'DELETE',
      options: { successMsg: '已取消收藏' }
    })
  },
  // 获取可领取优惠券
  couponList (params) {
    return fetch({
      url: '/goods/coupon/canReceiveList',
      params
    })
  },
  // 领取优惠券
  couponReceive (data, options) {
    return fetch({
      url: '/manage/goods/coupon/receive',
      method: 'POST',
      data,
      options
    })
  },
  // 获取订单详情
  orderDetail (params) {
    return fetch({
      url: '/v1/ticket/user/getOrderDetail',
      params
    })
  }
}
