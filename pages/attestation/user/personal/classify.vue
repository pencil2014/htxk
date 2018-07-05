<template>
  <div class="">
    <div class="classify-menu">
      <nuxt-link to="/attestation/user/personal/classify/steps-1" v-if="active>=1">
        <li :class.async="active<=1?'active':''">
          <span>{{(this.form.ipCateIdArray[0] && this.form.ipCateIdArray[0].cateName && active!=1)?this.form.ipCateIdArray[0].cateName:'选择认证类型'}}</span>
        </li>
      </nuxt-link>
      <nuxt-link to="/attestation/user/personal/classify/steps-2" v-if="active>=2">
        <li :class.async="active==2?'active':''">
          <span>{{(this.form.ipCateIdArray[1] && this.form.ipCateIdArray[1].cateName && active!=2)?this.form.ipCateIdArray[1].cateName:'选择二级类型'}}</span>
        </li>
      </nuxt-link>
      <nuxt-link to="/attestation/user/personal/classify/steps-3" v-if="active>=3">
        <li :class.async="active==3?'active':''">
          <span>选择三级类型</span>
        </li>
      </nuxt-link>
    </div>
    <el-row>
      <nuxt-child 
        :change="handleChange" 
        :handle-active="handleActive" 
        :ipCateIdArray="this.form.ipCateIdArray">
      </nuxt-child>
    </el-row>
    <div class="button-box">
      <el-button type="primary" 
        :disabled="!((form.ipCateIdArray[active-1] && form.ipCateIdArray[active-1].cateName) || lock)" 
        @click="toNext(active)">下一步</el-button>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    layout: 'manage',
    computed: {
      ...mapGetters({
        form: 'user_form'
      })
    },
    components: {
    },
    data () {
      return {
        active: '',
        lock: false
      }
    },
    created () {
      this.active = this.form.ipCateIdArray.length - 1
    },
    methods: {
      handleChange (index, item) {
        this.form.ipCateIdArray[index] = item
        this.lock = true
        console.log(this.form.ipCateIdArray)
      },
      handleActive (value) {
        this.form.ipCateIdArray = this.form.ipCateIdArray.slice(0, value)
        this.active = value
      },
      toNext (index) {
        if (index !== 3) {
          this.$router.push({path: '/attestation/user/personal/classify/steps-' + (index + 1)})
        } else {
          this.$router.push({path: '/attestation/user/personal/message'})
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .classify-menu{
    border-bottom: 1px solid $border-color-base;
    height: 50px;
    margin-bottom: 40px;
    li{
      height: 50px;
      text-align: center;
      min-width: 130px;
      font-size: 16px;
      float: left;
      list-style: none;
      span{
        line-height: 20px;
        margin-top: 15px;
        border-right: 1px solid $border-color-base;
        display: block;
        padding: 0 20px;
      }
      &.active, &:hover{
        border-bottom: 2px solid $color-primary;
        color: $color-primary;
      }
    }
  }
  .button-box{
    margin-top: 100px;
  }
</style>
