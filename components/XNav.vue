<template>
  <div>
    <el-row tag="nav" class="wrapper" v-if='user'>
      <el-col :span="20" class="nav-main">
       
        <!-- <a class="nav" v-for="(items, indexs) in navList" :href="items.linkUrl" :class="{'btn-active': indexs === 0 }" :key="items.name" >
          <i v-if='indexs === 0'  style='margin-right:10px;' class="icon iconfont icon-caidan"></i>
          {{items.name}}
        </a> -->

        <nuxt-link  class="nav btn-active"   to="/goods" >
          <i style='margin-right:10px;' class="icon iconfont icon-caidan"></i>
          全部服务分类
        </nuxt-link>
        <nuxt-link  class="nav" to="/" >
          首页
        </nuxt-link>
        <nuxt-link  class="nav" to="/sharing" >
          视讯内容
        </nuxt-link>
        <!-- <a class="nav"  href="/video" >
          视频
        </a> -->
        <nuxt-link  class="nav" to="/community/" >
          求苗社区
        </nuxt-link>
        <nuxt-link  class="nav" to="/download/" target="_blank">
          下载App
        </nuxt-link>
        <div class='nav-child'>
          <nuxt-link  v-for="(item, index) in index_menu" :to="'/goods/'+ (codeToText[item.cateCode] || 'all')" :key="index">
            <i class="icon iconfont icon-jiangbei" ></i>
            {{item.cateName}}
            <i class="icon iconfont icon-directionbottom-copy" ></i>
          </nuxt-link>
        </div>
      </el-col>
      <el-col :span="4" class="tr">
		<!-- 
        1.若用户未登录， 则跳转到登入框；
        2.若用户未认证， 则跳转到认证流程；
        3.若用户已认证， 则跳转到发布服务流程；
      -->
        <direct class="el-button el-button--warning">
          <i class="icon iconfont icon-fabu" slot ="handleIcon"></i>
        </direct>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Direct from './Direct'

export default {
  components: {
    Direct
  },
  computed: {
    index_menu: function () {
      return this.$store.state.index.menu
    },
    user: function () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      codeToText: {
        'V11': 'match', // 赛事
        'V12': 'train', // 培训
        'V18': 'ticket' // 票务
      }
      // navList: [
      //   {
      //     name: '全部服务分类',
      //     linkUrl: '/goods'
      //   },
      //   // {
      //   //   name: '资讯',
      //   //   linkUrl: '/news'
      //   // },
      //   {
      //     name: '视频',
      //     linkUrl: '/common/index'
      //   }
      //   // {
      //   //   name: '社区',
      //   //   linkUrl: '/community/marrow'
      //   // },
      //   // {
      //   //   name: '下载',
      //   //   linkUrl: '/resources/html/downloadApp.html'
      //   // }
      // ]
    }
  }
}
</script>

<style lang="scss">
  nav{
    .nav-main{
      position:relative;
      .nav-child{
        position:absolute;
        z-index: 1000;
        top:54px;
        width:230px;
        height:420px;
        background:rgba(0,0,0,0.7);
        a{
          padding:0;
          margin:0;
          padding-left:30px;
          padding-right: 28px;
          color:#fff;
          height:50px;
          line-height:50px;
          &:hover{
            color:#fff;
            background:rgba(255,255,255,0.2);
          }
          .icon-jiangbei{
            font-size:18px;
            margin-right: 10px;
            color:$color-primary;
          }
          .icon-directionbottom-copy{
            float:right;
            font-size:12px;
            color:rgba(255,255,255,0.5)
          }
        }
      }
      .nav{
        float:left;
        color: #333
      }
      a{
        display:block;
        padding: 0 39px;
        font-size: 16px;
        height:50px;
        line-height:50px;
        margin-right:2px;
        cursor:pointer;
        &:hover{
          color: $color-primary;
        }
      }
      .btn-active{
        margin-right:38px;
        width:230px;
        text-indent: 30px;
        cursor:default;
        padding:0;
        background: $color-primary;
        color: $color-white;
        &:hover{
          color: $color-white;
        }
      }
    }
    .el-button--warning{
      color:#fff!important;
      min-width:150px;
    }
  }
</style>
