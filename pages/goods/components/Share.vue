<template>
  <div class="bdsharebuttonbox share-icon-box" style='margin-left:16px;' >
    <a  class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
    <a  class="bds_sqq icon iconfont icon-qq" data-cmd="sqq" title="分享到QQ好友"></a>
    <a  class="bds_weixin icon iconfont icon-weixin" data-cmd="weixin" title="分享到微信"></a>
    <a  class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
  </div>
</template>
<script>
  export default {
    props: {
      detail: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    mounted () {
      this.initShareConfig()
      console.log(this.show)
    },
    beforeDestroy () {
      if (document.querySelector('#bdshare_weixin_qrcode_dialog')) {
        document.querySelector('#bdshare_weixin_qrcode_dialog').remove()
        document.querySelector('#bdshare_weixin_qrcode_dialog_bg').remove()
      }
    },
    methods: {
      bdInit () {
        let url = '/static/api/js/share.js'
        let script = document.createElement('script')
        script.setAttribute('src', url)
        document.getElementsByTagName('head')[0].appendChild(script)
      },
      initShareConfig () {
        this.$nextTick(() => {
          window._bd_share_config = {
            'common': {
              'bdSnsKey': {
                'bds_tsina': '18129803273',
                'popup_sqq': '468642723',
                'bds_weixin': 'htxk-open@13322.com',
                'bds_qzone': '468642723'
              },
              'bdText': this.detail.bdText,
              'bdDesc': this.detail.bdDesc,
              'bdMini': '2',
              'bdMiniList': false,
              'bdPic': this.detail.bdPic,
              'bdStyle': '0',
              'bdSize': '16'
            },
            'share': {
              bdUrl: (location.origin || (location.protocol + '//' + location.host)) + '/share?type=' + this.detail.type + '&shareId=' + this.detail.shareId + '&share=',
              searchPic: 'on'
            }
          }
          if (!window._bd_share_main) {
            this.bdInit()
          } else {
            window._bd_share_main.init()
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  
  // 百度分享样式修改
  .bdsharebuttonbox{
    position: absolute;
    left: 0;
    top: 35px;
  }
  .share-icon-box.bdsharebuttonbox a{
    display:block;
    float:left;
    width:20px;
    height: 20px;
    padding-left: 0;
    font-size: 20px;
    line-height: 20px;
    background:#fff;
    cursor: pointer;
    margin: 6px 6px 6px 0;
    &.bds_qzone{
      color: #ffe033;
    }
    &.bds_sqq{
      color: #7eaeef;
    }
    &.bds_weixin{
      color: #78d37d;
    }
    &.bds_tsina{
      color: #ff7872;
    }
    .iconfont{
      font-size: 20px;
    }
  }
</style>
