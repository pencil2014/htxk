<template>
  <div class="content-type">
    <e-heading grade="1">选择认证类型</e-heading>
    <p class="type-title">认证账号相比普通账号，将来会拥有更多特权，而不同类型的认证账号之间，拥有的权限也会不一样，特权功能正在拼命完善中，敬请期待!</p>
     <el-form res="form">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in typeList.data" :key="index">
          <div class="type-box" :class="{'active': item.ipCateId == typeIndex.ipCateId}" @click="typeIndex = item">
            <type-item :item='{icon: item.pcImgUrl, title: item.cateName}'>
              <p v-if="item.ipAuthServiceList" v-for="(subItem, subIndex) in item.ipAuthServiceList" :key="subIndex">
                <i class="icon iconfont icon-gou"></i>
                <span>{{subItem.serviceName}}</span><br />
              </p>
            </type-item>
          </div>
        </el-col>
      </el-row>
     </el-form>
      <div class="button-box">
        <el-button type="default" @click="toLastStep()">上一步</el-button>
        <el-button type="primary" @click="next()" :disabled="!typeIndex.ipCateId">下一步</el-button>
      </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import TypeItem from '@/pages/attestation/components/TypeItem'
  import api from 'api/attestation'
  export default {
    layout: 'manage',
    components: {
      TypeItem
    },
    props: {
      activeChange: {
        type: Function
      }
    },
    computed: {
      ...mapGetters({
        form: 'org_form'
      })
    },
    created () {
      this.typeIndex.ipCateId = this.form.authCateId || ''
      this.activeChange(2)
      this.typeListFn()
    },
    data () {
      return {
        typeIndex: {},
        typeList: '',
        list: []
      }
    },
    methods: {
      toLastStep () {
        this.$router.go(-1)
      },
      typeListFn () {
        api.categories(' ', {context: this, successMsg: 'none'}).then((json) => {
          this.typeList = json
          // console.log(this.typeList, 4343434)
        })
      },
      next () {
        this.form.authCateId = this.typeIndex.ipCateId
        this.$router.push({path: '/attestation/user/organization/message'})
      }
    }
  }
</script>

<style lang="scss">
  
  .content-type{
    .el-form{
      margin-top: 50px;
    }
    .type-box{
      width:100%;
      height: 370px;
      border:2px $border-color-base solid;
      padding:20px;
      margin-bottom: 30px;
      overflow: hidden;
      &:hover{
        border:2px $color-primary solid;
        cursor:pointer;
      }
    }
    .active{
      border:2px $color-primary solid;
      cursor:pointer;
    }
  }

  
</style>
