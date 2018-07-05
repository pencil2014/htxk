<template>
  <div class="divider news-item" v-if="item" >
    <!-- <div style='display:block;' class="alink" @click="goInfo(item.url)"> </div> -->
    <!-- <nuxt-link style='display:block;' class="alink" :to='String(item.url)'> -->
    <a style='display:block;' class="alink" :href='item.url' target="_blank">
      <span v-if="item.coverUrl.length === 1" class="photo float">
        <e-img :src="item.coverUrl[0]" alt="" :size="[160,90]" />
      </span>
      <b class="titles">{{item.title}}</b>
      <p v-if="item.coverUrl.length === 0" >
        {{item.summary}}
      </p>
      <span v-if="item.coverUrl.length > 1" class='photo'>
        <e-img :src="i" alt="" v-for='(i,index) in item.coverUrl' :key="index" v-if="index < 3" :size="[160,90]" />
        <a href="javascript:;"  class="more" v-if="item.coverUrl.length > 3">查看更多></a>
      </span>
    </a>
    <!-- </nuxt-link> -->
    <div class="info small">
      <span class="icon"><i class="iconfont">&#xe619;</i>{{item.authorName}}</span> 
      <span class="time">{{item.publishTimeFormat}}</span> 
      <span class='icon'><i class="iconfont">&#xe628;</i>{{item.commentCount}}</span>
      <span class='icon'><i class="iconfont">&#xe914;</i>{{item.clickCount}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {}
  }
  // methods: {
  //   goInfo (url) {
  //     window.open(url)
  //   }
  // }
}
</script>

<style lang="scss" scoped>

.news-item{
  overflow: hidden;
  padding-bottom: 15px;
  .alink {
    cursor: pointer;
    .titles {
      font-size: 16px; 
      display: block; 
      padding-top: 20px; 
      &:hover {
        color: $color-primary;
      }
    }
    .float {
      float: left; 
      padding-right: 20px;
    }
    .photo {
      overflow: hidden;
      display: inline-block;
      height: 90px;
      padding-top: 10px;
      img { 
        max-width: 160px; 
        max-height: 90px;
        margin-right: 10px;
        border: 1px solid $border-color-base;
        opacity: 0.8;
        &:hover {
          opacity: 1;
          transition: all 1s linear 0;
        }
      }
      .more {
        display: inline-block;
        width: 160px; 
        height: 90px;
        line-height: 90px;
        text-align: center;
        background-color: #eee;
        color: $color-sub;
        &:hover {
          color: $color-primary;
        }
      }
    }
  }
  .info {
    color: $color-sub;
    .icon {
      vertical-align: middle;
      margin: 0 10px;
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>