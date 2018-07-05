<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>绑定收款账户</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">绑定收款账户</e-heading>
            <div class="pay-bind" v-show="active == 1">
                <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="100px">
                    <el-form-item label="储蓄卡卡号:" prop="cardNum">
                      <el-input v-model="accountForm.cardNum" :maxlength="19" placeholder="请输入储蓄卡卡号" @blur="getBankInfo"></el-input><span class="card-info">{{platformInfo}}</span>
                    </el-form-item>  
                      <el-form-item label="姓名:" prop="name">
                      <el-input v-model="accountForm.name" :maxlength="40" :minlength="2" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证:" prop="idCard">
                      <el-input v-model="accountForm.idCard" :maxlength="18"  placeholder="请输入身份证"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="phone">
                      <el-input v-model="accountForm.phone" :maxlength="11" placeholder="请输入银行预留手机号" ></el-input>
                    </el-form-item>  
                    <el-form-item label="验证码:" prop="verifyCode" class="verify-input">
                      <el-input v-model="accountForm.verifyCode" :maxlength="6"  @change="verifyInputCode" placeholder=""></el-input>
                      <el-button :disabled="isDisable" @click="getPhoneCodeSubmit('accountForm')" style='margin-left: 10px'>{{sendText}}</el-button>
                      <div class="el-form-item__error" v-show="resultCode !== '0' && accountForm.verifyCode">验证码不正确</div>
                    </el-form-item>
                    <el-form-item label="" prop="isAgree">
                      <el-checkbox v-model="accountForm.isAgree">
                          <router-link to="/manage/wallet/agreement" class="link" target="_blank">同意并遵守《支付服务协议》</router-link>
                          <div class="el-form-item__error" v-show="accountForm.isAgree != true" style="padding-bottom: 5px">请同意以上协议</div>
                      </el-checkbox>
                        <el-form-item class="submit-btn">
                          <el-button type="primary" @click="submitForm('accountForm')" :disabled=disabledFlag>提交</el-button>
                      </el-form-item>
                  </el-form-item>
                </el-form>
            </div>
            <div class="pay-bind-success" v-show="active == 2">
                <p class="success-text"><i class="icon iconfont icon-icon11-copy"></i> 银行卡添加成功！</p>
                <nuxt-link :to="{path:'/manage/wallet/card'}" v-if="auth === 0"><el-button type="success" class="pay-suc">确定</el-button></nuxt-link>
                <nuxt-link :to="{path:'/attestation/name'}" v-if="auth === 1"><el-button type="success" class="pay-suc">确定</el-button></nuxt-link>
            </div>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
import validator from 'utils/validator'
export default {
  layout: 'manage',
  components: {
  },
  data () {
    var validateVerifyCode = (rule, value, callback) => {
      if (value === '' && this.isVerifyCode === true) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      accountForm: {
        cardNum: '',
        name: '',
        idCard: '',
        phone: '',
        verifyCode: '',
        isAgree: true
      },
      auth: 0,
      disabledFlag: false,
      orderNumber: '',
      isVerifyCode: true,
      vaildCard: false,
      platformInfo: '',
      mediumCode: '',
      mediumInfo: '',
      placeHolder: '',
      platformCode: '',
      active: 1,
      validator,
      upTime: 60,
      resultCode: '',
      isDisable: false,
      sendText: '获取验证码',
      rules: {
        cardNum: [
          {required: true, message: '请输入储蓄卡卡号', trigger: 'blur'},
          Object.assign({}, validator.rule.creditCard)
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 2, max: 40, message: '请输入2-40个字符', trigger: 'blur'},
          Object.assign({}, validator.rule.musername)
        ],
        idCard: [
          {required: true, message: '请输入身份证', trigger: 'blur'},
          {min: 18, max: 18, message: '请输入18个字符', trigger: 'blur'},
          Object.assign({}, validator.rule.idCard)
        ],
        phone: [
          {required: true, message: '请输入银行预留手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11个字符', trigger: 'blur'},
          Object.assign({}, validator.rule.mobile)
        ],
        verifyCode: [
          {validator: validateVerifyCode, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 步骤进度控制
    next () {
      if (this.active++ > 2) {
        this.active = 1
      }
      if (this.active === 2) {
        this.getAuth()
      }
    },
    getAuth () {
      if (this.$route.query.auth === '1') {
        this.auth = 1
      }
    },
    // 提交表单
    submitForm (formName) {
      this.isVerifyCode = true
      this.$refs[formName].validate((valid) => {
        // vaildCard 判断卡号信息是否正确
        if (valid && this.vaildCard === true && this.accountForm.isAgree === true) {
          // 提交银行卡信息
          this.addBindCard()
        } else {
          return false
        }
      })
    },
    // 获取短信
    getPhoneCodeSubmit (formName) {
      this.isVerifyCode = false
      this.$refs[formName].validate((valid) => {
        // vaildCard 判断卡号信息是否正确
        if (valid && this.vaildCard === true && this.accountForm.isAgree === true) {
          // 提交银行卡信息
          this.sendbankInfoApi()
        } else {
          return false
        }
      })
    },
    // 预绑定银行卡卡号：提交银行卡信息,获取短信准备
    sendbankInfoApi () {
      api.preBindCard({
        platformCode: this.platformCode,
        devicesCode: this.accountForm.cardNum,
        mediumCode: this.mediumCode,
        identityCode: this.accountForm.idCard,
        identityName: this.accountForm.name,
        phone: this.accountForm.phone,
        orderNumber: this.orderNumber
      }, {successMsg: 'none'}).then((res) => {
        if (res.data.orderNumber) {
          this.orderNumber = res.data.orderNumber
          this.disabledFlag = false
          if (res.result === '0') {
            this.countSent('获取安全验证码', '重新获取')
          }
        } else {
          this.disabledFlag = true
        }
      }).catch((err) => {
        console.log(err)
        this.disabledFlag = true
      })
    },
    // 绑定及验证提现银行卡,提交表单准备
    addBindCard () {
      api.addBindCard({
        orderNumber: this.orderNumber,
        verifyCode: this.accountForm.verifyCode
      }).then((res) => {
        if (res.result === '0') {
          this.next()
        }
      })
    },
    // 获取银行信息，查询银行卡相关信息
    getBankInfo () {
      if (!isNaN(this.accountForm.cardNum) && this.accountForm.cardNum.length >= 12 && this.accountForm.cardNum.length <= 19) {
        api.checkBankInfo({
          cardNo: this.accountForm.cardNum
        }).then((res) => {
          if (res.data === undefined) {
            this.platformInfo = '卡号有误!'
            // 若卡号信息有误，不能提交
            this.vaildCard = false
          } else {
            // 银行名称
            if (res.data.platformInfo) {
              this.platformInfo = res.data.platformInfo
              this.vaildCard = true
            }
            // 银行卡类型编码
            if (res.data.mediumCode) {
              this.mediumCode = res.data.mediumCode
            }
            // 银行卡类型名称
            if (res.data.mediumInfo) {
              this.mediumInfo = res.data.mediumInfo
            }
            // 银行编码
            if (res.data.platformCode) {
              this.platformCode = res.data.platformCode
            }
            // 银行编码
            if (res.data.placeHolder) {
              this.placeHolder = res.data.placeHolder
            }
          }
        })
      }
    },
    // 获取验证码
    getPhoneCode () {
      if (this.accountForm.phone) {
        api.getPhoneCodeCard({
          phone: this.accountForm.phone,
          operateType: 10
        }).then((res) => {
          if (res.result === '0') {
            this.countSent('获取安全验证码', '重新获取')
          }
        })
      }
    },
    // 60s手机验证计时
    countSent (txt, reTxt) {
      this.isDisable = true
      this.sendText = reTxt + '(' + this.upTime + ')'
      const upTimeInter = setInterval(() => {
        this.upTime--
        this.sendText = reTxt + '(' + this.upTime + ')'
        if (this.upTime === 0) {
          clearInterval(upTimeInter)
          this.sendText = txt
          this.upTime = 60
          this.isDisable = false
        }
      }, 1000)
    },
    // 校验手机验证码
    verifyInputCode () {
      if (this.accountForm.verifyCode && this.accountForm.verifyCode.length === 6) {
        api.validateCodeCard({
          validateMsg: this.accountForm.verifyCode,
          validateType: 5,
          operateType: 10,
          somethingStr: this.accountForm.phone
        }).then((res) => {
          if (res.result) {
            this.resultCode = res.result
          } else {
            this.resultCode = '0'
          }
        }).catch((err) => {
          this.resultCode = err.result
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .wallet-box{
    position: relative;
    i.icon-icon11-copy{
      color: #1dc77e;
      font-size: 42px !important;
      vertical-align: middle;
      margin-right: 10px
    }
    .pay-bind{
      margin-top: 40px;
    }
    .pay-bind-success,.nuxt-link-active{
      text-align: center;
    }
    .success-text{
      margin-bottom: 30px;
      font-size: 18px;
    }
    .card-info{
      color: red;
      margin-left: 8px;
    }
    .submit-btn{
      margin-top: 20px;
    }
    .el-checkbox{
      margin-top: 6px;
    }
    .verify-input {
      margin-bottom: 5px;
      .el-input {
        width: 170px !important;
      };
      button {
        margin-left: 10px;
      }
    }
    
  }
</style>

