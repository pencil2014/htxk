<template>
    <component :is="tag" :class="['heading','heading-'+this.grade]">
      <i v-if="grade=='1'" class="heading-icon"></i>
      <span v-if="this.grade=='2'" class="heading-2-inner">
        <slot></slot>
      </span>
      <slot v-else></slot>
    </component>
</template>

<script>
  export default {
    props: {
      grade: {
        type: String,
        default: '1'
      },
      tag: {
        type: [String, Object],
        default: 'div'
      }
    }
  }
</script>

<style lang="scss">
    @import '~styles/var.scss';
    .heading{
      position:relative;
      &-icon{
        background: #24c881;
        height: 100%;
        width: 4px;
        position: absolute;
        left: 0;
        top: 0;
        overflow:hidden;
        &:before{
          background:#39aefd;
          content:'';
          position: absolute;
          left: 0;
          top: -50%;
          height: 100%;
          width: 400%;
          border-bottom:2px solid #fff;
          transform: rotate(-45deg);
          left: -11px;
        }
      }
      &-1 {
        padding-left: 14px;
        font-size: 18px;
        margin: 25px 0;
        font-weight: bold;
        line-height: 22px;
      }
      &-2{
        border-bottom: 1px solid $border-color-base;
        margin: 25px 0;
        line-height: 36px;
        &-inner {
            display: inline-block;
            vertical-align: middle;
            border-bottom: 2px solid $color-primary;
            margin-bottom: -1px;
            padding: 0 10px;
            font-size: 16px;
            position:relative;
            small{
              position: absolute;
              left: 100%;
              top: 0;
              white-space:nowrap
            }
        }
      }
      small{
        color:$color-sub;
        margin:0px 5px;
        font-weight: normal;
      }
    }
</style>
