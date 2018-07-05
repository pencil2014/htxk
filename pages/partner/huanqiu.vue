<template>
  <div id="gobalBox">
    <headerSport :logo="logoUrl" :tpBg='bgUrl' :href="'http://sport.huanqiu.com'" :tpTxt='topTxt'/>
    <div class="story">
      <el-row class="qiu-content">
        <el-col :span="12">
            <img src="/images/sports/sport_b.png" alt="环球求苗">
        </el-col>
        <el-col :span="12" class="qiu-story">
          <div class="story-text">
            <h2 class="title">品牌故事</h2>
            <p>环球网求苗，一个O2O体育IP服务平台，</p>
            <p>2017年9月，由环球网和华体星空共建事业部打造。</p>
            <p>经历了双方技术、产品、市场等团队，多次的交流碰撞和匠心研究后，</p>
            <p>“环球网求苗”才与大家见面。</p>
            <p>环球网求苗在体育界的不断深耕，利用“互联网技术+主流体育内容+体育IP服务”整合优势及其增值服务，只愿为用户带来更好的产品和服务。</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="platform">
      <el-row class="qiu-content">
        <el-col :span="12" class="qiu-platform">
            <div class="platform-text">
                <h2 class="title">平台目标</h2>
                <p>环球网体育事业部（由华体星空和环球网共同打造）</p>
                <p>旨在创造一个涵盖体育领域与服务所有体育IP的资源</p>
                <p>整合平台。</p>
                <p>环球网和华体通过资源重组、产品包装和创新用户体</p>
                <p>验的打造，重塑体育文化，打造一个为C端提供内容，</p>
                <p>为B端提供渠道的体育综合服务型平台。</p>
              </div>
        </el-col>
        <el-col :span="12">
            <img src="/images/sports/sport_a.png" alt="环球求苗">
        </el-col>
      </el-row>
    </div>
    <div class="business qiu-content">
      <h2 class="title">业务内容</h2>
      <el-row :gutter="30">
        <el-col :span="8"><div class="grid-content bg-purple"><img src="/images/sports/sport_aa.png"><p class="text">提供覆盖全球热门赛事的中文体育资讯服务</p></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><img src="/images/sports/sport_bb.png"></div><p class="text">提供原创资讯内容与多元化的体育展示内容</p></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><img src="/images/sports/sport_cc.png"></div><p class="text">及时迅速传播焦点赛事热门信息</p></el-col>
      </el-row>
    </div>
    <div class="advantage">
      <div class="qiu-content">
        <h2 class="title">平台优势</h2>
        <el-row :gutter="170">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="/images/sports/sport_e.png">
                <h3 class="h3-title">首选的信息分享平台</h3>
                <p class="text">环球网是中央级重点新闻网站、国新办获准的可供网站转载新闻的新闻单位，是中国人了解世界首选的信息分享平台。</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="/images/sports/sport_f.png">
                <h3 class="h3-title">体育生态服务平台</h3>
                <p class="text">而求苗体育作为华体星空旗下的体育生态服务平台，有着丰富的资讯、赛事、数据的内容，不仅能为合作伙伴提供专业体育内容，还具备合作挖掘线下体育的潜力。</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="/images/sports/sport_g.png">
                <h3 class="h3-title">体育资源整合平台</h3>
                <p class="text">双方的结合，通过“共享互联”的方式，承载体育产品各个环节，为体育爱好者提供优质体育服务。</p>
              </div>
            </el-col>
          </el-row>
      </div>
    </div>
      <div class="partner">
      <div class="qiu-content el-carousel">
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
      logoUrl: '/images/sports/sport_logo.png',
      bgUrl: 'huanqiu',
      topTxt: 'O2O 体育IP服务平台',
      contact: ['高鑫戈', 'gaoxinge@huanqiu.com', '北京市朝阳区光华路15号铜牛国际大厦4层', '(北京办事处)']
    }
  },
  head () {
    return {
      title: '环球网求苗_求苗体育媒体合作伙伴',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '求苗体育,环球网求苗,O2O体育平台' },
        { hid: 'description', name: 'description', content: '环球网求苗，一个O2O体育IP服务平台，由环球网和华体星空共建事业部共同打造极具特色的“互联网技术+主流体育内容+体育IP服务”综合优势及增值服务，为用户带来更好的产品和服务。' }
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
        line-height: 45px;
        font-size: 18px;
        color: #666;
      }
      .title{
        font-size: 30px;
        font-weight: normal;
        color: #333;
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
      p{
        text-align: left;
      }
      .title{
        text-align: left;
        padding-bottom: 20px;
      }
      .story-text{
        padding-left: 20px;
      }
    }
    .platform {
      background: #eeeeee;
      padding-top: 100px;
      padding-bottom: 100px;
      width: 100%;
      .el-col {
        padding: 0 !important;
        text-align: left;
      }
      p{
        text-align: right;
      }
      .title{
        text-align: right;
        padding-top: 30px;
        padding-bottom: 20px;
      }
    }
    .business{
      padding-top: 30px;
      padding-bottom: 60px;
      .title{
        text-align: center;
        padding-top: 30px;
        padding-bottom: 110px;
      }
      .text{
        font-size: 24px;
        color: #2D2D31;
        text-align: left;
        margin-top: 20px;
        line-height: 40px;
      }
    }
    .advantage{
      background: #eeeeee;
      padding-bottom: 60px;
      padding-bottom: 100px;
      .h3-title{
        font-size: 24px;
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
        padding-bottom: 100px;
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


