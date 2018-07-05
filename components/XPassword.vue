<template>
  <div>
    <el-input v-bind="$props" v-on="$listeners" :type="myType">
      <template slot="prepend"><i class="iconfont">&#xe633;</i></template>
      <div slot="append" @click="handleEye" class="eye">
        <i class="iconfont" v-if="myType=='password'">&#xe60b;</i>
        <i class="iconfont" v-else>&#xe622;</i>
      </div>
    </el-input>
  </div>
  
</template>
<script>
  import {Input} from 'element'
  let props = Object.assign({}, Input.props)
  // delete props.type
  export default {
    props: {
      ...props,
      placeholder: {
        type: String,
        default: '请输入密码'
      },
      type: {
        type: String,
        default: 'password'
      }
    },
    data () {
      return {
        myType: this.type || 'password'
      }
    },
    methods: {
      handleEye () {
        this.myType = this.myType === 'password' ? 'text' : 'password'
      }
    }

  }
</script>
<style lang="scss" scoped>
  .eye{
    cursor:pointer;
  }
</style>
