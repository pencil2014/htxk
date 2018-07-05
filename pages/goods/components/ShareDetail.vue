<template>
  <div @mouseenter='shareMouseenterAction' class="share-slide"  @mouseleave='shareMouseleaveAction'  >
    <div style="margin-left:16px;" class="share-list">
      <i class="icon iconfont icon-fenxiang"></i>
        分享到
      <i class="icon iconfont icon-directionbottom row"  v-show='!isShow'></i>
      <i class="icon iconfont icon-fangxiangshang row"  v-show='isShow'></i>
    </div>
    <transition name="fade">
      <share v-show='isShow' class="goods-share"  :detail="detail" />
    </transition>
  </div>
</template>
<script>
  import share from '../components/Share'
  export default {
    components: {
      share
    },
    props: {
      detail: { // detail 内部带type参数，type参数代表是赛事/培训/票务 标识符，用来页面分享出去地址回跳入对应页面
        type: Object,
        default () {
          return {}
        }
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isShow: ''
      }
    },
    methods: {
      shareMouseenterAction () {
        this.isShow = true
      },
      shareMouseleaveAction () {
        this.isShow = false
      }
    },
    mounted () {
      this.isShow = this.show
    }
  }
</script>
<style lang="scss">
  
  .share-slide{
    .fade-enter-active, .fade-leave-active {
      transform-origin: 0 0;
      transition: all 0.2s;
      transform: scaleY(-14px);
      height: 14px;
    }
    .fade-enter, .fade-leave-to {
      transform-origin: 0 0;
      transform: scaleY(0);
      height:0;
    }
    &:nth-child(1){
      display:inline-block;
      vertical-align:center;
      padding-right: 20px;
      font-size: 12px;
      color:#666;
      .icon-fenxiang{
        font-size: 16px;
        color:$color-primary;
      }
      .row{
        font-size: 12px;
        margin-left:4px;
        transform:scaleY(0.5);
      }
    }
  }
</style>
