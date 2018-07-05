<template>
  <x-img v-bind="$props" :src="mySrc" :size='size' v-on="$listeners"  />
</template>

<script>
  import XImg from './XImg'
  import defaultPhoto from 'static/images/default_photo.jpg'
  export default {
    props: {
      ...XImg.props,
      defaultSrc: {
        type: String,
        default: defaultPhoto
      },
      size: {
        type: Array,
        default () {
          return [120, 120]
        }
      }
    },
    computed: {
      mySrc () {
        return this.src || this.defaultSrc
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
    @import '~styles/var.scss';
</style>
