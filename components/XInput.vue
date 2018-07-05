<template>
  <div :class="['x-input', 'text',{'x-input-maxlength':maxlength, 'x-input-focus': type=='textarea' && isFocus}]">
    <el-input v-bind="$props"  @change="handleChange" @focus="handleFocus" @blur="handleBlur" :validateEvent="false"/>
    <span v-if="maxlength" class="weak small"><i>{{value.length}}</i>/{{maxlength}}</span>
  </div>
</template>

<script>
  import {Input} from 'element'
  import emitter from 'utils/emitter.js'
  let props = Object.assign({}, Input.props)
  export default {
    mixins: [emitter],
    props: {
      ...props,
      validateEvent: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isFocus: false
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value).$emit('change', value)
        if (this.validateEvent) { // 触发表单校验
          this.dispatch('ElFormItem', 'el.form.change', [value])
          this.dispatch('ElFormItem', 'el.form.blur', [value])
        }
      },
      handleFocus (e) {
        this.isFocus = true
        this.$emit('focus', e)
      },
      handleBlur (e) {
        this.isFocus = false
        this.$emit('blur', e)
        if (this.validateEvent) { // 触发表单校验
          this.dispatch('ElFormItem', 'el.form.change', [e])
          this.dispatch('ElFormItem', 'el.form.blur', [e])
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/var.scss';
  
  
  .x-input{
    .el-textarea{
      padding-bottom:20px;
      border:1px solid $border-color-base;
      border-radius: 4px;
      &:hover{
        border-color:$border-color-hover;
      }
      textarea{
        background:transparent;
        resize:none;
      }
    }
    &-focus{
      .el-textarea{
        border-color: $color-primary!important;
      }
    }
    textarea{
      border:none;
    }
    &-maxlength{
      position:relative;
      .el-input__inner {
        padding-right: 50px;
      }
      .weak{
        position:absolute;
        right:10px;
        top:50%;
        margin-top:-6px;
        line-height:100%;
        i{
          font-style:normal
        }
      }
      .el-textarea+.weak{
        top: auto;
        bottom:5px;
        margin-top:0;
      }
    }
  }
  .is-error{
    .x-input{
      .el-textarea{
        border-color:red;
      }
    }
  }
</style>
