<template>
  <el-dialog :visible="visible" custom-class="dialog-preview" :before-close="handleClose" size="full">
    <el-carousel :initial-index="index" :autoplay="false" ref="carousel">
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <button type="button" class="dialog-preview-image">
          <img :src="item"/>
        </button>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
      index: {
        type: Number,
        default: 0
      }
    },
    watch: {
      visible (value) {
        if (!value) {
          this.$destroy()
        }
      }
    },
    destroyed () {
      this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
    },
    methods: {
      handleClose () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/var.scss';
  .dialog-preview{
    background:transparent;
    box-shadow:none;
    transform:none;
    top:0!important;
    left:0;
    width:100%;
    height:100%;
    &-image{
      height:100%;
      width:100%;
      background:transparent;
      border:0;
      img{
        background:#fff;
      }
    }
    .el-dialog__body,.el-dialog__header{
      padding:0;
    }
    .el-dialog__body{
      height:100%;
      width:100%;
      top:0;
      left:0;
      position:absolute;
    }
    .el-carousel,.el-carousel__container{
      height:100%;
    }
    .el-dialog__headerbtn{
      right:15px;
      top:15px;
      position:absolute;
      z-index:1000;
      font-size:18px;
      color:#fff;
    }
    
  }
</style>
