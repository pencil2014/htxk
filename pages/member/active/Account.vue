<template>
    <el-form :model="user" :rules="rules" ref="form">
        <el-form-item :class="['relative',{'is-error': false}]" prop="username" :rules="[{required: true, message: '账号不能为空'},validator.rule.isPhone]">
            <el-input class="full-width" placeholder="请输入手机号" v-model="user.username">
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
            </el-input>
        </el-form-item>
        <el-form-item :class="['relative']" prop="imgCode">
            <el-row>
                <el-col :span="14">
                    <el-input placeholder="请输入图片验证码" v-model="user.imgCode" :maxlength="4">
                        <template slot="prepend"><i class="iconfont">&#xe676;</i></template>
                    </el-input>
                </el-col>
                <el-col :span="10" class="rdm-code">
                    <e-img-code :codetype="5" v-model="user.codeKey" :key="user.key"></e-img-code>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item :class="['relative']" prop="verifyCode">
            <el-row>
                    <el-input placeholder="请输入激活码" v-model="user.verifyCode" :maxlength="6">
                        <template slot="prepend"><i class="iconfont">&#xe600;</i></template>
                    </el-input>
            </el-row>
        </el-form-item>
        <el-button class="full-width next-step" type="primary" size="large" @click="handleSubmit('form')">下一步</el-button>
        <div class="have-accout">
            <p>已有账号，
                <router-link :to="'/login'"><a class="link">立即登录</a></router-link>
            </p>
        </div>
    </el-form>
</template>

<script>
  import indexApi from 'api'
  import validator from 'utils/validator'
  import EImgCode from '@e-ui/ImgCode'
  export default {
    components: {
      EImgCode
    },
    created () {
      this.$emit('input', this.step)
    },
    computed: {},
    data () {
      return {
        step: 1,
        validator,
        hover: false,
        rules: {
          imgCode: [
            {required: true, message: '请输入图片验证码'}
          ],
          verifyCode: [
            {required: true, message: '请输入激活码'}
          ]
        },
        sent: false,
        user: {
          username: '',
          imgCode: '',
          codeKey: '',
          verifyCode: '',
          key: ''
        }
      }
    },
    methods: {
      handleSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            indexApi.verification({
              phone: this.user.username,
              code: this.user.verifyCode,
              validCode: this.user.imgCode,
              randomKey: this.user.codeKey
            }, {errorMsg: 'none'}).then((res) => {
              this.$router.push({path: '/active/information', query: {key: this.user.codeKey}})
            }).catch((ERR) => {
              if (ERR.result === '2') {
                this.user.key = Math.random()
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
.have-accout{
  text-align: center;
}
</style>
