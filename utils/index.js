/**
 * Created by jiachenpan on 16/11/18.
 */
// import tools from './tools'

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => { // eslint-disable-line
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str // eslint-disable-line
}

// 格式化时间
export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 获取查询字符串对象
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) { // eslint-disable-line
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param (json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj (url) {
  const search = url.split('?')[1]
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge (target, source) {
  /* Merges two  objects,
   giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo (element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick (picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

// 深拷贝
export function cloneObj (obj) {
  var str, newobj = obj.constructor === Array ? [] : {} // eslint-disable-line
  if (typeof obj !== 'object') {
    return
  } else if (window.JSON) {
    str = JSON.stringify(obj) // 系列化对象
    newobj = JSON.parse(str) // 还原
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

// 日期转时间戳
export function dateToTimestamp (date) {
  return Date.parse(new Date(date))
}

// 获取2个日期的天数差
export function getDateDiff (startDate, endDate) {
  var start = new Date(Date.parse(startDate.replace(/-/g, '/'))).getTime()
  var end = new Date(Date.parse(endDate.replace(/-/g, '/'))).getTime()
  var dates = (start - end) / (1000 * 60 * 60 * 24)
  return dates
}

export function downloadFile (url, fileName, success) {
  var xhr = new XMLHttpRequest()
  let orgId = localStorage.getItem('auth_orgId') || ''
  if (orgId) {
    url = url + '&authOrgId=' + orgId
  }
  xhr.open('GET', url, true)
  /*
  let headers = tools.getHeaders()
  for (let key in headers) {
    xhr.setRequestHeader(key, headers[key])
  }
  */
  xhr.responseType = 'blob'
  xhr.onload = function (event) {
    if (xhr.response.type === 'application/json') {
      success(xhr.response)
    } else {
      var blob = xhr.response
      var link = document.createElement('a')
      link.download = fileName
      link.href = window.URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  xhr.send()
}

export function addDate (date, days) {
  var d = new Date(date)
  d.setDate(d.getDate() + days)
  var m = d.getMonth() + 1
  return d.getFullYear() + '-' + m + '-' + d.getDate()
}

export function minuteDiff (time1, time2) {
  var t1 = new Date(2017, 1, 1, time1.getHours(), time1.getMinutes(), time1.getSeconds())
  var t2 = new Date(2017, 1, 1, time2.getHours(), time2.getMinutes(), time2.getSeconds())
  return (dateToTimestamp(t1) - dateToTimestamp(t2)) / (60 * 1000)
}

export function formatDate (val) {
  return new Date(val).format()
}

export function moneyFormat (m) {
  var test1 = m.toString()
  var format = test1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return format
}

export function formatCash (str) {
  return str.split('').reverse().reduce((prev, next, index) => {
    return ((index % 3) ? next : (next + ',')) + prev
  })
}
// 数组去重
export function filterArr (arr) {
  return [...new Set(arr)]
}

// 判断本周是当前月的第几周
export function getMonthWeek (a, b, c) {
  // a = d = 当前日期
  // b = 6 - w = 当前周的还有几天过完(不算今天)
  // a + b 的和在除以7 就是当天是当前月份的第几周
  let date = new Date(a, parseInt(b) - 1, c)
  let w = date.getDay()
  let d = date.getDate()
  return Math.ceil((d + 6 - w) / 7)
}
// iframe 下载文件
export function iframeDownload (file) {
  var iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = '/api/download/file?fileName=' + file.fileName + '&fileUrl=' + file.fileUrl
  document.body.appendChild(iframe)
  setTimeout(function () {
    this.remove()
  }.bind(iframe), 5000)
}
/*
 按某字段排序
 sortProperty:需要排序的字段
 */
export function sortByTime (list, sortProperty) {
  list.sort(function (a, b) {
    return a[sortProperty] - b[sortProperty]
  })
  return list
}
/*
 获取domain
 url:需要排序的字段
 */
export function getDomain (url) {
  if (url.indexOf('www') > -1) {
    url = url.slice((url.indexOf('.') + 1))
  } else if (url.indexOf('yu') > -1) {
    url = url.replace('yu.', '')
  }
  return url
}
/*
获取url内指定参数
 */
export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
