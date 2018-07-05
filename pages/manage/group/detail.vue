<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/group/' }">我的组织</el-breadcrumb-item>
      <el-breadcrumb-item>我的组织</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <div class="header">
        <h3>我的组织</h3>
        <el-button type="primary" class="alink" size="small"><i class="iconfont">&#xe618;</i> 邀请成员</el-button>
      </div>
      <div class="info">
        <img src="" alt="">
        <span></span>
        <a href="javascript:;"><i class="iconfont">&#xe916;</i></a>
      </div>
      <!-- 成员列表 -->
      <div class="title">
        <b>成员</b>
        <div class="bdsharebuttonbox">
          <a class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
          <a class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
        </div>
      </div>
      <el-table
        :data="groupList"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="num"
          label="成员"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.num }}个成员</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="认证状态"
          >
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="100"
          >
          <template slot-scope="scope">
            <el-button type="link" @click="goInfo"><i class="iconfont">&#xe916;</i></el-button>
          </template>
          
        </el-table-column>
      </el-table>
      <!-- <table class="group-list">
        <tbody>
          <tr v-for="item in groupList">
            <td><img :src="item.src" alt=""></td>
            <td>{{item.name}}</td>
            <td>{{item.num}}个成员</td>
            <td>{{item.status}}</td>
            <td width="10%"><i class="iconfont">&#xe916;</i></td>
          </tr>
        </tbody>
      </table> -->
      <!-- 没有更多数据了 -->
      <p v-show="!nextPage" class="nomore">没有更多数据了</p>
      <!-- 加载更多 -->
      <div class="loadmore" v-show="nextPage">
        <el-button type="info" :loading="loading" @click="getGroup">{{btnText}}</el-button>
      </div>
      <!-- 没有数据 -->
      <div class="nodata" v-if="nodata">
        <img src="/images/personal/no_description.png" alt="">
        <p>抱歉，您还没有加入任何组织！</p>
      </div>    
    </div>
  </div>
</template>
<script>
import api from 'api/group'
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
export default {
  layout: 'manage',
  components: {
    ElTable,
    ElTableColumn
  },
  methods: {
    // 获取我的组织
    getGroup () {
      this.loading = true
      api.groupList({
        page: this.page.currentPage,
        rows: this.page.pageSize,
        status: this.activeName
      }).then((res) => {
        this.loading = false
        if (res.result === '0') {
          this.page.currentPage += 1
          let data = res.data.list
          if (this.activeName === '0') {
            this.joinGroupList = data
          } else {
            this.creatGroupList = data
          }
          this.nextPage = res.data.hasNextPage
          this.nodata = data.length < 1
        } else {
          this.nodata = true
          this.$message({
            type: 'error',
            message: '数据加载失败!'
          })
        }
      }).catch(() => {
        this.loading = false
        this.nodata = true
        this.$message({
          type: 'error',
          message: '数据加载失败!'
        })
      })
    },
    // 百度分享
    bdInit () {
      window._bd_share_config = {
        'common': {
          'bdSnsKey': {},
          'bdText': '',
          'bdDesc': '',
          'bdMini': '2',
          'bdMiniList': false,
          'bdPic': '',
          'bdStyle': '0',
          'bdSize': '16'
        },
        'share': {}
      }
      let url = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(new Date() / 36e5)
      let script = document.createElement('script')
      script.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(script)
    },
    // 去详情
    goInfo () {
      // alert(123)
    }
  },
  computed: {
    // 列表数据
    groupList () {
      let group = (this.activeName === '0') ? this.joinGroupList : this.creatGroupList
      return group
    },
    // 加载更多按钮文字
    btnText  () {
      return this.loading === true ? '数据加载中' : '加载更多'
    }
  },
  data () {
    return {
      activeName: '0',
      joinGroupList: [
        {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}
      ],
      joinGroupNum: 0,
      creatGroupList: [],
      creatGroupNum: 0,
      nextPage: false,
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 10
      },
      nodata: false
    }
  },
  mounted () {
    // 初始化百度分享
    this.bdInit()
  }
}
</script>
<style lang="scss" scoped>
  
  .content {
    padding: 15px;
    .header {
      font-size: 16px;
      text-align: center;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      vertical-align: middle;
      position: relative;
      margin-bottom: 10px;
      h3 {
        line-height: 60px;
      }
      .alink {
        position: absolute;
        right: 0; 
        top: 15px;
        i {
          font-size: 12px;
        }
      }
    }
    .bdsharebuttonbox a{
      display:block;
      float:left;
      width:20px;
      height: 20px;
      padding-left: 0;
      font-size: 20px;
      line-height: 20px;
      background:#fff;
      cursor: pointer;
      margin: 6px 6px 6px 0;
      .iconfont{
        font-size: 20px;
      }
    }
    .group-list {
      width: 100%;
      tr {
        cursor: pointer;
        &:hover {
          background-color: #f2f2f2;
        }
        border-bottom: 1px solid #f2f2f2;
        td {
          text-align: left;
          padding: 8px;
          img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }
        }
      }
    }
    .nomore {
      padding: 20px;
      text-align: center;
    }
    .loadmore { 
      padding: 20px; 
      text-align: center;
    }
    .nodata {
      text-align: center;
      p { 
        color: #999; 
        padding: 10px 0;
      }
    }
  }
</style>
