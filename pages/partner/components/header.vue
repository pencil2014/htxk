<template>
  <div :class="[tpBg ==='huanqiu'?'huanqiu-bg':'people-bg', 'top-bg']">
    <div class="qiu-content header">
      <div class="logo"><a :href="href" target="_blank"><img :src="logo"  alt=""></a></div>
      <h1 :class="[tpBg ==='people'?'pTxt':'']">{{tpTxt}}</h1>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      logo: {
        type: String,
        default: null
      },
      tpTxt: {
        type: String,
        default: null
      },
      tpBg: {
        type: String,
        default: null
      },
      href: {
        type: String,
        default: null
      }
    }
  }
</script>
<style lang="scss" scoped>
.huanqiu-bg{
  background: url("/images/sports/sport_bg.png") center center no-repeat;
}
.people-bg{
  background: url("/images/sports/people_bg.png") center center no-repeat;
}
.top-bg{
  width: 100%;
  height: 550px;
  display: block;
  .header{
    text-align: left;
    padding-top: 30px;
  }
  .qiu-content{
     width: 1200px;
     margin: 0 auto;
     text-align: left
  }
  h1{
    font-size: 100px;
    color: #fff;
    padding-top: 100px;
    font-style: italic;
    text-align: center
  }
  h1.pTxt{
    font-size: 60px;
  }
}
</style>
