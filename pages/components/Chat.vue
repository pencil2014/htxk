<template>
  <div>
    <ul class="chat-content">
        <li>
          <i class="icon iconfont icon-app" title=" 求苗APP下载 "></i>
          <p class="hide text-app">APP<br/>下载</p>
          <div class="app-icon">
            <div class="app-icon-box">
            <img src="/images/wechat.jpg" width="110px" alt="">
            <p class="app-text">扫描下载APP</p>
            </div>
          </div>
        </li>
        <li @click="showChat()">
          <i class="icon iconfont icon-noun__cc" title="在线客服"></i>
          <p class="hide text-app">在线<br/>客服</p>
        </li>
        <li>
          <a href="#__nuxt" target="_self">
            <i class="icon iconfont icon-fanhuidingbu"></i>
            <p class="hide text-app">返回<br/>顶部</p>
          </a>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  methods: {
    showChat () {
      let url = 'https://www.71chat.com/scsf/core/styleConfig.visitorView.do?cmpcd=106282'
      let name = '华体星空'
      let iWidth = '1000'
      let iHeight = '600'
      let iTop = (window.screen.availHeight - 30 - iHeight) / 2
      let iLeft = (window.screen.availWidth - 10 - iWidth) / 2
      window.open(url, name, 'width=' + iWidth + ', height=' + iHeight + ',top=' + iTop + ',left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
    }
  }
}
</script>
<style lang="scss">
  
  .chat-content{
      position: fixed;
      bottom: 120px;
      right:  10px;
      background: #fff;
      li{
        background: #f2f2f2;
        width: 50px;
        height: 50px;
        margin-bottom: 1px;
        text-align: center;
        vertical-align: middle;
        line-height: 50px;
        cursor: pointer;
        position: relative;
      }
      .iconfont{
        font-size: 26px;
      }
      .app-icon-box{
        width: 120px;
        height: 135px;
        background: #24c881;
        color: #fff;
        padding-top: 5px;
      }
      .app-icon{
        position: absolute;
        left: -140px;
        top: 0;
        display: none;
        width: 140px;
        text-align: center;
        cursor: text;
        box-sizing:content-box !important
      }
      .text-app{
        line-height: 20px;
        font-size: 14px;
        width: 30px;
        padding: 4px 0 0 10px;
        box-sizing:content-box !important
      }
      .app-text{
        font-size: 12px;
        line-height: 25px;
        box-sizing:content-box !important
      }
      li:first-child:hover .app-icon{
        display: block;
      }
      li:hover i{
        display: none;
      }
      li:hover .text-app{
         display: block;
         color: #fff;
      }
      li .hide{
        display: none
      }
      li:hover {
        background: #24c881
      }
  }
</style>
