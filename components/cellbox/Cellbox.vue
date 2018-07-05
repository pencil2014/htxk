<template>
  <component :is="tag" :class="classes">
    <slot></slot>
  </component>
</template>

<script>
  export default {
    props: {
      middle: {
        type: Boolean
      },
      gutter: {
        type: Number,
        default: 0
      },
      tag: {
        type: [String, Object],
        default: 'div'
      },
      itemTag: {
        type: [String, Object],
        default: 'div'
      }
    },
    computed: {
      classes () {
        return {
          'cellbox': true,
          'cellbox-middle': this.middle
        }
      }
    }
  }
</script>

<style lang="scss">
  .cellbox {
    display:table;
    width: 100%;
    &.cellbox-middle{
      .cell-item{
        vertical-align:middle;
      }
    }
  }
  
</style>
