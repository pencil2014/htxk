<template>
  <div >
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }" >求苗首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='personal-content'>
      <article>
        <div class="personal-tp" v-if="personalInfo">
          <div class="per-logo"><e-avatar :src="personalInfo.personal.iconUrl" :size='[120, 120]'/></div>
          <div class="per-info">
              <h1 class="per-title">{{ personalInfo.personal.nickName }}</h1><span v-if="personalInfo.personal"><Follow :item="personalInfo.personal"/></span>
              <p class="per-msg approve-box" v-if="personalInfo.ipAuthCate && personalInfo.ipAuthCate.pcImgTxtUrl">
							    <e-img :src="personalInfo.ipAuthCate.pcImgTxtUrl" :size='[64, 14]'/>
						  </p>
              <p class="per-msg"><i class="iconfont icon-shape3"></i> {{ personalInfo.personal.area }}</p>
              <p class="per-msg" v-if="personalInfo.personal.sign">签名： {{ personalInfo.personal.sign}}</p>
          </div>
          <ul class="per-act">
              <li>
                <p class="number">{{ personalInfo.personal.focus }}</p> 
                <p class="text">关注</p>
              </li>
              <li class="border0">
                <p class="number">{{ personalInfo.personal.fans }}</p>
                <p class="text">粉丝</p>
              </li>
          </ul>
          <div class="per-act"></div>
        </div>
        <div class="personal-box">
           <el-tabs v-model="activeName" @tab-click="changeTab" class="ac-menu">
            <el-tab-pane label="分享" name="0">
                <Share v-if="activeName==='0'" />
            </el-tab-pane>
            <el-tab-pane label="粉丝" name="1">
                <Fans v-if="activeName==='1'" />
            </el-tab-pane>
            <el-tab-pane label="服务" name="2">
                <Service v-if="activeName==='2'" />
            </el-tab-pane>
            <el-tab-pane label="赛事" name="3" v-if="personalInfo.personal.ipCateId== 510">
                <Match v-if="activeName==='3'" />
            </el-tab-pane>
          </el-tabs>
        </div>
        
      </article>
      <aside>
        <div class="per-topic-box"><Topic/></div>
        <div class="per-ad-list"><Ad/></div>
      </aside>
    </div>
  </div>
</template>

<script type="text/javascript">
import { pagingList } from 'utils/mixins'
import fetch from 'fetch'
import Ad from './components/ad'
import Share from './components/share'
import Fans from './components/fans'
import Topic from './components/topic'
import Service from './components/service'
import Match from './components/match'
import Follow from '../components/Follow'
export default {
  mixins: [pagingList],
  watchQuery: true,
  components: {
    Ad,
    Topic,
    Fans,
    Share,
    Service,
    Match,
    Follow
  },
  data () {
    return {
      logoUrl: '',
      query: this.getQuery({
        page: this.$route.query.page || 1,
        rows: this.$route.query.rows || 5,
        type: this.$route.query.type || '0',
        shared: this.$route.query.shared || '0'
      })
    }
  },
  computed: {
    // 判断当前用户是否是自己
    // isMine () {
    //   return this.userInfoIndex.index === this.$store.state.user.session.userId
    // }
    activeName: {
      get () {
        return this.$route.query.type || '0'
      },
      set (value) {
      }
    }
  },
  methods: {
    changeTab (tab, event) {
      if (this.query.type !== tab.index) {
        this.query.type = tab.index
        this.query.rows = 5
        this.query.page = 1
        this.query.shared = '0'
        this.query.fans = '0'
        this.submit()
      }
    }
  },
  mounted () {
    // console.log('userId:', this.$route.query.type)
  },
  async asyncData (context) {
    // 个人信息服务端渲染
    let personalInfoData = await fetch({
      context,
      url: '/personal/index/' + context.params.index
    })
    context.store.commit('personal/NEWS', {data: personalInfoData.data.newsList})
    if (!context.query.type || context.query.type === '0') {
      if (!context.query.shared || context.query.shared === '0') {
        // 分享- 帖子
        let feedInfoData = await fetch({
          context,
          url: '/personal/index/share/feed',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/FEED', {data: feedInfoData.data})
      }
      if (context.query.shared === '1') {
        // 分享- 资讯
        let articleInfoData = await fetch({
          context,
          url: '/personal/index/share/article',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/ARTICLE', {data: articleInfoData.data})
      }
      if (context.query.shared === '2') {
        // 分享- 相册
        let photoInfoData = await fetch({
          context,
          url: '/personal/index/share/photo',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/PHOTO', {data: photoInfoData.data})
      }
      if (context.query.shared === '3') {
        // 分享- 视频
        let videoInfoData = await fetch({
          context,
          url: '/personal/index/share/video',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/VIDEO', {data: videoInfoData.data})
      }
    }
    if (context.query.type === '1') {
      // 粉丝
      if (context.query.fans === '0') {
        let fansInfoData = await fetch({
          context,
          url: '/personal/index/fans/page',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/FANS', {data: fansInfoData.data})
      }
      // 关注
      if (context.query.fans === '1') {
        let followInfoData = await fetch({
          context,
          url: '/personal/index/follow/page',
          params: Object.assign({
            userId: context.params.index,
            page: 1,
            rows: 5
          }, context.query)
        })
        context.store.commit('personal/FOLLOW', {data: followInfoData.data})
      }
    }
    if (context.query.type === '2') {
      // 服务
      let serviceInfoData = await fetch({
        context,
        url: '/personal/index/service',
        params: {userId: context.params.index, page: 1}
      })
      context.store.commit('personal/SERVICE', {data: serviceInfoData.data})
    }
    if (context.query.type === '3') {
      // 赛事
      let matchInfoData = await fetch({
        context,
        url: '/match/center/page',
        params: Object.assign({
          userId: context.params.index,
          page: 1,
          rows: 5
        }, context.query)
      })
      context.store.commit('personal/MATCH', {data: matchInfoData.data})
    }
    return {'personalInfo': personalInfoData.data}
  }
}
</script>
<style lang="scss" scoped>
  
  .personal-content{
    width: 1200px;
    margin: 0 auto;
    .approve-box{
      height: 14px;
      margin: 5px 0 10px 0;
      zoom: 1
    }
    .follow-btn{
      display: inline-block;
      margin-left: 10px;
    }
    article{
      display: inline-block;
      vertical-align: top;
      width: 894px;
      .personal-box{
        background: #fff;
      }
      // header
      .personal-tp{
        background: #fff;
        padding: 25px 20px 18px 20px;
        border-bottom: 1px solid #ebf0f5;
        .per-logo{
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 30px;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
        }
        .per-info,.per-act{
          display: inline-block;
        }
        .per-info{
          max-width: 420px;
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          vertical-align: top;
          margin-top: 20px;
        }
        .per-title{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 400px;
          display: inline-block;
          vertical-align: middle;
          font-size: 24px;
        }
        .per-msg{
          color: #999;
        }
        .per-act{
          margin: 30px 0  0 40px; 
          li {
            padding: 0 30px;
            float: left;
            height: 46px;
            border-right: 1px solid #f0f0f0;
            text-align: center;
            .number{
              font-size: 18px;
              color: #fc6f00;
            }
          }
        }
      }
      .personal-list{
        min-height: 400px;
        overflow: hidden;
        padding: 10px 40px 40px;
      }
    }
    aside{
      display: inline-block;
      vertical-align: top;
      width: 286px;
      margin-left:20px;
      overflow: hidden;
      .per-topic-box{
        background: #fff
      }
    }
  }
</style>
<style lang="scss">
// menu
  .personal-box{
    .el-tabs__nav{
      margin-left: 40px;
    }
    .el-tabs__nav-scroll{
      border-bottom: 20px solid #ebf0f5;
    }
    .ac-nav{
      .el-tabs__nav-scroll{
        border-bottom: 1px solid #ebf0f5;
      }
      .el-tabs__header{
        border-bottom: none;
        margin: 0;
      }
      .el-tabs__item{
        min-width: auto;
        padding: 4px 32px;
      }
      .el-tabs__item.is-active{
        background: #00bb90;
        color: #fff;
        border: none;
        line-height: 18px;
        min-width: auto;
        text-align: center;
        margin: 0 16px;
        padding: 4px 16px;
        border-radius: 14px;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
      .el-tabs__active-bar{
        background-color:#fff;
      }
      .el-tabs__nav{
        margin-left: 0
      }
    }
  }
</style>