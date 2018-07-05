$(function() {

  footerRightFloat = {
    showRightFloat: function() {//右侧浮动
      $('.show-wx').mouseenter(function() {
        $(this).siblings('.show-wx-bg').show();
      }).mouseleave(function() {
        $(this).siblings('.show-wx-bg').hide();
      });
    },
    returnTop: function() {//返回顶部
      $(window).scroll(function() {
        var sc = $(window).scrollTop();
        if (sc > 100) {
          $(".to-top").css("display", "block");

        } else {
          $(".to-top").css("display", "none");
        }
      });
      $(".to-top").click(function() {
        var speed = 500;//滑动的速度
        $('body,html').animate({scrollTop: 0}, speed);
        return false;
      });
    },
    roadHeader:function(){
      $('.header-wrap-box').load('/resources/tpl/header.html');
    },
    roadFooter:function(){
      $('.footer-wrap-box').load('/resources/tpl/footer.html',function(){

        $.get('/resources/json/footer.json',{},function(data){
          var _html=template('footer-wrap-template',data);
          $('.footer-wrap-box').html(_html);
        })
      });
    },
    roadFloat:function(){
      $('.float-wrap-box').load('/resources/tpl/float.html',function(){
        footerRightFloat.showRightFloat();
        footerRightFloat.returnTop();
      });
    }
  };
  // footerRightFloat.roadHeader();
  // footerRightFloat.roadFooter();
  footerRightFloat.roadFloat();
})