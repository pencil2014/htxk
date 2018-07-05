<template>
  <div class="coterie">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/community/marrow' }" >求苗社区</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/community/list/' + breadcrumbDescribe, query:{type: breadcrumbType}}">{{breadcrumbName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{coterieData.circleName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="coterie-content">
      <div class="coterie-main ">
        <head-info />
        <div class="post">
          <el-button type="primary" style="font-size:16px;" @click="operateInApp">
            <i class="icon iconfont" style="margin-right:5px;">&#xe919;</i>
            发帖
          </el-button>
          <list/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import HeadInfo from './components/HeadInfo'
import List from './components/List'
import { mapGetters } from 'vuex'

export default {
  watchQuery: true,
  layout: 'bbs',
  components: {
    HeadInfo,
    List
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 圈子详情
      let circleDetail = await fetch({
        context,
        url: '/community/guest/circle/circleDetail',
        params: {'circleId': context.params.index}
      })
      context.store.commit('community/CIRCLE_DETAIL', {data: circleDetail.data})
      // 当前圈子下的帖子
      let typeData = {
        type: context.query.type || 1,
        rows: context.query.rows || 15
      }
      let circleFeed = await fetch({
        context,
        url: '/community/guest/circle/circleFeed',
        params: Object.assign({'circleId': context.params.index}, context.query, typeData)
      })
      context.store.commit('community/CIRCLE_FEED', {data: circleFeed.data})
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.type) {
      let type = this.$route.query.type.toString()
      if (type !== '1' && type !== '2' && type !== '3') {
        this.$router.push('/error')
      }
    }
  },
  data () {
    return {
      breadcrumbDescribe: 'my',
      breadcrumbType: ''
    }
  },
  computed: {
    ...mapGetters({
      coterieData: 'community/circle_detail',
      menuList: 'community/menu'
    }),
    breadcrumbName () {
      for (let item of this.menuList) {
        if (item.type === this.coterieData.circleType) {
          this.breadcrumbDescribe = item.describe
          this.breadcrumbType = item.type
          return item.name
        }
      }
      return '圈子分类'
    }
  },
  head () {
    if (this.coterieData) {
      return {
        title: `${this.coterieData.circleName}_求苗体育社区`,
        meta: [
          {name: 'keywords', content: this.coterieData.circleName},
          {
            hid: 'description',
            name: 'description',
            content: '求苗社区以篮球,足球,NBA,网球,羽毛球,电竞娱乐,跑步话题为主，为拥有热情的体育爱好者们创造良好讨论氛围，提供个性化功能，加入兴趣圈子，参与社区讨论！'
          }
        ]
      }
    }
  },
  methods: {
    operateInApp () {
      this.$alert('使用该功能，需下载APP', '提示', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.coterie{
  background: #fff;
  min-height: 800px;
  .post{
    padding:40px;
    border-top:20px solid rgba(235,240,246,1);
    button{
      margin-bottom: 20px;
    }
  }
}

</style>

<style lang="scss">
.coterie{
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
}
</style>
