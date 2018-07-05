<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/pay' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>常见问题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <e-heading grade="1" class="message-title">常见问题</e-heading>
            <div class="question-box">
                  <h2 class="que-h">一、提现 </h2>
                  <p class="que-title">1.提现手续费与额度？</p>
                  <p class="que-info">个人类账号每日可提现2次，每日提现总额5万元（含5万元），单次提现最低金额500元，提现手续费率1%，单笔手续费不低于5元。</p>
                  <p class="que-title">2.提现的钱什么时候到账？</p>
                  <p class="que-info">提现的钱将于提现后3个工作日内发放到您绑定的银行卡内。</p>
                  <p class="que-title">3.什么资金可以提现？</p>
                  <p class="que-info">账户内的可提现余额可以用于提现。冻结资金无法提现。</p>
                  <p class="que-title">4.关于绑定银行卡？</p>
                  <p class="que-info">提现资金发放到银行储蓄卡，需要绑定你本人的储蓄卡作为收款账号。</p>
                  <h2 class="que-h">二、退款</h2>
                  <p class="que-title">1.退款路径？</p>
                  <p class="que-info">由支付系统产生并发起的退款会原路返回。如果使用余额支付，则退回到可提现余额；使用银行卡支付，则退回到对应的银行卡；若使用支付宝支付，则退回到对应的支付宝账户；使用微信支付，则退回到对应的微信账户。</p>
                  <h2 class="que-h">三、冻结资金</h2>
                  <p class="que-title">1.什么是冻结资金？</p>
                  <p class="que-info">为了保障交易双方的资金安全，若已付款，但交易仍未结束的资金，会处于资金冻结状态；当交易成功之后，冻结资金会立刻解冻，进入卖方的钱包可提现余额中。</p>
            </div>
            <nuxt-link :to="{path:'/manage/wallet'}"><el-button type="success">返回</el-button></nuxt-link>
        </div>
  </div>
</template>
<script>
import { pagingList } from 'utils/mixins'
// import axios from 'axios'
export default {
  mixins: [pagingList],
  layout: 'manage'
}
</script>
<style lang="scss" scoped>
.question-box{
  margin-top: 40px;
  .que-h{
    margin-top: 20px;
    font-size: 18px;
    color:#333333
  }
  .que-title{
    margin-top: 10px;
    font-size: 16px;
    color: #00BB90;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    height: 40px;
    line-height: 40px;
  }
  .que-info{
    margin-bottom: 60px;
    font-size: 14px;
    color: #666;
  }

}
</style>

