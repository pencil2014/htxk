<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>支付密码管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">支付密码管理</e-heading>
            <div class="payment-pwd" v-if="isOpenPwd == 1">
                <p class="center pwd-open-txt"><i class="icon iconfont icon-icon11-copy" style="font-size: 42px"></i><span>您的支付密码已开启</span></p>
                <p class="center pwd-open-btn"><nuxt-link :to="{path:'/manage/wallet/passwd'}"><el-button type="primary">修改支付密码</el-button></nuxt-link></p>
            </div>
            <div class="payment-pwd" v-else>
                <p class="center pwd-open-txt"><span>您的支付密码未开启</span></p>
                <p class="center pwd-open-btn"><nuxt-link :to="{path:'/manage/wallet/passwd'}"><el-button type="primary">请开通支付密码</el-button></nuxt-link></p>
            </div>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
export default {
  layout: 'manage',
  data () {
    return {
      isOpenPwd: ''
    }
  },
  methods: {
    isShowPwd () {
      api.payPwd({
      }).then((res) => {
        if (res.data.isTransPwd !== 'undefined') {
          this.isOpenPwd = res.data.isTransPwd
        }
      })
    }
  },
  mounted () {
    this.isShowPwd()
  }
}
</script>
<style lang="scss" scoped>
  
  .wallet-box{
    position: relative;
    .payment-pwd{
        margin-top: 60px;
    }
    .icon-icon11-copy{
        color: #1dc77e;
        font-size: 42px;
        vertical-align: middle;
    }
    .pwd-open-txt span{
        margin-left: 20px;
        font-size: 16px;
    }
    .pwd-open-btn{
        margin-top: 50px;
        padding-left: 50px
    }
  }

</style>

