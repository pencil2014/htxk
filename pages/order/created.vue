<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单提交成功</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='order-created'>
      <div class='order-created-content' v-if='orderData'>
        <created-order-info :order-data='orderData' />
        <div class='pay-select content'>
          <h2 class="select-payway">请选择支付方式</h2>
          <div class="divider"></div>
          <div class="pay-way">
            <pay-wechat @payTypeAction='payTypeAction' :pay-type='payType'  :order-number='orderNumber' />
            <pay-ali @payTypeAction='payTypeAction' :pay-type='payType'  :order-number='orderNumber' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api/order'
import CreatedOrderInfo from './components/CreatedOrderInfo'
import PayWechat from './components/PayWechat'
import PayAli from './components/PayAli'

export default {
  components: {
    CreatedOrderInfo,
    PayWechat,
    PayAli
  },
  mounted () {
    this.orderNumber = this.$route.query.orderNumber
    api.orderGoodsOrder({
      orderNumber: this.orderNumber
    })
      .then((res) => {
        if (res) {
          this.orderData = res.data
        }
      })
  },
  methods: {
    payTypeAction (payType) {
      this.payType = payType
    }
  },
  data () {
    return {
      orderNumber: '',
      payType: '',
      orderData: null
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .btn-wrap {
    width: 260px;
    height: 260px;
    margin: 0 auto;
  }
  .btn-wrap textarea{
    width: 260px;
    height: 260px;
  }
  .order-created{
    .order-created-content{
      width:1200px;
      background: #fff;
      margin: 0 auto;
      .pay-select{
        padding: 40px 40px 0 40px;
        border-top:solid 20px $color-background;
        .select-payway{
          padding-bottom:20px;
        }
        .el-row--flex{
          padding-top:20px;
        }
      }
    }
  }
  .banner-box{
    text-align:center;
  }
  .pay-way{
    padding-top:30px;
    font-size: 0;
    .pay-item{
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
</style>
