<template>
  <div class="holderBox">
    <div class="holder" v-if="holderInfo">
      <p><span>收 件 人：</span><b>{{holderInfo.name || '--'}}</b></p>
      <p><span>联系方式：</span><b>{{holderInfo.mobile || '--'}}</b></p>
      <p v-show="holderInfo.address"><span>收货地址：</span><b>{{holderInfo.address || '--'}}</b></p>
      <p v-show="holderInfo.idNo"><span>身份证号码：</span><b>{{holderInfo.idNo || '--'}}</b></p>
    </div>
    <e-placeholder v-else  text="没有相关取票人信息！"/>
  </div>
</template>
<script>
import api from 'api/ticket_card'
export default {
  props: {
    orderNumber: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      holderInfo: ''
    }
  },
  methods: {
    // 获取取票人数据
    getTicketHolderInfo () {
      api.ticketHolderInfo({orderNumber: this.orderNumber})
        .then((res) => {
          this.holderInfo = res.data
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getTicketHolderInfo()
  }
}
</script>
<style lang="scss" scoped>
.holderBox{
  margin: -10px -10px 0;
  .holder{
    p{
      line-height: 2;
      span {
        display: inline-block;
        width: 100px;
      }
      b{
        font-weight: normal;
      }
    }
  }
}

</style>

