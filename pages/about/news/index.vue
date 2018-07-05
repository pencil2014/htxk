<template>
  <div class="wrapp">
    <div class="banner">
      <a-header :index="3" />
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
        <img src="/resources/images/about/news_title.png" width=""></div>
      <h2 class="about_text">
        <span>新闻动态</span></h2>
      <div class="news_list">
        <ul>
          <li v-for="(item,index) in news" :key="index">
            <div class="left_calendar">
              <div class="day">{{item.day}}</div>
              <div class="month">{{item.month}}</div></div>
            <div class="right_content">
              <h3 class="title">{{item.title}}</h3>
              <div class="desc">{{item.desc}}</div>
              <a class="read_more" target="_blank" :href="item.href">阅读全文&gt;</a></div>
          </li>
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
        ],
        news: [
          {
            'day': '04',
            'month': 'Jul',
            'title': '《华海乐盈•中国科学院大学大数据联合实验室成立》（搜狐网）',
            'desc': '2017年7月3日上午，华海乐盈•中国科学院大学大数据联合实验室在中国科学院大学成立，该实验室由华海乐盈网络科技集团与中国科学院虚拟经济与数据科学研究中心共同组建',
            'href': 'http://www.sohu.com/a/154382121_564883'
          },
          {
            'day': '29',
            'month': 'Jun',
            'title': '《求苗体育再升级，匠心打造新一代体育IP服务平台》（前瞻网）',
            'desc': '日前，深圳华体星空体育文化有限公司旗下体育IP服务平台APP——求苗体育v2.0.0 版本，再一次升级上线。本次改版后的求苗体育在其互联网体育之路再次迈出的有力步伐。',
            'href': 'http://www.qianzhan.com/indynews/detail/283/170629-67bc233c.html'
          },
          {
            'day': '21',
            'month': 'Jun',
            'title': '《CBA迎来夏季联赛 长三角六队试水练兵》（转载于新闻晨报）',
            'desc': '新华社上海6月21日电，中国篮球改革再迎新举措。CBA夏季联赛组委会21日在上海宣布，2017CBA　夏季联赛暨长三角职业篮球俱乐部挑战赛将于7月6日至9日在上海浦东源深体育馆举行。',
            'href': 'http://newspaper.jfdaily.com/xwcb/html/2017-06/22/content_16231.htm'
          },
          {
            'day': '21',
            'month': 'Jun',
            'title': '《人民日报:今看国乒须居安思危启动》 （转载于环球网）',
            'desc': '中国乒乓球队管理模式做出新的改变，既意外，也不意外。乍一看，国乒长盛不衰的势头仍在延续，各种冠军依然如流水线般出产。光环还是那么耀眼，为什么要对管理模式做出调整，调整的目标又指向何方？',
            'href': 'http://sports.huanqiu.com/others/zh/2017-06/10876790.html'
          },
          {
            'day': '20',
            'month': 'Jun',
            'title': '《互联网+体育的后起之秀：求苗体育》（今晚网）',
            'desc': '在巨头抢滩布局“互联网+”体育中，竞争已经日趋白热化，阿里巴巴、乐视、腾讯、PPTV纷纷布局体育行业，互联网+体育生态格局正在逐步形成。',
            'href': 'http://www.jwb.com.cn/hy/201706/t20170620_4764037.html'
          },
          {
            'day': '20',
            'month': 'Jun',
            'title': '《央视确认成为中国大陆地区国际冠军杯官方国际冠军杯合作伙伴，双方签约四年》 （转载于懒熊体育）',
            'desc': '6月20日，国际冠军杯（ICC）的主办方Relevent Sports、嘉达利锋集团今天宣布，CCTV正式成为中国大陆地区国际冠军杯（ICC）官方电视转播合作伙伴。',
            'href': 'http://www.lanxiongsports.com/?c=posts&a=view&id=6549'
          },
          {
            'day': '14',
            'month': 'Jun',
            'title': '《2022年冬奥会和冬残奥会会徽计划今年年底前发布》（转载于人民网）',
            'desc': '人民网北京6月13日电（记者胡雪蓉） 6月13日下午，国际奥委会北京2022年冬奥会协调委员会第二次会议举行新闻发布会。记者从发布会上获悉，北京冬奥会和冬残奥会会徽将于今年年底前适时发布。',
            'href': 'http://sports.people.com.cn/n1/2017/0614/c407727-29337666.html'
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
  .news_list li {
    padding: 30px 0 15px;
    font-size: 0;
    border-bottom: 1px dashed #e5e5e5;
  }
  .news_list li .left_calendar {
    width: 85px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    border-top: 4px solid #c0cec7;
    text-align: center;
  }
  .news_list li .left_calendar .day {
    font-size: 36px;
    color: #999;
    padding: 15px 0 12px;
  }
  .news_list li .left_calendar .month {
    font-size: 18px;
    color: #999;
  }
  .news_list li .right_content {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    width: 980px;
    padding-left: 90px;
  }
  .news_list li .right_content .title {
    font-size: 24px;
    color: #333;
    font-weight: normal;
    padding-bottom: 15px;
  }
  .news_list li .right_content .desc {
    font-size: 14px;
    color: #999;
    line-height: 24px;
    margin-bottom: 15px;
  }
  .news_list li .right_content .read_more {
    color: #3983e5;
  }
</style>