<template>
  <div class="steps-item">
    <div class="itembox" :class="active?'active':''">
      <slot></slot>
    </div>
    <!--<e-cellbox middle class="itembox" :class="active?'active':''">
      <e-cell-item>
        <slot></slot>
      </e-cell-item>
    </e-cellbox>-->
  </div>
</template>
<script>
  export default {
    props: {
      img: {
        type: String
      },
      name: {
        type: String
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  
  .steps-item{
    width: 20%;
    float: left;
    text-align: center;
    min-height: 140px;
    .itembox{
      width: 100px;
      min-height: 100px;
      padding: 10px 5px;
      cursor: pointer;
      margin: 5px auto;
      &.active, &:hover{
        background: $color-background;
        color: $color-primary;
      }
    }
  }
</style>
