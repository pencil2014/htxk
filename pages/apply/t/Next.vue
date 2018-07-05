<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/manage/card/'}">服务卡</el-breadcrumb-item>
      <el-breadcrumb-item>确认报名信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 培训服务卡 -->
    <train-card :cardInfo="cardInfo"/>
    <div class="content next-confirm">
      <e-heading grade='1'>订单支付</e-heading>

      <e-heading grade="2">报名人员名单</e-heading>
      <div class="tr edit">
        <el-button type="normal" size="mini" @click="handleBackEdit">编辑</el-button>
      </div>
      <el-table
        :data="signupList"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="parentMobile"
          align="center"
          label="手机号">
        </el-table-column>
      </el-table>

      <e-heading grade="2">订单价格</e-heading>
      <el-table
        :data="goodsPrice"
        style="width: 100%">
        <el-table-column
          prop="TrainName"
          label="培训名称"
          :show-overflow-tooltip="true"
          width="500">
        </el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
          label="商品价格">
          <template slot-scope="scope">
            <span>{{scope.row.price | formatMoney}}×{{scope.row.amount}} = {{scope.row.amount * scope.row.price | formatMoney}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr price">
        <!-- 应付金额：<span>￥{{totalPrice/100}}</span> -->
        应付金额：<span>{{totalPrice | formatMoney}}</span>
      </div>

      <div class="center button-box" >
        <el-button type="primary" @click="handleSubmit" :loading="loading">确认订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import TrainCard from '../components/TrainCard'
import api from 'api/train'

export default {
  components: {
    ElTable,
    ElTableColumn,
    TrainCard
  },
  computed: {
    signupList () {
      return this.$store.getters.temporary_signup_list
    },
    cardInfo () {
      return this.$store.getters.card_info
    }
  },
  data () {
    return {
      goodsPrice: [],
      totalPrice: '',
      loading: false
    }
  },
  mounted () {
    let goodsInfo = JSON.parse(sessionStorage.getItem('sessionNextPage'))[0]
    this.goodsPrice = [{
      TrainName: goodsInfo.name.title,
      amount: this.signupList.length,
      price: goodsInfo.unitPrice
    }]
    this.totalPrice = this.signupList.length * goodsInfo.unitPrice
  },
  methods: {
    handleBackEdit () {
      this.$store.commit('TEMPORARY_SIGNUP_LIST', this.signupList)
      history.back()
    },
    handleSubmit () {
      this.signupList.forEach(item => {
        delete item.editId
        delete item.id
        delete item.isEdit
        delete item.showVisible
        delete item.index
        delete item.addressLabel
        item.birthday = item.birthday ? new Date(item.birthday).getTime() : ''
        item.origin = [item.origin].join(',')
      })
      let orderParams = {
        cardNo: this.cardInfo.cardNo,
        goodsSku: JSON.parse(sessionStorage.getItem('sessionNextPage'))[0].matchedStock.skuCode,
        trainServiceCardSignReqVOList: this.signupList
      }
      api.createdOrder(JSON.stringify(orderParams), {context: this}).then(res => {
        if (JSON.parse(sessionStorage.getItem('sessionNextPage'))[0].unitPrice === 0) { // 免费订单时
          this.$router.push('/order/success?orderNumber=' + res.data.orderNumber)
        } else {
          this.$router.push('/apply/t/order?orderNumber=' + res.data.orderNumber + '&cardNo=' + this.cardInfo.cardNo)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .next-confirm {
    .el-table {
      padding-bottom: 40px;
    }
    .edit {
      margin: -10px 0 15px;
    }
    .price {
      font-weight: 600;
      padding-right: 30px!important;
      span {
        color: #fc6f00
      }
    }
  }
</style>
