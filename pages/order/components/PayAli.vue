<template>
  <div class="pay-item we-alipay" 
    :class="{'payActive': payType == 'without.web.alipay'}"
  >
    <div  @click="toPayAction('without.web.alipay')"  >
    <i class="icon iconfont icon-zhifubao"></i>
    <span>支付宝支付</span>
    </div>
    <div v-html='formParams'></div>
  </div>
</template>

<script>
import api from 'api/order'
// import md5 from 'js-md5'

export default {
  props: {
    orderNumber: {
      //
    },
    payType: {
      default: ''
    }
  },
  methods: {
    toPayAction (payType) {
      this.$emit('payTypeAction', payType)
      api.orderToPay({
        orderNumber: this.orderNumber
      })
        .then((res) => {
          if (res.data) {
            let params = null
            params = {
              orderNumber: this.orderNumber, // 订单编号
              payType: payType // 支付类型
            }
            // pc没钱包暂时用上面的，钱包后用下面的，需要加输入密码的输入框
            // if (!res.data.isTransPwd) { // 0-没有设置过交易密码
            //   params = {
            //     orderNumber: this.orderNumber, // 订单编号
            //     payType: payType // 支付类型
            //   }
            // } else { // 设置过交易密码
            //   let transPwd = res.data.transPwd ? md5(res.data.transPwd) : ''
            //   params = {
            //     transPwd: '', // transPwd 应该加输入框输入支付密码
            //     routeWay: res.data.routeWay || '', // 交易通道
            //     orderNumber: this.orderNumber, // 订单编号
            //     payType: payType // 支付类型
            //   }
            // }
            this.payAction(params)
          }
        })
    },
    payAction (params) {
      api.orderPay(params)
        .then((res) => {
          if (res) {
            this.bannerUrl = res.data.formParams.url
            this.formParams = res.data.formParams.form
            this.$nextTick(() => {
              document.getElementById('alipay_form').submit()
            })
          }
        })
    }
  },
  data () {
    return {
      bannerUrl: '',
      formParams: null
    }
  }
}
</script>

<style lang="scss" scoped>

.pay-item{
  height:100px;
  width:250px;
  border:1px solid $border-color-base;
  text-align:center;
  line-height:100px;
  cursor:pointer;
  i{
    font-size: 40px;
    vertical-align: middle
  }
  span{
    vertical-align: middle;
    padding:0 10px;
  }
}
.we-alipay{
  i{
    color:#01adf3;
  }
  &.payActive{
    border-color:#01adf3;
    border-bottom-width: 4px;
  }
}
</style>
