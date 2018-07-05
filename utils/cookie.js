import { getDomain } from 'utils/index'
export function VuecookieSet (name, value, days) {
  if (process.browser) {
    let d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    let url = window.location.hostname
    url = getDomain(url)
    // url = 'oooseed.com'
    window.document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString() + ';domain=' + url
  }
}

export function VuecookieGet (name, cookies) {
  if (process.browser) {
    cookies = window.document.cookie
  }
  let v = cookies && cookies.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}
export function VuecookieDelete (name) {
  VuecookieSet(name, '', -1)
}
