<template>
  <div class="mod-wrap">
    <div class="mod-main">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/sponsored' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="left-box">
        <div class="news-details" v-if="detailsData">
          <div class="news-details-title">
            <h1>{{detailsData.noticeTitle}}</h1>
            <p>
              <span>{{detailsData.createTime | formatDate('yyyy.MM.dd HH:mm:ss')}}</span>
              <span>{{detailsData.noticeSourceName ? '来源：' + detailsData.noticeSourceName : '--'}}</span>
              <span>{{detailsData.updateUser ? '发布：' + detailsData.updateUser : '--'}}</span>
            </p>
          </div>
          <div class="news-details-con" v-html="detailsData.noticeDetails"></div>
        </div>
        <div class="loading-box" v-else>正在加载中...</div>
      </div>
      <div class="right-box">
        <div class="ad-box">
          <a href=""><img src="/images/sponsor/home/ad.jpg" alt="" /></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import indexApi from 'api/sponsored/index'
  export default {
    layout: 'sponsor',
    data () {
      return {
        detailsData: ''
      }
    },
    created () {
      this.detailsDataFn()
    },
    methods: {
      detailsDataFn () {
        // 热闹项目赞助意向数据
        indexApi.noticeDetails({
          noticeId: this.$route.query.noticeId
        }, {context: this, successMsg: 'none'}).then((res) => {
          this.detailsData = res.data
        })
      }
    }
  }
</script>
<style lang="scss">
  
  .mod-wrap{
    background: #fff;
    position:relative;
  }
  .mod-main{
    width:1200px;
    height: 100%;
    margin:0 auto;
    overflow: hidden;
    position:relative;
  }
  .left-box{
    width:890px;
    float: left;
  }
  .right-box{
    width: 285px;
    float: right;
  }
  .loading-box{
    width: 100%;
    background: #f1f2f3;
    text-align: center;
    line-height: 40px;
    margin: 20px 0;
  }
  .news-details{
    width:800px;
    min-height:800px;
    &-title{
      padding:30px 0px 10px 0px;
      border-top: 1px #f0f0f0 solid;
      border-bottom: 1px #f0f0f0 solid;
      text-align: center;
      h1{
        font-size:24px;
        color:$color-black;
        margin-bottom: 28px;
      }
      p>span{
        margin:0px 10px;
        font-size:12px;
        color:$color-sub;
      }
    }
    &-con{
      margin-top: 42px;
      p{
        font-size:16px;
        color:$color-black;
        line-height: 30px;
      }
      img{
        width:100%;
      }
    }
  }

</style>
