<template>
  <div class="sms-code" :class="inline?'sms-code-inline':''">
    <e-cellbox :gutter="10">
      <e-cell-item>
        <el-input v-bind="$props" v-on="$listeners">
          <template slot="prepend"><i class="iconfont">&#xe600;</i></template>
        </el-input>
      </e-cell-item>
      <e-cell-item>
        <el-button :disabled="btnDisabled || counter > 0" @click="handle" :loading="loading">
          {{counter > 0 ? `重新发送(${counter})` : '获取验证码'}}
        </el-button>
      </e-cell-item>
    </e-cellbox>
    <div v-if="isSend" class="sms-code-help small weak">验证码已发送，15分钟内输入有效。</div>
  </div>
</template>

<script>
  import { Input } from '@element-ui'
  import fetch from 'fetch'
  export default {
    props: {
      ...Input.props,
      placeholder: {
        type: String,
        default: '请输入验证码'
      },
      maxlength: {
        type: Number,
        default: 6
      },
      btnDisabled: {
        type: Boolean,
        default: false
      },
      inline: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        default: 60000
      }
    },
    data () {
      return {
        loading: false,
        isSend: false,
        counter: 0
      }
    },
    methods: {
      handle () {
        this.fetch().then((res) => {
          if (res.result === '0') {
            this.isSend = true
            this.counter = this.duration / 1000
            this.$interval = setInterval(() => {
              this.counter = this.counter - 1
            }, 1000)
          }
        })
      },
      fetch () {
        let options = {
          url: this.$attrs.action || this.getDefaultAction(),
          params: Object.assign({randomKey: '', validateCode: ''}, this.$attrs.params),
          options: {context: this}
        }
        return fetch(options)
      },
      getDefaultAction () {
        if (this.$root && this.$root.nuxt) { // 主站
          return '/account/validate/sendValidateCode'
        }
        return '/guest/sendValidateCode'
      }
    }
  }
</script>

<style lang="scss">
  
  .sms-code{
    .el-button{
      padding-left:10px;
      padding-right:10px;
      width:120px;
    }
    .cell-item:last-child{
      width:120px;
    }
    &-help{
      line-height:24px;
    }
    &-inline{
      display:inline-block;
      width:290px;
    }
  }
</style>
