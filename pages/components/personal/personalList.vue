<template>
  <div>
    <div v-for="(item, index) in option" :key="item.articleId" class="items">
      <div class="alink" @click="goInfo(item.articleId)">
        <span v-if="item.coverUrl.length === 1" class="photo float">
          <img :src="item.coverUrl[0]" alt="" >
        </span>
        <b class="titles">{{item.title}}</b>
        <span v-if="item.coverUrl.length > 1" class='photo'>
          <img :src="i" alt="" v-for='(i,index) in item.coverUrl' :key="index" v-if="index < 3">
          <a href="javascript:;"  class="more" v-if="item.coverUrl.length > 3">+查看更多</a>
        </span>
      </div>
      <div class="info">
        <span class="time">{{item.publishTime}}</span> 
        <span class="status">{{item.publishStatus | formatStatus}}</span> 
        <span class='icon'><i class="iconfont">&#xe628;</i>{{item.templateId}}</span>
        <!-- <span class='icon'><i class="iconfont">&#xe65c;</i>{{item.zan}}</span> -->
        <span class='icon'><i class="iconfont">&#xe914;</i>{{item.commentCount}}</span>
        <span class="action">
          <a href="javacript:;" class="cancle" @click="revoke(item.articleId)">撤回</a>
          <a href="javacript:;" class="edit" @click="edit(item.articleId)">编辑</a>
          <a href="javacript:;" class="delete" @click="deleted(item.articleId)">删除</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    option: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    // 点击进入详情页
    goInfo (id) {
      this.$emit('goInfo', id)
    },
    // 撤回
    revoke (id) {
      this.$emit('revoke', id)
    },
    // 编辑
    edit (id) {
      this.$emit('edit', id)
    },
    // 删除
    deleted (id) {
      this.$emit('deleted', id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~assets/styles/var.scss';
  .items {
    overflow: hidden;
    padding-bottom: 15px;
    border-bottom: 1px solid #F2F2F2;
    .alink {
      cursor: pointer;
      .title {
        font-size: 16px; 
        display: block; 
        padding-top: 20px; 
        color: #000;
        &:hover {
          color: #01a87c;
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
          border: 1px solid #f2f2f2;
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
          color: #999;
          &:hover {
            color: #01a87c;
          }
        }
      }
      
    }
    .info { 
      font-size: 12px; 
      color: #999;
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
            color: #01a87c;
          }
        }
      }
    }
  }
</style>