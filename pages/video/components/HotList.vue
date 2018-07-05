<template>
  <div class="hot-box">
    <div class="header">
      <i class="icon">
        <!-- <e-img :src="headerIcon" /> -->
        <!-- <img :src="headerIcon" /> -->
        <img src="/images/old/hot_list.png" alt="hot">
      </i>
      <span class="title">{{headerTitle}}</span>
      <span class="refresh" @click='changeHot' v-if='hotList.total > hotList.rows'>
        <i class="fresh-icon iconfont">&#xe60a;</i>
        <span class="text">换一批</span>
      </span>
    </div>
    <ul class="video-list">
      <li v-for="(item,index) in  hotList.list" :key="index" v-if="index<10">
        <nuxt-link :to='"/video/detail/" + item.videoId' style="display:block;">
          <div class="photo">
            <e-img :src="item.imgUrl" :size="[85,50]" />
          </div>
          <div class="text">
            <e-text :line-clamp="2" height="48px">{{item.intro}}</e-text>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      headerIcon: {
        type: String
      },
      headerTitle: {
        type: String,
        default: '同城明星222'
      },
      hotList: {
        // type: Array,
        // default () {
        //   return []
        // }
      }
    },
    methods: {
      changeHot () {
        this.$emit('changeHot')
      }
    }
  }
</script>
<style lang="scss" scoped>

.header{
  margin-top:10px;
  margin-bottom:19px;
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
  .refresh{
    font-size:0;
    color:$color-sub;
    cursor:pointer;
    &:hover{
      color:$color-primary;
    }
    .fresh-icon{
      font-size:12px;
      vertical-align:middle;
      display:inline-block;
      padding-right:5px;
    }
    .text{
      font-size:12px;
      vertical-align:middle;
      display:inline-block;
    }
  }
}
ul.video-list{
  background: rgb(248, 248, 248);
  li{
    font-size:0;
    padding:10px;
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
      width:110px;
    }
  }
}



</style>