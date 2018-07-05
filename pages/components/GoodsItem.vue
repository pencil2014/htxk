<template>
  <div class="goods-item" >
    <nuxt-link :to="goodsUrl">
    <!-- <nuxt-link v-if='item.goodsCode' :to="'/goods/detail/' + item.goodsCode"> -->
    <!-- <nuxt-link to="/goods/detail/"> -->
      <div class="goods-item-photo">
        <!-- <img :src="item.imgURL" :alt="item.goodsFullName"> -->
        <e-img :src="this.item.imgURL" :size="[224,224]" :alt="item.goodsFullName" />
      </div>
      <!--单行显示 tag 是非必项-->
      <!--
      <e-text tag="h3" class="goods-item-text">{{item.goodsFullName}}</e-text>
      -->
      <!--多行显示-->
      <e-text tag="h3" class="goods-item-text" height="56px" :line-clamp="2">{{item.goodsFullName}}</e-text>
      <div class="goods-item-price">
        {{item.goodsLowestPrice | formatMoney }}
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
    computed: {
      goodsUrl () {
        if (this.item.nextStepUrl) {
          return this.item.nextStepUrl
        } else {
          return '/goods/detail/' + this.item.goodsCode
        }
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
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
      height: 224px;
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
