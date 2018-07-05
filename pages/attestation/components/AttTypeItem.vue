<template>
  <div class="attTypeItem" :class="typeName==='个人认证'?'person':'org'">
    <e-cellbox middle class="top">
      <e-cell-item>
        <i class="icon iconfont" :class="icon"></i>
        <p class="title">{{typeName}}</p>
      </e-cell-item>
    </e-cellbox>  
    <div class="bottom">
      <li v-for="(item, index) in rightList" :key="index">{{(index + 1) + '.' +item.serviceName}}</li>
    </div>
  </div>     
</template>
<script type="text/javascript">
  import api from 'api/attestation'
  export default {
    props: {
      type: {
        type: String
      },
      authCateId: {
        type: String
      }
    },
    data () {
      return {
        typeName: '个人认证',
        icon: 'icon-renzheng',
        rightList: [
          {serviceName: '钱包提现功能'},
          {serviceName: '更多新功能即将开放...'}
        ]
      }
    },
    created () {
      if (this.type === 'userOrg' && this.authCateId) {
        this.getOrgRight()
      } else {
        this.getBaseRight()
      }
      this.getTypeName()
    },
    methods: {
      getOrgRight () {
        api.getOrgRight({authCateId: this.authCateId}, {contexts: this, successMsg: 'none'}).then(res => {
          this.rightList = res.data || []
        })
      },
      getBaseRight () {
        if (this.type === 'userPerson') {
          this.rightList = [
            {serviceName: '点亮认证图标'},
            {serviceName: '更多新功能即将开放...'}
          ]
        }
      },
      getTypeName () {
        if (this.type.indexOf('Org') === -1) {
          this.typeName = '个人认证'
          this.icon = 'icon-gerenrenzheng1'
        } else {
          this.typeName = '组织认证'
          this.icon = 'icon-orgnize'
        }
      }
    }
  }
</script>
<style lang="scss">
  
  .attTypeItem{
    border: 1px solid $border-color-base;
    margin-right: 20px;
    &:hover{
      cursor: pointer;
    }
    .top{
      text-align: center;
      height: 170px;
      i{
        color: white;
        font-size: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        padding: 20px;
      }
      .title{
        font-size: 18px;
        color: white;
        margin-top: 15px;
      }
    }
    .bottom{
      padding: 15px;
      min-height: 200px;
      height: 100%;
      li{
        list-style: none;
        color: $color-black-base;
        display: inline-block;
        margin-right: 20px;
      }
    }
    &.person{
      .top{
        background: $color-primary;
      }
      &:hover{
        border-color: $color-primary;
      }
    }
    &.org{
      .top{
        background: #ff9821;
      }
      &:hover{
        border-color: #ff9821;
      }
    }
  }
</style>