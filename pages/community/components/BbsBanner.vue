<template>
  <div class="bbs-banner-content"  >
    <div v-if="bannerList && bannerList.length > 0">
      <el-carousel height="320px"  >
        <el-carousel-item v-for='(item, index) in bannerList' :key='index'>
          <div>
            <nuxt-link 
              :to="linkTo(item)"  
              :target="item.openType === 2 ? '_self' : '_blank'"  
              v-if='item.linkType === 1'  >
              <e-img :size='[750, 320]' :src='item.contentUrl' :title='item.adsTitle' :alt='item.adsTitle'   />
            </nuxt-link>
            <a 
              :href='item.detailUrl' 
              :target="item.openType === 2 ? '_self' : '_blank'"
              v-if='item.linkType === 2' >
              <e-img :size='[750, 320]' :src='item.contentUrl' :title='item.adsTitle' :alt='item.adsTitle'   />
            </a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bannerList: {
      required: true,
      type: Array
    }
  },
  methods: {
    linkTo (item) {
      // linkType (string, optional): 链接方式 （1： 资源类型 ，2：链接地址） ,
      // openType (string, optional): 打开方式 （1： 新增窗口打开 ，2：当前窗口打开） ,
      // resId (string, optional): 资源ID ,
      // resType (string, optional): 资源类型 （1：帖子 ，2： 视频 ，3：资讯 ，4：个人秀 ，5：赛事 ，6： 商品） ,
      if (item.resType === 1) { // 1：帖子 ———— 14475
        return '/community/detail/' + item.resId
      } else if (item.resType === 2) { // 2： 视频 —— 3349
        return '/video/detail/' + item.resId
      } else if (item.resType === 3) { // 3：资讯
        return ''
      } else if (item.resType === 4) { // 4：个人秀
        return ''
      } else if (item.resType === 5) { // 5：赛事
        return ''
      } else if (item.resType === 6) { // 6： 商品
        return item.nextStepUrl
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss"  scoped>

.bbs-banner-content{
  height: 320px;
  width: 750px;
  background-image: url('/images/default_goods.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  .el-carousel{
    .el-carousel__item{
      a{
        display:block;
        height: 320px;
        width: 750px;
      }
      img {
        width:100%;
      }
    }
    height: 320px;
    overflow:hidden;
  }
}
</style>

<style lang="scss" >

.bbs-banner-content{
}
</style>
