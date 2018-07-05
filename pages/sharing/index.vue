<template>
  <div class="wrap">
    <!-- <div class="wrap-left news-menu-box" :class="isFixed ? 'fixed': ''"> -->
    <div class="wrap-left news-menu-box" >
      <s-menu :list="menuList" :iconClass="menuIconClass" class="share-info" />
    </div>
    <div class="wrap-right">
      <e-cellbox>
        <e-cell-item class="banner">
          <el-carousel trigger="click" :interval="5000" arrow="always" v-if="banner && banner.list">
            <el-carousel-item v-for='(item, index) in banner.list' :key='index'>
              <nuxt-link
                :to="linkTo(item)"
                :target="item.openType === 2 ? '_self' : '_blank'"
                v-if='item.linkType === 1'  >
                <e-img :size='[700,394]' :src='item.contentUrl' :title='item.adsTitle' :alt='item.adsTitle'   />
                <div class="title-box">
                  <h2 class="title">{{ item.adsTitle }}</h2>
                </div>
              </nuxt-link>
              <a
                :href='item.detailUrl'
                :target="item.openType === 2 ? '_self' : '_blank'"
                v-if='item.linkType === 2' >
                <e-img :size='[700,394]' :src='item.contentUrl' :title='item.adsTitle' :alt='item.adsTitle'   />
                <div class="title-box">
                  <h2 class="title">{{ item.adsTitle }}</h2>
                </div>
              </a>
            </el-carousel-item>
          </el-carousel>
        </e-cell-item>
        <e-cell-item v-if="headLine && headLine.list">
          <head-line :list="headLine.list" />
        </e-cell-item>
      </e-cellbox>
      <section class="container hot-match" v-if="matchList && matchList.list">
        <e-heading grade="1">热门赛事</e-heading>
        <match-item :list="matchList.list" />
      </section>
      <section class="container recommend-box">
        <div class="news-box">
          <e-list-view 
            v-if='postList && postList.list && postList.list.length > 0'
            @fetch="handleFetch" 
            :loading.sync="loading" 
            :is-more="isMore" :params='query'>

            <div v-for='(item, index) in postList.list' :key='index'>
              <post-item-img-one  :ItemData='item' 
                v-if='item.coverUrl && (item.coverUrl.length > 0 && item.coverUrl.length < 4)'  />
              <post-item :ItemData='item'  v-else  />
            </div>
            
          </e-list-view>
          <div class="replay-default tc" v-else>
            <img src="/images/empty_default.png" alt="暂无数据">
            <p style='color: #999;'>暂无相关视频或资讯</p>
          </div>
        </div>
        <div class="picture-wrap">
          <div class="picture-box" v-if="pictureList && pictureList.list">
            <e-heading grade="1">精彩图集</e-heading>
            <picture-item :pictureList="pictureList.list" />
          </div>
          <div class="video-box" v-if="videoList && videoList.list">
            <e-heading grade="1">赛事视频</e-heading>
            <video-item :videoList="videoList.list" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  import fetch from 'fetch'
  import api from 'api/sharing'
  import EListView from '@e-ui/ListView'
  import PostItem from './components/PostItem'
  import PostItemImgOne from './components/PostItemImgOne'
  import sMenu from './components/SMenu'
  import headLine from './components/HeadLine'
  import matchItem from './components/MatchItem'
  import pictureItem from './components/PictureItem'
  import videoItem from './components/VideoItem'
  import {mapState} from 'vuex'

  let espnCode = ''

  export default {
    layout: 'primary',
    components: {
      EListView,
      PostItem,
      PostItemImgOne,
      sMenu,
      headLine,
      matchItem,
      pictureItem,
      videoItem
    },
    head () {
      return {
        title: '体育视讯频道_体育资讯_体育视频_求苗体育',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '体育新闻,体育资讯,体育视频,热点视讯' },
          { hid: 'description', name: 'description', content: '求苗体育视讯频道全面展示了NBA，CBA，国际足球，英超，意甲，德甲，综合体育最新新闻、资讯、视频、图片、等体育热点内容，最新比赛，热门视频内容报道并提供了体育花边和赛后赛事视讯。' }
        ]
      }
    },
    async asyncData (context) {
      if (!context.popStateEvent) {
        // 菜单栏
        let menuList = await fetch({
          url: '/information/revision/espn?page=1&rows=30',
          context
        })
        context.store.commit('sharing/MENULIST', {data: menuList.data})
        // banner 栏
        let bannerData = await fetch({
          context,
          url: '/playTurn/playTurnList',
          method: 'POST',
          data: {
            adsType: 'banner',
            showPosition: 3 // 2:社区banner
          },
          options: {successMsg: 'none'}
        })
        context.store.commit('sharing/BANNER', {data: bannerData.data})
        // 今日头条
        let headData = await fetch({
          url: '/information/revision/news/latest',
          context
        })
        context.store.commit('sharing/HEADLINE', headData.data)
        // 赛事数据
        let matchData = await fetch({
          url: '/information/revision/match',
          context
        })
        context.store.commit('sharing/MATCHLIST', matchData.data)
        // 热门视频
        let videoData = await fetch({
          url: '/information/revision/video',
          params: {rows: 4},
          context
        })
        context.store.commit('sharing/VIDEOLIST', videoData.data)
        // 精彩图集
        let pictureData = await fetch({
          url: '/information/revision/news/hot',
          params: {rows: 6},
          context
        })
        context.store.commit('sharing/PICTURELIST', pictureData.data)
        // 与频道相关数据
        espnCode = menuList.data.list[0].espnCode
        // 主体内容
        let queryData = {
          espnCode: espnCode,
          page: context.query.page || 1,
          rows: 10
        }
        let newsHot = await fetch({
          context,
          url: '/information/revision/espn/news/hot',
          params: queryData
        })
        let isMore = true
        if (newsHot && newsHot.data && newsHot.data.list && (newsHot.data.list.length >= newsHot.data.total)) {
          isMore = false
        }
        queryData.page = queryData.page + 1
        return { 'postList': newsHot.data, 'query': queryData, 'loading': false, 'isMore': isMore }
      }
    },
    computed: {
      ...mapState({
        menuList: state => state.sharing.menuList,
        matchList: state => state.sharing.matchList,
        videoList: state => state.sharing.videoList,
        pictureList: state => state.sharing.pictureList,
        banner: state => state.sharing.banner,
        headLine: state => state.sharing.headLine
      })
    },
    data () {
      return {
        query: {
          rows: this.rows,
          page: this.page
        },
        rows: 10,
        page: 1,
        loading: false,
        isMore: true,
        postList: {},
        // isFixed: false,
        menuIconClass: [
          {
            iconClass: 'icon-remen1'
          },
          {
            iconClass: 'icon-iosfootball'
          },
          {
            iconClass: 'icon-06'
          },
          {
            iconClass: 'icon-huwai'
          },
          {
            iconClass: 'icon-yule'
          },
          {
            iconClass: 'icon-jianshen'
          },
          {
            iconClass: 'icon-wanyouxi'
          },
          {
            iconClass: 'icon-zonghe'
          },
          {
            iconClass: 'icon-quanquanb'
          }
        ]
      }
    },
    methods: {
      handleFetch () {
        if (!espnCode) {
          espnCode = this.menuList && this.menuList[0] && this.menuList[0].espnCode
        }
        this.page++
        if (this.postList.list.length >= this.postList.total) {
          this.loading = false
          this.isMore = false
          this.postList = JSON.parse(JSON.stringify(this.postList))
          return
        }
        let queryData = {
          espnCode: espnCode,
          page: this.page,
          rows: this.rows
        }
        this.query = queryData
        api.newsHot(queryData).then((res) => {
          this.loading = false
          if (res.data) {
            this.postList.list.push(...(res.data.list))
            if (this.postList.list.length >= this.postList.total) {
              this.isMore = false
            }
          }
        })
      },
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
    },
    mounted () {
      // window.onscroll = () => {
      //   console.log('document.body.scrollTop', document.body.scrollTop)
      //   if (document.body.scrollTop > 180) {
      //     this.isFixed = true
      //   } else {
      //     this.isFixed = false
      //   }
      // }
    }
  }
</script>
<style lang='scss' scoped>
  .wrap{
    width: 1200px;
    margin:0 auto;
    overflow: hidden;
    font-size:0;
    padding-top: 30px;
    &-left{
      width:150px;
      display: inline-block;
      font-size: 16px;
      vertical-align: top;
      margin-right: 20px;
      overflow: hidden;
      >ul{
        // position: relative;
        position: fixed;
        z-index: 10;
        width:150px;
      }
      // &.fixed{
      //   >ul{
      //     position: fixed;
      //     top: 0;
      //   }
      // }
    }
    &-right{
      width:1030px;
      display: inline-block;
      font-size: 14px;
      vertical-align: top;
      .banner{
        width: 720px;
        height: 394px;
        padding-right: 20px;
        .title-box{
          position:absolute;
          bottom:0;
          left:0;
          width:100%;
          height:50px;
          background:rgba(0,0,0,0.5);
          line-height: 50px;
          .title{
            width:350px;
            display:inline-block;
            vertical-align: middle;
            padding-left:20px;
            color:#fff;
            font-weight:normal;
            font-size:16px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: nowrap;
          }
        }
      }
      .hot-match{
        margin-top: 30px;
        .heading{
          font-size: 24px;
        }
      }
      .container.recommend-box{
        font-size: 0;
        .news-box,.picture-wrap{
          font-size: 14px;
          display: inline-block;
          vertical-align: top;
        }
        .news-box{
          width: 720px;
          padding-right: 20px;
        }
        .picture-wrap{
          width: 310px;
        }
      }
    }
  }
</style>
<style lang='scss'>
  .wrap-right .banner{
    .el-carousel__container{
      height:395px;
    }
    .el-carousel__indicators{
      left: auto;
      z-index:6;
      right:20px;;
      bottom:12px;
      transform:none;
      -ms-transform:none;
      .el-carousel__indicator{
        padding:0;
        margin-right:10px;
        &.is-active .el-carousel__button{
          background: $color-primary;
        }
      }
      .el-carousel__button{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255,255,255,0.8);
        float: left;
        cursor: pointer;
      }
    }
  }
</style>