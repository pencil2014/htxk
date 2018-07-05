<template>
  <div class="logisticsBox" v-loading="loading" element-loading-text="拼命加载中">
    <div class="logistics" v-if="logisticsInfo">
      <h3 class="status"> 物流状态：<span>{{logisticsInfo.status | formatStatus}}</span></h3>
      <div class="stepBox">
        <el-steps :space="80" :active="1" class="steps-primary" direction="vertical">
          <el-step v-for="(item,index) in logisticsInfo.datas" :title="item.status" :description="item.time" :key="index"><i slot="icon"></i></el-step>
        </el-steps>
        <div class="express">
          <e-img  :src="logisticsInfo.goodsImg" :size="[60,60]" />
          <p>承运来源：{{logisticsInfo.comName}}<br/>
            运单编号：{{logisticsInfo.no}}</p> 
        </div>
      </div>
    </div>
    <e-placeholder v-else  text="没有相关快递信息！"/>
  </div>
</template>

<script>
import api from 'api/ticket_card'
import {ElSteps, ElStep} from '@element-ui/Steps'
export default {
  props: {
    orderNumber: {
      type: String,
      required: true,
      default: ''
    }
  },
  components: {
    ElSteps,
    ElStep
  },
  data () {
    return {
      loading: true,
      logisticsInfo: ''
    }
  },
  filters: {
    formatStatus (val) {
      let data = {
        0: '在途',
        1: '揽件',
        2: '疑难',
        3: '签收',
        4: '退签',
        5: '派件',
        6: '退回'
      }
      return data[val]
    }
  },
  methods: {
    // 获取快递信息
    getLogisticsInfo () {
      api.logisticsInfo({orderNumber: this.orderNumber})
        .then((res) => {
          this.loading = false
          this.logisticsInfo = res.data[0]
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
    }
  },
  mounted () {
    this.getLogisticsInfo()
  }
}
</script>
<style lang="scss" scoped>
.logisticsBox{
  min-height: 200px;
  margin: 0 -10px;
  .logistics{
    max-height: 400px;
    overflow: auto;
    .status{
      margin-bottom: 30px;
      font-weight: normal;
      font-size: 16px;
      span{
        color: #00bb90;
      }
    }
    .express{
      overflow: hidden;
      margin-top: 30px;
      font-size: 12px;
      img{
        float: left;
        margin-right: 15px;
      }
      p{
        line-height: 1.5;
      }
    }
  }
}
</style>
<style>
.logistics .el-steps.steps-primary .el-step.is-vertical .el-step__head{
  width: 10px;
  height: 10px;
}
.logistics .el-steps.steps-primary .el-step.is-vertical .el-step__line.is-vertical{
  left: 4px;
  top: 10px
}
.logistics .el-steps.steps-primary .el-step.is-vertical .el-step__title{
  font-size: 14px;
}
.logistics .el-step__description{
  font-size: 12px;
}
</style>

