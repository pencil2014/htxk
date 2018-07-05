<template>
  <div class="wrapp about">
    <div class="banner">
      <a-header :index="4" />
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
    <div class="mit_container about_container">
      <div class="about_title">
        <img src="/resources/images/about/join_us.png" width=""></div>
      <h2 class="about_text">
        <span>加入我们</span></h2>
      <div class="join_container">
        <h3 class="title">我们是怀揣梦想、追求卓越的团队</h3>
        <div class="desc">
          <p>深圳华体星空体育文化有限公司——互联网界的颜值担当</p>
          <p>在这里，没有森严冰冷的上下级关系，</p>
          <p>也没有拖沓的行政流程，</p>
          <p>工作更像是交流学习，一言不合就找个地方三四人来个头脑风暴，</p>
          <p>只要你的idea够好有趣，你甚至都可以直接推开总经理的办公室直接找他聊聊。</p>
          <p>如果这也是你的工作调性，</p>
          <p>那么，来聊聊吧！</p>
        </div>
      </div>
    </div>
    <div class="join_welfare">
      <div class="mit_container">
        <h2 class="welfare_title">公司福利</h2>
        <ul class="welfare_box">
          <li>
            <img src="/resources/images/about/join_re_01.jpg" width="100%">
            <div class="list_title">有好玩的吗</div>
            <div class="list_desc">篮球，羽毛球，足球，桌游，摄影班等，除了一起头脑风暴，也要一起欢乐风暴！</div></li>
          <li>
            <img src="/resources/images/about/join_re_02.jpg" width="100%">
            <div class="list_title">有什么好处</div>
            <div class="list_desc">五险一金、薪资待遇丰厚，年底分红、加班伙食补助、加班车费报销、节假日礼品、团建活动，年会活动……别人有的我们都有，别人没有的我们更要有！</div></li>
          <li>
            <img src="/resources/images/about/join_re_03.jpg" width="100%">
            <div class="list_title">小伙伴什么样</div>
            <div class="list_desc">85后年轻化的文化氛围，行业精英、年轻时尚、高颜值……好看又有才的人好像都喜欢来我们公司哎。我们花重金发掘最佳同事，我们致力于做有影响力的体育数据供应商，最终发展为体育界的生态公司。</div></li>
        </ul>
      </div>
    </div>
    <div class="mit_container about_container job_box">
      <h2 class="welfare_title">热聘职位</h2>
      <div class="post_container">
        <dl class="post_item">
          <dt>技术/研发</dt>
          <dd>Java高级开发工程师</dd>
          <dd>H5前端开发</dd>
          <dd>运维开发工程师</dd>
          <dd>高级Android开发工程师</dd>
          <dd>系统架构师</dd>
          <dd>高级IOS开发工程师</dd></dl>
        <dl class="post_item">
          <dt>产品/设计</dt>
          <dd>产品总监</dd>
          <dd>产品经理</dd>
          <dd>软件QA</dd>
          <dd>UE设计师</dd>
          <dd>UI设计师</dd>
          <dd>平面设计</dd></dl>
        <dl class="post_item">
          <dt>市场/运营</dt>
          <dd>市场经理</dd>
          <dd>商务渠道</dd>
          <dd>品牌经理</dd>
          <dd>产品运营</dd>
          <dd>内容运营</dd>
          <dd>SEO</dd></dl>
      </div>
      <div class="join_center_box">
        <a href="https://www.lagou.com/gongsi/64077.html" target="_blank">招聘中心</a></div>
    </div>
    <div class="contact_wrap">
      <div class="mit_container">
        <h3 class="title">联系我们</h3>
        <ul class="list">
          <li>
            <span>联系人：HR云小姐</span></li>
          <li>
            <span>电话：0755-86338324-8843</span></li>
          <li>
            <span>邮箱：htxk-HR@13322.com</span></li>
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
    },
    data () {
      return {
        active: 'first',
        slideList: [
          {
            'url': '/resources/images/about/banner/banner_02.png',
            'href': '/',
            'title': '体育资源共享平台',
            'desc': '求苗体育聚集各类体育产业IP，包含但不限于体育赛事、体育培训、体育旅游、体育赞助、体育用品等各大板块，实现多种资源的聚合与互通'
          },
          {
            'url': '/resources/images/about/banner/banner_03.png',
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
  .about_container {
    padding: 35px 0;
    overflow: hidden;
  }
  .about_container .about_title {
    padding: 25px 0;
    text-align: center;
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
  .join_container {
    text-align: center;
  }
  .join_container .title {
    font-size: 30px;
    color: #333;
    font-weight: normal;
    padding: 50px 0 40px;
  }
  .join_container .desc {
    font-size: 16px;
    color: #666;
    line-height: 36px;
  }
  .join_welfare {
    background: #f9fafa;
    padding-bottom: 90px;
  }
  .join_welfare .welfare_title {
    font-size: 30px;
    color: #333;
    text-align: center;
    padding: 50px 0 80px;
    font-weight: normal;
  }
  .join_welfare .welfare_box {
    margin-right: -15px;
    margin-left: -15px;
    overflow: hidden;
  }
  .join_welfare .welfare_box li {
    width: 380px;
    padding: 0 15px;
    float: left;
  }
  .join_welfare .welfare_box li .list_title {
    font-size: 18px;
    color: #333;
    padding: 30px 0 15px;
    text-align: center;
  }
  .join_welfare .welfare_box li .list_desc {
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  .welfare_title {
    font-size: 30px;
    color: #333;
    text-align: center;
    padding: 50px 0 80px;
    font-weight: normal;
  }
  .post_container {
    margin-right: -330px;
    padding-bottom: 40px;
    overflow: hidden;
  }
  .post_container dl dt {
    font-size: 20px;
    color: #333;
    padding-bottom: 40px;
  }
  .post_container .post_item {
    width: 510px;
    float: left;
  }
  .post_container dl dd {
    font-size: 16px;
    color: #666;
    line-height: 36px;
  }
  .contact_wrap {
    background: #f9fafa;
    widows: 100%;
    padding: 50px 0 80px;
  }
  .contact_wrap .title {
    padding-bottom: 80px;
    font-size: 30px;
    font-weight: normal;
    text-align: center;
  }
  .contact_wrap .list li {
    width: 33%;
    float: left;
    text-align: center;
  }
  .wrapp.about footer{
    margin-top:0;
  }
</style>
