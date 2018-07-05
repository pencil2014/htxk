<template>
  <div class="community-index">
    <div class="bbs-content clearfix">
      <div class="bbs-main fl">
        <bbs-banner v-if='banner' :banner-list='banner' />
        <div>
          <div class="community-list">
            <el-menu :default-active ="selectMenu"   mode="horizontal" >
              <el-menu-item :index="'/community/marrow'"  :class="(selectMenu == '/community/') ? 'is-active': '' ">
                 <nuxt-link 
                :to="{ path: '/community/marrow'}"  >
                  精选帖
                </nuxt-link>
              </el-menu-item>
              <el-menu-item 
                v-for='(item, index) in menuList' :key='index'
                :index="'/community/' + item.describe" >
                <nuxt-link 
                  :to="{ path: '/community/' + item.describe}" >
                  {{item.name}}
                </nuxt-link>
              </el-menu-item>
            </el-menu>
            <nuxt-child />
          </div>
        </div>
      </div>

      <div class="bbs-recommend fr">
        <hot-coterie :hot-list='hotCircle' />
        <hot-post />
      </div>

    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import BbsBanner from './components/BbsBanner'
import HotCoterie from './components/HotCoterie'
import HotPost from './components/HotPost'
import { mapGetters } from 'vuex'

export default {
  layout: 'bbs',
  components: {
    BbsBanner,
    HotCoterie,
    HotPost
  },
  computed: {
    ...mapGetters({
      hotCircle: 'community/hot_circle',
      banner: 'community/banner',
      menuList: 'community/menu'
    }),
    selectMenu: {
      get () {
        return this.$route.path
      },
      set (value) {
      }
    }
  },
  head () {
    if (this.hotCircle) {
      return {
        title: '求苗体育社区_体育运动爱好者交流圈',
        meta: [
          {name: 'keywords', content: '运动社区,篮球社区,足球社区,体育社区,求苗论坛,体育圈'},
          {hid: 'description', name: 'description', content: '求苗社区以篮球,足球,NBA,网球,羽毛球,电竞娱乐,跑步等体育运动话题为主，为拥有热情的体育爱好者们创造良好讨论氛围，提供个性化功能，加入兴趣圈子，参与社区讨论！'}
        ]
      }
    }
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 查询圈子所有类目
      let menu = await fetch({
        context,
        url: '/community/guest/circle/circleType'
      })
      context.store.commit('community/MENU', {data: menu.data})
      // 社区banner数据
      let bannerData = await fetch({
        context,
        url: '/playTurn/playTurnList',
        method: 'POST',
        data: {
          adsType: 'banner',
          showPosition: 2 // 2:社区banner
        },
        options: {successMsg: 'none'}
      })
      context.store.commit('community/BANNER', {data: bannerData})
      // 查询圈子所有类目 - 二级菜单
      let layoutMmenu = await fetch({
        context,
        url: '/community/guest/circle/AllFeedCircle'
      })
      context.store.commit('community/LAYOUT_MENU', {data: layoutMmenu.data})
      // 热门圈子
      let hotCircle = await fetch({
        context,
        url: '/community/guest/circle/hotCircle',
        params: {
          page: 1,
          rows: 6
        }
      })
      context.store.commit('community/HOT_CIRCLE', {data: hotCircle})
      // 七天热帖
      let hotFeed = await fetch({
        context,
        url: '/community/guest/circle/hotFeed',
        params: {
          page: 1,
          rows: 10
        }
      })
      if (Number(hotFeed.result) === 0 && hotFeed.data) {
        context.store.commit('community/HOT_FEED', {data: hotFeed.data})
      }
    }
  },
  data () {
    return {
      loading: false,
      isMore: true
    }
  }
}
</script>

<style lang="scss" scoped>

.community-index{
  .bbs-content{
    background:#ebf0f5;
  }
  .bbs-main{
    width:750px;
    background: #fff;
  }
  .bbs-recommend{
    width:260px;
  }
}
.community-list{
  border-top:20px solid rgba(235,240,246,1);
  background: #fff;
  padding:20px 40px 40px 40px;
  .el-menu--horizontal {
    padding: 0;
  }
  .el-menu--horizontal .el-menu-item{
    padding:0;
    &:hover{
      background-color: #fff;
      border-bottom: 1px solid #e3e3ec;
    }
    a{
      display: block;
      padding:0 14px;
    }
  }
  .el-menu--horizontal .is-active:hover{
    border-bottom: 2px solid $color-primary;
  }
}
</style>

<style lang="scss">

.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix:after{
  content:".";
  display:block;
  height:0;
  clear:both;
  visibility:hidden;
}
.community-list{
  .el-tabs__item {
    min-width: 70px;
    font-size: 18px;
    line-height:38px;
  }

}
</style>
