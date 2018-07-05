require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"validate": "/resources/js/jquery/jquery.validate.min.js?v=37393e7134",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'md5':'/resources/js/jquery/jquery.md5.js?v=c37a6ec65a',
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'formVeriy': '/resources/js/user/formVerify.js?v=c4692bf293'
	},
	shim: {
      'validate': {
        deps: ['jquery']
      },
      "hhlyAction": {
        deps: ['jquery','layer']
      },
      'layer': {
        deps: ['jquery']
      },
      'md5': {
        deps: ['jquery']
      },
      'formVeriy': {
        deps: ['jquery','validate','layer']
      }
    }
});
define(['jquery','formVeriy','layer','validate','hhlyAction','md5'],function($,publicForm,layer){
	var alterPass={
		time:'',
		seedAccount:'',
		step:0,
		// 账号验证，确定验证方式
		verifyAccount:function(){
			var htmlTips='<div class="form_error"></div>';
			jQuery.validator.addMethod("defineEmail", function(value, element) {
				var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				return  email.test(value)||mobileNum.test(value);
			}, htmlTips+"请您输入正确格式的手机号码或邮箱");
			$('.alfirst_step').validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					//提交表单
					$.ajax({
						url:'/member/forgetPassword/forgetPassword',
						type:'post',
						data:{
							account:$('[name="phone_number"]').val(),
							pictureValidateCode:$('[name="phone_verify"]').val()
						},
						success:function(data){
							if(data.result=='0'){
								$('.verify_way_title .account_name').text(data.nickname);
								var nextDom=$(form).addClass('hidden').next();
								if(data.phone){
									$('.phone_btn').removeClass('gray');
								}else{
									$('.phone_btn').addClass('gray');
								}
								if(data.email){
									$('.email_btn').removeClass('gray');
								}else{
									$('.email_btn').addClass('gray');
								};
								nextDom.removeClass('hidden');
								alterPass.step=1;
								$('.verity_way_btn').not('.gray').click(function(){
									var that=this;
									alterPass.jumpWay(that,data);
								});
							}else{
								layer.open({
									scrollbar: false,
									move: false,
									title:'温馨提示',
									area:['440px'],
									content:'<span class="lay_tips error"></span><span class="dialog_tips error">'+data.msg+'</span>',
									btn:['确定','取消']
								});
							}
						}
					})
				},
				rules: {
					phone_number: {
						required: true,
						defineEmail: true,
						remote:{
							url:'/member/validate/checkAccount',
							type:'get',
							data:{
								account:function(){
									return $('[name="phone_verify"]').val()
								}
							}
						}
					},
					phone_verify: {
						required: true,
						remote: {
							url: "/member/validate/checkPictureValidateCode",
							type: "get",
							data: {
								validateCode: function() {
									return $("input[name='phone_verify']").val();
								},
								type: 1
							}
						}
					},
			    },
			    messages: {
			    	phone_number: {
						required: htmlTips + "请输入正确的手机号码或邮箱",
						defineEmail: htmlTips + "请输入正确的手机号码或邮箱",
						remote: function() {
							return htmlTips + "用户不存在"
						}
					},
					phone_verify: {
						required: htmlTips + "验证码不能为空",
						remote: htmlTips + '验证码错误'
					},
			    }
			});
		},
		// 根据参数跳转到指定验证方式
		jumpWay:function(that,data){
			var nextDom=$(that).parents('.step_prev').next('.reset_wrap').find('.resetfirst_step');
			var textDom=nextDom.find('.email_wrap .reset_title.email');
			if(alterPass.step!=1){
				publicForm.noPermission();
			}
			if($(that).hasClass('email_btn')){
				if(!data.email){
					publicForm.noPermission();
				}
				textDom.find('em').text('您的邮箱：');
				textDom.find('.text').text(data.emailMosaic);
				$('.reset_email_tips').removeClass('hidden').next('.reset_phone_tips').addClass('hidden');
				alterPass.seedAccount=data.email;
			}else if($(that).hasClass('phone_btn')){
				if(!data.phone){
					publicForm.noPermission();
				}
				textDom.find('em').text('您的手机号码：');
				textDom.find('.text').text(data.phoneMosaic);
				$('.reset_phone_tips').removeClass('hidden').next('.reset_email_tips').addClass('hidden');
				alterPass.seedAccount=data.phone;
			}
			$(that).parents('.step_prev').addClass('hidden').next('.reset_wrap').removeClass('hidden').first('.reset_content').removeClass('hidden').siblings('.reset_content').addClass('hidden');
			alterPass.step=2;
		},
		// 重新选择验证方式
		resetWay:function(){
			$('.again_select').click(function(){
				var parentForm=$(this).parents('.reset_content');
				if(!parentForm.hasClass('hidden')){
					parentForm.parents('.reset_wrap').addClass('hidden').siblings('.step_prev').removeClass('hidden').find('.alsecond_step').removeClass('hidden').siblings('.step_box').addClass('.hidden');
					clearInterval(alterPass.time);
					$('.form_text .verify_img').removeClass('count_down');
					$('.resetfirst_step .reset_tips').addClass('hidden');
					$('.resetfirst_step .reset_tips>div').addClass('hidden');
					$('.resetfirst_step .verify_message').find('span.text').text('获取验证码');
					$('inoput[name="message_verify"]').removeClass('error');
					$('#message_verify-error').empty();
					$('.account_tips .number').text(59);
					alterPass.step=1;
				}
			});
		},
		// 获取验证码
		getMessage:function(){
			$('.form_text .verify_message').click(function(){
				if($(this).hasClass('count_down') || $(this).hasClass("gray")){
					return false;
				}
				var that = $(this);
				alterPass.time=publicForm.timeSet(that);
				$.ajax({
					type : "GET",
					url : "/member/validate/sendValidateCode",
					data : {
						account : alterPass.seedAccount,
						type : 4,
						extisted:true
					},
					success : function(data) {
						if (data.result != 0) {
							console.log(data.msg);
						}else{
							publicForm.messageTips(data.times);
							if(parseInt(data.times)>10){
								that.addClass('gray').removeClass('count_down');
								clearInterval(alterPass.time);
							}
							var value=alterPass.seedAccount;
							publicForm.sendEmail(value);
							$('.resetfirst_step .reset_tips').removeClass('hidden');
						}
					}
				});
			});
		},
		messageVerty:function(){
			var htmlTips='<div class="form_error"></div>';
			$('.resetfirst_step').validate({
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					//提交表单
					if(alterPass.step!=2){
						publicForm.noPermission();
					}
					$.ajax({
						url:"/member/forgetPassword/checkAccount",
						type:'post',
						data:{
							account:alterPass.seedAccount,
							validateCode:$('.resetfirst_step [name="message_verify"]').val()
						},
						success:function(data){
							if(data.result!=0){
								console.log(data.msg);
								layer.open({
									scrollbar: false,
									move: false,
									title:'温馨提示',
									area:['440px'],
									content:'<span class="lay_tips error"></span><span class="dialog_tips error">'+data.msg+'</span>',
									btn:['确定','取消']
								});
							}else{
								$(form).addClass('hidden').next().removeClass('hidden');
								$('.step_container').find('li.active').removeClass('active').next().addClass('active');
								alterPass.step=3;
							}
						}
					});
				},
				rules: {
					message_verify: {
						required: true,
						remote:{
							url:'/member/validate/checkValidateCode',
							type:'get',
							data:{
								account:function(){
									return alterPass.seedAccount
								},
								validateCode:function(){
									return $('[name="message_verify"]').val();
								},
								type:4
							}
						}
					}
			    },
			    messages: {
			    	message_verify: {
						required: htmlTips + "请输入校验码",
						remote: function() {
							return htmlTips + "校验码错误"
						}
					}
			    }
			});
		},
		// 修改密码成功失败逻辑
		setPassSuccess:function(form){
			$.ajax({
				url:'/member/forgetPassword/resetPassword',
				type:"post",
				data:{
					password:$.md5($('[name="set_password"]').val())
				},
				success:function(data){
					if(data.result=='0'){
						if(alterPass.step!=3){
							publicForm.noPermission();
						}
						$(form).addClass('hidden').next().removeClass('hidden');
						$('.step_container').find('li.active').removeClass('active').next().addClass('active');
						alterPass.step=4;
					}else{
						$(form).addClass('hidden').siblings('.complate_error').removeClass('hidden');
						$('.step_container').find('li.active').removeClass('active').next().addClass('active');
					}
				},
				error:function(data){
					console.log(data);
				}
			})
		},
		// 重新提交
		repeatCommit:function(){
			$('.complate_error .repeat_commit').click(function(){
				alterPass.step=3;
				form=$(this).parents('.complate_error').siblings('.alsecond_step').get(0);
				alterPass.setPassSuccess(form);
			})
		},
		init:function(){
			this.verifyAccount();
			this.resetWay();
			this.messageVerty();
			this.getMessage();
			this.repeatCommit();
			publicForm.passwordVerify('.reset_two_step',alterPass.setPassSuccess);
			publicForm.verifyInit();
		}
	};
	$(function(){
		alterPass.init();
	});
});

