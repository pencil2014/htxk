<template>
  <div class="wrapper error" :style="`background-image:url(${image})`">
    <!--<h4>{{$route.query.status ||404}}错误</h4>-->
    <div>
      很抱歉，您查看的页面找不到了！<br/>
      您可以访问: <a class="link" href="/">首页</a>
    </div>
    <pre style="display:none">
      {{$route.query}}
    </pre>
  </div>
</template>
<script>
  export default{
    layout: 'primary',
    mounted () {
      console.log(this.$route.query)
    },
    data () {
      return {
        image: '/images/error_default.png'
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
