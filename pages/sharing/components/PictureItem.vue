<template>
  <ul>
    <li v-for="(item,index) in pictureList" :key="index">
      <a target="_blank" :href="item.url">
        <e-img :src="item.coverUrl" :size="[150,84]" />
        <e-text :line-clamp="2">{{item.title}}</e-text>
      </a>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      pictureList: {
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
      .x-text{
        line-height: 20px;
        height: 40px;
      }
    }
  }
</style>