<template>
  <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/order' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content">
          <div class="manage-content">
              <div class="order-state"><i class="icon iconfont icon-tixing-copy" ></i>
                <span>当前订单状态：</span>
                <b v-if='items.value == orderDetailList.status' v-for="(items, index) in allOrderStatus" :key="index">
                  <span v-if="orderDetailList.status == 9 && orderDetailList.details[0].userStatus !== 0">待确认</span>
                  <span v-else>{{items.label}}</span>
                </b>
              </div>
              <div class="order-tips" v-if='orderDetailList.attach'>
                <!-- {{ orderDetailList.attach }} -->
                <order-status  
                  :attach='orderDetailList.attach' 
                  :timeExpireSecond='orderDetailList.timeExpireSecond' 
                />
              </div>
              <div class="order-info"><i class="icon iconfont icon-dingdanxinxi" ></i><span>订单信息</span></div>
              <ul class="order-info-list">
                 <li>
                   <span class="order-info-num"><b>订单编号：</b><span>{{ orderDetailList.orderNumber }}</span></span>
                   <span class="order-info-time"><b>创建时间：</b><span>{{ orderDetailList.createDate }}</span></span>
                 </li>
                 <li v-if='orderDetailList.status == 2 || orderDetailList.status == 4'>
                   <span class="order-info-num"><b>支付编号：</b><span>{{ orderDetailList.transactionNumber || '--' }}</span></span>
                   <span class="order-info-time"><b>付款时间：</b><span>{{ orderDetailList.tradeTime || '--'  }}</span></span>
                   <span class="order-info-time"><b>支付方式：</b><span>{{ orderDetailList.gatewayName || '--' }}</span></span>
                 </li>
                 <li class="tickets" v-if="orderDetailList.isTicketerInfo || orderDetailList.isLogisticsInfo">
                   <a href="javascript:;" @click="showDialog(1)" v-show="orderDetailList.isTicketerInfo===1" >查看取票人信息</a>
                   <a href="javascript:;" @click="showDialog(2)" v-show="orderDetailList.isLogisticsInfo===1">查看快递信息</a>
                 </li>
                 <li v-else><b>收货地址：</b><span>{{ orderDetailList.address }}</span></li>
                 <li><b>商家昵称：</b><span>{{ orderDetailList.vendorNickname }}</span></li>
                 <!-- <li><b>发&nbsp &nbsp &nbsp  票：增值税发票</b></li>-->
              </ul>
              <table border="0" class="order-table-list" width="100%">
                  <thead>
                      <tr>
                        <th width="35%">商品</th>
                        <th width="20%">商品属性</th>
                        <th width="10%">单元（元）</th>
                        <th width="10%">数量</th>
                        <th width="10%">状态</th>
                        <th width="15%">商品总价</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr class="tr-td" v-for="(item, num) of orderDetailList.details" :key="num">
                        <td class="td-good-pd">
                          <div class="good-item" @click="goGoodsInfo(item)">
                              <div class="p-img">
                                <e-img :src="item.imgUrl" :size="[78,78]" />
                              </div>
                              <div class="p-msg">
                                  <div class="p-name">
                                      <div>{{ item.goodsName }}</div>
                                      <a href="javascript:;" @click.stop="cardNextStep(item)"  style="display:block;" class="link" v-if="item.isShow == 0">服务卡</a>
                                      <!-- <nuxt-link target='_blank' style="display:block;" class="link"
                                        :to="cardNextStep(item)" 
                                        v-if="item.isShow == 0"
                                        >
                                        服务卡
                                      </nuxt-link> -->
                                  </div>
                              </div>
                          </div>
                        </td>
                          <td>
                              <p v-for="(goodsRangeList, m) of item.goodsRange" :key="m">{{goodsRangeList}}</p>
                          </td>
                          <td>
                              <p>{{ item.salePrice | formatMoney }}</p>
                          </td>
                          <td>
                            <p>{{ item.quantity }}</p>
                          </td>
                          <td :rowspan= "orderDetailList.details.length" v-if="num == 0" v-bind:class="{ 'td-good-info-pd': orderDetailList.details.length > 1}" class="order-td-row">
                            <p class="order-detail-pay">
                              <span v-if='items.value == orderDetailList.status' v-for="(items, index) in allOrderStatus" :key="index">
                                  <span v-if="orderDetailList.status == 9 && orderDetailList.details[0].userStatus !== 0">待确认</span>
                                  <span v-else>{{items.label}}</span>
                              </span>
                            </p>
                          </td>
                          <td :rowspan="orderDetailList.details.length" v-if="num == 0" class="order-td-row" v-bind:class="{ 'td-good-info-pd': orderDetailList.details.length > 1}">
                              <p>{{ orderDetailList.total | formatMoney }}</p>
                              <p>免运费</p>
                          </td>
                      </tr>
                  </tbody>
                  <tbody class='price-list'>
                      <tr class="pay-total" v-if='orderDetailList.preferentialPrice  || orderDetailList.preferentialPrice == 0 '>
                        <td colspan="6" class="coupon-price">
                          优惠活动：
                          <span v-if="orderDetailList.preferentialPrice > 0 "> - {{ orderDetailList.preferentialPrice | formatMoney }}</span>
                          <span v-else>{{ orderDetailList.preferentialPrice | formatMoney }}</span>
                        </td>
                      </tr>
                      <tr class="pay-total" v-if='orderDetailList.couponPrice  || orderDetailList.couponPrice == 0 '>
                        <td colspan="6" class="coupon-price">
                          优惠券：
                          <span v-if="orderDetailList.couponPrice > 0 "> - {{ orderDetailList.couponPrice | formatMoney }}</span>
                          <span v-else>{{ orderDetailList.couponPrice | formatMoney }}</span>
                        </td>
                      </tr>
                      <tr class="pay-total">
                        <td colspan="6" style="padding-top:0">
                          应付金额：
                          <span v-if='orderDetailList.total  || orderDetailList.total == 0 '>{{ orderDetailList.total | formatMoney }}</span>
                        </td>
                      </tr>
                  </tbody>
              </table>
              <span class="detail-btn" v-if='orderDetailList.status == 1' >
                <el-button class="pay-suc" :plain="true" @click="cancleOrderBtn(orderDetailList.orderNumber)">取消订单</el-button>
                <nuxt-link target='_blank' :to="{path:'/order/created', query:{orderNumber: orderDetailList.orderNumber}}"><el-button type="success" class="pay-suc">付款</el-button></nuxt-link>
              </span>
              <span class="detail-btn" v-if='orderDetailList.status == 9' >
                <el-button class="pay-suc" :plain="true" @click="cancleOrderBtn(orderDetailList.orderNumber)">取消订单</el-button>
                <span v-if='orderDetailList.details[0].userStatus == 0'><el-button type="success" class="pay-suc" @click="updatedInfo(orderDetailList.details[0].goodsCode,orderDetailList.details[0].goodsCateCode1,orderDetailList.details[0].goodsCateCode,orderDetailList.details[0].skuCode,orderDetailList.orderNumber)">完善信息</el-button></span>
              </span>
             <!-- 取消订单弹出框 -->
             <el-dialog title="取消订单" :visible.sync="dialogVisible" class="cancel_order_box">
              <el-form :model="form">
                  <el-select v-model="form.cancelReasonLi" placeholder="请选择取消订单的原因">
                      <el-option :label="itemList" :value='itemList' v-for="(itemList, m) of cancelReasonsList" :key="m"></el-option>
                  </el-select>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleConfirm()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
       </div>
        <!-- 查看取票人信息 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogView"
          size="large">
          <div class="addrBox"  v-show="dialogIndex===1" >
            <ticket-holder v-if="orderId" :orderNumber="orderId" />
          </div>
          <div class="logisticsBox" v-show="dialogIndex===2">
            <logistics v-if="orderDetailList" :orderNumber="orderId" />  
          </div>
        </el-dialog>
  </div>
</template>
<script>
import fetch from 'utils/fetch'
import api from 'api/order'
import { pagingList } from 'utils/mixins'
import ElDatePicker from '@element-ui/DatePicker'
import TicketHolder from '../../components/ticketHolder'
import Logistics from '../../components/logistics'
import OrderStatus from '@/pages/components/OrderStatus'

export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElDatePicker,
    TicketHolder,
    Logistics,
    OrderStatus
  },
  methods: {
    // 去商品详情
    goGoodsInfo (item) {
      let routeData = this.$router.resolve(item.nextStepUrl) || `/goods/detail/${item.goodsCode}`
      window.open(routeData.href, '_blank')
    },
    // 服务卡下一步url
    cardNextStep (item) {
      let routeData = this.$router.resolve(item.cardNextStepUrl) || `/manage/card/detail?cardNo=${item.cardNo}`
      window.open(routeData.href, '_blank')
    },
    // 确认取消订单
    handleConfirm () {
      this.dialogVisible = false
      if (this.form.cancelReasonLi.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择取消订单的原因',
          duration: 2000,
          type: 'error'
        })
      } else {
        this.cancelList(this.form.orderId, this.form.cancelReasonLi)
      }
    },
    // 取消订单-事件处理方法
    cancleOrderBtn (id) {
      this.form.orderId = id
      this.dialogVisible = true
      this.cancelReasons()
    },
    updatedInfo ($goodsCode, $goodsCateCode1, $goodsCateCode, $skuCode, $orderNumber) {
      api.goodsTemplateInfo({
        goodsCode: $goodsCode, // 商品code 需要传
        goodsCateCode1: $goodsCateCode1, // 顶级商品类目
        goodsCateCode: $goodsCateCode, // 子级商品类目
        skuCode: $skuCode, // 商品Sku码  matchedStock中
        orderNumber: $orderNumber // 订单编号 下个页面有
      })
        .then((res) => {
          if (res) {
            if (res.data && res.data.goodsBizUrl) {
              this.$router.push({path: res.data.goodsBizUrl + '&templateType=' + res.data.templateType})
            }
          }
        })
    },
    // 获取订单列表信息
    getOrderDetailListData () {
      fetch({url: '/manage/order/getGoodsOrder', params: {orderNumber: this.orderId}})
        .then((response) => {
          if (response.data.details) {
            this.orderDetailList = response.data
          }
        })
    },
    // 取消订单
    cancelList ($num, $reason) {
      fetch({url: '/manage/order/goodsOrder/cancel', method: 'delete', params: {orderNumber: $num, cancelReason: $reason}})
        .then((response) => {
          this.getOrderDetailListData()
          // console.log(response.data)
        })
    },
    // 获取里信息等待取消订单
    cancelReasons () {
      let _this = this
      fetch({url: '/manage/order/goodsOrder/cancelReasons', params: ' '})
        .then(function (response) {
          // console.log(response.data)
          _this.cancelReasonsList = response.data
        })
    },
    showDialog (val) {
      this.dialogIndex = val
      this.dialogTitle = val === 1 ? '查看取票人' : '查看快递信息'
      this.dialogView = true
    }
  },
  data () {
    return {
      orderId: '',
      orderDetailList: '',
      cancelReasonsList: '',
      dialogVisible: false,
      // 订单状态
      allOrderStatus: [
        {label: '全部订单', value: ''},
        {label: '待完善', value: '9'},
        {label: '待付款', value: '1'},
        {label: '已付款', value: '2'},
        {label: '已完成', value: '4'},
        {label: '已关闭', value: '5'},
        {label: '已取消', value: '10'}
      ],
      // 用户状态描述
      allUserStatus: [
        {label: '商品订单已生成，请在15分钟内付款；若未及时付款，系统将自动取消订单。', value: 1, userStatus: ''}, // 待付款
        {label: '恭喜！您已中签，请在15分钟内付款；若未及时付款，系统将自动取消订单。', value: 11, userStatus: 31001}, // 待付款1
        {label: '商品订单已生成，请在15分钟内付款；若未及时付款，系统将自动取消订单。', value: 9, userStatus: ''}, // 待完善
        {label: '请等待系统摇号，中签后即可支付。', value: 99, userStatus: 31002}, // 待完善状态1
        {label: '请等待系统摇号，中签后即可参赛。', value: 99, userStatus: 31003}, // 待完善状态2
        {label: '恭喜！您已中签，请准时参赛。', value: 44, userStatus: 31004}, // 已完成1
        {label: '抱歉！您未中签，请关注其他赛事。', value: 54, userStatus: 31005} // 已关闭1
      ],
      form: {
        name: '',
        cancelReasonLi: '',
        orderId: ''
      },
      dialogView: false, // 取票人信息弹框
      dialogTitle: '查看取票人',
      dialogIndex: 1 // 弹框显示内容
    }
  },
  created () {
    this.orderId = this.$route.query.orderNumber
  },
  mounted () {
    this.getOrderDetailListData()
  }
}
</script>
<style lang="scss">
  @import '~assets/styles/order';
</style>
<style lang="scss" scoped>
  .order-table-list .price-list tr.pay-total td{
      padding: 0;
  }
  .order-table-list .price-list tr.pay-total:nth-child(1) td{
      padding-top:25px;
  }
  .order-info-list {
    .tickets{
      a {
        color: #3583e0;
        margin-right: 45px;
      }
    }
  }
</style>
