import api from 'api/attestation'
// import idcard from 'static/images/attestation/idcard.png'
let state = {
  user_form: {
    personName: '', // 个人认证时为真实姓名
    phone: '', // 手机号
    idNo: '', // 身份证号
    ipCateId: '', // ip认证分类id
    idcardUrl: '', // 身份证图片url
    ortherUrl: '', // 其他图片url
    ipCateIdArray: [{}]
  },
  org_form: {
    idType: 2, // 证件类型
    credentialNo: '', // 证件号
    companyName: '', // 组织名称/公司名称
    legalPersonName: '', // 法人姓名
    authCateId: '', // 组织认证分类
    orgCertificateUrl: '', // 组织机构代码证
    businessLicenseUrl: '', // 公司营业执照副本地址
    otherInfoUrl: '', // 其他证明资料
    personName: '', // 运营者姓名
    phone: '', // 运营者手机号
    nameAuthStatus: '' // 是否实名认证 0：未认证 1：已认证 ,  1:已实名认证，不能修改数据
  }
}
// getters
const getters = {
  user_form: state => state.user_form,
  org_form: state => state.org_form
}
const actions = {
  get_user_detail ({commit, state}, params = {}) {
    api.editDetail('', {context: this, successMsg: 'none'})
      .then((json) => {
        if (json && json.data) {
          json.data.personName = params.personName || json.data.personName
          json.data.idNo = params.idNo || json.data.idNo
          commit('USER_INFO', json)
        }
      })
      .catch(() => {})
  },
  get_org_detail ({commit, state}, params = {}) {
    api.getUserOrgDetail({purpose: 1}, {context: this, successMsg: 'none'})
      .then((json) => {
        json.data.idType = params.idType || json.data.idType
        json.data.credentialNo = params.credentialNo || json.data.credentialNo
        json.data.companyName = params.companyName || json.data.companyName
        json.data.legalPersonName = params.legalPersonName || json.data.legalPersonName
        commit('ORG_INFO', json)
      })
      .catch(() => {})
  }
}
const mutations = {
  SET_ORG_FORM (state) { // 重置/清空formdata表单，点击添加和添加操作里面的提交审核里面所需要
    let obj = {
      idType: 2, // 证件类型
      credentialNo: '', // 证件号
      companyName: '', // 组织名称/公司名称
      legalPersonName: '', // 法人姓名
      authCateId: '', // 组织认证分类
      orgCertificateUrl: '', // 组织机构代码证
      businessLicenseUrl: '', // 公司营业执照副本地址
      otherInfoUrl: '', // 其他证明资料
      personName: '', // 运营者姓名
      phone: '' // 运营者手机号
    }
    let objdata = Object.assign({}, obj)
    state.org_form = objdata
  },
  SET_USER_FORM (state) { // 重置/清空formdata表单，点击添加和添加操作里面的提交审核里面所需要
    let obj = {
      personName: '', // 个人认证时为真实姓名
      phone: '', // 手机号
      idNo: '', // 身份证号
      ipCateId: '', // ip认证分类id
      idcardUrl: '', // 身份证图片url
      ortherUrl: '', // 其他图片url
      ipCateIdArray: [1]
    }
    let objdata = Object.assign({}, obj)
    state.user_form = objdata
  },
  SET_ORG_COOKIES (state, type) {
    let formdata = Object.assign({}, state.org_form)
    if (type) {
      sessionStorage.org_form = JSON.stringify(formdata) // 将对象转换成字符串存入到sessionStorang
      console.log(formdata, '设置')
    } else {
      let obj = JSON.parse(sessionStorage.org_form) // 读取到的sessionStorang字符串转换成对象
      state.org_form = obj
      console.log(state.org_form, '取')
    }
  },
  ORG_INFO (state, { data }) {
    // state.org_form = json.data
    for (var attr in state.org_form) { // 将返回来的数据做跟我的form里面的数据要一一对应进来，只拿form所需要的数据
      state.org_form[attr] = data[attr]
    }
    if (!state.org_form.idType) {
      state.org_form.idType = 2
    }
    // console.log(state.org_form, '2修改查询资料')
  },
  USER_INFO (state, { data }) {
    console.log(123123123, data)
    if (data.authName) {
      for (var attr in state.user_form) { // 将返回来的数据做跟我的form里面的数据要一一对应进来，只拿form所需要的数据
        state.user_form[attr] = data[attr]
      }
      if (data.dataList[0].dataType === 2) {
        state.user_form.idcardUrl = data.dataList[0].filePath
      } else {
        state.user_form.ortherUrl = data.dataList[0].filePath
      }
      if (data.dataList[1]) {
        if (data.dataList[1].dataType === 2) {
          state.user_form.idcardUrl = data.dataList[1].filePath
        } else {
          state.user_form.ortherUrl = data.dataList[1].filePath
        }
      }
    }
    console.log(state.user_form, '2修改查询资料')
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
