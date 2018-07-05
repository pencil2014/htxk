<template>
  <div class="new-topic">
    <e-heading grade="1">最新话题</e-heading>
    <ul class="list">
      <li v-for='(item, index) in latest ' :key='index' :title='item.title' class="divider">
        <!-- 视频和帖子的跳转 -->
        <nuxt-link   v-if='(item.contentType == 30) || (item.contentType == 20)' 
        :to='(item.contentType == 30 ?  "/community/detail/" + item.contentId : "/video/detail/" + item.contentId )'   >
          <dl>
            <dt>■</dt>
            <dd>
              {{item.title}}
            </dd>
          </dl>
        </nuxt-link>
        <!-- 资讯的跳转 -->
        <a :href='item.url' v-else >
          <dl>
            <dt>■</dt>
            <dd>
              {{item.title}}
            </dd>
          </dl>
        </a>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    latest: {}
  },
  data () {
    return {
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  
  .new-topic{
    width:310px;
    .heading-1 {
      margin: 25px 0 16px 0;
    }
    .heading{
      font-weight: normal;
    }
    .list li:last-of-type{
      border-bottom: 0px;
    }
    dl{
      color: #666;
      position: relative;
      padding: 10px 0;
      &:hover{
        color: $color-primary;
      }
      dt{
        position: absolute;
        top:0;
        left:0;
        transform:scale(0.6);
        width: 14px;
        vertical-align: top;
        padding-top:10px;
        color:$color-sub;
      }
      dd{
        margin-left: 14px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
