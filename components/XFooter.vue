<template>
  <footer :class="login ? 'user-footer' : ''">
    <div class="wrapper">
      <p>
        <span class="link-title">
          <nuxt-link to="/about">关于我们</nuxt-link>
        </span>
        <span class="dot"> | </span>
        <span class="link-title">
          <nuxt-link to="/helpers">帮助中心</nuxt-link>
        </span>
        <span class="dot"> | </span>
        <span class="link-title">
          <nuxt-link to="/law">相关法律</nuxt-link>
        </span>
        <span class="dot"> | </span>
        <span class="link-title">
          <nuxt-link to="/friendlylink/">友情链接</nuxt-link>
        </span>
      </p>
      <p class="address">
      ICP主体备案号:<a class="gray" href="http://www.miitbeian.gov.cn" target="_blank">
        <span v-if="isFeed">琼ICP备18000046号</span>
        <span v-else>粤ICP备17021615号</span>
      </a>&nbsp;&nbsp;增值电信业务许可证:粤B2-20160345
      </p>
      <p class="address copyright">
        互联网文化经营许可证:
        <nuxt-link to="/about/certificate">粤网文[2016]1273-268号</nuxt-link>
        &nbsp;&nbsp;<a class="gray" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502000928" target="_blank"><img class="gov_icon" src="/images/gov_icon.png" width="20" alt="">粤公网安备 44030502000928号</a>
      </p>
      <p class="">Copyright©2017-2018 版权所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客服热线：0755-86338109</p>
    </div>
  </footer>
</template>
<script type="text/javascript">
  export default {
    props: {
      login: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isFeed () {
        if (process.browser) {
          if (location.href.indexOf('oooseed') > -1) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  }
</script>
<style lang="scss">
  footer{
    color:#fff;
    background:#272727;
    padding:20px 0;
    text-align:center;
    margin-top:40px;
    font-size:12px;
    &.user-footer{
      position:absolute;
      bottom:0;
      width:100%;
      background:transparent;
      color: #cdcdcd
    }
    .dot{
      margin:0px 10px;
      .address {
        color: #fff
      }
    }
  }
</style>
