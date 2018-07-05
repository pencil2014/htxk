<template>
  <div class="login-container">
      <div class="wrapper">
        <!--账号填写-->
        <div class="reg-container container" v-if="step==1">
          <div >
              <p class="tip">请输入你需要找回登录密码的账号</p>
              <el-form ref="form1" :rules="rules" :model="form1">
                  <el-form-item
                      prop="username">
                      <el-input class="full-width reset-box" placeholder="请输入手机号/邮箱" v-model="form1.username">
                          <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
                      </el-input>
                       <div class="el-form-item__error" v-show="form1.username && !check_account">账号不存在</div>
                  </el-form-item>
                  <el-form-item prop="verifyCode">
                     <e-img-code ref="imgCode" :params="{type: 1}" v-model="form1.verifyCode" :img-key.sync="form1.codeKey"/>
                     <div class="el-form-item__error" v-show="!checkImgcode && form1.verifyCode">验证码错误</div>
                  </el-form-item>
              </el-form>
              <el-button class="full-width reset-box" type="primary" @click="next('form1')">下一步</el-button>
          </div> 
        </div>
        <!--养好验证方式-->
        <div v-if="step==2" class="lsteps container">
              <p class="tips">您正在为账户 <span class="user">{{ username}}</span> 找回密码，请选择身份验证方式：</p>
              <el-row v-for="(item,index) in typeList" :key="index" class="type-item">
                  <el-col :span="3">
                      <img v-bind:src="item.imgUrl">
                  </el-col>
                  <el-col :span="17">
                      <p class="title">{{item.title}}</p>
                      <p class="content-tips">{{item.content}}</p>
                  </el-col>
                  <el-col :span="4">
                      <el-button class="verify-btn" type="primary" :disabled="!item.type" @click="selectCheckType(3)">立即验证</el-button>
                  </el-col>
              </el-row>
        </div>
        <div v-if="step>=3" class="container last-step">
          <h3 class="register_stepbox">
              <ul class="step_container">
              <li class="menu_step" v-for="item in steps" v-bind:class="{active:step>=item.value,current:step==item.value}" :key="item.value">
                  <span class="number">{{item.id}}</span>
                  <span class="text">{{item.label}}</span>
              </li>
              </ul>
          </h3>
          <div class="content-box" >
              <!--验证身份-->
              <div v-if="step==3">
                  <p class="tips" v-show="isPhone">你的手机号：{{form1.username}}</p>
                  <p class="tips" v-show="isEmail">你的邮箱：{{form1.username}}</p>
                  <el-form ref="form2" :model="form2" class="verify-form" :rules="rules">
                      <el-form-item prop="verifyCode">
                          <e-sms-code v-model="form2.verifyCode"  :params="{account: form1.username, type: 4, extisted: true}"/>
                          <div class="el-form-item__error" v-show="!checkUserCode && form2.verifyCode">验证码错误</div>
                      </el-form-item>
                      <el-button type="primary" class="full-width reset-box" @click="checkIdentity('form2')">下一步</el-button>
                      <!--<p class="link choose" @click="selectCheckType(2)">重新选择验证方式</p>-->
                  </el-form>
              </div>
              <!--设置密码-->
              <div v-show="step==4">
                  <el-form ref="form3" :model="form3" :rules="rules2">
                      <label class="title">设置密码</label>
                      <el-form-item prop="password">
                          <e-password v-model="form3.password" />
                          <p class="small tip">长度为6~16个字符，可由英文（区分大小写）、数字和下划线组成。</p>
                      </el-form-item>
                      <el-form-item prop="rePassword">
                          <e-password :handlePlace="'请再次输入密码'"  v-model="form3.rePassword" />
                      </el-form-item>
                  </el-form>
                  <el-button type="primary" class="full-width reset-box" @click="setPassword()">下一步</el-button>
              </div>
              <!--结果-->
              <div v-if="step==5" class="end">
                  <div v-if="isSuccess" class="success">
                      <div class="clearfix">
                        <i class="iconfont icon icon-large icon-icon11-copy"></i>
                        <div class="text">
                            <h1>密码修改成功！</h1>
                            <p>请您使用更改后的密码重新登录球苗账户</p>
                        </div>
                      </div>
                      <div class="reset-space"></div>
                      <nuxt-link to="/member/login"><el-button type="primary" class="login-btn submit">登录</el-button></nuxt-link>
                  </div>
                  <div v-else class="error">
                      <div class="clearfix">
                          <i class="icon icon-large icon-error"></i>
                          <div class="text">
                              <h1>抱歉，密码修改失败！</h1>
                              <p class="small">请检查一下网络是否有问题，点击下面的按钮重新提交</p>
                          </div>
                      </div>
                      <el-button type="danger" class="submit" @click="setPassword()">重新提交</el-button>
                  </div>
              </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import userApi from 'api/user'
  import validator from 'utils/validator'
  import EImgCode from '@e-ui/ImgCode'
  import ESmsCode from '@e-ui/SmsCode'
  import EPassword from '@e-ui/Password'
  export default {
    components: {
      EImgCode,
      ESmsCode,
      EPassword
    },
    computed: {
      isEmail () {
        return validator.pattern.email.test(this.form1.username)
      },
      isPhone () {
        return validator.pattern.mobile.test(this.form1.username)
      },
      username () {
        let u = this.form1.username
        u = u.substr(0, 3) + '****' + u.substr(u.length - 3, u.length)
        return u
      },
      ...mapState({
        check_account: state => state.user.check_account
      })
    },
    data () {
      let self = this
      return {
        accountSuccess: false,
        checkUserCode: true,
        checkImgcode: true,
        hover: false,
        sent: false, // 验证码是否发送
        step: 1,
        isSuccess: true,
        form1: {
          username: '',
          verifyCode: '',
          codeKey: '',
          key: ''
        },
        form2: {
          verifyCode: ''
        },
        form3: {
          password: '',
          rePassword: ''
        },
        typeList: [
          {
            title: '通过 邮箱验证码',
            imgUrl: '/images/login/email.png',
            content: '如果你的邮箱还在使用，请选择此方式',
            type: true
          },
          {
            title: '通过 手机验证码',
            imgUrl: '/images/login/phone.png',
            content: '如果你的手机还在正常使用，请选择此方式',
            type: true
          }
          // {
          //   title: '通过 安全问题验证',
          //   imgUrl: '/static/images/login/safe.png',
          //   content: '如果你设置过安全问题，请选择此方式',
          //   type: 5
          // }
        ],
        steps: [
          {id: 1, value: 3, label: '验证身份'},
          {id: 2, value: 4, label: '修改密码'},
          {id: 3, value: 5, label: '修改完成'}
        ],
        rules: {
          username: [
            {
              validator (rule, value, callback) {
                self.accountSuccess = false
                if (!value.trim()) {
                  callback(new Error('账号不能为空'))
                } else if (!validator.pattern.email.test(value) && !validator.pattern.phone.test(value)) {
                  callback(new Error('请输入正确的邮箱或者手机号'))
                } else {
                  userApi.checkAccount({account: value, extisted: true}).then((res) => {
                    if (!res.data) {
                      callback(new Error('账号不存在'))
                    } else {
                      self.accountSuccess = true
                      callback()
                    }
                  })
                }
              },
              trigger: 'blur'
            }
          ],
          verifyCode: [
            {required: true, message: '验证码不能为空'}
          ]
        },
        rules2: {
          password: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'blur'},
            validator.rule.isPassword
          ],
          rePassword: [
            {required: true, message: '请再次输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (this.form3.password !== this.form3.rePassword) {
                  callback(new Error('两次输入的密码不一致'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 第一步，账号填写
      next (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.typeList[0].type = this.isEmail
            this.typeList[1].type = this.isPhone
            userApi.forgrtPassword({
              account: this.form1.username,
              pictureValidateCode: this.form1.verifyCode,
              randomKey: this.form1.codeKey
            }).then((res) => {
              this.checkImgcode = true
              this.step++
            }).catch((res) => {
              // result = 2 验证码错误
              if (res.result === '2') {
                this.checkImgcode = false
                this.form1.key = Math.random()
              }
              this.$refs.imgCode.refresh()
            })
          } else {
            return false
          }
        })
      },
      // 第三步，身份验证
      checkIdentity (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userApi.checkAccountNumber({
              account: this.form1.username,
              validateCode: this.form2.verifyCode,
              type: 4
            }).then((res) => {
              this.checkUserCode = true
              if (this.checkUserCode) {
                this.step++
              }
            }).catch(() => {
              this.checkUserCode = false
            })
          }
        })
      },
      // 第四步，设置密码
      setPassword () {
        this.$refs['form3'].validate((valid) => {
          if (valid) {
            userApi.resetPassword({
              account: this.form1.username,
              password: this.form3.password,
              validateCode: this.form2.verifyCode
            }).then((res) => {
              if (res.result === '0') {
                this.isSuccess = true
              }
            }).catch((res) => {
              this.isSuccess = false
            })
            this.step = 5
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 验证账号是否存在
      ckeckAccount () {
        if (this.form1.username && (this.isEmail || this.isPhone)) {
          this.$store.dispatch('user/check_account', {account: this.form1.username, extisted: true})
        }
      },
      // 选择验证方式
      selectCheckType (typeId) {
        this.step = typeId
      }
    }
  }
</script>

<style lang="scss">

.container{
    width: 800px;
    background: #fff;
    margin: 91px auto;
    box-sizing:border-box;
    min-height:500px;
}
.reg-container{    
    padding:80px 226px 50px;
    .tip{
        color:$color-warning;
        font-size: 12px;
        margin-bottom: 15px;
    }
    .rdm-code{
        text-align: right;
    }
      
}
.login-container{
  .lsteps{
      padding:60px;  
      .tips{
          font-size: 20px;
          color:#333;
          margin-bottom: 70px;
          .user{
            color:$color-warning;
          }  
      }
      .type-item{
          margin-bottom: 50px;
          .title{
              font-size: 18px;
              color:#333;
              margin: 10px 0 15px;
          }
          .content-tips{
              color:$color-sub;
          }
          .verify-btn{
              padding:12px 24px;
              margin-top:7px; 
          }
      }   
  }
}

.last-step{  
    .register_stepbox{
        border-bottom: 2px solid #f2f2f2;
        .step_container{
            width: 610px;
            margin: 0 auto;
            .menu_step{
                display: inline-block;
                vertical-align: middle;
                padding: 10px 20px;
                margin: 0 14px;
                margin-bottom: -2px;
                font-size: 18px;
                font-weight:normal;
                .number{
                    color:#fff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #bbb;
                    font-size: 12px;
                    display: inline-block;
                    text-align: center;
                    line-height: 20px;
                    vertical-align:middle;
                    margin-right: 10px;
                }
                .text{
                    color:#bbb;
                }
                &.active{
                    color: $color-primary;
                    .number{
                       background-color:$color-primary;
                    }
                    .text{
                        color:$color-primary;
                    }
                }
                &.current{
                    border-bottom: 2px solid $color-primary;
                }
            }
        }
    }
    .verify-form{
        .choose{text-align: center;}
    }
    .content-box{
        width: 368px;
        margin: 70px auto 0;
        .title{
            margin-bottom: 15px;
            display: block;
            color: $color-sub;
        }
        .tips{
            font-size: 16px;
            margin-bottom: 30px;
        }
        .link{        
            margin-top:20px;
        }
        .small{
            width:110%;
        }
        .icon{
            width: 70px;
            display: inline-block;
            background-size: contain;
            background-position:left center;
            &.icon-xs{
                width:40px;
                height: 40px;
            }
        }
        .tip{
            color:$color-sub;
        }
    }
    .to-email{
        cursor: pointer;
    }
    .end{
        padding: 60px 0;
        .icon{
            display: inline-block;
            margin-right: 20px;
            vertical-align: middle;
        }
        .success{
            text-align: center;
        }
        .error{
            text-align: center;
            h1{
                color:$color-error;
            }
        }
        .submit{
            width: 100px;
            margin-top: 30px;
        }

        .text{
            display: inline-block;
            vertical-align: middle;
            text-align: left;
            h1{
                font-size: 28px;
                margin: 5px 0 10px;
            }
            p{
                color:$color-sub;
            }
        }
    }
}
.popover {
  padding:7px 10px;  
  text-align: left;
  position: absolute;
  top: 111px;
  left: 49px;
  z-index: 1060;
  width: 410px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.42857143;
  white-space: normal;
  background-color: #fff9ef;
  background-clip: padding-box;
  border: 1px solid #f1e784;
  border-radius: 3px;
  color:$color-warning;
  & > .arrow {
    border-width: 11px;
    &:after {
      content: "";
      border-width: 10px;
    }
  }
  &.bottom {
    & > .arrow {
      top: -11px;
      left: 10%;
      margin-left: -11px;
      border-top-width: 0;
      border-bottom-color: #f1e784;
      &:after {
        top: 1px;
        margin-left: -10px;
        content: " ";
        border-top-width: 0;
        border-bottom-color: #fff;
      }
    }
  }
}
.popover>.arrow,.popover>.arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.el-form-item__content>.el-input.reset-box,.el-button--primary.reset-box{
  width:100%;
}
.reset-space{
  clear:both;
}
.icon-icon11-copy{
  font-size:70px;
  color: $color-primary
}
</style>
