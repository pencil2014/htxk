<template>
  <header>
    <div class="wrapper">
      <cellbox class="middle" middle>
        <cell-item>
          <nuxt-link to="/"><img class="logo" src="~static/images/logo.png" width="100%" alt=""></nuxt-link>
        </cell-item>
        <cell-item>
          <a :href="publish()" class="link">
            <i class="iconfont icon-houtaiguanli"></i>
            <span class="org-manage">服务商后台</span>
          </a>
        </cell-item>
        <cell-item class="site-nav">
          <el-dropdown @command="userEdit">
            <div class="el-dropdown-trigger">
              <img :src="user.iconUrl || defaultHead" class="user-photo">
              <span class="el-dropdown-trigger-text">
              {{user.nickName}}
              </span>
              <i class="iconfont">&#xe617;</i>
            </div>
            <el-dropdown-menu slot="dropdown" class="site-nav-dropdown-menu">
              <el-dropdown-item class="exit" command="userexit">
                <i class="iconfont">&#xe612;</i>退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </cell-item>
      </cellbox>
    </div>
  </header>
</template>
<script type="text/javascript">
  import defaultHead from 'static/images/default_photo.jpg'
  import { mapState } from 'vuex'
  import { VuecookieGet } from 'utils/cookie'
  import { getDomain } from 'utils/index'
  import userApi from 'api/user'
  export default{
    props: {
      layout: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        defaultHead
      }
    },
    computed: {
      baseUrl () {
        if (process.browser) {
          let url = location.host
          url = getDomain(url)
          return 'http://org.' + url
        } else {
          return 'http://org.oooseed.com/'
        }
      },
      ...mapState({
        user: state => state.user.session
      })
    },
    methods: {
      userEdit (command) {
        if (command === 'userexit') {
          this.$confirm('确定退出登录, 是否继续?', '温馨提示', {
            type: 'warning'
          }).then(() => {
            // window.location.href = '/common/logout'
            userApi.logout().then((res) => {
              this.$store.commit('user/RESET_INFO')
            })
          })
          // window.location.href = '/common/logout'
        }
      },
      login () {
        let url = location.href
        sessionStorage.setItem('historyUrl', url)
        location.href = '/member/login'
        // this.$router.push({path: '/member/login'})
      },
      publish () {
        if (!this.user) {
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
    },
    mounted () {
      // 初版用户信息通过每次接口请求（后期登录要重构）
      if (process.browser && !Object.keys(this.user).length) {
        VuecookieGet('htxk_token', window.document.cookie) && this.$store.dispatch('user/getUserInfo')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~styles/var.scss';
  .site-nav-dropdown-menu{
    width:140px;
    background:#fff;
    .iconfont{
      margin-right:10px;
    }
  }
  .icon-houtaiguanli{
    font-size:23px;
    vertical-align:middle;
  }
  .org-manage{
    vertical-align:middle;
    padding-left:10px;
  }
  header{
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

    .site-nav{
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
          vertical-align: middle;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top:-2px;
          margin-right:5px;
          margin-left:5px;
        }
      }
      .user-photo{
        width:40px;
        height:40px;
        border-radius:50%;
      }
    }
    .middle{
      height: 90px;
      .cell-item:first-child{
        width:70%;
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
          border:2px solid $primary-color;
          box-sizing:border-box;
          font-size:16px;
          padding:10px;
        }
      }
    }
  }
</style>