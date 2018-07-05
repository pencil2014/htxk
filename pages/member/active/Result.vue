<template>
  <div>
    <div class="reg-success" v-if="isSuccess">
        <div class="title relative sucess-text">
            <i class="icon icon-xs icon-right ab"></i>
            <p>恭喜您，激活成功！</p>
        </div>
        <div class="btn-group">
            <router-link :to="'/login'">
                <el-button type="primary">立即登录</el-button>
            </router-link>
        </div>
    </div>
    <div class="reg-fail" v-if="!isSuccess">
        <div class="title relative">
            <i class="icon icon-xs icon-error ab"></i>
            <p>抱歉，未能激活成功！</p>
        </div>
        <p class="fail-text">请检查一下网络是否有问题，点击下面的按钮重新提交</p>
        <router-link :to="'/active/account'">
          <el-button class="btn-err" type="primary">重新提交</el-button>
        </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    created () {
      this.$emit('input', this.step)
      this.isSuccess = this.$route.query.isSuccess
    },
    data () {
      return {
        step: 3,
        isSuccess: true
      }
    }
  }
</script>

<style lang="scss">
  
  .reg-success {
      text-align: center;
      .sucess-text {
          margin: 20px auto 40px;
      }
      .timeout {
          color: $color-sub;
          margin: 15px 0 50px;
          font-size: 12px;
      }
      .scan {
          margin-top: 10px;
      }
  }

  .reg-fail {
      padding: 70px 0;
      text-align: center;
      .title {
          color: $color-error;
      }
      .fail-text {
          margin: 20px 0 30px;
      }
      .btn-err {
          background-color: #e94141;
          border-color: #e94141;
      }
  }
</style>
