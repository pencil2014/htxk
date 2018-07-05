<template>
  <div v-if="isEnsure" class="video-player-box"
     @ended="onPlayerEnded($event)"
     v-video-player:myVideoPlayer="playerOptions">
  </div>
</template>
<script>
  import Vue from 'vue'
  import 'video.js/dist/video-js.css'
  export default {
    props: {
      playerOptions: {
        type: Object,
        default () {
          return {
            autoplay: true,
            muted: false,
            language: 'en',
            playbackRates: [0.7, 1.0, 1.5, 2.0],
            sources: [{
              type: 'video/mp4',
              src: ''
            }],
            poster: ''
          }
        }
      }
    },
    data () {
      return {
        isEnsure: false
      }
    },
    mounted () {
      require.ensure([], (r) => { // 按需加载vue-video-player文件
        let VueVideoPlayer = require('vue-video-player/dist/ssr')
        Vue.use(VueVideoPlayer)
        this.isEnsure = true
      })
    },
    methods: {
      onPlayerEnded (player) {
        this.$emit('ended', player)
      }
    }
  }
</script>
<style lang="scss">
  
  .video-player-box{
    .video-js{
      width:100%;
      height:510px;
      .vjs-play-control{
        float:left;
      }
      &:hover{
        .vjs-big-play-button{
          background-color:transparent;
        }
      }
      &.vjs-error{
        .vjs-big-play-button{
          display:none!important;
        }
        .vjs-error-display:before{
          content:'';
          background: url(/images/video/video_warning.png) no-repeat 50%;
          height: 50px;
        }
      }
      &.vjs-paused.vjs-has-started{
        .vjs-big-play-button{
          display:block;
        }
      }
      .vjs-big-play-button{
        border:0;
        outline:none;
        top: 50%;
        left: 50%;
        font-size: 3em;
        display: block;
        z-index: 2;
        position: absolute;
        width: 90px;
        height: 90px;
        margin-left:-45px;
        margin-top: -45px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        opacity: 1;
        /* background-color-with-alpha */
        background: url(/images/video/play_big.png) no-repeat;
        .vjs-icon-placeholder:before{
          background:none;
          font-size:0;
        }
      }
      .vjs-control{
        outline:none;
        &.vjs-button{
          &.vjs-paused .vjs-icon-placeholder:before{
            background: url("/images/video/start1.png") no-repeat;
          }
          &.vjs-playing .vjs-icon-placeholder:before{
            background: url("/images/video/pause1.png") no-repeat;
            font-size:0;
          }
          .vjs-icon-placeholder:before{
            width: 37px;
            height: 35px;
            content: '';
            left: 0;
            top: 0;
            font-size:0;
          }
        }
      }
      .vjs-current-time,.vjs-time-control{
        display:inline-block;
        padding:0 0.5em;
      }
      .vjs-time-control{
        padding:0;
        min-width:0;
      }
      .vjs-control-bar{
        background:#242424;
      }
      &.vjs-has-started{
        .vjs-big-play-button{
          display:none;
        }
        &.vjs-user-inactive.vjs-playing .vjs-control-bar{
          display:block;
          opacity:1;
        }
      }
      &.vjs-fullscreen{
        .vjs-fullscreen-control{
          .vjs-icon-placeholder:before{
            background: url("/images/video/fullScreen2.png") no-repeat;
          }
        }
      }
      .vjs-fullscreen-control{
        position:absolute;
        right:0;
        top:0;
        .vjs-icon-placeholder:before{
          background: url("/images/video/fullScreen4.png") no-repeat;
          font-size: 0;
        }
      }
      .vjs-progress-control{
        position: absolute;
        left: 0;
        right: 0;
        width: auto;
        font-size: 0.3em;
        height: 3px;
        top: -1em;
        -webkit-transition: all 0.4s;
        -moz-transition: all 0.4s;
        -o-transition: all 0.4s;
        transition: all 0.4s;
        .vjs-progress-holder{
          .vjs-play-progress:before{
            font-size:0;
            background: url("/images/video/slider1.png") no-repeat;
            width: 16px;
            height: 16px;
            top: -7px;
            right: -10px;
          }
        }
      }
      .vjs-playback-rate{
        display:none;
      }
      .vjs-volume-panel{
        width:12em;
        position:absolute;
        right:50px;
        &.vjs-volume-panel-horizontal:hover{
          width:12em;
        }
        .vjs-mute-control{
          cursor: pointer;
          float: right;
          padding:0;
          &.vjs-vol-0:before{
            background: url(/images/video/sound3.png) no-repeat;
          }
          &:before{
            background: url(/images/video/sound1.png) no-repeat;
            width: 35px;
            height: 35px;
            content: '';
            left: 10px;
            top: 2px;
            display: block;
            position: absolute;
          }
        }
        .vjs-volume-control{
          width: 5em;
          float: right;
          height: 3em;
          opacity: 1;
          display:block;
        }
      }
    }
    .vjs-loading-spinner{
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 0;
      line-height: 1;
      width: 80px;
      height: 80px;
      margin-left: -40px;
      margin-top: -40px;
      background: url(/images/video/video_loding.gif) no-repeat;
      opacity: 1;
      border:0;
      border-radius:0;
      visibility:visible;
    }
  }
</style>
<style lang="scss" scoped>
  
</style>