<template>
  <div  v-if='bannerList'>
    <div class='detail-swiper'>
      <div class="detail-box" @mouseenter='mouseenterAction'  @mouseleave='startMove' >
        <ul class="detail-inner-box">
          <li v-for='(item, index) in bannerList' :key='index' v-if='item'>
            <x-img   :size='[400,400]'  :alt='goodsName' :src='item.goodsImgUrl' @error="handleError" />
          </li>
          <li v-if='bannerList[0]'>
            <x-img  :size='[400,400]' :alt='goodsName' :src='bannerList[0].goodsImgUrl' @error="handleError" />
          </li>
        </ul>
        <ol class="detail-ol" v-show='bannerList.length > 1'>
          <li li v-for='(item, index) in bannerList.length' :key='index' :class="{'btn-active': index === i }"  @click='btnAction(index, item)' ></li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    autoplay: {
      default: 4000,
      type: Number
    },
    bannerList: {
      required: true,
      type: Array
    },
    goodsName: {
      type: String
    }
  },
  data () {
    return {
      bannerBackgroundColerList: [],
      oUl: null,
      cur: 0,
      swiperInterval: null,
      target: 0,
      timer1: null,
      i: 0,
      oLi: null
    }
  },
  mounted () {
    this.oBox = document.querySelector('.detail-box')
    this.oUl = document.querySelector('.detail-inner-box')
    this.oUl.style.width = (this.bannerList.length + 1) * 100 + '%' // 设置内部盒子的宽度，后面补充了一张图片
    var oOl = document.querySelector('.detail-ol')
    this.oLi = oOl.getElementsByTagName('li')
    this.startMove()
  },
  beforeDestroy () {
    clearInterval(this.swiperInterval)
  },
  methods: {
    startMove () {
      if (this.bannerList.length > 1) {
        this.swiperInterval = setInterval(this.autoPlay, this.autoplay)
      }
    },
    btnAction (index) {
      this.target = -(index * 100)
      this.sport(this.target)
      this.btnBottom()
    },
    autoPlay () {
      if (this.target <= -(this.bannerList.length * 100)) {
        this.cur = 0
        this.target = -100
      } else {
        this.target -= 100
      }
      this.sport(this.target)
      this.btnBottom()
    },
    btnBottom () {
      this.i = -(this.target / 100)
      this.i = (this.i === this.bannerList.length) ? 0 : this.i
    },
    sport () {
      clearInterval(this.timer1)
      this.timer1 = setInterval(this.autoPlay2, 30) // 设置定时器每30毫秒执行一次
    },
    autoPlay2 () {
      if (this.cur === this.target) {
        clearInterval(this.timer1) // 大于目标值时，清空计时器
      } else {
        let speed = (this.target - this.cur) / 7 // 计算速度
        speed = (speed > 0) ? Math.ceil(speed) : Math.floor(speed)
        this.cur = this.cur + speed
        this.oUl.style.left = this.cur + '%'
      }
    },
    mouseenterAction () {
      clearInterval(this.swiperInterval)
    },
    handleError (e) {
      e.target.nextSibling.style.backgroundImage = 'url(' + e.target.src + ')'
    }
  }
}
</script>

<style lang="scss">
 @import '~styles/var';
  .detail-swiper{
    border: 1px solid rgba(0,0,0,0.05);
    .detail-inner-box{
      li{
        height:400px;
      }
    }

    user-select:none;
    .btn span{
      width: 30px;
      height: 50px;
      background: #4a4a4a;
      display: inline-block;
      position: absolute;
      text-align: center;
      line-height: 50px;
      font-size: 24px;
      opacity: 0.4;
      cursor: pointer;
    }
    .btn span:hover{
      opacity: 1;
      color: #fff;
    }
    .btn .left{
      left: 0;
      top: 125px;
    }
    .btn .right{
      right: 0;
      top: 125px;
    }

    height:400px;
    .detail-box {
      width: 400px; //改成图片实际的宽度
      height: 400px;
      overflow: hidden;
      position: relative;
      text-align:center; 
      // img {
      //   height: 400px;
      //   width: 400px; //改成图片实际的宽度
      // }
      ul {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      ul li{
        float: left;
      }
      ol{
        height: 5px;
        position: absolute; 
        // left: 50%; 
        // transform: translateX(-50%); 
        right:12px;
        bottom: 15px;
      }
      ol li{
        width: 10px;
        height: 5px;
        float:left;
        margin-left:5px;
        background: rgba(255,255,255,0.8);
      }
      ol .btn-active{
        background: $color-primary;
      }
    }
  }
</style>
