<template>
<div class="personal-list">
    <el-tabs v-model="activeNameShareA" @tab-click="changeTabNav" class="ac-nav">
        <el-tab-pane label="帖子" name="0">
            <div v-if="activeNameShareA === '0'">
                <div v-if="feedInfo && feedInfo.list && feedInfo.list.length>0">
                    <ul class="share-box" v-for='(item, index) in feedInfo.list' :key="index" :item='item'>
                        <li class="list"> 
                            <nuxt-link :to="'/community/detail/'+item.feedId">
                                <div class="user-box">
                                    <div class="user-img"><e-avatar :src="item.userIcon" :size='[50, 50]' /><e-img :src="item.userIcon" :size='[50, 50]'/></div>
                                    <div class="user-info"><p class="author">{{item.nickName}} <span class="approve-icon"><e-img :src="item.pcImgTxtUrl" :size='[64, 14]'/></span></p><p class="time">{{item.createTm}}</p></div>
                                </div>
                                <div class="user-content">
                                    <div class="content-list">
                                        <div v-for='(feedContents, index) in item.feedContents' :key="index" v-if='feedContents.contentType == 1'>
                                            <p>
                                                {{feedContents.content}}
                                            </p>
                                        </div>
                                        <ul class="share-images" v-for='(feedContents, index) in item.feedContents' :key="index" v-if='feedContents.contentType == 2'>
                                            <li><e-img :src="feedContents.content" :size='[180, 100]'/></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="share-footer"> 
                                    <div class="share-remark fl" v-for='(labelList, index) in item.labels' :key="index" :item='labelList'>
                                        <span class="label">{{labelList.labelName}}</span>
                                    </div> 
                                    <div class="share-reply fr">
                                        <span class="number-box replay"><i class="iconfont icon-pinglun"></i> <em class="number">{{item.commentCount}}</em> </span>
                                        <span class="number-box praice"> <i class="iconfont icon-zankongxingai"></i> <em class="number">{{item.diggCount}}</em></span> 
                                    </div> 
                                    <div class="clearx"></div>
                                </div>
                            </nuxt-link>
                        </li>
                    </ul>
                </div>
                <e-placeholder v-else text="没有发布帖子哦"/>
                <el-pagination
                    v-bind="getPaginationProps(feedInfo)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="资讯" name="1">
            <div v-if="activeNameShareA === '1'">
                <div class="user-news-box" v-if="articleInfo && articleInfo.list && articleInfo.list.length>0">
                    <ul class="user-news">
                        <li class="news-commonbox textwrap-box" v-for='(articel, index) in articleInfo.list' :key="index">
                            <dl class="left-graphic" v-if="articel.coverUrl && articel.coverUrl.length === 1">
                                <dt v-for='(articelCoverUrl, index) in articel.coverUrl' :key="index">
                                    <nuxt-link :to="articel.url || ''" target="_blank">
                                        <e-img :src="articelCoverUrl" :size='[160, 90]'/>
                                    </nuxt-link>
                                </dt>
                            </dl>
                            <div class="right-inforbox">
                                <h4><nuxt-link :to="articel.url || ''" target="_blank"> {{articel.title}}</nuxt-link></h4>
                                <!-- 多张图片并列图片显示 -->
                                <dl class="left-graphic more-img-list" v-if="articel.coverUrl && articel.coverUrl.length > 1" >
                                    <dt v-for='(articelCoverUrl, index) in articel.coverUrl' :key="index" v-if="index < 3">
                                        <nuxt-link :to="articel.url || ''" target="_blank">
                                            <e-img :src="articelCoverUrl" :size='[160, 90]'/>
                                        </nuxt-link>
                                    </dt>
                                    <dt v-if="articel.coverUrl && articel.coverUrl.length > 2" class="more-news-li"><nuxt-link :to="articel.url || ''" target="_blank">查看更多</nuxt-link></dt>
                                </dl>
                                <p class="article-desc" v-if="articel.coverUrl && articel.coverUrl.length === 0">{{articel.summary}}</p>
                                <div class="report-box"> 
                                    <div class="report-office"> <span class="office-icon smalluser-icon"></span> <span class="text">{{articel.authorName}}</span> </div>
                                    <div class="time-reply"> 
                                        <label class="time-label">{{articel.publishTimeFormat}}</label> 
                                        <div class="report-replybox"> <i class="iconfont icon-pinglun"></i> <span class="number">{{articel.commentCount}}</span> </div> 
                                        <div class="report-likenumber"> <i class="iconfont icon-zankongxingai"></i> <span class="number">{{articel.clickCount}}</span> </div>
                                    </div>
                                </div> 
                            </div> 
                        </li>
                    </ul>
                </div>
                <e-placeholder v-else text="一条资讯都没有"/>
                <el-pagination
                    v-bind="getPaginationProps(articleInfo)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="相册" name="2">
            <div v-if="activeNameShareA === '2'">
                <div class="user-photo-box" v-if="photoInfo && photoInfo.data && photoInfo.data.length>0">
                    <ul>
                        <li class="li-box" v-for='(photoInfoList, index) in photoInfo.data' :key="index">
                        <div class="time">{{photoInfoList.dataTime}}</div>
                        <dl class="list">
                            <dt v-for='(photoList, index) in photoInfoList.list' :key="index" :item='photoList'><e-img :src="photoList.thumbFileName" :size='[100, 100]'/></dt> 
                            </dl> 
                            <div class="clearx"></div> 
                        </li>
                    </ul>
                </div>
                <e-placeholder v-else text="一张图片都没有"/>
                <el-pagination
                    v-bind="getPaginationProps(photoInfo)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="3">
            <div v-if="activeNameShareA ==='3'">
                <div class="user-video-box" v-if="videoInfo && videoInfo.list && videoInfo.list.length>0">
                    <ul>
                        <li class="news-commonbox textwrap-box " v-for='(videoList, index) in videoInfo.list' :key="index" :item='videoList'>
                            <div class="left-graphic">
                                <nuxt-link :to="'/video/detail/'+videoList.videoId" target="_blank">
                                    <e-img :src="videoList.imgUrl" :size='[160, 97]'/>
                                    <span class="bg">{{videoList.playTimeFormat}}</span> 
                                </nuxt-link>
                            </div>
                            <div class="right-inforbox">
                                <h4> <nuxt-link :to="'/video/detail/'+videoList.videoId" target="_blank">{{videoList.nickName}}</nuxt-link></h4> 
                                <div class="report-box"> 
                                    <div class="report-office"> 
                                        <span class="text">{{videoList.createTimeFormat}}</span> 
                                    </div>
                                    <div class="time-reply"> 
                                        <label class="time-label"> <i class="iconfont icon-guankan"></i> <span class="number">{{videoList.playCount}}</span></label> 
                                    </div> 
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <e-placeholder v-else text="一个视频都没有"/>
                <el-pagination
                    v-bind="getPaginationProps(videoInfo)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                    
                >
                </el-pagination>
            </div>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script type="text/javascript">
import { pagingList } from 'utils/mixins'
import { mapGetters } from 'vuex'
import ElPagination from '@element-ui/Pagination'
export default {
  mixins: [pagingList],
  components: {
    ElPagination
  },
  computed: {
    ...mapGetters({
      feedInfo: 'personal/feed',
      articleInfo: 'personal/article',
      photoInfo: 'personal/photo',
      videoInfo: 'personal/video'
    }),
    activeNameShareA: {
      get () {
        return this.$route.query.shared || '0'
      },
      set (value) {
      }
    }
  },
  methods: {
    changeTabNav (tab, event) {
      if (this.query.shared !== tab.index) {
        this.query.type = '0'
        this.query.shared = tab.index
        this.query.rows = 5
        this.query.page = 1
        this.submit()
      }
    }
  },
  data () {
    return {
      iconUrl: '',
      // this.query分页调用
      query: this.getQuery({
        page: this.$route.query.page,
        rows: this.$route.query.rows || 5,
        type: '0',
        shared: this.$route.query.shared || '0',
        fans: '0'
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.user-video-box{
    .left-graphic {
        width: 160px;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        margin-right: 20px;
    }
    .left-graphic span.bg {
        width: 100%;
        display: block;
        height: 20px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        position: absolute;
        bottom: 0;
        font-size: 12px;
        padding-left: 5px;
        box-sizing: border-box;
    }
    .right-inforbox {
        display: inline-block;
        vertical-align: top;
        width: 625px;
        h4{
            font-size: 20px;
            padding: 15px 0;
        }
    }
    .icon-guankan{
        color: #999;
    }
    .report-box {
        color: #999;
    }
    .report-office span.text {
        color: #666;
        padding-left: 5px;
    }
    .report-office {
        display: inline-block;
    }
    .time-reply {
        display: inline-block;
        margin-left: 20px;
        font-size: 12px;
    }
    .time-label i{
        display: inline-block;
        padding-right: 6px;
        vertical-align: middle;
    }
    .textwrap-box {
        padding: 20px 0;
        border-bottom: 1px solid #f2f2f2;
    }
}
.user-photo-box{
   .time {
        padding: 10px 0;
   }
   .li-box {
        padding: 10px 0 10px;
    }
   .li-box dl.list dt {
        float: left;
        margin: 0 10px 10px 0;
        width: 100px;
        height: 100px;
        overflow: hidden;
    }
    .clearx{
        clear: both;
    }
}
.user-news-box{
    .textwrap-box {
        padding: 20px 0;
        border-bottom: 1px solid #f2f2f2;
        overflow: hidden;
    }
    .more-img-list{
        margin-bottom: 10px;
    }
    .more-news-li{
        width: 135px;
        height: 90px;
        background: #e8e8e8;
        text-align: center;
        display: inline-block;
        margin-left: 5px;
        position: relative;
        line-break: 90px;
        a{
            line-height: 90px;
            color: #3983e5;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
        }
    }

    .left-graphic {
        vertical-align: middle;
        margin: 15px 20px 10px 0;
        float: left;
        overflow: hidden;
        dt{
            height: 90px;
            float: left;
            margin-right: 10px;
        }
    }
     .right-inforbox {
        vertical-align: top;
        width: 720px;
        h4{
            font-size: 20px;
            padding: 15px 0 0 0;
        }
    }
     .report-box {
        color: #999;
        padding: 0;
        margin: 0;
        border: 0;
    }
    .report-office {
         display: inline-block;
    }
    .time-reply {
        display: inline-block;
        margin-left: 20px;
        font-size: 12px;
    }
    .time-label {
        display: inline-block;
    }
    .report-replybox {
        display: inline-block;
        margin-left: 20px;
    }
    .report-likenumber {
        display: inline-block;
        margin-left: 20px;
    }
    .time-reply span.number {
        padding-left: 5px;
        color: #999;
    }
    .report-office span.text {
        color: #666;
        padding-left: 5px;
    }
    .article-desc{
        line-height: 24px;
        color: #666666;
        padding-bottom: 6px;
    }

}
.share-box{
    .user-img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
    }
    .user-info{
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
    }
    li.list {
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;
        overflow: hidden;
    }
    .time{
        display: block;
        font-size: 12px;
        color: #999;
    }
    .author {
        display: block;
        font-size: 16px;
        font-weight: bold;
    }
    .approve-icon{
        display: inline-block;
        height: 14px;
    }
    .share-images{
        margin-top: 20px;
    }
    .share-images li {
        width: 180px;
        height: 100px;
        margin: 0px 10px 10px 0;
        float: left;
        overflow: hidden;
    }
    .share-footer{
        clear: both;
    }
    .share-remark span {
        padding: 2px 12px;
        background: #f0f0f0;
        color: #999;
        margin-right: 10px;
    }
    .content-list{
        clear: both;
        margin-bottom: 10px;
    }
    .user-content{
        margin-top:20px;
    }
    .share-reply {
        color: #999;
    }
    .number{
        font-style: normal;
        color: #999;
        padding-left: 4px;
        display: inline-block
    }
    .share-reply .replay {
        margin-right: 20px; 
    }
    .fr{
        float: right;
    }
    .fl{
        float: left
    }
}
</style>

