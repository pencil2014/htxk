<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/group/' }">我的组织</el-breadcrumb-item>
      <el-breadcrumb-item>创建成功</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <img src="http://dev.oooseed.com/_nuxt/img/default_photo.43a112d.jpg" alt="">
      <h3>南山羽毛球俱乐部</h3>
      <p>您的组织已经创建成功！</p>
      <el-button type="primary" @click="goDetail">进入创建的组织</el-button>
    </div>
    
  </div>
</template>
<script>
export default {
  layout: 'manage',
  methods: {
    goDetail () {
      this.$router.push({path: '/manage/group/detail', query: {id: this.id}})
    }
  },
  data () {
    return {
      id: 0
    }
  }
}
</script>
<style lang="scss" scoped>
 
 .content {
  text-align: center;
  img {
    width: 120px;
    height: 120px; 
    border-radius: 50%;
  }
  h3 {
    padding: 10px 0;
  }
  p {
    color: $color-sub;
    padding-bottom: 20px;
  }
 }
</style>