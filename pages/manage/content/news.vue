<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/content/feed' }">我的内容</el-breadcrumb-item>
      <el-breadcrumb-item>资讯</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <!-- 页面标题 -->
      <div class="divider">
        <e-heading grade="1">我的资讯<small v-show="data.total">（数量{{data.total}}条）</small></e-heading>
      </div>
      <!-- 资讯列表 -->
      <div class="personal-list">
        <!-- tab切换 -->
        <div class="tab-box">
          <el-tabs v-model="query.status" @tab-click="handleClick" class="tab">
            <el-tab-pane label="已发布" name="1"></el-tab-pane>
            <el-tab-pane label="未发布" name="0"></el-tab-pane>
          </el-tabs>
          <div class="search">
            <el-input placeholder="请输入关键词" v-model.trim="query.articleName" size="small" >
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
          </div>
        </div>
        
        <!-- 资讯列表 -->
        <div class="personal-list-box" v-if="data.total" >
          <div v-for="(item, index) in data.list" :key="item.articleId" class="items divider">
            <div class="alink" @click="goInfo(item.url)">
              <span v-if="item.coverUrl.length === 1" class="photo float">
                <e-img :src="item.coverUrl[0]" alt="" :size="[160,90]" />
              </span>
              <b class="titles">{{item.title}}</b>
              <span v-if="item.coverUrl.length > 1" class='photo'>
                <e-img :src="i" alt="" v-for='(i,index) in item.coverUrl' :key="index" v-if="index < 3" :size="[160,90]" />
                <a href="javascript:;"  class="more" v-if="item.coverUrl.length > 3">+查看更多</a>
              </span>
            </div>
            <div class="info small">
              <span class="time">{{item.publishTimeFormat}}</span> 
              <span class="status">{{item.publishStatus | formatStatus}}</span> 
              <span class='icon'><i class="iconfont">&#xe628;</i>{{item.commentCount}}</span>
              <!-- <span class='icon'><i class="iconfont">&#xe65c;</i>{{}}</span> -->
              <span class='icon'><i class="iconfont">&#xe914;</i>{{item.clickCount}}</span>
              <span class="action">
                <a href="javascript:;" class="cancle" @click="revoke(item.articleId)" v-if="query.status==='1'">撤回</a>
                <a href="javascript:;" class="edit" @click="edit(item)" v-if="query.status==='0'">编辑</a>
                <a href="javascript:;" class="delete" @click="deleted(item.articleId)">删除</a>
              </span>
            </div>
          </div>
          <!-- 分页组件 -->
          <el-pagination
              v-bind="getPaginationProps(data)"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
          </el-pagination>
        </div>
      
        <!-- 没有数据 -->
        <e-placeholder src="/images/personal/not_news.png" text="一条资讯都没有哦!"  v-else></e-placeholder>
      </div>
      
      
    </div>
  </div>
</template>
<script>
import api from 'api/personal'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElPagination
  },
  methods: {
    // 获取数据
    fetch (query) {
      api.newsList(query)
        .then((res) => {
          this.data = res.data
        })
    },
    // tab切换
    handleClick () {
      this.fetch(this.query)
    },
    // 搜索
    search () {
      this.fetch(this.query)
    },
    // 进入详情
    goInfo (url) {
      window.open(url)
    },
    // 撤回
    revoke (id) {
      this.$confirm('此操作将撤回该资讯, 是否继续?', '提示', {type: 'warning'}).then(() => {
        api.revokeNews({
          articleId: id
        }, {successMsg: 'none'}).then((res) => {
          this.$message({
            type: 'success',
            message: '撤回成功!'
          })
          this.fetch()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '撤回失败!'
          })
        })
      }).catch(() => {})
    },
    // 编辑
    edit (item) {
      let id = item.articleId
      if (item.infoType === 1) {
        this.$router.push(`/manage/publish/article?articleId=${id}`)
      } else {
        this.$router.push(`/manage/publish/photo?articleId=${id}`)
      }
    },
    // 删除
    deleted (id) {
      this.$confirm('此操作将删除该资讯, 是否继续?', '提示', {type: 'warning'}).then(() => {
        api.deleteNews({
          articleId: id
        }, {successMsg: 'none'}).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetch(this.query)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
      }).catch(() => {})
    }
  },
  filters: {
    // 格式化发布状态值
    formatStatus (val) {
      let text = ''
      switch (val) {
        case 0:
          text = '未发布'
          break
        case 1:
          text = '已发布'
          break
        case 2:
          text = '发布失败'
          break
        case 3:
          text = '草稿'
          break
        default:
          text = '未发布'
          break
      }
      return text
    }
  },
  data () {
    return {
      query: this.getQuery({
        articleName: '',
        status: '1'
      }),
      data: {}
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .content{
    .personal-list {
      overflow: hidden;
      .tab-box {
        position: relative;
        .tab{
          padding-top: 20px;
        }
        .search {
          position: absolute; 
          right: 0; 
          width: 250px; 
          bottom: 25px;
        }
      }
      .mtop {
        margin-top: 15px;
      }
      .items {
        overflow: hidden;
        padding-bottom: 15px;
        // border-bottom: 1px solid $border-color-base;
        .alink {
          cursor: pointer;
          .titles {
            font-size: 16px; 
            display: block; 
            padding-top: 20px; 
            &:hover {
              color: $color-primary;
            }
          }
          .float {
            float: left; 
            padding-right: 20px;
          }
          .photo {
            overflow: hidden;
            display: inline-block;
            height: 90px;
            padding-top: 10px;
            img { 
              max-width: 160px; 
              max-height: 90px;
              margin-right: 10px;
              border: 1px solid $border-color-base;
              opacity: 0.8;
              &:hover {
                opacity: 1;
                transition: all 1s linear 0;
              }
            }
            .more {
              display: inline-block;
              width: 160px; 
              height: 90px;
              line-height: 90px;
              text-align: center;
              background-color: #eee;
              color: $color-sub;
              &:hover {
                color: $color-primary;
              }
            }
          }
          
        }
        .info { 
          color: $color-sub;
          .status {
            background-color: #eee;
            padding: 2px 10px;
            border-radius: 10px;
            margin: 0 10px;
          }
          .icon {
            vertical-align: middle;
            margin: 0 10px;
            i {
              margin-right: 5px;
            }
          }
          .action {
            float: right;
            a { 
              font-size: 14px; 
              margin-left: 15px;
              &:hover{
                color: $color-primary;
              }
            }
          }
        }
      }
    }
  }
</style>