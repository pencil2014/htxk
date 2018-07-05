<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="banner">
      <img src="/images/list_banner.jpg" width="100%" alt="" @loginclick="handleLogin()">
    </div>
    <div class="content goods-list">
      <list />
    </div>
  </div>
</template>
<style lang="scss">
  
  .content{
    background:#fff;
  }
  .nothing-box{
    min-height:200px;
    text-align:center;
  }
  .goods-list{
    margin-bottom:50px;
  }
</style>
<script type="text/javascript">
  import List from './components/List'
  import fetch from 'fetch'
  export default {
    watchQuery: true,
    layout: 'primary',
    components: {
      List
    },
    // head () {
    //   return {
    //     title: '求苗 - 服务列表'
    //   }
    // },
    async fetch (context) {
      if (context.query && context.query.goodsCode && context.query.goodsCode.length > 10) {
        context.redirect('/goods/detail/' + context.query.goodsCode)
        return
      }
      let paramsData = {rows: context.query.rows || 15}
      if (context.params.type === null || context.params.type === undefined) {
        paramsData.goodsCategoryCode = 'V00'
      } if (context.params.type === 'match') {
        paramsData.goodsCategoryCode = 'V11'
      } else if (context.params.type === 'train') {
        paramsData.goodsCategoryCode = 'V12'
      } else if (context.params.type === 'ticket') {
        paramsData.goodsCategoryCode = 'V18'
      } else {
        paramsData.goodsCategoryCode = 'V00'
      }
      let dataGoods = await fetch({
        context,
        url: '/goods/listByCondition',
        params: Object.assign({}, context.query, paramsData)
      })
      context.store.commit('goods/LIST', dataGoods.data)
    },
    methods: {
      // handleTabs () {
      //   this.$router.push({path: '/goods', params: {type: this.goodsCategoryCode}, query: {page: 1}})
      // }
      handleLogin () {
        console.log('login success')
      }
    },
    mounted () {
      if (process.browser) {
        let type = this.$route.params.type
        if (type === undefined || type === '' || type === null) {
          // this.query.page = 1
          // this.query.rows = 15
          this.$router.push('/goods/all')
          return
        }
        if (type !== 'match' && type !== 'train' && type !== 'ticket' && type !== 'all' && type !== 'detail') {
          this.$router.push('/error')
        }
      }
    }
  }
</script>
