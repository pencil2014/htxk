<template>
  <ul class="menu">
    <li v-for="(item,index) in list" :key="index">
      <nuxt-link :to='linkMenu(item)'>
        <i class="iconfont" :class="iconClass[index].iconClass"></i>
        <div class="text">{{item.espnName}}</div>
      </nuxt-link>
    </li>
  </ul>
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
          return [
            {
              icon: '#dd',
              text: '1212'
            }
          ]
        }
      },
      iconClass: {
        default () {
          return [
            {
              iconClass: '#dd'
            }
          ]
        }
      }
    },
    methods: {
      linkMenu (item) {
        this.$set(this.$store.state.sharing, 'menuSelect', item.espnCode)
        if (item.espnType === 1) {
          return '/sharing'
        } else if (item.espnType === 0) {
          return '/sharing/' + item.espnCode
        }
      }
    }
  }
</script>
<style lang='scss' scoped>

.menu{
  border:1px solid #eee;
  li{
    height:50px;
    border-top: 1px solid #eee;
    margin-top: -1px;
    font-size: 16px;
    a{
      height: 100%;
      padding-left: 20px;
      display: block;
      &:hover, &.nuxt-link-exact-active{
        background:$color-primary;
        color: #fff;
        .iconfont{
          color: #fff;
        }
      }
    }
    
    .iconfont{
      padding-right: 10px;
      vertical-align: middle;
      color: $color-sub;
    }
    .text{
      line-height: 50px;
    }
  }
  .text{
    display: inline-block;
    vertical-align: middle;
  }
}
  
</style>