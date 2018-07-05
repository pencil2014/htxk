<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/message' }">消息中心</el-breadcrumb-item>
          <el-breadcrumb-item>系统消息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <e-heading grade="1" class="message-title">系统消息</e-heading>
            <div class="content-message">
                <div class="grid-content bg-purple-dark" v-if="messageList.total">
                    <ul class="message-list">
                      <li v-for="(item, index) of messageList.list" :key="item.msgId">
                        <div class="message-me-name">
                          <strong>{{ item.msgTitle }}</strong>
                          <i>{{ item.createTime }}</i>
                        </div>
                        <div class="message-apply-result">
										       <div class="fl message-msg">{{ item.msgContent }}
                       <!--<nuxt-link class="message-detail" target='_blank' :to="{path:item.url}" v-if='item.url'>查看详情&gt; </nuxt-link></div>
                           <div class="message-status fr"><span v-if='item.userStatus == 2'>已读</span>-->
                           </div>
                        </div>
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
      msgIdList: [],
      msgIdStr: '',
      noticeTypeList: [
        {label: '帖子', value: 1},
        {label: '评论 ', value: 2}
      ]
    }
  },
  methods: {
    fetch () {
      api.getSystemListData(this.query)
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
      border-bottom: 1px solid #f2f2f2;
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
      .message-me-name strong{
        float: left;
        font-size: 14px;
      }
      .message-detail{
        color: #3983e5;
        margin-left: 20px
      }
      .message-me-name i{
        float: right;
        font-size: 12px;
        font-style: normal;
        color: #999;
      }
      .message-apply-result{
        padding-top: 6px;
        .message-msg{
          display: block;
          color: #333;
          font-size: 12px;
        }
        .message-status{
          display: block;
          color: #666
        }
      }
    }
  }
</style>

