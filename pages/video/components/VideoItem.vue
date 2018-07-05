<template>
  <div>
    <nuxt-link :to='"/video/detail/" + item.videoId' class="item" v-if="item" :style="'width:'+ size[0] + 'px'">
      <div class="img-box">
        <e-img :src='item.imgUrl' :size='size' :alt="item.title" />
        <div class="cover"></div>
        <div class="circle"></div>
        <div class="play"></div>
        <div class="bottom-cover">
          <span class="triangle"></span>
          <span class="account">{{item.playCount}}</span>
        </div>
      </div>
      <h3 class="title">{{item.videoName}}</h3>
    </nuxt-link>
    <div class="sub-info" v-if="isSub">
      <a class="auth" :href="'/personal/'+item.userId">
        <i class="iconfont">&#xe619;</i>
        <span class="text"
          v-if='item.nickName' >
          {{item.nickName}}
        </span>
      </a>
      <div class="type">
        <i class="iconfont">&#xe75f;</i>
        <span class="text">{{item.cateName}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      isSub: {
        type: Boolean,
        default: true
      },
      size: {
        type: Array,
        default () {
          return [180, 110]
        }
      },
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="scss" scoped>

.item{
  display:block;
  .img-box{
    position: relative;
    overflow:hidden;
    .cover{
      width:100%;
      height:100%;
      background: #000;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
    .play{
      width:14px;
      height:16px;
      position:absolute;
      top:50%;
      left:50%;
      margin-left:-7px;
      margin-top:-8px;
      background:url(/images/old/video_play.png) no-repeat center;
      z-index:3;
      transition: all 0.5s ease-in-out;
      opacity:0;
    }
    .circle{
      width:51px;
      height:50px;
      position:absolute;
      left:50%;
      top:50%;
      margin-left:-26px;
      margin-top:-26px;
      background:url(/images/old/video_circle.png) no-repeat center;
      transition: all 0.5s ease-in-out;
      z-index:4;
      opacity:0;
    }
    &:hover{
      .cover{
        opacity:0.5;
      }
      .circle{
        transform: rotate(270deg) scale(1,1);
        -webkit-transform: rotate(270deg) scale(1,1);
        opacity: 1;
      }
      .play{
        opacity:1;
      }
      img{
        transform: scale(1.1,1.1);
      }
    }
    img{
      transition: all 0.5s ease-in-out;
    }
    
  }
  .bottom-cover{
    height: 20px;
    line-height: 20px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #000;
    opacity: 0.4;
    z-index:8;
    .triangle{
      width:0;
      height:0;
      border-width:4px;
      border-style:solid;
      border-color:transparent transparent transparent #fff;
      display:inline-block;
      margin-left:10px;
      vertical-align: middle;
    }
    .account{
      color:#fff;
      font-size:12px;
      vertical-align: middle;
    }
  }
  .title{
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
    font-size: 14px;
    font-weight: normal;
  }
}
.sub-info{
  color: $color-sub;
  font-size:0;
  .iconfont{
    display: inline-block;
    vertical-align: middle;
    padding-right:5px;
    font-size:12px;
  }
  span.text{
    display: inline-block;
    vertical-align: middle;
  }
  .auth{
    vertical-align:middle;
    display:inline-block;
    font-size:12px;
    cursor:pointer;
    width:50%;
    .text{
      width:80%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: nowrap;
    }
    &:hover{
      color:$color-primary;
    }
  }
  .type{
    vertical-align:middle;
    display:inline-block;
    text-align:right;
    width:50%;
    font-size:12px;
  }
}
</style>