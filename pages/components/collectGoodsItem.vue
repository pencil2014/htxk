<template>
  <div class="goods-item">
    <nuxt-link :to="item.nextStepUrl">
      <!--<div class="goods-item-photo" :style="`background-image:url(${item.imgUrl})`"> -->
      <div class="goods-item-photo">
        <e-img :src="item.imgUrl" :alt="item.name" @error="handleError" :size="[195,195]" />
      </div>
      <e-text tag="h3" class="goods-item-text" height="56px" :line-clamp="2">{{item.name}}</e-text>
      <div class="goods-item-price">
        {{item.minPrice | formatMoney }}
      </div>
    </nuxt-link>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: {
      item: {
        type: Object
      }
    },
    methods: {
      handleError (e) {
        e.target.parentNode.style.backgroundImage = 'url(' + e.target.src + ')'
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
  .collect-goods .el-col-24{
    width: 20%;
  }
  .goods-item{
    position:relative;
    padding:10px 0;
    background:#fff;
    border-bottom: 2px solid $border-color-base;
    margin:10px 0;
    a{
      display: block;
    }
    &-photo{
      overflow: hidden;
      background-size:cover;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    &-text{
      overflow: hidden;
      font-size: 16px;
      font-weight: normal;
      margin-top: 12px;
    }
    &-price{
      font-size: 24px;
      color: $color-warning;
    }
    &:after{
      content:'';
      width:0;
      height:2px;
      bottom:-2px;
      position: absolute;
      left:0;
      z-index: 9;
      background-color: $color-primary;
    }
    &:hover{
      &:after{
        width:100%;
        transition:width .5s;
        -moz-transition:width .5s; /* Firefox 4 */
        -webkit-transition:width .5s; /* Safari and Chrome */
        -o-transition:width .5s; /* Opera */
      }
    }
  }
</style>
