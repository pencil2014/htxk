<template>
  <div class="wrapp about">
    <div class="banner">
      <a-header :index="5" />
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
        <span>联系我们</span></h2>
        <div class="contact_container">
          <ul class="cooperate_box">
            <li>
              <div class="cooperate">
                <div class="mod_h1">商务合作</div>
                <p>电话：86338324转8843</p>
                <p>邮箱：htxk-BD@13322.com</p>
              </div>
            </li>
            <li>
              <div class="cooperate">
                <div class="mod_h1">战略合作</div>
                <p>电话：86338109转8868</p>
                <p>邮箱：hhlykj@13322.com</p>
              </div>
            </li>
            <li>
              <div class="cooperate">
                <div class="mod_h1">媒体合作</div>
                <p>电话：86338324转8843</p>
                <p>邮箱：htxk-brand@13322.com</p>
              </div>
            </li>
          </ul>
        </div>
    </div>
    <div class="contact_content">
      <div class="mit_container">
        <div class="left_content address_box">
          <h2>办公地址</h2>
          <p class="intro">深圳华体星空体育文化有限公司，位于集团总部——有中国“硅谷”之称的南山科技园 办公室面积约2500㎡，团队目前有数百人。</p>
          <div class="address">
            <p>地址：深圳市南山区讯美科技大厦2号楼16层</p>
            <p>电话：0755-86338324-8843</p>
            <p>邮箱：htxk-HR@13322.com</p>
          </div>
        </div>
        <div class="right_content">
          <img src="/images/about/map.png" width="100%">
        </div>
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
      const BtnComponent = {
        props: ['text'],
        template: `<button>{{text}}</button>`
      }
      const center = [121.59996, 31.197646]
      return {
        zoom: 12,
        center,
        markers: [],
        source: 'click',
        window: {
          position: center,
          contentRender: h => h(BtnComponent, {
            props: {
              text: 'hello'
            },
            style: {
              background: 'rgb(173, 47, 47)',
              color: '#eee'
            },
            nativeOn: {
              click: () => this.handler(`hello click`)
            }
          })
        },
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
    },
    mounted () {
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
  .contact_container {
    padding: 50px 0;
  }
  .contact_container .mod_h1 {
    color: #333333;
    font-size: 20px;
    position: relative;
    line-height: 20px;
    font-weight: bold;
    padding: 10px 0;
    color: #666666;
    font-weight: normal;
  }
  .contact_container .mod_h1:after {
    display: inline-block;
    float: left;
    margin-right: 10px;
    vertical-align: middle;
    content: "";
    width: 4px;
    height: 20px;
    background: #01a87c;
  }
  .contact_container .cooperate_box {
    margin-right: -300px;
    overflow: hidden;
  }
  .contact_container .cooperate_box li {
    width: 500px;
    float: left;
  }
  .contact_container .cooperate_box li .cooperate p {
    font-size: 14px;
    color: #666;
    line-height: 30px;
  }
  .contact_content {
    background: #f9fafa;
    padding: 50px 0;
    font-size: 0;
  }
  .left_content {
    width: 645px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .left_content h2 {
    font-size: 20px;
    color: #333;
    padding: 15px 0;
    font-weight: normal;
  }
  .left_content .intro {
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  .left_content .address {
    padding: 15px 0;
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  .right_content {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    width: 550px;
  }
  .right_content #map_box {
    width: 551px;
    height: 322px;
  }
  .wrapp.about footer{
    margin-top:0;
  }
</style>
