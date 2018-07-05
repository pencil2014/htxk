<template>
  <div class="attinfo">
    <div v-if="data && data.authStatus">
      <el-row>
        <el-col :span="4" class="title">{{(data.authStatus == 3 || type=='name')?'认证类型':'申请认证类型'}}：</el-col>
        <el-col :span="17" :offset="1" class="name">
          <div v-if="type=='name'" class="fl">
            <span>{{status}}</span>
            <span>
              {{(data.idName?data.idName:'')}}
              {{(data.authName?data.authName:'')}}
            </span>
          </div>
          <text v-if="type == 'user'">{{data.authType == 1 ? '个人-' : '组织-'}}</text>
          <span class="fl">
            {{data.authIpCateName?data.authIpCateName:''}}
          </span>
          <nuxt-link :to="personHref" class="detail" v-if="data.authType == 1">查看详情</nuxt-link>
          <nuxt-link :to="orgHref" class="detail" v-else>查看详情</nuxt-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="title">{{(data.authStatus == 3 || type=='name')?'拥有的特权':'对应的特权'}}：</el-col>
        <el-col :span="17" :offset="1">
          <div v-if="!data.ipAuthServices">
            <li 
              v-for="(item, index) in rightList" 
              :key="index">{{(index + 1) + '.' + item.serviceName}}</li>
          </div>
          <div v-else-if="data.ipAuthServices && data.ipAuthServices.length>0">
            <li v-for="(item, index) in data.ipAuthServices" 
              :key="index">{{(index + 1) + '.' + item.serviceName}}</li>
          </div>
          <li v-else>无</li>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="4" class="title">认证类型：</el-col>
        <el-col :span="17" :offset="1">未认证
          <span class="error">马上认证，获得更多特权！</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="title">拥有的特权：</el-col>
        <el-col :span="17" :offset="1">无</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      type: {
        type: String
      },
      data: {},
      orgHref: {
        type: String
      },
      personHref: {
        type: String
      }
    },
    data () {
      return {
        status: ''
      }
    },
    watch: {
      data (value) {
        // this.baseData()
      }
    },
    created () {
      this.baseData()
    },
    methods: {
      baseData () {
        console.log(this.type)
        if (this.type === 'name') {
          this.rightList = [
            {serviceName: '钱包提现功能'},
            {serviceName: '更多新功能即将开放...'}
          ]
          if (this.data && this.data.authStatus) {
            switch (this.data.authStatus) {
              case 1:
                this.status = '已认证'
                break
              case 0:
                this.status = '未认证'
                break
            }
          }
        } else if (this.type === 'user') {
          this.rightList = [
            {serviceName: '点亮认证图标'},
            {serviceName: '更多新功能即将开放...'}
          ]
          if (this.data && this.data.authStatus) {
            switch (this.data.authStatus) {
              case 0:
                this.status = '未认证'
                break
              case 1:
                this.status = '认证中'
                break
              case 2:
                this.status = '未通过'
                break
              case 3:
                this.status = '已认证'
                break
            }
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .attinfo{
    padding: 20px 0;
    background: $color-background-base;
    .title{
      text-align: right;
      color: $color-black-base;
      margin-bottom: 20px;
    }
    .name{
      font-size: 16px;
      font-weight: bold;
      span{
        margin-right: 20px;
      }
    }
    .error{
      margin-left: 50px;
      color: $color-black-base;
    }
    li{
      list-style: none;
      color: $color-black-base;
      display: inline-block;
      margin-right: 20px;
    }
    .detail{
      font-size: 14px;
      margin-left: 20px;
      color: $color-link;
    }
    .fl{
      float: left;
    }
  }
</style>
