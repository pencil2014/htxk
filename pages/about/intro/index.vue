<template>
  <div class="wrapp">
    <div class="banner">
      <a-header :index="1" />
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
        <img src="/resources/images/about/about_us.png" width=""></div>
      <h2 class="about_text">
        <span>关于我们</span></h2>
      <div class="about_slide_container">
        <el-tabs v-model="active">
          <el-tab-pane label="公司介绍" name="first">
            <div class="tab_box introduce_box">
              <h1 class="intro_title">公司简介</h1>
              <div class="intro_desc">
                <p class="indent">深圳华体星空体育文化有限公司成立于2016年，团队成员数百人，位于具有中国“硅谷”之称的南山科技园。华体星空以”共享互联”的思想，承载体育产业诸个环节，为体育爱好者提供优质体育服务。2017年初，公司获得广东紫界网络科技有限公司与深圳华海乐盈网络科技有限公司的9500万的首轮投资。追加投资1.7亿在产品上线后，投资方追投1.7亿用于体育生态合作伙伴扶持与搭建。</p>
                <p class="indent">“求苗”是由深圳华体星空体育文化有限公司研发并发行的体育消费服务综合平台。是一个为体育产业机构（B端）和体育爱好者（C端），提供体育产品资源互通及健康运动服务的互联网平台。</p>
                <p class="indent">求苗体育平台能让体育爱好人士、球队、俱乐部、赛事、赞助商、媒体机构和其他组织在求苗平台通过线上形式，完成组建球队、发布活动、寻找赞助、增加曝光、获取收益、数据统计的消费和服务。</p></div>
              <h1 class="intro_title condition">优越有爱的环境</h1>
              <div class="condition_box">
                <div class="left_img">
                  <img src="/resources/images/about/proscenium.jpg" width="100%"></div>
                <div class="right_img">
                  <img src="/resources/images/about/relaxation_01.jpg" width="100%">
                  <img src="/resources/images/about/relaxation_02.jpg" width="100%" class="mgin10"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="管理团队" name="second">
            <dl class="tab_box manage_box">
              <dt>
                <div class="left_box">
                  <img src="/resources/images/about/wangjian.jpg" width="100%"></div>
                <div class="right_box">
                  <div class="manage_infor">
                    <h2 class="title">汪剑</h2>
                    <p class="post">华体星空轮值CEO</p>
                    <div class="manage_intro">
                      <p>集丰富的管理经验与扎实的科研技能于一身的综合型人才。</p>
                      <p>2016年加入华体星空，拥有13年互联网的技术专业背景，曾在多家公司担任技术经理，</p>
                      <p>也曾作为技术合伙人参与创业，在互联网产品和技术方面积累了丰富的专业技能和管理经验。</p>
                    </div>
                  </div>
                </div>
              </dt>
              <dt>
                <div class="left_box">
                  <img src="/resources/images/about/pic_01.png" width="100%"></div>
                <div class="right_box">
                  <div class="manage_infor">
                    <h2 class="title">李斌</h2>
                    <p class="post">华体星空产品总监</p>
                    <div class="manage_intro">
                      <p>毕业于西安空军工程大学</p>
                      <p>大学时期以电竞选手身份签约深圳游戏企业，从事游戏设计；</p>
                      <p>和小伙伴成立过工作室和动漫游戏公司，打造原创动漫和游戏；</p>
                      <p>现加盟华海集团，负责体育平台的设计。</p>
                    </div>
                  </div>
                </div>
              </dt>
              <dt>
                <div class="left_box">
                  <img src="/resources/images/about/ceo.png" width="100%"></div>
                <div class="right_box">
                  <div class="manage_infor">
                    <h2 class="title">陈凯</h2>
                    <p class="post">华体星空产品应用负责人</p>
                    <div class="manage_intro">
                      <p>毕业于中国传媒大学</p>
                      <p>曾任职腾讯、华融集团、百灵鸟等互联网公司，</p>
                      <p>6年互联网产品经历，参与或主导过的产品有:手机QQ个性化装扮/手机QQ游戏公会/手机QQ游戏视频/手机QQ游戏宝箱/华融金服/百灵鸟等。</p>
                      <p>擅长领域:产品策划与运营/产品互联网思维/产品战略规划/互联网心理学等。</p>
                    </div>
                  </div>
                </div>
              </dt>
              <dt>
                <div class="left_box">
                  <img src="/resources/images/about/pic_02.png" width="100%"></div>
                <div class="right_box">
                  <div class="manage_infor">
                    <h2 class="title">唐祖科</h2>
                    <p class="post">华体星空产品盈利负责人</p>
                    <div class="manage_intro">
                      <p>曾经的体育狂热爱好者，</p>
                      <p>现在的体育发展践行者。</p>
                      <p>在加入华体星空前，</p>
                      <p>曾供职于新浪彩票、腾讯等IT公司。</p>
                    </div>
                  </div>
                </div>
              </dt>
            </dl>
          </el-tab-pane>
          <el-tab-pane label="企业文化" name="third">
            <div class="tab_box culture_box">
              <img src="/resources/images/about/culture.jpg" width="100%">
            </div>
          </el-tab-pane>
          <el-tab-pane label="品牌故事" name="fourth">
            <div class="tab_box brand_box">
              <div class="brand_content_box">
                <div class="brand_head">
                  <span class="brand_dot">●</span>
                  <span class="title">关于“求苗”</span></div>
                <div class="desc_box">
                  <p>求苗，是华体星空于2016年创建的子品牌。经历了几代技术团队，千百个日夜的研究，求苗才与大家见面。求苗在体育界的不断深耕，一步步成长，只愿为用户带来更好的产品和服务。</p>
                </div>
                <div class="brand_head">
                  <span class="brand_dot">●</span>
                  <span class="title">何为“求苗”</span></div>
                <div class="desc_box">
                  <p>求苗，寄予了创始团队对于体育的传承和家国情怀。</p>
                  <p>“求”谐音是球，融于体育，又寓意追求，继承华体星空愿景“追求体育的美”，升华于体育之上。</p>
                  <p>“苗”代表体育之苗，即华体星空培养体育苗子的企业情怀和愿景</p>
                  <p>“求苗体育”是一个精选有潜力的体育项目，打造互联网体育IP服务平台</p>
                  <p>
                  </p>
                </div>
                <div class="brand_head">
                  <span class="brand_dot">●</span>
                  <span class="title">品牌设计</span></div>
                <div class="brand_design">
                  <ul class="design_ul">
                    <li>
                      <img src="/resources/images/about/design_pic_1.jpg" width="100%" alt="">
                      <div class="title">奥林匹克的重要性不是取胜,而是
                        <span class="define_green">参与</span>——顾拜旦</div></li>
                    <li>
                      <img src="/resources/images/about/design_pic_2.jpg" width="100%" alt="">
                      <div class="title">承载资源，
                        <span class="define_green">共享</span>互联</div></li>
                    <li>
                      <img src="/resources/images/about/design_pic_3.jpg" width="100%" alt="">
                      <div class="title">体育促进人与人的
                        <span class="define_green">交往</span>及文化间的交流碰撞</div></li>
                  </ul>
                  <div class="design_desc">
                    <p>求苗Logo考虑两大核心要素：继承集团的文化和产品定位</p>
                    <p>
                      <span class="brand_dot">●</span>
                      <span>图形：“H”像两个相互交臂协作的人，代表体育赛场上的协作精神，亦是企业文化中团队的重要一环；</span></p>
                    <p class="padleft30">“H”是“Hope”的缩写，也传达着求苗体育精选体育IP的希望。</p>
                    <p>
                    </p>
                    <p>
                      <span class="brand_dot">●</span>
                      <span>意图：求苗体育，一个体育IP服务平台，让用户能参与体育活动，共享资源，促进社会人文发展。</span></p>
                    <p>
                      <span class="brand_dot">●</span>
                      <span>颜色：绿色是求苗的主色调，健康朝气，整体搭配明亮轻快，符合年轻人的定位</span></p>
                  </div>
                  <img src="/resources/images/about/explain_bg.jpg" width="100%" alt=""></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
  .about_container ul.title {
    margin-left: -20px;
    margin-right: -20px;
    width: 616px;
    margin: 0 auto;
    overflow: hidden;
  }
  .about_container ul.title li {
    margin: 0 20px;
    width: 114px;
    height: 34px;
    line-height: 34px;
    float: left;
    text-align: center;
    cursor: pointer;
  }
  .about_container ul.title li.active {
    background: #23c270;
    color: #fff;
  }
  .tab_box {
    padding: 55px 0;
  }
  .introduce_box .intro_title {
    font-size: 30px;
    color: #333;
    text-align: center;
    padding: 35px 0;
    font-weight: normal;
  }
  .introduce_box .intro_title.condition {
    margin-top: 85px;
  }
  .introduce_box .intro_desc p {
    line-height: 30px;
    font-size: 16px;
    color: #666;
  }
  .introduce_box .intro_desc p.indent {
    text-indent: 32px;
  }
  .condition_box {
    font-size: 0;
  }
  .condition_box .left_img {
    width: 800px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .condition_box .right_img {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    width: 390px;
    margin-left: 10px;
  }
  .condition_box .mgin10 {
    margin-top: 10px;
  }
  .condition_box img {
    display: block;
  }
  .manage_box {
    margin-top: 20px;
  }
  .manage_box dl dt {
    font-size: 0;
  }
  .manage_box dt {
    padding: 25px 0;
  }
  .manage_box .left_box {
    width: 164px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .manage_box .right_box {
    width: 730px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 50px;
  }
  .manage_infor .title {
    font-size: 24px;
    color: #333;
    font-weight: normal;
  }
  .manage_infor .post {
    padding: 15px 0;
    color: #999;
    font-size: 18px;
  }
  .manage_infor .manage_intro p {
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  .culture_box {
    padding: 40px 0 70px;
  }
  .brand_box {
    margin: 35px 0 45px;
  }
  .brand_box .explain_product {
    font-size: 16px;
    color: #666;
    line-height: 24px;
    padding: 15px 0 15px 300px;
  }
  .brand_box .explain_img {
    width: 895px;
    margin: 35px  auto 50px;
  }
  .brand_box .product_intro {
    width: 895px;
    margin: 0 auto;
    font-size: 16px;
    color: #666;
    line-height: 36px;
  }
  .brand_box .product_intro .green {
    color: #49d388;
  }
  .brand_content_box {
    padding:0 30px;
  }
  .brand_content_box .brand_head{
    font-size: 24px;
    color: #333;
    padding:10px 0;
  }
  .brand_content_box .desc_box{
    font-size: 16px;
    color: #666;
    line-height: 30px;
    padding-left: 20px;
    padding-bottom: 50px;
  }
  .brand_dot{
    font-size: 16px;
    margin-top: -5px;
    vertical-align: middle;
    display: inline-block;
    color: #23c270;
  }
  .brand_design{
    background: #fcfbff;
    padding:60px 98px;
  }
  .design_ul{
    margin-right: -22px;
    margin-left: -22px;
    overflow: hidden;
  }
  .design_ul li{
    width: 285px;
    margin:0 22px;
    float: left;
    background: #fff;
  }
  .design_ul li .title{
    color: #999;
    font-size: 16px;
    line-height: 30px;
    padding:10px 20px;
    height: 80px;
  }
  .design_desc{
    margin-top: 50px;
  }
  .design_desc{
    font-size: 16px;
    color: #666;
    line-height: 36px;
    padding-bottom: 80px;
  }
  .design_desc .padleft30{
    padding-left: 64px;
  }
  .define_green{
    color: #23c270;
  }
</style>
<style lang="scss">
  .about_container .el-tabs__header{
    border:0;
    .el-tabs__item.is-active{
      background: #23c270;
      color: #fff;
    }
    .el-tabs__nav{
      float:none;
      margin:0 auto;
      text-align:center;
      .el-tabs__active-bar{
        background-color:#fff;
      }
    }
  }
</style>