<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/message' }">消息中心</el-breadcrumb-item>
          <el-breadcrumb-item>评论</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <e-heading grade="1" class="message-title">评论</e-heading>
            <div class="content-message">
              <div class="grid-content bg-purple-dark" v-if="messageList.total">
                    <ul class="message-list">
                      <li v-for="(item, index) of messageList.list" :key="index">
                        <e-cellbox top :gutter="20">
                          <e-cell-item class="message-head" v-if="item.userInfoBasicRespVO.iconUrl">
                            <img class="" :src='item.userInfoBasicRespVO.iconUrl' title=""  width="60" height="60">
                          </e-cell-item>
                          <e-cell-item class="message-head" v-else>
                            <img class="" :src='defaultImgUrl' title=""  width="60" height="60">
                          </e-cell-item>
                          <e-cell-item>
                             <div class="message-me-name">
                              <strong>{{ item.userInfoBasicRespVO.nickName }}</strong>
                              <i>{{ item.createTime }}</i>
                            </div>
                            <div class="message-tex" >{{ item.content }}</div>
                            <!-- <nuxt-link target='_blank' :to="{path:'/personal/index/feed/detail?feedId=' + item.feedId}"> -->
                            <nuxt-link target='_blank' :to="{path:'/community/detail/' + item.feedId}">
                              <p class="message-com" v-if="item.noticeType == 1">
                                  <span>回复了我的帖子 : </span><span v-if="item.feedTitle">{{ item.feedTitle }}</span><span v-else>无</span>
                              </p>
                              <p class="message-com" v-else>
                                  <span>引用了我的评论 : </span><span v-if="item.refContent">{{ item.refContent }}</span><span v-else>无</span>
                              </p>
                            </nuxt-link>
                          </e-cell-item>
                        </e-cellbox>
                      </li>
                    </ul>
                </div>
                <e-placeholder v-else src="/resources/images/defaultPage/not_infor.png" text="当前没有消息哦"/>
            </div>
            <el-pagination
                v-bind="getPaginationProps(messageList)"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              >
            </el-pagination>
        </div>
  </div>
</template>
<script>
import api from 'api/system'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
// import axios from 'axios'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElPagination
  },
  data () {
    return {
      query: this.getQuery({}),
      messageList: '',
      activeClass: '',
      defaultImgUrl: '/resources/images/default_photo.jpg',
      noticeTypeList: [
        {label: '帖子', value: 1},
        {label: '评论 ', value: 2}
      ]
    }
  },
  methods: {
    fetch () {
      api.getCommentListData(this.query)
        .then((res) => {
          this.messageList = res.data
          if (!this.messageList.list.length) {
            this.activeClass = 'show'
          }
          // console.log(res.data)
        })
    }
  }
}
</script>
<style lang="scss">
  
  .layout-frame .content div.message-title{
     margin-bottom: 0;
  }
  .content-message{
     border-top: 1px solid #f2f2f2;
     margin-top: 20px;
  }
  .message-list{
    li{
      clear: both;
      color: #333;
      overflow: hidden;
      padding: 20px 0;
      .message-me-name{
        clear: both;
        overflow: hidden;
        zoom: 1;
      }
      // new style
      .message-me-name strong{
        float: left;
        font-size: 14px;
      }
      .message-detail{
        color: #3983e5
      }
      .message-me-name i{
        float: right;
        font-size: 12px;
        font-style: normal;
        color: #999;
      }
      .message-head{
        width: 60px;
        height: 50px;
        border-radius: 50%;
      }
      .message-head img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .message-tex{
        margin-top: 10px;
        font-size: 12px;
        color: #333;
      }
      .message-com{
        padding: 0 26px 0 14px;
        line-height: 40px;
        background: #ebf0f5;
        font-size: 12px;
        color: #666;
        margin-top: 10px
      }
      }
  }
</style>