<template>
  <div class="nuxt-progress" :class="classes" :style="{
    'width': percent+'%',
    'height': height,
    'background-color': canSuccess? color : failedColor,
    'opacity': show ? 1 : 0
  }"></div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'nuxt-loading',
  computed: {
    classes () {
      return {
        'nuxt-progress-full': !this.show && this.$store.state.loading,
        'nuxt-progress-loading': this.percent > 0 || (!this.show && this.$store.state.loading)
      }
    }
  },
  data () {
    return {
      percent: 0,
      show: false,
      canSuccess: true,
      duration: 5000,
      height: '2px',
      color: '#24c881',
      failedColor: 'red'
    }
  },
  mounted () {
    this.$store.commit('LOADING', false)
  },
  methods: {
    start () {
      this.$store.commit('LOADING', true)
      this.show = true
      this.canSuccess = true
      if (this._timer) {
        clearInterval(this._timer)
        this.percent = 0
      }
      this._cut = 10000 / Math.floor(this.duration)
      this._timer = setInterval(() => {
        this.increase(this._cut * Math.random())
        if (this.percent > 95) {
          this.finish()
        }
      }, 100)
      return this
    },
    set (num) {
      this.show = true
      this.canSuccess = true
      this.percent = Math.floor(num)
      return this
    },
    get () {
      return Math.floor(this.percent)
    },
    increase (num) {
      this.percent = this.percent + Math.floor(num)
      return this
    },
    decrease (num) {
      this.percent = this.percent - Math.floor(num)
      return this
    },
    finish () {
      this.$store.commit('LOADING', false)
      this.percent = 100
      this.hide()
      return this
    },
    pause () {
      clearInterval(this._timer)
      return this
    },
    hide () {
      clearInterval(this._timer)
      this._timer = null
      setTimeout(() => {
        this.show = false
        Vue.nextTick(() => {
          setTimeout(() => {
            this.percent = 0
          }, 200)
        })
      }, 500)
      return this
    },
    fail () {
      this.canSuccess = false
      return this
    }
  }
}
</script>

<style lang="scss">
.nuxt-progress {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 2px;
  width: 0%;
  transition: width 0.2s, opacity 0.4s;
  opacity: 1;
  background-color: #efc14e;
  z-index: 999999;
  &-loading{
    &:after{
      content:'';
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
      box-sizing: border-box;
      border: solid 2px transparent;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      border-top-color:$color-primary;
      border-right-color:$color-primary;
      animation: nprogress-spinner 400ms linear infinite;
    }
  }
  &-full{
    width: 100%!important;
    opacity: 1!important
  }
}
@-webkit-keyframes nprogress-spinner {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes nprogress-spinner {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
