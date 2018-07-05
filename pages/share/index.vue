<template>
  <div class="content"></div>
</template>
<script>
  export default {
    async fetch (context) {
      let type = context.query.type
      let shareId = context.query.shareId
      let url = '/'
      if (type === 'goods') {
        url = '/goods/detail/'
      } else if (type === 'tickets') {
        url = '/goods/tickets/'
      } else if (type === 'circle') {
        url = '/community/circle/'
      } else if (type === 'feed') {
        url = '/community/detail/'
      } else if (type === 'video') {
        url = '/video/detail/'
      }
      context.redirect(url + shareId + '?_s=1') // _s参数表示是否SSR
    }
  }
</script>