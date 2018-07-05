<template>
  <div class="hot-videos">
    <div class="header">
      <i class="icon">
        <img src="/images/old/hot_list.png" />
      </i>
      <span class="title">{{headerTitle}}</span>
    </div>
    <ul class="video-list">
      <li v-for="(item, index) in  hotList" :key="index">
         <!-- <nuxt-link :to='String(item.videoUrl)'> -->
        <!-- <nuxt-link :to='item.videoUrl' style="display:block;"> -->
        <a :href='item.videoUrl' style="display:block;" target="_blank">
          <div class="photo">
            <e-img :src="item.imgUrl" :size="[110, 64]" />
          </div>
          <div class="text">
            <e-text :line-clamp="2" height="48px">{{item.videoName}}</e-text>
          </div>
        </a>
        <!-- </nuxt-link> -->
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      // headerIcon: {
      //   type: String
      // },
      headerTitle: {
        type: String,
        default: '热门榜单'
      },
      hotList: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

.hot-videos{
  padding: 20px 20px 0 20px;
  .header{
    font-size:0;
    .icon{
      vertical-align:middle;
    }
    .title{
      font-size: 18px;
      font-weight: normal;
      margin-left: 10px;
      vertical-align:middle;
      display:inline-block;
      width:135px;
    }
  }
  ul.video-list{
    li{
      font-size:0;
      padding:10px 0;
      .photo,.text{
        display:inline-block;
        font-size:14px;
        vertical-align:middle;
      }
      .photo{
        width:95px;
        padding-right:10px;
      }
      .text{
        width:130px;
      }
    }
  }
}
</style>