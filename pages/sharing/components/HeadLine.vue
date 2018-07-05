<template>
  <div class="head-line">
    <e-heading grade="1">24h快讯</e-heading>
    <ul class="list">
      <li class="item" v-for="(item,index) in list" :key="index">
        <a target="_blank" :href="item.url">
          <div class="photo">
            <e-img :src="item.coverUrl" :size="[80,45]" />
          </div>
          <e-text class="text" :line-clamp="2" height="42px">{{item.title}}</e-text>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>
<style scoped lang='scss'>
.head-line{
  .heading-1{
    margin:0;
    font-size: 20px;
  }
  ul{
  }
  .list li{
    font-size: 0;
    padding:15px 0;
    border-bottom: 1px solid #eee;
    &:nth-child(1){
      margin-top: 8px;
    }
    &:nth-child(5){
      border:0;
    }
    .photo,.text{
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
    .photo{
      width: 80px;
    }
    .text{
      width: 230px;
      padding-left: 10px;
    }
  }
}
</style>
