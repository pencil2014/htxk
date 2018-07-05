var sportCommon = {
  hoverSlide: function() {
    var flag, timer1, timer2
    $(".nav_menu").hover(function () {
      if (flag) {
        clearTimeout(timer2)
      } else {
        var _this = $(this)
        timer1 = setTimeout(function() {
          _this.children(".user_slide").filter(':not(:animated)').delay(100).slideDown('fast')
          flag = true
        }, 10)
      }
    }, function () {
      if (flag) {
        var _this = $(this)
        timer2 = setTimeout(function() {
          _this.children(".user_slide").filter(':not(:animated)').delay(100).slideUp('fast')
          flag = false
        }, 10)
      } else {
        clearTimeout(timer1)
      }
    })
  },
  //请求登录信息
  login: function (){
    //请求登录信息
    $.hhly.ajax({
      url:'/common/login',
      type: 'get',
      success: function(data){
        data =data.data
        var loginUser = data['loginUser']
        var messageCount = data['messageCount']
        var html = ''
        if ($('.new-header .site-nav-sub').length > 0) {
          html = '<a href="/member/login">登录</a>'
           + '<span class="space"></span>'
           + '<span class="space"></span>'
           + '<span class="space"></span>'
           + '<a href="/member/register" class="">注册</a>'
        } else {
          html =  '<div class="login_box">'+
              ' <a href="/member/login" class="head_login">'+
              '   <span class="head_photo fl"></span>'+
              '   <span class="login_prompt">登录</span>'+
              ' </a>'+
              ' <a href="/member/register" class="head_register">注册</a>'+
              '</div>'
        }
        if(loginUser != null && loginUser != ''){
          loginUser.iconUrl = loginUser.iconUrl || '/resources/images/default_photo.jpg'
          messageCount = messageCount || '0'
          var accountHtml=''
          if(messageCount==0){
            accountHtml='<a  href="/manage/index?route=' + loginUser.authType + '&id=' + loginUser.userId + '"><div class="nav_message fl hidden"><em class="message_circle" id="user_total_message_nav">' + messageCount + '</em></div></a>'
          }else{
            accountHtml='<a  href="/manage/index?route=' + loginUser.authType + '&id=' + loginUser.userId + '"><div class="nav_message fl"><em class="message_circle" id="user_total_message_nav">' + messageCount + '</em></div></a>'
          }
          html = accountHtml+
              '<div class="nav_menu fl">'+
              ' <span class="nav_headimg goal_headimg"><img src="' + loginUser.iconUrl + '" width="100%" /></span>'+
              ' <span class="login_text"><a href="/manage/activity">' + loginUser.nickName + '</a></span>'+
              ' <div class="clear"></div>'+
              ' <ul class="user_slide"><li class="user_exit"><a class="nav_exit_btn" href="javascript:void(0)">退出</a></li></ul>'+
              '</div>'
        }
        $(".nav_r").html(html)
        $('.new-header .site-nav-sub').html(html)
        sportCommon.hoverSlide()
        $('.nav_exit_btn').click(function(event) {
          /* Act on the event */
          layer.open({
            scrollbar: false,
            move: false,
            title: msgUtil.getTxt("common_dialog_title"),
            area:['440px'],
            content:'<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">是否退出登录？</span></div>',
            btn: [ '是', '否'],
            yes: function(index, layero) {
              layer.close(index)
              window.location.href='/common/logout'
            },
          })
        })
      }
    })
  },
  roadHeader: function() {
    if($('.header-wrap-box').length>0){
      $('.header-wrap-box').load('/resources/tpl/header.html',function(){
        sportCommon.login()
      })
    }else{
      sportCommon.login()
    }
  },
  // 修改面包屑导航栏
  alterMenu: function() {
    var menuA = $('h1.mit_crumbs>a')
    if (menuA && menuA.attr('href') && menuA.attr('href').indexOf('/common/index')> -1){
      menuA.attr('href','/')
    }
    var subMenu = $('.subnav_logo').siblings('.subnav_list').find('a[href="/common/index"]');
    if (subMenu.length>0){
      subMenu.attr('href','/video')
    }
  },
  roadFooter: function() {
    if($('.framemaker_footer').length===0 && $('.footer-wrap-box').length>0){
      $('.footer-wrap-box').load('/resources/tpl/footer.html', function() {
        var code = ''
        if (location.href.indexOf('oooseed') > -1) {
            code='琼ICP备18000046号'
        } else {
          code='粤ICP备17021615号'
        }
        $('.record-number').text(code)
      })
    }
  },
  defineIndexOf:function(){
    if (!Array.prototype.indexOf){
      Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length >>> 0

        var from = Number(arguments[1]) || 0
        from = (from < 0) ? Math.ceil(from) : Math.floor(from)
        if (from < 0)
          from += len

        for (; from < len; from++) {
          if (from in this && this[from] === elt)
            return from
        }
        return -1
      }
    }
  },
  //placeholder  IE8兼容性  节点生成后调用
  placeholderCompatibility: function() {
    function placeholderSupport() {
        return 'placeholder' in document.createElement('input')
    }
    if(!placeholderSupport()){
      $('[placeholder]').focus(function() {
        var input = jQuery(this)
        if (input.val() == input.attr('placeholder')) {
          input.val('')
          input.removeClass('placeholder')
        }
        // if (input.attr("type") == "password") {
          input.siblings('.password_span').empty()
        // }
      }).blur(function() {
        var input = jQuery(this)
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
          // if (input.attr("type") == "password") {
            var passTips='<span class="password_span">'+input.attr('placeholder')+'</span>'
            if(input.siblings('.password_span').length==0){
              input.parent().append(passTips)
            }else{
              input.siblings('.password_span').empty().text(input.attr('placeholder'))
            }
            input.siblings('.password_span').click(function(){
              input.trigger('focus')
            })
          // } else {
          //  $(this).addClass('placeholder')
          //  input.val(input.attr('placeholder'))
          // }
        }
      }).blur().parents('form').submit(function() {
        jQuery(this).find('[placeholder]').each(function() {
          var input = jQuery(this)
          if (input.val() == input.attr('placeholder')) {
            input.val('')
          }
        })
      })
    }
  },
  // 自动填充最小高度
  setMinHeight:function(array,goal){
    var otherHeight=0
    for(i=0;i<array.length;i++){
      otherHeight+=parseInt($(array[i]).outerHeight())
    }
    var goalHeight=$(window).height()-otherHeight-20
    $(goal).css('min-height',goalHeight)
  },
  showRightFloat: function() {//右侧浮动
    $('.show-wx').mouseenter(function() {
      $(this).siblings('.show-wx-bg').show()
    }).mouseleave(function() {
      $(this).siblings('.show-wx-bg').hide()
    })
  },
  returnTop: function() { //返回顶部
    $(window).scroll(function() {
      var sc = $(window).scrollTop()
      if (sc > 100) {
        $(".to-top").css("display", "block")

      } else {
        $(".to-top").css("display", "none")
      }
    })
    $(".to-top").click(function() {
      var speed = 500 //滑动的速度
      $('body,html').animate({
        scrollTop: 0
      }, speed)
      return false
    })
  },
  popMsg:function(status,msg,yes,end){
    layer.open({
      scrollbar: false,
      move: false,
      area:'440px',
      title: '温馨提示',
      content: '<span class="at_span '+status+'"></span><span class="dialog_tips">'+msg+'</span>',
      btn: ['确定', '取消'],
      yes:function(index,layero){
        if (typeof yes != 'undefined') { yes() }
        layer.close(index)
      },
      end:function(index,layero){
        if (typeof end != 'undefined') { yes() }
        layer.close(index)
      }
    })
  },
  uaLocation:function(){
    /*var host = window.location.host
    if(host.indexOf('www')!=-1){
      var index=host.indexOf('.')
      var host=host.slice(index)
    }
    if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
      window.location.href = 'm'+host
    }
*/  },
  init:function(){
    this.uaLocation()
    this.placeholderCompatibility()
    this.returnTop()
    this.showRightFloat()
    this.roadHeader()
    this.roadFooter()
    this.defineIndexOf()
    this.setMinHeight(['#header','.mit_subnav','.footer-wrap'],'.set_height')
    this.alterMenu()
    /*// 禁止双击选中变蓝色
    $(document).bind("selectstart", function () { return false })*/
  }
}
$(function(){
  var _hmt = _hmt || []
  var hm = document.createElement("script")
  hm.src = "https://hm.baidu.com/hm.js?f25468e31a85e05f31fa6d32bb11aef2"
  var s = document.getElementsByTagName("script")[0] 
  s.parentNode.insertBefore(hm, s)
  sportCommon.init()
})
