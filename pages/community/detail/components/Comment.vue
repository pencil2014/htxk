<template>
  <div>
    <div class="divider"></div>
    <comment-form @handleLoad= "commentLoad" :layout="['userPhoto', 'imgBox']" :handleData = "this.detail" />
    <e-heading grade="2">全部回帖</e-heading>
    <div class="reply-box" v-if="comment.list.length>0">
      <ul :data-test="comment" v-if="comment && comment.list">
        <card-item v-for="(item,index) in comment.list" :data="item" :userId="item.userId" :key="index" @handleLoad="commentLoad"  />
      </ul>
      <el-pagination
        v-bind="getPaginationProps(comment)"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        >
      </el-pagination>
    </div>
    <div class="replay-default tc" v-else>
      <img src="/images/empty_default.png" alt="暂无数据">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
  import { pagingList } from 'utils/mixins'
  import cardItem from './CardItem'
  import CommentForm from './CommentForm'
  import { mapState } from 'vuex'
  import ElPagination from '@element-ui/Pagination'
  // import axios from 'axios'
  import bbsApi from 'api/community'
  export default {
    mixins: [pagingList],
    components: {
      cardItem,
      CommentForm,
      ElPagination
    },
    computed: {
      ...mapState({
        detail: state => state.community.detail,
        comment: state => state.community.comment
      })
    },
    data () {
      return {
        query: this.getQuery()
      }
    },
    methods: {
      userComment () {
        let commentData = {
          feedId: this.detail.feedId,
          content: this.relayArea,
          fileUrl: this.imgValue,
          clientType: 1
        }
        bbsApi.comment(commentData, {successMsg: '回复成功'}).then((res) => {
          this.relayArea = ''
          this.imgValue = ''
        })
      },
      commentLoad (value) {
        this.query = Object.assign(this.$route.query, {page: 1, rows: 15})
        this.query.page = 1
        let commentData = Object.assign(this.$route.query, {feedId: this.detail.feedId, page: 1, rows: 15})
        this.$store.dispatch('community/comment_data', commentData)
        // this.$router.push({path: this.$route.path})
        this.$emit('handleInit')
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .reply-box{
    margin-top:10px;
    ul li{
      padding:30px 0;
      border-bottom:1px solid $border-color-base;
    }
  }
  .replay-default{
    padding:50px 0;
    color: $color-sub;
  }
</style>