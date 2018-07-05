<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/service/list' }">售后/退款</el-breadcrumb-item>
          <el-breadcrumb-item>退款说明</el-breadcrumb-item>
        </el-breadcrumb>
            <div class="content">
            <e-heading grade="1" class="message-title">退款说明</e-heading>
            <div class="question-box">
                  <p class="que-title">1.我的商品是否可以进行退款？</p>
                  <p class="que-info">为了保护用户和消费者利益，自用户付款成功商品之日起7日内可以进行退款，用户可以在线提交退款申请说明。特别说明，赛事类的商品和票务类的商品都不给于办理退款。</p>
                  <p class="que-title">2.用户如何进行退款？</p>
                  <p class="que-info">请您登录到求苗，进入【我的 - 我的订单】或者【我的 - 售后申请】，找到您想要退款的订单或者商品，点击【申请退款】，进入到退款申请页面即可操作退款。</p>
                  <p class="que-title">3.售后服务单提交成功后多久出审核结果？</p>
                  <p class="que-info">在提交服务单后1~3个工作日内。注：法定节假日、停电、天气等不可抗力情况除外。</p>
                  <p class="que-title">4.关于绑定银行卡？</p>
                  <p class="que-info">提现资金发放到银行储蓄卡，需要绑定你本人的储蓄卡作为收款账号。</p>
                  <p class="que-title">5.退款手续费问题？</p>
                  <p class="que-info">用户申请退款会扣除0%的手续费，例如：用户购买100元的商品，0%手续费则为0元，应退金额 = 商品价格 - 手续费，即100元 - 0元。</p>
            </div>
            <nuxt-link :to="{path: '/manage/service?orderNumber=' + this.$route.query.orderNumber + '&skuCode=' + this.$route.query.skuCode}"><el-button type="success">返回</el-button></nuxt-link>
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
    margin-bottom: 30px;
    font-size: 14px;
    color: #666;
  }

}
</style>

