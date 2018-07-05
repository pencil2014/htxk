<template>
  <div class="wrapper">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/sponsored' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="16">
        <div class="news_list">
          <div class="news_commonbox article_newbox" v-for="(item, index) in list" :key='index'>
            <h4 class="title">
              <a :href="'/sponsored/news/details?noticeId=' + item.id" target="_blank">{{item.noticeTitle}}<span>{{item.noticeTypeName}}</span></a>
            </h4>
            <div class="article_box">
              <p class="article_desc" v-if="item.noticeSummary">{{item.noticeSummary}}<a :href="'/sponsored/news/details?noticeId=' + item.id">阅读原文></a></p>
            </div>
            <div class="report_box report_footer">
              {{item.createTime | formatDate('yyyy.MM.dd HH:mm')}}
            </div>
          </div>
          <div class="more" v-if="loading">正在加载中...</div>
          <div class="more" @click="handledMore" v-if="pages && page < pages">查看更多</div>
        </div>
      </el-col>
      <el-col :span="6" :offset="2" class="poster">
        <a href=""><img src="/images/sponsor/home/ad.jpg" alt="" /></a>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
  import api from 'api/sponsored/index'
  export default {
    layout: 'sponsor',
    data () {
      return {
        list: [],
        page: 1,
        loading: true,
        pages: ''
      }
    },
    created () {
      this.noticeDataFn(this.page)
    },
    methods: {
      noticeDataFn (page) {
        // 公告列表，最多8条
        this.loading = true
        api.noticeList({
          page: page,
          rows: 8
        }, {context: this, successMsg: 'none'}).then((res) => {
          if (res.data.list && res.data.list.length > 0) {
            this.pages = res.data.pages
            res.data.list.forEach(item => {
              this.list.push(item)
            })
          }
          this.loading = false
        })
      },
      handledMore () {
        this.noticeDataFn(++this.page)
      }
    }
  }
</script>
<style lang="scss">
  
  .news_list{
    min-height: 500px;
    .news_commonbox {
      padding: 5px 20px 15px;
      border-bottom: 1px solid $border-color-base;
      border-top: 1px solid $border-color-base;
      margin-top: -1px;
      h4.title{
        padding: 10px 0;
        font-size: 20px;
        color: #333333;
        a:hover{
          color: $color-primary;
        }
        span{
          color: $color-warning;
          border: 1px solid $color-warning;
          border-radius: 2px;
          width: 68px;
          height: 24px;
          line-height: 22px;
          text-align: center;
          display: inline-block;
          font-size: 12px;
          font-weight: normal;
          margin-left: 10px;
        }
      }
      .article_desc {
        line-height: 24px;
        color: $color-black-base;
        padding-bottom: 15px;
        a{
          color: $color-link;
          margin-left: 10px;
        }
      }
      .report_footer{
        font-size: 12px;
        color: $color-sub;
      }
    }
  }
  .poster{
    padding-left: 15px;
    img{
      width: 100%;
    }
  }
  .more{
    width: 100%;
    background: #f1f2f3;
    text-align: center;
    line-height: 40px;
    margin: 20px 0;
    &:hover{
      cursor: pointer;
    }
  }
</style>
