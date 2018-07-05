<template>
  <m-body>
    <m-header slot="mHeader" />
    <x-login slot="mBody" />
  </m-body>
</template>
<script>
  import userApi from 'api/user'
  import {Message} from '@element-ui'
  import MHeader from '../components/MHeader'
  import MBody from '../components/MBody'
  import XLogin from '../components/XLogin'
  export default {
    layout: 'blank',
    components: {
      MHeader,
      MBody,
      XLogin
    },
    mounted () {
      let url = location.href.split('member/auth/')
      let authUrl = localStorage.getItem('authUrl')
      console.log(authUrl)
      if (authUrl.indexOf('member/login') > -1) {
        authUrl = '/'
      }
      localStorage.removeItem('authUrl')
      let parameter = url[1].split('?')
      let type = parameter[0]
      let code = this.$route.query.code
      let state = this.$route.query.state
      let params = {code: code, state: state, type: type}
      if (state === '4') {
        if (location.host === 'www.htxk.com') {
          location.href = location.protocol + '//wx.hhlyty.com/redirection/third-login/weibo' + parameter[1] || '' // 测试环境
        } else if (location.host === 'yu.hhlyty.cn') {
          let baseUrl = (location.host.indexOf('yu') > -1) ? location.host.replace('yu', 'yum') : 'yum.' + location.host
          location.href = location.protocol + '//' + baseUrl + '/redirection/third-login/weibo' + parameter[1] || '' // 预发布
        } else {
          let baseUrl = (location.host.indexOf('www') > -1) ? location.host.replace('www', 'm') : 'm.' + location.host
          location.href = location.protocol + '//' + baseUrl + '/redirection/third-login/weibo' + parameter[1] || '' // 预发布
        }
        return false
      }
      if ('qqwechatsina'.indexOf(type) > -1) {
        userApi.getAuthInfo(params).then((res) => {
          let userInfo = res.data.userInfo
          this.$store.commit('user/SESSION', userInfo)
          this.$store.commit('user/SET_TOKEN', {
            userId: userInfo.userId,
            token: userInfo.token
          })
          Message({
            message: '登录成功，即将跳转到首页',
            type: 'success',
            duration: 2 * 1000,
            close () {
              location.href = authUrl
            }
          })
        })
      } else {
        console.log('违法操作')
      }
    }
  }
</script>