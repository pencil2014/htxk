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
              <nuxt-link to="/manage/order">我的订单</nuxt-link>
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
                  <img :src="user.iconUrl || defaultHead" class="user-photo">
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
        <e-cell-item style="width: 174px;">
          <nuxt-link to="/sponsored"><img class="logo" src="/images/sponsor/logo.png" alt=""></nuxt-link>
        </e-cell-item>
        <e-cell-item>
          <img class="logo2" src="/images/sponsor/slogan.png" alt="">
        </e-cell-item>
        <e-cell-item>
          <div class="sponsor-menu">
            <a href="/sponsored"><li>首页</li></a>
            <a href="/api/sponsored/guest/mer/index"><li>项目资源</li></a>
            <a href="/api/sponsored/guest/plan/index"><li>赞助品牌</li></a>
            <a href="/sponsored/reported"><li>寻求报道</li></a>
            <!--<nuxt-link to="/"><li>赛事舆情</li></nuxt-link>
            <nuxt-link to="/"><li>关于我们</li></nuxt-link>
            <nuxt-link to="/"><li>帮助中心</li></nuxt-link>-->
          </div>
        </e-cell-item>
      </e-cellbox>
    </div>
  </header>
</template>
<script type="text/javascript">
  import { mapState } from 'vuex'
  import { VuecookieGet } from 'utils/cookie'
  import { getDomain } from 'utils/index'
  import systemApi from 'api/system'
  import userApi from 'api/user'
  import Direct from 'components/Direct'
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
        defaultHead: '/images/default_photo.jpg',
        dialogFormVisible: false,
        msgText: {
          total: ''
        }
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
      handleClose () {
        this.dialogFormVisible = false
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
            })
          })
          // window.location.href = '/common/logout'
        }
      },
      login () {
        if (this.layout.indexOf('nav') > -1) {
          let url = location.href
          sessionStorage.setItem('historyUrl', url)
          // location.href = '/member/login'
          this.$router.push({path: '/member/login'})
        } else {
          this.dialogFormVisible = true
        }
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
      if (process.browser) {
        let tooken = VuecookieGet('htxk_token', window.document.cookie)
        if (tooken && tooken.length > 10) {
          this.$store.dispatch('user/getUserInfo')
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
  }
  header{
    &.manage-head{
      .middle{
        height:70px;
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
      padding: 4px 5px;
      border-radius:10px;
      display:inline-block;
      background:red;
      height:10px; 
      line-height:10px;
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
        border-radius:50%;
      }
    }
    .middle{
      height: 70px;
      .logo{
        width:154px;
      }
      .logo2{
        width:124px;
        margin-left: 20px;
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
      }
    }
    .sponsor-menu{
      float: right;
      li{
        line-height: 70px;
        height: 70px;
        background: $color-white;
        font-size: 18px;
        padding: 0 10px;
        margin-left: 20px;
        float: left;
        list-style: none;
        position: relative;
        &:hover, &.active, &:active{
          background: $color-primary;
          color: $color-white;
          &:after{
            content: '';
            position: absolute;
            left: -20px;
            top: 0;
            bottom: 0;
            z-index: 0;
            width: 0;
            height: 0;
            border-bottom: 70px solid $color-primary;
            border-left: 20px solid transparent;
          }
          &:before{
            content: '';
            position: absolute;
            right: -20px;
            top: 0;
            bottom: 0;
            z-index: 0;
            width: 0;
            height: 0;
            border-top: 70px solid $color-primary;
            border-right: 20px solid transparent;
          }
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
