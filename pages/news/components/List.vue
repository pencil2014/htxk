<template>
  <div class="news-list">
    <el-tabs v-model="activeName" @tab-click="changeTab">
      <el-tab-pane  
        v-for='(item, index) in cates' 
        :label="item.cateName" 
        :name="String(item.cateId)" 
        :key='index' >
      </el-tab-pane>
    </el-tabs>
    <div v-if='newList && newList.list && newList.list.length > 0'>
      <news-item v-for='(item, index) in newList.list' :key="index" :item='item' ></news-item >
    </div>


    <el-pagination
      v-bind="getPaginationProps(paginationData)"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { pagingList } from 'utils/mixins'
import NewsItem from '../components/NewsItem.vue'
import ElPagination from '@element-ui/Pagination'
import { mapGetters } from 'vuex'

export default {
  mixins: [pagingList],
  components: {
    NewsItem,
    ElPagination
  },
  computed: {
    ...mapGetters({
      cates: 'news/cates',
      newList: 'news/list'
    }),
    activeName: {
      get () {
        return this.$route.query.cateId || '0'
      },
      set (value) {
      }
    },
    paginationData () {
      return this.newList
    }
  },
  // mounted () {
  //   this.paginationData = this.newList
  // },
  data () {
    return {
      // activeName: '0',
      query: this.getQuery({
        page: this.$route.query.page,
        rows: this.$route.query.rows || 15,
        cateId: this.$route.query.cateId
      }),
      data: {},
      // paginationData: null,
      tabName: '',
      circleFeedType: {
        all: 1, // 1、全部帖子
        new: 2, // 2、最新回复
        cream: 3 // 3、精华帖
      }
    }
  },
  methods: {
    changeTab (tab) {
      let tabName = tab.name
      if (this.query.cateId !== tabName) { // 切换到 其他分类，才加载请求新的分类
        this.query.cateId = tabName
        this.query.page = 1
        this.submit()
      }
    }
  }
}
</script>

<style lang="scss">
.news-list{
  .el-tabs__item{
    font-size:16px;
  }
}
</style>
