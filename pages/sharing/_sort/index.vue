<template>
<div class="sort">
  <div class="sort-box">
    <div class="sort-menu">
      <s-menu :list="menuList" :iconClass="menuIconClass" class="share-info" /> 
    </div>

    <div class="sort-list" >
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

    <div class="new">
      <new-topic :latest='latest' />
    </div>

  </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/sharing'
import EListView from '@e-ui/ListView'
import SMenu from '../components/SMenu'
import NewTopic from '../components/NewTopic'
import PostItem from '../components/PostItem'
import PostItemImgOne from '../components/PostItemImgOne'
import { mapGetters } from 'vuex'

let espnCode = ''

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
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
  components: {
    EListView,
    SMenu,
    NewTopic,
    PostItem,
    PostItemImgOne
  },
  computed: {
    ...mapGetters({
      menuList: 'sharing/menuList',
      latest: 'sharing/latest'
    })
  },
  async asyncData (context) {
    if (!context.popStateEvent) {
      // 请求视讯-PC频道列表
      // if (context.store.state.sharing.menuList && context.store.state.sharing.menuList.length === 0) {
      let menu = await fetch({
        context,
        url: '/information/revision/espn?page=1&rows=30'
      })
      context.store.commit('sharing/MENULIST', {data: menu.data})
      // }
      // 与频道相关数据
      espnCode = context.params.sort
      // 最新话题
      let latest = await fetch({
        context,
        url: '/information/revision/espn/news/latest',
        params: {
          espnCode: espnCode,
          page: 1,
          rows: 5
        }
      })
      context.store.commit('sharing/LATEST', {data: latest.data})
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
  methods: {
    handleFetch () {
      if (!espnCode) {
        espnCode = this.$route.params.sort
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
    }
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
      menuIconClass: [
        { iconClass: 'icon-remen1' },
        { iconClass: 'icon-iosfootball' },
        { iconClass: 'icon-06' },
        { iconClass: 'icon-huwai' },
        { iconClass: 'icon-yule' },
        { iconClass: 'icon-jianshen' },
        { iconClass: 'icon-wanyouxi' },
        { iconClass: 'icon-zonghe' },
        { iconClass: 'icon-quanquanb' }
      ]
    }
  }

}
</script>

<style lang="scss" scoped>
.sort{
  background:#fff;
  padding-top: 30px;
  min-height: 600px;
}
.sort-box{
  position: relative;
  width: 1200px;
  margin: 0 auto;

  .sort-menu {
    position: fixed;
    width:150px;
  }
  .new{
    position:absolute;
    right:0;
    top:0;
  }
  .sort-list{
    width: 700px;
    margin: 0 330px 0 170px;
  }
}
</style>
