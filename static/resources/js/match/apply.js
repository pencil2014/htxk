require.config({
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "validate": "/resources/js/jquery/jquery.validate.min.js?v=37393e7134",
    "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
    "ganged": "/resources/js/jquery/jquery.ganged.js?v=6f8a2b7f9a",
    'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
    'common':'/resources/js/common/common.js?v=f486ed9e43',
    'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
    'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15'
  },
  shim: {
    'layer': {
      deps: ['jquery']
    },
    "hhlyAction": {
      deps: ['jquery', 'layer']
    },
    'ganged': {
      deps: ['jquery']
    },
    'common':{
      deps: ['jquery','commonUtil','hhlyAction']
    }
  }
});
require(['jquery', 'hhlyAction', 'layer','ganged','validate','common','i18n'], function($, hhlyAction, layer) {
  var apply = {
    applyVerity:function(){
      var htmlTips='<div class="form_error"></div>';
      jQuery.validator.addMethod("definePhone", function(value, element) {
        var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return  mobileNum.test(value);
      }, htmlTips+"请您输入正确的手机号码");
      jQuery.validator.addMethod("defineIDcard", function(value, element) {
        var idCard =/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|201[0-6])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/;
        return  idCard.test(value);
      }, htmlTips+"请您输入正确的身份证号码");
      $('.apply_form').validate({
        //errorClass: "label.error", //默认为错误的样式类为：error
        focusInvalid: true, //当为false时，验证无效时，没有焦点响应
        onfocusout: function(element) {
          $(element).valid();
        },
        onkeyup: false,
        submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
          // 校验成功回调
          var data={
            'matchId':$('#matchId').val(),
            'provinceId':$('input[name="province"]').val(),
            'cityId':$('input[name="city"]').val(),
            'linkName':$('input[name="contact_name"]').val(),
            'linkPhone':$('input[name="contact_way"]').val(),
            'linkNo':$('input[name="id_card"]').val(),
            'sex':$('div[name="sex"].rb_active input').val(),
            'otherLinkName':$('input[name="urgency_contact_name"]').val(),
            'otherLinkPhone':$('input[name="urgency_contact_phone"]').val(),
            'remarks':$('textarea.remark').val(),
            'paramToken':$('#paramToken').val()
          };
          apply.joinSave(form,data);
        },
        rules: {
          province: {
            required: true,
            range:[1,10000000]
          },
          city: {
            required: true,
            range:[1,10000000]
          },
          contact_name: {
            required: true,
          },
          contact_verity:{
            required: true,
            remote: {
                  url: "/match/validate/code",
                  type: "get",
                  data: {
                      phone: function() {
                          return $("input[name='contact_way']").val();
                      },
                      validateCode: function() {
                          return $("input[name='contact_verity']").val();
                      }
                  }
              }
          },
          contact_way:{
            required: true,
            definePhone:true
          },
          id_card: {
            required: true,
            defineIDcard:true
          },
          urgency_contact_name:{
            required: true,
          },
          urgency_contact_phone: {
            required: true,
            definePhone:true
          },
        },
        messages: {
          province: {
            required: htmlTips + "请选择省份",
            range: htmlTips + "请选择省份",
          },
          city: {
            required: htmlTips + "请选择城市",
            range: htmlTips + "请选择城市",
          },
          contact_name: {
            required: htmlTips + "联系人不能为空",
          },
          contact_way:{
           required: htmlTips + "联系方式不能为空",
          },
          contact_verity:{
            required: htmlTips + "验证码不能为空",
            remote: htmlTips + '验证码错误'
          },
           id_card: {
            required: htmlTips + "身份证号不能为空",
          },
          urgency_contact_name:{
            required: htmlTips + "紧急联系人不能为空",
          },
          urgency_contact_phone: {
            required: htmlTips + "紧急联系人手机不能为空",
          },
        }
      });
    },
    // 必读协议
    agreementRead:function(){
      $('div[name="auto_check"]').click(function(){
        if($(this).hasClass('cb_active')){
          $('.apply_submit').attr('disabled',false).removeClass('gray');
        }else{
          $('.apply_submit').attr('disabled',true).addClass('gray');
        }
      })
    },
    // 协议弹框
    agreeDialog:function(){
      $('.apply_agree').click(function(){
        layer.open({
          scrollbar: false,
          move: false,
          area:['800px','640px'],
          type: 2,
          content: ['/resources/html/agreement/apply.html']
        });
      });
    },
    dataInit:function(){
      $.getJSON('/resources/json/area.json', function(data) {
        $('.location_control').ganged({'data':data, 'width': 150, 'height': 28});
      });
      $.hhly.inputbox({
        'wrap':'div[name="sex"]',
      });
      $.hhly.inputbox({
        'wrap':'div[name="auto_check"]',
      });
      $.hhly.textAccount({
        wrap:'.input_account',
        input:'textarea',
        max:200
      });
    },
    joinSave:function(form,data){
      $.hhly.ajax({
        url:'/match/save',
        type:'post',
        data:data,
        success:function(data){
          if(!data.result){
            data = JSON.parse(data);
          }
          if(data.result=='0'){
            layer.open({
              scrollbar: false,
              move: false,
              title: '温馨提示',
              area:'440px',
              time:3000,
              content: '<div class="dialog_login_box text"><span class="at_span success"></span><span class="dialog_tips">'+data.msg+'</span></div>',
              btn: ['确定', '取消'],
              end:function(){
                window.location.href='/match/detail?matchId='+$('#matchId').val()
              }
            });
          }else{
            layer.open({
              scrollbar: false,
              move: false,
              title: '温馨提示',
              area:'440px',
              content: '<div class="dialog_login_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>',
              btn: ['确定', '取消'],
            });
          }
        }

      })
    },
    // 获取验证码
    getMessage:function(){
      $('.get_verity').click(function(){
        var value=$("input[name='contact_way']").focus().blur().val();
        var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var judge=$("input[name='contact_way']").hasClass('error');
        var that=$(this);
        if(mobileNum.test(value) && !judge && !$('.get_verity').hasClass('count_down')){
          that.addClass('count_down');
          var number = that.find('.number');
          var totalNumber = 59;
          var time = setInterval(function() {
            totalNumber = totalNumber - 1;
            if (totalNumber == 0) {
              totalNumber = 59;
              that.removeClass('count_down');
              that.find('span.text').text('重新获取验证码');
              clearInterval(time);
            }
            number.text(totalNumber);
          }, 1000);
          $.ajax({
            type : "GET",
            url : "/match/send/code",
            data : {
              matchId : $('#matchId').val(),
              phone : $("input[name='contact_way']").val()
            },
            success : function(data) {
              if (data.result != 0) {

              }else{
                $('.phone_tips').removeClass('hidden');
              }
            }
          });

        }
      });
    },
    init:function(){
      this.dataInit();
      this.applyVerity();
      this.agreementRead();
      this.getMessage();
      this.agreeDialog();
    }
  }
  apply.init();


});