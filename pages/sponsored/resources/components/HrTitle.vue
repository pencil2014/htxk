<template>
  <div class="hrtitle" :class="color">
    <span class="title">{{title}}</span>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: {
      title: {
        type: String
      },
      color: {
        type: String
      }
    }
  }
</script>
<style lang="scss">
  
  $color-blue: #479eff;
  $color-green: #25d38b;
  .hrtitle{
    width: 1200px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    margin: 100px auto 75px;
    position: relative;
    .title{
      position: relative;
      top: 0;
      bottom: 0;
      font-size: 24px;
      font-weight: bold;
      margin: 0 auto;
      width: 300px;
      display: block;
      z-index: 1;
    }
    &:after, &:before{
      content: '';
      position: absolute;
      width: 450px;
      top: 50%;
      height: 0px;
      display: block;
      border-top: 1px solid $border-color-base;
    }
    &:before{
      left: 0;
    }
    &:after{
      right: 0;
    }
    &.blue{
      .title{
        color: $color-blue
      }
      &:after, &:before{
        border-color: $color-blue;
      }
    }
    &.green{
      .title{
        color: $color-green
      }
      &:after, &:before{
        border-color: $color-green;
      }
    }
  }
</style>