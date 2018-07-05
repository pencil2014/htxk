<template>
  <div class="mod-wrap">
    <e-carousel>
      <div class="loading-box" v-if="loading">正在加载中...</div>
      <e-carousel-item v-for="(item, index) in bannerData" :key="index">
        <a :href="!item.forwardUrl ? item.forwardUrl : ''" target="_blank"><img :src="item.logoUrl" :alt="item.focusValue"></a>
      </e-carousel-item>
    </e-carousel>
    <div class="mod-main">
      <div class="left-box">
        <el-row :gutter="24" class="enter-box">
          <el-col :span="12">
            <a href="/sponsored/resources/pe" target="_blank">
              <div class="enter-con">
                <h3>体育资源入驻</h3>
                <p>运动联盟、兴趣小组、业余球队、场馆<br />达人、入驻平台快速获得赞助</p>
                <button type="button" class="el-button el-button--primary el-button--mini">立即入驻</button>
                <img src="/images/sponsor/home/jerseys.png" alt="" />
              </div>
            </a>
          </el-col>
          <el-col :span="12">
            <a href="/sponsored/resources/merchant" target="_blank">
              <div class="enter-con">
                <h3>赞助商入驻</h3>
                <p>智能匹配，精准投放。为每一个有赞助意<br />向的赞助商提供最专业的营销服务</p>
                <button type="button" class="el-button el-button--primary el-button--mini">立即入驻</button>
                <img src="/images/sponsor/home/business.png" alt="" />
              </div>
            </a>
          </el-col>
        </el-row>
        <home-section title="热门项目" moreLink="/api/sponsored/guest/mer/index">
          <el-row :gutter="24">
            <div class="loading-box" v-if="loading">正在加载中...</div>
            <el-col :span="12" v-for="(item, index) in listData.sponsorMerHotList" :key="index" class="item-box">
              <a :href="'/api/sponsored/guest/mer/base/detail?merId='+item.id" target="_blank">
                <goods-item :item='{imgURL: item.logoUrl, title: item.title}'></goods-item>
              </a>
            </el-col>
          </el-row>
        </home-section>
        <home-section title="赞助意向" moreLink="/api/sponsored/guest/plan/index">
          <el-row :gutter="24">
            <div class="loading-box" v-if="loading">正在加载中...</div>
            <el-col :span="12" v-for="(item, index) in listData.sponsorPlanHotList" :key="index" class="item-box">
              <a :href="'/api/sponsored/guest/plan/base?planId='+item.id" target="_blank">
                <goods-item :item='{imgURL: item.logoUrl, title: item.title}'></goods-item>
              </a>
            </el-col>
          </el-row>
        </home-section>
      </div>
      <div class="right-box">
        <div class="bulletin-box">
          <div class="bulletin-box-title">
            <h3>活动公告</h3>
            <a href="/sponsored/news" target="_blank">更多<i class="icon iconfont icon-directionbottom-copy"></i></a>
          </div>
          <a :href="'/sponsored/news/details?noticeId='+item.id" v-for="(item, index) in noticeData.list" :key="index" target="_blank">
            <em>[{{item.noticeTypeName}}]</em>
            <i>{{item.noticeTitle}}</i>
            <span>{{item.createTime | formatDate('MM-dd')}}</span>
          </a>
          <div class="loading-box" v-if="loading">正在加载中...</div>
        </div>
        <div class="ad-box">
          <a href=""><img src="/images/sponsor/home/ad.jpg" alt="" /></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {ECarousel, ECarouselItem} from '@e-ui/carousel'
  import HomeSection from './components/Section'
  import GoodsItem from './components/GoodsItem'
  import indexApi from 'api/sponsored/index'
  export default {
    layout: 'sponsor',
    components: {
      ECarousel,
      ECarouselItem,
      HomeSection,
      GoodsItem
    },
    data () {
      return {
        listData: '',
        bannerData: [],
        noticeData: '',
        loading: true
      }
    },
    created () {
      this.listDataFn()
      this.bannerDataFn()
      this.noticeDataFn()
    },
    methods: {
      listDataFn () {
        // 热闹项目赞助意向数据
        this.loading = true
        indexApi.sponsorList().then((res) => {
          this.listData = res.data
        })
        this.loading = false
      },
      bannerDataFn () {
        // banner图片轮播接口，最多5条
        this.loading = true
        indexApi.bannerList({page: 1, rows: 5}).then((res) => {
          if (res.data.list) {
            this.bannerData = res.data.list
          }
          this.loading = false
        })
      },
      noticeDataFn () {
        // 公告列表，最多8条
        indexApi.noticeList({
          page: 1,
          rows: 8
        }, {context: this, successMsg: 'none'}).then((res) => {
          this.noticeData = res.data
        })
      }
    }
  }
</script>
<style lang="scss">
  
  .mod-wrap{
    background: #fff;
    position:relative;
  }
  .mod-main{
    width:1200px;
    height: 100%;
    margin:0 auto;
    overflow: hidden;
    position:relative;
  }
  .left-box{
    width:890px;
    float: left;
  }
  .right-box{
    width: 285px;
    float: right;
  }
  .loading-box{
    width: 100%;
    background: #f1f2f3;
    text-align: center;
    line-height: 40px;
    margin: 20px 0;
  }
  .enter-box{
    margin: 54px 0px;
    .enter-con{
      background:#e5f4ff;
      height: 200px;
      position:relative;
      padding:30px 40px 0px 30px;
      .el-button{
        position: absolute;
        left:30px;
        bottom:30px;
      }
      h3{
        font-size: 24px;
        color:$color-black; 
      }
      p{
        font-size: 14px;
        line-height: 25px;
        color:$color-black-base;
        margin-top: 5px;
      }
      img{
        position:absolute;
        right:40px;
        bottom:0px;
      }
    }
  }
  .item-box{
    a{
      display: block;
      &:hover,.goods-item-text:hover{
        color:$color-primary;
      }
    }
  }
  .bulletin-box{
    border:1px #cecece solid;
    padding:20px;
    box-sizing: border-box;
    margin:54px 0px 20px;
    &-title{
      overflow: hidden;
      margin-bottom: 10px;
      a{
        float: right;
        line-height: 20px !important;
      }
      h3{
        font-size:14px;
        color:$color-black;
        display: inline-block;
      }
      .icon{
        font-size:12px;
        margin:0px;
      }
    }
    a{
      display: block;
      line-height: 30px;
      font-size: 14px;
      &:hover{
        color:$color-primary;
      }
      em,i{
        font-style:normal;
      }
      i{
        display: inline-block;
        vertical-align: middle;
        max-width: 110px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin:0px 15px 0px 10px;
      }
      span{
        float: right;
      }
    }
  }
</style>
