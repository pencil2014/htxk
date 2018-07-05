<template>
  <div class="sub-menu-content">
    <div v-if='type !== "my"' class="mot-my">
      <e-list-view  
        v-if='menuDetailList && menuDetailList.list && menuDetailList.list.length > 0'
        @fetch="handleFetch" :loading.sync="loading" :is-more="isMore" :params='query'>
        <el-row  class="sub-menu"  :gutter="20">
          <el-col :span="6" v-for='(item, index) in menuDetailList.list' :key='index'>
            <dl :title='item.name' >
              <nuxt-link target='_blank'  :to='"/community/circle/" + item.circleId' style='display:block;' >
                <dt class="img">
                  <e-avatar :size='[52, 52]'  :src='item.icon' />
                </dt>
                <dd class="bbs-name">
                  <div class='post-name'>
                    <span class="post-name-text">{{item.circleName}}</span>
                    <i class="icon iconfont" v-if='item.isHot == 2' >&#xe697;</i>
                  </div>
                  <div class="bbs-num">帖子: {{item.feedCount || 0}}</div>
                </dd>
              </nuxt-link>
            </dl>
          </el-col>
        </el-row>
      </e-list-view>

      <div class="replay-default tc" v-if='menuDetailList && menuDetailList.list && menuDetailList.list.length === 0'>
        <img src="/images/empty_default.png" alt="暂无数据">
        <p style='color:#999;'>暂无相关圈子</p>
      </div>
    </div>

    <div v-else class="my">
      <e-list-view  
        v-if='isLogin && menuDetailList && menuDetailList.list && menuDetailList.list.length > 0'
        @fetch="handleFetch" :loading.sync="loading" :is-more="isMore" >
        <el-row  class="sub-menu"  :gutter="20">
          <el-col :span="6" v-for='(item, index) in menuDetailList.list' :key='index'>
            <dl :title='item.name' >
              <nuxt-link target='_blank'   :to='"/community/circle/" + item.circleId' style='display:block;' >
                <dt class="img">
                  <e-avatar :size='[52, 52]'  :src='item.icon' />
                </dt>
                <dd class="bbs-name">
                  <div class='post-name'>
                    <span class="post-name-text">{{item.circleName}}</span>
                    <i class="icon iconfont" v-if='item.isHot == 2' >&#xe697;</i>
                  </div>
                  <div class="bbs-num">帖子: {{item.feedCount || 0}}</div>
                </dd>
              </nuxt-link>
            </dl>
          </el-col>
        </el-row>
      </e-list-view>

      <div class="replay-default tc" v-if='isLogin && menuDetailList && menuDetailList.list && menuDetailList.list.length === 0'>
        <img src="/images/empty_default.png" alt="暂无数据">
        <p style='color:#999;' >您还没有关注或创建圈子</p>
      </div>

      <div class="replay-default tc"  v-if="!isLogin" >
        <img src="/images/empty_default.png" alt="暂无数据">
        <div style='color:#999;' >
          <span class="link" @click="toLogin">登录</span>，查看我的圈子
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/community'
import tools from 'utils/tools'
import EListView from '@e-ui/ListView'
import Vue from 'vue'

export default {
  components: {
    EListView
  },
  async asyncData (context) {
    if (!context.popStateEvent) {
      // 是undefined，或者 my(我的圈子)
      if (!context.query.type || context.query.type === 'my') {
        return { type: 'my', 'menuDetailList': {list: []}, 'loading': false }
      } else {
        let queryData = {
          type: context.query.type,
          page: context.query.page || 1,
          rows: 32
        }
        let feedCircle = await fetch({
          context,
          url: '/community/guest/circle/feedCircle',
          params: queryData
        })
        let isMore = true
        if (feedCircle.data && feedCircle.data.list && (feedCircle.data.list.length >= feedCircle.data.total)) {
          isMore = false
        }
        queryData.page = queryData.page + 1
        return { 'menuDetailList': feedCircle.data, query: queryData, 'loading': false, isMore, type: context.query.type }
      }
    }
  },
  watch: {
    // '$store.state.user.session': (data) => {
    //   if (data) {
    //     this.isLogin = true
    //   } else {
    //     this.isLogin = false
    //   }
    // },
    '$route': 'myCircle'
  },
  computed: {
    isLogin () {
      let userId = this.$store.state.user.session.userId
      if (userId) {
        if (this.loginQueryFlag && (!this.$route.query.type || this.$route.query.type === 'my')) {
          if (this.menuDetailList.list.length > 0) {
            this.menuDetailList = {
              list: []
            }
          }
          this.myCircle()
        }
        this.loginQueryFlag = false
        return true
      } else {
        this.loginQueryFlag = true
        return false
      }
    }
  },
  mounted () {
    this.myCircle()
  },
  methods: {
    toLogin () {
      Vue.component('XLogin', function (resolve) {
        require(['@/pages/member/components/XLogin'], resolve)
      })
      this.$set(this.$store.state, 'loginDialog', true)
    },
    myCircle () {
      setTimeout(() => {
        if ((!this.$route.query.type || this.$route.query.type === 'my') && this.menuDetailList.list.length === 0) {
          this.type = 'my'
          this.getMyCricle()
        }
      }, 200)
    },
    getMyCricle () {
      if (tools.getHeaders(window.document.cookie)) {
        if (this.menuDetailList.list.length >= this.menuDetailList.total) {
          this.loading = false
          this.isMore = false
          this.menuDetailList = JSON.parse(JSON.stringify(this.menuDetailList)) // 触发了加载更多数据没变，loading关不掉
          return
        }
        let queryData = {
          page: this.myPage,
          rows: this.query.rows
        }
        this.query = queryData
        api.myCircle(queryData).then((res) => {
          this.loading = false
          if (this.myPage === 1) {
            this.menuDetailList = res.data
          } else {
            this.menuDetailList.list.push(...(res.data.list))
          }
          if (this.menuDetailList.list.length >= this.menuDetailList.total) {
            this.isMore = false
          } else {
            this.myPage++
          }
        })
      } else {
        this.menuDetailList = {
          list: []
        }
      }
    },
    handleFetch () {
      if (!this.$route.query.type || this.$route.query.type === 'my') {
        this.type = 'my'
        this.getMyCricle()
      } else {
        this.type = this.$route.query.type
        if (this.menuDetailList.list.length >= this.menuDetailList.total) {
          this.loading = false
          this.isMore = false
          this.menuDetailList = JSON.parse(JSON.stringify(this.menuDetailList)) // 触发了加载更多数据没变，loading关不掉
          return
        }
        let queryData = {
          type: this.$route.query.type,
          page: this.query.page,
          rows: this.query.rows
        }
        this.query = queryData
        api.feedCircle(queryData).then((res) => {
          this.loading = false
          this.menuDetailList.list.push(...(res.data.list))
          if (this.menuDetailList.list.length >= this.menuDetailList.total) {
            this.isMore = false
          } else {
            this.query.page++
          }
        })
      }
    }
  },
  data () {
    return {
      query: {
        rows: 32,
        page: 1
      },
      type: 0,
      myPage: 1,
      loading: false,
      isMore: true,
      menuDetailList: {
        list: []
      }
    }
  }
}
</script>

<style lang="scss"  scoped>

.sub-menu-content{
  .sub-menu{
    dl{
      height: 60px;
      margin-bottom: 60px;
      &:hover{
        .img{
          border-color: $color-primary;
        }
        .post-name .post-name-text{
          color: $color-primary;
        }
      }
    }
    .img{
      display:inline-block;
      height: 56px;
      width: 56px;
      border-radius: 100%;
      overflow: hidden;
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
      margin-right:10px;
      border: 2px solid #fff;
    }
    .bbs-name{
      display:inline-block;
      vertical-align: top;
      max-width: 150px;
      .post-name{
        line-height: 28px;
        margin-bottom:8px;
        .post-name-text{
          height: 18px;
          line-height: 14px;
          display: inline-block;
          vertical-align: bottom;
          max-width: 120px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        i{
          height: 28px;
          line-height: 28px;
          vertical-align: top;
          display: inline-block;
          font-size:28px;
          color: red;
        }

      }
      .bbs-num{
        color:$color-sub;
        font-size: 12px;
        line-height:12px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }
  }
}
</style>
