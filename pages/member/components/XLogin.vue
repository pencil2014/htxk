<template>
    <div class="member">
        <el-form 
        v-bind="getFormProps({labelWidth:'0px'})"
        :rules="loginRules" 
        ref="form"
        class="card-box login-form"
        >
          <el-row>
              <el-col :span="10">
                <h3 class="mit_title">账号登录</h3>
              </el-col>
              <el-col :span="14" class="login-links register-link">
                <nuxt-link to="/member/register" class="link">免费注册»</nuxt-link>
              </el-col>
          </el-row>
          <el-row>
            <div class="error-tips small">{{errorMsg}}</div>
          </el-row>
          <el-form-item prop="account" :class="['relative']">
              <el-input name="phone" type="text" v-model="form.account" autoComplete="on" class="full-width" placeholder="请输入账号"  v-focus >
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
              </el-input>
          </el-form-item>
          <el-form-item prop="password">
              <e-password v-model="form.password" />
          </el-form-item>
          <el-form-item v-if="validateCodeVisible" prop="pictureValidateCode" :rules="[{ required: true, message: '请输入图片验证码'}]">
            <e-img-code ref="imgCode" :params="{type:1}" :key="key" v-model="form.pictureValidateCode" :img-key.sync="form.randomKey" />
          </el-form-item>
          <el-form-item class="login-button">
              <el-button type="primary" native-type="submit" class="full-width" :loading="loading" >
                登录
              </el-button>
          </el-form-item>
          <div class="small">
            <el-row>
              <el-col :span="10">
                <el-checkbox v-model="checked" class="auto-login">两周内自动登录</el-checkbox>
              </el-col>
              <el-col :span="14" class="login-links">
                <!-- <nuxt-link class="link" to="/member/reset"></nuxt-link> -->
                <a href="javascript:" @click="handleForget">忘记密码？</a>
                <!-- <nuxt-link class="link" to="/member/active/account">激活帐号</nuxt-link> -->
              </el-col>
            </el-row>
            <div class="auto_login_tips">
              <div v-show="checked">
                <div class="form_error"></div>
                <span>公共场合不建议勾选自动登录</span>
              </div>
              <div class="other_login">
                <span>其他方式登录</span>
                <ul class="login_way">
                  <li class="iconfont qq icon-qq" @click="authLogin(1)"></li>
                  <li class="iconfont wechat icon-weixin" @click="authLogin(2)"></li>
                  <li class="iconfont sina icon-xinlang" @click="authLogin(3)"></li>
                </ul>
              </div>
            </div>
          </div>
        </el-form>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { VuecookieSet, VuecookieGet, VuecookieDelete } from 'utils/cookie'
  import EImgCode from '@e-ui/ImgCode'
  import validator from 'utils/validator'
  import {form} from 'utils/mixins'
  import userApi from 'api/user'
  import {Message} from '@element-ui'
  import EPassword from '@e-ui/Password'
  export default {
    mixins: [form],
    components: {
      EImgCode,
      EPassword
    },
    props: {
      dialog: {
        type: Boolean,
        default: false
      }
    },
    name: 'login',
    data () {
      return {
        validator,
        key: '',
        codeErrorMsg: '',
        pwordType: 'password',
        eyesIcon: 'eyes-close',
        loading: false,
        checked: false,
        validateCodeVisible: false,
        errorMsg: '',
        ischange: false,
        form: {
          account: '',
          password: '',
          pictureValidateCode: '',
          randomKey: ''
        },
        imgSrc: '',
        loginRules: {
          account: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                userApi.checkAccount({account: value, extisted: true}).then((res) => {
                  if (!res.data) {
                    callback(new Error('账号不存在'))
                  } else {
                    callback()
                  }
                })
              },
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'change'}
          ],
          pictureValidateCode: [
            {
              validator: (rule, value, callback) => {
                userApi.checkImgCode({
                  randomKey: this.form.randomKey,
                  imgValidateCode: this.form.pictureValidateCode,
                  type: 1
                }).then((res) => {
                  if (!res.data) {
                    this.$refs.imgCode && this.$refs.imgCode.refresh()
                    callback(new Error('图片验证码错误，请重新输入'))
                  } else {
                    callback()
                  }
                })
              }
            }
          ]
        },
        showDialog: false
      }
    },
    computed: {
      ...mapState({
        check_account: state => state.user.check_account
      })
    },
    created () {
      let isAutoLogin = VuecookieGet('auto_login')
      let token = VuecookieGet('htxk_token')
      if (isAutoLogin && token) { // 是否自动登录
        this.$router.push({path: '/'})
        this.checked = true
      }
      if (token && token.length > 10) {
        Message({
          message: '您已经登录',
          type: 'error',
          duration: 2 * 1000
        })
      }
    },
    watch: {
      form: {
        handler: function (val, oldVal) {
          if (this.form.account === '') {
            this.form.password = ''
          }
        },
        deep: true
      }
    },
    methods: {
      submit () {
        VuecookieGet('htxk_token', window.document.cookie) && userApi.logout().then((res) => {
          this.$store.commit('user/RESET_INFO')
        })
        userApi.login(this.form, {context: this, successMsg: '登录成功', errorMsg: 'none'}).then((res) => {
          this.errorMsg = ''
          let userInfo = res.data.userInfo
          this.$store.commit('user/SESSION', userInfo)
          this.$store.commit('user/SET_TOKEN', {
            userId: userInfo.userId,
            token: userInfo.token
          })
          if (this.checked) { // 设置自动登录开关
            VuecookieSet('auto_login', true, 14)
          }
          this.$emit('login')
          if (this.dialog) {
            if (this.$store.state.isReLoad === 2) {
              window.location.href = window.location.href
            }
            this.$emit('handleClose')
            return false
          }
          let historyUrl = VuecookieGet('historyUrl')
          if (historyUrl && historyUrl.length > 5) {
            VuecookieDelete('historyUrl')
            location.href = historyUrl
          } else {
            setTimeout(() => {
              this.$router.push('/')
            }, 1000)
          }
        }).catch((res) => {
          // 登录异常
          if (res.data) {
            if (res.data.times && res.data.times >= 3) {
              this.validateCodeVisible = true
            }
          }
          if (res.result !== '0') {
            this.errorMsg = res.msg
          }
          this.$refs.imgCode && this.$refs.imgCode.refresh()
        })
      },
      authLogin (type) {
        userApi.authLogin({thirdPartyType: type}).then((res) => {
          if (res.result === '0') {
            // window.open(res.data)
            localStorage.setItem('authUrl', location.href)
            window.location.href = res.data
          }
        })
      },
      handleForget () {
        this.$router.push('/member/reset')
        this.$emit('handleClose')
      }
    },
    beforeDestroy () {
      VuecookieDelete('historyUrl')
    }
  }
</script>

<style  lang="scss" scoped>
    @import "~assets/styles/mixin.scss";
    
    .member {
      .register-link{
        padding-top:5px;
      }
      .el-icon-eyes-close:hover,.el-icon-eyes-open:hover{
        cursor: pointer;
      }
      .el-icon-eyes-close:before{
        color: #ccc;
        font-family: "iconfont" !important;
        content: '\e60b';
      }
      .el-icon-eyes-open:before{
        color: #ccc;
        font-family: "iconfont" !important;
        content: '\e914';
      }
      input:-webkit-autofill {
        background-image: none;
        box-shadow: 0 0 0px 1000px rgb(241, 251, 248) inset;
        -webkit-box-shadow: 0 0 0px 1000px rgb(241, 251, 248) inset;
      }
      input:focus{
        border: 1px solid #00bb90;
      }
      .mit_title {
          font-weight: 500;
          font-size: 18px;
      }
      .el-checkbox {
        &__label {
            font-size: inherit;
        }
      }
      .login-form {
        width:100%;
        height: 400px;
        display: block;
        background: #fff;
        position: relative;
        box-sizing:border-box;
      }
      .login-links {
          text-align: right;
      }
      .other_login {
        margin-top: 15px;
        text-align: center;
        overflow: hidden;
        position: absolute;
        bottom: -25px;
        width: 300px;
        span {
          padding: 0 15px;
          position: relative;
          font-size: 12px;
          color: #999;
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: -150px;
            width: 150px;
            background: #dcdcdc;
            height: 1px;
          }
          &:before {
            content: '';
            position: absolute;
            top: 50%;
            right: -150px;
            width: 150px;
            background: #dcdcdc;
            height: 1px;
          }
        }
        ul.login_way {
          width: 100%;
          margin: 5px auto;
          text-align:center;
          li {
            width: 30px;
            margin:0 20px;
            font-size:30px;
            margin-top: 6px;
            display:inline-block;
            cursor: pointer;
            &.qq {
              color:#7eaeef
            }
            &.wechat {
              color:#78d37d
            }
            &.sina {
              color:#ff7872
            }
          }
        }
      }
      .el-form-item__content>.el-cascader, .el-form-item__content>.el-input, .el-form-item__content>.el-select{
        width:100%;
      }
    }
    .el-button--primary.full-width{
      width:100%;
    }
    .full-width .el-input__inner{
      display:block;
    }
    .error-tips{
      height:30px;
      line-height:30px;
      color: $color-error;
    }
    .login-button{
      margin-bottom: 10px;
    }
</style>
<style  lang="scss">
.auto-login .el-checkbox__label{
  font-size:12px;
}
</style>
