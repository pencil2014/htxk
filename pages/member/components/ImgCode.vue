<template>
  <img v-show="src" class="img-code" :src="src" @click="handleClick" title="看不清楚？点击换一张"/>
</template>

<script>
  import userApi from 'api/user'
  export default {
    props: {
      width: {
        type: Number,
        default: 116
      },
      height: {
        type: Number,
        default: 36
      },
      codetype: {
        type: Number,
        default: 1
      }
    },
    computed: {},
    mounted () {
      this.handleClick()
    },
    data () {
      return {
        src: ''
      }
    },
    methods: {
      handleClick () {
        userApi.generateValidateCode({
          type: this.codetype,
          width: 125,
          height: 36,
          time: new Date().getTime()
        }).then((res) => {
          this.src = res.data.image
          this.$emit('input', res.data.key)
        }).catch((ERR) => {
        })
      }
    }
  }
</script>

<style lang="scss">
  .img-code{
    cursor: pointer;
  }
</style>
