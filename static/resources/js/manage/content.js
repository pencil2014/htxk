$(function() {
  var content = {
    // 根據cookie判斷是否切換，并銷毀cookie
    contentSlide: function() {
      var arr, reg = new RegExp("(^| )publish=([^;]*)(;|$)"); //正则匹配
      if (arr = document.cookie.match(reg)) {
        type = unescape(arr[2]);
        var expdate = new Date(); //初始化时间
        expdate.setTime(expdate.getTime() - 1);
        document.cookie = "publish=" + type + ";expires=" + expdate.toGMTString() + ";path=/"; //设置cookie立马过期
        if (type == 3 || type == 0) {
          $('#manage_contents .title_list li').eq(1).trigger('click');
        } else {
          $('#manage_contents .title_list li').eq(0).trigger('click');
        }
      }
    },
    init: function() {
      this.contentSlide();
    }
  }
  content.init();
});