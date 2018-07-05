<template>
  <div class="video-container">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/video' }">精彩视频</el-breadcrumb-item>
      <el-breadcrumb-item>{{detail.videoVo.videoName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="video-content">
      <h1 class="title">{{detail.videoVo.videoName}}
        <span class="report">
          <report :tipoff-type='3' :res-id='videoId'/>
        </span>
      </h1>
      <div class="video-box">
        <div class="video-wrapp" :class="isShow?'':'video-fullscreen'">
          <video-player @ended="onPlayerEnded($event)" :playerOptions='playerOptions' />
          <div class="share-container">
            <span class="share-box">
              <i class="iconfont">&#xe66f;</i>
              分享给朋友：
            </span>
             <div class="bdsharebuttonbox tr">
                <a class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
                <a class="icon iconfont icon-qq" data-cmd="sqq" title="分享到QQ"></a>
                <a class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
                <a class="bds_weixin icon iconfont icon-weixin" data-cmd="weixin" title="分享到微信"></a>
              </div>
           </div>
           <div class="control-video" @click="showList">
             <i class="iconfont">&#xe915;</i>
           </div>
        </div>
        <ul class="video-play-list scrollbar" v-if="isShow">
          <li v-for="(item,index) in playList " :class="index == playIndex ? 'play-active':''" v-if="playList.length>0" @click="play(item.videoId, index)" :key="index">
            <div class="photo">
              <e-img :src="item.imgUrl" :size="[110,60]" :alt="item.videoName" />
              <div class="time">
                <span class="triangle"></span>
                <span>{{item.playTimeFormat}}</span>
              </div>
            </div>
            <div class="text">
              <e-text :line-clamp="2" height="48px">{{item.videoName}}</e-text>
            </div>
          </li>
        </ul>
      </div>

    </div>
    <div class="video-info">
      <div class="info">
        <div class="photo">
          <e-avatar :size="[60,60]" class="photo-img" :src="detail.userInfo.iconUrl" />
        </div>
        <div class="info-box">
          <div class="text">{{detail.videoVo.nickName}}</div>
          <span class="sign">{{detail.videoVo.intro}}</span>
        </div>
        <div class="follow-box">
          <span class="fans">{{detail.followCount || 0}}粉丝</span>
          <follow  :item="detail.userInfo" />
        </div>
      </div>
      <div class="ad">
        <img src="/images/old/lecai.png" width="100%" alt="">
      </div>
    </div>
    <div class="video-recomond">
      <video-recommond :boardList="boardList" :arrow="arrow" />
      <div class="hot-list">
        <hot-list 
          :header-icon="'images/old/local_stat.png'" 
          :header-title="'热门榜单'" 
          :hot-list="billboard"/>
      </div>
    </div>
  </div>
</template>
<script>
  import follow from '../../components/Follow'
  import videoRecommond from '../components/VideoRecommond'
  import hotList from '../components/HotList'
  import videoPlayer from '../components/VideoPlayer'
  import fetch from 'fetch'
  import {mapState} from 'vuex'
  import Report from '@/pages/components/Report'
  export default {
    components: {
      follow,
      hotList,
      videoPlayer,
      videoRecommond,
      Report
    },
    data () {
      return {
        isShow: true,
        playList: {},
        playIndex: 0
      }
    },
    async fetch (context) {
      if (!context.popStateEvent) {
        let videoDetail = await fetch({
          context,
          url: '/video/play',
          params: {videoId: context.params.videoId}
        })
        context.store.commit('video/VIDEODETAIL', videoDetail)
        let billboard = await fetch({
          context,
          url: '/video/page/week/rank'
        })
        context.store.commit('video/BILLBOARD', billboard)
      }
    },
    computed: {
      ...mapState({
        detail: state => state.video.videoDetail,
        billboard: state => state.video.billboard
      }),
      playerOptions () {
        return {
          autoplay: true,
          muted: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: this.detail.videoVo.videoUrl
          }],
          poster: this.detail.videoVo.imgUrl
        }
      },
      boardList () {
        let list = []
        if (this.billboard.list) {
          if (this.billboard.list.length < 4) {
            list.push(this.billboard.list)
          } else {
            let middle = []
            for (let i = 1; i < this.billboard.list.length; i++) {
              if (i % 4 > 0) {
                middle.push(this.billboard.list[i])
              } else {
                middle.push(this.billboard.list[i])
                list.push(middle)
                middle = []
              }
            }
          }
        }
        return list
      },
      arrow () {
        return this.billboard.list && this.billboard.list.length < 4 ? 'never' : 'always'
      },
      videoId () {
        return this.detail.relatedList[this.playIndex].videoId
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
      this.playList = this.detail.relatedList
      this.playIndex = 0
    },
    methods: {
      onPlayerEnded (player) {
        if (this.playIndex < (this.detail.relatedList.length - 1)) {
          setTimeout(() => {
            let videoId = this.detail.relatedList[this.playIndex + 1].videoId
            this.play(videoId, this.playIndex + 1)
          }, 5000)
        } else {
          console.log('播放列表全部播放完毕')
        }
      },
      bdInit () {
        let baseUrl = location.origin || (location.protocol + '//' + location.host)
        let sharePic = baseUrl + '/images/app_logo.png'
        sharePic = this.detail.videoVo.imgUrl || sharePic
        let shareUrl = baseUrl + '/share?type=video&shareId=' + this.$route.params.videoId + '&share='
        window._bd_share_config = {
          'common': {
            'bdSnsKey': {'bds_tsina': '18129803273', 'popup_sqq': '468642723', 'bds_weixin': 'htxk-open@13322.com', 'bds_qzone': '468642723'},
            'bdText': this.detail.videoVo.videoName,
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
      showList () {
        this.isShow = !this.isShow
      },
      play (videoId, index) {
        this.$store.dispatch('video/VIDEODETAIL', {videoId: videoId})
        this.$route.params.videoId = videoId
        this.playIndex = index
      }
    }
  }
</script>
<style lang="scss">
  
  .video-recomond{
    .el-carousel{
      .el-carousel__container{
        &:after{
          content: '';
          width: 50px;
          height: 160px;
          background: #fff;
          left: -41px;
          top: 0;
          position: absolute;
          z-index: 5;
        }
        &:before{
          content: '';
          width: 50px;
          height: 160px;
          background: #fff;
          right: -39px;
          top: 0;
          position: absolute;
          z-index: 5;
        }
      }
      .el-carousel__arrow{
        width: 24px;
        height: 110px;
        border-radius: 0;
        top:0;
        -ms-transform: translateY(0);
        transform: translateY(0);
        &:hover{
          background-color:$color-primary;
        }
      }
      .el-carousel__arrow--left{
        left:-30px;
      }
      .el-carousel__arrow--right{
        right:-30px;
      }
    }
    .hot-list ul.video-list{
      background:#fff;
    }
  }
</style>
<style lang="scss" scoped>
  
  .video-container{
    width:1200px;
    margin:0 auto;
    padding:20px 0;
  }
  .video-box{
    font-size:0;
    .video-wrapp{
      display:inline-block;
      vertical-align:middle;
      padding-right:10px;
      background:#181818;
    }
  }
  .video-play-list{
    background:#181818;
    color: #fff;
    height:555px;
    width:290px;
    display:inline-block;
    vertical-align:middle;
    padding:10px 5px;
    overflow-y:auto;
    li{
      margin:0 5px 10px;
      font-size:0;
      cursor:pointer;
      &.play-active,&:hover{
        background: #333333;
      }
      .photo{
        width:110px;
        display:inline-block;
        vertical-align:middle;
        position:relative;
        .time{
          position:absolute;
          right:0;
          bottom:0;
          color: #fff;
          height:20px;
          width:80px;
          font-size:12px;
          text-align:right;
          span{
            padding-right:5px;
          }
          .triangle{
            width: 0;
            height: 0;
            border-width: 4px;
            border-style: solid;
            border-color: transparent transparent transparent #fff;
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
            margin-top: -3px;
            padding-right:0;
          }
        }
      }
      .text{
        display:inline-block;
        vertical-align:middle;
        font-size:14px;
        width:155px;
        overflow: hidden;
        padding-left:10px;
      }
    }
  }
  .video-wrapp{
    width:910px;
    height:555px;
    position:relative;
    font-size:14px;
    &.video-fullscreen{
      width:100%;
    }
    .share-container{
      background:#222222;
      height:45px;
      padding-left:20px;
      line-height:45px;
      color: $color-black-base;
      .share-box{
        display:inline-block;
        vertical-align:middle;
      }
      .bdsharebuttonbox{
        display:inline-block;
        vertical-align:middle;
        .iconfont {
          background:none;
          padding: 0;
          font-size:24px;
        }
      }
    }
    .control-video{
      height:50px;
      width:10px;
      background:#333;
      position:absolute;
      right:0;
      top:50%;
      margin-top:-25px;
      line-height:50px;
      text-align:center;
      cursor:pointer;
      .iconfont{
        color: #666;
        margin-left:-3px;
      }
    }
  }
  .video-content{
    h1.title{
      font-size: 24px;
      margin-bottom: 20px;
      font-weight:normal;
      height:42px;
      .report{
        color: $color-sub;
        float:right;
        font-size:14px;
        cursor:pointer;
        &:hover{
          color: $color-primary;
        }
      }
    }
  }
  .video-info{
    font-size:0;
    margin:20px 0;
    .info{
      width:894px;
      display:inline-block;
      vertical-align:middle;
      background:#fff;
      height:90px;
      font-size:0;
      .photo{
        border-radius:100%;
        padding:0 15px;
        display:inline-block;
        vertical-align:middle;
        width:90px;
        height:90px;
        line-height:90px;
        img{
          border-radius:100%;
        }
      }
      .info-box{
        display:inline-block;
        vertical-align:middle;
        font-size:14px;
        width:700px;
        .text{
          font-weight:bold;
        }
        .sign{
          font-size: 12px;
          color: $color-sub;
          display:inline-block;
          width:600px;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          font-size: 14px;
          font-weight: normal;
        }
      }
      .follow-box{
        font-size:14px;
        display:inline-block;
        vertical-align:middle;
        position:relative;
        .fans{
          position:absolute;
          left: -80px;
          top: 50%;
          margin-top: -9px;
          color: $color-sub;
          font-size:12px;
          width:80px;
          text-align:right;
          padding-right:10px;
        }
      }
    }
    .ad{
      width:286px;
      margin-left:20px;
      display:inline-block;
      vertical-align:middle;
    }
  }
  .video-recomond{
    margin:20px 0;
    font-size:0;
    .hot-list{
      width:286px;
      margin-left:20px;
      display:inline-block;
      background:#fff;
      vertical-align:top;
      padding:20px;
      ul.video-list{
        background:#fff;
      }
    }
  }
  .scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 5px;
    background-color: #333333;
  }
  .scrollbar::-webkit-scrollbar-thumb {
      /*width: 10px;*/
    height: 20px;
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #666;
  }
</style>