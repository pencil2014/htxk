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
      <!-- 页面标题 -->
      <div class="topbar">
        <e-heading grade="1">我的组织</e-heading>
        <el-button type="link" class="creatBtn"><i class="iconfont">&#xe618;</i> 创建组织</el-button>
      </div>
      <!-- tab切换 -->
      <el-tabs v-model="query.status" @tab-click="handleClick" class="tabs">
        <el-tab-pane :label="tabText1" name="0"></el-tab-pane>
        <el-tab-pane :label="tabText2" name="1"></el-tab-pane>
      </el-tabs>
      <!-- 组织列表 -->
        <div class="group-list" v-if="data.total">
          <ul>
            <li class="item" v-for="item in data.list">
              <img :src="item.src" alt=""  class="photo">
              <p class="name">{{item.name}}</p>
              <p class="member">{{item.num}}个成员</p>
              <span class="status">{{item.status}}</span>
            </li>
          </ul>
          <!-- 分页组件 -->
          <el-pagination
                v-bind="getPaginationProps(data)"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              >
          </el-pagination>
        </div>
        <!-- 没有数据 -->
        <e-placeholder  text="没有组织数据哦!"  v-else></e-placeholder>
   
    </div>
  </div>
</template>
<script>
import api from 'api/group'
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
      api.groupList(query)
        .then((res) => {
          // this.data = res.data
        })
    },
    // tab切换
    handleClick () {
      this.fetch(this.query)
    }
  },
  computed: {
    // 列表数据
    groupList () {
      let group = (this.query.status === '0') ? this.joinGroupList : this.creatGroupList
      return group
    },
    // tab文字
    tabText1 () {
      return `我加入的（${this.joinGroupNum}）`
    },
    tabText2 () {
      return `我创建的（${this.creatGroupNum}）`
    }
  },
  data () {
    return {
      query: this.getQuery({
        status: '0'
      }),
      joinGroupNum: 0,
      creatGroupNum: 0,
      data: {
        total: 3,
        list: [{src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}, {src: 'http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg', name: '南山跑步俱乐部', num: 7, status: '已认证'}]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .content {
    .topbar {
      position: relative;
      .creatBtn {
        vertical-align: middle;
        position: absolute;
        top: 5px;
        right: 0;
        font-size: 14px;
        i {
          vertical-align: middle;
        }
      }
    }
    .group-list {
      padding: 20px 0;
      .item {
        font-size: 12px;
        display: inline-block;
        width: 25%;
        text-align: center;
        margin-bottom: 30px;
        .photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .name {
          width: 80%;
          margin: auto;
          font-size: 14px;
          padding: 5px 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
        }
        .member {
          padding-bottom: 5px;
        }
        .status {
          background-color: #fd7802;
          color: $color-white;
          padding: 2px 10px;
        }
      }
    }
  }
</style>
