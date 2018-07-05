<template>
  <ssr :is-ssr="false">
    <div class="layout-frame">
      <x-header-widest :headerBox="'manage-head'" :layout="['manage','userHead']" slot="header" />
      <div slot="body" class="layout-body">
        <el-row>
          <aside>
            <personal  :user-all-info='userAllInfo'></personal>
            <el-scrollbar class="side-scroller">
              <el-menu  class="el-menu-vertical" :default-active ="selectMenu"
                :default-openeds='["publish", "message", "content", "payMent", "attestation", "basic"]'
                theme="white">
                <el-submenu index="publish"  v-if="personalOrNot == 'no_attestation-basic'" >
                  <template slot="title">我的发布</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe68f;</i>发布菜单</template>
                    <el-menu-item index="/manage/publish/article"><nuxt-link to="/manage/publish/article">发布资讯</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/publish/photo"><nuxt-link to="/manage/publish/photo">发布组图</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/publish/video"><nuxt-link to="/manage/publish/video">发布视频</nuxt-link></el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="message" class="msg-list" v-if="personalOrNot == 'no_attestation-basic'" >
                  <template slot="title">消息中心</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe67b;</i>消息菜单</template>
                    <el-menu-item index="/manage/message">
                    <nuxt-link to="/manage/message">
                      系统消息
                      <el-badge v-if="msgText.system" :value="msgText.system" :max="99" class="item" />
                    </nuxt-link>
                    </el-menu-item>
                    <el-menu-item index="/manage/message/at">
                      <nuxt-link to="/manage/message/at">
                        @我的
                        <el-badge v-if="msgText.at" :value="msgText.at" :max="99" class="item" />
                      </nuxt-link>
                    </el-menu-item>
                    <el-menu-item index="/manage/message/comment">
                      <nuxt-link to="/manage/message/comment">
                        评论
                        <el-badge v-if="msgText.comment" :value="msgText.comment" :max="99" class="item" />
                      </nuxt-link>
                    </el-menu-item>
                    <el-menu-item index="/manage/message/praise">
                      <nuxt-link to="/manage/message/praise">
                        赞 
                        <el-badge v-if="msgText.praise" :value="msgText.praise" :max="99" class="item" />
                      </nuxt-link>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="content" v-if="personalOrNot == 'no_attestation-basic'">
                  <template slot="title">我的内容</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe67a;</i>内容菜单</template>
                    <el-menu-item index="/manage/card/"><nuxt-link to="/manage/card/">我的服务</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/content/feed"><nuxt-link to="/manage/content/feed">我的帖子</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/content/news"><nuxt-link to="/manage/content/news">我的资讯</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/content/photo"><nuxt-link to="/manage/content/photo">我的相册</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/content/videos"><nuxt-link to="/manage/content/videos">我的视频</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/activity" :class="[selectMenu == '/manage/activity' ? 'is-active': '']" ><nuxt-link to="/manage/activity">我的活动</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/collect/"><nuxt-link to="/manage/collect/">我的收藏</nuxt-link></el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-submenu index="payMent" v-if="personalOrNot == 'no_attestation-basic'" >
                  <template slot="title">财务管理</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe7d1;</i>财务菜单</template>
                    <el-menu-item index="/manage/wallet/"><nuxt-link to="/manage/wallet/">我的钱包</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/order/"><nuxt-link to="/manage/order/">我的订单</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/coupon/"><nuxt-link to="/manage/coupon/">我的优惠券</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/service/list"><nuxt-link to="/manage/service/list">售后/退款</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/wallet/payment"><nuxt-link to="/manage/wallet/payment">支付密码管理</nuxt-link></el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-submenu index="attestation"  v-if="(personalOrNot == 'attestation') || (personalOrNot == 'no_attestation-basic')" >
                  <template slot="title">认证功能</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe681;</i>认证中心</template>
                    <el-menu-item index="/attestation/user" :class="[selectMenu == '/attestation/user' ? 'is-active': '']"><nuxt-link to="/attestation/user">用户认证</nuxt-link></el-menu-item>
                    <el-menu-item index="/attestation/name" :class="[selectMenu == '/attestation/name' ? 'is-active': '']" ><nuxt-link to="/attestation/name">实名认证</nuxt-link></el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-submenu index="basic"  v-if="(personalOrNot == 'basic') || (personalOrNot == 'no_attestation-basic')" >
                  <template slot="title">更多功能</template>
                  <el-menu-item-group>
                    <template slot="title"><i class="icon iconfont">&#xe67d;</i>系统菜单</template>
                    <el-menu-item index="/basic/alterPassword"><nuxt-link to="/basic/alterPassword">修改密码</nuxt-link></el-menu-item>
                    <el-menu-item index="/basic/suggestion"><nuxt-link to="/basic/suggestion">意见反馈</nuxt-link></el-menu-item>
                    <el-menu-item index="/manage/#" v-if="(personalOrNot == 'no_attestation-basic') && (personalOrNot != 'basic')" @click="showChat()" >在线客服</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <div></div>
              </el-menu>
            </el-scrollbar>
          </aside>
          <article>
            <nuxt/>
          </article>
        </el-row>
      </div>
    </div>
  </ssr>
</template>

<script>
  import api from 'api/system'
  import { mapState } from 'vuex'
  import XHeaderWidest from 'components/XHeaderWidest'
  import Personal from 'components/Personal'
  export default {
    components: {
      XHeaderWidest,
      Personal
    },
    data () {
      return {
        msgText: {
          system: '',
          apply: '',
          at: '',
          comment: '',
          praise: ''
        },
        query: {
          type: 1
        }
      }
    },
    methods: {
      getMessageData () {
        api.getCountData(this.query).then((res) => {
          this.msgText = res.data
        })
      },
      showChat () {
        let url = 'https://www.71chat.com/scsf/core/styleConfig.visitorView.do?cmpcd=106282'
        let name = '华体星空'
        let iWidth = '1000'
        let iHeight = '600'
        let iTop = (window.screen.availHeight - 30 - iHeight) / 2
        let iLeft = (window.screen.availWidth - 10 - iWidth) / 2
        window.open(url, name, 'width=' + iWidth + ', height=' + iHeight + ',top=' + iTop + ',left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      }
    },
    computed: {
      ...mapState({
        userAllInfo: state => state.user.user_all_info
      }),
      selectMenu: {
        get () {
          return this.$route.path
        },
        set (value) {
        }
      },
      personalOrNot () {
        let str = this.$route.path
        if (str.match(/^\/attestation/i)) {
          return 'attestation'
        } else if (str.match(/^\/basic/i)) {
          return 'basic'
        } else {
          return 'no_attestation-basic'
        }
      }
    },
    mounted () {
      this.getMessageData()
      this.$store.dispatch('user/user_all_info') // 更新个人中心的个人信息
    }
  }
</script>

<style lang="scss" >
$active-background-color:#f0fcf9;
.layout-frame{
  .layout-body{
    background:#ebf0f5;
    min-height:500px;
    padding:40px 10px;
  }
  footer{
    margin-top:0;
  }
  aside{
    position: absolute;
    height: 100%;
    width:250px;
    background-color: #fff;
    .side-scroller{
      height: calc(100% - 325px);
      .el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
    .el-scrollbar__wrap, .el-scrollbar__view, .el-menu.el-menu-vertical {
      height: 100%;
    }
    .el-menu{
      background: #fff;
      border-radius: 0;
      text-align: center;
      &-item {
        padding: 0 !important;
        a {
          display: block;
        }
        &:hover {
          color:$color-primary;
          background: rgba(255,255,255,1);
        }
        &.is-active{
          color:$color-primary !important;
          a{
            color:$color-primary;
          }
        }
      }
      .router-link-active {
        &:hover {
          color:$color-primary;
          background: rgba(255,255,255,1);
        }
      }
    }
    .el-submenu{
      text-align: left;
      &:hover .el-submenu__title {
        background: #fff;
      }
      &__title {
        font-size: 16px;
      }
      &__icon-arrow{
        margin-top: -3px;
      }
      &.is-opened{
        > .el-submenu__title .el-submenu__icon-arrow{
          margin-top: -5px;
        }
      }
      .el-submenu__title{
        padding-left:30px !important;
      }
      .el-submenu__icon-arrow{
        position: static;
        margin-left: 28px;
      }
      .el-menu-item-group {
        ul{
          overflow: hidden;
          padding-left: 10px;
          margin-left:20px;
          margin-right: 20px;
          border-bottom: 1px solid $color-divider;
          li{
            float: left;
            width: 100px;
            text-align: left;
            color: $color-sub;
          }
        }
      }
      .el-menu-item-group__title{
        text-align: left;
        font-size: 16px;
        height: 32px;
        line-height: 32px;
        padding: 0;
        color:$color-black;
        i{
          margin-right: 10px;
          font-size: 24px;
          color:$color-sub;
        }
      }
      .el-menu-item {
        height: 50px;
        line-height: 50px;
        padding: 0 ;
        min-width: 100px;
      }
    }
  }
  article{
    background: #fff;
    min-height: 800px;
    padding: 1px 0;
    min-width:956px;
    margin-left: 270px;
    >div{
      max-width:956px;
    }
  }
  .el-breadcrumb{
    position: absolute;
    margin-top: -25px;
    margin-left: -270px;
  }
  .content{
    padding:60px;
    .heading-1{
      margin-top:0
    }
  }
}
</style>
