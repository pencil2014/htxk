<template>
    <ul>
      <li v-for="(item,index) in list" v-if="index < 4" :key="index">
        <nuxt-link :to="goodsUrl(item)">
          <e-img :src="item.logoUrl" :size="[242,182]" />
          <div class="status">
            <span :class="item.status == 1 ? 'preheat':''" v-if="item.status == 1">预热中</span>
            <span v-if="item.status == 4">报名中</span>
            <span :class="item.status == 6 ? 'conduct':''" v-if="item.status == 6">进行中</span>
          </div>
          <div class="mask">
            {{item.matchName}}
          </div>
        </nuxt-link>
      </li>
    </ul>
</template>
<script>
  export default {
    props: {
      list: {
        default () {
          return {}
        }
      }
    },
    methods: {
      goodsUrl (item) {
        if (item.nextStepUrl) {
          return item.nextStepUrl
        } else {
          return '/goods/detail/' + item.goodsCode
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  
  ul{
    margin-right: -10px;
    margin-left: -10px;
    overflow: hidden;
  }
  li{
    margin:0 10px;
    float: left; 
    position: relative;
    .status{
      position: absolute;
      top: 0;
      left: 0;
      span{
        width: 54px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        display: block;
        background: $color-primary;
        color: #fff;
        &.preheat{
          background: $color-warning;
        }
        &.conduct{
          background: #89d134;
        }
      }
    }
    .mask{
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,0.3);
      width: 100%;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: nowrap;
      color: #fff;
      padding:5px 0 5px 3px;
    }
  }
</style>