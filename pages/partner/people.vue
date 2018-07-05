<template>
<div id="gobalBox">
  <headerSport :logo="logoUrl" :tpBg='bgUrl' :tpTxt='topTxt'/>
  <div class="story">
    <el-row class="qiu-content">
      <el-col :span="24" class="qiu-story">
        <div class="story-text">
          <h2 class="title">平台背景</h2>
          <p>习近平总书记强调，发展体育运动，增强人民体质，是我国体育工作的根本方针和任务。从中国“全民健身日”的设立到《全民健身计划(2015-2020)》、</p>
          <p>《“健康中国2030”规划纲要》、《体育产业“十三五”规划》、</p>
          <p>《关于加快发展体育产业促进体育消费的若干意见》等一系列国家政策的出台，</p>
          <p>如今全民健身已经上升为中国国家战略。</p>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="goal">
    <div class="qiu-content">
      <h2 class="title">平台目标</h2>
      <el-row :gutter="40" class="goal-line-a">
        <el-col :span="12"><div class="grid-content bg-purple goal-img"> <img src="/images/sports/goal_a.png" alt="推动全民健身战略的落实与发展" /></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple text text-a"><p>推动全民健身战略的</p><p class="txt-line">落实与发展</p></div></el-col>
      </el-row>
      <el-row :gutter="40" class="goal-line-b">
        <el-col :span="12"><div class="grid-content bg-purple text text-b"><p>为描绘“健康中国”新蓝图</p><p class="txt-line">增光添彩</p></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple goal-img"> <img src="/images/sports/goal_b.png" alt="为描绘“健康中国”新蓝图"增光添彩 /></div></el-col>
      </el-row>
       <el-row :gutter="40" class="goal-line-c">
        <el-col :span="12"><div class="grid-content bg-purple goal-img"> <img src="/images/sports/goal_c.png" alt="为实现中华民族伟大复兴的中国梦" /></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple text text-a"><p>为实现中华民族伟大复兴的中国梦</p><p class="txt-line">添砖加瓦</p></div></el-col>
      </el-row>
    </div>
  </div>
  <div class="platform">
    <el-row class="qiu-content">
      <el-col :span="12">
          <img src="/images/sports/about.png">
      </el-col>
      <el-col :span="12" class="qiu-platform">
           <div class="platform-text">
              <h2 class="title">平台简介</h2>
               <p>"人民求苗"作为人民体育产业公司孵化企业，响应国家全民健身计划，着眼于打造服务全民的体育综合性平台，</p>
               <p>通过互联网技术连接体育行业各服务商与消费者，</p>
               <p>满足体育爱好者个性化需求。</p>
               <p>全新平台、全新理念、全新的管理及经营模式，全面创新！</p>
            </div>
      </el-col>
    </el-row>
  </div>
  <div class="advantage">
    <div class="qiu-content">
      <h2 class="title">平台优势</h2>
      <div class="next-ti"><span>公信力</span></div>
      <el-row :gutter="150" class="advantage-box">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_aa.png"></p>
              <h3 class="h3-title">核心平台：人民求苗网站及人民体育客户端求苗频道</h3>
              <p class="text">环球网是中央级重点新闻网站、国新办获准的可供网站转载新闻的新闻单位，是中国人了解世界首选的信息分享平台。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_bb.png"></p>
              <h3 class="h3-title">核心内容团队：人民体育内容部门（即人民网体育部采编团队）</h3>
              <p class="text">为行使类似网站总编室的权力，负责人民体育网站和客户端推荐位置板块的新闻选择、深度及评论稿件撰写、分支平台新闻内容审核工作。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_cc.png"></p>
              <h3 class="h3-title">核心管理团队：人民体育和求苗体育运营部门</h3>
              <p class="text">负责总平台的品牌、运营、市场规划等，负责分支平台的经营监管、品牌宣传、市场指导等扶持和管理任务。</p>
            </div>
          </el-col>
      </el-row>
      <div class="next-ti"><span>资源整合</span></div>
       <el-row :gutter="150" class="advantage-box">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_dd.png"></p>
              <h3 class="h3-title">自建模式</h3>
              <p class="text">搭建人民求苗网站及人民体育客户端求苗频道，将内容、经营、品牌、市场等全方面工作整合一起。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_ee.png"></p>
              <h3 class="h3-title">平台优势版块</h3>
              <p class="text">人民体育负责内容审核、经营监管、品牌宣传、市场指导、资源引入等各方面的监管与服务工作。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <p class="img-good"><img src="/images/sports/good_ff.png"></p>
              <h3 class="h3-title">孵化模式</h3>
              <p class="text">找产品较为成熟的外部公司进行孵化，作为一个管理者和服务者的角色。求苗体育提供技术支持。当培育企业发展到一定规模时再对该企业进行投资。</p>
            </div>
          </el-col>
      </el-row>
    </div>
  </div>
    <div class="partner">
    <div class="qiu-content">
      <h2 class="title">合作伙伴</h2>
      <slideSport/>
    </div>
  </div>
  <footerSport :contact="contact[0]" :email="contact[1]" :address="contact[2]" :addressQ="contact[3]"/>
</div>
</template>
<script>
import slideSport from '../components/slideSport'
import headerSport from '../partner/components/header'
import footerSport from '../partner/components/footer'
export default {
  layout: 'blank',
  data () {
    return {
      logoUrl: '/images/sports/people_logo.png',
      bgUrl: 'people',
      topTxt: '助力健康中国，打造体育服务聚合平台',
      contact: ['赵雪晨', 'zhaoxuechen@people.cn', '北京市朝阳区金台夕路2号人民日报', '综合业务楼(北京办事处)']
    }
  },
  head () {
    return {
      title: '人民求苗_求苗体育媒体合作伙伴',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '求苗体育,人民求苗,合作伙伴' },
        { hid: 'description', name: 'description', content: '人民求苗作为人民体育产业公司孵化企业，相应国家全民健身计划，着眼于打造服务全民的体育综合性平台，通过互联网技术连接体育行业各服务商与消费者，满足体育爱好者个性化需求。' }
      ]
    }
  },
  components: {
    slideSport,
    headerSport,
    footerSport
  }
}
</script>
<style lang="scss" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 500px;
    margin: 0;
  }
  .qiu-content{
      width: 1200px;
      margin: 0 auto !important;
      text-align: center !important;
      overflow: hidden;
      p{
        line-height: 50px;
        font-size: 18px;
        color: #666;
      }
      .title{
        font-size: 30px;
        font-weight: normal;
        color: #333;
      }
      .txt-line:after{
        content: '';
        display: block;
        height: 2px;
        background: #fab900;
        margin-top: 8px;
        overflow: hidden;
        width: 80px;
      }
      .goal-line-b .txt-line{
        position: relative;
      }
      .goal-line-b .txt-line:after{
        position: absolute;
        top: 40px;
        right: 0;
      }
      .platform-text{
        padding-right:70px;
      }
  }
  body{
     .story{
      padding: 120px 0;
      width: 100%;
      .el-col {
        padding: 0 !important;
        text-align: left;
      }
      .title{
        text-align: center;
        padding-bottom: 20px;
      }
      .story-text{
        margin: 0 auto;
        width: 800px;
        text-align: center;
      }
    }
    .platform {
      padding-top: 100px;
      padding-bottom: 100px;
      width: 100%;
      .el-col {
        padding: 0 !important;
        text-align: left;
      }
      p{
        text-align: left;
      }
      .title{
        text-align: left;
        padding-top: 30px;
        padding-bottom: 20px;
      }
    }
    .advantage{
      background: #eeeeee;
      padding-bottom: 60px;
      padding-bottom: 100px;
      .img-good{
        height: 80px;
        vertical-align: middle;
        clear: both;
        overflow: hidden;
      }
      .h3-title{
        font-size: 16px;
        margin: 30px;
        color: #333;
        font-weight: normal;
      }
      .text{
        font-size: 14px;
        color: #666;
        text-align: left;
        line-height: 30px;
        margin-top: 30px;
      }
      .title{
        padding-top: 60px;
        padding-bottom: 20px;
      }
      .next-ti{
        margin-top: 50px;
        span{
          padding: 10px 30px;
          border-radius: 20px;
          background:#e5e5e5;
          font-size: 16px;
          color: #666
        }
      }
      .advantage-box{
        margin-top: 40px;
      }
    }
    .goal{
      padding-top: 60px;
      img {
        max-width: none;
      }
      background:#eee;
      .title{
        padding-bottom: 40px;
      }
      .text{
        display:table-cell; 
        vertical-align:middle;
        height: 300px;
        line-height: 300px;
      }
      .text-a{
         text-align: left
      }
      .text-b{
         text-align: right;
      }
      .goal-line-a,.goal-line-b,.goal-line-c{
        position: relative;
      }
      .goal-line-b{
        top: -70px;
        left: 120px;
      }
      .goal-line-c{
        top: -110px;
        left: 100px;
      }
      .goal-line-b .el-col{
        display: table;
        text-align: right;
      }
      .goal-line-b .goal-img{
        text-align: left
      }
      p{
        line-height: 40px;
        font-size: 24px;
        color: #333;
      }
      .goal-img{
        text-align: right;
        vertical-align: middle;
      }
    }
    .partner{
      .title{
        padding-top: 60px;
        padding-bottom: 60px;
      }
    }
  }
 
</style>


