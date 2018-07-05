import fetch from 'fetch'

export default {
  studentInfo (params) { // 获取报名自定义字段
    return fetch({
      url: '/v1/user/train/sign/getForm',
      params
    })
  },
  studentSignUp (data, options) {
    return fetch({
      url: '/v1/user/train/sign/add',
      method: 'POST',
      data,
      options
    })
  },
  getCourseInfo (params) {
    return fetch({
      url: '/v1/user/train/serviceCard/courseByGoodsCode',
      params
    })
  },
  createServiceCard (data, options) { // 生产培训服务卡
    return fetch({
      url: '/v1/user/train/serviceCard/grantServiceCard',
      method: 'POST',
      options,
      data
    })
  },
  createdOrder (data, options) { // 创建订单
    return fetch({
      url: '/v1/user/train/serviceCard/orderInfo',
      method: 'POST',
      options,
      data
    })
  },
  queryCardInfo (params) { // 查询培训服务卡信息
    return fetch({
      url: '/v1/user/train/serviceCard/detail',
      params
    })
  }
}
