<template>
    <!--账号设置-->
    <el-form :rules="rules" class="member" v-bind="getFormProps({labelWidth:'0'})" ref="form">
        <el-row>
            <el-col :span="10">
              <h3 class="mit_title">账号注册</h3>
            </el-col>
            <el-col :span="14" class="login-links ">
              已有账号，<nuxt-link to="/member/login" class="link">立即登录</nuxt-link>
            </el-col>
        </el-row>
        <div class="el-form-item__error" style="position:static;line-height:24px;height:24px;padding-top:0">{{errorMsg}}</div>
        <el-form-item prop="username">
            <el-input class="full-width reset-box" placeholder="请输入手机号/邮箱" v-model="form.username" v-focus>
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
            </el-input>
        </el-form-item>
        <el-form-item prop="imgCode">
          <e-img-code ref="imgCode" :params="{type: 2}" v-model="form.imgCode" :img-key.sync="form.codeKey"/>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <e-sms-code v-model="form.verifyCode" :params="{randomKey: form.codeKey, account: form.username, type: 1, validateCode: form.imgCode, extisted: false}" :btn-disabled="accountSuccess&&imgCodeSuccess? false : true"/>
        </el-form-item>
        <el-button class="full-width next-step reset-box" type="primary" native-type="submit" :disabled="!agree" :loading="loading">下一步</el-button>
        <p class="agreement">
            <el-checkbox v-model="agree" class="cbx">我同意并遵守</el-checkbox>《<a class="link" @click="dialogVisible = true">求苗用户注册协议</a>》
        </p>
        <!--用户注册协议-->
        <el-dialog
          title="信息"
          :visible.sync="dialogVisible"
          size="small" custom-class="signup_box">
          <agreement />
        </el-dialog>
    </el-form>
</template>
<script>
  import userApi from 'api/user'
  import validator from 'utils/validator'
  import EImgCode from '@e-ui/ImgCode'
  import ESmsCode from '@e-ui/SmsCode'
  import {form} from 'utils/mixins'
  import Agreement from './components/Agreement'
  export default {
    mixins: [form],
    components: {
      EImgCode,
      ESmsCode,
      Agreement
    },
    props: {
      saveCode: {
        type: Function
      }
    },
    data () {
      let self = this
      return {
        accountSuccess: false,
        imgCodeSuccess: false,
        validator,
        loading: false,
        dialogVisible: false,
        errorMsg: '',
        rules: {
          imgCode: [
            {required: true, message: '请输入图片验证码', trigger: 'blur'},
            {min: 4, max: 4, message: '图片验证码4个字符', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                self.imgCodeSuccess = false
                if (self.form.imgCode.length === 4) {
                  userApi.checkImgCode({
                    randomKey: self.form.codeKey,
                    imgValidateCode: self.form.imgCode,
                    type: 2
                  }).then((res) => {
                    if (res.data) {
                      self.imgCodeSuccess = true
                      callback()
                    } else {
                      self.$refs.imgCode.refresh()
                      callback(new Error('图片验证码错误，请重新输入'))
                    }
                  }).catch(() => {
                    self.$refs.imgCode.refresh()
                    callback(new Error('图片验证码错误，请重新输入'))
                  })
                }
              }
            }
          ],
          verifyCode: [
            {required: true, message: '请输入验证码'}
          ],
          username: [{
            validator (rule, value, callback) {
              self.accountSuccess = false
              if (!value.trim()) {
                callback(new Error('账号不能为空'))
              } else if (!validator.pattern.email.test(value) && !validator.pattern.phone.test(value)) {
                callback(new Error('请输入正确的邮箱或者手机号'))
              } else {
                userApi.checkAccount({account: value, extisted: true}).then((res) => {
                  if (res.data) {
                    callback(new Error('账号已存在,请直接登录'))
                  } else {
                    self.accountSuccess = true
                    callback()
                  }
                })
              }
            }
          }]
        },
        agree: true,
        form: {
          username: '',
          imgCode: '',
          codeKey: '',
          verifyCode: ''
        }
      }
    },
    methods: {
      submit () {
        userApi.checkRegister({
          account: this.form.username,
          validateCode: this.form.verifyCode,
          pictureValidateCode: this.form.imgCode,
          randomKey: this.form.codeKey
        }, { context: this }).then((res) => {
          this.errorMsg = ''
          this.$router.push({path: '/member/register/password', query: {id: this.form.username, code: res.data}})
        }).catch((res) => {
          this.errorMsg = res.msg
          this.$refs.imgCode && this.$refs.imgCode.refresh()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .member{
    padding-bottom:40px;
    .mit_title {
      font-weight: 500;
      font-size: 18px;
      height:30px;
    }
    .login-links{
      text-align:right;
      padding-top:5px;
    }
    .signup_box{
      .el-dialog__header{
        padding:20px;
      }
      .el-dialog__body {
        height:500px;
        overflow-y: auto;
        padding:0;
      }
      .agree_box{
        padding:35px;
        h2.tc{
          font-size: 20px;
          font-weight:bold;
          text-align: center;
          margin: 15px 0;
          color:#333;
        }
        h3{
          font-size:16px;
          font-weight:bold;
          margin: 20px 0;
        }
        p{
          line-height: 2;
          margin-bottom: 3px;
        }
      }
    }
    .agreement{
      margin-top:20px;
    }
    .el-form-item__content>.el-cascader, .el-form-item__content>.el-input, .el-form-item__content>.el-select,.el-button.full-width{
      width:100%;
    }
  }
  .full-width .el-input__inner{
    display:block;
  }
</style>
<style lang="scss">
  
  .signup_box .el-dialog__body{
    line-height:1.75;
  }

</style>