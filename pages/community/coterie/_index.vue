<template>
  <div class="coterie">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/community/marrow' }" >求苗社区</el-breadcrumb-item>
      <el-breadcrumb-item>圈子详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="coterie-content">
      <div class="coterie-main ">
        <head-info />

        <div class="post">
          <el-button type="primary" style="font-size:16px;" @click="operateInApp">
            <i class="icon iconfont" style="margin-right:5px;">&#xe919;</i>
            发帖
          </el-button>
          <list/>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import HeadInfo from './components/HeadInfo'
import List from './components/List'
export default {
  layout: 'bbs',
  components: {
    HeadInfo,
    List
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      // 圈子详情
      let circleDetail = await fetch({
        context,
        url: '/community/guest/circle/circleDetail',
        params: {'circleId': context.params.index}
      })
      context.store.commit('community/CIRCLE_DETAIL', {data: circleDetail.data})
      // 当前圈子下的帖子
      let typeData = {
        type: context.query.type || 1,
        rows: context.query.rows || 15
      }
      let circleFeed = await fetch({
        context,
        url: '/community/guest/circle/circleFeed',
        params: Object.assign({'circleId': context.params.index}, context.query, typeData)
      })
      context.store.commit('community/CIRCLE_FEED', {data: circleFeed.data})
    }
  },
  methods: {
    operateInApp () {
      this.$alert('使用该功能，需下载APP', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          //
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/var';
.coterie{
  background: #fff;
  min-height: 800px;
  .post{
    padding:40px;
    border-top:20px solid rgba(235,240,246,1);
    button{
      margin-bottom: 20px;
    }
  }
}

</style>

<style lang="scss">
.coterie{
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix:after{
    content:".";
    display:block;
    height:0;
    clear:both;
    visibility:hidden;
  }
}
</style>
