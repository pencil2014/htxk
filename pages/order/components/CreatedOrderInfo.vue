<template>
  <div class='order-info-box'>
    <e-cellbox middle>
      <e-cell-item class="pay-icon">
        <i class="icon iconfont icon-icon11-copy"></i>
      </e-cell-item>
      <e-cell-item class='order-tips'>
        <h3>订单提交成功，请尽快付款！</h3>
        <div>
          <!-- {{ orderData.attach }} -->
          <order-status  
            :attach='orderData.attach' 
            :timeExpireSecond='orderData.timeExpireSecond' 
          />
        </div>
      </e-cell-item>
      <e-cell-item class='order-price-detail'>
        <div>
          <em class="label-total">应付总额：</em>
          <span>{{orderData.total | formatMoney}}</span></div>
        <div>
          <i class="order-info-detail " @click='showOrderDetailAction'>
            订单详情
            <i class="icon iconfont " 
            :class="{'icon-directionbottom': !showOrderDetail, 'icon-fangxiangshang': showOrderDetail}">
            </i>
          </i>
        </div>
      </e-cell-item>
    </e-cellbox>
    <div class='order-detail' v-show="showOrderDetail">
      <div class="divider"></div>
      <div class="order-content">
        <p>
          <span>订单号：</span>
          <span>{{orderData.orderNumber}}</span>
        </p>
        <p>
          <span>商品名称：</span>
          <span>{{orderData.remarks}}</span>
        </p>
        <p v-show="orderData.receiptUserName">
          <span>收货人：</span>
          <span>{{orderData.receiptUserName}}&nbsp;&nbsp;&nbsp;</span>
          <span>{{orderData.phone | hidPhone}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatus from '@/pages/components/OrderStatus'

export default {
  props: {
    orderData: {}
  },
  components: {
    OrderStatus
  },
  mounted () {
  },
  methods: {
    showOrderDetailAction () {
      this.showOrderDetail = !this.showOrderDetail
    }
  },
  data () {
    return {
      showOrderDetail: false
    }
  }
}
</script>

<style lang="scss" scoped>

.order-info-box{
  padding:0 40px;
  .pay-icon{
    width: 140px;
    height:157px;
  }
  .label-total{
    font-style: normal;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }
  .icon-icon11-copy{
    color:$color-success;
    font-size:90px;
    padding:0 20px
  }
  .order-tips h3{
    font-weight:normal;
    font-size: 24px;
    color: #333;
  }
  .order-price-detail{
    h2{
      font-size: 16px;
      color:#333;
    }
    .order-info-detail{
      cursor:pointer;
      font-style: normal;
      padding:0;
    }
    div{
      text-align: right;
      span{
        margin-left:20px;
        font-size:30px;
        color:#fc6f00;
        vertical-align: middle;
      }
      i{
        margin-left:10px;
      }
    }
  }
  .order-detail{
    .order-content{
      padding:20px 0 20px 140px;
    }
    p{
      line-height: 33px;
    }
  }
}
</style>

<style lang="scss">
  // 
  // #qrcode img{
  //   margin:0 auto;
  // }
  // .order-created +.el-dialog__wrapper .el-dialog--tiny{
  //   width:420px;
  // }
</style>
