<template>
    <el-form :model="user" :rules="rules" ref="form">
        <el-form-item :class="['relative',{'is-error': false}]" prop="nickName" :rules="[{required: true, message: '昵称不能为空'}]">
            <el-input class="full-width" placeholder="请输入账号昵称" v-model="user.nickName">
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
            </el-input>
        </el-form-item>
        <el-form-item class="pwd relative" prop="password" :rules="[{required: true, message: '密码不能为空'},validator.rule.isPassword]">
          <el-input type="password" class="full-width" placeholder="请输入密码" v-model="user.password">
              <template slot="prepend"><i class="iconfont">&#xe633;</i></template>
          </el-input>
          <p class="regex">长度为6~16个字符，可由英文（区分大小写）、数字和下划线组成。</p>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input type="password" class="full-width" placeholder="请再次输入密码" v-model="user.confirmPassword">
              <template slot="prepend"><i class="iconfont">&#xe633;</i></template>
          </el-input>
        </el-form-item>
        <el-form-item class="relative">
            <el-input class="full-width" placeholder="请输入姓名" v-model="user.userName">
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
            </el-input>
        </el-form-item>
        <el-form-item class="relative">
            <el-input class="full-width" placeholder="请输入联系邮箱" v-model="user.email">
                <template slot="prepend"><i class="iconfont">&#xe605;</i></template>
            </el-input>
        </el-form-item>
        <el-button class="full-width next-step" type="primary" size="large" @click="submitInformation('form')" :loading="loading">确认激活</el-button>
    </el-form>
</template>

<script>
  import validator from 'utils/validator'
  import indexApi from 'api'
  export default {
    created () {
      this.$emit('input', this.step)
    },
    data () {
      return {
        validator,
        loading: false,
        step: 2,
        user: {
          nickName: '',
          password: '',
          confirmPassword: '',
          userName: '',
          email: ''
        },
        rules: {
          confirmPassword: [
            {required: true, message: '请再次输入密码'},
            {
              validator: (rule, value, callback) => {
                if (this.user.password !== this.user.confirmPassword) {
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
      submitInformation (formName) {
        this.$refs[formName].validate((valid) => {
          if (this.user.email && !validator.rule.email.pattern.test(this.user.email)) {
            this.$message({
              showClose: true,
              message: validator.rule.email.message,
              type: 'error'
            })
            return false
          }
          if (valid) {
            indexApi.activate({
              loginPwd: this.user.password,
              nickName: this.user.nickName,
              contactWayEmail: this.user.email,
              userName: this.user.nickName,
              randomKey: this.$route.query.key
            }, {
              context: this
            }).then((res) => {
              this.$router.push({path: '/active/result', query: {isSuccess: true}})
            }).catch((ERR) => {
              this.$router.push({path: '/active/result', query: {isSuccess: false}})
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss"></style>
