import axios from 'axios'
import {Message} from '@element-ui'
import codeMessage from 'utils/codeMessage'
import tools from 'utils/tools'
import { VuecookieSet } from 'utils/cookie'

let _fetch = axios.create({})
let cacheData = {} // 缓存数据存储对象
let fetchCount = 0 // 接口请求数统计

// Add a request interceptor
_fetch.interceptors.request.use(function (config) {
  config.withCredentials = true
  // cookie和域名传递 start
  let headers = {}
  let targetHeader = {}
  let tookenHeaders = {}
  if (!process.browser) {
    if (config.context && config.context.req && config.context.req.headers) {
      if (config.context.route.query._s) { // s参数表示是否SSR
        config.context.store.state.ssr = true
      } else {
        config.context.store.commit('SSR', config.context.req.headers['user-agent'])
      }
      if (config.context.req.headers.cookie) {
        let cookies = config.context.req.headers.cookie
        headers['cookies'] = config.context.req.headers.cookie
        tookenHeaders = tools.getHeaders(cookies)
        // console.log(tookenHeaders)
      }
    }
  } else {
    // 激光条
    if (/^get$/i.test(config.method)) {
      if (fetchCount === 0) { // 激光条停留
        if (window.$nuxt) {
          window.$nuxt.$store.commit('LOADING', true)
        }
      }
      fetchCount++
    }
    // 设置cookie
    let cookies = window.document.cookie
    tookenHeaders = tools.getHeaders(cookies)
    // console.log(tookenHeaders)
  }
  Object.assign(targetHeader, tookenHeaders, headers)
  config.headers = targetHeader
  config.headers['x-SNS-nuxt'] = 'true'
  // console.log(config.headers)
  // 修改baseURL
  if (!process.browser) {
    let protocol = process.env.protocol
    if (config.context && config.context.req && config.context.req.headers && config.context.req.headers.host) {
      config.url = `${protocol}//${config.context.req.headers.host}/api` + config.url
    }
  } else {
    config.url = `${location.protocol}//${location.host}/api` + config.url
  }
  // 增加随机数，解决IE9缓存问题
  if (process.browser) {
    let userAgent = navigator.userAgent
    if (userAgent.indexOf && userAgent.indexOf('Trident') > -1) {
      config.params = Object.assign({_: new Date().getTime()}, config.params)
    }
  }
  function getFormData (codeKey, key, value) {
    let fromData = ''
    for (let i = 0; i < value.length; i++) {
      for (let skey in value[i]) {
        if (value[i][skey] && value[i][skey].length !== 0) {
          if (Array.isArray(value[i][skey])) {
            let newArr = value[i][skey]
            for (let ai = 0; ai < newArr.length; ai++) {
              for (let akey in newArr[ai]) {
                fromData += codeKey + '[' + i + '].' + skey + '[' + ai + '].' + encodeURIComponent(akey) + '=' + encodeURIComponent(newArr[ai][akey]) + '&'
              }
            }
          } else {
            fromData += codeKey + '[' + i + '].' + encodeURIComponent(skey) + '=' + encodeURIComponent(value[i][skey]) + '&'
          }
        }
      }
    }
    return fromData
  }
  // cookie和域名传递 end
  // Do something before request is sent
  // context default action
  if (/^(post)|(put)|(delete)$/i.test(config.method)) { // 处理POST请求默认行为
    if (typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.transformRequest = [function (data) {
        let ret = ''
        for (let key in data) {
          if (Array.isArray(data[key])) {
            if (/(\[|\])/g.exec(JSON.stringify(data[key])).length === 2 && (data[key] + '').indexOf('object') === -1) {
              ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
            } else {
              ret += getFormData(key, key, data[key])
            }
          } else {
            ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
          }
        }
        return ret
      }]
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    // console.log('context', config.context)
    if (process.browser && config.options && config.options.context) {
      if (config.options.context._isVue) { // context为vue对象则修改loading状态
        config.options.context.loading = true
        config.options.successMsg = config.options.successMsg || '提交成功'
        config.options.errorMsg = config.options.errorMsg || '提交失败'
      } else if (config.options.context.nodeType === 1) { // context为dom对象则修改disabled状态
        if (config.options.context.parentNode.disabled !== undefined) {
          config.options.context = config.options.context.parentNode
        }
        config.options.context.disabled = true
        config.options.successMsg = config.options.successMsg || '操作成功'
        config.options.errorMsg = config.options.errorMsg || '操作失败'
      }
    }
  }
  return config
})

// Add a response interceptor
_fetch.interceptors.response.use(function (res) {
  // context default action
  if (process.browser) {
    if (/^(post)|(put)|(delete)$/i.test(res.config.method)) {
      // console.log('res.context', res.config.context)
      if (res.config.options && res.config.options.context) { // 是否传上下文
        if (res.config.options.context._isVue) { // context为vue对象时则修改loading状态
          res.config.options.context.loading = false
          res.config.options.context = null
        } else if (res.config.options.context.nodeType === 1) { //  context为元素对象时则修改disabled状态
          res.config.options.context.disabled = false
        }
      }
    } else {
      // 更新激光条
      if (fetchCount === 1) { // 结束激光条加载状态
        if (window.$nuxt) {
          window.$nuxt.$store.commit('LOADING', false)
        }
      }
      fetchCount = fetchCount > 0 ? fetchCount - 1 : 0
    }
  }
  if (res.data.result === '0') { // 成功后返回数据
    // context default action
    if (process.browser) {
      if (/^(post)|(put)|(delete)$/i.test(res.config.method)) {
        if ((res.config.options || {}).successMsg !== 'none') { // successMsg为'none'时不提示弹框
          Message({
            message: res.config.options && res.config.options.successMsg ? res.config.options.successMsg : '提交成功',
            type: 'success',
            duration: 2 * 1000
          })
        }
      }
    }
    // 数据存储在缓存中'
    // console.log(res.config.url)
    if (!process.browser && res.config.cacheTime && res.config.url && res.config.url.split) {
      let array = res.config.url.split('/api')
      if (array[1]) {
        cacheData[array[1]] = {data: res.data, timestamp: Date.now()}
      }
    }
    delete res.config.context
    return res.data
  } else {
    if (process.browser) {
      // 特定code🐴直接返回登录
      if (['2001', '22', '2103', '2125', '2102'].indexOf(res.data.result) > -1) { // 未登录，签名错误
        // URL过滤（部分url不需要跳转到登录页）
        let urls = ['/api/manage/personal/getUserInfo', '/api/message/message/count']
        let origin = location.origin || location.protocol + '//' + location.host
        window.$nuxt.$store.commit('user/RESET_INFO')
        if (urls.indexOf(res.config.url.replace(origin, '')) === -1) {
          Message({
            message: '未登录，请登录',
            type: 'error',
            duration: 2 * 1000,
            onClose () {
              // sessionStorage.setItem('historyUrl', location.href)
              VuecookieSet('historyUrl', location.href, 1)
              location.href = '/member/login'
            }
          })
        } else {
          return {}
        }
      } else if (res.headers['content-type'] && res.headers['content-type'].indexOf && res.headers['content-type'].indexOf('/json') > -1) {
        // 弹出错误信息
        if ((res.config.options || {}).errorMsg !== 'none' && res.data) { // errorMsg为'none'时不提示弹框
          Message({
            message: res.data.msg || codeMessage[res.data.result] || res.config.options.errorMsg,
            type: 'error',
            duration: 2 * 1000
          })
        }
      }
    }
    if (!process.browser && res.config.context && res.config.context.redirect && !res.config.context.isDev) {
      console.log('data', res.data)
      return {}
      // res.config.context.redirect('/error', {url: res.config.url, data: res.data})
    }
    delete res.config.context
    return Promise.reject(res.data)
  }
}, function (error) {
  // Do something with response error
  console.log('error', error)
  if (!process.browser && error.config && error.config.context && error.config.context.isDev) { // 开发环境跳转错误页
    error.config.context.redirect('/error', {url: error.config.url, status: error.response.status, data: error.response.data})
  } else {
    if (fetchCount === 1) { // 结束激光条加载状态
      if (window.$nuxt) {
        window.$nuxt.$store.commit('LOADING', false)
      }
    }
    fetchCount = fetchCount > 0 ? fetchCount - 1 : 0
  }
  delete error.config.context
  return Promise.reject(error)
})

let fetch = (...arg) => {
  let cfg = arg[0]
  if (!process.browser && cfg && cfg.cacheTime && cfg.url && typeof cfg.cacheTime === 'number') {
    if (cfg.context && cfg.context.isDev && cfg.cacheTime) { // 开发环境设置时间统一为1秒便于调试接口
      cfg.cacheTime = 1000
    }
    let cacheItem = cacheData[cfg.url]
    if (cacheItem && cacheItem.timestamp) {
      let now = Date.now()
      // console.log(Math.floor(now / cfg.cacheTime), Math.floor(cacheItem.timestamp / cfg.cacheTime))
      if (Math.floor(now / cfg.cacheTime) === Math.floor(cacheItem.timestamp / cfg.cacheTime)) { // 是否超出缓存期
        return Promise.resolve(cacheItem.data)
      } else {
        return _fetch(...arg)
      }
    } else {
      return _fetch(...arg)
    }
  } else {
    return _fetch(...arg)
  }
}

export default fetch
