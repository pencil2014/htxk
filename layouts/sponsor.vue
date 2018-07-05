<template>
  <ssr>
    <e-layout>
      <s-header slot="header" :layout="['small','nav']"/>
      <div slot="body" class="layout-body">
        <nuxt/>
      </div>
    </e-layout>
  </ssr>
</template>
<script>
  // import SHeader from '@/pages/sponsor/components/SHeader'
  import SHeader from 'components/sponsor/SHeader'
  export default {
    components: {SHeader},
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss">
</style>

