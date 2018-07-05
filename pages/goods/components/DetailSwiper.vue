<template>
  <div  v-if='bannerList'  class="block">
    <el-carousel height="400px">
      <el-carousel-item v-for='(item, index) in bannerList' :key='index' v-if='item'>
        <e-img :size='[400,400]' :alt='goodsName' :src='item.goodsImgUrl' />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    bannerList: {
      required: true,
      type: Array
    },
    goodsName: {
      type: String
    }
  }
}
</script>


<style  lang="scss" >

  .block{
    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius:100%;
      opacity: 1;
    }
    .el-carousel__indicator.is-active button {
       background-color: #fcaf16;
    }
    .el-carousel__arrow {
      width: 21px;
      height: 64px;
      border-radius: 0;
      background-color: rgba(0, 0, 0, 0.4);
      font-size: 21px;
    }
    .el-carousel__arrow--left{
      left: 0;
    } .el-carousel__arrow--right {
      right: 0;
    }
    .el-carousel__arrow i{
      transform: scale(1,1.8);
    }
  }
</style>
