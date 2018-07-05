<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/message' }">消息中心</el-breadcrumb-item>
          <el-breadcrumb-item>申请消息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <e-heading grade="1" class="message-title">申请消息</e-heading>
            <div class="content-message">
               <div class="grid-content bg-purple-dark" v-if="messageList.total">
                    <ul class="message-list">
                      <li v-for="(item, index) of messageList.list" :key="index" class="divider">
                        <e-cellbox top :gutter="20">
                          <e-cell-item class="message-head" v-if="item.iconUrl">
                            <img class="" :src='item.iconUrl' title=""  width="60" height="60">
                          </e-cell-item>
                          <e-cell-item class="message-head" v-else>
                            <img class="" :src='defaultImgUrl' title=""  width="60" height="60">
                          </e-cell-item>
                          <e-cell-item>
                             <div class="message-me-name">
                              <strong>{{ item.nickName }}</strong>
                              <i>{{ item.createTime }}</i>
                            </div>
                            <div class="message-tex">{{item.msgContent}}</div>
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
      msgIdList: [],
      msgIdStr: ''
    }
  },
  methods: {
    fetch () {
      api.getApplyListData(this.query)
        .then((res) => {
          this.messageList = res.data
          if (!this.messageList.list.length) {
            this.activeClass = 'show'
          }
          // console.log(this.messageList)
          for (let item of this.messageList.list) {
            this.msgIdList.push(item.id)
          }
          this.msgIdStr = this.msgIdList.toString()
          api.getOperateData({status: 2, msgIds: this.msgIdStr})
            .then((res) => {
              console.log(res)
            })
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
    // 当无数据显示时
  .default-img-box{
    max-width: 200px;
    margin: 20px auto;
    height: 200px;
  }
  .default-img-box p{
    text-align: center
  }
  .content-message .show{
    display: block
  }
  .hide{
    display: none;
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
      .fl{
        float: left;
      }
      .fr{
        float: right;
      }
      .clear{
        overflow:hidden;
        clear:both;
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
      .message-box{
        margin-left: 20px;
        width: 765px;
        p{
          padding: 0 26px 0 14px;
          line-height: 40px;
          background: #ebf0f5;
          font-size: 12px;
          color: #666;
          margin-top: 10px
        }
        .message-tex{
          margin-top: 10px;
          font-size: 12px;
          color: #333;
        }
      }
      }
  }
</style>