<template>
  <component
    class="x-text"
    :is="tag">
      <div class="x-text-relative"></div>
      <div class="x-text-inner" 
        :style="styles">
        <slot></slot>
      </div>
  </component>
</template>

<script>
  let supportLineClamp = false
  if (process.browser) {
    let style = window.getComputedStyle(document.documentElement)
    if (style.getPropertyValue('line-clamp') || style.getPropertyValue('-webkit-line-clamp')) {
      supportLineClamp = true
    }
  }
  export default {
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      lineClamp: {
        type: Number,
        default: 1
      },
      height: {
        type: String
      }
    },
    computed: {
      styles () {
        if (this.lineClamp === 1) {
          return {
            'overflow': 'hidden',
            'white-space': 'nowrap'
          }
        } else if (this.lineClamp > 1) {
          return {
            'overflow': 'hidden',
            '-webkit-line-clamp': this.lineClamp,
            'line-clamp': this.lineClamp,
            'height': this.height,
            'display': '-webkit-box',
            'white-space': 'normal',
            '-webkit-box-orient': 'vertical'
          }
        }
        return {}
      }
    },
    data () {
      return {
        supportLineClamp: supportLineClamp
      }
    },
    mounted () {
      this.calc()
    },
    updated () {
      this.calc()
    },
    methods: {
      calc () {
        let requestIdleCallback = window.requestIdleCallback || window.mozRequestIdleCallback || window.msRequestIdleCallback || setTimeout
        let requestFrameAnimation = window.requestFrameAnimation || window.mozRequestFrameAnimation || window.msRequestFrameAnimation || setTimeout
        requestIdleCallback((deadline) => {
          let relativeNode = this.$el.querySelector('.x-text-relative')
          let innerNode = this.$el.querySelector('.x-text-inner')
          relativeNode.innerHTML = innerNode.innerHTML
          if (relativeNode.clientHeight > innerNode.clientHeight) {
            requestFrameAnimation(() => {
              this.$el.title = innerNode.innerText
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .x-text{
    position:relative;
    &-inner{
      text-overflow: ellipsis;
      word-break: break-all;
      &.clamp-default{
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: normal;
      }
    }
    &-relative{
      position:absolute;
      opacity:0;
      z-index:-1;
      word-break: break-all;
    }
  }
</style>
