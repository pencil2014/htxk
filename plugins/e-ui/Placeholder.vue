<template>
  <placeholder v-bind="$props" v-on="$listeners" v-if="!$store.state.loading">
    <slot></slot>
    <slot name="button" slot="button"></slot>
    <slot name="text" slot="text"></slot>
  </placeholder>
</template>

<script>
  import Placeholder from 'e-ui/lib/Placeholder'
  export default {
    componentName: 'EPlaceholder',
    components: {
      Placeholder
    },
    props: {
      ...Placeholder.props
    }
  }
</script>
