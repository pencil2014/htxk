import fetch from 'utils/fetch'

export default {
  // 查看商品是否是组织赛事
  goodsToConfirm (params) {
    return fetch({
      url: '/manage/order/goodsOrder/toConfirm',
      params,
      options: {errorMsg: 'none'}
    })
  },
  // 商品收藏
  goodsCollectConfirm (params) {
    return fetch({
      url: '/manage/user/userFavorite',
      params,
      method: 'POST',
      options: {successMsg: '收藏成功'}
    })
  },
  // 取消收藏
  delGoodsCollect (params) {
    return fetch({
      url: '/manage/user/userFavorite',
      params,
      method: 'DELETE',
      options: {successMsg: '已取消收藏'}
    })
  },
  // 商品收藏，接口待修改
  goodsDetailsData (params) {
    return fetch({
      url: '/goods/detail',
      params,
      options: {errorMsg: 'none'}
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
  }
}
