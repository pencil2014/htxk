import fetch from 'utils/fetch'

export default {
  // 获取优惠券列表
  couponList (params) {
    return fetch({
      url: '/manage/goods/coupon/myList',
      params
    })
  },
  // 优惠券兑换
  exchangeCoupon (params) {
    return fetch({
      url: '/manage/goods/coupon/exchangeCoupon',
      params
    })
  },
  // 上传图像
  uploadCropper (data, options) {
    return fetch({
      url: '/manage/personal/update/iconData',
      method: 'POST',
      data,
      options
    })
  }
}
