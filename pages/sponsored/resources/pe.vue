<template>
  <div class="sponsor">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/sponsored' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>体育资源入驻</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="banner">
      <img src="/images/sponsor/resources/sponsorentrance.png" width="100%" alt="">
    </div>
    <hr-title title="您可置换的资源" color="blue"></hr-title>
    <el-row class="main_width">
      <el-col :span="6" v-for="(item,index) in l1" :key="index">
        <icon-item :title="item.title" :color="item.color" :icon="item.icon"/>
      </el-col>
    </el-row>
    <div class="bg-gray">
      <hr-title title="您可获得的回报" color="blue"></hr-title>
      <el-row class="main_width">
        <el-col :span="8" v-for="(item,index) in l2" :key="index">
          <icon-item :title="item.title" :color="item.color" :icon="item.icon"/>
        </el-col>
      </el-row>
    </div>
    <hr-title title="入驻流程" color="blue"></hr-title>
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
      <hr-title title="项目方"></hr-title>
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
        l1: [
          {
            title: '协会组织、赛事活动的</br>冠名权益',
            icon: 'icon-quanyi',
            color: 'blue'
          },
          {
            title: '球队的比赛服装以及胸</br>前广告袖口广告',
            icon: 'icon-AD',
            color: 'blue'
          },
          {
            title: '赛事场馆的现场广告、采</br>访区广告、场内广告',
            icon: 'icon-qiuchang',
            color: 'blue'
          },
          {
            title: '体育自媒体、专家专栏、网络直播</br>微电影、纪录片的植入广告',
            icon: 'icon-shipin1',
            color: 'blue'
          }
        ],
        l2: [
          {
            title: '丰厚的赞助金',
            icon: 'icon-zanzhujin',
            color: 'blue'
          },
          {
            title: '物品赞助：装备，交通',
            icon: 'icon-wuzi',
            color: 'blue'
          },
          {
            title: '开启职业体育的大门',
            icon: 'icon-men',
            color: 'blue'
          }
        ],
        l3: [
          {
            title: '注册成为求苗会员',
            icon: 'icon-VIP',
            color: 'blue'
          },
          {
            title: '提交实名认证资料',
            icon: 'icon-renzheng1',
            color: 'blue'
          },
          {
            title: '平台48小时内审核认证信息',
            icon: 'icon-shenhe',
            color: 'blue'
          },
          {
            title: '认证通过',
            icon: 'icon-tongguo',
            color: 'blue'
          }
        ],
        logoList: []
      }
    },
    created () {
      api.resources({sourceType: 0}).then((json) => {
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