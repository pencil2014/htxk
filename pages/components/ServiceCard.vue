<template>
  <div class="service-card match">
    <p class="card-type">{{type == 1 ? '赛事': '培训'}}服务卡</p>
    <p class="small">卡号：{{cardNumber}}</p>
    <p class="small">有效期：{{new Date(validDate[0]).format('yyyy.MM.dd')}}-{{new Date(validDate[1]).format('yyyy.MM.dd')}}</p>
    <div class="state"
      :class="{
        unActive: status === 1,
        complete: status === 2,
        over: status === 3
      }">
      {{stateText}}
    </div>
  </div>
</template>
<script>
export default{
  props: {
    type: Number,
    cardNumber: String,
    validDate: Array,
    status: {
      Type: Number,
      default: 1
    }
  },
  computed: {
    stateText () {
      if (this.status === 1) {
        return '未激活'
      } else if (this.status === 2) {
        return '已完成'
      } else {
        return '已终止'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.service-card{
  position: relative;
  width: 266px;
  border-radius: 10px;
  padding: 20px 25px 30px;
  color: #fff;
  overflow: hidden;
  background: linear-gradient(to top right, #1a65bb,  #4292f3);
  .card-type{
    font-size: 18px;
    margin-bottom:24px;
  }
  p.small{
    font-size: 12px;
  }
  .state{
    position: absolute;
    right:-26px;
    top: 14px;
    transform: rotate(45deg);
    width: 100px;
    text-align: center;
  }
  .unActive{
    background-color: #e94141;
  }
  .complete{
    background-color: #6cd372;
  }
  .over{
    background-color: #c1c1c1;
  }
}

</style>
