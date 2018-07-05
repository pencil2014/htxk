<template>
  <div>
    <e-cellbox middle class="answer-box">
        <e-cell-item class="photo-box" v-if="layout.indexOf('userPhoto') > -1">
          <div class="photo">
            <!-- <img src="/images/default_photo.jpg" width="100%" alt="" /> -->
            <e-avatar class="photo-img" :size='[60,60]' :src="$store.state.user.session.iconUrl" />
          </div>
        </e-cell-item>
        <e-cell-item class="textarea">
          <el-input
            ref="textarea"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            :placeholder="handlePlaceholder"
            v-model="handleArea"
            :disabled="isLogin"
            >
          </el-input>
        </e-cell-item>
      </e-cellbox>
      <div class="commit-box">
        <e-img-upload v-model="imgValue" :disabled="isLogin" v-if="layout.indexOf('imgBox') > -1" />
        <span class="content-tips">
          禁止发布色情、反动及广告内容！
        </span>
        <el-button type="primary" @click="userComment">发表回复</el-button>
      </div>
  </div>
</template>
<script>
  import EImgUpload from '@e-ui/ImgUpload'
  import bbsApi from 'api/community'
  import Vue from 'vue'
  export default {
    components: {
      EImgUpload
    },
    props: {
      layout: {
        default () {
          return []
        },
        type: Array
      },
      handleData: {
        type: Object,
        default: {}
      },
      handlePlaceholder: {
        type: String,
        default: '请输入内容'
      }
    },
    computed: {
      isLogin () {
        return !this.$store.state.user.session.userId
      }
    },
    data () {
      return {
        handleArea: '',
        imgValue: ''
      }
    },
    methods: {
      userComment () {
        let userId = this.$store.state.user.session.userId || ''
        if (userId.length < 3) {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          this.$set(this.$store.state, 'loginDialog', true)
          return false
        }
        if (this.handleArea.trim().length < 1) {
          this.$message({
            message: '请输入回复内容',
            type: 'warning',
            duration: 2 * 1000
          })
          return false
        }
        let commentData = {
          content: this.handleArea,
          fileUrl: this.imgValue,
          refCommentId: this.handleData.commentId,
          feedId: this.handleData.feedId,
          clientType: 1
        }
        if ((this.handleData.commentId || '').length < 3) {
          delete commentData.refCommentId
        }
        bbsApi.comment(commentData, {successMsg: '回复成功'}).then((res) => {
          this.handleArea = ''
          this.imgValue = ''
          this.$emit('handleLoad')
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .answer-box{
    margin:40px 0 20px;
    .photo{

    }
  }
  .photo{
    width:60px;
    height:60px;
    overflow:hidden;
    border-radius:50%;
  }
  .photo-box{
    width:100px;
    vertical-align:top;
  }
  .commit-box{
    text-align:right;
    line-height:40px;
    .img-upload{
      width:50px;
      height:50px;
      float:left;
      margin-left:100px;
    }
  }
  .replay-content{
    margin-top:10px;
  }
</style>