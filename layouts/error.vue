<template>
  <no-ssr>
   <div class="error" :style="`background-image:url(${image})`">
      <!--<h4>{{error.statusCode ||404}}错误</h4>-->
      <div>
        页面跳转失败，检查您的网络是否正常连接<br/>
        您可以访问: <a class="link" href="/">首页</a>
      </div>
      <pre style="display:none">
        {{error}}
      </pre>
    </div>
  </no-ssr>
</template>

<script>
import image from 'static/images/error_default.png'
export default {
  props: ['error'],
  data () {
    return {
      image
    }
  }
}
</script>

<style lang="scss" scoped>
  .error{
    background:no-repeat center 20px;
    padding: 260px 0 100px 0;
    text-align: center;
    h4{
      font-size: 30px;
      opacity: 0.8;
    }
    div{
      margin:15px 0;
      color:$color-sub;
      font-size:16px;
    }
    pre{
      white-space: pre-wrap
    }
  }
</style>
