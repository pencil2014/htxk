<template>
  <div class="hot-post-content"  v-if='hotList && hotList.length > 0'>
    <div class='title' >
      <h3>7天热帖</h3>
    </div>
    <ul class="item">
      <li 
        v-if='index < 10'
        v-for='(item, index) in hotList' :key='index' >
        <e-cellbox>
          <e-cell-item class="index">
            <div :class="{'hot': index < 3}">
              {{index + 1}}
            </div>
          </e-cell-item>

          <e-cell-item class="info">
            <nuxt-link target='_blank'  class="desc"  :to='"detail/" + item.feedId' style='display:inline;' >
              <span :title='item.title' >{{substrTitle(item.title)}}</span>
            </nuxt-link>
            <nuxt-link target='_blank'  class="name"  :to='"circle/" + item.circleId' style='display:inline-block;' >
              <span :title='item.circleName' >{{item.circleName}}</span>
            </nuxt-link>
          </e-cell-item>
        </e-cellbox>

      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const TITLE_MAX = 18
export default {
  computed: {
    ...mapGetters({
      hotList: 'community/hot_feed'
    })
  },
  methods: {
    substrTitle (title) {
      if (!title) {
        return ''
      }
      if (title.length > TITLE_MAX) {
        return title.substr(0, TITLE_MAX) + '...'
      }
      return title
    }
  },
  mounted () {
  },
  data () {
    return {
      activeName: 'hot'
    }
  }
}
</script>

<style lang="scss"  scoped>

.hot-post-content{
  padding:20px; 
  background: $color-white;
  width:260px;

  .title{
    border-bottom: 2px solid #e5e5e5;
    h3{
      position: relative;
      top: 2px;
      display: inline-block;
      font-weight: 400;
      font-size: 20px;
      line-height: 20px;
      color: $color-black;
      padding-bottom: 10px;
      border-bottom: 2px solid $color-primary;
    }
  }
  .item{
    li{
      padding: 16px 0;
      border-top:1px solid #e5e5e5;
      &::nth-child(1) {
        border-top:1px solid rgba(255,255,255,1);
      }
    }
  }
  .index{
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: $color-white;
    width: 26px;
    div{
      width: 16px;
      text-align:center;
      background: #d2d2d2;
      margin-top:4px;
    }
    .hot{
      background: #ff5c5c;
    }
    padding-right:10px;
  }
  .info{
    .desc{
      &:hover{
        color:$color-primary;
      }
    }
    .name{
      float: right;
      max-width: 88px;
      float: right;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      color:$color-sub;
      &:hover{
        color:$color-primary;
      }
    }
  }
}
</style>
