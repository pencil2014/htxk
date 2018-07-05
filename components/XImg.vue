<template>
  <component
    class="x-img"
    :is="background ? 'span' : 'img'"
    v-bind="$props"
    :src="mySrc | formatPicture(cutType, size)"
    :background="null"
    :defaultSrc="null"
    @load="handleLoad"
    @error="handleError">
    <slot></slot>
  </component>
</template>

<script>
  import defaultPhoto from 'static/images/default_goods.jpg'
  export default {
    props: {
      alt: {
        type: String
      },
      src: {
        type: String
      },
      srcset: {
        type: String
      },
      background: {
        type: Boolean,
        default: false
      },
      defaultSrc: {
        type: String,
        default: defaultPhoto
      },
      size: {
        type: Array,
        default () {
          return []
        }
      },
      cutType: {
        type: Number,
        default: 2
      }
    },
    computed: {
      mySrc () {
        return this.src || this.defaultSrc
      }
    },
    watch: {
      src (value) {
        if (value) {
          this.background && this.backgroundLoad(value) // 设置成背景图片
        }
      }
    },
    mounted () {
      this.background && this.backgroundLoad(this.src) // 设置成背景图片
    },
    methods: {
      backgroundLoad (src) {
        let image = new Image()
        image.onload = () => {
          this.$el.style.backgroundImage = `url(${src})`
          this.$emit('load', {target: this.$el})
        }
        image.onerror = () => {
          if (this.src && this.src.indexOf && this.src.indexOf(this.defaultSrc) === -1) {
            this.$el.setAttribute('error-src', src)
            this.$el.style.backgroundImage = `url(${this.defaultSrc})`
            this.$emit('error', {target: this.$el})
          }
        }
        image.src = src
      },
      handleLoad (e) {
        this.$emit('load', e)
      },
      handleError (e) {
        if (this.$el.src.indexOf(this.defaultSrc) === -1) {
          this.$el.parentNode.style.background = 'url(' + this.defaultSrc + ')'
          this.$el.parentNode.style.backgroundSize = 'cover'
          this.$el.parentNode.style.backgroundPosition = 'center'
          this.$el.setAttribute('style', 'opacity:0')
          this.$el.setAttribute('error-src', this.$el.src)
          this.$el.src = this.defaultSrc
          this.$emit('error', e)
        }
      }
    }
  }
</script>

<style lang="scss">
  .x-img{
    display: inline-block;
    vertical-align: middle;
  }
</style>
