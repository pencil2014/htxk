<template>
  <a target="_blank" :href="publish()">
    <slot v-if="$slots.handleIcon" name="handleIcon"></slot>
    {{handleText}}
  </a>
</template>
<script>
  import { getDomain } from 'utils/index'
  import { mapState } from 'vuex'
  export default {
    props: {
      handleText: {
        default: '我要发布',
        type: String
      }
    },
    computed: {
      baseUrl () {
        if (process.browser) {
          let url = location.host
          url = getDomain(url)
          if (location.host.indexOf('yu') > -1) {
            url = location.protocol + '//yuorg.' + url
          } else {
            url = location.protocol + '//org.' + url
          }
          return url
        } else {
          return process.env.protocol + '//org.oooseed.com/'
        }
      },
      ...mapState({
        user: state => state.user.session
      })
    },
    methods: {
      publish () {
        // console.log(this.user)
        if (this.user && this.user.authStatus === undefined) {
          return '/member/login'
          // this.$router.push({path: '/member/login'})
        } else if (this.user && this.user.authStatus === 0) { // 未认证
          // window.location.href = this.baseUrl
          return this.baseUrl
        } else if (this.user && this.user.authStatus === 1) { // 已认证
          // window.location.href = this.baseUrl
          return this.baseUrl
        }
      }
    }
  }
</script>