<template>
  <div class="ticket">
    <div class="divider">
      服务卡详情
    </div>
    <!-- <div class="noactive" v-if="cardStatus === 1">
      <p class="icon"><i class="iconfont">&#xe91c;</i></p>
      <p class="text">去支付，激活此卡！</p>
    </div> -->
    <div class="infoBox" v-if="state !== 1">
      <div class="info">
        <p><span>时间：</span> <b>{{cardInfo.startDateTime | formatDate('yyyy-MM-dd') | formatTime }} - {{cardInfo.endDateTime | formatDate('yyyy-MM-dd') | formatTime}}</b></p>
        <p><span>地点：</span> <b v-if="cardInfo.ticketDetailVO">{{cardInfo.ticketDetailVO.address.join(' ')}}</b></p>
        <p><span>实体票/取票方式：</span> <b>{{cardInfo.obtainType || '--'}}</b></p>
        <div class="showdialog">
          <a href="javascript:;" @click="showDialog(1)">查看取票人信息</a>
          <a href="javascript:;" @click="showDialog(2)" v-if="cardInfo.showExpress">查看快递信息</a>
        </div>
      </div>
      <div class="tips">
        <p v-if="state === 1"><el-button size="medium" class="buy-btn" type="primary"   @click='gopay'>去支付，激活此卡</el-button></p>
        <p v-if="state === 2">有效期截止时间：{{cardInfo.endDateTime | formatDate('yyyy-MM-dd HH:mm') | formatTime }}，请您于有效期结束之前使用。</p>
        <p v-if="state === 3">您的门票已于 {{cardInfo.endDateTime | formatDate('yyyy-MM-dd HH:mm') | formatTime}} 使用完毕。</p>
      </div>
    </div>
    <div class="infoBox2" v-else>
      <p><el-button size="medium" class="buy-btn" type="primary"   @click='gopay'>去支付，激活此卡</el-button></p>
      <a href="javascript:;" @click="showDialog(1)">查看取票人信息</a>
    </div>
    <!-- 查看取票人信息 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogView"
      size="large">
      <div class="addrBox"  v-show="dialogIndex===1">
         <ticket-holder v-if="orderNumber" :orderNumber="orderNumber" />
      </div>
      <div class="logisticsBox"  v-show="dialogIndex===2">
        <logistics v-if="cardInfo.ticketDetailVO" :orderNumber="orderNumber" />  
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from 'api/ticket_card'
import TicketHolder from '../../components/ticketHolder'
import Logistics from '../../components/logistics'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    orderNumber: {
      type: String,
      default: ''
    },
    state: {
      type: Number,
      default: 1
    }
  },
  components: {
    TicketHolder,
    Logistics
  },
  filters: {
    formatTime (val) {
      return val ? val.replace(/-/g, '/') : '--'
    }
  },
  computed: {
    cardStatus () {
      if (this.state === 1) {
        return 1
      } else if (this.state === 2 || this.state === 3) {
        return 2
      } else {
        return 3
      }
    }
  },
  methods: {
    // 获取服务卡详情
    getCardDetail () {
      api.cardDetail({cardNo: String(this.id)})
        .then((res) => {
          this.cardInfo = res.data
        })
    },
    // 去支付页面
    gopay () {
      this.$router.replace({path: '/order/created', query: {orderNumber: this.orderNumber}})
    },
    // 弹出框
    showDialog (val) {
      this.dialogIndex = val
      this.dialogTitle = val === 1 ? '查看取票人' : '查看快递信息'
      this.dialogView = true
    }
  },
  data () {
    return {
      holderInfo: '',
      logisticsInfo: '',
      cardInfo: '',
      dialogView: false, // 取票人信息弹框
      dialogTitle: '查看取票人',
      dialogIndex: 1 // 弹框显示内容
    }
  },
  mounted () {
    this.getCardDetail()
  }
}
</script>
<style lang="scss" scoped>
.ticket{
  padding: 40px 0;
  font-size: 16px;
  .divider{
    padding-bottom: 10px;
  }
  .infoBox {
    .info{
      padding-top: 20px;
      font-size: 14px;
      p{
        margin-bottom: 10px;
        span{
          font-weight: bold;
        }
        b{
          font-weight: normal;
        }
      }
      .showdialog{
        a{
          color: #3583e0;
          margin-right: 50px;
        }
      }
    }
    .tips{
      margin: 20px 0;
      padding-top: 20px;
      font-size: 14px;
      border-top: 1px solid #eee;
    }
  }
  .infoBox2 {
    margin-top: 40px;
    a{
      display: block;
      padding-top: 40px;
      font-size: 12px;
      color: #3583e0;
    }
  }
  .noactive{
    padding: 40px 0;
    text-align: center;
    .icon {
      line-height: 80px;
      height: 80px;
      i {
        font-size: 80px;
        color: #d38619;
      }
    }
    .text {
      font-size: 16px;
      padding-top: 10px;
    }
  }
  .addressee{
    p{
      line-height: 2;
      span {
        display: inline-block;
        width: 100px;
      }
      b{
        font-weight: normal;
      }
    }
  }
  .logistics{
    max-height: 400px;
    overflow: auto;
    .status{
      margin-bottom: 30px;
      font-weight: normal;
      font-size: 16px;
      span{
        color: #00bb90;
      }
    }
    .express{
      overflow: hidden;
      margin-top: 30px;
      font-size: 12px;
      img{
        float: left;
        margin-right: 15px;
      }
      p{
        line-height: 1.5;
      }
    }
  }
}
</style>

<style type="text/css">
  .logistics .el-steps.steps-primary .el-step.is-vertical .el-step__head{
    width: 10px;
    height: 10px;
  }
  .logistics .el-steps.steps-primary .el-step.is-vertical .el-step__line.is-vertical{
    left: 4px;
    top: 10px
  }
  .logistics .el-steps.steps-primary .el-step.is-vertical .el-step__title{
    font-size: 14px;
  }
  .logistics .el-step__description{
    font-size: 12px;
  }
</style>

