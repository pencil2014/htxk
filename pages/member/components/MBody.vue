<template>
  <div class="layout-member">
    <slot name="mHeader"></slot>
    <div class="layout-body">
      <div class="member-text">
          <img src="/images/login/member_text.png" width="100%" alt="">
        </div>
        <div class="member-box">
          <slot name="mBody"></slot>
        </div>
    </div>
    <x-footer :login="true" />
  </div>
</template>
<style lang="scss" scoped>
  .layout-member{
    background:url(/images/login/login_bg.jpg);
    height:100vh;
    min-height:900px;
    position: relative;
    &-member{
      background:url(/images/login/login_bg.jpg);
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
