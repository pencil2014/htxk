<template>
  <ul>
    <li v-for="(item,index) in videoList" :key="index">
      <nuxt-link :to="'/video/detail/' + item.videoId">
        <div class="photo">
          <e-img :src="item.imgUrl" :size="[150,84]" />
          <div class="mask">
            <span class="triangle"></span>
            <span class="time">{{item.playTimeFormat}}</span>
            <span class="account">{{item.playCount}}</span>
          </div>
          <div class="play-icon">
            <i class="iconfont">&#xe78f;</i>
          </div>
        </div>
        <e-text :line-clamp="2">{{item.videoName}}</e-text>
      </nuxt-link>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      videoList: {
        default () {
          return {}
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  ul{
    margin-right: -5px;
    margin-left: -5px;
    overflow: hidden;
    li{
      float: left;
      margin:0 5px;
      width: 150px;
      padding-bottom: 20px;
      &:hover .photo  .play-icon{
        opacity:1;
      }
      .photo{
        position: relative;
        .mask{
          position: absolute;
          bottom: 0;
          left: 0;
          height: 20px;
          color: #fff;
          width: 100%;
          background: rgba(0,0,0,0.5);
          font-size: 12px;
          span{
            vertical-align: middle;
          }
          .triangle{
            height: 0px;
            width: 0px;
            border-top: 5px solid transparent;
            border-left: 5px solid #fff;
            border-bottom: 5px solid transparent;
            display: inline-block;
            margin-left: 10px;
          }
          .time{
            padding:0 10px;
          }
          .account{
            float: right;
            padding-right: 10px;
          }
        }
        .play-icon{
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -26px;
          margin-left: -15px;
          opacity: 0;
          transition:all 1s ease;
          .iconfont{
            font-size: 30px;
            color: #fff;
          }
        }
      }
      .x-text{
        line-height: 20px;
        height: 40px;
      }
    }
  }
</style>