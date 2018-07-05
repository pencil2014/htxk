<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/content/feed' }">我的内容</el-breadcrumb-item>
      <el-breadcrumb-item>帖子</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <!-- 页面标题 -->
      <div class="divider">
        <e-heading grade="1">我的帖子<small v-show="data.total">（帖子数量{{data.total}}）</small></e-heading>
      </div>
      <!-- 帖子列表 -->
      <div>
        <div class="personal-list" v-if="data.total">
          <div class="item divider" v-for="item in data.list" :key="item.feedId" @click="goInfo(item.feedId)">
            <div class="user">
              <p class="photo"><img :src="item.userIcon || defaultHead" alt=""></p>
              <p class="info">
                <b class="name">{{item.nickName}}</b> 
                <!-- <span class="type">
                  <span class='icon'><i class='iconfont'>&#xe91a;</i></span>
                  <span class="text small">{{item.types}}</span>
                </span> -->
              </p>
              <span class="time small">{{item.publishTime}}</span>
            </div>
            <div class="content-box">
              <p class="cnt">
                {{item.title}}
              </p>
              <div class="img">
                <e-img :src="i.content" alt="" v-for='(i, index) in item.feedContents' v-if="i.contentType === 2 && index < 4" :key="index" :size="[160,90]"/>
                <video :src="x.content" v-for='(x, index) in item.feedContents' v-if="x.contentType === 3 && index < 4" :key="index"></video>
                <a href="javascript:;"  class="more" v-if="item.feedContents.length > 4">+查看更多</a>
              </div>
            </div>
            <div class="tab small">
              <div class="tablist">
                <span v-for='(x, index) in item.labels' :key='index'>{{x.labelName}}</span>
              </div>
              <div class="comment">
                <span><i class="iconfont">&#xe628;</i>{{item.commentCount}}</span>
                <span><i class="iconfont">&#xe65c;</i>({{item.diggCount}})</span>
              </div>
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
        <e-placeholder src="/images/personal/no_description.png" text="没有发布帖子哦!"  v-else></e-placeholder>
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
      api.feedList(query)
        .then((res) => {
          this.data = res.data
        })
    },
    // 点击跳转详情
    goInfo (id) {
      this.$router.push(`/community/detail/${id}`)
    }
  },
  data () {
    return {
      query: this.getQuery({}),
      data: {},
      defaultHead: '/images/default_photo.jpg'
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .content{
    .personal-list {
      overflow: hidden;
      .item {
        margin-top: 20px;
        cursor: pointer;
        .user {
          .photo {
            padding-right: 10px;
            float: left; 
            overflow: hidden;
            img { 
              width: 50px; 
              height: 50px; 
              border-radius: 50%; 
            }

          }
          .info {
            .name {
              font-size: 16px; 
              padding-right: 10px;
            }
            .type {
              border:1px solid #ffcc00; 
              border-radius: 4px;
              color: #ffcc00;
              i {
                color: #fff;
              }
              .icon {
                background-color: #ffcc00; 
                padding: 0 5px;
              }
              .text {
                padding: 0 5px;
              }
            }
          }
          .time {
            color: $color-sub;
          }
        }
        .content-box {
          .cnt {
            padding-top: 10px;
            color: #000;
            max-height: 60px; overflow: 
            hidden;
          }
        .img { 
          margin: 10px 0; 
          overflow: hidden; 
          max-height: 112px;
          img { 
            max-width: 200px; 
            max-height: 112px; 
            margin-right: 10px; 
            border:1px solid $border-color-base; 
            vertical-align: top;
            opacity: 0.8;
            &:hover {
              opacity: 1;
              transition: all 1s linear 0;
            }
          }
          video {
            width: 160px; 
            height: 90px; 
            margin-right: 10px;
            opacity: 0.8;
            border: 1px solid $border-color-base;
            background-color: $border-color-base;
            &:hover {
              opacity: 1;
              transition: all 1s linear 0;
            }
          }
          .more {
            display: inline-block;
            width: 200px; 
            height: 112px;
            line-height: 112px;
            text-align: center;
            background-color: #eee;
            color: $color-sub;
            &:hover {
              color: $color-primary;
            }
          }
        }
        }
        
        .tab {
          overflow: auto;
          color: $color-sub;
          .tablist {
            float: left;
            span { 
              background-color: $color-background; 
              padding: 2px 10px; 
              border-radius: 4px; 
              margin-right: 10px;
            }
          }
          .comment {
            float: right;
            span {
              vertical-align: middle;
              padding-left: 15px;
              i { 
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>