<template>
  <div class="header_box">
    <div class="mit_container">
        <div class="about_logo">
            <nuxt-link to="/">
              <img src="/images/about/about_logo.png" width="100%">
            </nuxt-link>
        </div>
        <ul class="about_list">
            <li :class="index==zindex ? 'active':''" v-for="(item,zindex) in menu"><nuxt-link :to="item.href">{{item.title}}</nuxt-link></li>
        </ul>
    </div>
  </div>
</template>
<script>
  export default{
    props: {
      index: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        menu: [
          {
            title: '首  页',
            href: '/about'
          },
          {
            title: '关于我们',
            href: '/about/intro'
          },
          {
            title: '产品中心',
            href: '/about/product'
          },
          {
            title: '新闻动态',
            href: '/about/news'
          },
          {
            title: '人才招聘',
            href: '/about/join'
          },
          {
            title: '联系我们',
            href: '/about/contact'
          }
        ]
      }
    }
  }
</script>
<style scoped lang="scss">
.mit_container{
  width: 1200px;
  margin: 0 auto;
  overflow:hidden;
  *{
    box-sizing:content-box;
  }
}
.header_box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  font-size: 0;
  z-index: 99;
}
.header_box .about_logo {
  width: 227px;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}
.header_box ul.about_list {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 280px;
}
.header_box ul.about_list li {
  margin: 0 15px;
  padding: 0 15px;
  line-height: 90px;
  float: left;
}
.header_box ul.about_list li a {
  color: #fff;
  position: relative;
}
.header_box ul.about_list li a:hover:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 20px;
  height: 2px;
  margin-left: -10px;
  background: #23c270;
}
.header_box ul.about_list li.active a:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 20px;
  height: 2px;
  margin-left: -10px;
  background: #23c270;
}
</style>