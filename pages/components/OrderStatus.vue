<template>
  <div class="order-status" >
    <!-- 
      规则：
      默认使用后端提供的提示语；
      提示语中有时间的，替换成倒计时

      订单提示语：
      处理提示语，如果有 timeExpireSecond单位是秒 ———— 普通的转成 时：分（12:20 ），大于一小时的转成 时：分：秒（01:12:20 ）
     -->
    <span v-if="!orderTimeout && !timeExpireSecond" >{{attach}}</span>
    <span  v-if="!orderTimeout && timeExpireSecond && showFlag"   >
      {{leftText}}
      <i :class="{'color': color}">{{countdown}}</i>
      {{rightText}}
    </span>
    <span  v-if="orderTimeout" >
      订单超时(已关闭)，请重新下单
    </span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      default: true
    },
    attach: { // 后端的提示语
      default: ''
    },
    timeExpireSecond: { // 单位是秒
      default: 0
    }
  },
  data () {
    return {
      showFlag: false,
      leftText: '',
      countdown: '',
      rightText: '',
      timer: '', // 定时器
      orderTimeout: false
    }
  },
  mounted () {
    if (this.timeExpireSecond) {
      let text = this.attach // 提示语
      let reg = /[0-9]+(分钟|小时)/g
      let res = text.match(reg) // 匹配不到就是null，否则匹配到谁就是谁
      if (res) { // 只用倒计时替换掉第一个匹配上的,匹配到多个相同的时间也只替换第一个时间
        this.tipsAction()
        let resArr = text.split(res[0])
        this.leftText = resArr[0]
        let str = ''
        for (let i = 0; i < resArr.length; i++) {
          if (i > 0) {
            if (i < res.length) {
              str += resArr[i] + res[i]
            } else {
              str += resArr[i]
            }
          }
        }
        this.rightText = str
      }
    }
  },
  methods: {
    tipsAction () {
      let second = this.timeExpireSecond
      this.timer = setInterval(() => {
        if (second > 0) {
          --second
          this.countdown = this.secondToDate(second)
        } else { // 订单超时(已关闭)，请重新下单
          clearInterval(this.timer)
          this.orderTimeout = true
        }
      }, 1000)
    },
    secondToDate (second) {
      Number(second)
      let h = Math.floor(second / 3600)
      h = h < 10 ? '0' + h : h
      let m = Math.floor((second / 60 % 60))
      m = m < 10 ? '0' + m : m
      let s = Math.floor((second % 60))
      s = s < 10 ? '0' + s : s
      if (!this.showFlag) {
        this.showFlag = true
      }
      return h > 0 ? h + ':' + m + ':' + s : m + ':' + s
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.order-status{
  height: 24px;
  i{
    font-style: normal;
    padding: 0 3px;
  }
  .color{
    color: #fd6f01;
  }

}
</style>
