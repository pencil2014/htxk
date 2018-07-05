<template>
  <div class="topic-list-box">
    <h2 class="mod-h1">热门话题</h2>
    <div class="topic-list" v-if="newsList && newsList.data">
      <ul  v-for='(item, index) in newsList.data' :key="index" :item='item'>	
          <li>
            <em class="dot">•</em>
            <nuxt-link :to="item.url" target="_blank">{{item.title}}</nuxt-link>
          </li>
      </ul>
    </div>
    <div class="topic-list" v-else> 暂无任何数据</div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      newsList: 'personal/news'
    })
  }
}
</script>
<style lang="scss" scoped>
  
  .topic-list li .dot {
      padding: 0 5px;
      vertical-align: middle;
      color: #999;
      font-style:normal
  }
  .topic-list li {
      padding: 8px 0;
  }
  .topic-list li a {
        width: 220px;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  .topic-list-box{
    padding: 20px;
    .mod-h1{
      color: #333;
      font-size: 18px;
      padding-bottom: 15px;
      position: relative;
      line-height: 20px;
      font-weight: 500;
    }
    .mod-h1:after{
      display: block;
      float: left;
      margin-right: 10px;
      content: "";
      width: 4px;
      height: 20px;
      background: #01a87c;
    }
  }
</style>