<template>
  <div>
    <div class="content">
      <nuxt-child :active-change="activeChange"></nuxt-child>
    </div>
  </div>
</template>

<script>
  import { form } from 'utils/mixins' // 引入form mixin
  import { ElSteps, ElStep } from '@element-ui/Steps'
  import validator from 'utils/validator'
  export default {
    layout: 'manage',
    components: {
      ElSteps,
      ElStep
    },
    mixins: [form],
    data () {
      return {
        active: 1,
        validator
      }
    },
    methods: {
      activeChange (value) {
        this.active = value
      }
    }
  }
</script>

<style lang="scss">
</style>
