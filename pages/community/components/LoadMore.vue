<template>
  <!-- <div class="load-more" @scroll='onscroll'> -->
  <div class="load-more" >
    <slot></slot>
  </div>
</template>

<script>

export default {
  props: {
    maxDistanceToEnd: {
      type: Number,
      default: 500
    },
    minIntervalItme: {
      type: Number,
      default: 3000 // 默认三秒内不重复触发事件
    }
  },
  data () {
    return {
      emitOpen: true
    }
  },
  methods: {
    onscroll () {
      if (this.emitOpen && this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight() - this.maxDistanceToEnd) {
        this.emitOpen = false
        this.$emit('loadMore')
        setTimeout(() => {
          this.emitOpen = true
        }, this.minIntervalItme)
      }
    },
    getScrollTop () {
      var scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    getClientHeight () {
      var clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      }
      return clientHeight
    },
    getScrollHeight () {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.onscroll()
    })
    // window.onscroll = function () {
    //   console.log('this.getScrollTop()', this.getScrollTop())
    //   console.log('this.getClientHeight()', this.getClientHeight())
    //   console.log('this.getScrollHeight()', this.getScrollHeight())
    //   if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
    //     console.log('到达底部')
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>

.load-more{

}
</style>
