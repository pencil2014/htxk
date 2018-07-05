<template>
  <div class="carousel" :style="styles">
    <div class="carousel-inner" :style="innerStyle" :class="innerClass" @mouseenter="handleMouseEnter(-1)" @mouseleave="handleMouseLeave">
       <div class="carousel-items">
        <slot></slot>
       </div>
       <div class="carousel-nav">
          <span 
            v-for="(item, index) in length"
            type="button"
            :class="index==activeIndex?'active':''"
             @mouseenter="handleMouseEnter(index)"
            >
          </span>
       </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      duration: {
        type: Number,
        default: 3000
      },
      colors: { // 大背景颜色
        type: Array
      },
      innerStyle: {},
      innerClass: {}
    },
    computed: {
      styles () {
        if (this.colors && this.colors[this.activeIndex]) {
          return {
            backgroundColor: this.colors[this.activeIndex]
          }
        }
        return {}
      }
    },
    watch: {
      activeIndex (value) {
        this.$emit('change', value)
      }
    },
    data () {
      return {
        carouselMounted: false, // slot要用到
        activeIndex: 0,
        length: 0
      }
    },
    mounted () {
      this.init()
    },
    updated () {
      this.init()
    },
    methods: {
      init () {
        this.carouselMounted = true
        this.length = this.$children.length
        this.toInterval()
      },
      handleMouseEnter (index) {
        this.$interval && clearInterval(this.$interval)
        if (index !== -1) {
          this.activeIndex = index
        }
      },
      handleMouseLeave () {
        this.$interval && clearInterval(this.$interval)
        this.toInterval()
      },
      toInterval () {
        clearInterval(this.$interval)
        this.$interval = setInterval(() => {
          if (this.activeIndex === this.length - 1) {
            this.activeIndex = 0
          } else {
            this.activeIndex = this.activeIndex + 1
          }
        }, this.duration)
      },
      isItemActive (item) {
        return this.$children.some((_item, index) => {
          return _item === item && this.activeIndex === index
        })
      },
      isIE9 () {
        return process.browser && navigator.userAgent.indexOf('MSIE 9.0') > -1
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  @import '~styles/var';
  .carousel{
    height:420px;
    transition: background 0.5s ease 0s;
    &-inner{
      position:relative;
      margin:0 auto;
      height:100%;
    }
    &-nav{
      position:absolute;
      bottom:0;
      left:0;
      width:100%;
      height:0;
      text-align:center;
      z-index:10;
      span{
        font-size:0;
        display:inline-block;
        border:0;
        background:#f5f5f5;
        outline:none;
        height:5px;
        width:15px;
        top:-40px;
        position:relative;
        margin:0 4px;
        box-shadow:0 0 2px rgba(0,0,0,0.1);
        &.active{
          background:$color-primary;
        }
      }
    }
  }
</style>
