<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }" >求苗首页</el-breadcrumb-item>
      <el-breadcrumb-item>求苗视频</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="video-box content">
      <e-cellbox top class="recommond">
        <e-cell-item class="video-slider">
          <el-carousel trigger="click" :interval="5000" arrow="always">
            <el-carousel-item v-for="(item, index) in scrollVideos" :key="index">
              <nuxt-link style="display:block" :to='"/video/detail/" + item.videoId' target="_blank">
                <div class="title-box">
                  <i class="title-icon"></i>
                  <h2 class="title">{{ item.videoName }}</h2>
                </div>
                <e-img :src="item.imgUrl" :size="[580,290]" />
              </nuxt-link>
            </el-carousel-item>
          </el-carousel>
          <ul class="news-list">
            <li v-for="(item, index) in focusNews" :key="index">
              <a :href="item.url" class="news-box">
                <label class="dot">▪</label>
                <span>{{item.title}}</span>
              </a>
            </li>
          </ul>
        </e-cell-item>
        <e-cell-item class="video-recommond">
          <ul class="list">
            <li v-for="(item, index) in focusVideos" :key='index'>
              <video-item :item="item" :isSub="false" />
            </li>
          </ul>
        </e-cell-item>
        <e-cell-item class="ad">
          <img src="/images/old/index_ad_pic.jpg" width="100%" alt="">
        </e-cell-item>
      </e-cellbox>

      <article>
        <div class="left-content"
          v-for="(items, indexs) in videoColumnList" 
          :key='indexs' >
          <div v-if='(advertVideos.length > indexs) && (index === indexs)' 
            v-for='(item, index) in advertVideos' 
            :key="index" >
            <div class="header">
              <i class='icon'>
                <img :src="items.cateIcon" alt="">
              </i>
              <span class="title">{{items.cateName}}</span>
            </div>
            <div class="show">
              <video-item :item="{
                'videoName': item.videoName,
                'nickName': item.nickName,
                'cateName': item.cateName,
                'videoId': item.videoId,
                'userId': item.userId,
                'imgUrl': item.imgUrl,
                'playCount': item.playCount
              }"
              :size='[375,295]' />
            </div>
            <ul class="list">
              <li v-for="(listItem, index) in items.list" :key="index" v-if='index < 6'>
                <video-item :item="listItem" />
              </li>
            </ul>
          </div>

          <div class="match"  v-if='!(advertVideos.length > indexs)'>
            <div class="header">
              <i class='icon'>
                <img :src="items.cateIcon" width="100%" alt="">
              </i>
              <span class="title">{{items.cateName}}</span>
            </div>
            <ul class="list" >
              <li v-for="(listItem, index) in items.list" :key="index">
                <video-item :item="listItem" />
              </li>
            </ul>
          </div>
        </div>
      </article>

      <aside>
        <ul>
          <li v-if='sportColumnList' v-for="(item,index) in sportColumnList" :key="index">
            <recommend-user 
              :header-icon="item.cateIcon" 
              :header-title="item.cateName" 
              :recommend-list="item.commonPage.list"
              @changeStar='changeStar(index)' />
          </li>
          <li>
            <hot-list 
            :header-icon="'images/old/local_stat.png'" 
            :header-title="'热门榜单'" 
            :hot-list="hot" 
            @changeHot='changeHot'/>
          </li>
        </ul>
      </aside>

    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/video'
import videoItem from './components/VideoItem'
import recommendUser from './components/RecommendUser'
import hotList from './components/HotList'
import {mapGetters} from 'vuex'

export default {
  components: {
    videoItem,
    recommendUser,
    hotList
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 视频主页数据
      let index = await fetch({
        context,
        url: '/common/index'
      })
      context.store.commit('video/INDEX', {data: index.data})
    }
  },
  computed: {
    ...mapGetters({
      index: 'video/index',
      hot: 'video/hot'
    }),
    scrollVideos: function () {
      return this.index.scrollVideos || {}
    },
    focusNews: function () {
      return this.index.focusNews || {}
    },
    focusVideos: function () {
      return this.index.focusVideos || {}
    },
    videoColumnList: function () {
      return this.index.videoColumnList || {}
    },
    sportColumnList: function () {
      return this.index.sportColumnList || {}
    },
    advertVideos: function () {
      return this.index.advertVideos || {}
    }
  },
  mounted () {
    // this.$store.dispatch('video/STAR')
    this.$store.dispatch('video/HOT')
    // this.$store.dispatch('video/INDEX')
  },
  data () {
    return {
    }
  },
  methods: {
    changeStar (index) {
      api.star().then((res) => {
        this.index.sportColumnList[index].commonPage.list = res.data.list
      })
    },
    changeHot () {
      this.$store.dispatch('video/HOT')
    }
  }
}
</script>

<style lang="scss" scoped>
.video-box{
  width:1250px;
  margin:0 auto;
  background:#fff;
  padding:10px;
  .ad{
    padding-left:10px;
  }
}
article{
  display: inline-block;
  width: 1000px;
  vertical-align:top;
}
aside{
  display: inline-block;
  width: 230px;
  vertical-align:top;
  li{
    margin-bottom:40px;
  }
}
.recommond{
  margin-bottom: 40px;
}
.video-slider{
  width:590px;
  padding-right:10px;
  .title-box{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    height:50px;
    background:rgba(0,0,0,0.5);
    line-height: 50px;
    .title-icon{
      display: inline-block;
      width: 33px;
      height: 33px;
      background: url(/images/old/musicplay.png) no-repeat center;
      padding: 0 20px;
      vertical-align: middle;
    }
    .title{
      width:350px;
      display:inline-block;
      vertical-align: middle;
      padding-left:20px;
      color:#fff;
      font-weight:normal;
      font-size:16px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: nowrap;
    }
  }
  img{
    display:block;
  }
  .news-list{
    overflow:hidden;
    margin-top:20px;
    li{
      width:48%;
      float:left;
      &:nth-child(2n) {
        float:right;
      }
      .news-box{
        display:block;
        width:100%;
        height:32px;
        line-height:32px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        .dot{
            color: #d9d9d9;
            padding-right: 10px;
        }
      }
    }
  }
}
.video-recommond{
  width:400px;
  .list{
    overflow:hidden;
    li{
      float:left;
      padding:0 10px 15px;
    }
  }
}
article{
  .left-content .match ul.list{
    width:auto;
    margin-right:-10px;
    margin-left:-10px;
  }
  .left-content{
    margin-bottom: 40px;
    width:990px;
    display:inline-block;
    vertical-align:top;
    font-size:0;
    .header{
      margin-bottom:20px;
      .icon{
        width:40px;
        height:40px;
        border-radius: 100%;
        overflow: hidden;
        display:inline-block;
        vertical-align: middle;
        img{
          height: 100%;
          width: 100%
        }
      }
      .title{
        font-size: 24px;
        line-height: 40px;
        margin-left: 10px;
        font-weight: normal;
        vertical-align: middle;
      }
    }
    .show{
      width:390px;
      display:inline-block;
      vertical-align: top;
      font-size:14px;
      padding-right:15px;
    }
    ul.list{
      width:600px;
      display:inline-block;
      vertical-align: top;
      font-size:14px;
      overflow:hidden;
      li{
        float:left;
        padding:0 10px 14px;
        width:200px;
      }
    }
  }
}
</style>
<style lang="scss">

.x-img{
  background: #eee;
}
.video-slider{
  .el-carousel__container{
    height:290px;
  }
  .el-carousel__indicators{
    left: auto;
    z-index:6;
    right:20px;;
    bottom:12px;
    transform:none;
    -ms-transform:none;
    .el-carousel__indicator{
      padding:0;
      margin-right:10px;
    }
    .el-carousel__button{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.8);
      float: left;
      cursor: pointer;
      .is-active{
        background: $color-primary;
      }
    }
  }
}
</style>
