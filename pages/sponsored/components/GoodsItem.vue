<template>
  <div class="goods-item">
    <div class="goods-item-photo">
      <e-img :src="item.imgURL" @error="handleError" :atl="item.title" />
    </div>
    <h3 class="goods-item-text">
      {{item.title}}
    </h3>
  </div>
</template>

<script>
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

<style lang="scss">
  
  .goods-item{
    position:relative;
    background:#fff;
    margin:20px 0px;
    &-photo{
      height: 224px;
      overflow: hidden;
      background-size:cover;
      background-repeat: no-repeat;
      background-position: 50%;
      img{
        opacity:1;
        width:100%;
        height: 100%;
      }
    }
    &-text{
      overflow: hidden;
      font-size: 16px;
      font-weight: normal;
      margin-top: 12px;
      height:50px;
      line-height: 25px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
</style>