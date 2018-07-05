<template>
  <div class="wrapp">
    <div class="banner">
      <a-header :index="2" />
      <div class="product-banner">
        <img src="/images/about/banner/banner_01.png" height="100%">
        <div class="mit_container banner_text product_btn">
          <nuxt-link to="/download"  class="read_more">
            下载体验
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="product_wrap">
      <div class="mit_container product_center">
        <h1 class="product_title">产品介绍</h1>
        <ul class="product_container">
          <li>
            <div class="img_box">
              <img src="/resources/images/about/phone.png" width="100%"></div>
            <div class="product_desc">“求苗”是由深圳华体星空体育文化有限公司研发并发行的体育消费服务综合平台。目前，产品配备移动端（IOS、安卓、H5）的求苗应用，配以PC专业化、标准化的管理后台。</div></li>
          <li>
            <div class="img_box">
              <img src="/resources/images/about/computer.png" width="100%"></div>
            <div class="product_desc">“求苗”是一个为体育产业机构（B端）和体育爱好者（C端），提供体育产品资源互通及健康运动服务的互联网平台。</div></li>
          <li>
            <div class="img_box">
              <img src="/resources/images/about/more.png" width="100%"></div>
            <div class="product_desc">“求苗”能让体育爱好人士、球队、俱乐部、赛事、赞助商、媒体机构和其他组织在求苗平台通过线上形式，完成组建球队、发布活动、寻找赞助、增加曝光、获取收益、数据统计的消费和服务。</div></li>
        </ul>
      </div>
      <div class="clear"></div>
      <div class="product_advantage pr">
        <div class="advantage_box">
          <div class="mit_container">
            <h2 class="title">亮点及优势</h2>
            <div class="advantage_desc">
              <p>打造体育IP服务平台，面向各类体育IP共享体育产业的专业服务。</p>
              <p>为体育产业提供专业化的工作环境和盈利模式，为消费端用户提供专属运动社区。</p>
            </div>
          </div>
        </div>
        <img src="/resources/images/about/advantage.jpg" width="100%"></div>
      <div class="mit_container serve_container">
        <h1 class="product_title">服务内容</h1>
        <ul class="product_content">
          <li>
            <img src="/resources/images/about/community.png" width="100%">
            <div class="title">体育圈社区</div></li>
          <li>
            <img src="/resources/images/about/news.png" width="100%">
            <div class="title">资讯发布和推送</div></li>
          <li>
            <img src="/resources/images/about/intro_02.png" width="100%">
            <div class="title">&nbsp;体育视频和赛事直播</div></li>
          <li>
            <img src="/resources/images/about/city_01.png" width="100%">
            <div class="title">同城服务</div></li>
          <li>
            <img src="/resources/images/about/data_base.png" width="100%">
            <div class="title">体育数据库</div></li>
          <li>
            <img src="/resources/images/about/backstage_01.png" width="100%">
            <div class="title">后台数据统计</div></li>
          <li>
            <img src="/resources/images/about/operate_01.png" width="100%">
            <div class="title">赛事的发布、监控和媒体运作</div></li>
          <li>
            <img src="/resources/images/about/shop_01.png" width="100%">
            <div class="title">运动周边商城</div></li>
        </ul>
      </div>
    </div>
    <x-footer />
  </div>
</template>
<script>
  import aHeader from '../components/AHeader'
  import XFooter from 'components/XFooter'
  export default{
    layout: 'blank',
    components: {
      aHeader,
      XFooter
    }
  }
</script>
<style lang="scss" scoped>
  .mit_container{
    width: 1200px;
    margin: 0 auto;
    overflow:hidden;
    *{
      box-sizing:content-box;
    }
  }
  .product-banner{
    height:600px;
  }
  .mit_container.banner_text {
    position: absolute;
    top: 220px;
    width: 100%;
    text-align: center;
    z-index: 99;
    color: #fff;
  }
  .mit_container.banner_text h2.title {
    font-size: 40px;
    font-weight: normal;
  }
  .mit_container.banner_text .desc {
    font-size: 14px;
    padding: 15px;
    width: 100%;
  }
  .banner_text .read_more {
    width: 160px;
    height: 50px;
    line-height: 50px;
    background: #23c270;
    color: #fff;
    display: block;
    text-align: center;
    margin: 0 auto;
    margin-top: 80px;
    border-radius: 6px;
    font-size: 18px;
  }
  .banner_text .read_more:hover {
    background: #32da6a;
  }
  .mit_container.banner_text.product_btn {
    top: 260px;
  }
  .mit_container.banner_text.product_btn .read_more {
    margin-left: 50%;
    font-size: 18px;
  }
  .product_title {
    font-size: 30px;
    color: #333;
    padding: 90px 0;
    text-align: center;
    font-weight: normal;
  }
  ul.product_container {
    margin-right: -96px;
    margin-left: -96px;
  }
  ul.product_container li {
    width: 280px;
    padding: 0 92px;
    float: left;
  }
  ul.product_container li .img_box {
    width: 139px;
    margin: 0 auto;
    margin-bottom: 60px;
  }
  ul.product_container li .product_desc {
    font-size: 14px;
    color: #666;
    line-height: 24px;
    padding:0 5px 115px 5px;
  }
  .product_advantage {
    position:relative;
  }
  .advantage_box {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
  .advantage_box .title {
    text-align: center;
    font-size: 36px;
    padding: 80px 0 30px;
    font-weight: normal;
    color: #fff;
  }
  .advantage_box .advantage_desc {
    text-align: center;
    color: #fff;
    font-size: 16px;
    line-height: 30px;
  }
  .serve_container .product_title {
    font-size: 36px;
    color: #333;
    padding: 90px 0 70px;
    font-weight: normal;
  }
  .serve_container ul.product_content {
    margin-right: -143px;
    margin-left: -143px;
    margin-bottom: 90px;
    overflow: hidden;
  }
  .serve_container ul.product_content li {
    width: 85px;
    padding: 0 143px;
    float: left;
  }
  .serve_container ul.product_content li .title {
    width: 185px;
    margin-left: -50px;
    text-align: center;
    padding: 24px 0 60px;
  }
</style>