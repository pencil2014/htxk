<template>
  <div class="status-item">
    <i class="icon iconfont icon-icon11-copy icon-success" :class="status == 0 ? 'icon-success' : 'icon-error'"></i>
    <p :class="status == 0 ? 'title-success' : 'title-error'">
      <span v-if="status == 0">您已成功提交认证申请</span>
      <span v-else>您的认证申请提交失败</span>
    </p>
    <p class="tip" v-if="status == 0">我们会在3个工作日内完成审核工作！<br>请您耐心等待结果！</p>
    <el-button type="primary" v-if="status == 0" @click="sure">确定</el-button>
     <el-button type="danger" v-else @click="resubmit">重新提交</el-button>
  </div>
</template>


<script>
  import { mapGetters, mapState } from 'vuex'
  import api from 'api/attestation'
  export default {
    props: {
      status: {
        type: Number
      },
      type: {
        type: String,
        default: 'user'
      }
    },
    computed: {
      ...mapGetters({
        org_form: 'org_form',
        user_form: 'user_form'
      }),
      ...mapState({
        userSection: state => state.user.session
      })
    },
    created () {
    },
    methods: {
      sure () {
        if (this.userSection.authType === 2) { // authType 1是个人，2是组织   认证类型
          this.$store.commit('SET_ORG_FORM')
        } else {
          this.$store.commit('SET_USER_FORM')
        }
        this.$router.push({path: '/attestation/user'})
      },
      resubmit () {
        if (this.userSection.authType === 2) { // authType 1是个人，2是组织   认证类型
          // 调用组织认证提交接口
          let orgData = Object.assign({}, this.org_form)
          console.log(orgData, 333333)
          api.orgInsert(orgData, {content: this, successMsg: 'none'}).then((json) => {
            if (json.result) {
              this.$router.push({path: '/attestation/user/personal/commit', query: {status: json.result}})
            }
          })
        } else {
          // 调用个人认证提交接口
          let userData = Object.assign({}, this.user_form) // 复制一个新的数据对象
          api.userAttest(userData, {context: this, successMsg: 'none'}).then((json) => {
            let status = parseInt(json.result)
            this.$router.push({path: '/attestation/user/personal/commit', query: {status: status}})
            this.$store.commit('SET_USER_FORM') // 点提交的时候需要重置表单
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .status-item{
    text-align:center;
    .icon{
      font-size: 60px;
      line-height: 60px;
    }
    .icon-success{
      color:$color-primary;
    }
    .title-success,.title-error{
      font-size: 24px;
      margin:15px 0px;
    }
    .title-success{
      color:$color-primary;
    }
    .tip{
      font-size:12px;
      color:$color-sub;
      margin-bottom: 20px;
    }
    .icon-error,.title-error{
      color:$color-error;
    }
  }
</style>