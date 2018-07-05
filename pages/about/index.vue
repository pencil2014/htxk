<template>
  <div class="wrapp">
    <div class="banner">
      <a-header :index="0"/>
      <el-carousel trigger="click" height="600px">
        <el-carousel-item v-for="(item,index) in slideList" :autoplay="false" :key="index">
          <img :src="item.url" height="100%" />
          <div class="mit_container banner_text">
            <h2 class="title">{{item.title}}</h2>
            <p class="desc">{{item.desc}}</p>
            <a :href="item.href" class="read_more">了解更多</a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="intro_container">
      <div class="mit_container know_box">
        <div class="intro_content">
          <h2>了解求苗</h2>
          <p>求苗体育是一个体育IP服务平台</p>
          <p>是一个为体育产业机构（B端）和体育爱好者（C端），提供体育产品资源互通及健康运动服务的互联网平台</p>
        </div>
        <ul class="intro_list">
          <li>
            <div class="img_box">
              <a href="product.html">
                <img src="/images/about/intro_04.png" width="100%"></a>
            </div>
            <p class="desc">体育资源共享平台</p></li>
          <li>
            <div class="img_box">
              <a href="product.html">
                <img src="/images/about/intro_03.png" width="100%"></a>
            </div>
            <p class="desc">体育消费和资源服务</p></li>
          <li>
            <div class="img_box">
              <a href="product.html">
                <img src="/images/about/intro_01.png" width="100%"></a>
            </div>
            <p class="desc">体育生态平台</p></li>
        </ul>
      </div>
      <div class="service_box">
        <div class="mit_container">
          <div class="intro_content">
            <h2>体育消费和服务平台</h2>
            <p>赛事运营管理、合作机构对接、消费数据统计及线上推广等多服务轻松一键搞定</p>
          </div>
          <ul class="service_list">
            <li>
              <div class="img_box">
                <img src="/images/about/community.png" width="100%"></div>
              <p>体育圈社区</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/news.png" width="100%"></div>
              <p>资讯发布和推送</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/intro_02.png" width="100%"></div>
              <p>&nbsp;体育视频和赛事直播</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/city_01.png" width="100%"></div>
              <p>同城服务</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/data_base.png" width="100%"></div>
              <p>体育数据库</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/backstage_01.png" width="100%"></div>
              <p>后台数据统计</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/operate_01.png" width="100%"></div>
              <p>赛事的发布、监控和媒体运作</p>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/shop_01.png" width="100%"></div>
              <p>运动周边商城</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="mit_container share_wrap">
        <div class="intro_content">
          <h2>体育资源共享平台</h2>
          <p>求苗体育聚集各类体育产业IP，包含但不限于体育赛事、体育培训、体育旅游、体育赞助、体育用品等各大板块，实现多种资源的聚合与互通</p>
        </div>
        <div class="share_public_img">
          <img src="/images/about/sport_base.png"></div>
      </div>
      <div class="advantage_wrap">
        <div class="mit_container">
          <div class="intro_content">
            <h2>我们的优势</h2></div>
          <ul class="advantage_list">
            <li>
              <div class="img_box">
                <img src="/images/about/resource.png" width="100%"></div>
              <div class="desc">
                <div class="title">资源</div>
                <p class="text">承载政府及海内外体育资源</p>
                <p class="text">构建互联网体育生态圈</p></div>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/data_01.png" width="100%"></div>
              <div class="desc">
                <div class="title">数据</div>
                <p class="text">与中科院建立联合实验室</p>
                <p class="text">开启大数据体育服务</p></div>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/service.png" width="100%"></div>
              <div class="desc">
                <div class="title">服务</div>
                <p class="text">整合B端及C端体育产业</p>
                <p class="text">实现产品资源互通</p></div>
            </li>
            <li>
              <div class="img_box">
                <img src="/images/about/career.png" width="100%"></div>
              <div class="desc">
                <div class="title">专业</div>
                <p class="text">精选行业第一梯队人才</p>
                <p class="text">提供专业标准化服务</p></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="about_container mit_container partner_wrap">
        <h2 class="about_text">
          <span>合作伙伴</span></h2>
        <ul class="partner_box">
          <li>
            <img src="/images/about/people.png" width="100%"></li>
          <li>
            <img src="/images/about/youth.png" width="100%"></li>
          <li>
            <img src="/images/about/global.png" width="100%"></li>
          <li>
            <img src="/images/about/science.png" width="100%"></li>
        </ul>
      </div>
    </div>
    <x-footer />
  </div>
</template>
<script>
  import aHeader from './components/AHeader'
  import XFooter from 'components/XFooter'
  export default{
    layout: 'blank',
    components: {
      aHeader,
      XFooter
    },
    data () {
      return {
        slideList: [
          {
            'url': '../images/about/banner/banner_02.png',
            'href': '/',
            'title': '体育资源共享平台',
            'desc': '求苗体育聚集各类体育产业IP，包含但不限于体育赛事、体育培训、体育旅游、体育赞助、体育用品等各大板块，实现多种资源的聚合与互通'
          },
          {
            'url': '../images/about/banner/banner_03.png',
            'href': '/',
            'title': '体育消费和服务平台',
            'desc': '赛事运营管理、合作机构对接、消费数据统计及线上推广等多服务轻松一键搞定'
          }
        ]
      }
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
  .intro_content h2 {
    font-size: 36px;
    color: #333;
    padding: 80px 0 25px;
    font-weight: normal;
    text-align: center;
  }
  .intro_content p {
    line-height: 30px;
    font-size: 14px;
    color: #666;
    text-align: center;
  }
  .intro_list {
    padding: 80px 0;
    overflow: hidden;
  }
  .intro_list li {
    width: 170px;
    float: left;
    padding: 0 115px;
  }
  .intro_list li .desc {
    text-align: center;
    padding: 30px 0;
  }
  .service_box {
    background: #f9fafa;
    overflow: hidden;
  }
  .service_box .service_list {
    margin: 80px 0 70px;
    overflow: hidden;
    margin-right: -140px;
    margin-left: -140px;
    text-align: center;
  }
  .service_box .service_list li {
    width: 85px;
    float: left;
    padding: 15px 140px;
  }
  .service_box .service_list li p {
    padding: 24px 0 0;
    width: 185px;
    margin-left: -50px;
  }
  .share_wrap {
    text-align: center;
  }
  .share_wrap .share_public_img {
    padding: 100px 0;
  }
  .advantage_wrap {
    background: #f9fafa;
    padding-bottom: 80px;
    overflow: hidden;
  }
  .advantage_wrap .intro_content h2 {
    padding: 80px 0 50px;
    font-weight: normal;
  }
  .advantage_wrap .advantage_list {
    overflow: hidden;
    padding: 0 84px;
  }
  .advantage_wrap .advantage_list li {
    width: 120px;
    padding: 0 69px;
    float: left;
    text-align: center;
  }
  .advantage_wrap .advantage_list li .desc {
    width: 200px;
    margin-left: -40px;
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  .advantage_wrap .advantage_list li .desc .title {
    font-size: 20px;
    line-height: 35px;
  }
  .partner_box {
    padding: 0 12px;
  }
  .partner_box li {
    padding: 0 47px;
    width: 200px;
    float: left;
  }
  .about_container .about_text {
    text-align: center;
    position: relative;
    margin: 25px 0 40px;
  }
  .about_container .about_text span {
    text-align: center;
    width: 110px;
    display: inline-block;
    font-size: 24px;
    color: #333;
  }
  .about_container .about_text span:after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 530px;
    height: 1px;
    background: #e5e5e5;
  }
  .about_container .about_text span:before {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 530px;
    height: 1px;
    background: #e5e5e5;
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

</style>