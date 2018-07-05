require.config({
	paths:{
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"validate": "/resources/js/jquery/jquery.validate.min.js?v=37393e7134",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'formVeriy': '/resources/js/user/formVerify.js?v=c4692bf293',
		'layer':'/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'md5':'/resources/js/jquery/jquery.md5.js?v=c37a6ec65a'
	},
	shim: {
      'validate': {
        deps: ['jquery']
      },
      'layer': {
        deps: ['jquery']
      },
      "hhlyAction": {
        deps: ['jquery','layer']
      },
      'formVeriy': {
        deps: ['jquery','validate','layer']
      },
      'md5': {
        deps: ['jquery']
      },
    }
});
require(['jquery','validate','hhlyAction','formVeriy','layer','md5'],function($,validate,hhlyAction,publicForm,layer,md5){
	var register={
		type:'',
		step:0,
		account:'',
		// 注册验证
		verifyStep:function(){
			var htmlTips='<div class="form_error"></div>';
			jQuery.validator.addMethod("defineEmail", function(value, element) {
				var email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				return  email.test(value)||mobileNum.test(value);
			}, htmlTips+"请您输入正确格式的手机号码或邮箱");
			$('.prfirst_step').validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					// 校验成功回调
					if(register.step!=0){
						publicForm.noPermission();
					}
					$.ajax({
						url:'/member/register/register',
						type:'post',
						data:{
							account:$("input[name='phone_number']").val(),
							pictureValidateCode:$("input[name='phone_verify']").val(),
							validateCode:$("input[name='message_verify']").val()
						},
						success:function(data){
							if(data.result=='0'){
								$(form).addClass('hidden').next().removeClass('hidden');
								register.step=1;
								register.account=$("input[name='phone_number']").val();
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
						},
						error:function(data){
							console.log(data);
						}
					})
				},
				rules: {
			    	phone_number: {
			    		required: true,
			    		defineEmail:true,
			    		remote: {
				    	    url: "/member/validate/checkAccount",
				    	    type: "get",
				    	    data: {
				    	    	account: function() {
				    	            return $("input[name='phone_number']").val();
				    	        }
				    	    }
				     	},
				     	maxlength:50
			    	},
			    	phone_verify:{
						required: true,
						remote: {
				    	    url: "/member/validate/checkPictureValidateCode",
				    	    type: "get",
				    	    data: {
				    	    	validateCode: function() {
				    	            return $("input[name='phone_verify']").val();
				    	        },
				    	        type:2
				    	    }
				     	}
					},
					message_verify:{
						required: true,
						remote: {
				    	    url: "/member/validate/checkValidateCode",
				    	    type: "get",
				    	    data: {
				    	    	account: function() {
				    	            return $("input[name='phone_number']").val();
				    	        },
				    	        validateCode: function() {
				    	            return $("input[name='message_verify']").val();
				    	        },
				    	        type: function(){
				    	        	return register.type;
				    	        }
				    	    }
				     	}
					}
			    },
			    messages: {
			    	phone_number: {
			    		required: htmlTips+"请输入正确的手机号码或邮箱",
			    		defineEmail: htmlTips+"请输入正确的手机号码或邮箱",
			    		remote: function(){
							var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
							var value =$('input[name="phone_number"]').val();
							if(email.test(value)){
								return htmlTips+"该邮箱已注册，请直接登录"
							}else{
								return htmlTips+"该号码已占用，请直接登录"
							}
						},
			    		maxlength: function(){
							var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
							var value =$('input[name="phone_number"]').val();
							if(email.test(value)){
								return htmlTips+"邮箱账号请不要超过50个字符"
							}else{
								return htmlTips+"手机号码请不要超过50个字符"
							}
						},
			    	},
				    phone_verify:{
						required: htmlTips + "验证码不能为空",
						remote: htmlTips + '验证码错误'
					},
					message_verify: {
						required: htmlTips + "请输入校验码",
						remote: htmlTips + '校验码错误'
					}
			    }
			});
		},
		// 注册验证码获取
		getMessage:function(){
			$('.form_text ').on('click', '.verify_message', function() {
				var value=$('input[name="phone_number"]').focus().blur().val();
				var value1=$('input[name="phone_verify"]').focus().blur().val();
				var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				//手机号和验证码
				var verify = !$('input[name="phone_number"]').hasClass('error') && !$('input[name="phone_verify"]').hasClass('error');

				if((mobileNum.test(value) || email.test(value))&& verify && !$(this).hasClass("count_down") && !$(this).hasClass("gray")){
					var that = $(this);
					publicForm.timeSet(that);
					if(mobileNum.test(value)){register.type=1};
					if(email.test(value)){register.type=""};
					// 后台发送验证码
					$.ajax({
						type : "GET",
						url : "/member/validate/sendValidateCode",
						data : {
							account : value,
							type : register.type,
							validateCode: value1
						},
						success : function(data) {
							if (data.result != 0) {
								publicForm.messageTips(data.times);
								if(parseInt(data.times)>10){
									that.addClass('gray').removeClass('count_down');
									clearInterval(time);
									return false;
								}
							}else{
								publicForm.messageTips(data.times);
								if(parseInt(data.times)>10){
									that.addClass('gray').removeClass('count_down');
									clearInterval(time);
								}
								$('.verify_send_message>div').removeClass('hidden');
								if(register.type==1){
									$('.verify_send_message>div').find('.verify_text_tips').empty().text('验证码已发送到你的手机，15分钟内输入有效。');
									$('.verify_send_message>div').find('.email_tips').addClass('hidden').siblings('.phone_tips').removeClass('hidden');

								}else{
									$('.verify_send_message>div').find('.verify_text_tips').empty().text('验证码已发送到你的邮箱，30分钟内输入有效。');
									$('.email_login').removeClass('hidden');
									publicForm.sendEmail(value);
									$('.verify_send_message>div').find('.phone_tips').addClass('hidden').siblings('.email_tips').removeClass('hidden');
								}
							}
						}
					});
				}
			});
		},
		// 绑定手机获取验证码刷新
		bindGetMessage:function(){
			$('.form_text ').on('click', '.bind_message', function() {
				if($(this).hasClass('count_down')){
					return false;
				}
				var value=$('input[name="bind_phone_number"]').focus().blur().val();
				var value1=$('input[name="bind_phone_verify"]').focus().blur().val();
				//手机号和验证码
				var verify = !$('input[name="bind_phone_number"]').hasClass('error') && !$('input[name="bind_phone_verify"]').hasClass('error');
				if(verify && !$(this).hasClass("count_down") && !$(this).hasClass("gray")){
					var that = $(this);
					var timer=publicForm.timeSet(that);
					// 后台发送验证码
					$.ajax({
						type : "GET",
						url : "/member/validate/sendValidateCode",
						data : {
							account : value,
							type : 2
						},
						success : function(data) {
							if (data.result != 0) {
								publicForm.messageTips(data.times);
								if(parseInt(data.times)>10){
									that.addClass('gray').removeClass('count_down');
									clearInterval(timer);
									return false;
								}
							}else{
								publicForm.messageTips(data.times);
								if(parseInt(data.times)>10){
									that.addClass('gray').removeClass('count_down');
									clearInterval(timer);
								}

								$('.bind_phone .verify_send_message>div').removeClass('hidden');
								$('.bind_phone .verify_send_message').find('.verify_text_tips').removeClass('hidden').empty().text('验证码已发送到你的手机，30分钟内输入有效。');
								$('.bind_phone .verify_send_message').find('.nickname_tips.phone_tips').removeClass('hidden');
							}
						}
					});
				}
			});
		},
		// 弹出协议
		agreeDialog:function(){
			$('.register_agree').click(function(){
				layer.open({
					scrollbar: false,
					move: false,
					area:['800px','640px'],
					type: 2,
					content: ['/resources/html/agreement/register.html']
				});
			});
		},
		// 注册保存数据逻辑处理
		registerResult:function(form){
			if(register.step!=1){
				publicForm.noPermission();
			}
			$.ajax({
				url:'/member/register/setPasswordAndNickname',
				type:'post',
				data:{
					password:$.md5($('[name="set_password"]').val()),
					nickname:$('[name="nick_name"]').val()
				},
				success:function(data){
					if(data.result=='0'){
						if(parseInt(register.type)!=1){
							register.bindPhone(form,data);
						}else{
							register.resultSuccess(form);
						}
					}else if(data.result=='2'){
						if(parseInt(register.type)==1){
							$(form).addClass('hidden').siblings('.complate_error').removeClass('hidden');
						}
						layer.open({
							scrollbar: false,
							move: false,
							title:'温馨提示',
							area:['440px'],
							content:'<span class="lay_tips error"></span><span class="dialog_tips error">'+data.msg+'</span>',
							btn:['确定','取消']
						});
					}
				},
				error:function(data){
					console.log(data.msg);
				}
			})
		},
		// 提交成功数据处理
		resultSuccess:function(form){
			$(form).addClass('hidden').siblings('.register_success').find('.complate_tips .tips_content').text(register.account);
			$(form).addClass('hidden').siblings('.register_success').removeClass('hidden');
			var num=5;
			register.step=3;
			var timer=setInterval(function(){
				if(num>0){
					num=num-1;
				}else{
					window.location.href='/';
				}
				$('.complate_box .href_tips .second_account').text(num);
			},1000);
		},
		// 跳转到绑定手机号页面
		bindPhone:function(form){
			$('.bind_phone .verify_send_message>div').addClass('hidden');
			$(form).addClass('hidden').siblings('.bind_phone').removeClass('hidden');
			$('.bind_phone .refresh_verity').trigger('click');
			register.step=2;
		},
		// 跳过
		jumpBind:function(){
			$('.jump_step').click(function(){
				if(register.step!=2){
					publicForm.noPermission();
					return false;
				}
				var form=$(this).parents('.bind_phone').addClass('hidden').siblings('.prsecond_step').get(0);
				register.resultSuccess(form);
			});
		},
		// 绑定手机号验证
		bindVerify:function(){
			var htmlTips='<div class="form_error"></div>';
			jQuery.validator.addMethod("definePhone", function(value, element) {
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				return  mobileNum.test(value);
			}, htmlTips+"请您输入正确格式的手机号码");
			$('.bind_phone').validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				onsubmit:true,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					// 校验成功回调
					if(register.step!=2){
						publicForm.noPermission();
						return false;
					}
					$.ajax({
						url:'/member/register/bindPhone',
						type:'post',
						data:{
							phone:$("input[name='bind_phone_number']").val(),
							pictureValidateCode:$("input[name='bind_phone_verify']").val(),
							validateCode:$("input[name='bind_message_verify']").val()
						},
						success:function(data){
							if(data.result=='0'){
								register.resultSuccess(form);
								register.step=3;
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
						},
						error:function(data){
							console.log(data);
						}
					})
				},
				rules: {
			    	bind_phone_number: {
			    		required: true,
			    		definePhone:true,
			    		remote: {
				    	    url: "/member/validate/checkAccount",
				    	    type: "get",
				    	    data: {
				    	    	account: function() {
				    	            return $("input[name='bind_phone_number']").val();
				    	        }
				    	    }
				     	},
				     	maxlength:11
			    	},
			    	bind_phone_verify:{
						required: true,
						remote: {
				    	    url: "/member/validate/checkPictureValidateCode",
				    	    type: "get",
				    	    data: {
				    	    	validateCode: function() {
				    	            return $("input[name='bind_phone_verify']").val();
				    	        },
				    	        type:2
				    	    }
				     	}
					},
					bind_message_verify:{
						required: true,
						remote: {
				    	    url: "/member/validate/checkValidateCode",
				    	    type: "get",
				    	    data: {
				    	    	account: function() {
				    	            return $("input[name='bind_phone_number']").val();
				    	        },
				    	        validateCode: function() {
				    	            return $("input[name='bind_message_verify']").val();
				    	        },
				    	        type: 2
				    	    }
				     	}
					}
			    },
			    messages: {
			    	bind_phone_number: {
			    		required: htmlTips+"请输入正确的手机号码",
			    		defineEmail: htmlTips+"请输入正确的手机号码",
			    		remote:htmlTips+'手机号码已被绑定，请直接登录' ,
			    		maxlength: htmlTips+'手机号码为11位数字',
			    	},
				    bind_phone_verify:{
						required: htmlTips + "验证码不能为空",
						remote: htmlTips + '验证码错误'
					},
					bind_message_verify: {
						required: htmlTips + "请输入校验码",
						remote: htmlTips + '校验码错误'
					}
			    }
			});
		},
		// 重新提交
		repeatCommit:function(){
			$('.complate_error .repeat_commit').click(function(){
				register.step=1;
				form=$(this).parents('.complate_error').siblings('.prsecond_step').get(0);
				register.registerResult(form);
			})
		},
		// 监听input值改变，则验证码去掉不可点击状态
		watchInput:function(){
			$('input[name="phone_number"],input[name="bind_phone_number"]').change(function(){
				$('.verify_img ').removeClass('gray');
			});
		},
		inputInit:function(){
			$.hhly.inputbox({
				wrap:'div[name="auto_login"]'
			});
			$('div[name="auto_login"]').click(function(){
				if($(this).hasClass('cb_active')){
					$('.prfirst_step .form_nextbtn input').attr('disabled',false).removeClass('gray');
				}else{
					$('.prfirst_step .form_nextbtn input').attr('disabled',true).addClass('gray');
				}
			})

		},
		init:function(){
			this.getMessage();
			this.bindGetMessage();
			this.verifyStep();
			this.agreeDialog();
			this.repeatCommit();
			this.bindVerify();
			this.jumpBind();
			this.inputInit();
			this.watchInput();
			publicForm.passwordVerify('.prsecond_step',register.registerResult);
			publicForm.verifyInit();
		}
	};
	$(function(){
		register.init();
	})
});