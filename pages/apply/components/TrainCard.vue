<template>
<div class="content top-content">
  <e-cellbox middle>
    <e-cell-item>
      <h1 class="goods">{{cardInfo.courseName}}</h1>
      <slot></slot>
      <el-button type="normal" @click="handleGoodsDetail">查看商品</el-button>
    </e-cell-item>
    <e-cell-item class="train-card">
      <div class="card-type">
        <e-cellbox middle>
          <e-cell-item>
            {{cardInfo.cardName}}
          </e-cell-item>
          <e-cell-item v-if="cardInfo.usageCount && cardInfo.usageCount != ''">
            {{`${cardInfo.usageCount}${cardInfo.usageUnit}`}}可用
          </e-cell-item>
        </e-cellbox>
      </div>
      <div class="small">卡号：{{cardInfo.cardNo}}</div>
      <div class="small" v-if="cardInfo.cardType != 1">
        <div v-if="cardInfo.cardType == 2">
           <span v-if="cardInfo.endTime">有效期：{{new Date(cardInfo.startTime).format('yyyy/MM/dd')}} - {{new Date(cardInfo.endTime).format('yyyy/MM/dd')}}</span>
           <span v-else>有效期：长期有效</span>
        </div>
        <div v-else>有效期：长期有效</div>
      </div>
      <!-- 
          unActive 未激活
          completed 已完成
          terminated 已终止
          unUsed 不可用
      -->
      <div class="state" :class="styleStatus">
        {{STATUS_STATE[cardInfo.state]}}
      </div>
    </e-cell-item>
  </e-cellbox>
</div>
</template>
<script>
import {STATUS_STATE, STYLE_STATUS} from './constant' // 服务卡的状态

export default{
  props: {
    cardInfo: Object
  },
  computed: {
    styleStatus () {
      return STYLE_STATUS[this.cardInfo.state]
    }
  },
  data () {
    return {
      STATUS_STATE
    }
  },
  methods: {
    handleGoodsDetail () {
      window.open('/goods/t/' + JSON.parse(sessionStorage.getItem('sessionNextPage'))[0].goodsCode)
    }
  }
}
</script>
<style lang="scss" scoped>
.top-content {
  min-height: 200px;
  padding: 25px 60px;
  .goods {
    font-size: 20px;
    padding-bottom: 30px;
    max-width: 600px;
    word-wrap:break-word
  }
  .train-card {
    position: relative;
    width: 266px;
    height: 148px;
    border-radius: 10px;
    padding: 20px 25px 30px;
    color: #fff;
    overflow: hidden;
    background: linear-gradient(to top right, #d4851e,  #d28a03);
    .card-type {
      font-size: 18px;
      margin-bottom:24px;
    }
    .small {
      font-size: 12px;
      padding-left: 5px;
    }
    .state {
      position: absolute;
      right:-26px;
      top: 14px;
      transform: rotate(45deg);
      width: 100px;
      text-align: center;
    }
    .unActive {
      background-color: #e94141;
    }
    .completed {
      background-color: #6cd372;
    }
    .useable {
      background-color: #6cd372;
    }
    .terminated {
      background-color: #c1c1c1;
    }
    .unUsed {
      background-color: #c1c1c1
    }
  }
}
</style>
