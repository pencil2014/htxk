<template>
  <div>
    <!--注册成功-->
    <div class="reg-success" v-if="isSuccess">
        <div class="title relative">
            <i class="icon iconfont icon-icon11-copy icon-right ab"></i>
            <p class="success-tips">恭喜您，注册成功！</p>
        </div>
        <p class="sucess-text">您的登录账号为：<span class="main-color">{{userName || 130668068000}}</span>
        </p>
        <div class="btn-group">
            <nuxt-link class="login-button" to="/member/login"><el-button type="primary">立即登录</el-button></nuxt-link>
            <nuxt-link to="/member/login"><el-button type="primary">完善资料</el-button></nuxt-link>
        </div>
        <p class="timeout">{{seconds}}秒后自动跳转到登录页面</p>
    </div>
    <!--注册失败-->
    <div class="reg-fail" v-if="!isSuccess">
        <div class="title relative">
            <i class="iconfont icon-xs icon-tijiaoshibai ab"></i>
            <p class="error-tips">抱歉，未能注册成功！</p>
        </div>
        <p class="fail-text">请检查一下网络是否有问题，点击下面的按钮重新提交</p>
        <nuxt-link to="/member/register"><el-button class="btn-err" type="primary">重新提交</el-button></nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSuccess: true,
      userNmae: '',
      seconds: 6
    }
  },
  created () {
    this.isSuccess = this.$route.query.success
    this.userName = this.$route.query.userName
    if (this.isSuccess) {
      let timer = () => {
        if (this.seconds === 1) {
          this.$router.push({path: '/member/login'})
        } else {
          this.seconds--
          setTimeout(() => {
            timer()
          }, 1000)
        }
      }
      timer()
    }
  }
}
</script>

<style scoped lang="scss">
  

  .reg-success {
      text-align: center;
      padding-top:20px;
      .sucess-text {
          margin: 20px auto 70px;
      }
      .timeout {
          color: $color-sub;
          margin: 15px 0 10px;
          font-size: 12px;
      }
      .scan {
          margin-top: 10px;
      }
      .icon-icon11-copy{
        font-size:70px;
        color: $color-primary
      }
      .success-tips{
        font-size:30px;
      }
      .login-button{
        margin-right:20px;
      }
  }

  .reg-fail {
      padding-top:20px;
      padding-bottom:20px;
      text-align: center;
      .title {
          color: $color-error;
      }
      .error-tips{
        font-size:30px;
      }
      .icon-tijiaoshibai{
        font-size:70px;
      }
      .fail-text {
          margin: 20px 0 30px;
          font-size:12px;
      }
      .btn-err {
          background-color: #e94141;
          border-color: #e94141;
      }
  }
</style>
