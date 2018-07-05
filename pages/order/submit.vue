<template>
  <div>
    <div class='content firm-order'>
      <e-heading grade="1">确认订单</e-heading>
      <div class="divider"></div>
      <div>
        <h3 class='addr-title'>收货人信息</h3>
        <receive-address v-model='address' @change='adderssChangeAction' />
      </div>
      <el-form ref="form" class="order-form" v-bind="getFormProps({labelWidth:'0'})">
          <el-form-item label="" >
            <input type="hidden" v-model="address" >
          </el-form-item>
          <el-form-item label="">
            <submit-table :tableData='tableData' />
          </el-form-item>
          <!-- 优惠券 -->
          <el-form-item label=""  class="coupon">
            <submit-coupon :selectCoupon='selectCoupon'  @setCoupon='setCoupon'/>
          </el-form-item>
          <el-form-item>
            <submit-price 
              v-if='tableData && tableData.length > 0'
              :orderAtherInfo='orderAtherInfo'  :selectCoupon='selectCoupon' 
            />
          </el-form-item>
          <el-form-item>
            <e-cellbox  class='res-addr'>
              <e-cell-item v-if='consigneeInfo' >
                <submit-addr-tel :consigneeInfo='consigneeInfo' />
              </e-cell-item>
              <e-cell-item class="tr">
                <el-button type="primary" size="large" @click='orderCreate'>提交订单</el-button>
              </e-cell-item>
            </e-cellbox>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import api from 'api/order'
import ReceiveAddress from './components/ReceiveAddress'
import {form} from 'utils/mixins'
import SubmitTable from './components/SubmitTable'
import SubmitAddrTel from './components/SubmitAddrTel'
import SubmitPrice from './components/SubmitPrice'
import SubmitCoupon from './components/SubmitCoupon'
export default {
  mixins: [form],
  components: {
    ReceiveAddress,
    SubmitTable,
    SubmitAddrTel,
    SubmitPrice,
    SubmitCoupon
  },
  data () {
    return {
      loading: false,
      address: null,
      consigneeInfo: null,
      goodsCode: '', // 商品code 需要传
      goodsCateCode1: '', // 顶级商品类目
      goodsCateCode: '', // 子级商品类目
      skuCode: '', // 商品Sku码  matchedStock中
      tableData: [],
      orderAtherInfo: {
        totalPrice: {text: '商品总额', price: 0},
        expenses: {text: '运费', price: 0},
        service: {text: '服务费', price: 0},
        couponValue: {text: '优惠券', price: 0},
        total: {text: '应付总额', price: 0}
      },
      selectCoupon: '' // 选择的优惠券
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      this.tableData = JSON.parse(sessionStorage.getItem('sessionNextPage'))
      if (this.tableData) {
        let orderMoney = this.tableData[0]
        this.orderAtherInfo.totalPrice.price = Number(orderMoney.unitPrice) * Number(orderMoney.num)
        this.orderAtherInfo.expenses.price = 0
        this.orderAtherInfo.service.price = 0
        this.orderAtherInfo.total.price = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
        this.goodsCode = orderMoney.goodsCode // 商品code 需要传
        this.goodsCateCode1 = orderMoney.goodsCateCode1 // 顶级商品类目
        this.goodsCateCode = orderMoney.goodsCateCode // 子级商品类目
        this.skuCode = orderMoney.matchedStock.skuCode // 商品Sku码  matchedStock中
      } else {
        this.$message.error('未获取有效的订单信息，请回到上一页刷新，并重新选择')
      }
    })
  },
  methods: {
    // submit () {},
    adderssChangeAction (data) {
      this.consigneeInfo = data
    },
    nextPageInfo () {
      api.goodsTemplateInfo({
        goodsCode: this.goodsCode, // 商品code 需要传
        goodsCateCode1: this.goodsCateCode1, // 顶级商品类目
        goodsCateCode: this.goodsCateCode, // 子级商品类目
        skuCode: this.skuCode, // 商品Sku码  matchedStock中
        orderNumber: this.orderNumber // 订单编号 下个页面有
      })
        .then((res) => {
          if (res) {
            if (res.data && res.data.goodsBizUrl) {
              this.$router.replace({path: res.data.goodsBizUrl + '&templateType=' + res.data.templateType})
            } else {
              // 后端-删除刚提交成功的订单- 前端-跳转去-订单详情
              this.$message.error('即将跳转去订单详情，请在订单详情中，继续下单流程')
              this.$router.replace({path: '/manage/order/detail', query: {orderNumber: this.orderNumber}})
            }
          }
        })
    },
    orderCreate () {
      // if (!this.consigneeInfo) {
      //   this.$message.error('请填写收货人信息')
      //   return
      // }
      // this.goodsCateCode1 !== 'v11' 赛事不需要地址
      if ((this.goodsCateCode1 !== 'V11') && (!this.consigneeInfo)) {
        this.$message.error('请填写收货人信息')
        return
      }
      api.orderCreate({
        param: JSON.stringify({
          addressId: this.consigneeInfo && this.consigneeInfo.id, // 收货地址Id
          couponCodeId: this.selectCoupon.codeId, // 优惠券Id
          detailList: [{
            skuCode: this.tableData[0].matchedStock.skuCode,
            quantity: this.tableData[0].num
          }]
        })
      })
        .then((res) => {
          this.orderNumber = res.data.orderNumber
          if (res.data.status === 9) { // 状态为9是需要走模板的
            this.nextPageInfo()
          } else {
            // 通用购买流程，没有模板分支了 ———— 所以分支线去掉
            if (this.orderAtherInfo.total.price === 0) {
              this.$router.replace({path: '/order/success', query: {orderNumber: this.orderNumber}})
            } else {
              this.$router.replace({path: '/order/created', query: {orderNumber: this.orderNumber}})
            }
          }
        })
    },
    // 点击了优惠券
    setCoupon (item) {
      this.tableData = JSON.parse(sessionStorage.getItem('sessionNextPage'))
      this.orderAtherInfo.total.price = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
      if (item.codeId === this.selectCoupon.codeId) {
        this.selectCoupon = ''
        this.couponValueAction()
      } else {
        this.selectCoupon = item
        this.orderAtherInfo.total.price = (this.orderAtherInfo.total.price < item.couponValue) ? 0 : (this.orderAtherInfo.total.price - item.couponValue)
        this.couponValueAction()
      }
    },
    couponValueAction () {
      let total = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
      this.orderAtherInfo.couponValue.price = this.selectCoupon.couponValue > total ? total : this.selectCoupon.couponValue
    }
  }
}
</script>

<style lang="scss" scoped>

.firm-order{
  .heading-1{
    font-size:24px;
    color:#333;
    font-weight:normal;
    margin-bottom:22px;
  }
  .addr-title{
    font-weight:normal;
    margin:38px 0 15px 0;
    height:16px;
    line-height:16px;
  }
  .order-form{
    .addr-list{
      padding-top:38px;
      h3{
        font-weight:normal;
        font-size:16px;
        color:#666;
        padding-bottom: 14px;
      }
    }
    .res-addr{
      border-top: 1px solid $color-divider;
      height:90px;
      .cell-item{
        vertical-align: middle;
      }
    }
  }
}
</style>

<style lang="scss">

.firm-order{
  .order-form .el-form-item {
    margin-bottom: 0;
  }
}
</style>
