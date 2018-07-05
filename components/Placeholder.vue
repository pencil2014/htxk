<template>
  <cellbox class="placeholder" middle v-if="!$store.state.loading">
    <cell-item>
      <slot v-if="$slots.default"></slot>
      <template v-else>
        <img v-if="src != 'none'" :src="src">
        <div class="placeholder-text weak">
          <slot v-if="$slots.text" name="text"></slot>
          <template v-else>
            {{text}}
          </template>
        </div>
        <slot v-if="$slots.button" name="button"></slot>
      </template>
    </cell-item>
  </cellbox>
</template>

<script>
  import defaultImage from 'static/images/empty_default.png'
  export default {
    props: {
      src: {
        type: String,
        default: defaultImage
      },
      text: {
        type: String,
        default: '没有相关数据'
      }
    }
  }
</script>

<style lang="scss">
    .placeholder{
      text-align:center;
      margin:30px 0;
      &-text{
        margin-top: -30px;
        margin-bottom: 15px;
      }
    }
</style>
