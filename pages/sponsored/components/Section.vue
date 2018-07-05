<template>
  <section class="home-section">
    <e-cellbox class="home-section-header">
      <e-cell-item class="home-section-title">
        <h2 v-if='title'>{{title}}</h2>
      </e-cell-item>
      <e-cell-item class="home-section-labels">
        <a type="text" v-if='labels'  v-for='item in labels' :key='item.name'>{{item.name}}</a>
        <nuxt-link v-if="moreLink" target='_blank' class="home-section-more" :to="{path: moreLink}">更多<i class="icon iconfont icon-directionbottom-copy"></i></nuxt-link>
      </e-cell-item>
    </e-cellbox>
    <slot></slot>
  </section>
</template>

<script>
  export default {
    props: {
      title: {
        required: true,
        type: String
      },
      labels: {
        required: false,
        type: Array
      },
      moreLink: {
        required: false,
        type: String
      }
    }
  }
</script>

<style lang="scss">
  
  .home-section{
    margin-bottom: 25px;
    &-header{
      border-bottom:1px #cecece solid;
    }
    &-title{
      display:inline-block;
      font-size:18px;
      color:$color-black;
      border-bottom:2px $color-primary solid;
      margin-bottom: -1px;
    }
    &-labels{
      float: right;
      margin-top: 5px;
      a{
        font-size: 14px;
        &:hover{
          color:$color-primary;
        }
        i{
          font-size:12px;
        }
      }
    }
  }
</style>