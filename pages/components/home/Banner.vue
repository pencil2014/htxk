<template>
  <div>
    <div class='banner-box'>
      <div  class="box" @mouseenter='mouseenterAction'  @mouseleave='startMove'>
        <ul class="inner-box" v-show='showBanner'>
          <!-- 
            1.banner轮播图，在后台上传、顺序设置和跳转链接， 跳转有商品跳转和内外链接跳转；
            后台有有商品资源编号和URL设置， 若商品资源编号和URL都填写了， 则只取商品资源编号，点击banner图跳转到商品详情页， 即URL无效；
            数据来源：官方管理后台-内容设置中的推荐轮播和轮播位置管理；

            linkType (string, optional): 链接方式 （1： 资源类型 ，2：链接地址） ,
            openType (string, optional): 打开方式 （1： 新增窗口打开 ，2：当前窗口打开）,
            resId (string, optional): 资源ID ,
            resType (string, optional): 资源类型 （1：帖子 ，2： 视频 ，3：资讯 4：个人秀 ，5：赛事 ，6： 商品） ,
           -->
          <li v-for='(item, index) in bannerList' :key='index'>
            <nuxt-link :to="linkTo(item)"  :target="item.openType === 2 ? '_self' : '_blank'"  v-if='item.linkType === 1'  >
              <e-img :src='item.contentUrl' :title='item.adsTitle' :size="[1920,420]" :alt='item.adsTitle' />
            </nuxt-link>
            <a :href='item.detailUrl' :target="item.openType === 2 ? '_self' : '_blank'"  v-if='item.linkType === 2' >
              <e-img :src='item.contentUrl' :title='item.adsTitle' :size="[1920,420]" :alt='item.adsTitle' />
            </a>
          </li>
          <li v-if="bannerList && bannerList[0]">
            <nuxt-link :to="linkTo(bannerList[0])"  :target="bannerList[0].openType === 2 ? '_self' : '_blank'"  v-if='bannerList[0].linkType === 1'  >
              <e-img :src='bannerList[0].contentUrl' :title='bannerList[0].adsTitle' :size="[1920,420]" :alt='bannerList[0].adsTitle' />
            </nuxt-link>
            <a :href='bannerList[0].detailUrl' :target="bannerList[0].openType === 2 ? '_self' : '_blank'"  v-if='bannerList[0].linkType === 2' >
              <e-img :src='bannerList[0].contentUrl' :title='bannerList[0].adsTitle' :size="[1920,420]" :alt='bannerList[0].adsTitle' />
            </a>
          </li>
        </ul>
        <ol class="ol">
          <li  v-for='(item, index) in bannerList.length'  :key='index' :class="{'btn-active': index === i }"  @click='btnAction(index, item)' ></li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    autoplay: { // 轮播间隔时间等参数，本期不提供入口
      default: 4000,
      type: Number
    },
    bannerList: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      bannerBackgroundColerList: [],
      oBannerBox: null,
      oUl: null,
      cur: 0,
      timer: null,
      target: 0,
      timer1: null,
      i: 0,
      oLi: null,
      oBox: null,
      showBanner: false
    }
  },
  mounted () {
    this.oBannerBox = document.querySelector('.banner-box')
    this.oBox = document.querySelector('.box')
    this.oUl = document.querySelector('.inner-box')
    var oOl = document.querySelector('.ol')
    this.oLi = oOl.getElementsByTagName('li')
    this.oUl.style.width = (this.bannerList.length + 1) * 100 + '%' // 设置内部盒子的宽度，后面补充了一张图片
    this.startMove()
    this.changeBannerPosition()
    window.addEventListener('resize', () => { // 改变position的位置
      this.changeBannerPosition()
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    linkTo (item) {
      // linkType (string, optional): 链接方式 （1： 资源类型 ，2：链接地址） ,
      // openType (string, optional): 打开方式 （1： 新增窗口打开 ，2：当前窗口打开） ,
      // resId (string, optional): 资源ID ,
      // resType (string, optional): 资源类型 （1：帖子 ，2： 视频 ，3：资讯 ，4：个人秀 ，5：赛事 ，6： 商品） ,
      if (item.resType === 1) { // 1：帖子 ———— 14475
        return '/community/detail/' + item.resId
      } else if (item.resType === 2) { // 2： 视频 —— 3349
        return '/video/detail/' + item.resId
      } else if (item.resType === 3) { // 3：资讯
        return ''
      } else if (item.resType === 4) { // 4：个人秀
        return ''
      } else if (item.resType === 5) { // 5：赛事
        return ''
      } else if (item.resType === 6) { // 6： 商品
        return item.nextStepUrl + ''
      } else {
        return ''
      }
    },
    changeBannerPosition () {
      let positionLeft = ((this.oBannerBox.offsetWidth || window.innerWidth) - 1920) / 2
      if (positionLeft < -360) {
        this.oBox.style.left = '-360px'
      } else {
        this.oBox.style.left = positionLeft + 'px'
      }
      if (!this.showBanner) {
        this.showBanner = true
      }
    },
    startMove () {
      if (this.bannerList.length > 1) { // 两张以上才轮播
        this.timer = setInterval(this.autoPlay, this.autoplay)
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
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss">
 
  .banner-box{
    position: relative;
    height:420px;
    width:100%;
    overflow: hidden;
    .box {
      margin: 0 auto;
      width: 1920px; //改成图片实际的宽度
      // width:100%;
      height: 420px;
      overflow: hidden;
      // position: relative;
      position:absolute;
      left:-8px; // 谷歌侧边栏的宽度是17px；首页一定有侧边栏
      text-align:center; 
      img {
        width: 1920px; //改成图片实际的宽度
        height: 420px;
      }
      ul {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        li a{
          display:block;
          height:420px;
        }
      }
      ul li{
        float: left;
      }
      ol{
        height: 5px;
        bottom: 20px;
        position: absolute; 
        left: 50%; 
        transform: translateX(-50%); 
      }
      ol li{
        width: 16px;
        height: 5px;
        float:left;
        margin:0 5px;
        background: rgba(255,255,255,0.9);
      }
      ol .btn-active{
        background: $color-primary;
      }
    }
  }
</style>
