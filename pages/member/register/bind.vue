<template>
  <!--邮箱注册绑定手机-->
    <el-form :model="form" class="bind-phone" :rules="rules" ref="form">
      
      <el-form-item :class="['relative']" prop="phone">
          <el-input class="full-width reset-box" placeholder="请输入手机号" v-model="form.phone" >
              <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
          </el-input>
      </el-form-item>
      <el-form-item :class="['relative']" prop="imgCode">
        <e-img-code ref="imgCode" :params="{type: 4}" v-model="form.imgCode" :img-key.sync="form.codeKey"/>
      </el-form-item>
      <el-form-item :class="['relative']" prop="verifyCode">
        <e-sms-code v-model="form.verifyCode" :params="{randomKey: form.codeKey, account: form.phone, type: 2, validateCode: '', extisted: false}" :btn-disabled="!accountSuccess" />
      </el-form-item>
      <div class="el-form-item__error" style="position:static;margin-bottom:10px;margin-top:-10px">{{errorMsg}}</div>
      <el-button class="full-width next-step reset-box" type="primary" @click="boundPhone" :loading="loading">绑定手机</el-button>
      <div class="tc"><el-button type="text" @click="nextSetp">跳过</el-button></div>
    </el-form>
</template>

<script>
  import userApi from 'api/user'
  import validator from 'utils/validator'
  import EImgCode from '@e-ui/ImgCode'
  import ESmsCode from '@e-ui/SmsCode'
  export default {
    components: {
      EImgCode,
      ESmsCode
    },
    data () {
      let self = this
      return {
        accountSuccess: false,
        imgCodeSuccess: false,
        loading: false,
        errorMsg: '',
        rules: {
          phone: [
            {
              validator: (rule, value, callback) => {
                self.accountSuccess = false
                if (!value.trim()) {
                  callback(new Error('手机号不能为空'))
                } else if (!validator.pattern.mobile.test(value.trim())) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  self.accountSuccess = true
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          imgCode: [
            {
              validator (rule, value, callback) {
                self.imgCodeSuccess = false
                if (!value.trim()) {
                  callback(new Error('请输入图片验证码'))
                } else {
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
                  }).catch((ERR) => {
                    self.$refs.imgCode.refresh()
                    callback(new Error('图片验证码错误，请重新输入'))
                  })
                }
              },
              trigger: 'blur'
            }
          ],
          verifyCode: [
            {required: true, message: '请输入验证码'}
          ]
        },
        sent: false,
        agree: false,
        form: {
          phone: '',
          imgCode: '',
          codeKey: '',
          verifyCode: ''
        }
      }
    },
    methods: {
      boundPhone () {
        let userName = this.$route.query.userName
        this.$refs.form.validate((valid) => {
          if (valid) {
            userApi.bindPhone({
              account: userName,
              userId: this.$route.query.userId,
              phone: this.form.phone,
              validateCode: this.form.verifyCode,
              pictureValidateCode: this.form.imgCode,
              randomKey: this.form.codeKey,
              stepCheckCode: this.$route.query.code
            }, {
              context: this
            }).then((res) => {
              this.$router.push({path: '/member/register/result', query: {userName: userName, success: true}})
            }).catch((res) => {
              this.errorMsg = res.msg
            })
          }
        })
      },
      nextSetp () {
        this.$router.push({path: '/member/register/result', query: {userName: this.$route.query.userName, success: true}})
      }
    }
  }
</script>

<style scoped lang="scss">
  .bind-phone{
    padding:20px 0 30px;
  }
  .el-form-item__content>.el-cascader, .el-form-item__content>.el-input, .el-form-item__content>.el-select,.el-button.full-width{
    width:100%;
  }
  .full-width .el-input__inner{
    display:block;
  }
</style>
