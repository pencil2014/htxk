<template>
  <div class='follow-item' >
    <cellbox class='follow-item-cellbox'>
      <cell-item class='follow-item-head'>
        <a class='a-link-url' :href='followData.linkUrl'>
          <div class='img' :style="{backgroundImage:`url(${followData.iconUrl || defaultHead})`}" >
            <div class="follow-item-sex-box">
              <i class="iconfont boy" v-if="followData.sex==1">&#xe61f;</i>
              <i class="iconfont girl" v-else>&#xe696;</i>
            </div>
          </div>
        </a>
      </cell-item>
      <cell-item>
        <div class='follow-item-name'>
          <h3>{{followData.nickName || '该用户很懒，什么也没写~'}}</h3>
          <!-- <span>{{followData.pcImgTxtUrl}}</span> -->
          <img :src='followData.pcImgTxtUrl' />
        </div>
        <cellbox class='follow-item-follow'>
          <cell-item class='follow'>
            关注：<span>{{followData.concernNum}}</span>
          </cell-item>
          <cell-item  class='follower'>
            粉丝：<span>{{followData.followNum}}</span>
          </cell-item>
        </cellbox>
        <p class="follow-item-addr" v-if='followData.areaCityName'>
          <i class="icon iconfont icon-shape3"></i>
          <span>{{followData.areaCityName || '该用户很懒，什么也没写~'}}</span>
        </p>
        <p class="follow-item-sign" >签名：{{followData.sign || '该用户很懒，什么也没写~'}}</p>
      </cell-item>
      <cell-item class='follow-item-state'>
        <span class='followed' v-if='followData.isFollowed == 1'>
          已关注
        </span>
        <span class='to-follow' v-if='followData.isFollowed == 0'>
          未关注
        </span>
      </cell-item>
    </cellbox>
  </div>
</template>

<script>
import defaultHead from 'static/images/default_photo.jpg'
export default {
  layout: 'manage',
  props: {
    followData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultHead
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/var';
.follow-item{
  padding:20px 0;
  .follow-item-head{
    position:relative;
    width: 106px;
    .a-link-url{
      display:block;
    }
    .img{
      border-radius: 100%;
      height: 80px;
      width:80px;
      overflow:hidden;
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
    }
    .follow-item-sex-box{
      position:absolute;
      right:30px;
      top:60px;
      width:20px;
      height:20px;
      .iconfont{
        border: 1px solid #fff;
        border-radius:100%;
        font-size:20px;
        line-height:20px;
        background:#fff;
      }
      .boy{
        color:#6ab1f3;
      }
      .girl{
        color:#f980ab;
      }
    }
  }
  .follow-item-name{
    // height:14px;
    line-height:14px;
    margin-bottom: 14px;
    h3{
      font-size:14px;
      color:#333;
      display:inline-block;
    }
    span{
      display:inline-block;
    }
  }
  .follow-item-follow{
    display:table-row;
    // height:12px;
    font-size:12px;
    line-height:12px;
    .follow{
      border-right:1px solid #ccc;
      padding-right:20px;
    }
    .follower{
      padding-left:20px;
    }
    span{
      color:#fc6f00;
      margin-left:5px;
    }
  }
  .follow-item-addr{
    margin:14px 0;
    // height:12px;
    font-size:12px;
    line-height:12px;
    .iconfont{
      font-size:12px;
      color:#ccc;
      margin-right:5px;
    }
  }
  .follow-item-sign{
    // height:12px;
    font-size:12px;
    line-height:12px;
  }
  .follow-item-state{
    text-align: right;
    span{
      display:inline-block;
      padding:0 8px;
      // height:24px;
      line-height:24px;
      border-radius: 4px;
    }
    .followed{
      border:1px solid $primary-color;
      color:$primary-color;
    }
    .to-follow{
      border:1px solid $color-e5;
      color: $font-gray;
    }
  }
}
</style>
