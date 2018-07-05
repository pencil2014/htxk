<template>
  <div class="foot-bg">
    <h2>联系我们</h2>
    <el-row class="qiu-content contact-us">
      <el-col :span="8"><i class="icon iconfont icon-lianxiren"></i><span class="contact-txt">联系人：{{contact}}</span></el-col>
      <el-col :span="8"><i class="icon iconfont icon-renzhengyouxiang"></i><span class="contact-txt" style="margin-top: -10px">合作邮箱：{{email}}</span></el-col>
      <el-col :span="8"><i class="icon iconfont icon-iconfontdizhi"></i><span class="contact-txt"><p>公司地址：{{address}}</p><p class="beijing-ad">{{addressQ}}</p></span></el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: {
      contact: {
        type: String,
        default: null
      },
      email: {
        type: String,
        default: null
      },
      address: {
        type: String,
        default: null
      },
      addressQ: {
        type: String,
        default: null
      }
    }
  }
</script>
<style lang="scss" scoped>
.foot-bg{
  width: 100%;
  height: 400px;
  display: block;
  background: url("/images/sports/sport_footer.png") center center no-repeat;   
  color: #fff;
  h2{
      text-align: center;
      padding: 60px 0;
      font-size: 32px;
      font-weight: normal
  }
  .qiu-content{
     width: 1200px;
     margin: 0 auto;
     text-align: center
  }
  .el-col {
    text-align: left;
  }
  .iconfont{
    margin-right: 10px;
    font-size: 40px;
    vertical-align: middle;
    height: 30px;
  }
  .contact-txt{
    display: inline-block;
    width: 350px;
    vertical-align: middle
  }
  .beijing-ad{
    padding-left: 60px;
  }
} 
</style>
