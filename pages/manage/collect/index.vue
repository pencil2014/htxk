<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content collect-goods">
            <e-heading grade="1">收藏商品</e-heading>
             <div v-if="collectGoodsList.list && collectGoodsList.list.length>0">
                <el-row :gutter="20">
                  <el-col v-for="(item,index) in collectGoodsList.list" class="el-col-4_8" :key="index">
                    <collect-goods-item :item='item' />
                  </el-col>
                </el-row>
                <el-pagination
                    v-bind="getPaginationProps(collectGoodsList)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    >
                </el-pagination>
              </div>
              <e-placeholder v-else text="暂无数据"/>
        </div>
  </div>
</template>
<script type="text/javascript">
import fetch from 'fetch'
import { pagingList } from 'utils/mixins'
import collectGoodsItem from '../../components/collectGoodsItem'
import ElPagination from '@element-ui/Pagination'
export default {
  layout: 'manage',
  mixins: [pagingList],
  components: {
    collectGoodsItem,
    ElPagination
  },
  data () {
    return {
      query: this.getQuery({favoriteType: '3'}),
      collectGoodsList: ''
    }
  },
  methods: {
    // 获取收藏商品列表
    getCollectListData (query) {
      fetch({url: '/manage/user/userFavoriteList', params: query})
        .then((response) => {
          this.collectGoodsList = response.data
        })
    }
  },
  mounted () {
    this.getCollectListData(this.query)
  }
}
</script>
<style type="text/css" lang="scss">
  
  .sort-box{
    label{
      display:inline-block;
      vertical-align:middle;
      font-size:12px;
      margin-right:20px;
    }
    .total{
      float:right;
      width:400px;
      text-align:right;
      font-size:12px;
      span{
        color: $color-primary;
      }
    }
    font-size:0;
    height: 35px;
    line-height: 35px;
    padding:0 20px;
    background: #f5f5f5;
    .sort-ul{
      display:inline-block;
      vertical-align:middle;
      font-size:12px;
      li{
        float:left;
        margin:0 16px;
        cursor:pointer;
      }
    }
  }
</style>