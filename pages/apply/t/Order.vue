<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/manage/card/'}">服务卡</el-breadcrumb-item>
      <el-breadcrumb-item>确认订单并支付</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 培训服务卡 -->
    <train-card :cardInfo="query_card_info">
      <el-button type="primary" @click="handleGoodsDetails">查看订单</el-button>
    </train-card>
    <div class="content order-confirm">
      <e-heading grade='1'>订单支付</e-heading>

      <e-heading grade="2">订单价格</e-heading>
      <el-table
        :data="orderData.details"
        style="width: 100%">
        <el-table-column
          prop="goodsFullName"
          label="培训名称"
          :show-overflow-tooltip="true"
          width="500">
        </el-table-column>
        <el-table-column
          prop="quantity"
          align="center"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="salePrice"
          align="center"
          label="商品价格">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice | formatMoney}}×{{scope.row.quantity}} = {{scope.row.quantity * scope.row.salePrice | formatMoney}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr price">
        应付金额：<span>{{orderData.price | formatMoney}}</span>
      </div>
      
      <e-heading grade="2">选择支付方式</e-heading>
      <div class="pay-way">
        <div class="pay-info">请在<span>15</span>分钟内完成支付，否则将会失效</div>
        <pay-wechat @payTypeAction='payTypeAction' :pay-type='payType'  :order-number='$route.query.orderNumber' />
        <pay-ali @payTypeAction='payTypeAction' :pay-type='payType'  :order-number='$route.query.orderNumber' />
      </div>
    </div>
  </div>
</template>

<script>
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import TrainCard from '../components/TrainCard'
import PayWechat from '../../order/components/PayWechat'
import PayAli from '../../order/components/PayAli'
import api from 'api/order'
import { mapGetters } from 'vuex'

export default {
  components: {
    ElTable,
    ElTableColumn,
    TrainCard,
    PayWechat,
    PayAli
  },
  computed: {
    ...mapGetters({
      query_card_info: 'query_card_info'
    })
  },
  data () {
    return {
      payType: '',
      orderData: ''
    }
  },
  mounted () {
    this.$store.dispatch('query_card_info', {cardNo: this.$route.query.cardNo})
    api.orderGoodsOrder({
      orderNumber: this.$route.query.orderNumber
    }).then((res) => {
      if (res) {
        this.orderData = res.data
      }
    })
  },
  methods: {
    payTypeAction (payType) {
      this.payType = payType
    },
    handleGoodsDetails () {
      window.open('/manage/order/detail?orderNumber=' + this.$route.query.orderNumber)
    }
  }
}
</script>

<style lang="scss" scoped>
  .price {
    font-weight: 600;
    margin-top: 50px; 
    padding-right: 30px!important;
    span {
      color: #fc6f00
    }
  }
  .pay-way {
    text-align: center;
    .pay-info {
      padding: 80px 0;
      span {
        color: #fc6f00
      }
    }
    .pay-item{
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
</style>
