import sha1 from 'js-sha1'
import { VuecookieGet } from 'utils/cookie'

export default { // 工具类
  getHeaders (cookies) {
    // if (process.browser) {
    let timestamp = new Date().getTime()
    let userId = VuecookieGet('htxk_userId', cookies)
    let token = VuecookieGet('htxk_token', cookies)
    let signature = sha1(userId + token + timestamp.toString())
    if (userId === null) {
      return
    }
    return {
      'X-SNS-UserId': userId,
      'X-SNS-Timestamp': timestamp,
      'X-SNS-Signature': signature,
      'X-SNS-ClientType': 1
    }
    // }
  }
}
