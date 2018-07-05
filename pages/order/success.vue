<template>
  <div class='order-ok content'>
    <div class='order-ok-content'> 
      <div  v-if='haveRes'  >
        <i  v-if='orderStatus == 2 || orderStatus == 4' class="icon iconfont icon-icon11-copy"></i>
        <h2 v-if='orderStatus == 2 || orderStatus == 4' >支付成功！</h2>

        <i  v-if='orderStatus == 3'  class="icon iconfont icon-tijiaoshibai"></i>
        <h2 v-if='orderStatus == 3' >支付失败！</h2>

        <i  v-if='orderStatus !== 2 && orderStatus !== 3 && orderStatus !== 4'  class="icon iconfont icon-icon11-copy"></i>
        <h2 v-if='orderStatus !== 2 && orderStatus !== 3 && orderStatus !== 4' >订单处理中！</h2>


        <div class="color-gray">{{`订单号：${orderNumber}`}}</div>
        <div class="color-gray" v-if='price'>
          订单金额：
          <span  class="price">{{price | noPreformatMoney}}</span>
          元
        </div>

        <div class="link-btn">
          <nuxt-link class="link" style='margin-right:22px;' :to="{path:'/manage/order/detail', query:{orderNumber: this.orderNumber}}" >查看订单详情</nuxt-link>
          <nuxt-link class="link" to='/'>继续逛逛</nuxt-link> 
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from 'api/order'
export default {
  mounted () {
    this.orderNumber = this.GetQueryString('mchOrderNumber') || this.GetQueryString('orderNumber')
    // 请求订单状态， status (integer, optional): 订单状态
    // 1 - 待支付，2 - 已支付，3 - 支付失败，4 - 已完成，5 - 已关闭，6 - 退款中，7 - 已退货，9 - 预下单成功，10 - 已取消(手动)
    // 订单状态有延时，1 - 每隔5s请求一次，直到换成其他状态了，或者达到3分钟了； 达到3分钟提示去我的订单中查看订单状态
    this.orderGoodsOrderAction()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    orderGoodsOrderAction () {
      api.orderGoodsOrder({
        orderNumber: this.orderNumber // 订单编号
      })
        .then((res) => {
          if (res) {
            if (res.data.status !== 1) { // 有支付结果了
              clearInterval(this.interval)
              this.price = res.data ? res.data.total : 0
              this.orderStatus = res.data.status
              this.haveRes = true
            } else { // 待支付- 支付宝存在延时
              clearInterval(this.interval)
              if (this.times < this.maxTimes) {
                this.interval = setInterval(() => {
                  this.orderGoodsOrderAction()
                  this.times++
                }, 5000)
              } else {
                this.$message.warning('请在订单详情中，查看订单状态')
                setTimeout(() => {
                  this.$router.replace({path: '/manage/order/detail', query: {orderNumber: this.orderNumber}})
                }, 1000)
              }
            }
          }
        })
    },
    GetQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  },
  data () {
    return {
      orderNumber: '',
      orderStatus: '',
      price: 100,
      times: 0,
      maxTimes: (3 * 60) / 5, // 3分钟—— ？个5s
      haveRes: false,
      interval: null
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .order-ok{
    .order-ok-content{
      margin: 40px auto;
      div{
        text-align: center;
        .icon-icon11-copy{
          font-size:101px;
          color:$color-success;
        }
        .icon-tijiaoshibai{
          font-size:101px;
          color:$color-error;
        }
        h2{
          font-size:24px;
          color:#333;
          font-weight: normal;
        }
      }
      .color-gray{
        color:$color-black-base;
      }
      .price{
        color: $color-warning;
      }
      .link-btn{
        margin-top: 40px;
      }
    }
  }
</style>

<style lang="scss">
  
</style>
