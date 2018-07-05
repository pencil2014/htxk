<template>
  <div class='personal divider' v-if='userAllInfo'>
    <a target="_blank" :href="'/personal/'+userAllInfo.userId" class="head_portrait">
      <e-avatar v-if="$store.state.user.session.userId" class="user-photo" :size='[70,70]' :src="$store.state.user.session.iconUrl" :alt="$store.state.user.session.nickName" />
    </a>
    <nuxt-link title="编辑资料" to="/basic/edit-info" class="personal-info">
      <h4 class="use-name">
        <span :title='$store.state.user.session.nickName' >{{$store.state.user.session.nickName}}</span>
        <i class="iconfont edit-icon" >&#xe64f;</i>
      </h4>

      <img class="pcImgTxtUrl" v-if='userAllInfo.pcImgTxtUrl'  :src="userAllInfo.pcImgTxtUrl"  alt='快去认证吧~'>
      <small v-if="userAllInfo.area" class="weak ellipsis" :title='userAllInfo.area' ><i class="small iconfont">&#xe627;</i>{{userAllInfo.area}}</small>
      <small class="weak ellipsis" :title='userAllInfo.sign' >{{userAllInfo.sign|| '快来添加签名吧~'}}</small>
    </nuxt-link>
    <el-row class='use-follow'>
      <el-col :span="12" >
        <nuxt-link to="/basic/follow">
          <strong>{{userAllInfo.focus || 0}}</strong>
          <small class="weak">关注</small>
        </nuxt-link>
      </el-col>
      <el-col :span="12">
        <nuxt-link to="/basic/follower">
          <strong>{{userAllInfo.fans || 0}}</strong>
          <small class="weak">粉丝</small>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: {
      userAllInfo: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="scss">
.personal{
  line-height:1;
  text-align:center;
  background-image: url('/images/personal_bg.jpg');
  background-repeat: no-repeat;
  background-size: contain;
  padding: 45px 10px 25px 10px;
  .head_portrait{
    display:inline-block;
    width:74px;
    height:74px;
    margin:0 auto;
    border: 3px solid #fff;
    border-radius:100%;
    background-repeat: no-repeat;
    background-position:center center;
    background-size: cover;
    img{
      display:block;
      border-radius:50%;
    }
  }
  .ellipsis {
    display:block;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .personal-info{
    display:block;
    small{
      height: 14px;
      width:100%;
      margin:20px 0;
      .iconfont{
        margin-right:4px;
      }
    }
    .use-name{
      box-sizing: content-box;
      font-size:18px;
      height: 22px;
      line-height: 22px;
      padding: 10px 0;
      span{
        display:inline-block;
        max-width:calc(100% - 34px);
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        margin-right:10px;
      }
      .edit-icon{
        font-size: 18px;
        vertical-align: top;
        color:rgba(255,255,255,1);
      }
    }
    .pcImgTxtUrl{
      height: 14px;
    }
    &:hover .use-name{
      .edit-icon{
        color:#333;
      }
    }
  }

  .use-follow{
    a{
      display:block;
      strong{
        display:block;
        padding-bottom:6px;
      }
    }
  }
}
</style>
