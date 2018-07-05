<template>
  <div class="bbs-list">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/community/marrow' }" >求苗社区</el-breadcrumb-item>
      <el-breadcrumb-item>圈子列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="bbs-list-content">
      <el-menu  :default-active ="selectMenu" class="bbs-menu" >
        <li index="" >
          <i class="icon iconfont icon-quanzfl" ></i>
          <h3>圈子分类</h3>
        </li>

        <el-menu-item index="/community/list/my">
          <nuxt-link  :to="{ path: '/community/list/my'}"  >
            <i class="icon iconfont icon-geren" ></i>
            <h3>我的圈子</h3>
          </nuxt-link>
        </el-menu-item>

        <el-menu-item 
          :index="'/community/list/' + item.describe"
          v-for='(item, index) in menuList' :key='index' >
          <nuxt-link 
            :to="{ path: '/community/list/' + item.describe, query: {type: item.type}}" >
            <i class="icon iconfont" :class='typeToIcon[item.type]'></i>
            <h3>{{item.name}}</h3>
          </nuxt-link>
        </el-menu-item>
      </el-menu>

      <div class="main">
        <nuxt-child />
      </div>

    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      menuList: 'community/menu'
    }),
    selectMenu: {
      get () {
        return this.$route.path
      },
      set (value) {
      }
    }
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 查询圈子所有类目
      let menu = await fetch({
        context,
        url: '/community/guest/circle/circleType'
      })
      context.store.commit('community/MENU', {data: menu.data})
    }
  },
  data () {
    return {
      typeToIcon: {
        1: 'icon-qita',
        2: 'icon-iosfootball',
        3: 'icon-06',
        4: 'icon-yumaoqiukongxin',
        5: 'icon-wangqiu1',
        6: 'icon-pingpangkongxin',
        7: 'icon-run'
      }
    }
  }
}
</script>

<style lang="scss"  scoped>

.bbs-list{
  width: 1200px;
  margin: 0 auto;

  .el-menu-item{
    padding: 0;
    a{
      display: block;
    }
  }
  .bbs-list-content{
    .bbs-menu{
      vertical-align: top;
      display: inline-block;
      width:150px;
      background:#fff;
      li{
        height: 56px;
        line-height: 56px;
        padding-left: 24px;
        border-left: 3px solid rgba(255,255,255,0);
        color:$color-black-base;
        i{
          margin-right: 12px;
        }
      }
      h3{
        display:inline-block;
        font-weight: normal;
      }
    }
    .bbs-menu .is-active{
      background-color:#f0fcf9;
      color: $color-primary;
      border-left-color: $color-primary;
    }
    .main{
      vertical-align: top;
      display: inline-block;
      margin-left: 20px;
      width:1030px;
      background: #fff;
      min-height: 600px;
      padding: 40px;
    }
  }
}
</style>
