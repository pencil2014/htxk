<template>
  <div class="see">
    <h2 class="title">大家都在看</h2>
    <el-carousel trigger="click" :autoplay="false" :arrow="arrow" height="160px">
      <el-carousel-item v-for="(item,index) in boardList" :key="index">
        <ul>
          <li class="see-li" v-for="(video,index) in item" :key="index">
            <nuxt-link :to="'/video/detail/'+ video.videoId">
              <e-img :src="video.imgUrl" :size='[180,110]' :alt="video.videoName" />
              <h3 class="title">{{video.videoName}}</h3>
            </nuxt-link>
            <div class="sub-info">

              <a class="auth" :href="'/personal/' + video.userId" >
                <i class="iconfont">&#xe619;</i>
                <span class="text"
                  v-if='video.nickName' >
                  {{video.nickName}}
                </span>
              </a>
              <div class="type">
                <i class="iconfont">&#xe75f;</i>
                <span class="text">{{video.cateName}}</span>
              </div>
            </div>
          </li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  export default {
    props: {
      boardList: {
        type: Array,
        default: []
      },
      arrow: {
        type: String,
        default: 'never'
      }
    }
  }
</script>
<style scoped lang="scss">

.see{
    width:894px;
    display:inline-block;
    vertical-align:top;
    background:#fff;
    padding:30px;
    font-size:14px;
    h2.title{
      font-size: 20px;
      margin-left: 10px;
      line-height: 40px;
      margin-bottom:20px;
    }
    .el-carousel{
      padding:0 30px;
      margin-right: -10px;
      margin-left: -10px;
      .see-li{
        width:180px;
        float:left;
        margin:0 9px;
        h3.title{
          width: 100%;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          font-size: 14px;
          font-weight: normal;
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
      }
    }
}
</style>