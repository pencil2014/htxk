let popStateEvent = false
if (process.browser) {
  window.addEventListener('popstate', function () {
    popStateEvent = true
  })
}
export default function (context) {
  // If the user is not authenticated
  if (!context.store.state.authenticated) {
    // return redirect('/login')
  }
  if (process.client) {
    if (context.from.path === context.route.path) {
      popStateEvent = false
    } else {
      setTimeout(function () {
        popStateEvent = false
      }, 100)
    }
    context.popStateEvent = popStateEvent
  }
  if (process.server) {
    let host = context.req.headers.host
    let userAgent = context.req.headers['user-agent']
    if (host.indexOf && host.indexOf('www') !== -1) {
      let index = host.indexOf('.')
      host = host.slice(index)
    } else {
      host = '.' + host
    }

    if (/AppleWebKit.*Mobile/i.test(userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(userAgent))) {
      let mobileDetail = ''
      if (context.req && context.req.url && context.req.url.indexOf && context.req.url.indexOf('/share?') > -1) {
        mobileDetail = context.req.url
      }
      return context.redirect('http://m' + host + mobileDetail)
    }
  }
}
