<template>
<li class="fans-list" v-if="item" >
  <div class="logo-box pr" v-if="item.iconUrl"> 
    <nuxt-link :to="'/personal/'+ item.userId" target="_blank"><e-avatar :src="item.iconUrl" :size='[80, 80]'/> </nuxt-link> 
    <div class="sex boy" v-if="item.sex==1"><i class="iconfont icon-xingbie-nan"></i></div>
    <div class="sex girl" v-if="item.sex==2"><i class="iconfont icon-xingbie-nv"></i></div>
  </div>
  <div class="logo-box pr" v-else>
    <nuxt-link :to="'/personal/'+ item.userId" target="_blank"><e-avatar :src="defaultIconUrl" :size='[80, 80]'/> </nuxt-link> 
    <div class="sex boy" v-if="item.sex==1"><i class="iconfont icon-xingbie-nan"></i></div>
    <div class="sex girl" v-if="item.sex==2"><i class="iconfont icon-xingbie-nv"></i></div>
  </div> 
  <div class="infor-box"> 
      <h3 class="title-box">
        <span class="title" title="13004291485">{{item.nickName}}</span>
        <span class="approve-icon"><e-img :src="item.pcImgtxtUrl" :size='[64, 14]'/></span>
      </h3> 
      <p class="list">
        <span class="text">关注：</span> <span class="number" v-if="item.concernNum">{{item.concernNum}}</span> <span class="number" v-else> 0 </span> 
        <span class="text">粉丝：</span> <span class="number" v-if="item.followNum">{{item.followNum}}</span><span class="number" v-else> 0 </span>
      </p> 
      <p class="list"> 
        <i class="iconfont icon-shape3"></i> <span class="text">地区：</span> <span class="number">{{item.areaCityName}}</span>
      </p>  
      <p class="list" v-if="item.sign">
          <span class="text">签名：</span> <span class="number">{{item.sign}}</span>
      </p> 
  </div>
  <div class="btn-box"><Follow :item="item"/></div> 
</li>
</template>
<script type="text/javascript">
import Follow from '../../components/Follow'
export default {
  props: {
    item: {}
  },
  components: {
    Follow
  },
  data () {
    return {
      defaultIconUrl: '/resources/images/default_photo.jpg'
    }
  }
}
</script>
<style lang="scss">
.fans-list .btn-box .el-button--primary{
  color: #666;
  background: none;
  border: 1px solid #e5e5e5
}
.fans-list .btn-box .el-button--primary:hover{
  color: #fff;
  background: #24c881;
  border: 1px solid #24c881
}
.fans-list .btn-box .iconfont{
  font-size: 14px;
}
</style>
<style lang="scss" scoped>

.fans-list{
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  .icon-shape3{
    margin-right: 5px;
    color:#ccc;
  }
  .girl{
    color: #fff;
    .iconfont{
      background:#f980ab;
    }
  }
  .boy{
    color: #fff;
    .iconfont{
      background:#6ab1f3;
    }
  }
  .number{
    padding-right: 10px
  }
  .approve-icon {
    display: inline-block;
    height: 14px;
    margin-left: 8px;
  }
  .infor-box {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
    font-size: 14px;
    color: #666;
    width: 580px;
  }
  .title_box {
    font-size: 16px;
    padding-bottom: 5px;
  }
  .infor-box p.list {
    padding: 5px 0;
  }
  .sex .iconfont {
    font-size: 12px;
    padding: 2px;
    border-radius: 50%;
    height: 100%;
  }
  .logo-box {
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    position: relative;
    a{
      border-radius: 50%;
      overflow: hidden;
      display: block;
      height: 100%;
    }
  }
  .btn.btn-return {
    color: #666;
    background: #fff;
  }
  .btn-xs {
    padding: 3px 6px;
    font-size: 12px;
  }
  .btn-border {
    border: 1px solid #e5e5e5;
  }
  .btn-box {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    vertical-align: top;
  }
  .sex {
    width: 16px;
    height: 16px;
    position: absolute;
    bottom: 3px;
    right: 8px;
  }
}
</style>

