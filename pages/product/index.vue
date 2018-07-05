<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="banner">
      <img src="~static/images/list_banner.jpg" width="100%" alt="">
    </div>
    <div class="content goods-list">
      <list />
    </div>
  </div>
</template>
<style lang="scss">
  @import '~styles/var';
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
    layout: 'primary',
    components: {
      List
    },
    async fetch (context) {
      if (!context.popStateEvent) {
        let paramsData = {rows: context.query.rows || 15}
        if (context.query.goodsCategoryCode === null || context.query.goodsCategoryCode === undefined) {
          paramsData.goodsCategoryCode = 'V00'
        }
        let dataGoods = await fetch({
          context,
          url: '/goods/listByCondition',
          params: Object.assign(context.query, paramsData)
        })
        context.store.commit('goods/LIST', dataGoods.data)
      }
    },
    methods: {
      handleTabs () {
        this.$router.push({path: '/product', query: {goodsCategoryCode: this.goodsCategoryCode, page: 1}})
      }
    }
  }
</script>
