<template>
  <div class="sencode">
    <el-button @click="getVerifyCode()" :disabled="sent || !isDisable">{{sendText}}</el-button>
  </div>
</template>

<script>
  import userApi from 'api/user'
  export default {
    props: {
      username: String,
      type: Number,
      validateCode: String,
      randomKey: String,
      extisted: Boolean,
      isDisable: {
        type: Boolean,
        default: true
      }
    },
    computed: {},
    data () {
      return {
        upTime: 60,
        sent: false,
        sendText: '获取验证码'
      }
    },
    methods: {
      getVerifyCode () {
        if (this.username) {
          userApi.sendValidateCode({
            account: this.username,
            type: this.type,
            randomKey: this.randomKey || '',
            validateCode: this.validateCode || '',
            extisted: this.extisted || false
          }).then((res) => {
            // console.log(res)
            this.$emit('disabled')
            this.sent = true
            this.sendText = '重新发送' + '(' + this.upTime + ')'
            const upTimeInter = setInterval(() => {
              this.upTime--
              this.sendText = '重新发送' + '(' + this.upTime + ')'
              if (this.upTime === 0) {
                clearInterval(upTimeInter)
                this.sendText = '获取验证码'
                this.upTime = 60
                this.sent = false
                this.$emit('enabled')
              }
            }, 1000)
          }).catch((res) => {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
            return false
          })
        } else {
          let errMsg = ''
          if (this.$route.path.includes('/organize')) {
            errMsg = '请输入手机号'
          } else {
            errMsg = '请输入手机号/邮箱'
          }
          this.$message({
            showClose: true,
            message: errMsg,
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/var.scss';
  .el-button{
    width:125px;
    padding-left:8px;
    padding-right:8px;
  }
</style>
