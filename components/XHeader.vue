<template>
  <header :class="headerBox">
    <div class="site-nav small"  v-if="layout.indexOf('small')>-1">
      <div class="wrapper">
        <e-cellbox middle>
          <e-cell-item>欢迎来到求苗体育服务平台</e-cell-item>
          <e-cell-item class="site-nav-sub" v-if="user && user.userId">
            <div class="site-nav-menu">
              <nuxt-link to="/manage/activity">我的活动</nuxt-link>
            </div>
            <div class="site-nav-menu">
              <nuxt-link to="/manage/order/">我的订单</nuxt-link>
            </div>
            <div class="site-nav-menu">
              <!-- <a :href="publish()">服务后台</a> -->
              <direct :handleText="'服务后台'" />
            </div>
            <div class="site-nav-menu">
              <a href="/manage/message">
                <i class="iconfont message">&#xe623;</i>
                消息
                <i class="num-msg" v-if="msgText.total">{{ msgText.total }}</i>
              </a>
            </div>
            <div class="site-nav-menu">
              <el-dropdown @command="userEdit">
                <div class="el-dropdown-trigger">
                  <!-- <img :src="user.iconUrl || defaultHead" :alt="user.nickName" class="user-photo"> -->
                  <span class="user-photo"><e-avatar :size='[20,20]' :src="user.iconUrl" :alt="user.nickName"  ></e-avatar></span>
                  <span class="el-dropdown-trigger-text">
                  {{user.nickName}}
                  </span>
                  <i class="iconfont">&#xe617;</i>
                </div>
                <el-dropdown-menu slot="dropdown" class="site-nav-dropdown-menu">
                  <el-dropdown-item class="exit">
                    <nuxt-link to="/manage/activity">
                      <i class="iconfont">&#xe619;</i>个人中心
                    </nuxt-link>
                  </el-dropdown-item>
                  <el-dropdown-item class="exit" command="userexit">
                    <i class="iconfont">&#xe612;</i>退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </e-cell-item>
          <e-cell-item class="site-nav-sub" v-else>
            <a @click="login" href="javascript:;">登录</a>
            <span class="space"></span>
            <span class="space"></span>
            <span class="space"></span>
            <nuxt-link to="/member/register">注册</nuxt-link>
          </e-cell-item>
        </e-cellbox>
      </div>
    </div>
    <div class="wrapper">
      <e-cellbox class="middle" middle>
        <e-cell-item>
          <nuxt-link to="/"><img class="logo" src="/images/logo.png" width="100%" alt="求苗体育"></nuxt-link>
          <nuxt-link class="community" to="/" v-if="layout.indexOf('bbsHead')>-1">
            <i class="dot">•</i>
            <span class="text">求苗社区</span>
          </nuxt-link>
        </e-cell-item>
        <e-cell-item v-if="layout.indexOf('search')>-1">
          <form class="search">
            <input/>
            <el-button type="primary">
              <i class="iconfont">&#xe648;</i>
            </el-button>
          </form>
        </e-cell-item>
        <e-cell-item class="manage-href" v-if="layout.indexOf('manage')>-1">
          <direct class="link" :handleText="'服务后台'">
            <i class="iconfont icon-houtaiguanli" slot="handleIcon"></i>
          </direct>
        </e-cell-item>
        <e-cell-item class="sub-title-box" v-if="layout.indexOf('sub')>-1">
          <ul>
            <li class="sub-title">
              <nuxt-link to="/">首页</nuxt-link>
            </li>
            <li class="sub-title">
              <nuxt-link to="/sharing">视讯内容</nuxt-link>
            </li>
            <li class="sub-title">
              <nuxt-link to="/community">体育社区</nuxt-link>
            </li>
            <li class="sub-title">
              <nuxt-link to="/download">下载App</nuxt-link>
            </li>
          </ul>
        </e-cell-item>
        <e-cell-item class="site-nav manage-user" v-if="layout.indexOf('userHead')>-1">
          <el-dropdown @command="userEdit" v-if="user && user.userId">
            <div class="el-dropdown-trigger">
              <nuxt-link to="/manage/activity">
                <!-- <img :src="user.iconUrl || defaultHead" :alt="user.nickName" class="user-photo"> -->
                <span class="manage-photo"><e-avatar :size='[40,40]' :src="user.iconUrl" :alt="user.nickName"></e-avatar></span>
                <span class="el-dropdown-trigger-text">
                {{user.nickName}}
                </span>
              </nuxt-link>
              <i class="iconfont">&#xe617;</i>
            </div>
            <el-dropdown-menu slot="dropdown" class="site-nav-dropdown-menu">
              <el-dropdown-item class="exit" command="userexit">
                <i class="iconfont">&#xe612;</i>退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </e-cell-item>
      </e-cellbox>
    </div>
    <x-nav v-if="layout.indexOf('nav')>-1"/>
    <el-dialog title="登录" custom-class="login-dialog" :visible.sync="$store.state.loginDialog" >
      <x-login :dialog="true" @handleClose="handleClose" />
    </el-dialog>
  </header>
</template>
<script type="text/javascript">
  import { mapState } from 'vuex'
  import { VuecookieGet, VuecookieSet } from 'utils/cookie'
  import systemApi from 'api/system'
  import userApi from 'api/user'
  import Vue from 'vue'
  import Direct from './Direct'
  export default{
    components: {
      Direct
    },
    props: {
      layout: {
        type: Array,
        default () {
          return ['small']
        }
      },
      headerBox: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        msgText: {
          total: ''
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.session
      })
    },
    methods: {
      handleClose () {
        this.$set(this.$store.state, 'loginDialog', false)
      },
      getMessageData () {
        systemApi.getCountData(this.query).then((res) => {
          this.msgText = res.data
        })
      },
      userEdit (command) {
        if (command === 'userexit') {
          this.$confirm('确定退出登录, 是否继续?', '温馨提示', {
            type: 'warning'
          }).then(() => {
            // window.location.href = '/common/logout'
            userApi.logout().then((res) => {
              this.$store.commit('user/RESET_INFO')
              if (this.layout.indexOf('manage') > -1) {
                this.$router.push('/')
              } else {
                // window.location.href = window.location.href
              }
            })
          })
          // window.location.href = '/common/logout'
        }
      },
      login () {
        if (this.layout.indexOf('nav') > -1) {
          let url = location.href
          VuecookieSet('historyUrl', url)
          // location.href = '/member/login'
          this.$router.push({path: '/member/login'})
        } else {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          // let xlogin = require('@/pages/member/components/XLogin')
          // console.log(xlogin)
          // this.$options.components.XLogin = xlogin
          this.$set(this.$store.state, 'loginDialog', true)
        }
      }
    },
    mounted () {
      if (process.browser) {
        let tooken = VuecookieGet('htxk_token', window.document.cookie)
        if (tooken && tooken.length > 10) {
          if ((this.$store.state.user.session.userId || '').length < 5) {
            // 用户信息补漏，以防中间层用户登录信息获取失败
            this.$store.dispatch('user/getUserInfo')
            this.$store.dispatch('index/getRecommendUser')
          }
          this.getMessageData()
        } else {
          if (this.layout.indexOf('manage') > -1) {
            this.$router.push('/')
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .site-nav-dropdown-menu{
    width:140px;
    background:#fff;
    .iconfont{
      margin-right:10px;
    }
    a {
      display: block;
    }
  }
  header{
    &.manage-head{
      .middle{
        height:90px;
      }
    }
    .community{
      .dot{
        padding: 0 30px;
        font-size: 30px;
        font-style: normal;
      }
      .text{
        font-size:24px;
      }
    }
    background:#fff;
    &:after{
      display:block;
      content:'';
      height:4px;
      background: #15a9da; /* Old browsers */
      background: -moz-linear-gradient(left, #15a9da 1%, #48c347 27%, #0fa6ea 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(left, #15a9da 1%,#48c347 27%,#0fa6ea 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to right, #15a9da 1%,#48c347 27%,#0fa6ea 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#15a9da', endColorstr='#0fa6ea',GradientType=1 ); /* IE6-9 */
    }
     .num-msg{
      padding: 0 5px;
      border-radius:10px;
      display:inline-block;
      background:red;
      height:18px; 
      line-height:18px;
      color:#fff;
      font-style:normal;
      vertical-align:top;
      margin-left: 5px;
      margin-top: 6px;
      font-size:12px;
    }
    .site-nav{
      line-height: 30px;
      background: $color-background-base;
      height: 30px;
      border-bottom: 1px solid $border-color-base;
      &-sub{
        text-align:right;
      }
      &-menu{
        display:inline-block;
        padding:0 15px;
        i.message{
          padding:0 5px;
          float: left;
        }
      }
      .el-dropdown-trigger{
        line-height:30px;
        font-size:12px;
        cursor: pointer;
        .iconfont{
          font-size:12px;
        }
        &-text{
          display:inline-block;
          height:30px;
          max-width:180px;
          overflow:hidden;
          padding:0 5px;
          vertical-align: middle;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top:-2px;
          margin-right:5px;
          margin-left:5px;
          padding:0 5px;
        }
      }
      .user-photo{
        width:20px;
        height:20px;
        display:inline-block;
        vertical-align: middle;
        border-radius:50%;
        img{
          vertical-align: top;
          border-radius:50%;
        }
      }
      .manage-photo{
        width:40px;
        border-radius:50%;
        height:40px;
        display:inline-block;
        border: 2px solid $color-primary;
        img{
          border-radius:50%;
        }
      }
    }
    .middle{
      height: 120px;
      .cell-item:first-child{
        width:256px;
      }
      .logo{
        width:196px;
      }
      .search{
        .el-button{
          height:46px;
          border-radius:0;
        }
        input{
          width:515px;
          height:46px;
          background:#fff;
          border-radius:0;
          border:2px solid $color-primary;
          box-sizing:border-box;
          font-size:16px;
          padding:10px;
        }
      }
    }
    .icon-houtaiguanli{
      font-size:23px;
      vertical-align:middle;
      padding-right:10px;
    }
    .manage-href{
      width:60px;
    }
    .manage-user{
      width:120px;
      text-align:right;
      background:#fff;
      .user-photo{
        width:40px;
        height:40px;
        border-radius:50%;
        border:2px solid $color-primary;
      }
    }
  }
  .sub-title-box{
    ul li{
      float:left;
      padding:0 15px;
      font-size:16px;
      a{
        padding:0 10px;
        &:hover{
          color: $color-primary;
        }
      }
    }
  }
</style>
<style lang="scss">
  .el-dialog--small.login-dialog{
    width:410px;
    margin-bottom:0;
    top:50%!important;
    margin-top:-253px;
    .el-dialog__body{
      padding:30px 50px;
    }
  }
</style>
