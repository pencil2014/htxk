<template>
  <!--设置昵称密码-->
  <el-form :model="form" :rules="rules" ref="form">
      <label class="lbl">设置密码</label>
      <el-form-item class="pwd relative" prop="password">
          <e-password  v-model="form.password" />
          <p class="regex">长度为6~20个字符，可由英文（区分大小写）、数字和标点符号(除空格)组成。</p>
      </el-form-item>

      <el-form-item prop="confirmPassword">
          <e-password  v-model="form.confirmPassword" placeholder="'请再次输入密码'" />
      </el-form-item>
      <label class="lbl relative">
          设置昵称(选填)
          <i class="icon icon-warn ab"
              v-on:mouseenter="hover=true"
              v-on:mouseleave="hover=false"></i>
          <div v-show="hover" class="popover bottom">
              <div class="arrow"></div>
              与球苗业务或品牌冲突等的昵称，本网站将有权收回。
          </div>
      </label>
      <el-form-item prop="nickname" :class="['relative']">
          <el-input class="full-width reset-box" v-model="form.nickname" placeholder="请输入昵称" >
          </el-input>
          <p class="regex">昵称支持中文、字母、数字、“_”、“、”、“.”的组合，4-20个字符</p>
      </el-form-item>
      <el-button type="primary" class="full-width sure-btn reset-box" :loading="loading" @click="submitForm('form')">
          确定
      </el-button>
  </el-form>
</template>

<script>
  import userApi from 'api/user'
  import validator from 'utils/validator'
  import EPassword from '@e-ui/Password'
  export default {
    components: {EPassword},
    computed: {},
    mounted () {
      // console.log(this)
    },
    data () {
      return {
        validator,
        loading: false,
        check_nickname: false,
        hover: false,
        rules: {
          password: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '长度为 6 到 20 个字符', trigger: 'blur'},
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
          ],
          nickname: [
            {required: true, message: '请输入昵称'},
            validator.rule.nickName,
            {
              validator: (rule, value, callback) => {
                userApi.checkNickname({nickname: this.form.nickname}).then((res) => {
                  if (!res.data) {
                    callback(new Error('该昵称已存在'))
                  } else {
                    callback()
                  }
                })
              },
              trigger: 'blur'
            }
          ]
        },
        form: {
          password: '',
          confirmPassword: '',
          nickname: ''
        }
      }
    },
    methods: {
      submitForm (formName) {
        let userName = this.$route.query.id
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userApi.setPasswordAndNickname(
              {
                account: userName,
                password: this.form.password,
                nickname: this.form.nickname,
                stepCheckCode: this.$route.query.code
              },
              {
                context: this
              }
            ).then((res) => {
              // 是否邮箱，是跳转绑定手机，否注册结果页
              if (validator.rule.email.pattern.test(userName)) {
                this.$router.push({path: '/member/register/bind', query: {userName: userName, success: true, userId: res.data.userId, code: res.data.stepCheckCode}})
              } else {
                this.$router.push({path: '/member/register/result', query: {userName: userName, success: true}})
              }
            }).catch((res) => {
              this.$router.push({path: '/member/register/result', query: {userName: userName, success: false}})
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

.lbl{
  color:$color-black-base;
}
.regex{
  font-size:12px;
  color:$color-sub;
  line-height:16px;
}
.el-form-item__content>.el-cascader, .el-form-item__content>.el-input, .el-form-item__content>.el-select,.el-button.full-width{
  width:100%;
}
.el-form{
  padding-bottom:20px;
}
.full-width .el-input__inner{
  display:block;
}
</style>
