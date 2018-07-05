<template>
  <m-body>
    <m-header slot="mHeader" />
    <div class="member" slot="mBody">
      <nuxt-child />
    </div>
  </m-body>
</template>

<script>
  import { VuecookieGet } from 'utils/cookie'
  import MHeader from './components/MHeader'
  import MBody from './components/MBody'
  import {Message} from '@element-ui'
  export default {
    layout: 'blank',
    components: {
      MHeader,
      MBody
    },
    data () {
      return {
      }
    },
    created () {
      let token = VuecookieGet('htxk_token')
      if (token && token.length > 10) {
        Message({
          message: '您已经登录',
          type: 'error',
          duration: 2 * 1000
        })
        this.$router.push('/')
      }
    }
  }
</script>

<style  lang="scss">
  
  .signup{
      width: 800px;
      padding: 80px 226px 50px;
      background: #fff;
      margin: 100px auto 100px;
      box-sizing:border-box;
      .rdm-code{
          text-align: right
      }
      .el-button--primary{
          margin-bottom:15px;
      }
      .tips {
          color: $color-warning;
          font-size: 12px;
          margin-bottom: 15px;
      }
      .icon {
          width: 14px;
          height: 14px;
          display: inline-block;
          background-size: contain;
          background-position: left center;
          &.icon-xs {
              width: 40px;
              height: 40px;
          }
      }
      .lbl {
          color: $color-black-base;
          margin-bottom: 10px;
          display: block;
      }
      .regex {
          font-size: 12px;
          position: absolute;
          color: $color-sub;
          width: 120%;
          top: 41px;
      }
      .agreement {
          font-size: 12px;
          color: $color-sub;
      }
      .pwd {
          margin-bottom: 30px;
      }
      .title {
          font-size: 30px;
          line-height: 32px;
          padding-left: 44px;
          text-align: center;
          width: 100%;
      }
      .full-width {
          width: 100%;
          &.sure-btn {
              margin-top: 30px;
          }
      }
  }
  .have-accout {
      text-align: center;
      margin-top: 70px;
      color: $color-sub;
  }
  .jump_btn{
    text-align: center;
  }
  .is-disabled{
    color: #ccc;
  }
  .cbx {
      margin-right: 5px;
  }

  .main-color {
      color: $color-primary;
  }

  .have-accout {
      text-align: center;
      margin-top: 70px;
      color: $color-sub;
  }
  .popover {
      padding: 7px 10px;
      text-align: center;
      position: absolute;
      top: 30px;
      right: -58px;
      z-index: 1060;
      width: 340px;
      max-width: 350px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.42857143;
      white-space: normal;
      background-color: #fff9ef;
      background-clip: padding-box;
      border: 1px solid #f1e784;
      border-radius: 3px;
      color: $color-warning;
      & > .arrow {
          border-width: 11px;
          &:after {
              content: "";
              border-width: 10px;
          }
      }
      &.bottom {
          & > .arrow {
              top: -11px;
              left: 10%;
              margin-left: -11px;
              border-top-width: 0;
              border-bottom-color: #f1e784;
              &:after {
                  top: 1px;
                  margin-left: -10px;
                  content: " ";
                  border-top-width: 0;
                  border-bottom-color: #fff;
              }
          }
      }
  }

  .popover > .arrow, .popover > .arrow:after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
  }
  .full-width .el-input__inner{
    display:block;
  }
</style>
