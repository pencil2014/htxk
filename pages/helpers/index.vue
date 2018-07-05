<template>
  <div>
    <el-row class="wrapper">
      <aside>
        <div class="sub">
          <el-menu
            :default-active="activeNav">
            <el-menu-item v-for="(item,index) in nav" :index="item" :key="index" @click="change(item)">{{item}}</el-menu-item>
          </el-menu>
        </div>
      </aside>
      <article>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 页面内容 -->
        <div class="contents">
          <div class="divider">
            <e-heading grade="1">{{activeNav}}Q&A</e-heading>
          </div>
          <div class="item" v-show="activeNav==='常见问题'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 怎样注册求苗账号？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 手机注册：1.点击手机注册 2.填写手机号码 3.获取验证码 4.设置账号信息 5.注册完成</p>
                  <p>邮箱注册：1. 点击邮箱注册 2.填写邮箱账号 3.登陆邮箱 4.完成验证 5.设置账号信息 6.注册完成</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 球队账号可以被登录吗？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 球队账号不可以被登录。球队账号和个人账号是绑定的，您可以在已登录个人账号的状态下，切换到对应的球队身份来管理自己的球队</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="3">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 如何申请认证？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 登录后，从“个人管理中心”点击“认证申请”，然后按照提示信息进行身份认证。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 认证后有什么作用？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 1. 认证后，您将具有发起直播等更多的功能权限</p>
                  <p>2. 系统能为您更有效地推荐有价值的内容</p>
                  <p>3. 您将提供更多被推荐的机会</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="item" v-show="activeNav==='注册登录'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 怎样注册求苗账号？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 手机注册：1.点击手机注册 2.填写手机号码 3.获取验证码 4.设置账号信息 5.注册完成</p>
                  <p>邮箱注册：1. 点击邮箱注册 2.填写邮箱账号 3.登陆邮箱 4.完成验证 5.设置账号信息 6.注册完成</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 忘记密码？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 1.在登录页面点击忘记密码 2. 填写手机号码 3. 获取验证码 4. 设置密码 5.修改完成</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="3">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 收不到验证码？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 收不到验证码的可能原因有：</p>
                  <p>1. 智能手机安装了拦截软件，导致信息到垃圾信箱了；可以检查手机的垃圾信箱里是否有验证码短信。</p>
                  <p>2. 手机在信号不稳定区域；可以选择信号稳定区域或使用4G网络重新发送。</p>
                  <p>3. 手机长时间不关机，导致信息接收不稳定；可以关机重启后重新尝试。</p>
                  <p>4. 手机收件箱已经满了，手机不能显示；可以删除一些短信后重新尝试。</p>
                  <p>5. 如果手机能接收其他短信，有可能是运营商系统故障或维护期间，可以稍后重试。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 球队账号可以被登录吗？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 球队账号不可以被登录。球队账号和个人账号是绑定的，您可以在已登录个人账号的状态下，切换到对应的球队身份来管理自己的球队</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="item" v-show="activeNav==='关于认证'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 如何申请认证？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 登录后，从“个人管理中心”点击“认证申请”，然后按照提示信息进行身份认证。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 认证有几种类型？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 认证主要分为个人和组织两种，目前已经开放了个人身份的认证。认证时，您需要选中一个主要身份，完善资料后，您还可以选择多个次要身份。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="3">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 认证后有什么作用？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 1. 您的认证图标将被点亮</p>
                  <p>2. 您将具有发起直播等更多的功能权限</p>
                  <p>3. 系统能为您更有效地推荐有价值的内容</p>
                  <p>4. 为您提供更多被推荐的机会</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 认证后的信息可以修改吗？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 您认证后的信息不能进行修改，但您可以通过再次申请认证的方式来更新您的信息</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 个人隐私会被别人看到吗？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 您在认证过程中填写的如身份证号、照片等隐私信息，都会保密，不会被其他用户看到</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="item" v-show="activeNav==='关于资讯'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 怎样发布资讯？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 已登录的用户都在进入管理中心点击“发布”来发布资讯。若您拥有球队的管理权，您也可以在球队身份下代表球队发布资讯。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 资讯有几种类型？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 资讯分为文章和组图两种，文章包含文本、图片、视频等元素，适用于表达丰富的内容形式；组图适用于查看多张图片，并用简短的图注来诠释图片的内容</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="item" v-show="activeNav==='关于视频'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 不能正常观看视频？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 如果无法正常观看视频，请尝试进行如下操作：</p>
                  <p>1.确认您使用了支持视频播放的浏览器。</p>
                  <p>2.清除浏览器的浏览数据及缓存。</p>
                  <p>3.关闭硬件加速。请在浏览器的 设置 - 显示高级设置 中，将“使用硬件加速模式”（如果可用）一项取消勾选，并重新启动浏览器。</p>
                  <p>4.检查您的网速。您可以尝试在其他视频网站播放视频，如果您在其他网站仍无法观看视频，那么您的网络连接很可能有问题。您需要重新连接您的网络或者切换至网速更快的网络以实现流畅的视频播放。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 视频上传有什么要求吗？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 目前只支持上传MP4格式的视频，在上传视频时请您选择正确的视频格式</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="item" v-show="activeNav==='球赛活动'">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 什么是约战？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 约战是两只球队之间发起的比赛活动。您可以通过约战来寻找合适的对手，安排球赛日程，与您中意的球队一较高下。赛后，您还可以录入比分数据等，将您的战绩保存下来。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="2">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 什么是拼球？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 拼球是由个人用户发起的球赛活动。您可以通过拼球，来发起或加入一场比赛。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="3">
                <template slot="title">
                  <i class="iconfont">&#xe6a5;</i> 什么是招募？
                </template>
                <div class="answer">
                  <p><i class="iconfont">&#xe685;</i> 招募是球队吸引新的成员入队的一种方式。球队可以通过招募来宣传自己的球队，吸纳更多球友加入球队。</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </article>
    </el-row>
  </div>
</template>
<script>
export default {
  layout: 'default',
  methods: {
    change (item) {
      this.activeNames = ['1']
      this.activeNav = item
    }
  },
  data () {
    return {
      nav: ['常见问题', '注册登录', '关于认证', '关于资讯', '关于视频', '球赛活动'],
      activeNav: '常见问题',
      activeNames: ['1']
    }
  }
}
</script>
<style lang="scss" scoped>

$active-background-color:#f0fcf9;
.wrapper{
  background:#ebf0f5;
  min-height:500px;
  padding:40px 0;
  .sub {
    padding-top: 30px;
  }
  aside{
    min-height:700px;
    width: 224px;
    background-color: #fff;
    float:left;
    .el-menu {
      background: #fff;
      min-height: 100%;
      border-radius: 0;
      text-align: center;
      &-item {
        padding: 0 !important; 
        a {
          display: block;
        }
        &:hover {
          background: $active-background-color;
        }
        &.is-active {
          border-left: 3px solid $color-primary;
          background: $active-background-color;
        }
      }
      .router-link-active {
        color:$color-primary;
        border-left: 3px solid $color-primary;
        background: $active-background-color;
        &:hover {
          background: $active-background-color;
        }
      }
    }
    .el-submenu{
      &:hover .el-submenu__title {
        background: #fff;
      }
      &__title {
        font-size: 16px;
      }
      &__icon-arrow{
        margin-top: -3px;
      }
      &.is-opened{
        > .el-submenu__title{
          .el-submenu__icon-arrow{
            margin-top: -5px;
          }
        }
      }
    }
  }
  article{
    background: #fff;
    min-height: 800px;
    padding: 1px 0;
    width:956px;
    float:right;
  }
  .el-breadcrumb{
    position: absolute;
    margin-top: -25px;
    margin-left: -240px;
  }
  .contents {
    padding: 60px;
    .heading-1{
      margin-top: 0;
    }
    .item {
      i {
        font-size: 24px;
        vertical-align: middle;
      }
      .el-collapse-item__header {
        i {
          color:$color-success;
        }
      }
      .answer {
        position: relative;
        padding-left: 20px;
        p {
          position: relative;
          padding-left: 30px;
          line-height: 24px;
          i {
            color:$color-warning;
            vertical-align: top;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        
      }
    }
  }
}

</style>