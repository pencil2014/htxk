<template>
  <section class="home-section wrapper">
    <e-cellbox class="home-section-header">
      <e-cell-item class="home-section-title">
        <img src='/images/group.png'/>
        <h2 v-if='title'>{{title}}</h2>
      </e-cell-item>
      <e-cell-item class="home-section-labels">
        <a type="text" v-if='labels'  v-for='(item, index) in labels' :key='index'>{{item.name}}</a>
        <nuxt-link v-if="moreLink" target='_blank' class="home-section-more" :to="{path: moreLink}" >更多>></nuxt-link>
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
  padding-top: 60px;
  padding-bottom: 60px;
  &-header{
    margin-bottom:15px;
  }
  &-title{
    width:170px;
    white-space:nowrap;
    img{
      width:38px;
      height:24px;
      margin-top: -10px;
    }
    h2{
      display: inline;
      padding:0 10px;
      font-size:28px;
      color: #333;
      font-weight:normal;
      font-style:italic;
      line-height:1;
    }
  }
  &-labels{
    border-bottom: 1px solid $border-color-base; 
    text-align:right;
    color:$color-black-base;
    a{
      margin: 0 20px;
      &:hover{
        color:$color-primary;
      }
    }
  }
  &-more{
    margin-left:55px!important;
    margin-right:0!important;
  }
}
</style>
