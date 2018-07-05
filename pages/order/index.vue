<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/order' }">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <heading grade="1">订单列表</heading>
            <el-form v-bind="getFormProps()" :inline="true" class="order-list-search">
                <el-form-item label="全部订单：" class="select-status">
                  <el-select v-model="query.status" placeholder="请选择" >
                      <el-option v-for="item in allOrderStatus" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="下单时间：" class="se·lect-time">
                  <el-date-picker v-model="date" type="date" default-value  placeholder="请选择日期" :picker-options="pickerOptions0"></el-date-picker>
                </el-form-item>
                <el-form-item label="输入搜索：">
                  <el-input class="search-input" v-model="query.keyWord" placeholder="输入商品标题或订单号进行搜索"></el-input>
                </el-form-item>
                <el-button type="primary" native-type="submit" class="search-btn">搜索</el-button>
            </el-form>
            <table border="0" class="order-table-list list-tb" width="100%">
                <thead>
                    <tr>
                      <th width="40%">商品</th>
                      <th width="12%">单价（元）</th>
                      <th width="12%">数量</th>
                      <th width="12%">订单金额</th>
                      <th width="12%">订单状态</th>
                      <th width="12%">订单操作</th>
                    </tr>
                </thead>
              <tbody v-for="(item, n) of orderList.list" :key="n" >
                  <tr class="sep-row" v-if="n !=0"><td colspan="6"></td></tr>
                  <tr class="tr-th">
                      <td colspan="6">
                          <span class="order-num">订单号： {{ item.orderNumber }}</span>
                          <span class="order-time">下单时间：{{ item.createDate }}</span>
                          <span class="order-shop-name">{{ item.vendorNickname }}</span>
                      </td>
                  </tr>
                  <tr class="tr-td" :id="item.id" v-for="(listDetail, index) of item.details" :key="index">
                      <td class="td-good-pd" >
                          <div class="good-item">
                              <div class="p-img">
                                <nuxt-link target='_blank' :to="{path:'/order/detail', query:{orderNumber: item.orderNumber}}"><img class="" :src='item.details[0].imgUrl' title=""  width="60" height="60"></nuxt-link>
                              </div>
                              <div class="p-msg">
                                  <div class="p-name">
                                      <nuxt-link target='_blank' :to="{path:'/order/detail', query:{orderNumber: item.orderNumber}}">{{ listDetail.goodsName }}</nuxt-link>
                                  </div>
                              </div>
                          </div>
                      </td>
                      <td>
                          <p>{{listDetail.unitPrice | formatMoney}}</p>
                      </td>
                      <td>{{ listDetail.quantity }}</td>
                      <td>
                            <p>{{ item.transactionPrice }}</p>
                            <p>{{ item.total | formatMoney}}</p>
                      </td>
                      <td :rowspan="item.details.length" v-if="index == 0" v-bind:class="{ 'td-good-detail': item.details.length > 1 }">
                        <p class="order-detail-pay"  v-if='items.value == item.status' v-for="(items, index) in allOrderStatus" :key="index">
                              <span v-if="item.status == 9 && item.details[0].userStatus !== 0">待确认</span>
                              <span v-else>{{items.label}}</span>
                        </p>
                          <p class="order-detail-link"><nuxt-link target='_blank' :to="{path:'/order/detail', query:{orderNumber: item.orderNumber}}">订单详情</nuxt-link></p>
                      </td>
                      <td :rowspan="item.details.length" v-if="index == 0" class="td-good-pd" v-bind:class="{ 'td-good-info-pd': item.details.length > 1}">
                          <span v-if="item.status == 1">
                              <p class="order-detail-pay">
                                  <nuxt-link target='_blank' :to="{path:'/order/created', query:{orderNumber: item.orderNumber}}"><el-button class="pay-btn" type="primary">付款</el-button></nuxt-link>
                              </p>
                          </span>
                          <span v-else>
                             <span v-if="item.status == 9" class="good-list-pd">
                                <span v-if="item.details[0].userStatus == 0"><el-button class="pay-btn" @click="updatedInfo(listDetail.goodsCode,listDetail.goodsCateCode1,listDetail.goodsCateCode,listDetail.skuCode,item.orderNumber)" type="primary">完善信息</el-button></span>
                             </span>
                             <span v-else>
                                <span v-if='items.value == item.status' v-for="(items, i) in allOrderStatus" :key="i">{{items.label}}</span>
                             </span>
                          </span>
                          <p class="order-del-link"><span v-if='item.status == 1 || item.status == 9' @click="cancleOrderBtn(item.orderNumber)">取消订单</span></p>
                      </td>
                  </tr>
              </tbody>
              <tbody v-if="orderList.list && orderList.list.length == 0"><tr class="no-info-list"><td colspan="6">暂无数据</td></tr></tbody>
            </table>
            <el-pagination
                v-bind="getPaginationProps(orderList)"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              >
            </el-pagination>
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
</template>
<script>
import fetch from 'utils/fetch'
import api from 'api/order'
import { pagingList } from 'utils/mixins'
import { mapGetters } from 'vuex'
import ElPagination from 'element/Pagination'
import ElDatePicker from 'element/DatePicker'
// import axios from 'axios'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElDatePicker,
    ElPagination
  },
  methods: {
    fetch () {
      this.getOrderListData(this.query)
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
              this.$router.push({path: res.data.goodsBizUrl})
            }
          }
        })
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
    // 获取订单列表API接口
    getOrderListData (query) {
      let _this = this
      fetch({url: '/manage/order/getGoodsOrderList', params: query})
        .then(function (response) {
          _this.orderList = response.data
          // console.log(response.data)
        })
    },
    // 取消订单
    cancelList ($num, $reason) {
      fetch({url: '/manage/order/goodsOrder/cancel', method: 'delete', params: {orderNumber: $num, cancelReason: $reason}})
        .then((response) => {
          this.getOrderListData()
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
    }
  },
  data () {
    return {
      query: this.getQuery({status: '', orderTime: null}),
      orderList: '',
      dialogVisible: false,
      cancelReasonsList: '',
      // 订单状态
      allOrderStatus: [
        {label: '全部订单', value: ''},
        {label: '待完善', value: '9'},
        {label: '待付款', value: '1'},
        {label: '已付款', value: '2'},
        {label: '已完成', value: '4'},
        {label: '已关闭', value: '5'}
      ],
      form: {
        name: '',
        cancelReasonLi: '',
        orderId: ''
      },
      pickerOptions0: {
        disabledDate (time) {
          // 若需要禁止以前的日期就开启
          // return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      goods_list: 'goods_list'
    }),
    // 时间格式化
    date: {
      set (value) {
        if (value) {
          this.query.orderTime = value.getTime()
        } else {
          this.query.orderTime = ''
        }
      },
      get () {
        return this.query.orderTime ? new Date(this.query.orderTime) : ''
      }
    }
  },
  mounted () {
    this.query.status = this.$route.query.status ? this.$route.query.status : ''
    if (this.$route.query.orderTime) {
      // 转为数字赋值给data
      this.date = new Date(this.$route.query.orderTime - 0)
    }
  }
}
</script>
<style lang="scss">
  @import '~styles/var';
  @import '~assets/styles/order';
</style>

