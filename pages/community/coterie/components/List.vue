<template>
  <div class="coterie-list">
    <div class="thead">
      <div class="tr">
        <div class="td select-box">
          <span @click='changeTab(circleFeedType.all)' class="select" 
            :class="{'actived':query.type == circleFeedType.all}">
            全部帖子
          </span>
          <span @click='changeTab(circleFeedType.new)' class="select" 
            :class="{'actived':query.type == circleFeedType.new}">
            最新回复
          </span>
          <span @click='changeTab(circleFeedType.cream)' class="select" 
            :class="{'actived':query.type == circleFeedType.cream}">
            精华
          </span>
        </div>
        <div class="td">作者/发布时间</div>
        <div class="td">回复/浏览</div>
        <div class="td">最后回复</div>
      </div>
    </div>

    <el-table
      :data="tableData"
      :show-header='false'
      empty-text='暂无帖子'
      style="width: 100%">

      <el-table-column
        label="全部帖子"
        :show-overflow-tooltip="true"
      >
        <template scope="scope" >
          <nuxt-link :to='"/community/detail/"+ scope.row.feedId'  target="_blank"  >
            <span v-if='scope.row.isEssence && query.type != circleFeedType.cream' class="elite">精华</span>
            <span>{{scope.row.title}}</span>
          </nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        label="作者/发布时间"
        align='center'
        width="170"
        :show-overflow-tooltip="true"
        >
        <template scope="scope">
          <div>{{scope.row.nickName}}</div>
          <div class="weak small">{{scope.row.publishTime | formatTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="回复/浏览"
        align='center'
        width="100"
        :show-overflow-tooltip="true"
      >
        <template scope="scope">
          <div>{{scope.row.commentCount}}</div>
          <div class="weak small">{{scope.row.clickCount}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="最后"
        align='center'
        width="110"
        :show-overflow-tooltip="true"
      >
        <template scope="scope">
          <div>{{scope.row.lastCommentUser}}</div>
          <div class="weak small">{{scope.row.lastCommentTime | formatTime}}</div>
        </template>
      </el-table-column>
    </el-table>

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
import ElPagination from 'element/Pagination'
import ElTable from 'element/Table'
import ElTableColumn from 'element/TableColumn'
import { mapGetters } from 'vuex'

export default {
  mixins: [pagingList],
  components: {
    ElPagination,
    ElTable,
    ElTableColumn
  },
  computed: {
    ...mapGetters({
      circle_feed: 'community/circle_feed'
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
        type: this.$route.query.type || 1
      }),
      data: {},
      paginationData: null,
      circleFeedType: {
        all: 1, // 1、全部帖子
        new: 2, // 2、最新回复
        cream: 3 // 3、精华帖
      }
    }
  },
  methods: {
    fetch () {
      this.data = {}
    },
    changeTab (circleFeedType) {
      if (this.query.type !== circleFeedType) { // 切换到 其他分类，才加载请求新的分类
        this.query.type = circleFeedType
        this.query.page = 1
        this.$router.push({path: this.$route.path, query: this.query})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/var';
.coterie-list{
  .thead{
    background: #f6f6f6;
    height: 42px;
    line-height:42px;
    border-bottom:1px solid #efefef;
    .tr{
      .td{
        display: inline-block;
        text-align: center;
        &:nth-child(1){
          width: 570px;
        }
        &:nth-child(2){
          width: 170px;
        }
        &:nth-child(3){
          width: 100px;
        }
        &:nth-child(4){
          width: 110px;
        }
      }
      .select-box{
        text-align: left;
        .select{
          transition: color 0.08s ease-out;
          display: inline-block;
          padding:0 30px;
        }
        .actived{
          color: $color-primary;
        }
      }
    }
  }
  .elite{
    color: #fff;
    background: #ffa95c;
    display: inline-block;
    padding: 0 3px;
    margin-right: 5px;
  }
}
</style>

<style lang='scss'>
.coterie-list{
  .el-table tbody {
    font-size: 14px;
  }
  .el-table_1_column_1 .cell{
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
