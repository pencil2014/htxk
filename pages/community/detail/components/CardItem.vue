<template>
  <li v-if="data.commentId && isDelete">
    <e-cellbox>
      <e-cell-item class="photo-box">
        <div class="photo">
          <!-- <img src="/images/default_photo.jpg" width="100%" alt=""> -->
          <a target="_blank" :href="`/personal/${data.userInfoBasicRespVO.userId}`">
          <e-avatar class="photo-img" :size='[60,60]' :src="data.userInfoBasicRespVO && data.userInfoBasicRespVO.iconUrl" :alt="data.userInfoBasicRespVO &&data.userInfoBasicRespVO.nickName" ></e-avatar>
          </a>
        </div>
      </e-cell-item>
      <e-cell-item>
        <e-cellbox>
          <e-cell-item>
            <span class="name">{{data.userInfoBasicRespVO && data.userInfoBasicRespVO.nickName}}</span>
            <span class="time">{{data.createTime}}</span>
          </e-cell-item>
          <e-cell-item class="reply-btn-box">
            <span class="delete-btn" v-show="isPower" @click="handleDelete(data.commentId)">
              删除
            </span>
            <praise :className="'prise-icon-box'" :handleData="data" />
            <!-- <span class="reply-icon" @click="handleReply(data)">
              <i class="iconfont">&#xe628;</i>
            </span>  -->
            <span class="floor">
              <span class="text">
                {{data.floor}} 楼
              </span>
            </span>
          </e-cell-item>
        </e-cellbox>
        <div class="quote-box" v-if="data.refCommentId">
          <p>
            回复 {{data.floor}}楼{{data.refUserNickName}} 发表的：
          </p>
          <p class="quote-content">
            {{data.refContent}}
            <img v-if="data.refFileId" :src="data.refFileUrl" />
          </p>
        </div>
        <div class="replay-content">
          <e-preview-box  class="replay-content-img" v-if = "data.fileId">
            <e-img :src="data.fileUrl" :size="[80,0]" :cutType="0" :data-src="data.fileUrl" />
          </e-preview-box>
          <div class="replay-content-text">
            {{data.content}}
          </div>
        </div>
        <div class="replay-box" style="display:none" :ref="'editor-'+data.commentId">
          <!-- <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            :placeholder="handleHolder"
            v-model="handleArea">
          </el-input>
          <el-button class="reply-btn" type="primary" @click="handleComment">发表回复</el-button> -->
          <comment-form :handleData = "data" :handlePlaceholder = 'handleHolder'  @handleLoad= "commentLoad" />
        </div>
      </e-cell-item>
    </e-cellbox>
  </li>
</template>
<script>
  import { mapState } from 'vuex'
  import bbsApi from 'api/community'
  import Praise from './Praise'
  import CommentForm from './CommentForm'
  import Vue from 'vue'
  export default {
    components: {
      Praise,
      CommentForm
    },
    props: {
      data: {
        default: {}
      },
      userId: {
        type: String
      }
    },
    data () {
      return {
        handleArea: '',
        handleHolder: '',
        isDelete: true
      }
    },
    computed: {
      ...mapState({
        comment: state => state.community.comment
      }),
      isPower () {
        if (this.$store.state.user.session.userId === this.data.userId || this.$store.state.user.session.userId === this.userId) {
          return true
        }
      }
    },
    methods: {
      handleDelete (commentId) {
        this.$confirm('此操作将永久删除该评论，是否继续？', '提示', {
          type: 'warning'
        }).then(() => {
          bbsApi.deleteComment({feedId: this.data.feedId, commentId: commentId}, {successMsg: '删除成功', errorMsg: '删除失败'}).then((res) => {
            if (res.result === '0') {
              this.isDelete = false
            }
          })
        })
      },
      handleReply (data) {
        let userId = this.$store.state.user.session.userId || ''
        if (userId.length < 3) {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          this.$set(this.$store.state, 'loginDialog', true)
          return false
        }
        let node = this.$refs['editor-' + data.commentId]
        this.replyClose()
        node.style.display = 'block'
        this.$parent.$editor = node
        this.handleHolder = '回复 ' + data.floor + '楼 ' + data.userInfoBasicRespVO.nickName + ' 发表的'
      },
      replyClose () {
        // let node = this.$refs['editor-' + this.data.commentId]
        if (this.$parent.$editor) {
          this.$parent.$editor.style.display = 'none'
        }
      },
      commentLoad () {
        this.replyClose()
        this.$emit('handleLoad')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .photo-box{
    padding-right:20px;
  }
  
  .photo{
    width:60px;
    height:60px;
    overflow:hidden;
    border-radius:50%;
    a{
      width:60px;
      height:60px;
      overflow:hidden;
      display:block;
    }
  }
  .time{
    margin:0 15px;
    color: $color-sub;
  }
  .reply-btn-box{
    width:400px;
    text-align:right;
    .floor{
      background: $color-background;
      color: $color-sub;
      text-align:center;
      font-size:12px;
      .text{
        padding:2px 7px 2px  2px;
      }
    }
    .reply-icon{
      color: $color-sub;
      margin:0 40px;
      cursor:pointer;
    }
    .prise-icon-box{
      color: $color-sub;
      margin-left:40px;
      margin-right:20px;
      cursor:pointer;
      &.active{
        color:$color-warning;
      }
      .text{
        color: $color-black;
      }
    }
    .delete-btn{
      color: $color-link;
      cursor:pointer;
    }
  }
  .quote-box{
    margin:20px 0 20px;
    border:1px solid $border-color-base;
    background:$bg-gray;
    padding:20px;
    .quote-content{
      margin-top:30px;
    }
  }
  .replay-box{
    margin-top:20px;
    .reply-btn{
      margin-top:20px;
      float:right;
    }
  }
  .replay-content{
    fong-size: 0;
    &-img{
      max-width:80px;
      display:inline-block;
      margin-right:10px;
    }
    .replay-content-text{
      display:inline-block;
      font-size:14px;
      vertical-align: top;
      width: 1000px;
      word-wrap: break-word;
    }
  }
</style>