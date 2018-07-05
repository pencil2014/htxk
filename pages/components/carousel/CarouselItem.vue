<template>
  <div class="carousel-item" :style="styles">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      index: {
        type: Number,
        default: 0
      }
    },
    computed: {
      styles () {
        if (this.$parent.carouselMounted) {
          let active = this.$parent.isItemActive(this)
          if (this.$parent.isIE9()) {
            if (active) {
              let opacity = 0
              clearInterval(this.$interval)
              this.$interval = setInterval(() => {
                opacity += 10
                this.$el.style.opacity = opacity / 100
                if (opacity >= 100) {
                  clearInterval(this.$interval)
                }
              }, 32)
            } else {
              this.$el.style.opacity = 0
            }
            return {
              opacity: 0,
              zIndex: 0
            }
          } else {
            return {
              opacity: active ? 1 : 0,
              zIndex: active ? 1 : 0
            }
          }
        }
        return {}
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  @import '~styles/var';
  .carousel-item{
    cursor: pointer;
    transition: opacity 0.5s ease 0s;
    display:block;
    opacity:0;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    text-align:center;
    img{
      // max-width:100%;
      // max-height:100%;
      // width:100%;
      height:100%;
    }
    overflow:hidden;
  }
</style>
