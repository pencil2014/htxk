<template>
  <div class="cardinfo">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/card/' }">服务卡</el-breadcrumb-item>
      <el-breadcrumb-item>服务卡详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content" v-loading="loading" element-loading-text="拼命加载中">
      <div class="card-detail">
        <div class="left">
          <div class="title" :title="detail.cardName ">{{detail.cardName }}</div>
          <div class="info">
            <span class="links">
              <el-button type="success" @click="goorder">查看订单</el-button>
              <el-button  @click="gogoods">查看商品</el-button>
            </span>
            <span class="value" v-if="detail.usageCount||detail.usageCount ===0"><b>{{detail.usageCount}}</b>{{detail.usageUnit}}</span>
          </div>
        </div>
        
        <div :class="['card-info', typestyle]">
          <h3>{{detail.busType | formatType}}</h3>
          <p class="text" :title="detail.cardNo">卡 号：{{detail.cardNo}}</p>
          <p class="text">有效期：<span v-if="detail.startTime">{{detail.startTime | formatTime}} ~ {{detail.endTime | formatTime}}</span><span v-else>--</span></p>
          <div :class="['status', {'noactive': detail.state === 1}, {'available': (detail.state === 2 || detail.state === 3)}, {'unavailable': (detail.state === 4 || detail.state === 5 || detail.state === 6)}]">
            {{detail.state | formatStatus}}
          </div>
        </div>
      </div>
      <div class="border"></div>
      <div class="progress">
        <common-card :id="detail.cardNo" :state="detail.state" v-if="detail.busType===0"/>
        <ticket-card :id="detail.cardNo" :state="detail.state" :orderNumber="detail.orderNumber" v-if="detail.busType===3"/>
      </div>
    </div>
  </div>
</template>
<script>
import api from 'api/card'
import CommonCard from './common'
import TicketCard from './ticket'
export default {
  layout: 'manage',
  components: {
    CommonCard,
    TicketCard
  },
  methods: {
    // 获取数据
    getDetail () {
      api.cardDetail({cardNo: this.detail.cardNo})
        .then((res) => {
          this.detail = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          setTimeout(() => {
            this.$router.push('/manage/card/')
          }, 1000)
        })
    },
    // 进入订单详情
    goorder () {
      let routeData = this.$router.resolve(`/manage/order/detail?orderNumber=${this.detail.orderNumber}`)
      window.open(routeData.href, '_blank')
    },
    gogoods () {
      // let routeData = this.$router.resolve(`/goods/detail/${this.detail.goodsCode}`)
      let routeData = this.$router.resolve(this.detail.nextStepUrl)
      window.open(routeData.href, '_blank')
    }
  },
  filters: {
    formatType (value) {
      let type = ['普通服务卡', '赛事服务卡', '培训服务卡', '票务服务卡']
      return type[value]
    },
    formatStatus (value) {
      let status = {
        1: '未激活',
        2: '可使用',
        3: '已完成',
        4: '不可用',
        5: '已终止',
        6: '已冻结'
      }
      return status[value]
    },
    formatTime (value) {
      return value ? value.split(' ')[0] : ''
    }
  },
  computed: {
    typestyle () {
      let type = ['white', 'blue', 'orange', 'black']
      return type[this.detail.busType]
    }
  },
  data () {
    return {
      detail: {},
      loading: true
    }
  },
  mounted () {
    this.detail.cardNo = this.$route.query.cardNo
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>

.content {
  padding-top: 40px;
  .card-detail {
    overflow-y: hidden;
    .left {
      float: left;
      width: 60%;
      .title {
        font-size: 18px;
        font-weight: bold;
        height: 62px;
        overflow:hidden; 
        text-overflow:ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
      }
      .info {
        padding-top: 15px;
        margin-top: 15px;
        .value {
          display: inline-block;
          margin-left: 20px;
          vertical-align: middle;
          b {
            font-size: 30px;
            margin-right: 5px;
            color: #fe0000;
          }
        }
        .links {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    .card-info {
      position: relative;
      float: right;
      width: 260px;
      height: 140px;
      border-radius: 10px;
      color: #fff;
      padding: 20px;
      margin-top: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      &.white {
        background-color: #cecccd;
      }
      &.blue {
        background-color: #2774cc;
      }
      &.orange {
        background-color: #d38619;
      }
      &.black {
        background-color: #43768f;
      }
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;

      }
      .text {
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        word-break: break-all;
      }
    }
    .status {
        position: absolute;
        font-size: 12px;
        color: $color-white;
        width: 100px; 
        height: 30px;
        right: -30px;
        top: 5px;
        line-height: 30px;  
        text-align: center;
        transform: rotate(45deg);
        &.available {
          background-color: #70d77b;
        }
        &.unavailable {
          background-color: #c1c1c1;
        }
        &.noactive {
          background-color: #e94141;
        }
      }
  }
  .border {
    height: 20px;
    background-color: #ebf0f6;
    margin: 40px -60px 0;
  }
}
</style>