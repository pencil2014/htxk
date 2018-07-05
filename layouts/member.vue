<template>
  <layout class="layout-member">
    <div class="member-header" slot="header">
      <div class="wrapper">
        <nuxt-link to="/">
          <img src="~static/images/logo_white.png" alt="">
        </nuxt-link>
      </div>
    </div>
    <div slot="body" class="layout-body">
      <div class="member-text">
        <img src="~static/images/login/member_text.png" width="100%" alt="">
      </div>
      <div class="member-box">
        <nuxt/>
      </div>
    </div>
    <x-footer :login="true" slot="footer"></x-footer>
  </layout>
</template>
<style lang="scss">
  @import '~styles/var.scss';
  .layout{
    &-body{
      min-height:480px;
    }
    &-member{
      background:url(~static/images/login/login_bg.jpg);
      height:100vh;
      min-height:900px;
      position: relative;
    }
    .member-text{
      width:408px;
      padding-right:19px;
      box-sizing:border-box;
      margin:110px auto 0;
    }
    .member-header{
      padding:13px 0;
    }
    .member-box {
      width:408px;
      overflow:hidden;
      margin:20px auto 0;
      background:#fff;
      padding:30px 50px;
      box-sizing:border-box;
      -webkit-box-shadow: 0 0 10px rgba(237, 239, 241, 0.5);
      -moz-box-shadow: 0 0 10px rgba(237, 239, 241, 0.5);
      box-shadow: 0 0 10px rgba(237, 239, 241, 0.5);
      border-radius:4px;
    }
  }
</style>