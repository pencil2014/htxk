<template>
  <div class="ssr">
    <slot v-if="$store.state.ssr && isSsr"></slot>
    <no-ssr v-else :placeholder="placeholder">
      <slot></slot>
      <slot v-if="$scopedSlots.placeholder" name="placeholder"></slot>
      <div v-else-if="!placeholder" slot="placeholder" class="ssr-placeholder">
        <div class="spinner-wrapper">
          <div class="spinner"></div>
          <img src="/images/logo-icon.png"/>
        </div>
        <h4>
          努力加载中...
        </h4>
      </div>
    </no-ssr>
  </div>
</template>
<script>
  export default {
    props: {
      isSsr: {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String
      }
    }
  }
</script>
<style lang="scss">
  .ssr-placeholder{
    position:fixed;
    top:45%;
    left:50%;
    z-index:1000;
    transform:tranlate(-50%);
    text-align:center;
    img{
      width: 30px;
      height: 30px;
      margin-top:15px;
    }
    .spinner{
      position:absolute;
      height:100%;
      width:100%;
      animation: loading 0.6s infinite linear;
      border:2px solid #eee;
      border-top-color: $color-primary;
      border-radius:50%;
      box-sizing:border-box;
      &-wrapper{
        position:relative;
        display: inline-block;
        vertical-align: middle;
        width:60px;
        height:60px;
      }
    }
    h4{
      margin-top:15px;
      font-weight:normal
    }
  }
  @keyframes loading {
    0% {
      transform:rotate(0deg)
    }
    100% {
      transform:rotate(360deg)
    }
  }
</style>
