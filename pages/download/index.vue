<template>
  <div class="download_wrap">
  <div class="section first ">
    <div class="download_container pr">
      <div class="download_hand_box transition">
        <div class="hand-img-box">
          <img src="/images/download/hand.png" width="100%" />
        </div>
        <div class="first_basketball pa transition scale_start_first">
          <img src="/images/download/basketball.png" width="100%" />
        </div>
        <div class="first_football pa transition scale_start_first">
          <img src="/images/download/football.png" width="100%" />
        </div>
      </div>
      <div class="download_text_box text_box pa transition transition_r_first">
        <h3 class="mit_title"><img  src="/images/download/first_title.png" width="100%" /></h3>
        <div class="mit_subtitle">
          <img  src="/images/download/first_subtitle.png" width="100%" />
        </div>
        <div class="mit_wechat_box">
          <img src="/images/download/wechat.png" width="100%" />
          <span class="wechat-down">扫二维码下载</span>
        </div>
      </div>
      <div class="first_volleyball pa transition scale_start_first">
        <img src="/images/download/volleyball.png" width="100%" />
      </div>
    </div>
  </div>
  <div class="section second ">
    <div class="download_container pr">
      <div class="download_phone_box transition delay2 pa">
        <img src="/images/download/page2_phone.png" width="100%" />
        <div class="second_icon_collection scale_start pa">
          <img src="/images/download/page2_icon_collection.png" width="100%" />
        </div>
        <div class="second_icon_community scale_start pa">
          <img src="/images/download/page2_icon_community.png" width="100%" />
        </div>
        <div class="second_icon_event scale_start pa">
          <img src="/images/download/page2_icon_event.png" width="100%" />
        </div>
        <div class="second_icon_grassroots scale_start pa">
          <img src="/images/download/page2_icon_grassroots.png" width="100%" />
        </div>
        <div class="second_icon_live scale_start pa">
          <img src="/images/download/page2_icon_live.png" width="100%" />
        </div>
        <div class="second_icon_news scale_start pa">
          <img src="/images/download/page2_icon_news.png" width="100%" />
        </div>
        <div class="second_icon_shopping scale_start pa">
          <img src="/images/download/page2_icon_shopping.png" width="100%" />
        </div>
        <div class="second_icon_sponsorship scale_start pa">
          <img src="/images/download/page2_icon_sponsorship.png" width="100%" />
        </div>
        <div class="second_icon_thefun scale_start pa">
          <img src="/images/download/page2_icon_thefun.png" width="100%" />
        </div>
        <div class="second_icon_war scale_start pa">
          <img src="/images/download/page2_icon_war.png" width="100%" />
        </div>
        <div class="second_content pa">
          <img src="/images/download/page2_content.png" width="100%" />
        </div>
      </div>
      <div class="download_text_box text_box second_section pa transition_r">
        <h3 class="mit_title">
          <img  src="/images/download/page2_title.png" width="100%" />
        </h3>
        <div class="mit_subtitle">
          <img  src="/images/download/page2_subtitle.png" width="100%" />
        </div>
        <div class="mit_wechat_box">
          <img src="/images/download/wechat.png" width="100%" />
          <span class="wechat-down">扫二维码下载</span>
        </div>
      </div>
    </div>
  </div>
  <div class="section third">
    <div class="download_container pr">
      <div class="computer_box pa">
        <div class="computer-img-box">
          <img src="/images/download/page3_computer.png" width="100%" />
        </div>
        <div class="img-manager">
          <img src="/images/download/page3_computer_content.png" alt="">
        </div>
        <div class="third_phone pa">
          <img src="/images/download/page3_phone.png" width="100%" />
          <div class="third_phone_content pa">
            <img src="/images/download/page3_phone_content.png" width="100%" />
          </div>
        </div>
      </div>
      <div class="download_text_box text_box third_section pa transition_r">
        <h3 class="mit_title">
          <img  src="/images/download/page3_title.png" width="100%" />
        </h3>
        <div class="mit_subtitle">
          <img  src="/images/download/page3_subtitle.png" width="100%" />
        </div>
        <div class="mit_wechat_box">
          <img src="/images/download/wechat.png" width="100%" />
          <span class="wechat-down">扫二维码下载</span>
        </div>
      </div>
    </div>
  </div>
  <div class="section four">
    <div class="download_container pr">
      <div class="four_box pa">
        <div class="logo-box">
          <img src="/images/download/logo.png" width="100%" />
        </div>
        <div class="four_title pa">
          <img src="/images/download/slogan.png" width="100%" />
        </div>
        <div class="four_wechat pa">
          <img src="/images/download/wechat.png" width="100%" />
          <span class="wechat-down">扫二维码下载</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  layout: 'blank',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    require.ensure([], (r) => {
      let $ = require('jquery')
      let fullpage = require('fullpage') // eslint-disable-line
      $('.download_wrap').fullpage({
        sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90'],
        // anchors: ['page1', 'page2', 'page3', 'page4'],
        'navigation': true,
        'afterRender': function () {
          $('.first').addClass('first-init')
        }
      })
    })
  },
  beforeDestroy () {
    // $.fn.fullpage.destroy('all')
  }
}
</script>
<style scoped>
@import '~styles/fullpage.css';
@import '~styles/download.css';
.wechat-down{
  width:100%;
  display: block;
  margin-top: 15px;
  text-align: center;
  color: rgb(254,254,254);
  font-size: 20px;
}
</style>