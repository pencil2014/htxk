<template>
  <m-body>
    <m-header slot="mHeader" />
    <x-login slot="mBody" />
  </m-body>
</template>
<script>
  import MHeader from '../components/MHeader'
  import MBody from '../components/MBody'
  import XLogin from '../components/XLogin'
  export default {
    layout: 'blank',
    components: {
      MHeader,
      MBody,
      XLogin
    }
  }
</script>