<template>
  <div>
    <!-- 面包屑导航
		<el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/activity' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的活动</el-breadcrumb-item>
    </el-breadcrumb>
     -->
    <div class="content">
      <e-heading grade="1">我的活动</e-heading>
      <el-tabs v-model="query.type" @tab-click="handleClick">
        <el-tab-pane label="我参与的" name=""></el-tab-pane>
        <el-tab-pane label="我发起的" name="1"></el-tab-pane>
      </el-tabs>
      <div v-if="data.list && data.list.length">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in data.list" :key="index">
            <a class="match-item" target="_blank" :href="item.nextStepUrl">
              <div class="match-item-photo">
                <e-img :src="item.logoUrl" :size="[194,194]"/>
                <span class="match-item-status" :style="{background: ['','#BBBBBB','#FB4945','#01BC91','#01BC91','#BBBBBB','#FD9500','#BBBBBB','#BBBBBB'][item.status]}">
                  {{['草稿','待审核','审核不通过','审核通过','报名中','报名截止','进行中','已结束','提前关闭'][item.status]}}
                </span>
              </div>
              <h4>{{item.matchName}}</h4>
              <time class="small weak"><i style="font-size:14px" class="iconfont">&#xe60f;</i> {{item.startTime.split(' ')[0]}} ~ {{item.endTime.split(' ')[0]}}</time>
              <address v-if="item.address" class="small weak"><i class="iconfont">&#xe627;</i> {{item.address}}</address>
            </a>
          </el-col>
        </el-row>
        <el-pagination
          v-bind="getPaginationProps(data)"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          >
        </el-pagination>
      </div>
      <e-placeholder v-else text="暂无活动，赶紧去参加吧">
        <el-button slot="button" @click="$router.push('/')" type="primary">去参与</el-button>
      </e-placeholder>
    </div>
  </div>
</template>

<script>
  import { pagingList } from 'utils/mixins'
  import fetch from 'fetch'
  import ElPagination from '@element-ui/Pagination'
  export default {
    layout: 'manage',
    mixins: [pagingList],
    components: {
      ElPagination
    },
    data () {
      return {
        data: {},
        query: this.getQuery({
          rows: this.$route.query.rows || 20,
          type: this.$route.query.type || ''
        })
      }
    },
    methods: {
      fetch (query) {
        fetch({
          url: this.query.type === '1' ? '/match/user/myActity' : '/match/user/inActity',
          params: query
        }).then((res) => {
          this.data = res.data
        })
      },
      handleClick (tab) {
        this.query.page = 1
        this.submit(this.query)
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .match-item{
    height:295px;
    margin-bottom:20px;
    margin-top: 10px;
    display:block;
    &-photo{
      overflow:hidden;
      background-size:cover;
      background-repeat: no-repeat;
      background-position: 50%;
      position:relative;
    }
    h4{
      overflow: hidden;
      font-weight: normal;
      margin-top: 10px;
      height:34px;
      line-height: 18px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color:#333;
    }
    address{
      font-style:normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
    }
    &-status{
      background:#BBBBBB;
      color:#fff;
      top:0;
      left:0;
      width:70px;
      height:26px;
      line-height:26px;
      position:absolute;
      text-align:center;
      border-bottom-right-radius:15px;
      font-size:12px;
    }
  }
</style>
