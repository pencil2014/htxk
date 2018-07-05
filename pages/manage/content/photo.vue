<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/content/feed' }">我的内容</el-breadcrumb-item>
      <el-breadcrumb-item>相册</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <!-- 页面标题 -->
      <div class="divider">
        <e-heading grade="1">我的相册<small v-show="data.total">（相片数量{{data.total}}）</small></e-heading>
      </div>
      <div>
        <!-- 相册列表 -->
        <div class="personal-list" v-if="data.total">
          <!-- 相册列表 -->
          <e-preview-box>
          <div class="item divider" v-for="(item, index) in photoArr" :key="item.contentId">
            <p class="time">{{item.createTime | formatTime}}</p>
            <div class="img-box" @click="">
              <e-img :size="[500, 500]" :src="i" alt="" v-for='(i, index) in item.thumbFileName' :key='index' />
              <!-- <img :src="item.thumbFileName" alt=""> -->
            </div>
          </div>
          </e-preview-box>
          <!-- 分页组件 -->
          <el-pagination
              layout='total, prev, pager, next, jumper'
              v-bind="getPaginationProps(data)"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
          </el-pagination>
        </div>
        <!-- 没有数据 -->
        <e-placeholder src="/images/personal/not_publish_image.png" text="没有发布图片哦!"  v-else></e-placeholder>
      </div>
      

      
    </div>
        
  </div>
</template>
<script>
import api from 'api/personal'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
export default {
  props1: {
    history: true
  },
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElPagination
  },
  methods: {
    // 获取数据
    fetch (query) {
      api.photoList(query)
        .then((res) => {
          this.data = res.data
        })
    }
  },
  data () {
    return {
      query: this.getQuery({}),
      data: {}
    }
  },
  computed: {
    photoArr () {
      let arr = []
      let ids = []
      // 分类到每次
      if (this.data.list) {
        let data = this.data.list
        for (let x of data) {
          if (ids.includes(x.feedId)) {
            arr.forEach((ele) => {
              if (ele.feedId === x.feedId) {
                ele.thumbFileName.push(x.thumbFileName)
              }
            })
          } else {
            ids.push(x.feedId)
            x.thumbFileName = Array.of(x.thumbFileName)
            arr.push(x)
          }
        }
      }
      // 分类到每天
      // if (this.data.list) {
      //   let data = this.data.list
      //   for (let x of data) {
      //     if (ids.includes(x.createTime.split(' ')[0])) {
      //       arr.forEach((ele) => {
      //         if (ele.createTime.split(' ')[0] === x.createTime.split(' ')[0]) {
      //           ele.thumbFileName.push(x.thumbFileName)
      //         }
      //       })
      //     } else {
      //       ids.push(x.createTime.split(' ')[0])
      //       x.thumbFileName = Array.of(x.thumbFileName)
      //       arr.push(x)
      //     }
      //   }
      // }
      return arr
    }
  },
  filters: {
    formatTime (val) {
      let data = new Date(val)
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      return `${year}年${month}月${day}日`
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .content{
    .personal-list {
      overflow: hidden;
      margin-top: 20px;
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
      .item {
        overflow: hidden;
        padding-bottom: 15px;
        margin-bottom: 20px;
        // border-bottom: 1px solid $border-color-base;
        .time {
          color: #000;
          padding-bottom: 10px;
        }
        .img-box {
          img { 
            width: 110px; 
            height: 110px; 
            margin: 0 10px 10px 0;
            border:1px solid $border-color-base;
          }
        }
      }
    }
  }
</style>