<template>
  <e-cellbox middle class="status-box" v-if="data">
    <e-cell-item>
      <i class="icon iconfont icon-success" 
        :class="(data.authStatus == 1) ? 'icon-success icon-icon11-copy' : 'icon-error icon-tijiaoshibai'"></i>
      <!--审核中-->
      <div v-if="data.authStatus == 1">
        <p class="title-success">
          <span>您已成功提交认证申请！</span>
        </p>
        <p class="tip">我们会在3个工作日内完成审核工作！<br>请您耐心等待结果！</p>
      </div>
      <!--未通过-->
      <div v-else-if="data.authStatus == 2">
        <p class="title-error">
          <span>您的信息未通过审核</span>
        </p>
        <el-row>
          <el-col :span="11" class="text-right">申请认证类型：</el-col>
          <el-col :span="13" class="text-left"><strong>{{data.authType == 1 ? '个人' : '组织'}}-{{data.authIpCateName}}{{data.authCateName}}</strong></el-col>
        </el-row>
        <el-row class="color-error">
          <el-col :span="11" class="text-right">失败原因：</el-col>
          <el-col :span="13" class="text-left"><strong>{{data.authNote ? data.authNote : '--'}}</strong></el-col>
        </el-row>
        <el-button type="primary" @click="editInfo()">修改资料，再次申请</el-button>
      </div>
      <div v-else-if="data.authStatus == 4">
        <p class="title-error">
          <span>您的信息已撤销认证</span>
        </p>
        <el-row>
          <el-col :span="11" class="text-right">申请认证类型：</el-col>
          <el-col :span="13" class="text-left"><strong>{{data.authType == 1 ? '个人' : '组织'}}-{{data.authIpCateName}}{{data.authCateName}}</strong></el-col>
        </el-row>
        <el-row class="color-error">
          <el-col :span="11" class="text-right">撤销原因：</el-col>
          <el-col :span="13" class="text-left"><strong>{{data.authNote ? data.authNote : '--'}}</strong></el-col>
        </el-row>
        <el-button type="primary" @click="editInfo()">修改资料，再次申请</el-button>
      </div>
    </e-cell-item>
  </e-cellbox>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import api from 'api/attestation'
  export default {
    props: {
      data: {
        type: Object
      }
    },
    computed: {
      ...mapGetters({
        org_form: 'org_form',
        user_form: 'user_form'
      })
    },
    created () {
    },
    methods: {
      editInfo () {
        if (this.data.authType === 2) {
          this.$router.push({path: '/attestation/user/organization/message', query: {edit: 1}})
        } else if (this.data.authType === 1) {
          this.$router.push({path: '/attestation/user/personal/message', query: {edit: 1}})
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .status-box{
    height: 500px;
    border-bottom: 1px solid $border-color-base;
    text-align:center;
    margin-bottom: 30px;
    .icon{
      font-size: 60px;
    }
    .icon-success{
      color: $color-primary;
    }
    .title-success,.title-error{
      font-size: 24px;
      margin: 5px 0px 10px;
    }
    .title-success{
      color: $color-primary;
    }
    .tip{
      font-size: 12px;
      color: $color-sub;
      margin-bottom: 20px;
    }
    .icon-error,.title-error{
      color: $color-error;
    }
    .text-right{
      text-align: right;
    }
    .text-left{
      text-align: left;
    }
    .color-error{
      color: $color-error;
      margin-bottom: 50px;
    }
  }
</style>