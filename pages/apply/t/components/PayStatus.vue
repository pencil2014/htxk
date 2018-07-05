<template>
  <div>
    <e-heading grade='1'>{{status.includes(paymentStatus) ? '报名成功' : '支付失败'}}</e-heading>
    <div class="status">
      <!-- 报名成功 -->
      <span v-if="status.includes(paymentStatus)">
        <i class="iconfont success-icon">&#xe91c;</i>
      </span>
      <!-- 支付失败 -->
      <span v-else>
        <i class="iconfont fail-icon">&#xe754;</i>
      </span>
      <div class="info">{{status.includes(paymentStatus) ? '报名成功！' : '支付失败！'}}</div>
    </div>
    <div class="center button-box" v-if="!status.includes(paymentStatus) ">
      <router-link to="/">
        <el-button type="primary">返回求苗官网</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    paymentStatus: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      status: [2, 4]
    }
  }
}
</script>

<style scoped lang="scss">
.status {
  text-align: center;
  margin-bottom: 80px;
  .info {
    margin-top: -30px;
    padding-left: 10px;
    font-weight: 700;
    font-size: 18px;
  }
  .iconfont {
    font-size: 100px;
  }
  .success-icon {
    color:#24c881;
  }
  .fail-icon {
    color:#ff4949;
  }
}
</style>
