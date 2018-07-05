<template>
  <div>
    <div class='price-box' >
      <e-cellbox style='display:none;'>
        <e-cell-item ></e-cell-item>
        <e-cell-item >商品总额：</e-cell-item>
        <e-cell-item>{{orderAtherInfo.totalPrice.price  | formatMoney}}</e-cell-item>
      </e-cellbox>
      <e-cellbox style='display:none;'>
        <e-cell-item ></e-cell-item>
        <e-cell-item >运费：</e-cell-item>
        <e-cell-item>{{orderAtherInfo.expenses.price  | formatMoney}}</e-cell-item>
      </e-cellbox>
      <e-cellbox  style='display:none;'>
        <e-cell-item ></e-cell-item>
        <e-cell-item >服务费：</e-cell-item>
        <e-cell-item>{{orderAtherInfo.service.price  | formatMoney}}</e-cell-item>
      </e-cellbox>
      <e-cellbox v-show="selectCoupon">
        <e-cell-item ></e-cell-item>
        <e-cell-item >优惠券：</e-cell-item>
        <e-cell-item>-{{orderAtherInfo.couponValue.price | formatMoney}}</e-cell-item> 
      </e-cellbox>
      <e-cellbox class='total-money-box'>
        <e-cell-item ></e-cell-item>
        <e-cell-item >应付总额：</e-cell-item>
        <e-cell-item class='total-money'>{{orderAtherInfo.total.price  | formatMoney}}</e-cell-item>
      </e-cellbox>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    orderAtherInfo: {
      type: Object,
      required: true
    },
    selectCoupon: {
      required: true
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>
// 
.price-box{
  padding:42px 0 36px;
  >div:nth-child(1){
    padding-bottom:16px;
  }
  >div:nth-child(2){
    padding-bottom:16px;
  }
  >div:nth-child(3){
    padding-bottom:22px;
  }
  .cellbox{
    height:14px;
    line-height:14px;
    margin-bottom: 10px;
    .cell-item:nth-child(1){
      width:780px;
    }
    .cell-item:nth-child(2){
      text-align:left;
    }
    .cell-item:nth-child(3){
      text-align:right;
    }
  }
  .total-money-box{
    height:30px;
    line-height:30px;
  }
  .total-money{
    font-size:26px;
    color:#fc6f00;
  }
}
</style>
