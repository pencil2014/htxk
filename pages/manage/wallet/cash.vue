<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>提现余额到银行卡</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">提现余额到银行卡</e-heading>
            <div class="cash-content">
               <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
                  <el-step title="提现余额" ></el-step>
                  <el-step title="确定提现" ></el-step>
                  <el-step title="申请完成" ></el-step>
                </el-steps>
                <div class="cash-balance" v-show="active == 1">
                     <div class="balance-title"><span>余额：<b >{{cardInfo.totalMoney | noPreformatMoney}}</b> 元</span></div> <!-- <nuxt-link :to="{path:'/manage/wallet/question'}" class="link-change-act">更换提现账户</nuxt-link> -->
                     <div class="balance-box">
                       <el-form :model="cashForm" :rules="rules" ref="cashForm" label-width="100px" onsubmit="return false">
                            <el-form-item label="选择银行卡 :" prop="bankCard" v-if="cardInfo.devicesCode">
                                <el-radio v-model="cashForm.bankCard" label="1"><span class="bank-logo">{{cardInfo.platformInfo}}</span> <span class="end-num">尾号 {{cardInfo.devicesCode | getCardEndNum(cardInfo.devicesCode)}} </span></el-radio>
                            </el-form-item>
                            <el-form-item label="提现余额 :" prop="allCash">
                              <el-input v-model="cashForm.allCash" type= "number" min= "500" max= "50000" @keyup.native.enter="submitForm('cashForm')" @change="balanceValid(cashForm.allCash)" class="cash-input" style="width: 160px"></el-input> 元 <el-button @click="getAllCash(cashForm.allCash)" style="margin-left: 20px;">全部提现</el-button>
                              <div class="el-form-item__error" v-show="cashNoEnough">余额不足</div>
                              <div class="el-form-item__error" v-show="cashMin">单笔提现金额不得小于500元</div>
                              <div class="el-form-item__error" v-show="cashMax">单笔提现金额不得大于50000元</div>
                            </el-form-item>
                            <el-form-item class="submit-btn">
                              <el-button type="primary" @click="submitForm('cashForm')">下一步</el-button>
                            </el-form-item>
                        </el-form>
                         <div class="pay-note" v-show="active == 1">
                            <p>1. 单次提现最低金额500元，每日提现总额5万元，每日可提现2次，15个工作日内到账;</p>
                            <p>2. 提现费率1%，单笔手续费最低5元;</p>
                        </div>
                     </div>
                </div> 
                <div class="cash-balance card-info-box">
                    <div class="card-info-msg" v-show="active == 2">请确认以下的银行卡是否正确，以保证您提现成功！</div>
                    <div class="info-success-msg" v-show="active == 3">
                       <p class="success-txt"><i class="icon iconfont icon-icon11-copy"></i><span>提现申请成功！</span></p>
                       <p class="success-info">已成功提交提现申请！资金将在15个工作日内到账！</p>
                    </div>
                    <table border="1" class="card-table" v-show="active == 2">
                      <tbody>
                      <tr>
                        <td class="card-txt">真实姓名</td>
                        <td class="card-list">{{cardInfo.identityName}}</td>
                      </tr>
                      <tr>
                        <td class="card-txt">提现银行账户</td>
                        <td class="card-list">{{cardInfo.platformInfo}} ( 尾号 {{cardInfo.devicesCode | getCardEndNum(cardInfo.devicesCode)}} )</td>
                      </tr>
                      <tr>
                        <td class="card-txt">提现金额</td>
                        <td class="card-list">￥ {{cashForm.allCash | preformatMy(cashForm.allCash)}}</td>
                      </tr>
                      </tbody>
                    </table>
                    <table border="1" class="card-table" v-show="active == 3">
                      <tbody>
                      <tr>
                        <td class="card-txt">提现银行账户</td>
                        <td class="card-list">{{cardInfo.platformInfo}} ( 尾号 {{cardInfo.devicesCode | getCardEndNum(cardInfo.devicesCode)}} )</td>
                      </tr>
                      <tr>
                        <td class="card-txt">提现金额</td>
                        <td class="card-list">￥ {{cashForm.allCash | preformatMy(cashForm.allCash)}}</td>
                      </tr>
                      <tr>
                        <td class="card-txt">手续费</td>
                        <td class="card-list">￥ {{paykeyOrder.fee | noPreformatMoney}}</td>
                      </tr>
                      <tr>
                        <td class="card-txt">交易编号</td>
                        <td class="card-list">{{paykeyOrder.orderNumber}}</td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="success-btn" v-show="active == 3"><nuxt-link :to="{path:'/manage/wallet'}"><el-button type="primary">完成</el-button></nuxt-link></div>
                    <el-form :model="paykeyFrom" :rules="rules1" class="pay-from" ref="paykeyFrom" label-width="100px" v-show="active == 2" onsubmit="return false">
                        <el-form-item label="支付密码 :"  prop="paykey">
                          <el-input v-model="paykeyFrom.paykey" type="password" @keyup.native.enter="submitPayForm('paykeyFrom')"></el-input>
                        </el-form-item>
                        <el-form-item class="submit-btn">
                          <el-button type="primary" @click="submitPayForm('paykeyFrom')">支付</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 弹出框 -->
                    <el-dialog title="温馨提示" :visible.sync="dialogVisible"  class="error-times">
                        <div v-show="maxSixState == 1">
                          <p class="center error-tit"><b>支付密码有误</b></p>        
                          <p class="center error-txt">每日可输错6次，今日还剩{{paykeyOrder.errorNumber}}次 </p>
                        </div>
                        <div v-show="maxSixState == 0">        
                          <p class="center error-txt">密码错误次数已经达到6次, 请明天再次输入！ </p>
                        </div>
                        <div class="center error-btn">
                          <el-button type="primary" @click="dialogVisible = false" style="margin-right: 30px" v-show="maxSixState == 1">重试</el-button>
                          <nuxt-link :to="{path:'/manage/wallet/passwd'}"><el-button >忘记密码</el-button></nuxt-link>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
import md5 from 'js-md5'
import {ElSteps, ElStep} from '@element-ui/Steps'
import validator from 'utils/validator'
// import axios from 'axios'
export default {
  layout: 'manage',
  components: {
    ElSteps,
    ElStep
  },
  data () {
    return {
      active: 1,
      maxSixState: 1,
      dialogVisible: false,
      cashNoEnough: false,
      cashMin: false,
      cashMax: false,
      paykeyFrom: {
        paykey: '',
        bindPlatformId: ''
      },
      paykeyOrder: {
        errorTimes: '',
        orderNumber: '',
        errorNumber: '',
        fee: ''
      },
      cardInfo: {
        totalMoney: '',
        platformInfo: '',
        devicesCode: '',
        feeRate: '',
        identityName: ''
      },
      cashForm: {
        allCash: '',
        bankCard: '1',
        userCharge: ''
      },
      rules: {
        allCash: [
          {required: true, message: '提现余额不能为空', trigger: 'blur'},
          Object.assign({}, validator.rule.priceNum)
        ],
        bankCard: [
          {required: true, message: '选择银行卡', trigger: 'blur'}
        ]
      },
      rules1: {
        paykey: [
          {required: true, message: '支付密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 提现事件处理
    getAllCash () {
      if (this.cardInfo.totalMoney) {
        let $num = this.noPreformatMy(this.cardInfo.totalMoney)
        this.cashForm.allCash = $num
        this.balanceValid(this.cashForm.allCash)
      }
    },
    noPreformatMy (num) {
      // 元转换分并且四位数字没有逗号分，便于全部提现
      if (!num) {
        return '0.00'
      }
      num = num.toString().replace(/\$|,/g, '') / 100
      if (isNaN(num)) {
        num = '0'
      }
      let sign = (Number(num) === (num = Math.abs(num)))
      num = Math.floor(num * 100 + 0.50000000001)
      let cents = num % 100
      num = Math.floor(num / 100).toString()
      if (cents < 10) {
        cents = '0' + cents
      }
      return ((sign) ? '' : '-') + num + '.' + cents
    },
    // 元转换为分
    unitPrice (val) {
      let m = Math.round(val * 100) / 100
      return parseFloat(m.toString() * 100)
    },
    // 余额判断
    balanceValid ($num) {
      if ($num) {
        let n = this.unitPrice($num)
        // 单笔金额小于500元判断
        if (n < 50000) {
          this.cashMin = true
        } else {
          this.cashMin = false
        }
        // 输入值小于余额
        if (n > this.cardInfo.totalMoney && n > 50000 && n < 5000000) {
          this.cashNoEnough = true
        } else {
          this.cashNoEnough = false
        }
        // 单笔金额大于50000元判断
        if (n > 5000000) {
          this.cashMax = true
        } else {
          this.cashMax = false
        }
      } else {
        this.cashNoEnough = false
        this.cashMin = false
        this.cashMax = false
      }
    },
    // 获取银行卡信息
    getCreditCardInfo () {
      api.getBandInfo({
      }).then((res) => {
        if (res.data) {
          this.cardInfo = res.data
          // 获取平台ID, 必须先绑定好银行卡后才能提现，否则自动跳转到绑定银行卡页面
          if (res.data.bindPlatformId) {
            this.paykeyFrom.bindPlatformId = res.data.bindPlatformId
          } else {
            this.$router.push('/manage/wallet/card?v=new')
          }
        }
      }).catch((ERR) => {
        console.log('error bind info')
      })
    },
    // 第一步，提现
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.cashNoEnough === false && this.cashMin === false && this.cashMax === false) {
          // 格式化小数点后2位
          let $num = this.cashForm.allCash
          this.cashForm.allCash = Math.round($num * 100) / 100
          this.next()
        } else {
          return false
        }
      })
    },
    // 第二步，支付
    submitPayForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.cashSubmit({
            bindPlatformId: this.paykeyFrom.bindPlatformId,
            withdrawAmount: this.unitPrice(this.cashForm.allCash),
            transPwd: md5(this.paykeyFrom.paykey)
          }).then((res) => {
            if (res.data) {
              // 获取提现后的信息
              this.paykeyOrder = res.data
              this.next()
              console.log(res)
            }
            console.log('ssuccess all：', res)
          }).catch((err) => {
            this.paykeyOrder = err.data
            let errTimes = parseInt(this.paykeyOrder.errorTimes)
            // 当密码错误次数大于或等于1次弹出提示框
            if (errTimes < 7) {
              this.paykeyOrder.errorNumber = parseInt(6 - errTimes)
            } else {
              this.paykeyOrder.errorNumber = 6
            }
            if (errTimes >= 1) {
              // 当错误密码次数大于或等于1，则显示弹出框
              this.dialogVisible = true
            }
            if (errTimes === 6) {
              // 当错误密码次数达到6次，温馨提示改变
              this.maxSixState = 0
            }
          })
        } else {
          return false
        }
      })
    },
    // 步骤进度控制
    next () {
      if (this.active++ > 3) {
        this.active = 1
      }
    }
  },
  filters: {
    // 格式化银行卡尾号
    getCardEndNum ($num) {
      if ($num) {
        return $num.substr(-4, 4)
      }
    }
  },
  computed: {
    feeInfo: function () {
      let total = this.cashForm.allCash
      let fee = parseFloat(total * this.cardInfo.feeRate)
      return fee.toFixed(2)
    }
  },
  mounted () {
    this.getCreditCardInfo()
  }
}
</script>
<style lang="scss">
.wallet-box{
  .el-step__main{
    top: -6px
  }
}
.cash-content .el-radio{
    border: 1px solid #8eb4db;
    padding: 2px 20px 2px 10px;
    min-width: 280px;
    display: inline-block;
    background: #fbfcff
}
</style>
<style lang="scss" scoped>
  
  .wallet-box{
    position: relative;
    .submit-btn{
      margin-top: 30px;
    }
    .error-times .error-tit{
      margin-bottom: 15px;
    }
    .error-times .error-btn{
      margin-top: 30px;
    }
    .pay-note{
      margin-top: 80px;
      border-top: 1px solid #eee;
      padding: 10px;
      color: #ccc;
    }
    .cash-content{
      margin-top: 60px;
    }
    .el-form--inline .el-form-item,.el-form--inline .el-form-item__content{
      display: block !important;
    }
    .balance-box{
      margin-top: 40px;
    }
    .bank-logo{
      font-size: 14px;
      margin-right: 30px;
    }
    .end-num{
      float: right;
      font-size: 12px !important;
    }
    .card-info-msg{
      text-align: left;
      padding-left: 150px
    }
    .card-info-box{
      .success-txt{
        font-size: 16px;
        padding-left: 200px;
        span{
          padding-left: 20px;
        }
      }
      .icon-icon11-copy{
        color: #1dc77e;
        font-size: 42px;
        vertical-align: middle;
      }
    }
    .cash-balance{
      margin-top: 60px;
      position: relative;
      .cash-input{
        width: 160px;
      }
      .balance-title {
        margin-left: 42px;
      }
      .balance-title span {
        font-size: 18px;
        b{
          font-size: 28px;
          vertical-align: middle
        }
      }
      .link-change-act {
      position: absolute;
      top: 10px;
      right: 0;
      font-size: 14px;
      color: #3c7dff
    }
    }
    .pay-from {
        width:  70%;
        margin-left: 75px;
    }
    .success-info {
      padding-left: 150px;
      margin-top: 20px;
    }
    .success-btn {
      padding-left: 250px;
    }
    // 特殊表格显示
    .card-table{
      width: 70%;
      margin: 30px 0;
      td{
        border: 1px solid #ccc;
        padding: 6px 10px;
      };
      .card-txt{
        text-align: right;
        width: 30%;
        padding-right: 20px;
      }
      .card-list{
        text-align: left;
        width: 70%;
        padding-left: 60px
      }
    }
  }

</style>

