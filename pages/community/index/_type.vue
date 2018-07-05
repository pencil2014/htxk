<template>
  <div class="community-list-item" >
    <e-list-view 
      v-if='postList && postList.list && postList.list.length > 0'
      @fetch="handleFetch" 
      :loading.sync="loading" 
      :is-more="isMore" :params='query'>
      <div v-for='(item, index) in postList.list' :key='index'>
        <post-item-img-one  :ItemData='item' 
          v-if='item.feedContentRespVOS && (item.feedContentRespVOS.length > 0 && item.feedContentRespVOS.length < 4)'  />
        <post-item :ItemData='item'  v-else  />
      </div>
    </e-list-view>
    <div class="replay-default tc" v-else>
      <img src="/images/empty_default.png" alt="暂无数据">
      <p style='color: #999;'>暂无相关帖子</p>
    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/community'
import EListView from '@e-ui/ListView'
import PostItem from '../components/PostItem'
import PostItemImgOne from '../components/PostItemImgOne'
import { mapGetters } from 'vuex'

let queryType = ''

export default {
  components: {
    EListView,
    PostItem,
    PostItemImgOne
  },
  async asyncData (context) {
    if (!context.popStateEvent) {
      let circleType = context.store.state.community.menu
      if (context.store.state.community.menu.length === 0) {
        circleType = await fetch({
          context,
          url: '/community/guest/circle/circleType'
        })
        circleType = circleType.data
      }
      // 服务端请求只有成功，页面才会出来
      queryType = 'error'
      if (!context.params.type || context.params.type === 'marrow') {
        queryType = 'marrow'
      } else if (circleType) {
        let i = 0
        for (i; i < circleType.length; i++) {
          let item = circleType[i]
          if (context.params.type === item.describe) {
            queryType = item.type
            break
          }
        }
      }
      if (queryType === 'error') {
        return
      }
      if (queryType === 'marrow') {
        let queryData = {
          page: context.query.page || 1,
          rows: 10
        }
        let feedCircle = await fetch({
          context,
          url: '/community/guest/circle/marrowFeed',
          params: queryData
        })
        let isMore = true
        if (feedCircle.data && feedCircle.data.list && (feedCircle.data.list.length >= feedCircle.data.total)) {
          isMore = false
        }
        queryData.page = queryData.page + 1
        return { 'postList': feedCircle.data, 'query': queryData, 'loading': false, 'isMore': isMore }
      } else {
        let queryData = {
          type: queryType,
          page: context.query.page || 1,
          rows: 10
        }
        let feedCircle = await fetch({
          context,
          url: '/community/guest/circle/typeMarrowFeed',
          params: queryData
        })
        let isMore = true
        if (feedCircle.data && feedCircle.data.list && (feedCircle.data.list.length >= feedCircle.data.total)) {
          isMore = false
        }
        queryData.page = queryData.page + 1
        return { 'postList': feedCircle.data, 'query': queryData, 'loading': false, 'isMore': isMore }
      }
    }
  },
  methods: {
    handleFetch () {
      if (queryType === 'error') {
        return
      }
      this.page++
      if (queryType === 'marrow') {
        if (this.postList.list.length >= this.postList.total) {
          this.loading = false
          this.isMore = false
          this.postList = JSON.parse(JSON.stringify(this.postList)) // 触发了加载更多数据没变，loading关不掉
          return
        }
        let queryData = {
          page: this.page,
          rows: this.rows
        }
        this.query = queryData
        api.marrowFeed(queryData).then((res) => {
          this.loading = false
          this.postList.list.push(...(res.data.list))
          if (this.postList.list.length >= this.postList.total) {
            this.isMore = false
          }
        })
      } else {
        if (this.postList.list.length >= this.postList.total) {
          this.loading = false
          this.isMore = false
          this.postList = JSON.parse(JSON.stringify(this.postList))
          return
        }
        let queryData = {
          type: queryType,
          page: this.page,
          rows: this.rows
        }
        this.query = queryData
        api.typeMarrowFeed(queryData).then((res) => {
          this.loading = false
          this.postList.list.push(...(res.data.list))
          if (this.postList.list.length >= this.postList.total) {
            this.isMore = false
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      menuList: 'community/menu'
    })
  },
  mounted () {
    if (this.menuList) {
      let i = 0
      queryType = 'error'
      for (i; i < this.menuList.length; i++) {
        let item = this.menuList[i]
        if ((!this.$route.params.type) || this.$route.params.type === 'marrow') {
          queryType = 'marrow'
          break
        } else if (this.$route.params.type === item.describe) {
          queryType = item.type
          break
        }
      }
      if (queryType === 'error') {
        this.$router.push('/error')
      }
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
      type: 0,
      loading: false,
      isMore: true,
      postList: {}
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

<style lang='scss'>
.community-list-item{
  .el-tabs__item {
    min-width: 70px;
    font-size: 18px;
    line-height:38px;
  }
}
</style>
