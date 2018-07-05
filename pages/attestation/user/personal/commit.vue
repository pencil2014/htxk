<template>
  <div>
    <e-heading grade="1">提交结果</e-heading>
    <div class="content-commit">
    </div>
    <status-item :status="status"></status-item>
  </div>
</template>

<script>
  import StatusItem from '@/pages/attestation/components/StatusItem'
  export default {
    layout: 'manage',
    components: {
      StatusItem
    },
    props: {
      activeChange: {
        type: Function
      }
    },
    created () {
      this.activeChange(4)
    },
    data () {
      return {
        status: this.$route.query.status
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  
  .content-commit{
    margin-top: 150px;
  }
</style>
