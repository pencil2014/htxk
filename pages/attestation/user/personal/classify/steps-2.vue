<template>
  <div class="">
    <steps-item v-for="(item, index) in list" 
      :key="index" 
      :active="value && value.ipCateId && item.ipCateId == value.ipCateId"
      :only-font="value && value.ipCateId && item.pcImgTxtUrl">
      <slot>
        <div @click="handleChange(item)">
          <img :src="item.pcImgUrl">
          <p>{{item.cateName}}</p>
        </div>
      </slot>
    </steps-item>
  </div>
</template>
<script>
  import StepsItem from './StepsItem'
  import api from 'api/attestation'
  export default {
    components: {
      StepsItem
    },
    props: {
      change: {
        type: Function
      },
      handleActive: {
        type: Function
      },
      ipCateIdArray: {
        type: Array
      }
    },
    data () {
      return {
        value: this.ipCateIdArray[1],
        list: []
      }
    },
    created () {
      this.handleActive(2)
      if (this.ipCateIdArray[0] && this.ipCateIdArray[0].ipCateId) {
        api.getUserPersonType({parentId: this.ipCateIdArray[0].ipCateId}, {context: this, successMsg: 'none'}).then((json) => {
          if (json.data && json.data.length > 0) {
            this.list = json.data
          } else {
            this.$router.push({path: '/attestation/user/personal/message'})
          }
        })
      } else {
        this.$router.push({path: '/attestation/user/personal/classify/steps-1'})
      }
    },
    methods: {
      handleChange (item) {
        this.value = item
        this.change(1, this.value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  img{
    width: 50px !important;
    height: 50px !important;
  }
  P{
    margin-top: 5px;
    font-size: 14px; 
  }
</style>
