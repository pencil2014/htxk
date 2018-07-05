<template>
  <cellbox class="img-code" :gutter="10" :class="inline?'img-code-inline':''">
    <cell-item>
      <el-input v-bind="$props" v-on="$listeners">
        <template slot="prepend"><i class="iconfont">&#xe676;</i></template>
      </el-input>
    </cell-item>
    <cell-item v-loading="loading">
      <img v-if="src" alt="图片验证码" :src="src" @click="refresh" title="看不清楚？点击换一张"/>
      <span v-else>&nbsp;</span>
    </cell-item>
  </cellbox>
</template>

<script>
  import { Input } from 'element'
  import fetch from 'fetch'
  export default {
    props: {
      ...Input.props,
      placeholder: {
        type: String,
        default: '请输入图片验证码'
      },
      maxlength: {
        type: Number,
        default: 4
      },
      imgKey: {
        type: String,
        default: ''
      },
      inline: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.refresh()
    },
    data () {
      return {
        src: '',
        loading: false
      }
    },
    methods: {
      refresh () {
        this.loading = true
        this.fetch().then((res) => {
          setTimeout(() => {
            this.src = res.data.image
            this.$emit('update:imgKey', res.data.key)
            this.loading = false
          }, 400)
        }).catch(() => {
          this.loading = false
        })
      },
      fetch () {
        let options = {
          url: this.$attrs.action || this.getDefaultAction(),
          params: Object.assign({
            width: 120,
            height: 40,
            type: 1,
            time: new Date().getTime()
          }, this.$attrs.params)
        }
        return fetch(options)
      },
      getDefaultAction () {
        if (this.$root && this.$root.nuxt) { // 主站
          return '/account/validate/generatePictureValidateCode'
        }
        return '/guest/generateImgValidateCode'
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/var.scss';
  div.img-code{
    img{
      cursor: pointer;
      vertical-align: top;
      height:40px;
      display: block;
    }
    .cell-item:last-child{
      width:120px;
    }
    &-inline{
      display:inline-block;
      width:290px;
    }
    .el-loading-spinner .circular{
      width:24px;
      height:24px;
      margin-top: 8px;
    }
  }
</style>
