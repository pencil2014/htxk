<template>
  <div>
    <!-- <e-carousel inner-class="wrapper"  :colors="colors" v-if="banner && banner.length > 0">
      <e-carousel-item v-for="(item, index) in banner"   :key="index">
        <img :src="item.contentUrl">
      </e-carousel-item>
    </e-carousel> -->
    <!-- <e-carousel inner-class="wrapper" v-if="$route.query.test && banners && banners.length > 0" :colors="colors">
      <e-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item">
      </e-carousel-item>
    </e-carousel> -->
    <home-banner style='height:420px;background:#eee;' v-if="banner" :banner-list='banner'/>
    <home-section v-for="(item,index) in column" v-if="column && column.length>0" :key="index" :title="item.columnTitle">
      <el-row :gutter="20">
        <el-col v-for="(sub,index) in item.contentList" v-if="item.contentList && item.contentList.length>0" :span-percent="20" :key="index">
          <goods-item :item="{goodsCode: sub.realationKey, goodsFullName: sub.displayText, imgURL: sub.iconUrl, goodsLowestPrice: sub.price, nextStepUrl:item.nextStepUrl}" />
        </el-col>
      </el-row>
    </home-section>
    <home-section title="推荐用户" class="recommend-user">
      <el-row :gutter="16" v-if="recommend_user.list && recommend_user.list.length">
        <el-col v-for="(item, index) in recommend_user.list" :key="index" :span-percent="20" class="recommend-user-item">
          <user-item :item="item" />
        </el-col>
      </el-row>
    </home-section>
    <home-section title="最新服务" moreLink="/goods" class="recommend-goods">
      <el-row :gutter="20" v-if="recommend && recommend.list && recommend.list.length>0">
        <el-col v-for="(item,index) in recommend.list" :span-percent="20" :key="index">
          <goods-item :item='{goodsCode: item.goodsCode, goodsFullName: item.goodsFullName, imgURL: item.goodsMiddleUrl, goodsLowestPrice: item.goodsLowestPrice, nextStepUrl:item.nextStepUrl}' />
        </el-col>
      </el-row>
    </home-section>
    <chat-section/>
  </div>
</template>

<script>
import fetch from 'fetch'
import HomeBanner from './components/home/Banner'
import HomeSection from './components/home/Section'
import GoodsItem from './components/GoodsItem'
import UserItem from './components/UserItem'
import {ECarousel, ECarouselItem} from '@e-ui/carousel'
import chatSection from './components/Chat' // 调入客服
import indexApi from 'api/index'
import { mapState } from 'vuex'

export default {
  layout: 'home',
  components: {
    HomeBanner,
    GoodsItem,
    UserItem,
    chatSection, // 调入客服
    HomeSection,
    ECarousel,
    ECarouselItem
  },
  computed: {
    ...mapState({
      banner: state => state.index.banner,
      column: state => state.index.column,
      recommend_user: state => state.index.recommend_user,
      recommend: state => state.index.recommend
    })
  },
  async fetch (context) {
    let cacheTime = 60000
    if (!context.popStateEvent) {
      // 获取推荐商品
      // if (JSON.stringify(context.store.state.index.recoomend_list) === '{}') {
      let dataGoods = await fetch({
        context,
        cacheTime,
        url: '/index/guest/recommendGoods'
      })
      context.store.commit('index/RECOMMEND', dataGoods.data)
      // }
      // 请求banner图
      // if (context.store.state.index.banner === null || context.store.state.index.banner === undefined) {
      let bannerData = await fetch({
        cacheTime,
        context,
        url: '/playTurn/playTurnList',
        method: 'POST',
        data: {
          adsType: 'banner',
          showPosition: 1
        },
        options: {successMsg: 'none'}
      })
      // 处理循环轮播的颜色
      context.store.commit('index/BANNER', {data: bannerData})
      // }
      // 请求菜单名字
      // if (JSON.stringify(context.store.state.index.column) === '{}') {
      let menuData = await fetch({
        context,
        cacheTime,
        url: '/goods/goodCateList?goodsCateCode=0'
      })
      context.store.commit('index/MENU', {data: menuData})
      // }
      // 请求推荐栏目数据
      // if (context.store.state.index.column.length === null || context.store.state.index.column.length === undefined) {
      let dataColumn = await fetch({
        context,
        cacheTime,
        url: '/index/guest/homepageColumn'
      })
      context.store.commit('index/COLUMN', dataColumn.data)
      // }
      // 获取推荐用户
      // if (JSON.stringify(context.store.state.index.recommend_user) === '{}') {
      // }
    }
    let dataUser = await fetch({
      context,
      cacheTime,
      url: '/index/ip/recom'
    })
    context.store.commit('index/RECOMMEND_USER', dataUser.data)
  },
  methods: {
    follow (item) {
      indexApi.followUser({followerId: item.userId}).then((res) => {
        if (res.result === '0') {
          this.$message('已关注')
          // item.isFollowed = true
          this.$set(item.isFollowed, true)
        }
      })
    }
  },
  data () {
    return {
      // banners: [
      //   'http://s3.mogucdn.com/mlcdn/c45406/171031_3bj8l8ek4217a0457df00f9iej1gk_778x440.jpg_900x9999.v1c7E.70.jpg',
      //   'http://s3.mogucdn.com/mlcdn/c45406/171031_8f16li2dbl9gb1f1b615la6k28l68_778x440.jpg_900x9999.v1c7E.70.jpg',
      //   'http://s3.mogucdn.com/mlcdn/c45406/171030_4li597jfclcb6kj6ab2de03hflk20_778x440.jpg_900x9999.v1c7E.70.jpg'
      // ],
      // colors: ['#dfc5a4', '#f7dfbd', '#000000']
    }
  },
  mounted () {
    // console.log(this.$store.state)
  }
}
</script>
<style lang="scss" type="text/css" scoped>
  
  
</style>
