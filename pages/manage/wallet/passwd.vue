<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>支付密码</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">支付密码</e-heading>
            <div class="pay-pawd">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
                  <el-step title="验证身份" ></el-step>
                  <el-step title="设置支付密码" ></el-step>
                  <el-step title="完成" ></el-step>
                </el-steps>
                <div class="pay-way" v-show="active == 1">
                    <el-form :model="queryForm" :rules="rules" ref="queryForm" v-bind="getFormProps({labelWidth:'140px'})">
                      <el-form-item label="选择身份认证方式:" prop="verifyWay">
                        <el-row>
                          <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-input v-model="verifyWay" :disabled="true"></el-input>
                                <!-- <el-select size="small" v-model="queryForm.verifyWay">
                                    <el-option v-for="item in validateList" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                                </el-select> -->
                            </div>
                          </el-col>
                          <el-col :span="8"><div class="grid-content bg-purple" style="margin-left: 20px"><el-button :disabled="isDisable" @click="getPhoneCode">{{sendText}}</el-button></div></el-col>
                        </el-row>
                      </el-form-item>
                      <el-form-item label="请输入安全验证码:" prop="verifyCode" >
                        <el-row>
                          <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                              <el-input v-model="queryForm.verifyCode" :maxlength="6"  placeholder="请输入安全验证码" ></el-input>
                              <!-- <div class="el-form-item__error" v-show="resultCode !== '0' && queryForm.verifyCode">安全验证码不正确</div> -->
                            </div>
                          </el-col>
                          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
                        </el-row>
                      </el-form-item>
                      <el-form-item label="图形验证码:" prop="imgCode">
                        <e-img-code inline ref="imgCode" :params="{type: 2}" :img-key.sync="queryForm.codeKey" v-model="queryForm.imgCode"/>
                      </el-form-item>
                      <el-row style="margin-top: 20px">
                        <el-col :span="4"><div class="grid-content bg-purple"></div>&nbsp;</el-col>
                        <el-col :span="6"><div class="grid-content bg-purple-light"></div><el-button class="full-width next-step reset-box" type="primary" @click="submitForm('queryForm')">确认, 进入下一步</el-button></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
                      </el-row>       
                    </el-form>
                    <div class="pay-note" v-show="active == 1">
                        <p class="pay-note-title">操作提示：</p>
                        <p>1. 请正确输入下方图形验证码，如看不清可点击图片进行更换，输入完成后进行下一步操作。</p>
                        <p>2. 收到安全验证码后，请在15分钟内完成验证。</p>
                    </div>
                </div>
                <div class="pay-set-key" v-show="active == 2">
                    <el-form :model="keyForm" :rules="rules2" ref="keyForm">
                      <el-form-item label="设置6位数字密码:" prop="pass">
                          <el-input v-model="keyForm.pass" :maxlength="6" type="password" auto-complete="off" placeholder="" ></el-input>
                      </el-form-item>
                       <el-form-item label="确认6位数字密码:" prop="checkPass">
                          <el-input v-model="keyForm.checkPass" :maxlength="6" type="password" auto-complete="off" placeholder="" ></el-input>
                      </el-form-item>  
                      <el-button class="sumit-key" type="primary" @click="submitKeyForm('keyForm')">提交</el-button> 
                    </el-form>
                </div>
                <div class="pay-set-done" v-show="active == 3">
                     <p>支付密码设置成功！</p>
                     <nuxt-link :to="{path:'/manage/wallet'}"><el-button type="primary" >完成</el-button></nuxt-link>
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
import {form} from 'utils/mixins'
import md5 from 'js-md5'
import { mapState } from 'vuex'
import EImgCode from '@e-ui/ImgCode'
import {ElSteps, ElStep} from '@element-ui/Steps'
// import axios from 'axios'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    ElSteps,
    ElStep,
    EImgCode
  },
  data () {
    let self = this
    // 密码验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('数字密码不能为空'))
      } else {
        if (this.keyForm.checkPass !== '') {
          this.$refs.keyForm.validateField('checkPass')
        }
        callback()
      }
    }
    // 确认密码验证
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('数字密码不能为空'))
      } else if (value !== this.keyForm.pass) {
        callback(new Error('两次输入数字密码不一致!'))
      } else {
        callback()
      }
    }
    var checkVerifyCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('安全验证码不能为空'))
      } else {
        setTimeout(() => {
          api.validateCode({
            smsCode: this.queryForm.verifyCode,
            operateType: 8
          }).then((res) => {
            if (res.result) {
              this.resultCode = res.result
              callback()
            } else {
              this.resultCode = '0'
              callback(new Error('安全验证码不正确'))
            }
            console.log(res, 'is sucess')
          }).catch((err) => {
            this.resultCode = err.result
            callback(new Error('安全验证码不正确'))
            console.log(err, 'is error')
          })
        }, 500)
      }
    }
    return {
      queryForm: {
        idcVal: '',
        verifyCode: '',
        verifyWay: '',
        imgCode: '',
        codeKey: '',
        key: ''
      },
      keyForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        verifyWay: [
          {required: true, message: '请选择验证方式', trigger: 'blur'}
        ],
        verifyCode: [
          { validator: checkVerifyCode, trigger: 'blur' }
        ],
        imgCode: [
          {
            validator (rule, value, callback) {
              if (!value.trim()) {
                callback(new Error('图形验证码不能为空'))
              } else {
                api.checkImgCode({
                  randomKey: self.queryForm.codeKey,
                  imgValidateCode: self.queryForm.imgCode,
                  type: 2
                }).then((res) => {
                  if (res.data) {
                    callback()
                  } else {
                    self.$refs.imgCode && self.$refs.imgCode.refresh()
                    callback(new Error('图形验证码不正确'))
                  }
                }).catch(() => {
                  self.$refs.imgCode && self.$refs.imgCode.refresh()
                  callback(new Error('图形验证码不正确'))
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      rules2: {
        pass: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      },
      upTime: 60,
      isDisable: false,
      sendText: '获取安全验证码',
      phone: '',
      active: 1,
      resultCode: '',
      verInfo: {
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    // 提交支付身份验证表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.resultCode === '0') {
          this.next()
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
    },
    // 手机验证计时
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
    // 获取手机号码验证
    getPhoneCode () {
      api.getTelCode({
        operateType: 8
      }).then((res) => {
        this.countSent('获取安全验证码', '重新获取')
      }).catch((ERR) => {
        // console.log('get phone error')
      })
    },
    // 提交密码数据
    submitKey () {
      api.sumitPayKey({
      }).then((res) => {})
    },
    // 发送验证密码
    sendPwd () {
      api.submitKeyForm({
        transPwd: md5(this.keyForm.checkPass),
        smsCode: this.queryForm.verifyCode,
        opterType: 8
      }).then((res) => {
        this.next()
      }).catch((ERR) => {
        // console.log(ERR)
      })
    },
    // 提交密码验证表单
    submitKeyForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendPwd()
        } else {
          return false
        }
      })
    }
  },
  computed: {
    ...mapState({
      userSection: state => state.user.session
    }),
    // 手机号码的格式化
    verifyWay: function () {
      if (this.userSection.phone) {
        let userPhone = this.userSection.phone
        let reg = /^(\d{3})\d{4}(\d{4})$/
        let phone = userPhone.replace(reg, '$1****$2')
        this.queryForm.verifyWay = userPhone
        return '手机【' + phone + '】'
      }
    },
    validateList: function () {
      // return [{label: '请选择', value: ''}, {label: '手机[' + this.verInfo.phone + ']', value: '0'}, {label: '邮箱[' + this.verInfo.email + ']', value: '1'}]
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.wallet-box{
  .el-step__main{
    top: -6px
  }
  .pay-set-key .el-form-item__error{
    left: 135px;
  }
  .nuxt-link-active{
    padding-left: 8px;
  }
}
</style>
<style lang="scss" scoped>
  
  .wallet-box{
    .pay-pawd{
      margin-top: 50px;
    }
    .pay-way{
      margin-top: 60px;
    }
    .pay-note-title{
      margin-bottom: 5px;
      font-size: 16px;
      color: #666;
    }
    .pay-note{
      margin-top: 80px ;
      border-top: 1px solid #eee;
      padding: 10px;
      color: #ccc
    }
    .pay-set-key {
      margin: 60px auto;
    }
    .sumit-key{
      margin-left: 135px;
      margin-top: 20px
    }
    .pay-set-done{
      text-align: left;
      margin-top: 60px;
      margin-left: 252px;
    }
    .pay-set-done button{
      margin-top: 30px;
    }
  }
</style>