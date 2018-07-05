<template>
  <div class="news-list">
    <!-- <el-tabs v-model="activeName" @tab-click="changeTab">
      <el-tab-pane label="全部" name="first"></el-tab-pane>
      <el-tab-pane label="综合体育" name="second"></el-tab-pane>
      <el-tab-pane label="足球" name="third"></el-tab-pane>
      <el-tab-pane label="篮球" name="fourth"></el-tab-pane>
      <el-tab-pane label="跑步" name="five"></el-tab-pane>
      <el-tab-pane label="电竞" name="six"></el-tab-pane>
    </el-tabs> -->

    <news-item v-if='newList && newList.list && newList.list.length > 0' v-for='(item, index) in newList.list' :key="index" :item='item' />

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
      circle_feed: 'community/circle_feed',
      newList: 'news/list'
    }),
    tableData () {
      return this.circle_feed.list
    }
  },
  mounted () {
    this.paginationData = this.circle_feed
  },
  data () {
    return {
      query: this.getQuery({
        rows: this.$route.query.rows || 15,
        cateId: this.$route.query.cateId || 1
      }),
      activeName: 'first',
      data: {},
      paginationData: null,
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

<style lang="scss" scoped>
@import '~styles/var';
// .coterie-list{
//   .elite{
//     color: #fff;
//     background: #ffa95c;
//     display: inline-block;
//     padding: 0 3px;
//     margin-right: 5px;
//   }
// }
</style>

<style lang='scss'>
@import '~styles/var';
// .coterie-list{
//   .el-table tbody {
//     font-size: 14px;
//   }
//   .el-table_1_column_1:hover{
//    .post-name{
//       color:$color-primary;
//     }
//   }
//   .el-table_1_column_1 .cell{
//     padding-left: 0;
//     padding-right: 0;
//   }
// }
</style>
