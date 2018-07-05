<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/manage/card/'}">服务卡</el-breadcrumb-item>
      <el-breadcrumb-item>{{status.includes(query_card_info.orderStatus) ? '报名成功' : '支付失败'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 培训服务卡 -->
    <train-card :cardInfo="query_card_info">
        <el-button type="primary" @click="handleGoodsDetails">查看订单</el-button>
    </train-card>
    <div class="content isSuccess">
      <pay-status :paymentStatus="query_card_info.orderStatus" />

      <div v-if="status.includes(query_card_info.orderStatus)">
        <e-heading grade="2">报名人员名单</e-heading>
        <el-table
          :data="query_card_info.trainStudentSignupList"
          style="width: 100%">
          <el-table-column
            prop="studentName"
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
        <div class="center button-box">
          <nuxt-link to="/">
            <el-button type="primary">返回求苗官网</el-button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PayStatus from './components/PayStatus'
import TrainCard from '../components/TrainCard'
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import { mapGetters } from 'vuex'

export default {
  components: {
    PayStatus,
    TrainCard,
    ElTable,
    ElTableColumn
  },
  computed: {
    ...mapGetters({
      query_card_info: 'query_card_info'
    })
  },
  data () {
    return {
      status: [2, 4]
    }
  },
  mounted () {
    this.$store.dispatch('query_card_info', {cardNo: this.$route.query.cardNo})
  },
  methods: {
    handleGoodsDetails () {
      window.open('/manage/order/detail?orderNumber=' + this.$route.query.orderNumber)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
