<template>
  <component :is="tag||$parent.itemTag" class="cell-item" :style="styles">
    <slot></slot>
  </component>
</template>

<script>
  export default {
    props: {
      tag: {
        type: [String, Object]
      }
    },
    computed: {
      styles () {
        return this.$parent.gutter ? {
          'padding-left': this.$parent.gutter / 2 + 'px',
          'padding-right': this.$parent.gutter / 2 + 'px'
        } : {}
      }
    }
  }
</script>

<style lang="scss">
  .cell-item {
    display:table-cell;
    vertical-align: top;
  }
  .cell-item:first-child{
    padding-left:0!important;
  }
  .cell-item:last-child{
    padding-right:0!important;
  }
</style>
