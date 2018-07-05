<template>
  <div>
    <el-tabs class="big tab-box" :active-name="goodsCategoryCode" v-model="goodsCategoryCode" @tab-click="handleTabs">
      <el-tab-pane label="全部" name="all"></el-tab-pane><!-- V00 -->
      <el-tab-pane label="赛事" name="match"></el-tab-pane><!-- V11 -->
      <el-tab-pane label="培训" name="train"></el-tab-pane><!-- V12 -->
      <el-tab-pane label="票务" name="ticket"></el-tab-pane><!-- V18 -->
    </el-tabs>
    <div class="sort-box">
      <label for="">排序：</label>
      <ul class="sort-ul">
        <li v-for="(item,index) in sortWay" :key="index" @click="haundleSort(item)">
          {{item.text}}
          <!-- <nuxt-link :to="{path:'/goods', query:query}">{{item.text}}</nuxt-link> -->
        </li>
      </ul>
      <div class="total">
        共 <span>{{goods_list.total || 0}}</span> 个商品
      </div>
    </div>
    <div v-if="goods_list.list && goods_list.list.length>0">
      <el-row :gutter="20">
        <el-col v-for="(item,index) in goods_list.list" :span-percent="20" :key="index">
          <goods-item :item='item' />
        </el-col>
      </el-row>
      <el-pagination
          v-bind="getPaginationProps(goods_list)"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          >
      </el-pagination>
    </div>
    <e-placeholder v-else text="暂无数据"/>
  </div>
</template>

<script type="text/javascript">
  import { pagingList } from 'utils/mixins'
  import { mapState } from 'vuex'
  import GoodsItem from '../../components/GoodsItem'
  import ElPagination from '@element-ui/Pagination'
  export default {
    mixins: [pagingList],
    components: {
      GoodsItem,
      ElPagination
    },
    data () {
      return {
        query: this.getQuery(),
        urlType: this.$parent.$route.params.type,
        goodsCategoryCode: this.$parent.$route.params.type || 'all',
        sortWay: [
          {id: 'date', text: '最新'},
          {id: 'sales', text: '销量'},
          {id: 'hot', text: '人气'}
        ]
      }
    },
    computed: {
      ...mapState({
        goods_list: state => state.goods.list
      }),
      headTitle () {
        if (this.urlType === 'match') {
          return '体育赛事_赛事报名_赛事发布_求苗体育赛事服务平台'
        } else if (this.urlType === 'train') {
          return '体育培训_培训报名_体育教育_求苗体育培训服务平台'
        } else if (this.urlType === 'ticket') {
          return '求苗票务_体育赛事门票预订_求苗体育票务服务平台'
        } else {
          return '求苗_体育赛事_体育门票_体育培训_体育赞助_体育消费服务平台'
        }
      },
      handleKeyword () {
        if (this.urlType === 'match') {
          return '体育比赛,足球赛事,篮球赛事,羽毛球赛事,网球赛事,马拉松比赛,体育运动'
        } else if (this.urlType === 'train') {
          return '体育训练,体育教育,篮球培训,羽毛球培训,足球培训,网球培训,乒乓球培训,青训'
        } else if (this.urlType === 'ticket') {
          return '体育门票,体育比赛门票,nba门票'
        } else {
          return '体育,求苗,体育赛事,体育培训,体育门票,体育报名,体育资讯,体育视频'
        }
      },
      handleDesc () {
        if (this.urlType === 'match') {
          return '求苗体育赛事频道为球迷们提供热门的体育赛事报名和体育IP推荐服务。'
        } else if (this.urlType === 'train') {
          return '求苗体育培训频道提供最全最专业的体育培训课程报名与订制淘宝式服务，为体育爱好者开展篮球培训,足球培训,网球培训,羽毛球培训,乒乓球培训，健身教练培训，青训，击剑培训等培训项目。'
        } else if (this.urlType === 'ticket') {
          return '求苗票务频道为您提供全国体育赛事门票网上预订、体育比赛门票在线订购服务。购票上求苗，放心又好找。'
        } else {
          return '求苗体育聚集各类体育产业IP，包含但不限于体育赛事报名、体育票务、体育培训、体育旅游、体育赞助、体育用品等各大板块，实现多种资源的聚合与互通的体育消费和资源服务互联网体育交易平台。'
        }
      }
    },
    head () {
      return {
        title: this.headTitle,
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.handleKeyword },
          { hid: 'description', name: 'description', content: this.handleDesc }
        ]
      }
    },
    methods: {
      haundleSort (item) {
        let sortValue = this.query.sortValue || 'dateDesc'
        let queryValue = ''
        if (sortValue.indexOf(item.id) > -1) {
          if (sortValue === (item.id + 'Asc')) {
            queryValue = item.id + 'Desc'
          } else {
            queryValue = item.id + 'Asc'
          }
        } else {
          queryValue = item.id + 'Desc'
        }
        this.query.sortValue = queryValue
        this.query.page = 1
        this.submit()
      },
      handleTabs (vm) {
        if (this.urlType !== vm.$props.name) {
          this.query.page = 1
          this.query.rows = 15
          this.$router.push({path: '/goods/' + (vm.$props.name || 'all')})
        }
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
  .tab-box{
    .el-tabs__header{
      height:48px;
    }
  }
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
