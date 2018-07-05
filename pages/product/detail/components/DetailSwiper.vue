<template>
  <div  v-if='bannerList'  class="block">
    <el-carousel height="400px">
      <el-carousel-item v-for='(item, index) in bannerList' :key='index' v-if='item'>
        <e-img :size='[400,400]' :alt='goodsName' :src='item.goodsImgUrl' @error="handleError" />
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
  },
  methods: {
    handleError (e) {
      e.target.nextSibling.style.backgroundImage = 'url(' + e.target.src + ')'
    }
  }
}
</script>
