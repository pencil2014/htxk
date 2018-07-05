<template>
  <div class="pay-item we-chat"  :class="{'payActive': payType == 'without.web.wechat'}" >
    <div  @click='toPayAction("without.web.wechat")'  >
      <i class="icon iconfont icon-weixinzhifu"></i>
      <span>微信支付</span>
    </div>

    <el-dialog
      title="微信支付"
      :visible="dialogVisible"
      size="tiny"
      :before-close="beforeCloseAction"
      >
      <div class="banner-box">
        <e-qr-code :text="weChatUrl" :height='240' :width='240'/>

        <ul style="margin-top: 16px;">
          <li>请用微信扫一扫</li>
          <li>扫码完成付款</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'api/order'
// import md5 from 'js-md5'

export default {
  props: {
    orderNumber: {
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
            this.dialogVisible = true
            this.weChatUrl = res.data.formParams.code_url
            this.getPayResult = setInterval(this.getPayResultAction, 5000) // 微信需要自己判断，成功了关闭定时调度
          }
        })
    },
    // 定时调度获取支付结果
    getPayResultAction () {
      api.getPayResult({
        orderNumber: this.orderNumber
      })
        .then((res) => {
          if (res) {
            if (Number(res.data.status) === 1) {
              this.dialogVisible = false
              clearInterval(this.getPayResult)
              this.$router.push({path: '/order/success', query: {orderNumber: res.data.orderNumber}})
            }
          }
        })
    },
    beforeCloseAction () {
      this.dialogVisible = false
      clearInterval(this.getPayResult) // 因为天窗关掉后，获取的是新的二维码
    },
    beforeDestroy () {
      this.dialogVisible = false
      clearInterval(this.getPayResult)
    }
  },
  data () {
    return {
      dialogVisible: false,
      formParams: null,
      getPayResult: '',
      weChatUrl: ''
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
.we-chat{
  i{
    color:#24c881;
  }
  &.payActive{
    border-color:#24c881;
    border-bottom-width: 4px;
  }
}
</style>

<style lang="scss">
  
  #qrcode img{
    margin:0 auto;
  }
  .order-created +.el-dialog__wrapper .el-dialog--tiny{
    width:420px;
  }
</style>
