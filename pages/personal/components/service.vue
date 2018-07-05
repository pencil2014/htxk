<template>
  <div class="personal-list service-box" v-if="serviceInfo.ipAuth">
      <div class="approve-content" v-if="serviceInfo.ipAuth.authStatus === 1"> 
        <e-img :src="approveImg"/>
        <div class="btn approve-btn">认证审核中</div>
      </div>
      <div class="approve-content" v-if="serviceInfo.ipAuth.authStatus === 2"> 
          <div class="unapprove">
              <div class="pic_box"><e-img :src="unApproveImg"/></div>
              <div class="btn approve-btn">身份未验证</div>
              <div class="mbtn" style="display:none">立即认证</div>
          </div>
      </div>
      <div v-else>
          <div class="approve-infor" v-if="serviceInfo && serviceInfo.userInfo">
            <h3 class="mod-h1">个人资料</h3> 
            <div class="message">
                <p class="list"> <span class="label-text">名字：</span> <span class="name">{{serviceInfo.userInfo.authName}}</span> </p> 
                <p class="list"> <span class="label-text">身份：</span> <span class="approve-icon" v-if="serviceInfo.ipAuthCate"><e-img :src="serviceInfo.ipAuthCate.pcImgTxtUrl" :size='[64, 14]'/></span><span class="approve-icon" v-else>无</span> </p> 
                <div class="intro-box">
                  <span class="label-text fl">简介：</span> 
                  <div class="description"> {{serviceInfo.userInfo.intro}}</div>
                </div>
          </div>
        </div>
      </div>
  </div>
  <div class="approve-content" v-else>
      <div class="unapprove">
          <div class="pic_box"><e-img :src="unApproveImg"/></div>
          <div class="btn-unText">身份未验证</div>
          <nuxt-link :to="'/attestation/user/personal'" target="_blank"><el-button slot="button" class='btn-approve' type="primary">立即认证</el-button></nuxt-link>
      </div>
  </div>
</template>
<script type="text/javascript">
import { pagingList } from 'utils/mixins'
import { mapGetters } from 'vuex'
export default {
  mixins: [pagingList],
  computed: {
    ...mapGetters({
      serviceInfo: 'personal/service'
    })
  },
  data () {
    return {
      approveImg: '/resources/images/has_approve.jpg',
      unApproveImg: '/resources/images/not_approve.jpg',
      // this.query分页调用
      query: this.getQuery({
        page: this.$route.query.page,
        rows: this.$route.query.rows || 5,
        type: '2',
        shared: '0',
        fans: '0'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.approve-content{
    text-align: center;
    .mbtn{
      margin-top: 30px;
    }
    .btn-approve{
      margin-top: 10px;
    }
    .btn-unText{
      margin-top: 30px;
    }
    .btn{
      padding: 10px 20px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background: #01a87c;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      -ms-border-radius: 3px;
      -o-border-radius: 3px;
      border-radius: 3px;
    }
    .approve-btn {
      width: 120px;
      margin: 0 auto;
      margin-top: 30px;
    }
    .unapprove{
      min-height: 420px;
      margin-top: 30px
    }
}
.service-box{
  .approve-infor {
      padding: 20px 40px;
  }
  .mod-h1 {
    padding: 0 0 20px;
    color: #333;
    font-size: 18px;
    position: relative;
    line-height: 20px;
    font-weight: 500;
  } 
  .mod-h1:after {
    float: left;
    margin-right: 10px;
    vertical-align: middle;
    content: "";
    width: 4px;
    height: 20px;
    background: #01a87c;
  }
  p.list {
    padding: 5px 0;
  }
  .description {
    margin-left: 50px;
  }
  .fl{
    float: left;
  }
  .approve-icon {
    display: inline-block;
    height: 14px;
    margin-left: 8px;
  }
}
</style>

