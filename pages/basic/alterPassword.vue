<template>
  <div class='content' >
    <div class="password-box" v-if="step==1">
      <e-heading grade="1">修改密码</e-heading>
      <div class="divider"></div>
      <p class="small alter-tips tc weak">密码由6-20位字母（区分大小写）、数字或标点符号（除空格）组成，至少包含以上2种</p>
      <el-form :model="form" :rules="rules" ref="form" class="alter-pass">
        <label class="lbl">旧密码：</label>
        <el-form-item prop="oldPassword">
          <e-password v-model="form.oldPassword" />
        </el-form-item>
        <label class="lbl">新密码：</label>
        <el-form-item prop="password">
          <e-password v-model="form.password" />
        </el-form-item>
        <label class="lbl">确认输入：</label>
        <el-form-item prop="confirmPassword">
            <e-password placeholder="'请再次输入密码'" v-model="form.confirmPassword" />
        </el-form-item>
        <el-button native-type="submit" type="primary" class="full-width sure-btn" :loading="loading">
            确定
        </el-button>
      </el-form>
    </div>
    <div class="message-box tc" v-if="step==2">
      <div class="success-icon tc">
        <i class="iconfont">&#xe91c;</i>
      </div>
      <p class="success-tips tc">修改成功， 请牢记新的登录密码</p>
      <nuxt-link to="/" class="reload sure-btn back-index">
        回到首页
      </nuxt-link>
    </div>
  </div>
</template>
<script>
  import userApi from 'api/user'
  import validator from 'utils/validator'
  import EPassword from '@e-ui/Password'
  import { form } from 'utils/mixins'
  export default {
    layout: 'manage',
    components: {
      EPassword
    },
    mixins: [
      form
    ],
    data () {
      return {
        validator,
        loading: false,
        step: 1,
        rules: {
          oldPassword: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'change'},
            validator.rule.isPassword
          ],
          confirmPassword: [
            {required: true, message: '请再次输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (this.form.password !== this.form.confirmPassword) {
                  callback(new Error('两次输入的密码不一致'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        form: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }
      }
    },
    methods: {
      submit () {
        console.log(this.form)
        userApi.alterPassword(
          {
            oldPwd: this.form.oldPassword,
            newPwd: this.form.password
          },
          {
            context: this
          }
        ).then((res) => {
          if (res.result === '0') {
            this.step = 2
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .alter-tips{
    margin-top:45px;
  }
  .alter-pass{
    width:360px;
    margin:45px auto 0;
  }
  .lbl{
    color:$color-black-base;
  }
  .regex{
    line-height:16px;
  }
  .el-form-item__content>.el-cascader, .el-form-item__content>.el-input, .el-form-item__content>.el-select,.el-button.full-width{
    width:100%;
  }
  .el-form{
    padding-bottom:20px;
  }
  .message-box{
    padding:60px 0;
    .reload{
      margin-top:40px;
    }
  }
  .success-icon i{
    font-size:100px;
    color: $color-primary;
  }
  .success-tips{
    font-size:24px;
  }
  .back-index{
    color: $color-white;
    display:inline-block;
    background:$color-primary;
    padding:9px 20px;
    min-width:100px;
    border-radius:$border-radius-base;
  }
</style>
