<template>
  <div class="iconitem" :class="color">
    <p class="top"><i class="icon iconfont" :class="icon"></i></p>
    <p class="title" v-html="title"></p>
    <p class="text" v-html="text"></p>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: {
      title: {
        type: String
      },
      text: {
        type: String
      },
      icon: {
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
  .iconitem{
    width: 280px;
    margin: 20px auto;
    text-align: center;
    line-height: 1;
    .title{
      font-size: 18px;
      margin-bottom: 20px;
      line-height: 28px;
    }
    .text{
      font-size: 14px;
      color: $color-black-base;
      line-height: 20px;
    }
    .top{
      margin-bottom: 25px;
      .icon{
        font-size: 112px;
      }
    }
    &.blue{
      .icon{
        color: $color-blue
      }
    }
    &.green{
      .icon{
        color: $color-green
      }
    }
  }
</style>