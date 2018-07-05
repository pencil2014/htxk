<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/community/marrow' }">求苗社区</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/community/circle/'+ detail.circleId}"  v-if="detail && detail.circleId">{{detail.circleName}}</el-breadcrumb-item>
      <el-breadcrumb-item  v-if="detail && detail.feedId">{{detail.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bbs-content content" v-if="detail && detail.feedId">
      <h1>
        <span v-if="detail.essence" class="tags">精华</span>
        <span>
          {{detail.title}}
        </span>
      </h1>
      <e-cellbox middle>
        <e-cell-item class="photo">
          <a :href="`/personal/${detail.userId}`" target="_blank"><e-avatar class="photo-img" :src="detail.userIcon" :size="[60, 60]" :alt="detail.nickName"></e-avatar></a>
        </e-cell-item>
        <e-cell-item class="info">
          <span class="owner" :title="detail.nickName">{{detail.nickName}}</span>
          <span class="status">楼主</span>
          <span class="publish-tips">发布在</span>
          <span class="classify">{{detail.circleName}}</span>
          <span class="time">{{detail.createTm}}</span>
          <span class="landlord" @click="onlyOwner">{{ownerText}}</span>
          <span class="publish-tips">阅读 {{detail.clickCount}}</span>
          <span class="publish-tips">评论 {{detail.commentCount}}</span>
          <span class="operation" v-if="isPower">
            <el-button type="link" @click="deleteCard">删除帖子</el-button>
          </span>
        </e-cell-item>
      </e-cellbox>
      <div class="container feed-content-box">
        <ul v-if="detail && detail.feedContents">
          <li v-for="(item,index) in detail.feedContents" :key="index">
            <img v-if="item.contentType==2" :src="item.content" width="100%" :alt="item.contentId" />
            <p v-if="item.contentType==1">{{item.content}}</p>
            <div class="video-content" v-if="item.contentType==3">
              <video controls="controls" :src="item.content">
                Your browser does not support the video tag.
              </video>
            </div>
          </li>
        </ul>
      </div>
      <e-cellbox class="bbs-footer" middle>
        <e-cell-item></e-cell-item>
        <e-cell-item class="praise">
          <praise :handleData="detail" :isComment="false" :className="'praise-box'" />
        </e-cell-item>
        <e-cell-item class="share">
          <div class="bdsharebuttonbox tr">
            <a class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
            <a class="icon iconfont icon-qq" data-cmd="sqq" title="分享到QQ"></a>
            <a class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
            <a class="bds_weixin icon iconfont icon-weixin" data-cmd="weixin" title="分享到微信"></a>
          </div>
        </e-cell-item>
      </e-cellbox>
      <comment @handleInit='dataReload' />
    </div>
    <div class="bbs-default content tc" v-else>
      <img src="/images/empty_default.png" alt="暂无数据">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
  import fetch from 'fetch'
  import { pagingList } from 'utils/mixins'
  import { mapState } from 'vuex'
  import bbsApi from 'api/community'
  import comment from './components/Comment'
  import Praise from './components/Praise'
  export default {
    mixins: [pagingList],
    components: {
      comment,
      Praise
    },
    head () {
      return {
        title: this.detail.title + '_' + this.detail.circleName + '_求苗体育社区',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '运动社区,篮球社区,足球社区,体育社区,求苗论坛,体育圈' },
          { hid: 'description', name: 'description', content: this.feedDesc }
        ]
      }
    },
    data () {
      return {
        isPraise: true,
        isOwner: false,
        ownerText: '只看楼主'
      }
    },
    async fetch (context) {
      if (!context.popStateEvent) {
        let feedId = context.params.feedId
        // let feedId = 3582
        let dataFeed = await fetch({
          context,
          url: '/feed/feed',
          params: {
            feedId: feedId
          }
        })
        // if (dataFeed.)
        context.store.commit('community/DETAIL', dataFeed)
        let commentData = Object.assign({}, context.query, {feedId: feedId})
        let comment = await fetch({
          context,
          url: '/feed/feed/comment',
          params: commentData
        })
        context.store.commit('community/COMMENT', comment)
      }
    },
    computed: {
      ...mapState({
        detail: state => state.community.detail
      }),
      isPower () {
        return (this.detail.userId === this.$store.state.user.session.userId || this.detail.createUserId === this.$store.state.user.session.userId)
      },
      feedDesc () {
        let desc = ''
        let judge = true
        for (let i = 0; i < this.detail.feedContents.length; i++) {
          if (judge && this.detail.feedContents[i].contentType === 1) {
            desc = this.detail.feedContents[i].content.slice(0, 80)
            judge = false
          }
        }
        return desc || this.detail.title
      }
    },
    watch: {
      '$store.state.user.session' (data) {
        let commentData = Object.assign({}, this.$route.query, {feedId: this.$route.params.feedId})
        this.$store.dispatch('community/comment_data', commentData)
        this.$store.dispatch('community/feed_detail', {feedId: this.$route.params.feedId})
      }
    },
    methods: {
      bdInit () {
        let baseUrl = location.origin || (location.protocol + '//' + location.host)
        let sharePic = baseUrl + '/images/app_logo.png'
        let shareContent = ''
        for (let i = 0; i < this.detail.feedContents.length; i++) {
          if (this.detail.feedContents[i].contentType === 2) {
            shareContent = this.detail.feedContents[i].content
          }
        }
        sharePic = shareContent || sharePic
        let shareUrl = baseUrl + '/share?type=feed&shareId=' + this.$route.params.feedId + '&share='
        window._bd_share_config = {
          'common': {
            'bdSnsKey': {'bds_tsina': '18129803273', 'popup_sqq': '468642723', 'bds_weixin': 'htxk-open@13322.com', 'bds_qzone': '468642723'},
            'bdText': this.detail.title,
            'bdDesc': '我在求苗发现一个很不错的帖子，赶紧来看看吧！',
            'bdMini': '2',
            'bdMiniList': false,
            'bdPic': sharePic,
            'bdStyle': '0',
            'bdSize': '16'
          },
          'share': {
            bdUrl: shareUrl,
            bdPic: sharePic
          }
        }
        // let url = 'https://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)
        let url = '/static/api/js/share.js'
        let script = document.createElement('script')
        script.setAttribute('src', url)
        document.getElementsByTagName('head')[0].appendChild(script)
      },
      onlyOwner () {
        // this.query.owner = !this.query.owner
        let commentData = Object.assign({}, this.$route.query, {feedId: this.$route.params.feedId})
        if (!this.isOwner) {
          commentData = Object.assign(commentData, {ownerUserId: this.detail.userId})
          this.isOwner = true
          this.ownerText = '看全部'
        } else {
          this.isOwner = false
          this.ownerText = '只看楼主'
        }
        this.$store.dispatch('community/comment_data', commentData)
      },
      deleteCard (cardId) {
        this.$confirm('此操作将永久删除该帖子，是否继续？', '提示', {
          type: 'warning'
        }).then(() => {
          bbsApi.deleteFeed({feedId: this.detail.feedId, circleId: this.detail.circleId}, {successMsg: 'none'}).then((res) => {
            this.$router.push({path: '/community/circle/' + this.detail.circleId})
          })
        })
      },
      dataReload () {
        this.isOwner = false
        this.ownerText = '只看楼主'
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (!window._bd_share_main) {
          this.bdInit()
        } else {
          window._bd_share_main.init()
        }
      })
      // this.$set(this.$store.state, 'isReLoad', 2)
    }
  }
</script>
<style lang="scss">

  .cell-item.textarea{
    .el-textarea__inner{
      background: $bg-gray;
    }
  }
  .feed-content-box img{
  	height:auto!important;
  }
  .bbs-content .praise-box{
      width:75px;
      height:75px;
      cursor:pointer;
      display:block;
      border:1px solid $border-color-red;
      border-radius:50%;
      color: $border-color-red;
      margin:0 auto;
      position: relative;
      &.active{
        color:#fff;
        background:$border-color-red;
      }
      .text{
        display:block;
        margin-top:5px;
        position:absolute;
        top:0;
        left:0;
        width:100%;
      }
      .praise-icon{
        font-size:24px;
        display:block;
        margin-top:-10px;
        position:absolute;
        bottom:5px;
        width:100%;
      }
    }
</style>
<style lang="scss" scoped>

.bbs-content{
  h1{
    font-size:0;
    font-weight:normal;
    padding-bottom:20px;
    span{
        vertical-align: middle;
      font-size:24px;
    }
    .tags{
      font-size:12px;
      background:$color-error;
      padding:3px;
      color: #fff;
        margin-right:15px;
    }
  }
  .photo{
    width:60px;
    height:60px;
    overflow:hidden;
    border-radius:50%;
    a{
      display:block;
      height:60px;
      width:60px;
    }
  }
  .info{
    padding-left:40px;
    .owner{
      max-width:120px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
    }
    .status{
      color: #fff;
      background:$color-warning;
      padding:3px 5px;
      margin:0 10px;
    }
    .publish-tips{
      margin:0 15px;
      color: $color-sub;
    }
    .classify{
      color: $color-link;
    }
    .time{
      margin:0 15px;
      color: $color-sub;
    }
    .operation{
      float:right;
      line-height:10px;
      margin-top:5px;
    }
  }
  .container{
    padding-left:100px;
    ul li{
      padding:5px 0;
      line-height:30px;
    }
  }
  .bbs-footer{
    margin:70px 0;
    .cell-item{
      width:33%;
      text-align:center;
    }
  }
  .divider{
    border-width:2px;
  }
  .heading{
    margin-bottom:0;
  }
  .quote-box{
    margin:20px 0 20px;
    border:1px solid $border-color-base;
    background:$bg-gray;
    padding:20px;
    .quote-content{
      margin-top:30px;
    }
  }
}
.landlord{
  cursor:pointer;
}

.bdsharebuttonbox{
  .icon-xinlang,.icon-QQkongjian,.icon-weixin,.icon-qq{
    float:none;
    background:none;
    margin:0;
    padding:0;
    width: 38px;
    height: 38px;
    font-size: 38px;
    line-height: 38px;
    border-radius:50%;
    margin:0 10px;
  }
  .icon-qq{
    color:#7eaeef;
  }
  .icon-xinlang{
    color: #f35d5d;
  }
  .icon-QQkongjian{
    color: #f5be3f;
  }
  .icon-weixin{
    color: #19d100;
  }
}
.bbs-content{
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
.bbs-default{
  color: $color-sub;
}

</style>


