<template>
  <div class="sponsor">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/sponsored' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>赞助商入驻</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="banner">
      <img src="/images/sponsor/resources/banner1.jpg" width="100%" alt="">
    </div>
    <hr-title title="为什么选择体育营销" color="green"></hr-title>
    <el-row class="main_width">
      <el-col :span="6" v-for="(item,index) in l1" :key="index">
        <icon-item :title="item.title" :text="item.text" :color="item.color" :icon="item.icon"/>
      </el-col>
    </el-row>
    <div class="bg-gray">
      <hr-title title="如何开展有效的体育营销" color="green"></hr-title>
      <el-row class="main_width">
        <el-col :span="8" v-for="(item,index) in l2" :key="index">
          <icon-item :title="item.title" :text="item.text" :color="item.color" :icon="item.icon"/>
        </el-col>
      </el-row>
    </div>
    <hr-title title="品牌入驻流程" color="green"></hr-title>
    <el-row class="main_width">
      <el-col :span="6" v-for="(item,index) in l3" :key="index">
        <icon-item :title="item.title" :color="item.color" :icon="item.icon"/>
      </el-col>
    </el-row>
    <div class="banner">
      <img src="/images/sponsor/resources/banner2.jpg" width="100%" alt="">
      <div class="info">
        <e-cellbox middle style="height: 352px;">
          <e-cell-item>
            <p class="text">更多权限，期待您的加入！</p>            
            <nuxt-link to="/">
              <el-button type="warning" class="resbtn" size="large">立即入驻</el-button>
            </nuxt-link>
          </e-cell-item>
        </e-cellbox>
      </div>
    </div>
    <div v-if="logoList && logoList.length>0">
      <hr-title title="赞助商"></hr-title>
      <el-row class="main_width" style="width: 1080px;">
        <logo-item v-for="(item,index) in logoList" :key="index" :url="item.logoUrl" :name="item.focusValue"/>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
  import HrTitle from './components/HrTitle'
  import IconItem from './components/IconItem'
  import LogoItem from './components/LogoItem'
  import api from 'api/sponsored/resources'
  export default {
    layout: 'sponsor',
    components: {
      HrTitle, IconItem, LogoItem
    },
    data () {
      return {
        logoList: [],
        l1: [
          {
            title: '用户精准',
            text: '轻松找到与品牌目标人群匹配的资源',
            icon: 'icon-jingzhun',
            color: 'green'
          },
          {
            title: '参与体验，情感连接',
            text: '亲身参与体育活动，更好的融合情感和强化记忆感知',
            icon: 'icon-canyu',
            color: 'green'
          },
          {
            title: '国际化',
            text: '体育无国界，更能打造国际化形象',
            icon: 'icon-guojihua',
            color: 'green'
          },
          {
            title: '性价比',
            text: '同样费用，体育营销的效果是广告的10倍',
            icon: 'icon-xingjiabi',
            color: 'green'
          }
        ],
        l2: [
          {
            title: '筛选资源',
            text: '品牌市场策略和体育营销契合点分析，挑选符合品牌市场战略策略的体育项目，考虑因素包括目标人群，目标，时间，市场，预算',
            icon: 'icon-jingxuan',
            color: 'green'
          },
          {
            title: '赞助谈判',
            text: '通过与体育资源方的沟通和谈判，对项目进行调整和整合，获得最适合品牌市场战略的赞助权益以及报价',
            icon: 'icon-tanpan',
            color: 'green'
          },
          {
            title: '项目执行',
            text: '配合品牌全面协调和监督所有项目执行情况，保证赞助权益的实现，并争取更多的额外权益和增值回报',
            icon: 'icon-zhihang',
            color: 'green'
          },
          {
            title: '宣传推广',
            text: '为品牌提供宣传推广支持，让品牌和赛事的结合得到更多的曝光和关注，让消费者更了解品牌赞助赛事的深层价值和内涵',
            icon: 'icon-tuiguang',
            color: 'green'
          },
          {
            title: '权益激活',
            text: '品牌花费1元做体育赞助，需要花费2元进行权益的激活，包括通过数字媒体、社交媒体、营销活动方式等将赞助权益最大化',
            icon: 'icon-jihuo',
            color: 'green'
          },
          {
            title: '评价总结',
            text: '在项目执行中期和后期，我们都会对赞助权益实施的执行状况进行评估，并提出合理化的建议，让品牌在之后的体育营销更加有效',
            icon: 'icon-zongjie',
            color: 'green'
          }
        ],
        l3: [
          {
            title: '注册成为求苗会员',
            icon: 'icon-VIP',
            color: 'green'
          },
          {
            title: '提交实名认证资料',
            icon: 'icon-renzheng1',
            color: 'green'
          },
          {
            title: '平台48小时内审核认证信息',
            icon: 'icon-shenhe',
            color: 'green'
          },
          {
            title: '认证通过',
            icon: 'icon-tongguo',
            color: 'green'
          }
        ]
      }
    },
    created () {
      api.resources({sourceType: 1}).then((json) => {
        this.logoList = json.data || []
      })
    },
    methods: {
      handleTabs () {
      }
    }
  }
</script>

<style lang="scss">
  
  .sponsor{
    .el-breadcrumb{
      width: 1200px;
    }
  }
  .main_width{
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 100px;
  }
  .bg-gray{
    background: $color-background-base;
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .banner{
    width: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
    img{
      height: 100%;
      width: auto;
    }
    .info{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      text-align: center;
      .text{
        font-size: 30px;
        color: $color-white;
        margin-bottom: 30px;
      }
      .resbtn{
        width: 230px;
        height: 60px;
        font-size: 24px;
      }
    }
  }
</style>