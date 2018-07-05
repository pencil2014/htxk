<template>
  <div class="certification-type">
    <div class="certification-type-title">
      <img v-if="item.icon" :src="item.icon" alt="" />
      <img v-else src="http://www.local.com/_nuxt/img/logo.7a180a0.png" alt="" />
      <p class="sub-title">{{item.title}}</p>
    </div>
    <div class="certification-type-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object
      }
    }
  }
</script>

<style lang="scss">
  
  .certification-type{
    img{
      display: block;
      width:90px;
      height: 90px;
      margin:0 auto;
      border-radius: 50%;
    }
    &-title{
      text-align: center;
      .icon{
        font-size: 80px;
        line-height: 80px;
        width: 30px;
      }
      .sub-title{
        font-size: 18px;
        margin-top: 10px;
      }
    }
    &-con{
      text-align: left;
      font-size: 12px;
      line-height: 25px;
      margin-top: 30px;
      .icon{
        color:#ccc;
        margin-right: 10px;
        vertical-align: bottom;
      }
    }
  }
</style>