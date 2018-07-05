<template>
  <div >
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }" >求苗首页</el-breadcrumb-item>
      <el-breadcrumb-item>求苗资讯</el-breadcrumb-item>
    </el-breadcrumb>

    <div class='news-content'>
      <article>
        <div class="news-list">
          <list/>
        </div>
      </article>
      <aside>
        <ul class="static-img">
          <li>
            <recommend-user header-title='冉冉之星' header-icon='/images/old/rising_star.png'  :recommendList='school'  />
          </li>
          <li>
            <hot-videos :hot-list='videos' />
          </li>
          <li>
            <img src="/images/old/lecai.png" alt="求苗体育">
          </li>
          <li>
            <img src="/images/old/shijiebei.png" alt="世界杯">
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script type="text/javascript">
import fetch from 'fetch'
import List from './components/List'
import RecommendUser from './components/RecommendUser'
import HotVideos from './components/HotVideos'
import { mapGetters } from 'vuex'

export default {
  watchQuery: true,
  components: {
    List,
    RecommendUser,
    HotVideos
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 分类数据
      if (!(context.store.state.news.cates && context.store.state.news.cates.length && context.store.state.news.cates.length > 1)) {
        let cates = await fetch({
          context,
          url: '/news/cates'
        })
        cates.data.unshift({cateId: 0, cateName: '全部'})
        context.store.commit('news/CATES', {data: cates.data})
      }
      // 列表数据
      let newsData = await fetch({
        context,
        url: '/news/list',
        params: Object.assign({
          cateId: 0, // 0表示请求的分类是全部
          page: 1,
          rows: 15
        }, context.query)
      })
      context.store.commit('news/LIST', {data: newsData.data})
      // 冉冉之星 & 换一换
      if (!(context.store.state.news.school && context.store.state.news.school.length)) {
        let school = await fetch({
          context,
          url: '/sport/ip/page/school',
          params: {
            page: 1,
            rows: 0
          }
        })
        context.store.commit('news/SCHOOL', {data: school.data.list})
      }
      // 热门榜单
      if (!(context.store.state.news.videos && context.store.state.news.videos.length)) {
        let videos = await fetch({
          context,
          url: '/news/videos'
        })
        context.store.commit('news/VIDEOS', {data: videos.data})
      }
    }
  },
  computed: {
    ...mapGetters({
      school: 'news/school',
      videos: 'news/videos'
    }),
    selectMenu: {
      get () {
        return this.$route.path
      },
      set (value) {
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  
  .news-content{
    width: 1200px;
    margin: 0 auto;
    article{
      display: inline-block;
      vertical-align: top;
      width: 894px;
      background: #fff;
      padding:30px 60px;
    }
    aside{
      display: inline-block;
      vertical-align: top;
      width: 286px;
      margin-left:20px;
      background: #fff;
      overflow: hidden;
    }
    .static-img{
      li{
        border-bottom:20px solid $color-background;
      }
    }
  }
</style>

<style lang="scss">
  
  .news-content{
    .el-menu--horizontal {
      padding: 0;
    }
  }
</style>